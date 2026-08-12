import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * MED-4: Sanitize profile fields before injecting into LLM system prompt.
 * Strips newlines, carriage returns, null bytes, and zero-width characters
 * that could be used for indirect prompt injection.
 * Wraps value in [brackets] to clearly demarcate data boundaries from instructions.
 */
function sanitizeField(value: string | null | undefined, fallback = "Not provided"): string {
  if (value == null || String(value).trim() === "") return fallback;
  return (
    "[" +
    String(value)
      .replace(/[\r\n\u0000\u200b\u200c\u200d\ufeff]/g, " ") // strip injection chars
      .replace(/\s+/g, " ")                                   // collapse whitespace
      .trim()
      .slice(0, 200)                                          // hard cap per field
    + "]"
  );
}

// ── Detect insurance type from message ───────────────────────────────────────
function detectInsuranceType(message: string): string | null {
  if (/car|vehicle|auto|bike|motor|two.?wheel/i.test(message)) return "vehicle";
  if (/health|medical|hospital|illness|disease|mediclaim/i.test(message))
    return "health";
  if (/term|life insurance|death benefit|mortality/i.test(message))
    return "term";
  if (/travel|trip|abroad|international|flight/i.test(message)) return "travel";
  if (/home|property|house/i.test(message)) return "home";
  return null;
}

// ── Strip all JSON/code blocks from text ─────────────────────────────────────
function stripJsonBlocks(text: string): string {
  return text
    .replace(/```(?:json)?\s*[\s\S]*?```/gi, "") // fenced code blocks
    .replace(/\{\s*"recommendations"\s*:\s*\[[\s\S]*?\]\s*\}/g, "") // raw JSON objects
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── Extract recommendations from raw Gemini response ─────────────────────────
function extractRecommendations(raw: string): any[] | null {
  // Try fenced ```json block first
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    try {
      const parsed = JSON.parse(fencedMatch[1].trim());
      if (parsed.recommendations) return parsed.recommendations;
    } catch {}
  }

  // Try raw JSON object
  const rawMatch = raw.match(
    /\{\s*"recommendations"\s*:\s*(\[[\s\S]*?\])\s*\}/,
  );
  if (rawMatch) {
    try {
      return JSON.parse(rawMatch[1]);
    } catch {}
  }

  // Try finding just the array
  const arrayMatch = raw.match(/"recommendations"\s*:\s*(\[[\s\S]*?\])/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[1]);
    } catch {}
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting — Max 30 chat messages per 10 minutes per user
    const rateCheck = await checkRateLimit(`chat_${user.id}`, { limit: 30, windowMs: 10 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. You can send up to 30 messages per 10 minutes. Please wait before asking OREVA again.",
          retryAfterMs: rateCheck.resetMs,
        },
        {
          status: 429,
          headers: { "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString() },
        }
      );
    }

    const body = await request.json();
    const rawMessage = typeof body?.message === "string" ? body.message : "";
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId : undefined;
    const rawHistory = Array.isArray(body?.history) ? body.history : [];

    // Clamp message input (max 2,000 chars) — prevents oversized prompt injection
    const message = rawMessage.trim().slice(0, 2000);
    if (!message) {
      return NextResponse.json({ error: "Message content cannot be empty." }, { status: 400 });
    }

    // Sanitize conversation history
    const history = rawHistory
      .filter((h: any) => h && typeof h.content === "string" && h.content.trim().length > 0)
      .slice(-8)
      .map((h: any) => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: String(h.content).trim().slice(0, 2000) }],
      }));

    // ── Fetch user profile ────────────────────────────────────────
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: policies } = await supabase
      .from("policies")
      .select(`*, policy_analyses(*)`)
      .eq("user_id", user.id)
      .eq("status", "analyzed")
      .limit(5);

    // ── Build context ─────────────────────────────────────────────
    const userContext = profile
      ? `
USER PROFILE:
- Name: ${sanitizeField(profile.full_name)}
- Age: ${profile.age ?? "Not provided"}
- Gender: ${sanitizeField(profile.gender)}
- Occupation: ${sanitizeField(profile.occupation)}
- Annual Income: ₹${profile.annual_income ? (profile.annual_income / 100000).toFixed(1) + " Lakh" : "Not provided"}
- Health Conditions: ${sanitizeField((profile.health_conditions ?? []).join(", "), "None")}
- Existing Policies: ${sanitizeField((profile.existing_policies ?? []).join(", "), "None")}
- Risk Appetite: ${sanitizeField(profile.risk_appetite, "Medium")}
- Preferred Language: ${sanitizeField(profile.preferred_language, "English")}
`
      : "User profile not complete.";

    const policiesContext =
      policies && policies.length > 0
        ? `
USER'S EXISTING POLICIES:
${policies
  .map((p) => {
    const a = (p as any).policy_analyses?.[0];
    const name = sanitizeField(a?.policy_name ?? p.file_name);
    const type = sanitizeField(a?.policy_type, "unknown");
    const gaps = sanitizeField((a?.coverage_gaps ?? []).join(", "), "unknown");
    return `- ${name}: ${type}, ₹${((a?.sum_insured ?? 0) / 100000).toFixed(1)}L, Gaps: ${gaps}`;
  })
  .join("\n")}
`
        : "No existing policies uploaded yet.";

    // ── Intent detection ──────────────────────────────────────────
    const wantsRecommendations =
      /recommend|suggest|best|which policy|top.*(policy|plan|insurance)|should i (buy|get|take)/i.test(
        message,
      );

    const detectedType = detectInsuranceType(message);

    // ML only makes sense for health/term — skip for vehicle/travel/home
    const mlApplicable =
      wantsRecommendations &&
      (!detectedType || ["health", "term"].includes(detectedType));

    // ── Call ML engine if applicable ──────────────────────────────
    let mlRecommendations = null;
    if (mlApplicable) {
      try {
        // LOW-3 fix: Call ML service directly via ML_SERVICE_URL instead of routing
        // through NEXT_PUBLIC_APP_URL (which is SSRF-adjacent if misconfigured).
        const mlServiceUrl = process.env.ML_SERVICE_URL ?? "http://localhost:5001";
        const mlProfile = {
          age: 30,             // Minimal profile for intent-based chat recommendations
          sex: "male",
          bmi: 25.0,
          children: 0,
          smoker: false,
          region: "north",
          annual_income: 300000,
          health_conditions: [],
          exercise_frequency: "Occasionally",
        };
        const mlResponse = await fetch(`${mlServiceUrl}/recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // CRIT-1: Send internal secret to authenticate with Flask ML service
            "X-Internal-Secret": process.env.ML_INTERNAL_SECRET ?? "",
          },
          body: JSON.stringify({ profile: mlProfile, top_n: 5 }),
          signal: AbortSignal.timeout(8000),
        });
        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          mlRecommendations = mlData.recommendations ?? null;
        }
      } catch (mlErr) {
        console.warn("ML recommendation call failed (non-fatal):", mlErr);
      }
    }

    // ── Type-specific recommendation rules ────────────────────────
    const typeRules: Record<string, string> = {
      vehicle: `
STRICT RULE — VEHICLE INSURANCE ONLY:
- Recommend ONLY car/bike/vehicle insurance. NO health, life, or term policies.
- Types to include: Third-Party Liability, Comprehensive, Zero Depreciation Add-on, Engine Protection, Roadside Assistance
- Real insurers: Bajaj Allianz, HDFC Ergo, ICICI Lombard, New India Assurance, Tata AIG, United India Insurance, Reliance General
- sum_insured field should say "IDV: ₹X Lakh" (Insured Declared Value) for vehicle policies
- policy_type must be "vehicle" for all 5 recommendations`,

      health: `
HEALTH INSURANCE RULES:
- Recommend health/mediclaim/family floater plans
- Real insurers: Star Health, Niva Bupa, HDFC Ergo, Care Health, Aditya Birla Health, ICICI Lombard, Bajaj Allianz
- Consider user's age, family size, and pre-existing conditions`,

      term: `
TERM INSURANCE RULES:
- Recommend only term life insurance plans
- Real insurers: LIC, HDFC Life, ICICI Prudential, Max Life, Tata AIA, SBI Life, Bajaj Allianz Life
- sum_insured should be "₹X Crore" for term plans`,

      travel: `
TRAVEL INSURANCE RULES:
- Recommend only travel insurance policies
- Include: international travel, domestic travel, student travel
- Real insurers: Bajaj Allianz, HDFC Ergo, Tata AIG, ICICI Lombard, New India Assurance`,

      home: `
HOME INSURANCE RULES:
- Recommend only home/property insurance
- Real insurers: Bajaj Allianz, HDFC Ergo, New India Assurance, United India, Reliance General`,
    };

    const recommendationBlock = wantsRecommendations
      ? `

IMPORTANT — RECOMMENDATION REQUIRED:
The user wants recommendations for: ${detectedType ? `**${detectedType.toUpperCase()} INSURANCE**` : "insurance (general)"}

${detectedType && typeRules[detectedType] ? typeRules[detectedType] : ""}

You MUST end your response with EXACTLY this JSON format inside a \`\`\`json code block.
The JSON block must be the absolute LAST thing — no text after it.
Provide ALL 5 recommendations fully — do not use "..." placeholders:

\`\`\`json
{
  "recommendations": [
    {
      "rank": 1,
      "policy_name": "Full Policy Name Here",
      "insurer": "Insurer Name",
      "policy_type": "${detectedType ?? "health"}",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "why_recommended": "Specific reason for THIS user mentioning their age/income/needs",
      "match_score": 95
    },
    {
      "rank": 2,
      "policy_name": "Full Policy Name Here",
      "insurer": "Insurer Name",
      "policy_type": "${detectedType ?? "health"}",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "why_recommended": "Specific reason for THIS user",
      "match_score": 90
    },
    {
      "rank": 3,
      "policy_name": "Full Policy Name Here",
      "insurer": "Insurer Name",
      "policy_type": "${detectedType ?? "health"}",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "why_recommended": "Specific reason for THIS user",
      "match_score": 85
    },
    {
      "rank": 4,
      "policy_name": "Full Policy Name Here",
      "insurer": "Insurer Name",
      "policy_type": "${detectedType ?? "health"}",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "why_recommended": "Specific reason for THIS user",
      "match_score": 80
    },
    {
      "rank": 5,
      "policy_name": "Full Policy Name Here",
      "insurer": "Insurer Name",
      "policy_type": "${detectedType ?? "health"}",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "why_recommended": "Specific reason for THIS user",
      "match_score": 75
    }
  ]
}
\`\`\`
`
      : "";

    // ── System prompt ─────────────────────────────────────────────
    const systemPrompt = `
You are OREVA, a warm and expert Indian insurance advisor chatbot for Suraksha AI, helping Indian families.

${userContext}
${policiesContext}

YOUR PERSONALITY:
- Warm, friendly, professional
- Simple language — no insurance jargon
- Address user by first name when known
- Empathetic — people find insurance confusing
- LANGUAGE RULE: User's preferred language is "${profile?.preferred_language ?? "english"}".
  * If "english": respond ONLY in English. Do not mix Hindi words at all.
  * If "hindi": respond MOSTLY in Hindi with simple English terms for insurance words.
  * If "hinglish": mix Hindi and English naturally ("bilkul", "theek hai", "zaroor").
  * Never mix languages unless the user's preference is "hinglish".

YOUR CAPABILITIES:
1. Explain any insurance policy in simple Hindi or English
2. Identify coverage gaps in existing policies
3. Recommend top 5 policies tailored to the user
4. Compare insurance products
5. Guide on claim filing

RESPONSE FORMAT:
- Conversational text first (3-6 sentences)
- Use bullet points for lists
- ${wantsRecommendations ? "END with the JSON block — it will be rendered as beautiful cards, not shown as text" : "No JSON needed for this response"}
${recommendationBlock}`;

    // ── Gemini chat ───────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [
            {
              text: `Namaste! I'm OREVA, your personal Suraksha AI insurance advisor. I'm here to help you understand your policies, find coverage gaps, and recommend the best insurance plans. How can I help you today?`,
            },
          ],
        },
        ...history,
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 3000,
      },
    });

    const result = await chat.sendMessage(message);
    const rawResponse = result.response.text();

    // ── Extract & strip recommendations ───────────────────────────
    const geminiRecommendations = extractRecommendations(rawResponse);
    const cleanResponse = stripJsonBlocks(rawResponse);

    // ── Final recommendations: prefer ML for health/term, else Gemini
    const finalRecommendations =
      mlApplicable && mlRecommendations
        ? mlRecommendations
        : geminiRecommendations;

    // ── Save to DB ────────────────────────────────────────────────
    if (finalRecommendations && sessionId) {
      await supabase.from("policy_recommendations").insert({
        user_id: user.id,
        session_id: sessionId,
        recommendations: finalRecommendations,
        user_requirements: message,
      });
    }

    return NextResponse.json({
      response: cleanResponse,
      recommendations: finalRecommendations,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chat service encountered an error. Please try again." },
      { status: 500 },
    );
  }
}