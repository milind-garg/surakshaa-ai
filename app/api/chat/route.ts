import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId, history } = await request.json();

    // ── Fetch user profile for personalization ───────────────────
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    // ── Fetch user's existing policies ───────────────────────────
    const { data: policies } = await supabase
      .from("policies")
      .select(`*, policy_analyses(*)`)
      .eq("user_id", user.id)
      .eq("status", "analyzed")
      .limit(5);

    // ── Build rich user context ───────────────────────────────────
    const userContext = profile ? `
USER PROFILE:
- Name: ${profile.full_name ?? "Not provided"}
- Age: ${profile.age ?? "Not provided"}
- Gender: ${profile.gender ?? "Not provided"}
- Occupation: ${profile.occupation ?? "Not provided"}
- Annual Income: ₹${profile.annual_income ? (profile.annual_income / 100000).toFixed(1) + " Lakh" : "Not provided"}
- Family Size: ${profile.family_size ?? "Not provided"} members
- Health Conditions: ${profile.health_conditions?.join(", ") || "None"}
- Existing Policies: ${profile.existing_policies?.join(", ") || "None"}
- Risk Appetite: ${profile.risk_appetite ?? "Medium"}
- Preferred Language: ${profile.preferred_language ?? "English"}
` : "User profile not complete.";

    const policiesContext =
      policies && policies.length > 0
        ? `
USER'S EXISTING POLICIES:
${policies
  .map((p) => {
    const a = (p as any).policy_analyses?.[0];
    return `- ${a?.policy_name ?? p.file_name}: ${a?.policy_type ?? "unknown type"}, ₹${((a?.sum_insured ?? 0) / 100000).toFixed(1)}L cover, Gaps: ${a?.coverage_gaps?.join(", ") ?? "unknown"}`;
  })
  .join("\n")}
`
        : "No existing policies uploaded yet.";

    // ── Detect if user wants recommendations ─────────────────────
    const wantsRecommendations =
      /recommend|suggest|best|policy|plan|cover|insurance|buy|need|suitable|top/i.test(
        message
      );

    // ── Build the system prompt ───────────────────────────────────
    const systemPrompt = `
You are Suraksha AI, a friendly and expert Indian insurance advisor chatbot. You help Indian families understand, compare, and choose the right insurance policies.

${userContext}
${policiesContext}

YOUR PERSONALITY:
- Warm, friendly, and professional
- Use simple language — avoid insurance jargon
- Mix Hindi words naturally when helpful (like "Namaste", "bilkul", "theek hai")
- Address the user by their first name when known
- Be empathetic — insurance is confusing and people are often worried

YOUR CAPABILITIES:
1. Answer questions about insurance policies in simple language
2. Explain what coverage means in real-life scenarios
3. Identify gaps in existing coverage
4. Recommend top 5 policies based on user's profile and needs
5. Compare different insurance products
6. Guide users on claim filing

RECOMMENDATION RULES (when asked for recommendations):
- Always recommend exactly 5 policies
- Base recommendations on the user's age, income, family size, health, and existing coverage
- Include a mix of types if profile is incomplete (health + life + term)
- Reference real Indian insurance products (LIC, HDFC, ICICI, SBI, Max, Bajaj, Tata, Star Health, etc.)
- Always explain WHY each policy is recommended for THIS specific user

RESPONSE FORMAT:
- Keep responses concise (3-5 sentences for general answers)
- Use bullet points for lists
- For recommendations, ALWAYS end your text response with the JSON block
- If the user writes in Hindi, respond partially in Hindi

${wantsRecommendations ? `
IMPORTANT: The user seems to want recommendations. After your conversational response, include a JSON block with exactly this format:

\`\`\`json
{
  "recommendations": [
    {
      "rank": 1,
      "policy_name": "Policy Name",
      "insurer": "Insurer Name",
      "policy_type": "health/life/term/vehicle",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh - ₹XX Lakh",
      "key_features": ["Feature 1", "Feature 2", "Feature 3"],
      "why_recommended": "Specific reason based on this user's profile",
      "match_score": 95
    }
  ]
}
\`\`\`
` : ""}
`;

    // ── Build chat history for Gemini ────────────────────────────
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
              text: `Namaste! I'm Suraksha AI, your personal insurance advisor. I'm here to help you understand your policies, find coverage gaps, and recommend the best insurance plans for your family. How can I help you today?`,
            },
          ],
        },
        ...history.slice(-8).map((h: { role: string; content: string }) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        })),
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(message);
    const rawResponse = result.response.text();

    // ── Extract recommendations JSON if present ───────────────────
    let recommendations = null;
    let cleanResponse = rawResponse;

    const jsonMatch = rawResponse.match(/```json\n?([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        recommendations = parsed.recommendations;
        // Remove JSON block from displayed text
        cleanResponse = rawResponse
          .replace(/```json\n?[\s\S]*?```/g, "")
          .trim();
      } catch {
        // JSON parse failed — show full response
      }
    }

    // ── Save recommendations to DB if present ────────────────────
    if (recommendations && sessionId) {
      await supabase.from("policy_recommendations").insert({
        user_id: user.id,
        session_id: sessionId,
        recommendations,
        user_requirements: message,
      });
    }

    return NextResponse.json({
      response: cleanResponse,
      recommendations,
    });

  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Chat failed", details: String(err) },
      { status: 500 }
    );
  }
}