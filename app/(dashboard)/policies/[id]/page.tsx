import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ArrowLeft,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import PolicySummaryToggle from "@/components/policy/PolicySummaryToggle";

import Link from "next/link";

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ── await params (required in Next.js 15+) ───────────────
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch policy
  const { data: policy } = await supabase
    .from("policies")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!policy) notFound();

  // Fetch analysis
  const { data: analysis } = await supabase
    .from("policy_analyses")
    .select("*")
    .eq("policy_id", id)
    .single();

  const claimProb = analysis?.claim_success_probability ?? 0;

  const claimColor =
    claimProb === 0
      ? "text-gray-400"
      : claimProb >= 75
        ? "text-green-600"
        : claimProb >= 50
          ? "text-yellow-600"
          : "text-red-600";

  const claimBg =
    claimProb === 0
      ? "bg-gray-50 border-gray-200"
      : claimProb >= 75
        ? "bg-green-50 border-green-200"
        : claimProb >= 50
          ? "bg-yellow-50 border-yellow-200"
          : "bg-red-50 border-red-200";

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/policies">
        <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900 text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to My Policies
        </Button>
      </Link>

      {/* Policy Header (Aegis Dark Slate Box) */}
      <div className="bg-[#0A1118] border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                {analysis?.policy_name ?? policy.file_name}
              </h1>
              <p className="text-slate-400 text-xs font-mono mt-0.5">
                {analysis?.insurer ?? "Insurer not detected"} ·{" "}
                {analysis?.policy_type ?? policy.file_type}
              </p>
              <p className="text-slate-500 text-[11px] font-mono mt-1">
                Uploaded{" "}
                {new Date(policy.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <Badge
            className={
              policy.status === "analyzed"
                ? "bg-teal-500/10 text-teal-400 border-teal-500/20 font-mono text-xs uppercase"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono text-xs uppercase"
            }
          >
            {policy.status}
          </Badge>
        </div>

        {/* Key Numbers */}
        {analysis && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-center">
              <p className="text-xl font-bold font-sans text-white">
                ₹{((analysis.sum_insured ?? 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-slate-400 text-[11px] font-mono uppercase">Sum Insured</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-center">
              <p className="text-xl font-bold font-sans text-white">
                ₹{((analysis.premium_amount ?? 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-slate-400 text-[11px] font-mono uppercase">Premium/Year</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xl font-bold font-sans text-teal-400">{claimProb}%</p>
              <p className="text-slate-400 text-[11px] font-mono uppercase">Claim Success</p>
            </div>
          </div>
        )}
      </div>

      {/* No Analysis Yet */}
      {!analysis ? (
        <Card className="p-8 text-center border-amber-200 bg-amber-50 rounded-xl">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <p className="font-bold text-amber-800 text-sm">
            Analysis not available
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Please re-upload the document.
          </p>
          <Link href="/upload" className="mt-4 inline-block">
            <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs font-medium">
              Re-upload Policy
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <PolicySummaryToggle
              summaryEnglish={analysis.summary_english ?? ""}
              summaryHindi={analysis.summary_hindi ?? ""}
            />

            {/* Coverage Details */}
            <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
              <h2 className="font-bold text-slate-900 mb-4 text-base">
                Coverage Details
              </h2>
              <div className="space-y-2.5">
                {((analysis.coverage_details as any[]) ?? []).map(
                  (detail: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {detail.covered ? (
                          <CheckCircle className="w-4 h-4 text-[#1D7A6C] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {detail.category}
                          </p>
                          {detail.conditions && (
                            <p className="text-xs text-slate-500">
                              {detail.conditions}
                            </p>
                          )}
                        </div>
                      </div>
                      {detail.covered && detail.amount > 0 && (
                        <span className="text-xs font-mono font-bold text-[#1D7A6C] shrink-0">
                          ₹{(detail.amount / 100000).toFixed(1)}L
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </Card>

            {/* Claim Process */}
            {analysis.claim_process && (
              <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
                <h2 className="font-bold text-slate-900 mb-3 text-base">
                  How to File a Claim
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {analysis.claim_process}
                </p>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Claim Probability */}
            <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#1D7A6C]" />
                <h2 className="font-bold text-slate-900 text-sm">
                  Claim Success Rate
                </h2>
              </div>
              <p className={`text-4xl font-bold font-mono ${claimColor} mb-2`}>
                {claimProb}%
              </p>
              <Progress value={claimProb} className="h-2 mb-2 bg-slate-100" />
              <p className="text-xs text-slate-500">
                {claimProb === 0
                  ? "Not an insurance document — no claim data available."
                  : claimProb >= 75
                    ? "High probability — well-structured policy."
                    : claimProb >= 50
                      ? "Moderate — review exclusions carefully."
                      : "Low — significant gaps found."}
              </p>
            </Card>

            {/* Key Benefits */}
            <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs">
              <h2 className="font-bold text-slate-900 mb-3 text-sm">
                ✅ Key Benefits
              </h2>
              <ul className="space-y-2">
                {(analysis.key_benefits ?? []).map(
                  (benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1D7A6C] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 leading-relaxed">{benefit}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Coverage Gaps */}
            <Card className="p-6 border-amber-200 bg-amber-50/50 rounded-xl shadow-xs">
              <h2 className="font-bold text-amber-900 mb-3 text-sm">
                ⚠️ Coverage Gaps
              </h2>
              <ul className="space-y-2">
                {(analysis.coverage_gaps ?? []).map(
                  (gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-amber-800 leading-relaxed">{gap}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 border-teal-100 bg-teal-50/30 rounded-xl shadow-xs">
              <h2 className="font-bold text-slate-900 mb-3 text-sm">
                💡 AI Recommendations
              </h2>
              <ul className="space-y-2">
                {(analysis.recommendations ?? []).map(
                  (rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-[#1D7A6C] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 leading-relaxed">{rec}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Chat CTA */}
            <Card className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-white">
              <p className="text-white font-bold text-xs mb-1">
                Have questions about this policy?
              </p>
              <p className="text-slate-400 text-xs mb-4">
                Ask our AI chatbot for help
              </p>
              <Link href="/chatbot">
                <Button
                  size="sm"
                  className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs font-medium"
                >
                  Open AI Chatbot
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
