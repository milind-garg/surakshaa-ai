"use client";

import { useState } from "react";
import { Shield, Star, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PolicySummaryToggleProps {
  summaryEnglish: string;
  summaryHindi: string;
}

export default function PolicySummaryToggle({
  summaryEnglish,
  summaryHindi,
}: PolicySummaryToggleProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  return (
    <Card className="p-6 border border-slate-200 bg-white rounded-xl shadow-xs transition-all">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1D7A6C]" />
          <h2 className="font-bold text-slate-900 text-base">
            {lang === "en" ? "Policy Summary" : "पॉलिसी सारांश"}
          </h2>
        </div>

        {/* Language Toggle Pill */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all",
              lang === "en"
                ? "bg-[#1D7A6C] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Globe className="w-3 h-3" />
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all",
              lang === "hi"
                ? "bg-[#1D7A6C] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Globe className="w-3 h-3" />
            हि
          </button>
        </div>
      </div>

      {/* Summary Text */}
      <div className="relative overflow-hidden">
        {lang === "en" ? (
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            {summaryEnglish}
          </p>
        ) : (
          <p className="text-slate-700 leading-relaxed font-hindi text-sm sm:text-base">
            {summaryHindi}
          </p>
        )}
      </div>

      {/* Language hint */}
      <p className="text-xs text-slate-400 mt-3 flex items-center gap-1 font-mono">
        <Globe className="w-3 h-3 text-slate-400" />
        {lang === "en"
          ? "हिंदी में पढ़ने के लिए 'हि' पर क्लिक करें"
          : "Click 'EN' to read in English"}
      </p>
    </Card>
  );
}