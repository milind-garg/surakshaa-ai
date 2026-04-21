import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

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
    const { policyId, filePath, fileType, fileName } = body;

    if (!policyId || !filePath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      );
    }

    // ── Download file from Supabase Storage ──────────────────
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("policy-documents")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Download error:", downloadError);
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);
      return NextResponse.json(
        { error: "Failed to download file" },
        { status: 500 },
      );
    }

    const fileBuffer = await fileData.arrayBuffer();
    const base64Content = Buffer.from(fileBuffer).toString("base64");
    const mimeType =
      fileData.type ||
      (filePath.endsWith(".pdf") ? "application/pdf" : "image/jpeg");

    console.log(
      `Processing file: ${fileName}, type: ${mimeType}, size: ${fileBuffer.byteLength} bytes`,
    );

    // ── Update status to processing ───────────────────────────
    await supabase
      .from("policies")
      .update({ status: "processing", extracted_text: "Processing with AI..." })
      .eq("id", policyId);

    // ── Try OCR for images only ───────────────────────────────
    let extractedText = "";
    const isImage = mimeType.startsWith("image/");

    if (isImage && process.env.GOOGLE_VISION_API_KEY) {
      try {
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
          },
        );
        if (visionResponse.ok) {
          const visionData = await visionResponse.json();
          extractedText =
            visionData.responses?.[0]?.fullTextAnnotation?.text ?? "";
          console.log(`OCR extracted ${extractedText.length} characters`);
        }
      } catch (err) {
        console.warn("OCR failed:", err);
      }
    }

    // ── Analyze with Gemini ───────────────────────────────────
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    // Build the content parts based on file type
    // Build content parts
    let contentParts: any[];
    const fileSizeMB = fileBuffer.byteLength / (1024 * 1024);
    console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);

    if (isImage && extractedText.length > 50) {
      // Use OCR text for images
      contentParts = [
        {
          text: `Analyze this insurance policy:\n\n${extractedText.slice(0, 10000)}`,
        },
      ];
    } else if (isImage) {
      // Small image — send directly
      contentParts = [
        { inlineData: { mimeType, data: base64Content } },
        { text: "Analyze this insurance policy image." },
      ];
    } else if (fileSizeMB < 3) {
      // Small PDF — send inline
      contentParts = [
        { inlineData: { mimeType: "application/pdf", data: base64Content } },
        { text: "Analyze this insurance policy PDF." },
      ];
    } else {
      // Large PDF — use File API upload
      console.log("Large PDF detected, using File API...");
      try {
        const uploadResponse = await fetch(
          `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "X-Goog-Upload-Command": "start, upload, finalize",
              "X-Goog-Upload-Header-Content-Length":
                fileBuffer.byteLength.toString(),
              "X-Goog-Upload-Header-Content-Type": "application/pdf",
              "Content-Type": "application/pdf",
            },
            body: fileData,
          },
        );
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          const fileUri = uploadData.file?.uri;
          if (fileUri) {
            contentParts = [
              { fileData: { mimeType: "application/pdf", fileUri } },
              { text: "Analyze this insurance policy PDF." },
            ];
          } else {
            throw new Error("No file URI returned");
          }
        } else {
          throw new Error("File upload failed");
        }
      } catch (uploadErr) {
        console.warn("File API failed, using text fallback:", uploadErr);
        contentParts = [
          {
            text: `Analyze an insurance policy document named: ${fileName}. Provide a generic analysis template.`,
          },
        ];
      }
    }

    const prompt = `
You are an expert Indian insurance analyst. Carefully read the provided insurance document and extract real information from it.

IMPORTANT: 
- Extract ACTUAL data from the document — do NOT use placeholder or generic values
- If a value is not found in the document, use 0 for numbers or "Not specified" for text
- Read the actual policy name, insurer, premium, sum insured from the document
- Identify what IS and IS NOT covered based on the actual document content

Return ONLY a valid JSON object with no markdown or code blocks:

{
  "policy_name": "ACTUAL policy name from document",
  "policy_type": "health OR life OR term OR vehicle OR other",
  "insurer": "ACTUAL insurance company name from document",
  "premium_amount": ACTUAL annual premium in rupees as number,
  "sum_insured": ACTUAL sum insured in rupees as number,
  "coverage_details": [
    {"category": "Hospitalization", "covered": true or false, "amount": number, "conditions": "actual condition from doc"},
    {"category": "Pre-existing Diseases", "covered": true or false, "amount": number, "conditions": "actual waiting period"},
    {"category": "Maternity", "covered": true or false, "amount": number, "conditions": "actual condition"},
    {"category": "Dental", "covered": true or false, "amount": number, "conditions": "actual condition"},
    {"category": "Mental Health", "covered": true or false, "amount": number, "conditions": "actual condition"},
    {"category": "Critical Illness", "covered": true or false, "amount": number, "conditions": "actual condition"},
    {"category": "OPD", "covered": true or false, "amount": number, "conditions": "actual condition"},
    {"category": "Ambulance", "covered": true or false, "amount": number, "conditions": "actual condition"}
  ],
  "exclusions": ["actual exclusion 1 from document", "actual exclusion 2"],
  "key_benefits": ["actual benefit 1 from document", "actual benefit 2"],
  "coverage_gaps": ["identified gap 1", "identified gap 2"],
  "claim_process": "actual claim process described in document or general process for this insurer",
  "claim_success_probability": number between 60 and 95 based on policy completeness,
  "summary_english": "2-3 sentences explaining what this policy actually covers in simple English",
  "summary_hindi": "2-3 वाक्यों में इस पॉलिसी का सरल हिंदी सारांश",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}`;

    let analysisData;

    try {
      const result = await model.generateContent([
        ...contentParts,
        { text: prompt },
      ]);
      let responseText = result.response.text();
      console.log("Raw Gemini response length:", responseText.length);

      // Clean response
      responseText = responseText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();

      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.slice(jsonStart, jsonEnd + 1);
      }

      analysisData = JSON.parse(responseText);
      console.log("✅ Analysis successful:", analysisData.policy_name);
    } catch (geminiErr: any) {
      console.error("Gemini error:", geminiErr?.message);

      // Fallback with filename-based defaults
      analysisData = {
        policy_name: fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
        policy_type: "health",
        insurer: "Unknown — Please review document",
        premium_amount: 0,
        sum_insured: 0,
        coverage_details: [
          {
            category: "Hospitalization",
            covered: true,
            amount: 0,
            conditions: "Review document for details",
          },
          {
            category: "Pre-existing Diseases",
            covered: false,
            amount: 0,
            conditions: "Review document",
          },
          {
            category: "Maternity",
            covered: false,
            amount: 0,
            conditions: "Review document",
          },
          {
            category: "Dental",
            covered: false,
            amount: 0,
            conditions: "Review document",
          },
          {
            category: "Mental Health",
            covered: false,
            amount: 0,
            conditions: "Review document",
          },
          {
            category: "Critical Illness",
            covered: false,
            amount: 0,
            conditions: "Review document",
          },
        ],
        exclusions: [
          "Could not read document — please re-upload a clearer version",
        ],
        key_benefits: [
          "Could not read document — please re-upload a clearer version",
        ],
        coverage_gaps: ["Full analysis unavailable — re-upload recommended"],
        claim_process:
          "Please refer to your insurer's website or policy document.",
        claim_success_probability: 70,
        summary_english: `The document "${fileName}" was uploaded but could not be fully analyzed. Please ensure it is a clear, readable insurance policy PDF.`,
        summary_hindi: `"${fileName}" दस्तावेज़ अपलोड हुआ लेकिन AI इसे पूरी तरह नहीं पढ़ सका। कृपया स्पष्ट PDF अपलोड करें।`,
        recommendations: [
          "Upload a clearer, non-password-protected PDF",
          "Ensure the document is an actual insurance policy",
          "Try uploading individual pages as images if PDF doesn't work",
        ],
      };
    }

    // ── Save analysis ─────────────────────────────────────────
    const { error: analysisError } = await supabase
      .from("policy_analyses")
      .upsert({
        policy_id: policyId,
        user_id: user.id,
        policy_name: analysisData.policy_name,
        policy_type: analysisData.policy_type,
        insurer: analysisData.insurer,
        premium_amount: Number(analysisData.premium_amount) || 0,
        sum_insured: Number(analysisData.sum_insured) || 0,
        coverage_details: analysisData.coverage_details || [],
        exclusions: analysisData.exclusions || [],
        key_benefits: analysisData.key_benefits || [],
        coverage_gaps: analysisData.coverage_gaps || [],
        claim_process: analysisData.claim_process || "",
        claim_success_probability:
          Number(analysisData.claim_success_probability) || 70,
        summary_english: analysisData.summary_english || "",
        summary_hindi: analysisData.summary_hindi || "",
        recommendations: analysisData.recommendations || [],
        raw_analysis: analysisData,
      });

    if (analysisError) {
      console.error("DB save error:", analysisError);
    }

    // Update extracted text
    await supabase
      .from("policies")
      .update({
        extracted_text: extractedText || "Analyzed via Gemini Vision",
        status: analysisError ? "error" : "analyzed",
      })
      .eq("id", policyId);

    console.log(
      "✅ Policy analysis complete, status:",
      analysisError ? "error" : "analyzed",
    );

    return NextResponse.json({
      success: !analysisError,
      policyId,
      analysis: analysisData,
    });
  } catch (err) {
    console.error("Analyze API fatal error:", err);
    return NextResponse.json(
      { error: "Analysis failed", details: String(err) },
      { status: 500 },
    );
  }
}
