import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1D7A6C] flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Suraksha<span className="text-[#1D7A6C]">.ai</span>
          </span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6 text-center">
        <p className="text-slate-500 text-xs">
          © 2026 Suraksha AI · Secure · Private · Made in India 🇮🇳
        </p>
      </div>
    </div>
  );
}