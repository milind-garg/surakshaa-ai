"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="relative z-10 space-y-6">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/80">

        {/* Top Monospaced Pill Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-mono text-slate-600 uppercase tracking-widest">
            <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
            <span>SECURE DASHBOARD ACCESS</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1D7A6C] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-xs mt-1 font-sans">
            Log in to your Suraksha AI intelligence portal
          </p>
          <p className="text-[#1D7A6C] font-hindi text-xs mt-1 font-medium">
            सुरक्षा एआई खाते में प्रवेश करें
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
    </div>
  );
}