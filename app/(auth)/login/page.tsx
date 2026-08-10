"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions";
import toast from "react-hot-toast";

import { useLanguage } from "@/context/LanguageContext";

import { sanitizeEmail, isValidEmail, isValidPassword } from "@/lib/security";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    const rawEmail = (formData.get("email") as string || "").trim();
    const rawPassword = (formData.get("password") as string || "").trim();

    if (!rawEmail || !rawPassword) {
      const msg = t("Please enter both email and password.", "कृपया ईमेल और पासवर्ड दोनों दर्ज करें।");
      setError(msg);
      toast.error(msg);
      return;
    }

    const cleanEmail = sanitizeEmail(rawEmail);
    if (!isValidEmail(cleanEmail)) {
      const msg = t("Please enter a valid email address (e.g. name@example.com).", "कृपया एक वैध ईमेल पता दर्ज करें (उदा. name@example.com)।");
      setError(msg);
      toast.error(msg);
      return;
    }

    const passCheck = isValidPassword(rawPassword);
    if (!passCheck.valid) {
      const msg = passCheck.message || t("Invalid password format.", "अमान्य पासवर्ड प्रारूप।");
      setError(msg);
      toast.error(msg);
      return;
    }

    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative z-10 space-y-6"
    >
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/80">

        {/* Top Monospaced Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
            <span>{t("SECURE DASHBOARD ACCESS", "सुरक्षित डैशबोर्ड पहुंच")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center mx-auto mb-4 shadow-sm shrink-0">
            <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t("Welcome Back", "वापस स्वागत है")}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            {t(
              "Log in to your Suraksha AI intelligence portal",
              "सुरक्षा एआई इंटेलिजेंस पोर्टल में प्रवेश करें"
            )}
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                className="pl-10 rounded-xl border-slate-200 focus:border-[#1D7A6C] h-11 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#1D7A6C] hover:underline font-medium font-sans"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="pl-10 pr-10 rounded-xl border-slate-200 focus:border-[#1D7A6C] h-11 text-sm bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Aegis Dark Slate Demo Credentials Box */}
          <div className="bg-[#0A1118] border border-slate-800 rounded-xl p-3.5 text-white font-mono text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-teal-400 font-bold uppercase tracking-wider text-[10px]">🧪 QUICK DEMO LOGIN</span>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>
            <p className="text-slate-400 text-[11px]">
              Sign up first with any email, then log in here to access policy analysis & OREVA AI.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl h-11 text-sm font-semibold shadow-xs gap-2 transition-all duration-200 mt-2"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              <>
                Log In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Signup Link */}
      <p className="text-center text-slate-600 text-xs font-sans">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-[#1D7A6C] font-semibold hover:underline"
        >
          Create free account
        </Link>
      </p>
    </motion.div>
  );
}