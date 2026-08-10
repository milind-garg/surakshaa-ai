import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PoliciesClient from "./PoliciesClient";

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
    <PoliciesClient
      policies={policies ?? []}
      totalPolicies={totalPolicies}
      analyzedCount={analyzedCount}
    />
  );
}