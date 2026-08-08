"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
    <div className="relative z-10 space-y-6">
      {/* Card */}
      <div className="bg-white rounded-xl shadow-xs p-8 border border-slate-200">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            Create Your Account
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Start understanding your insurance today
          </p>
          <p className="text-[#1D7A6C] font-hindi text-xs mt-1 font-medium">
            आज ही शुरू करें — बिल्कुल मुफ़्त
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 mb-6 space-y-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#1D7A6C] shrink-0" />
              <span className="text-xs text-slate-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-medium text-slate-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Rahul Sharma"
                required
                className="pl-9 rounded-lg border-slate-200 focus:border-[#1D7A6C] h-10 text-sm"
              />
            </div>
          </div>

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
                className="pl-9 rounded-lg border-slate-200 focus:border-[#1D7A6C] h-10 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= strength ? strengthColor[strength] : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">
                  Password strength:{" "}
                  <span className="font-medium">{strengthLabel[strength]}</span>
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-slate-500 text-center">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#1D7A6C] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#1D7A6C] hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg h-10 text-sm font-medium shadow-xs gap-2 transition-colors"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
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
    </div>
  );
}