"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions";
import toast from "react-hot-toast";

const passwordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];
const strengthColor = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"];

const benefits = [
  "Upload & analyze unlimited policies",
  "AI explanations in Hindi & English",
  "Personalized insurance recommendations",
  "100% free — no credit card needed",
];

import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useLanguage();

  const strength = passwordStrength(password);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signUp(formData);
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
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
            <span>{t("FREE FOREVER • NO CREDIT CARD", "हमेशा मुफ़्त • कोई क्रेडिट कार्ड नहीं")}</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-28 h-28 rounded-3xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center mx-auto mb-4 shadow-sm shrink-0 p-1">
            <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain scale-110" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {t("Create Free Account", "निःशुल्क खाता बनाएं")}
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            {t(
              "Start analyzing insurance policies in seconds",
              "कुछ ही सेकंड में बीमा पॉलिसियों का विश्लेषण शुरू करें"
            )}
          </p>
        </div>

        {/* Benefits Box */}
        <div className="bg-[#0A1118] border border-slate-800 rounded-xl p-4 mb-6 space-y-2 text-white font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-teal-400 font-bold uppercase tracking-wider">
            <span>INSTANT PLATFORM ACCESS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </div>
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-slate-300 text-[11px]">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Rahul Sharma"
                required
                className="pl-10 rounded-xl border-slate-200 focus:border-[#1D7A6C] h-11 text-sm bg-slate-50/50"
              />
            </div>
          </div>

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
                className="pl-10 rounded-xl border-slate-200 focus:border-[#1D7A6C] h-11 text-sm bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-wider">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1 font-mono">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        level <= strength ? strengthColor[strength] : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-500">
                  Strength:{" "}
                  <span className="font-semibold text-slate-800">{strengthLabel[strength]}</span>
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5">
              <p className="text-red-600 text-xs font-medium">{error}</p>
            </div>
          )}

          {/* Terms */}
          <p className="text-[11px] text-slate-500 text-center font-sans leading-relaxed">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#1D7A6C] font-semibold hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#1D7A6C] font-semibold hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl h-11 text-sm font-semibold shadow-xs gap-2 transition-all duration-200 mt-2"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <>
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Login Link */}
      <p className="text-center text-slate-600 text-xs">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#1D7A6C] font-semibold hover:underline"
        >
          Log in here
        </Link>
      </p>
    </motion.div>
  );
}