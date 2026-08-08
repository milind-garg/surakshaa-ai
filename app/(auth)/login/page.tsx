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
      <div className="bg-white rounded-xl shadow-xs p-8 border border-slate-200">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1D7A6C] rounded-lg flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Welcome Back!
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Log in to your Suraksha AI account
          </p>
          <p className="text-[#1D7A6C] font-hindi text-xs mt-1 font-medium">
            वापस स्वागत है!
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="rahul@example.com"
                required
                autoComplete="email"
                className="pl-9 rounded-lg border-slate-200 focus:border-[#1D7A6C] h-10 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#1D7A6C] hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="pl-9 pr-10 rounded-lg border-slate-200 focus:border-[#1D7A6C] h-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          {/* Demo Credentials Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-slate-800 text-xs font-semibold mb-1">
              🧪 For Testing / Demo
            </p>
            <p className="text-slate-600 text-xs">
              Sign up first with any email, then log in here.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg h-10 text-sm font-medium shadow-xs gap-2 transition-colors"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
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
      <p className="text-center text-slate-600 text-xs">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-[#1D7A6C] font-semibold hover:underline"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}