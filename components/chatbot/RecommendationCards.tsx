"use client";

import { useState } from "react";
import {
  Shield, Star, CheckCircle, TrendingUp,
  ChevronDown, ChevronUp, Award, Zap,
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
  health: "bg-green-50 text-green-700 border-green-200",
  life: "bg-blue-50 text-blue-700 border-blue-200",
  term: "bg-purple-50 text-purple-700 border-purple-200",
  vehicle: "bg-orange-50 text-orange-700 border-orange-200",
  other: "bg-gray-50 text-gray-700 border-gray-200",
};

const rankBadge: Record<number, string> = {
  1: "bg-yellow-400 text-yellow-900",
  2: "bg-gray-300 text-gray-800",
  3: "bg-amber-600 text-white",
};

export default function RecommendationCards({
  recommendations,
}: RecommendationCardsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="mt-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-[#FF6B35] rounded-lg flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
        <p className="font-bold text-[#1E3A5F] dark:text-white text-sm">
          Top {recommendations.length} Policy Recommendations
        </p>
        <span className="text-xs text-gray-400 font-hindi ml-1">
          आपके लिए शीर्ष पॉलिसी
        </span>
      </div>

      {/* Cards */}
      {recommendations.map((rec) => {
        const isExpanded = expandedId === rec.rank;
        const isTop3 = rec.rank <= 3;

        return (
          <Card
            key={rec.rank}
            className={cn(
              "overflow-hidden border transition-all duration-200",
              rec.rank === 1
                ? "border-yellow-300 shadow-md"
                : "border-gray-100 dark:border-gray-800"
            )}
          >
            {/* Card Header */}
            <div
              className={cn(
                "p-4 cursor-pointer",
                rec.rank === 1
                  ? "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
                  : "bg-white dark:bg-gray-900"
              )}
              onClick={() => setExpandedId(isExpanded ? null : rec.rank)}
            >
              <div className="flex items-start gap-3">
                {/* Rank Badge */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0",
                    rankBadge[rec.rank] ?? "bg-gray-100 text-gray-600"
                  )}
                >
                  {rec.rank === 1 ? (
                    <Award className="w-4 h-4" />
                  ) : (
                    `#${rec.rank}`
                  )}
                </div>

                {/* Policy Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-bold text-[#1E3A5F] dark:text-white text-sm leading-tight">
                        {rec.policy_name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                        {rec.insurer}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        className={cn(
                          "text-xs border",
                          typeColors[rec.policy_type] ?? typeColors.other
                        )}
                      >
                        {rec.policy_type}
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#1E3A5F]" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {rec.sum_insured}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {rec.premium_estimate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {rec.match_score}% match
                      </span>
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="mt-2">
                    <Progress
                      value={rec.match_score}
                      className="h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="px-4 pb-4 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-800 space-y-4 animate-fade-in">
                {/* Why Recommended */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mt-3">
                  <p className="text-xs font-semibold text-[#1E3A5F] dark:text-blue-400 mb-1">
                    💡 Why this is recommended for you
                  </p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {rec.why_recommended}
                  </p>
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Key Features
                  </p>
                  <div className="space-y-1.5">
                    {rec.key_features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium & Cover */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Sum Insured
                    </p>
                    <p className="text-sm font-bold text-[#1E3A5F] dark:text-white">
                      {rec.sum_insured}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Est. Premium
                    </p>
                    <p className="text-sm font-bold text-[#1E3A5F] dark:text-white">
                      {rec.premium_estimate}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl text-xs"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(rec.policy_name + " " + rec.insurer + " India")}`,
                      "_blank"
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

      <p className="text-xs text-gray-400 text-center pt-1">
        * Recommendations are AI-generated. Always verify with the insurer. Not financial advice.
      </p>
    </div>
  );
}