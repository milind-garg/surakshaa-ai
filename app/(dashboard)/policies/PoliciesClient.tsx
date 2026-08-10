"use client";

import {
  FileText, Upload, CheckCircle,
  Clock, AlertCircle, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeletePolicyButton from "@/components/policy/DeletePolicyButton";
import { useLanguage } from "@/context/LanguageContext";

const statusConfig = {
  analyzed: {
    label: "Analyzed",
    labelHindi: "विश्लेषित",
    icon: CheckCircle,
    className: "bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase",
    iconClass: "text-[#1D7A6C]",
  },
  processing: {
    label: "Processing",
    labelHindi: "प्रक्रिया में",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200 font-mono text-[10px] uppercase",
    iconClass: "text-amber-500",
  },
  uploading: {
    label: "Uploading",
    labelHindi: "अपलोडिंग",
    icon: Clock,
    className: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
    iconClass: "text-slate-500",
  },
  error: {
    label: "Error",
    labelHindi: "त्रुटि",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200 font-mono text-[10px] uppercase",
    iconClass: "text-red-500",
  },
};

interface PoliciesClientProps {
  policies: any[];
  totalPolicies: number;
  analyzedCount: number;
}

export default function PoliciesClient({
  policies,
  totalPolicies,
  analyzedCount,
}: PoliciesClientProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">
            <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
            <span>{t("VAULT REPOSITORY", "तिजोरी भण्डार")} • {totalPolicies} {t("DOCUMENTS", "दस्तावेज़")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("My Insurance Policies", "मेरी बीमा पॉलिसियां")}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {totalPolicies} {totalPolicies === 1 ? t("policy", "पॉलिसी") : t("policies", "पॉलिसियां")} {t("stored in encrypted vault", "सुरक्षित तिजोरी में संग्रहित")} ·{" "}
            {analyzedCount} {t("fully analyzed by AI", "एआई द्वारा विश्लेषित")}
          </p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl gap-2 shadow-xs text-sm font-semibold h-11 px-5 transition-colors">
            <Upload className="w-4 h-4" />
            {t("Upload New Policy", "नई पॉलिसी अपलोड करें")}
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t("Total Uploaded", "कुल अपलोड"), value: totalPolicies },
          { label: t("Analyzed", "विश्लेषित"), value: analyzedCount },
          {
            label: t("Pending", "प्रक्रियाधीन"),
            value: policies?.filter((p) => p.status === "processing" || p.status === "uploading").length ?? 0,
          },
          {
            label: t("Errors", "त्रुटियां"),
            value: policies?.filter((p) => p.status === "error").length ?? 0,
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-slate-200 bg-white rounded-2xl text-center shadow-xs">
            <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Policies List */}
      {totalPolicies === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 rounded-2xl">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-1">
            {t("No policies uploaded yet", "अभी तक कोई पॉलिसी अपलोड नहीं की गई")}
          </h2>
          <p className="text-slate-500 text-xs mb-4">
            {t("Upload your health or life policy to see analysis here.", "यहाँ विश्लेषण देखने के लिए अपनी स्वास्थ्य या जीवन पॉलिसी अपलोड करें।")}
          </p>
          <Link href="/upload">
            <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl text-xs font-semibold px-5 h-10">
              {t("Upload Your First Policy", "अपनी पहली पॉलिसी अपलोड करें")}
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {policies.map((policy) => {
            const status = statusConfig[policy.status as keyof typeof statusConfig] ?? statusConfig.processing;
            const StatusIcon = status.icon;
            const analysis = Array.isArray(policy.policy_analyses)
              ? policy.policy_analyses[0]
              : policy.policy_analyses;

            return (
              <Card
                key={policy.id}
                className="p-5 border-slate-200 bg-white rounded-2xl shadow-xs hover:border-[#1D7A6C]/40 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#1D7A6C]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-slate-900 text-base">
                          {analysis?.policy_name || policy.file_name}
                        </h2>
                        <Badge variant="outline" className={status.className}>
                          <StatusIcon className={`w-3 h-3 mr-1 ${status.iconClass}`} />
                          {t(status.label, status.labelHindi)}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {analysis?.insurer && `${analysis.insurer} · `}
                        {policy.file_type} · {new Date(policy.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Link href={`/policies/${policy.id}`}>
                      <Button
                        size="sm"
                        className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl text-xs font-semibold gap-1.5 h-9 px-4"
                      >
                        {t("View Analysis", "विश्लेषण देखें")}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <DeletePolicyButton
                      policyId={policy.id}
                      fileName={policy.file_name}
                      filePath={policy.file_path}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
