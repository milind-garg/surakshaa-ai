"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  annual_income: number | null;
  family_size: number | null;
  health_conditions: string[] | null;
  existing_policies: string[] | null;
  risk_appetite: string | null;
  preferred_language: string | null;
  avatar_url: string | null;
  is_profile_complete: boolean | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: "Not authenticated" };

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (!error && data) {
      setProfile(data);
    }

    return { data, error };
  };

  return { profile, loading, updateProfile };
}