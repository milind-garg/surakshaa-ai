"use client";

import Link from "next/link";
import { CheckCircle, FileText, ArrowRight, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedPolicy } from "./UploadContainer";

interface UploadSuccessProps {
  policy: UploadedPolicy;
  onUploadAnother: () => void;
}

export default function UploadSuccess({ policy, onUploadAnother }: UploadSuccessProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-green-200 dark:border-green-900 rounded-3xl p-10 text-center space-y-6 shadow-lg">

      {/* Success Icon */}
      <div className="relative inline-flex">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center shadow-xl mx-auto">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FF6B35] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
          AI
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
          Analysis Complete!
        </h2>
        <p className="text-green-600 dark:text-green-400 font-hindi text-lg mt-1">
          विश्लेषण पूरा हुआ! 🎉
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-3 max-w-sm mx-auto">
          Your policy has been uploaded and analyzed by AI. View the full report now.
        </p>
      </div>

      {/* File Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3 max-w-sm mx-auto">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="font-medium text-[#1E3A5F] dark:text-white text-sm truncate">
            {policy.fileName}
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
            ✓ Analyzed successfully
          </p>
        </div>
      </div>

      {/* What was analyzed */}
      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto w-full text-left">
        {[
          "Coverage details extracted",
          "Exclusions identified",
          "Claim probability calculated",
          "Hindi summary generated",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 rounded-xl p-2.5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span className="text-xs text-gray-700 dark:text-gray-300">{item}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/policies/${policy.id}`}>
          <Button className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl px-6 gap-2 shadow-lg">
            <Eye className="w-4 h-4" />
            View Full Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={onUploadAnother}
          className="rounded-xl px-6 gap-2 border-gray-200 dark:border-gray-700"
        >
          <Upload className="w-4 h-4" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}