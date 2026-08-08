"use client";

import { useState } from "react";
import FileDropzone from "./FileDropzone";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export type UploadStage =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

export interface UploadedPolicy {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export default function UploadContainer() {
  const { user } = useAuth();
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadedPolicy, setUploadedPolicy] = useState<UploadedPolicy | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  const handleFilesAccepted = async (files: File[]) => {
    if (!user) {
      toast.error("Please log in to upload policies.");
      return;
    }

    const file = files[0];
    if (!file) return;

    setStage("uploading");
    setProgress(0);
    setErrorMessage(null);

    try {
      // ── Step 1: Determine file type ──────────────────────────────
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const isImage = ["jpg", "jpeg", "png", "webp"].includes(fileExt ?? "");
      const isPdf = fileExt === "pdf";

      if (!isImage && !isPdf) {
        throw new Error(
          "Only PDF and image files (JPG, PNG, WebP) are supported.",
        );
      }

      const fileType = isPdf ? "pdf" : "image";
      const filePath = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;

      setProgress(20);

      // ── Step 2: Upload to Supabase Storage ───────────────────────
      const { data: storageData, error: storageError } = await supabase.storage
        .from("policy-documents")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError)
        throw new Error(`Storage error: ${storageError.message}`);

      setProgress(50);

      // ── Step 3: Get signed URL (private bucket) ──────────────────
      const { data: urlData } = await supabase.storage
        .from("policy-documents")
        .createSignedUrl(filePath, 60 * 60 * 24); // 24 hour URL

      setProgress(70);

      // ── Step 4: Save metadata to database ───────────────────────
      const { data: policyData, error: dbError } = await supabase
        .from("policies")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_url: urlData?.signedUrl ?? null,
          file_type: fileType,
          file_size: file.size,
          status: "processing",
        })
        .select()
        .single();

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      setProgress(90);

      // ── Step 5: Trigger AI analysis ──────────────────────────────
      setStage("processing");

      try {
        const analysisResponse = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            policyId: policyData.id,
            filePath,
            fileType,
            fileName: file.name,
          }),
        });

        const analysisResult = await analysisResponse.json();

        if (!analysisResponse.ok || !analysisResult.success) {
          console.error("Analysis error:", analysisResult);
          toast.error(
            `Analysis issue: ${analysisResult.error ?? "Unknown error"}. Check console for details.`,
          );
        }
      } catch (analysisErr) {
        console.error("Analysis fetch error:", analysisErr);
        toast.error("AI analysis failed. File was uploaded successfully.");
      }

      setProgress(100);
      setUploadedPolicy({
        id: policyData.id,
        fileName: file.name,
        fileUrl: urlData?.signedUrl ?? "",
        fileType,
      });
      setStage("success");
      toast.success("Policy uploaded successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed. Please try again.";
      setErrorMessage(message);
      setStage("error");
      toast.error(message);
    }
  };

  const handleReset = () => {
    setStage("idle");
    setProgress(0);
    setUploadedPolicy(null);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-6">
      {stage === "idle" && (
        <FileDropzone onFilesAccepted={handleFilesAccepted} />
      )}

      {(stage === "uploading" || stage === "processing") && (
        <UploadProgress stage={stage} progress={progress} />
      )}

      {stage === "success" && uploadedPolicy && (
        <UploadSuccess policy={uploadedPolicy} onUploadAnother={handleReset} />
      )}

      {stage === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center shadow-xs">
          <p className="text-red-700 font-bold mb-1 text-sm">
            Upload Failed
          </p>
          <p className="text-red-600 text-xs mb-4">
            {errorMessage}
          </p>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Upload Tips */}
      {stage === "idle" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              emoji: "📄",
              title: "PDF Documents",
              titleHindi: "PDF दस्तावेज़",
              desc: "Upload your policy PDF directly from your insurer's portal.",
            },
            {
              emoji: "📷",
              title: "Photos of Policy",
              titleHindi: "पॉलिसी की फोटो",
              desc: "Take a clear photo of your physical policy document.",
            },
            {
              emoji: "🔒",
              title: "100% Secure",
              titleHindi: "पूरी तरह सुरक्षित",
              desc: "Your documents are encrypted and only visible to you.",
            },
          ].map((tip) => (
            <div
              key={tip.title}
              className="bg-white border border-slate-200 rounded-xl p-4 text-center shadow-xs"
            >
              <div className="text-2xl mb-2">{tip.emoji}</div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">
                {tip.title}
              </p>
              <p className="text-xs font-hindi text-[#1D7A6C] mb-1 font-medium">
                {tip.titleHindi}
              </p>
              <p className="text-xs text-slate-500">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
