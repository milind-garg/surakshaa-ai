import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  FileText, Upload, CheckCircle,
  Clock, AlertCircle, ArrowRight, Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const statusConfig = {
  analyzed: {
    label: "Analyzed",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
    iconClass: "text-green-500",
  },
  processing: {
    label: "Processing",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconClass: "text-yellow-500",
  },
  uploading: {
    label: "Uploading",
    icon: Clock,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    iconClass: "text-blue-500",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    className: "bg-red-50 text-red-700 border-red-200",
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
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
            My Policies
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {totalPolicies} {totalPolicies === 1 ? "policy" : "policies"} uploaded ·{" "}
            {analyzedCount} analyzed
          </p>
          <p className="text-sm font-hindi text-gray-400">मेरी बीमा पॉलिसी</p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-md">
            <Upload className="w-4 h-4" />
            Upload New Policy
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Uploaded", value: totalPolicies, color: "text-blue-600" },
          { label: "Analyzed", value: analyzedCount, color: "text-green-600" },
          {
            label: "Pending",
            value: policies?.filter((p) => p.status === "processing" || p.status === "uploading").length ?? 0,
            color: "text-yellow-600",
          },
          {
            label: "Errors",
            value: policies?.filter((p) => p.status === "error").length ?? 0,
            color: "text-red-600",
          },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-gray-100 dark:border-gray-800 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Policies List */}
      {totalPolicies === 0 ? (
        <Card className="p-16 text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
          <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">
            No policies yet
          </h2>
          <p className="text-gray-400 font-hindi mb-6">
            अभी तक कोई पॉलिसी नहीं
          </p>
          <Link href="/upload">
            <Button className="bg-[#1E3A5F] text-white rounded-xl px-8">
              Upload Your First Policy
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {policies?.map((policy) => {
            const analysis = (policy as any).policy_analyses?.[0];
            const status = statusConfig[policy.status as keyof typeof statusConfig] ?? statusConfig.error;
            const StatusIcon = status.icon;

            return (
              <Card
                key={policy.id}
                className="p-5 border-gray-100 dark:border-gray-800 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 flex-wrap">

                  {/* File Icon */}
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="font-bold text-[#1E3A5F] dark:text-white truncate max-w-sm">
                          {analysis?.policy_name ?? policy.file_name}
                        </h3>
                        {analysis && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {analysis.insurer} · {analysis.policy_type}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
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
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">Sum Insured:</span>
                          <span className="text-xs font-semibold text-[#1E3A5F] dark:text-white">
                            ₹{((analysis.sum_insured ?? 0) / 100000).toFixed(1)}L
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500">Claim Success:</span>
                          <span className={`text-xs font-semibold ${
                            (analysis.claim_success_probability ?? 0) >= 75
                              ? "text-green-600"
                              : (analysis.claim_success_probability ?? 0) >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}>
                            {analysis.claim_success_probability ?? 0}%
                          </span>
                        </div>
                        {analysis.coverage_gaps?.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600">
                              {analysis.coverage_gaps.length} gap{analysis.coverage_gaps.length !== 1 ? "s" : ""} found
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {policy.status === "analyzed" && (
                      <Link href={`/policies/${policy.id}`}>
                        <Button
                          size="sm"
                          className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-1.5 text-xs"
                        >
                          View Analysis
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    )}
                    {policy.status === "error" && (
                      <Link href="/upload">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs border-red-200 text-red-600 hover:bg-red-50"
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