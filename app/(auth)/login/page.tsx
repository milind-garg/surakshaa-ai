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
    <div className="relative z-10 space-y-6 animate-fade-in">
      {/* Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
            Welcome Back!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Log in to your Suraksha AI account
          </p>
          <p className="text-[#FF6B35] font-hindi text-sm mt-1">
            वापस स्वागत है!
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="rahul@example.com"
                required
                autoComplete="email"
                className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#1E3A5F] h-11"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#1E3A5F] dark:text-blue-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                required
                autoComplete="current-password"
                className="pl-9 pr-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#1E3A5F] h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Demo Credentials Box */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
            <p className="text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
              🧪 For Testing / Demo
            </p>
            <p className="text-amber-700 dark:text-amber-400 text-xs">
              Sign up first with any email, then log in here.
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl h-11 font-semibold shadow-lg gap-2 transition-all hover:-translate-y-0.5"
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
      <p className="text-center text-blue-200 text-sm">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-white font-semibold hover:text-[#FF6B35] transition-colors"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}