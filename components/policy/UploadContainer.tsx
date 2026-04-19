"use client";

import { useState } from "react";
import FileDropzone from "./FileDropzone";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export type UploadStage = "idle" | "uploading" | "processing" | "success" | "error";

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
  const [uploadedPolicy, setUploadedPolicy] = useState<UploadedPolicy | null>(null);
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
        throw new Error("Only PDF and image files (JPG, PNG, WebP) are supported.");
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

      if (storageError) throw new Error(`Storage error: ${storageError.message}`);

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

      setProgress(100);

      if (!analysisResponse.ok) {
        // Analysis failed but upload succeeded — still show success
        await supabase
          .from("policies")
          .update({ status: "error" })
          .eq("id", policyData.id);

        toast.error("File uploaded but AI analysis failed. You can retry from My Policies.");
      }

      setUploadedPolicy({
        id: policyData.id,
        fileName: file.name,
        fileUrl: urlData?.signedUrl ?? "",
        fileType,
      });

      setStage("success");
      toast.success("Policy uploaded and analyzed successfully!");

    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed. Please try again.";
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Upload Failed</p>
          <p className="text-red-500 dark:text-red-400 text-sm mb-4">{errorMessage}</p>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors"
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
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-center"
            >
              <div className="text-3xl mb-2">{tip.emoji}</div>
              <p className="font-semibold text-[#1E3A5F] dark:text-white text-sm">
                {tip.title}
              </p>
              <p className="text-xs font-hindi text-gray-400 mb-1">{tip.titleHindi}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}