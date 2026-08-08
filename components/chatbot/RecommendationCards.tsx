"use client";

import { useState } from "react";
import {
  Shield,
  Star,
  CheckCircle,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PolicyRecommendation } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";

interface RecommendationCardsProps {
  recommendations: PolicyRecommendation[];
}

const typeColors: Record<string, string> = {
  health: "bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase",
  life: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
  term: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
  vehicle: "bg-amber-50 text-amber-700 border-amber-200 font-mono text-[10px] uppercase",
  travel: "bg-sky-50 text-sky-700 border-sky-200 font-mono text-[10px] uppercase",
  home: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
  family_floater: "bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase",
  critical_illness: "bg-red-50 text-red-700 border-red-200 font-mono text-[10px] uppercase",
  other: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
};

const rankBadge: Record<number, string> = {
  1: "bg-[#1D7A6C] text-white",
  2: "bg-slate-800 text-white",
  3: "bg-slate-700 text-white",
};

export default function RecommendationCards({
  recommendations,
}: RecommendationCardsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="mt-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#1D7A6C] rounded-md flex items-center justify-center shadow-xs">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <p className="font-bold text-slate-900 text-xs sm:text-sm">
          Top {recommendations.length} Policy Recommendations
        </p>
        <span className="text-xs text-[#1D7A6C] font-hindi font-medium ml-1">
          आपके लिए शीर्ष पॉलिसी
        </span>
      </div>

      {/* Cards */}
      {recommendations.map((rec) => {
        const isExpanded = expandedId === rec.rank;

        return (
          <Card
            key={rec.rank}
            className={cn(
              "overflow-hidden border transition-all duration-200 bg-white rounded-xl shadow-xs",
              rec.rank === 1
                ? "border-[#1D7A6C]/40"
                : "border-slate-200",
            )}
          >
            {/* Card Header */}
            <div
              className={cn(
                "p-4 cursor-pointer",
                rec.rank === 1
                  ? "bg-teal-50/30"
                  : "bg-white",
              )}
              onClick={() => setExpandedId(isExpanded ? null : rec.rank)}
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 shadow-xs",
                    rankBadge[rec.rank] ?? "bg-slate-100 text-slate-600",
                  )}
                >
                  {rec.rank === 1 ? (
                    <Award className="w-3.5 h-3.5" />
                  ) : (
                    `#${rec.rank}`
                  )}
                </div>

                {/* Policy Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">
                        {rec.policy_name}
                      </p>
                      <p className="text-slate-500 text-xs font-mono mt-0.5">
                        {rec.insurer}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        className={cn(
                          "text-xs border",
                          typeColors[rec.policy_type] ?? typeColors.other,
                        )}
                      >
                        {rec.policy_type}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap font-mono text-xs">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#1D7A6C]" />
                      <span className="text-slate-600">
                        {rec.sum_insured}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#1D7A6C]" />
                      <span className="text-slate-600">
                        {rec.premium_estimate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      <span className="font-bold text-[#1D7A6C]">
                        {rec.match_score}% match
                      </span>
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="mt-2">
                    <Progress
                      value={rec.match_score}
                      className="h-1.5 rounded-full bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 bg-white border-t border-slate-100 space-y-3">
                {/* Why Recommended */}
                <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-3 mt-3">
                  <p className="text-xs font-bold text-[#1D7A6C] mb-1">
                    💡 Why this is recommended for you
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {rec.why_recommended}
                  </p>
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-xs font-bold text-slate-900 mb-1.5">
                    Key Features
                  </p>
                  <div className="space-y-1">
                    {rec.key_features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1D7A6C] shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium & Cover */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                    <p className="text-[11px] font-mono uppercase text-slate-500 mb-0.5">
                      Sum Insured
                    </p>
                    <p className="text-xs font-bold font-mono text-slate-900">
                      {rec.sum_insured}
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                    <p className="text-[11px] font-mono uppercase text-slate-500 mb-0.5">
                      Est. Premium
                    </p>
                    <p className="text-xs font-bold font-mono text-slate-900">
                      {rec.premium_estimate}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs font-medium shadow-xs"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(rec.policy_name + " " + rec.insurer + " India")}`,
                      "_blank",
                    )
                  }
                >
                  Learn More About This Policy ↗
                </Button>
              </div>
            )}
          </Card>
        );
      })}

      <p className="text-xs text-slate-400 text-center pt-1 font-mono">
        * Recommendations are AI-generated. Always verify with the insurer. Not financial advice.
      </p>
    </div>
  );
}
