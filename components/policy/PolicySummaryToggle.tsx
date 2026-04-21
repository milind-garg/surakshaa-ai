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
    <Card className={cn(
      "p-6 border transition-all",
      lang === "en" ? "border-gray-100" : "border-orange-100 bg-orange-50/50"
    )}>
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {lang === "en"
            ? <Shield className="w-5 h-5 text-[#1E3A5F]" />
            : <Star className="w-5 h-5 text-[#FF6B35]" />
          }
          <h2 className="font-bold text-[#1E3A5F]">
            {lang === "en" ? "Policy Summary" : "पॉलिसी सारांश"}
          </h2>
        </div>

        {/* Language Toggle Pill */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setLang("en")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all",
              lang === "en"
                ? "bg-[#1E3A5F] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Globe className="w-3 h-3" />
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all",
              lang === "hi"
                ? "bg-[#FF6B35] text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
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
          <p className="text-gray-700 leading-relaxed text-sm animate-fade-in">
            {summaryEnglish}
          </p>
        ) : (
          <p className="text-gray-700 leading-relaxed font-hindi text-base animate-fade-in">
            {summaryHindi}
          </p>
        )}
      </div>

      {/* Language hint */}
      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
        <Globe className="w-3 h-3" />
        {lang === "en"
          ? "हिंदी में पढ़ने के लिए 'हि' पर क्लिक करें"
          : "Click 'EN' to read in English"}
      </p>
    </Card>
  );
}