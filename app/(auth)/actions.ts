"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeEmail, sanitizeInput, isValidEmail, isValidPassword } from "@/lib/security";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;
  const rawFullName = formData.get("fullName") as string;

  const email = sanitizeEmail(rawEmail);
  const fullName = sanitizeInput(rawFullName);
  const password = rawPassword ? rawPassword.trim() : "";

  if (!email || !password || !fullName) {
    return { error: "Please fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address format (e.g. name@example.com)." };
  }

  const passValidation = isValidPassword(password);
  if (!passValidation.valid) {
    return { error: passValidation.message };
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
    return { error: sanitizeInput(error.message) };
  }

  if (data.user) {
    await supabase
      .from("user_profiles")
      .upsert({ user_id: data.user.id, full_name: fullName }, { onConflict: "user_id" });
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const rawEmail = formData.get("email") as string;
  const rawPassword = formData.get("password") as string;

  const email = sanitizeEmail(rawEmail);
  const password = rawPassword ? rawPassword.trim() : "";

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address format." };
  }

  const passValidation = isValidPassword(password);
  if (!passValidation.valid) {
    return { error: passValidation.message };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password. Please check your credentials." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before logging in." };
    }
    return { error: sanitizeInput(error.message) };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const rawEmail = formData.get("email") as string;
  const email = sanitizeEmail(rawEmail);

  if (!email) {
    return { error: "Please enter your email address." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email address format." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/update-password&type=recovery`,
  });

  if (error) {
    return { error: sanitizeInput(error.message) };
  }

  return { success: "Password reset link sent! Check your email." };
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const rawPassword = formData.get("password") as string;
  const rawConfirmPassword = formData.get("confirmPassword") as string;

  const password = rawPassword ? rawPassword.trim() : "";
  const confirmPassword = rawConfirmPassword ? rawConfirmPassword.trim() : "";

  if (!password || !confirmPassword) {
    return { error: "Please fill in all fields." };
  }

  const passValidation = isValidPassword(password);
  if (!passValidation.valid) {
    return { error: passValidation.message };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: sanitizeInput(error.message) };
  }

  // LOW-4: Invalidate all existing sessions after password change.
  // This revokes any stolen/compromised session tokens immediately.
  await supabase.auth.signOut({ scope: "global" });

  return { success: "Password updated successfully! Please log in again with your new password." };
}