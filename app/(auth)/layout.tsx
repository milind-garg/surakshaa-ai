import Link from "next/link";
import { Shield } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#2d5986] to-[#1a3354] flex flex-col">
      {/* Top Bar */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-white text-lg">Suraksha</span>
            <span className="text-[10px] font-medium text-[#FF6B35] tracking-wider uppercase">
              AI
            </span>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Decorative blobs */}
          <div className="fixed top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl pointer-events-none" />
          {children}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-6 text-center">
        <p className="text-blue-300 text-xs">
          © 2026 Suraksha AI · Secure · Private · Made in India 🇮🇳
        </p>
      </div>
    </div>
  );
}