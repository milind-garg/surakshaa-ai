import { createClient } from "@/lib/supabase/server";
import {
  FileText, Upload, MessageSquare,
  TrendingUp, Shield, ArrowRight, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

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

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const totalPolicies = policies?.length ?? 0;

  const quickActions = [
    {
      href: "/upload",
      icon: Upload,
      label: "Upload Policy",
      labelHindi: "पॉलिसी अपलोड करें",
      color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    },
    {
      href: "/chatbot",
      icon: MessageSquare,
      label: "AI Chatbot",
      labelHindi: "AI से पूछें",
      color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      badge: "Recommended",
    },
    {
      href: "/policies",
      icon: FileText,
      label: "View Policies",
      labelHindi: "पॉलिसी देखें",
      color: "bg-green-50 text-green-600 hover:bg-green-100",
    },
    {
      href: "/profile",
      icon: Shield,
      label: "Complete Profile",
      labelHindi: "प्रोफाइल भरें",
      color: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
            Namaste, {firstName}! 🙏
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's your insurance intelligence overview
          </p>
          <p className="text-sm font-hindi text-gray-400 mt-0.5">
            आपका बीमा डैशबोर्ड
          </p>
        </div>
        <Link href="/upload">
          <Button className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            Upload New Policy
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Policies Uploaded", value: totalPolicies, icon: FileText, color: "text-blue-600" },
          { label: "Analyses Complete", value: policies?.filter(p => p.status === "analyzed").length ?? 0, icon: TrendingUp, color: "text-green-600" },
          { label: "Coverage Gaps Found", value: "—", icon: Shield, color: "text-red-500" },
          { label: "AI Chats", value: 0, icon: MessageSquare, color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Profile Incomplete Warning */}
      {!profile?.is_profile_complete && (
        <Card className="p-5 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-orange-800 dark:text-orange-300">
                  Complete your profile for better recommendations
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-hindi">
                  बेहतर सुझावों के लिए प्रोफाइल पूरी करें
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg">
                Complete Now
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className={`${action.color} rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer relative`}>
                {action.badge && (
                  <Badge className="absolute top-2 right-2 text-[10px] bg-[#FF6B35] text-white border-0 px-1.5">
                    {action.badge}
                  </Badge>
                )}
                <action.icon className="w-7 h-7 mb-3" />
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs font-hindi opacity-70 mt-0.5">{action.labelHindi}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Policies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1E3A5F] dark:text-white">
            Recent Policies
          </h2>
          <Link href="/policies">
            <Button variant="ghost" size="sm" className="gap-1 text-[#1E3A5F]">
              View All <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {totalPolicies === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-semibold text-gray-500 dark:text-gray-400 mb-2">
              No policies uploaded yet
            </p>
            <p className="text-sm text-gray-400 font-hindi mb-6">
              अभी तक कोई पॉलिसी अपलोड नहीं की
            </p>
            <Link href="/upload">
              <Button className="bg-[#1E3A5F] text-white rounded-xl">
                Upload Your First Policy
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {policies?.map((policy) => (
              <Card
                key={policy.id}
                className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow border-gray-100 dark:border-gray-800"
              >
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#1E3A5F] dark:text-white truncate">
                    {policy.file_name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(policy.created_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <Badge
                  className={
                    policy.status === "analyzed"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : policy.status === "processing"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-gray-50 text-gray-700 border-gray-200"
                  }
                >
                  {policy.status}
                </Badge>
                <Link href={`/policies/${policy.id}`}>
                  <Button variant="ghost" size="icon" className="rounded-lg">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}