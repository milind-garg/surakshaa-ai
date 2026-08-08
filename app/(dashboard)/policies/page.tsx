import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  FileText, Upload, CheckCircle,
  Clock, AlertCircle, ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeletePolicyButton from "@/components/policy/DeletePolicyButton";

const statusConfig = {
  analyzed: {
    label: "Analyzed",
    icon: CheckCircle,
    className: "bg-teal-50 text-[#1D7A6C] border-teal-100 font-mono text-[10px] uppercase",
    iconClass: "text-[#1D7A6C]",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200 font-mono text-[10px] uppercase",
    iconClass: "text-amber-500",
  },
  uploading: {
    label: "Uploading",
    icon: Clock,
    className: "bg-slate-50 text-slate-700 border-slate-200 font-mono text-[10px] uppercase",
    iconClass: "text-slate-500",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200 font-mono text-[10px] uppercase",
    iconClass: "text-red-500",
  },
};

export default async function PoliciesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: policies } = await supabase
    .from("policies")
    .select(`*, policy_analyses(policy_name, policy_type, insurer, sum_insured, claim_success_probability, coverage_gaps)`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const totalPolicies = policies?.length ?? 0;
  const analyzedCount = policies?.filter((p) => p.status === "analyzed").length ?? 0;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Policies
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {totalPolicies} {totalPolicies === 1 ? "policy" : "policies"} uploaded ·{" "}
            {analyzedCount} analyzed
          </p>
          <p className="text-xs font-hindi text-[#1D7A6C] font-medium">मेरी बीमा पॉलिसी</p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 shadow-xs text-sm font-medium">
            <Upload className="w-4 h-4" />
            Upload New Policy
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Uploaded", value: totalPolicies },
          { label: "Analyzed", value: analyzedCount },
          {
            label: "Pending",
            value: policies?.filter((p) => p.status === "processing" || p.status === "uploading").length ?? 0,
          },
          {
            label: "Errors",
            value: policies?.filter((p) => p.status === "error").length ?? 0,
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-slate-200 bg-white rounded-xl text-center shadow-xs">
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Policies List */}
      {totalPolicies === 0 ? (
        <Card className="p-12 text-center border-dashed border-2 border-slate-200 rounded-xl">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-700 mb-1">
            No policies yet
          </h2>
          <p className="text-slate-400 font-hindi text-xs mb-4">अभी तक कोई पॉलिसी नहीं</p>
          <Link href="/upload">
            <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg px-6 text-xs font-medium">
              Upload Your First Policy
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {policies?.map((policy) => {
            const analysis = (policy as any).policy_analyses?.[0];
            const status = statusConfig[policy.status as keyof typeof statusConfig] ?? statusConfig.error;
            const StatusIcon = status.icon;

            return (
              <Card
                key={policy.id}
                className="p-5 border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-start gap-4 flex-wrap">

                  {/* File Icon */}
                  <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#1D7A6C]" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-bold text-slate-900 truncate max-w-sm text-sm sm:text-base">
                          {analysis?.policy_name ?? policy.file_name}
                        </h3>
                        {analysis && (
                          <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            {analysis.insurer} · {analysis.policy_type}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Uploaded {new Date(policy.created_at).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`${status.className} border text-xs gap-1`}>
                          <StatusIcon className={`w-3 h-3 ${status.iconClass}`} />
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Analysis Stats */}
                    {analysis && (
                      <div className="flex items-center gap-4 mt-3 flex-wrap font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Sum Insured:</span>
                          <span className="font-bold text-slate-900">
                            ₹{((analysis.sum_insured ?? 0) / 100000).toFixed(1)}L
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-500">Claim Success:</span>
                          <span className="font-bold text-[#1D7A6C]">
                            {analysis.claim_success_probability ?? 0}%
                          </span>
                        </div>
                        {analysis.coverage_gaps?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-amber-700 font-semibold">
                              {analysis.coverage_gaps.length} gap{analysis.coverage_gaps.length !== 1 ? "s" : ""} found
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions — Delete + View */}
                  <div className="flex items-center gap-2 shrink-0">
                    <DeletePolicyButton
                      policyId={policy.id}
                      fileName={policy.file_name ?? "this policy"}
                      filePath={policy.file_path ?? ""}
                    />

                    {policy.status === "analyzed" && (
                      <Link href={`/policies/${policy.id}`}>
                        <Button
                          size="sm"
                          className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-1.5 text-xs font-medium"
                        >
                          View Analysis
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    )}
                    {policy.status === "error" && (
                      <Link href="/upload">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg text-xs border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Re-upload
                        </Button>
                      </Link>
                    )}
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