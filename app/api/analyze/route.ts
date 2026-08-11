import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateFileMagicNumber, extractAndParseJson } from "@/lib/security";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

// Strict allowlist regex for Supabase Storage file paths — prevents path traversal
const SAFE_FILE_PATH_REGEX = /^[a-zA-Z0-9_\-\/\.]+$/;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate Limiting — Max 10 policy analyses per 10 minutes per user
    const rateCheck = checkRateLimit(`analyze_${user.id}`, { limit: 10, windowMs: 10 * 60 * 1000 });
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. You can analyze up to 10 policies per 10 minutes. Please wait before trying again.",
          retryAfterMs: rateCheck.resetMs,
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        }
      );
    }

    const body = await request.json();
    const { policyId, filePath, fileType, fileName } = body;

    if (!policyId || !filePath) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // ── File path sanitization — prevent path traversal ──────
    if (!SAFE_FILE_PATH_REGEX.test(filePath)) {
      console.warn(`Path traversal attempt blocked for policy ${policyId}: "${filePath}"`);
      return NextResponse.json(
        { error: "Invalid file path format." },
        { status: 400 }
      );
    }

    // ── IDOR Protection: Verify resource ownership ───────────
    const { data: policyRecord, error: policyCheckError } = await supabase
      .from("policies")
      .select("id, user_id, file_path")
      .eq("id", policyId)
      .eq("user_id", user.id)
      .single();

    if (policyCheckError || !policyRecord) {
      console.warn(`IDOR blocked: User ${user.id} attempted to access unauthorized policy ${policyId}`);
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to access or analyze this policy document." },
        { status: 403 }
      );
    }

    // Verify requested filePath matches registered policy record file_path
    if (policyRecord.file_path && policyRecord.file_path !== filePath) {
      console.warn(`IDOR blocked: File path mismatch for policy ${policyId}`);
      return NextResponse.json(
        { error: "Forbidden: Policy document file path mismatch." },
        { status: 403 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
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

    // ── Heap OOM Protection: Reject files > 10MB before buffering ────
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB limit
    if (fileData.size > maxSizeBytes) {
      console.warn(`OOM Guard blocked large file upload: ${fileData.size} bytes`);
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);
      return NextResponse.json(
        { error: "File exceeds maximum size limit of 10MB. Please upload a smaller document." },
        { status: 400 }
      );
    }

    const fileBuffer = await fileData.arrayBuffer();

    // ── Binary Magic-Number MIME Validation ──────────────────
    const magicCheck = validateFileMagicNumber(fileBuffer);
    if (!magicCheck.valid) {
      console.warn("Magic number validation failed:", magicCheck.error);
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);
      return NextResponse.json(
        { error: magicCheck.error || "Corrupted or unsupported file format signature." },
        { status: 400 }
      );
    }

    const mimeType = magicCheck.mimeType;
    const base64Content = Buffer.from(fileBuffer).toString("base64");

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

    // ── Build content parts ───────────────────────────────────
    let contentParts: any[];
    let uploadedFileResourceName: string | null = null;
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
          uploadedFileResourceName = uploadData.file?.name ?? null; // e.g. "files/abc123xyz"
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
  "is_insurance_document": true or false (false if this is NOT an insurance policy),
  "claim_success_probability": 0 if not an insurance document, otherwise number between 60 and 95 based on policy completeness,
  "summary_english": "2-3 sentences explaining what this policy actually covers in simple English",
  "summary_hindi": "2-3 वाक्यों में इस पॉलिसी का सरल हिंदी सारांश",
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"]
}`;

    let analysisData: any;

    try {
      const result = await model.generateContent([
        ...contentParts,
        { text: prompt },
      ]);
      let responseText = result.response.text();
      console.log("Raw Gemini response length:", responseText.length);

      analysisData = extractAndParseJson<any>(responseText, null);
      if (!analysisData || typeof analysisData !== "object") {
        throw new Error("Failed to parse valid structured JSON analysis from Gemini model response.");
      }
      console.log("✅ Analysis successful:", (analysisData as any).policy_name);
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
        claim_success_probability: 0,
        summary_english: `The document "${fileName}" was uploaded but could not be fully analyzed. Please ensure it is a clear, readable insurance policy PDF.`,
        summary_hindi: `"${fileName}" दस्तावेज़ अपलोड हुआ लेकिन AI इसे पूरी तरह नहीं पढ़ सका। कृपया स्पष्ट PDF अपलोड करें।`,
        recommendations: [
          "Upload a clearer, non-password-protected PDF",
          "Ensure the document is an actual insurance policy",
          "Try uploading individual pages as images if PDF doesn't work",
        ],
      };
    } finally {
      // ── Cloud Cleanup: Purge temporary Gemini File API resource ─────
      if (uploadedFileResourceName && process.env.GEMINI_API_KEY) {
        try {
          console.log(`Purging Gemini File API resource: ${uploadedFileResourceName}`);
          await fetch(
            `https://generativelanguage.googleapis.com/v1beta/${uploadedFileResourceName}?key=${process.env.GEMINI_API_KEY}`,
            { method: "DELETE" }
          );
        } catch (cleanupErr) {
          console.warn("Gemini File API cleanup error (non-fatal):", cleanupErr);
        }
      }
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
          analysisData.is_insurance_document === false
            ? 0
            : Number(analysisData.claim_success_probability) || 0,
        summary_english: analysisData.summary_english || "",
        summary_hindi: analysisData.summary_hindi || "",
        recommendations: analysisData.recommendations || [],
        raw_analysis: analysisData,
      });

    if (analysisError) {
      console.error("DB save error:", analysisError);
      await supabase
        .from("policies")
        .update({ status: "error" })
        .eq("id", policyId);

      return NextResponse.json(
        { error: "Failed to persist policy analysis result to database." },
        { status: 500 }
      );
    }

    // Update extracted text
    await supabase
      .from("policies")
      .update({
        extracted_text: extractedText || "Analyzed via Gemini Vision",
        status: "analyzed",
      })
      .eq("id", policyId);

    console.log("✅ Policy analysis complete, status: analyzed");

    return NextResponse.json({
      success: true,
      policyId,
      analysis: analysisData,
    });
  } catch (err) {
    console.error("Analyze API fatal error:", err);
    return NextResponse.json(
      { error: "Analysis failed. Please try again later." },
      { status: 500 },
    );
  }
}
