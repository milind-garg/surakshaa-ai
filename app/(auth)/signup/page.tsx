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
    <div className="relative z-10 space-y-6 animate-fade-in">
      {/* Card */}
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
            Create Your Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Start understanding your insurance today
          </p>
          <p className="text-[#FF6B35] font-hindi text-sm mt-1">
            आज ही शुरू करें — बिल्कुल मुफ़्त
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6 space-y-2">
          {benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <span className="text-xs text-gray-600 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Rahul Sharma"
                required
                className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#1E3A5F] h-11"
              />
            </div>
          </div>

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
                className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 focus:border-[#1E3A5F] h-11"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 6 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= strength ? strengthColor[strength] : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Password strength:{" "}
                  <span className="font-medium">{strengthLabel[strength]}</span>
                </p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            By signing up, you agree to our{" "}
            <Link href="#" className="text-[#1E3A5F] dark:text-blue-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-[#1E3A5F] dark:text-blue-400 hover:underline">
              Privacy Policy
            </Link>
          </p>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl h-11 font-semibold shadow-lg gap-2 transition-all hover:-translate-y-0.5"
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
      <p className="text-center text-blue-200 text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-white font-semibold hover:text-[#FF6B35] transition-colors"
        >
          Log in here
        </Link>
      </p>
    </div>
  );
}