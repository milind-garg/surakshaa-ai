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
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 hidden lg:flex flex-col z-40">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                isActive
                  ? "bg-[#1E3A5F] text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-[#1E3A5F] dark:hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-[#1E3A5F]"
                )}
              />
              <div className="flex-1">
                <p>{item.label}</p>
                <p className={cn(
                  "text-xs font-hindi",
                  isActive ? "text-blue-200" : "text-gray-400"
                )}>
                  {item.labelHindi}
                </p>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-full font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] rounded-xl p-4 text-white">
          <TrendingUp className="w-6 h-6 mb-2 text-[#FF6B35]" />
          <p className="text-xs font-semibold mb-1">Pro Tip</p>
          <p className="text-xs text-blue-200 leading-relaxed">
            Upload your policy to get an instant AI analysis in Hindi or English.
          </p>
        </div>
      </div>
    </aside>
  );
}