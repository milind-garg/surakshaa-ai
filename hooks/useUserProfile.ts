"use client";

import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setLoading(false);
      setProfile(null);
      return;
    }

    const userId = user.id;

    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (mounted) {
          if (error && error.code !== "PGRST116") {
            console.warn("useUserProfile: Error fetching profile:", error);
          }
          setProfile(data ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.warn("useUserProfile: Failed to fetch profile:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, [user, supabase]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: "Not authenticated" };

    try {
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
    } catch (err) {
      console.error("useUserProfile: Update profile failed:", err);
      return { data: null, error: err };
    }
  };

  return { profile, loading, updateProfile };
}