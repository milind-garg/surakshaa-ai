"use client";

import {
  FileText,
  Upload,
  MessageSquare,
  TrendingUp,
  Shield,
  ArrowRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardClientProps {
  firstName: string;
  totalPolicies: number;
  analyzedCount: number;
  profile: any;
  latestRecommendations: any;
  policies: any[];
}

export default function DashboardClient({
  firstName,
  totalPolicies,
  analyzedCount,
  profile,
  latestRecommendations,
  policies,
}: DashboardClientProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      href: "/upload",
      icon: Upload,
      label: t("Upload Policy", "पॉलिसी अपलोड करें"),
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
    },
    {
      href: "/chatbot",
      icon: MessageSquare,
      label: t("Ask OREVA AI", "AI से सवाल पूछें"),
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
      badge: t("Recommended", "सुझावित"),
    },
    {
      href: "/policies",
      icon: FileText,
      label: t("View Policies", "पॉलिसियां देखें"),
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        
        {/* Monospaced Aegis Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
          <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C] animate-pulse" />
          <span>{t("AUTONOMOUS INSURANCE PORTAL • OREVA READY", "स्वायत्त बीमा पोर्टल • ओरेवा तैयार है")}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t(`Namaste, ${firstName}! 🙏`, `नमस्ते, ${firstName}! 🙏`)}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mt-1 max-w-xl font-sans">
              {t(
                "Here is your real-time policy analysis, claim readiness, and AI recommendations.",
                "यह आपका वास्तविक समय का नीति विश्लेषण, दावा तत्परता और एआई सिफारिशें हैं।"
              )}
            </p>
          </div>
          
          <Link href="/upload" className="shrink-0">
            <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl gap-2 shadow-xs text-sm font-semibold h-11 px-5 transition-colors">
              <Plus className="w-4.5 h-4.5" />
              {t("Upload New Policy", "नई पॉलिसी अपलोड करें")}
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Column Metric Divide-Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        {[
          {
            label: t("Policies Uploaded", "कुल अपलोड पॉलिसियां"),
            value: totalPolicies,
            icon: FileText,
          },
          {
            label: t("Analyses Complete", "विश्लेषित पॉलिसियां"),
            value: analyzedCount,
            icon: TrendingUp,
          },
          {
            label: t("Coverage Gaps Found", "कवरेज कमियां"),
            value: totalPolicies > 0 ? t("Active", "सक्रिय") : "—",
            icon: Shield,
          },
          {
            label: t("OREVA AI Status", "ओरेवा एआई स्थिति"),
            value: t("Online", "ऑनलाइन"),
            icon: MessageSquare,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 sm:p-6 bg-white hover:bg-slate-50/80 transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1D7A6C] shrink-0">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-mono uppercase tracking-wider text-slate-500 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Incomplete Warning */}
      {!profile?.is_profile_complete && (
        <Card className="p-4 border-amber-200 bg-amber-50/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-bold text-amber-900 text-xs sm:text-sm">
                  {t(
                    "Complete your profile for personalized policy recommendations",
                    "सटीक सुझाव प्राप्त करने के लिए अपनी प्रोफाइल पूरी करें"
                  )}
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button
                size="sm"
                className="bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold px-4"
              >
                {t("Complete Now", "अभी पूरा करें")}
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* AI Recommendations Card */}
      {latestRecommendations && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {t("Latest AI Recommendations", "नवीनतम एआई सुझाव")}
            </h2>
            <Link href="/chatbot">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-[#1D7A6C] hover:text-[#165E53] text-xs font-semibold"
              >
                {t("View All", "सभी देखें")} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {((latestRecommendations.recommendations as any[]) ?? [])
              .slice(0, 3)
              .map((rec: any) => (
                <Card
                  key={rec.rank}
                  className="p-5 border-slate-200 rounded-2xl bg-white shadow-xs hover:border-[#1D7A6C]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-slate-800">
                      #{rec.rank}
                    </div>
                    <span className="text-[11px] bg-teal-50 text-[#1D7A6C] border border-teal-100 px-2 py-0.5 rounded-md font-mono font-semibold">
                      {rec.match_score}% {t("match", "मेच")}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-sm mt-2">
                    {rec.policy_name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{rec.insurer}</p>
                  <p className="text-xs text-[#1D7A6C] font-semibold mt-2">
                    {rec.premium_estimate}
                  </p>
                  <Link href="/chatbot">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3 rounded-xl text-xs h-9 border-slate-200 hover:bg-slate-50 font-medium"
                    >
                      {t("Ask OREVA for Details", "ओरेवा से विवरण पूछें")}
                    </Button>
                  </Link>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          {t("Quick Actions", "त्वरित कार्रवाइयां")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className={`${action.color} rounded-2xl p-5 transition-all hover:border-[#1D7A6C]/40 hover:shadow-md cursor-pointer relative`}
              >
                {action.badge && (
                  <Badge className="absolute top-3 right-3 text-[9px] font-mono bg-[#1D7A6C] text-white border-0 px-2 py-0.5 uppercase">
                    {action.badge}
                  </Badge>
                )}
                <action.icon className="w-6 h-6 mb-3 text-[#1D7A6C]" />
                <p className="font-bold text-sm text-slate-900">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Policies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t("Recent Policies", "हाल ही में अपलोड की गई पॉलिसियां")}
            </h2>
          </div>
          <Link href="/policies">
            <Button variant="ghost" size="sm" className="gap-1 text-[#1D7A6C] hover:text-[#165E53] text-xs font-semibold">
              {t("View All", "सभी देखें")} <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {totalPolicies === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 border-slate-200 rounded-2xl">
            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800 text-sm mb-1">
              {t("No policies uploaded yet", "अभी तक कोई पॉलिसी अपलोड नहीं की गई")}
            </p>
            <p className="text-xs text-slate-500 mb-4">
              {t("Upload your health or term insurance policy to get AI analysis.", "AI विश्लेषण के लिए अपनी स्वास्थ्य या टर्म पॉलिसी अपलोड करें।")}
            </p>
            <Link href="/upload">
              <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl text-xs font-semibold px-5 h-10">
                {t("Upload Your First Policy", "अपनी पहली पॉलिसी अपलोड करें")}
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {policies?.map((policy, index) => (
              <Link key={policy.id} href={`/policies/${policy.id}`}>
                <Card className="p-4 border-slate-200 rounded-2xl bg-white hover:border-[#1D7A6C]/40 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#1D7A6C]" />
                      </div>
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-slate-900 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-slate-900 text-sm truncate group-hover:text-[#1D7A6C] transition-colors">
                        {policy.file_name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {policy.file_type} · {new Date(policy.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className="capitalize font-mono text-[10px] bg-teal-50 text-[#1D7A6C] border-teal-100">
                        {policy.status}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D7A6C] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
