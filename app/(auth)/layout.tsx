import Link from "next/link";
import { Shield, Lock, CheckCircle2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/80 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Header */}
      <header className="px-6 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
              Suraksha<span className="text-[#1D7A6C]">.ai</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono uppercase tracking-wider text-slate-500">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-[#1D7A6C] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#1D7A6C] animate-pulse" />
              SECURE DASHBOARD ACCESS
            </span>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200/60 bg-white/60 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
          <p>© 2026 Suraksha AI · Enterprise Security · Made for Indian Families 🇮🇳</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/#features" className="hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/#about" className="hover:text-slate-900 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}