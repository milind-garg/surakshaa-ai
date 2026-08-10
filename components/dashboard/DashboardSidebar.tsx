"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Upload, FileText,
  MessageSquare, User, TrendingUp, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    labelHindi: "डैशबोर्ड",
    icon: LayoutDashboard,
  },
  {
    href: "/upload",
    label: "Upload Policy",
    labelHindi: "पॉलिसी अपलोड",
    icon: Upload,
  },
  {
    href: "/policies",
    label: "My Policies",
    labelHindi: "मेरी पॉलिसी",
    icon: FileText,
  },
  {
    href: "/chatbot",
    label: "AI Chatbot",
    labelHindi: "AI सहायक",
    icon: MessageSquare,
    badge: "New",
  },
  {
    href: "/profile",
    label: "My Profile",
    labelHindi: "मेरी प्रोफाइल",
    icon: User,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col z-40">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-[#1D7A6C] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-105",
                  isActive ? "text-white" : "text-slate-400 group-hover:text-[#1D7A6C]"
                )}
              />
              <div className="flex-1">
                <p className="text-xs font-semibold">{item.label}</p>
                <p className={cn(
                  "text-[10px] font-hindi",
                  isActive ? "text-teal-100" : "text-slate-400"
                )}>
                  {item.labelHindi}
                </p>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-teal-500/20 text-teal-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-200">
        <div className="bg-[#0A1118] border border-slate-800 rounded-xl p-4 text-white font-mono text-xs shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-teal-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> AI ENGINE ONLINE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Upload your health or life policy for instant clause extraction in Hindi & English.
          </p>
        </div>
      </div>
    </aside>
  );
}