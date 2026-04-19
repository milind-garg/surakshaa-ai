"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// ─── Sign Up ────────────────────────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    return { error: "Please fill in all fields." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "This email is already registered. Please log in." };
    }
    return { error: error.message };
  }

  // Update profile name (trigger already created the row)
  if (data.user) {
    await supabase
      .from("user_profiles")
      .update({ full_name: fullName })
      .eq("user_id", data.user.id);
  }

  redirect("/dashboard");
}

// ─── Sign In ────────────────────────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const supabase = createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password. Please try again." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before logging in." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}

// ─── Sign Out ────────────────────────────────────────────────────────────────
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ─── Reset Password ──────────────────────────────────────────────────────────
export async function resetPassword(formData: FormData) {
  const supabase = createClient();
  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Please enter your email address." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent! Check your email." };
}