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
    claimProb >= 75
      ? "text-green-600"
      : claimProb >= 50
        ? "text-yellow-600"
        : "text-red-600";

  const claimBg =
    claimProb >= 75
      ? "bg-green-50 border-green-200"
      : claimProb >= 50
        ? "bg-yellow-50 border-yellow-200"
        : "bg-red-50 border-red-200";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back Button */}
      <Link href="/policies">
        <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
          <ArrowLeft className="w-4 h-4" />
          Back to My Policies
        </Button>
      </Link>

      {/* Policy Header */}
      <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] rounded-3xl p-6 text-white">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {analysis?.policy_name ?? policy.file_name}
              </h1>
              <p className="text-blue-200 text-sm mt-0.5">
                {analysis?.insurer ?? "Insurer not detected"} ·{" "}
                {analysis?.policy_type ?? policy.file_type}
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Uploaded{" "}
                {new Date(policy.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <Badge
            className={
              policy.status === "analyzed"
                ? "bg-green-500/20 text-green-300 border-green-500/30"
                : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
            }
          >
            {policy.status}
          </Badge>
        </div>

        {/* Key Numbers */}
        {analysis && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">
                ₹{((analysis.sum_insured ?? 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-blue-200 text-xs">Sum Insured</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-xl font-bold">
                ₹{((analysis.premium_amount ?? 0) / 1000).toFixed(1)}K
              </p>
              <p className="text-blue-200 text-xs">Premium/Year</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <p className="text-xl font-bold">{claimProb}%</p>
              <p className="text-blue-200 text-xs">Claim Success</p>
            </div>
          </div>
        )}
      </div>

      {/* No Analysis Yet */}
      {!analysis ? (
        <Card className="p-8 text-center border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
          <p className="font-semibold text-yellow-700">
            Analysis not available
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            Please re-upload the document.
          </p>
          <Link href="/upload" className="mt-4 inline-block">
            <Button className="bg-[#1E3A5F] text-white rounded-xl mt-3">
              Re-upload Policy
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* English Summary */}
            <Card className="p-6 border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#1E3A5F]" />
                <h2 className="font-bold text-[#1E3A5F]">
                  Policy Summary (English)
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm">
                {analysis.summary_english}
              </p>
            </Card>

            {/* Hindi Summary */}
            <Card className="p-6 border-orange-100 bg-orange-50/50">
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-[#FF6B35]" />
                <h2 className="font-bold text-[#1E3A5F]">
                  पॉलिसी सारांश (हिंदी)
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed font-hindi text-base">
                {analysis.summary_hindi}
              </p>
            </Card>

            {/* Coverage Details */}
            <Card className="p-6 border-gray-100">
              <h2 className="font-bold text-[#1E3A5F] mb-4">
                Coverage Details
              </h2>
              <div className="space-y-3">
                {((analysis.coverage_details as any[]) ?? []).map(
                  (detail: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        {detail.covered ? (
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {detail.category}
                          </p>
                          {detail.conditions && (
                            <p className="text-xs text-gray-500">
                              {detail.conditions}
                            </p>
                          )}
                        </div>
                      </div>
                      {detail.covered && detail.amount > 0 && (
                        <span className="text-sm font-semibold text-green-700 shrink-0">
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
              <Card className="p-6 border-gray-100">
                <h2 className="font-bold text-[#1E3A5F] mb-3">
                  How to File a Claim
                </h2>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {analysis.claim_process}
                </p>
              </Card>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Claim Probability */}
            <Card className={`p-6 border ${claimBg}`}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-[#1E3A5F]" />
                <h2 className="font-bold text-[#1E3A5F] text-sm">
                  Claim Success Rate
                </h2>
              </div>
              <p className={`text-5xl font-bold ${claimColor} mb-2`}>
                {claimProb}%
              </p>
              <Progress value={claimProb} className="h-2 mb-2" />
              <p className="text-xs text-gray-500">
                {claimProb >= 75
                  ? "High probability — well-structured policy."
                  : claimProb >= 50
                    ? "Moderate — review exclusions carefully."
                    : "Low — significant gaps found."}
              </p>
            </Card>

            {/* Key Benefits */}
            <Card className="p-6 border-gray-100">
              <h2 className="font-bold text-[#1E3A5F] mb-4 text-sm">
                ✅ Key Benefits
              </h2>
              <ul className="space-y-2">
                {(analysis.key_benefits ?? []).map(
                  (benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Coverage Gaps */}
            <Card className="p-6 border-red-100 bg-red-50/50">
              <h2 className="font-bold text-red-700 mb-4 text-sm">
                ⚠️ Coverage Gaps
              </h2>
              <ul className="space-y-2">
                {(analysis.coverage_gaps ?? []).map(
                  (gap: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-red-700">{gap}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 border-blue-100 bg-blue-50/50">
              <h2 className="font-bold text-[#1E3A5F] mb-4 text-sm">
                💡 AI Recommendations
              </h2>
              <ul className="space-y-2">
                {(analysis.recommendations ?? []).map(
                  (rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-[#FF6B35] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{rec}</span>
                    </li>
                  ),
                )}
              </ul>
            </Card>

            {/* Chat CTA */}
            <Card className="p-5 bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] border-0">
              <p className="text-white font-semibold text-sm mb-1">
                Have questions about this policy?
              </p>
              <p className="text-blue-200 text-xs mb-4">
                Ask our AI chatbot for help
              </p>
              <Link href="/chatbot">
                <Button
                  size="sm"
                  className="w-full bg-[#FF6B35] hover:bg-[#e55a24] text-white rounded-xl"
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
