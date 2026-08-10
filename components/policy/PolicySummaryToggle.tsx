"use client";

import { useState } from "react";
import { Shield, Star, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PolicySummaryToggleProps {
  summaryEnglish: string;
  summaryHindi: string;
}

import { useLanguage } from "@/context/LanguageContext";

export default function PolicySummaryToggle({
  summaryEnglish,
  summaryHindi,
}: PolicySummaryToggleProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Card className="p-6 border border-slate-200 bg-white rounded-2xl shadow-xs transition-all">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#1D7A6C]" />
          <h2 className="font-extrabold text-slate-900 text-base">
            {t("Policy Summary", "पॉलिसी सारांश")}
          </h2>
        </div>

        {/* Language Toggle Pill */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-md p-1 font-mono text-xs">
          <button
            onClick={() => setLanguage("en")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer",
              language === "en"
                ? "bg-[#1D7A6C] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Globe className="w-3 h-3" />
            EN
          </button>
          <button
            onClick={() => setLanguage("hi")}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer font-hindi",
              language === "hi"
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
        {language === "en" ? (
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm font-sans">
            {summaryEnglish}
          </p>
        ) : (
          <p className="text-slate-700 leading-relaxed font-hindi text-sm sm:text-base font-medium">
            {summaryHindi}
          </p>
        )}
      </div>
    </Card>
  );
}