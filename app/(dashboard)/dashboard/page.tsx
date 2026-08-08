import { createClient } from "@/lib/supabase/server";
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

export default async function DashboardPage() {
  const supabase = await createClient();

  // ✅ Get user FIRST
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ Now user is declared and safe to use
  const { data: latestRecommendations } = await supabase
    .from("policy_recommendations")
    .select("*")
    .eq("user_id", user!.id)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  const { data: policies } = await supabase
    .from("policies")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // ... rest of your component

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const totalPolicies = policies?.length ?? 0;

  const quickActions = [
    {
      href: "/upload",
      icon: Upload,
      label: "Upload Policy",
      labelHindi: "पॉलिसी अपलोड करें",
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
    },
    {
      href: "/chatbot",
      icon: MessageSquare,
      label: "AI Chatbot",
      labelHindi: "AI से पूछें",
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
      badge: "Recommended",
    },
    {
      href: "/policies",
      icon: FileText,
      label: "View Policies",
      labelHindi: "पॉलिसी देखें",
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
    },
    {
      href: "/profile",
      icon: Shield,
      label: "Complete Profile",
      labelHindi: "प्रोफाइल भरें",
      color: "bg-white text-slate-900 border border-slate-200 hover:border-slate-300",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Namaste, {firstName}! 🙏
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Here's your insurance intelligence overview
          </p>
          <p className="text-xs font-hindi text-slate-400 mt-0.5">
            आपका बीमा डैशबोर्ड
          </p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg gap-2 shadow-xs text-sm font-medium">
            <Plus className="w-4 h-4" />
            Upload New Policy
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Policies Uploaded",
            value: totalPolicies,
            icon: FileText,
          },
          {
            label: "Analyses Complete",
            value: policies?.filter((p) => p.status === "analyzed").length ?? 0,
            icon: TrendingUp,
          },
          {
            label: "Coverage Gaps Found",
            value: "—",
            icon: Shield,
          },
          {
            label: "AI Chats",
            value: 0,
            icon: MessageSquare,
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="p-4 border-slate-200 rounded-xl shadow-xs bg-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#1D7A6C]">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Incomplete Warning */}
      {!profile?.is_profile_complete && (
        <Card className="p-4 border-amber-200 bg-amber-50/60 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <p className="font-semibold text-amber-900 text-xs sm:text-sm">
                  Complete your profile for better recommendations
                </p>
                <p className="text-xs text-amber-700 font-hindi">
                  बेहतर सुझावों के लिए प्रोफाइल पूरी करें
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button
                size="sm"
                className="bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs"
              >
                Complete Now
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
              Latest AI Recommendations
            </h2>
            <Link href="/chatbot">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-[#1D7A6C] hover:text-[#165E53] text-xs"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {((latestRecommendations.recommendations as any[]) ?? [])
              .slice(0, 3)
              .map((rec: any) => (
                <Card
                  key={rec.rank}
                  className="p-4 border-slate-200 rounded-xl bg-white shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-7 h-7 bg-slate-100 rounded flex items-center justify-center text-xs font-mono font-bold text-slate-800">
                      #{rec.rank}
                    </div>
                    <span className="text-[11px] bg-teal-50 text-[#1D7A6C] border border-teal-100 px-2 py-0.5 rounded font-mono font-semibold">
                      {rec.match_score}% match
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
                      className="w-full mt-3 rounded-lg text-xs h-8 border-slate-200 hover:bg-slate-50"
                    >
                      Ask AI for Details
                    </Button>
                  </Link>
                </Card>
              ))}
          </div>
          {((latestRecommendations.recommendations as any[]) ?? []).length ===
            0 && (
            <Card className="p-6 text-center border-dashed border-2 border-slate-200 rounded-xl">
              <p className="text-slate-500 text-sm">No recommendations yet</p>
              <Link href="/chatbot">
                <Button
                  size="sm"
                  className="mt-3 bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs"
                >
                  Get Recommendations
                </Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* No recommendations prompt */}
      {!latestRecommendations && (
        <Card className="p-5 border-slate-200 bg-white rounded-xl shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#1D7A6C]" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                  Get personalized policy recommendations
                </p>
                <p className="text-xs text-slate-500 font-hindi">
                  AI आपके लिए बेस्ट पॉलिसी सुझाएगा
                </p>
              </div>
            </div>
            <Link href="/chatbot">
              <Button size="sm" className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs">
                Chat with AI
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div
                className={`${action.color} rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer relative`}
              >
                {action.badge && (
                  <Badge className="absolute top-2 right-2 text-[9px] font-mono bg-[#1D7A6C] text-white border-0 px-1.5 uppercase">
                    {action.badge}
                  </Badge>
                )}
                <action.icon className="w-6 h-6 mb-2 text-[#1D7A6C]" />
                <p className="font-bold text-xs text-slate-900">{action.label}</p>
                <p className="text-[10px] font-hindi text-slate-500 mt-0.5">
                  {action.labelHindi}
                </p>
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
              Recent Policies
            </h2>
            <p className="text-xs text-slate-400 font-hindi">हाल की पॉलिसियां</p>
          </div>
          <Link href="/policies">
            <Button variant="ghost" size="sm" className="gap-1 text-[#1D7A6C] hover:text-[#165E53] text-xs">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {totalPolicies === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 border-slate-200 rounded-xl">
            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-700 text-sm mb-1">
              No policies uploaded yet
            </p>
            <p className="text-xs text-slate-400 font-hindi mb-4">
              अभी तक कोई पॉलिसी अपलोड नहीं की
            </p>
            <Link href="/upload">
              <Button className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg text-xs font-medium">
                Upload Your First Policy
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {policies?.map((policy, index) => (
              <Link key={policy.id} href={`/policies/${policy.id}`}>
                <Card className="p-4 border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all cursor-pointer group shadow-xs">
                  <div className="flex items-center gap-4">
                    {/* Index + Icon */}
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#1D7A6C]" />
                      </div>
                      <span className="absolute -top-1 -left-1 w-4 h-4 bg-slate-900 text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                        {policy.file_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[11px] text-slate-400">
                          Uploaded{" "}
                          {new Date(policy.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                        {policy.policy_type && (
                          <>
                            <span className="text-slate-300">·</span>
                            <p className="text-[11px] text-slate-400 capitalize font-mono">
                              {policy.policy_type}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      <Badge
                        className={
                          policy.status === "analyzed"
                            ? "bg-teal-50 text-[#1D7A6C] border border-teal-100 font-mono text-[10px] uppercase"
                            : policy.status === "processing"
                              ? "bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] uppercase"
                              : "bg-slate-50 text-slate-600 border border-slate-200 font-mono text-[10px] uppercase"
                        }
                      >
                        {policy.status === "analyzed"
                          ? "✓ Analyzed"
                          : policy.status === "processing"
                            ? "⏳ Processing"
                            : policy.status}
                      </Badge>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1D7A6C] group-hover:translate-x-0.5 transition-all shrink-0" />
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
