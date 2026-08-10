"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Upload, FileText,
  MessageSquare, User, TrendingUp, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useLanguage } from "@/context/LanguageContext";
import { useSidebar } from "@/context/SidebarContext";

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
    labelHindi: "मेरी पॉलिसियां",
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
  const { t } = useLanguage();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <>
      {/* ── Mobile Overlay Backdrop ─────────────────────────── */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 lg:hidden animate-in fade-in-80 duration-200"
        />
      )}

      {/* ── Mobile Drawer Sidebar ───────────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200 shadow-2xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Suraksha.ai Shield Logo" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-[#1D7A6C] text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-[#1D7A6C]"
                  )}
                />
                <span className="flex-1 min-w-0 font-sans truncate">
                  {t(item.label, item.labelHindi)}
                </span>
                {item.badge && (
                  <span className="text-[10px] bg-teal-500/20 text-teal-700 font-mono font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Desktop Collapsible Sidebar ─────────────────────── */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 hidden lg:flex flex-col z-40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const labelText = t(item.label, item.labelHindi);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? labelText : undefined}
                className={cn(
                  "flex items-center rounded-xl text-sm font-semibold transition-all group",
                  isCollapsed ? "justify-center px-0 py-3" : "gap-3.5 px-3.5 py-2.5",
                  isActive
                    ? "bg-[#1D7A6C] text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform group-hover:scale-105",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-[#1D7A6C]"
                  )}
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 min-w-0 font-sans text-xs font-semibold truncate">
                      {labelText}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] bg-teal-500/20 text-teal-700 font-mono font-bold px-1.5 py-0.5 rounded uppercase shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom AI Status Section */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200 animate-in fade-in-80 duration-200">
            <div className="bg-[#0A1118] border border-slate-800 rounded-2xl p-4 text-white font-mono text-xs shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-teal-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {t("AI ENGINE ONLINE", "एआई इंजन सक्रिय")}
                </span>
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {t(
                  "Upload your health or life policy for instant clause extraction.",
                  "तुरंत क्लॉज विश्लेषण के लिए अपनी स्वास्थ्य या जीवन नीति अपलोड करें।"
                )}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}