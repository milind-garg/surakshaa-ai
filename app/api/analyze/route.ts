import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { policyId, filePath, fileType, fileName } = await request.json();

    if (!policyId || !filePath) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Step 1: Download file from Supabase Storage ──────────────
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("policy-documents")
      .download(filePath);

    if (downloadError || !fileData) {
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);

      return NextResponse.json(
        { error: "Failed to download file for analysis" },
        { status: 500 }
      );
    }

    // ── Step 2: Extract text using Google Vision OCR ─────────────
    let extractedText = "";

    try {
      const fileBuffer = await fileData.arrayBuffer();
      const base64Content = Buffer.from(fileBuffer).toString("base64");

      const visionResponse = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64Content },
                features: [
                  { type: "DOCUMENT_TEXT_DETECTION", maxResults: 1 },
                ],
              },
            ],
          }),
        }
      );

      if (visionResponse.ok) {
        const visionData = await visionResponse.json();
        extractedText =
          visionData.responses?.[0]?.fullTextAnnotation?.text ?? "";
      }
    } catch (visionErr) {
      console.error("Vision OCR error:", visionErr);
      // Continue with empty text — Gemini will note it can't read the file
    }

    // ── Step 3: Update extracted text in DB ──────────────────────
    await supabase
      .from("policies")
      .update({
        extracted_text: extractedText || "Text extraction pending",
        status: "processing",
      })
      .eq("id", policyId);

    // ── Step 4: Analyze with Google Gemini ───────────────────────
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an expert Indian insurance analyst. Analyze the following insurance policy document text and provide a comprehensive JSON analysis.

POLICY DOCUMENT TEXT:
${extractedText || `[File: ${fileName} - OCR extraction yielded no text. Provide a generic analysis template for an Indian insurance policy.]`}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "policy_name": "Name of the policy",
  "policy_type": "health/life/vehicle/term/other",
  "insurer": "Insurance company name",
  "premium_amount": 0,
  "sum_insured": 0,
  "coverage_details": [
    {"category": "Hospitalization", "covered": true, "amount": 500000, "conditions": "Up to sum insured"},
    {"category": "Pre-existing Diseases", "covered": false, "amount": 0, "conditions": "2 year waiting period"},
    {"category": "Maternity", "covered": false, "amount": 0, "conditions": "Not covered"},
    {"category": "Dental", "covered": false, "amount": 0, "conditions": "Not covered"},
    {"category": "Mental Health", "covered": false, "amount": 0, "conditions": "Not covered"},
    {"category": "Critical Illness", "covered": false, "amount": 0, "conditions": "Rider required"}
  ],
  "exclusions": ["Pre-existing conditions for first 2 years", "Cosmetic surgery", "Self-inflicted injuries"],
  "key_benefits": ["Cashless hospitalization", "No-claim bonus", "Free annual health checkup"],
  "coverage_gaps": ["No maternity cover", "No mental health cover", "No dental cover"],
  "claim_process": "Brief description of how to file a claim",
  "claim_success_probability": 78,
  "summary_english": "A clear 3-4 sentence explanation of what this policy covers in simple English for a common person.",
  "summary_hindi": "3-4 वाक्यों में इस पॉलिसी का सरल हिंदी में सारांश जो एक सामान्य व्यक्ति समझ सके।",
  "recommendations": ["Consider adding maternity rider", "Increase sum insured to 10L for better coverage", "Add critical illness rider"]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean the response (remove markdown if present)
    const cleanJson = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let analysisData;
    try {
      analysisData = JSON.parse(cleanJson);
    } catch {
      // If JSON parse fails, use a default structure
      analysisData = {
        policy_name: fileName.replace(/\.[^/.]+$/, ""),
        policy_type: "health",
        insurer: "Unknown",
        premium_amount: 0,
        sum_insured: 0,
        coverage_details: [],
        exclusions: ["Could not extract exclusions"],
        key_benefits: ["Could not extract benefits"],
        coverage_gaps: ["Manual review recommended"],
        claim_process: "Please refer to your policy document",
        claim_success_probability: 70,
        summary_english: "Policy document was uploaded but could not be fully analyzed. Please ensure the document is clear and readable.",
        summary_hindi: "पॉलिसी दस्तावेज़ अपलोड किया गया लेकिन पूरी तरह से विश्लेषण नहीं किया जा सका।",
        recommendations: ["Upload a clearer version of the document", "Ensure the PDF is not password protected"],
      };
    }

    // ── Step 5: Save analysis to database ────────────────────────
    const { error: analysisError } = await supabase
      .from("policy_analyses")
      .insert({
        policy_id: policyId,
        user_id: user.id,
        policy_name: analysisData.policy_name,
        policy_type: analysisData.policy_type,
        insurer: analysisData.insurer,
        premium_amount: analysisData.premium_amount || 0,
        sum_insured: analysisData.sum_insured || 0,
        coverage_details: analysisData.coverage_details || [],
        exclusions: analysisData.exclusions || [],
        key_benefits: analysisData.key_benefits || [],
        coverage_gaps: analysisData.coverage_gaps || [],
        claim_process: analysisData.claim_process,
        claim_success_probability: analysisData.claim_success_probability || 70,
        summary_english: analysisData.summary_english,
        summary_hindi: analysisData.summary_hindi,
        recommendations: analysisData.recommendations || [],
        raw_analysis: analysisData,
      });

    if (analysisError) {
      console.error("Analysis DB error:", analysisError);
    }

    // ── Step 6: Mark policy as analyzed ──────────────────────────
    await supabase
      .from("policies")
      .update({ status: analysisError ? "error" : "analyzed" })
      .eq("id", policyId);

    return NextResponse.json({
      success: true,
      policyId,
      analysis: analysisData,
    });

  } catch (err) {
    console.error("Analyze API error:", err);
    return NextResponse.json(
      { error: "Analysis failed", details: String(err) },
      { status: 500 }
    );
  }
}