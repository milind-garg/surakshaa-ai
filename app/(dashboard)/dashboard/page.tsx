import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const firstName = profile?.full_name?.split(" ")[0] ?? "there";
  const totalPolicies = policies?.length ?? 0;
  const analyzedCount = policies?.filter((p) => p.status === "analyzed").length ?? 0;

  return (
    <DashboardClient
      firstName={firstName}
      totalPolicies={totalPolicies}
      analyzedCount={analyzedCount}
      profile={profile}
      latestRecommendations={latestRecommendations}
      policies={policies ?? []}
    />
  );
}
