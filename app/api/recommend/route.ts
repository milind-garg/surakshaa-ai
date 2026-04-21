import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? "http://localhost:5001";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requirements, sessionId } = body;

    // ── Fetch user profile from DB ───────────────────────────
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: familyMembers } = await supabase
      .from("family_members")
      .select("*")
      .eq("user_id", user.id);

    // ── Build ML profile ─────────────────────────────────────
    const totalChildren =
      familyMembers?.filter((m) => m.relation === "child").length ?? 0;

    const hasConditions =
      (profile?.health_conditions ?? []).length > 0 ||
      familyMembers?.some((m) => (m.health_conditions ?? []).length > 0);

    const isSmoker = requirements?.toLowerCase().includes("smok") ?? false;

    const mlProfile = {
      age: profile?.age ?? 30,
      sex: profile?.gender ?? "male",
      bmi: 25.0, // default; extend profile form to capture BMI later
      children: totalChildren,
      smoker: isSmoker,
      region: "north",
      annual_income: profile?.annual_income ?? 300000,
      health_conditions: profile?.health_conditions ?? [],
    };

    // ── Call ML microservice ──────────────────────────────────
    let mlRecommendations = [];
    let mlError = null;

    try {
      const mlResponse = await fetch(`${ML_SERVICE_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: mlProfile, top_n: 5 }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (mlResponse.ok) {
        const mlData = await mlResponse.json();
        mlRecommendations = mlData.recommendations ?? [];
      } else {
        mlError = "ML service returned error";
      }
    } catch (fetchErr) {
      mlError = "ML service unavailable";
      console.warn("ML service error:", fetchErr);
    }

    // ── Use Gemini to enrich recommendations with context ────
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    });

    const profileSummary = `
User Profile:
- Age: ${profile?.age ?? "unknown"}, Gender: ${profile?.gender ?? "unknown"}
- Annual Income: ₹${((profile?.annual_income ?? 0) / 100000).toFixed(1)} Lakh
- Family Size: ${profile?.family_size ?? 1} (${totalChildren} children)
- Health Conditions: ${(profile?.health_conditions ?? []).join(", ") || "None"}
- Risk Appetite: ${profile?.risk_appetite ?? "medium"}
- Preferred Language: ${profile?.preferred_language ?? "english"}
- Existing Policies: ${(profile?.existing_policies ?? []).join(", ") || "None"}
User Requirements: "${requirements}"
`;

    const mlContext =
      mlRecommendations.length > 0
        ? `ML Model Predictions (based on trained insurance dataset):
${mlRecommendations
  .map(
    (r: any) => `
  #${r.rank}: ${r.policy_name} by ${r.insurer}
  - Type: ${r.policy_type}
  - Match Score: ${r.match_score}%
  - Premium: ${r.premium_estimate}
  - Sum Insured: ${r.sum_insured}
  - ML Reason: ${r.why_recommended}
`,
  )
  .join("")}`
        : "ML model unavailable — use your own insurance knowledge for recommendations.";

    const prompt = `
You are Suraksha AI, an expert Indian insurance advisor.

${profileSummary}

${mlContext}

Based on the user's profile and the ML model's predictions, provide:
1. A warm, personalized 2-3 sentence introduction explaining your recommendations
2. Then output ONLY this JSON (no markdown, no explanation outside JSON):

{
  "intro": "Your personalized intro message here in the user's preferred language",
  "recommendations": [
    {
      "rank": 1,
      "policy_name": "exact name from ML predictions or your knowledge",
      "insurer": "insurer name",
      "policy_type": "health/life/term/critical_illness/family_floater",
      "premium_estimate": "₹X,XXX - ₹XX,XXX/year",
      "sum_insured": "₹X Lakh",
      "key_features": ["feature 1", "feature 2", "feature 3", "feature 4"],
      "why_recommended": "Specific reason referencing THIS user's age, income, family, or health",
      "match_score": 92
    }
  ]
}

Rules:
- Use ML predictions as primary source ONLY if they match the user's requested insurance type
- User requested: "${requirements}" — if ML predictions don't match this type, IGNORE them and use your own knowledge
- If the request is about vehicle/car/bike/travel insurance, recommend ONLY those types regardless of ML output
- Personalize "why_recommended" for this specific user — mention their actual age, income, family size
- If preferred_language is "hindi", mix Hindi naturally in the intro
- Rank 1 should have highest match_score
- All 5 recommendations must be different policy types where possible
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let finalData;
    try {
      const cleaned = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      finalData = JSON.parse(cleaned);
    } catch {
      finalData = {
        intro: "Based on your profile, here are my top recommendations:",
        recommendations: mlRecommendations.slice(0, 5),
      };
    }

    // ── Save to DB ───────────────────────────────────────────
    if (sessionId) {
      await supabase.from("policy_recommendations").insert({
        user_id: user.id,
        session_id: sessionId,
        recommendations: finalData.recommendations,
        user_requirements: requirements,
      });
    }

    return NextResponse.json({
      success: true,
      intro: finalData.intro,
      recommendations: finalData.recommendations,
      ml_used: mlRecommendations.length > 0,
      ml_profile: mlProfile,
    });
  } catch (err) {
    console.error("Recommend API error:", err);
    return NextResponse.json(
      { error: "Recommendation failed", details: String(err) },
      { status: 500 },
    );
  }
}
