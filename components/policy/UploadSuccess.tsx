"use client";

import Link from "next/link";
import { CheckCircle, FileText, ArrowRight, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedPolicy } from "./UploadContainer";

interface UploadSuccessProps {
  policy: UploadedPolicy;
  onUploadAnother: () => void;
}

import { useLanguage } from "@/context/LanguageContext";

interface UploadSuccessProps {
  policy: UploadedPolicy;
  onUploadAnother: () => void;
}

export default function UploadSuccess({ policy, onUploadAnother }: UploadSuccessProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-6 shadow-xs">

      {/* Success Icon */}
      <div className="relative inline-flex">
        <div className="w-16 h-16 bg-[#1D7A6C] rounded-2xl flex items-center justify-center shadow-xs mx-auto">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-mono font-bold shadow-xs">
          AI
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          {t("Analysis Complete! 🎉", "विश्लेषण पूरा हुआ! 🎉")}
        </h2>
        <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto font-sans">
          {t(
            "Your policy has been uploaded and analyzed by AI. View the full report now.",
            "आपकी पॉलिसी अपलोड और एआई द्वारा विश्लेषित की गई है। पूरी रिपोर्ट अब देखें।"
          )}
        </p>
      </div>

      {/* File Info */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3 max-w-sm mx-auto">
        <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center">
          <FileText className="w-4 h-4 text-[#1D7A6C]" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="font-bold text-slate-900 text-xs truncate">
            {policy.fileName}
          </p>
          <p className="text-[11px] text-[#1D7A6C] font-mono font-medium">
            ✓ Analyzed successfully
          </p>
        </div>
      </div>

      {/* What was analyzed */}
      <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto w-full text-left">
        {[
          "Coverage details extracted",
          "Exclusions identified",
          "Claim probability calculated",
          "Hindi summary generated",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 bg-teal-50/50 border border-teal-100/80 rounded-lg p-2"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#1D7A6C] shrink-0" />
            <span className="text-[11px] text-slate-700">{item}</span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href={`/policies/${policy.id}`}>
          <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg px-5 gap-2 shadow-xs text-xs font-medium">
            <Eye className="w-4 h-4" />
            View Full Analysis
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={onUploadAnother}
          className="rounded-lg px-5 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium"
        >
          <Upload className="w-4 h-4" />
          Upload Another
        </Button>
      </div>
    </div>
  );
}