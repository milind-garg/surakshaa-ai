"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/app/(auth)/actions";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isValidSession, setIsValidSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user has a valid reset session
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
      setChecking(false);
    });

    // Listen for the password recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidSession(true);
          setChecking(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const passwordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
  const strengthColors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];
  const strength = passwordStrength(password);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result?.success) {
        setSuccess(true);
        toast.success("Password updated successfully!");
        // Sign out and redirect to login after 2 seconds
        const supabase = createClient();
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }, 2000);
      }
    });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#2d5986] to-[#1a3354] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#2d5986] to-[#1a3354] flex flex-col">
      {/* Top Bar */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-white text-lg">Suraksha</span>
            <span className="text-[10px] font-medium text-[#FF6B35] tracking-wider uppercase">AI</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">

          {success ? (
            /* ── Success State ── */
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
                Password Updated!
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                Your password has been changed successfully.
              </p>
              <p className="text-[#FF6B35] font-hindi text-sm mb-6">
                पासवर्ड सफलतापूर्वक बदला गया!
              </p>
              <p className="text-gray-400 text-xs mb-4">
                Redirecting to login page...
              </p>
              <Link href="/login">
                <Button className="w-full bg-[#1E3A5F] text-white rounded-xl">
                  Go to Login
                </Button>
              </Link>
            </div>

          ) : !isValidSession ? (
            /* ── Invalid/Expired Session ── */
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">
                Link Expired or Invalid
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                This password reset link has expired or is invalid. Please request a new one.
              </p>
              <Link href="/forgot-password">
                <Button className="w-full bg-[#1E3A5F] text-white rounded-xl mb-3">
                  Request New Reset Link
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full rounded-xl">
                  Back to Login
                </Button>
              </Link>
            </div>

          ) : (
            /* ── Update Password Form ── */
            <div className="bg-white/95 rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[#1E3A5F]">
                  Set New Password
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Choose a strong password for your account
                </p>
                <p className="text-[#FF6B35] font-hindi text-sm mt-1">
                  नया पासवर्ड सेट करें
                </p>
              </div>

              <form action={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-gray-200 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  </div>

                  {/* Password Strength */}
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= strength
                                ? strengthColors[strength]
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">
                        Strength:{" "}
                        <span className="font-medium">{strengthLabels[strength]}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 rounded-xl border-gray-200 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm
                        ? <EyeOff className="w-4 h-4" />
                        : <Eye className="w-4 h-4" />
                      }
                    </button>
                  </div>

                  {/* Match indicator */}
                  {confirmPassword.length > 0 && (
                    <p className={`text-xs font-medium ${
                      password === confirmPassword
                        ? "text-green-600"
                        : "text-red-500"
                    }`}>
                      {password === confirmPassword
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"
                      }
                    </p>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Requirements */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Password requirements:
                  </p>
                  {[
                    { label: "At least 6 characters", met: password.length >= 6 },
                    { label: "Contains a number", met: /[0-9]/.test(password) },
                    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
                  ].map((req) => (
                    <div key={req.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                        req.met ? "bg-green-500" : "bg-gray-300"
                      }`}>
                        {req.met && <span className="text-white text-[8px]">✓</span>}
                      </div>
                      <span className={`text-xs ${req.met ? "text-green-600" : "text-gray-500"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending || password !== confirmPassword || password.length < 6}
                  className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl h-11 font-semibold"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 text-center">
        <p className="text-blue-300 text-xs">
          © 2026 Suraksha AI · Secure · Made in India 🇮🇳
        </p>
      </div>
    </div>
  );
}