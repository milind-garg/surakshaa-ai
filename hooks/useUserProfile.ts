"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./useAuth";

import type { UserProfile } from "@/types";

export type { UserProfile };

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize client — prevents creating new instances on every render
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      let localExtended: Partial<UserProfile> = {};
      if (typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(`suraksha_ext_profile_${user.id}`);
          if (saved) localExtended = JSON.parse(saved);
        } catch (_) {}
      }

      if (error && error.code !== "PGRST116") {
        console.warn("useUserProfile: Error fetching profile:", error);
      }
      
      const mergedProfile = data ? { ...data, ...localExtended } : localExtended.full_name ? (localExtended as UserProfile) : null;
      setProfile(mergedProfile);
    } catch (err) {
      console.warn("useUserProfile: Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { data: null, error: "Not authenticated" };

    // 1. Save extended physical & lifestyle metrics locally
    if (typeof window !== "undefined") {
      try {
        const extendedObj = {
          height_cm: updates.height_cm,
          weight_kg: updates.weight_kg,
          bmi: updates.bmi,
          smoker: updates.smoker,
          exercise_frequency: updates.exercise_frequency,
        };
        localStorage.setItem(`suraksha_ext_profile_${user.id}`, JSON.stringify(extendedObj));
      } catch (_) {}
    }

    try {
      const fullPayload = {
        user_id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // Try full upsert first
      let { data, error } = await supabase
        .from("user_profiles")
        .upsert(fullPayload, { onConflict: "user_id" })
        .select()
        .single();

      // Fallback: If DB schema lacks physical metrics columns, strip them & retry standard fields
      if (error) {
        console.warn("useUserProfile: Schema mismatch on full upsert, retrying standard fields:", error.message);
        
        const standardPayload: Record<string, any> = {
          user_id: user.id,
          updated_at: new Date().toISOString(),
        };

        const standardKeys: (keyof UserProfile)[] = [
          "full_name",
          "age",
          "gender",
          "occupation",
          "annual_income",
          "family_size",
          "health_conditions",
          "existing_policies",
          "risk_appetite",
          "preferred_language",
          "avatar_url",
          "is_profile_complete",
        ];

        for (const k of standardKeys) {
          if (updates[k] !== undefined) {
            standardPayload[k] = updates[k];
          }
        }

        const retryResult = await supabase
          .from("user_profiles")
          .upsert(standardPayload, { onConflict: "user_id" })
          .select()
          .single();

        data = retryResult.data;
        error = retryResult.error;
      }

      if (error) {
        console.error("useUserProfile: Update profile failed completely:", error);
      } else if (data) {
        const merged = { ...data, ...updates };
        setProfile(merged);
      }

      return { data, error };
    } catch (err) {
      console.error("useUserProfile: Update profile failed with exception:", err);
      return { data: null, error: err };
    }
  };

  return { profile, loading, updateProfile, refetchProfile: fetchProfile };
}