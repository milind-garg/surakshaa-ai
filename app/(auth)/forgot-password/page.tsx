"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "../actions";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result?.success) {
        setSent(true);
        toast.success(result.success);
      }
    });
  };

  return (
    <div className="relative z-10 space-y-6 animate-fade-in">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

        {sent ? (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-[#1E3A5F] dark:text-white mb-2">
              Email Sent!
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Check your inbox for the password reset link.
            </p>
            <p className="text-gray-400 font-hindi text-sm mb-6">
              अपना ईमेल जांचें
            </p>
            <Link href="/login">
              <Button className="bg-[#1E3A5F] text-white rounded-xl w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          /* Form State */
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#1E3A5F] dark:text-white">
                Reset Password
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Enter your email and we'll send a reset link
              </p>
              <p className="text-[#FF6B35] font-hindi text-sm mt-1">
                पासवर्ड रीसेट करें
              </p>
            </div>

            <form action={handleSubmit} className="space-y-5">
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
                    className="pl-9 rounded-xl border-gray-200 dark:border-gray-700 h-11"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl h-11 font-semibold"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="text-center">
        <Link
          href="/login"
          className="text-blue-200 hover:text-white text-sm inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Login
        </Link>
      </div>
    </div>
  );
}