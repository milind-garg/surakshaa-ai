"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, Bell, Search, FileText, CheckCircle2, AlertCircle, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import LanguageToggle from "@/components/shared/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useSidebar } from "@/context/SidebarContext";

export default function DashboardNav({ user }: { user: User }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("suraksha_user_avatar");
      if (saved) setAvatarUrl(saved);
    }

    const fetchProfileName = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      if (data?.full_name) {
        setFullName(data.full_name);
      }
    };
    fetchProfileName();
  }, [user.id]);

  const displayName = fullName || user.user_metadata?.full_name || user.email?.split("@")[0] || "Valued User";

  const initials = displayName
    ? displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() ?? "SA";

  // Handle Search Input Change & Live Search
  useEffect(() => {
    const fetchMatchingPolicies = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("policies")
        .select("id, file_name, file_type, created_at, status")
        .eq("user_id", user.id)
        .ilike("file_name", `%${searchQuery.trim()}%`)
        .limit(5);

      setSearchResults(data || []);
      setShowSearchResults(true);
    };

    const timer = setTimeout(fetchMatchingPolicies, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, user.id]);

  // Click Outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(false);
      router.push(`/policies?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initialNotifications = [
    {
      id: "1",
      title: t("Welcome to Suraksha AI!", "सुरक्षा एआई में आपका स्वागत है!"),
      message: t("Upload your health policy for AI gap analysis.", "अपनी स्वास्थ्य नीति अपलोड करके एआई विश्लेषण प्राप्त करें।"),
      time: t("Just now", "अभी"),
      type: "info",
    },
    {
      id: "2",
      title: t("OREVA AI Advisor Ready", "ओरेवा एआई सलाहकार तैयार है"),
      message: t("Ask OREVA any clause or coverage questions.", "अपनी नीति से जुड़े कोई भी प्रश्न ओरेवा से पूछें।"),
      time: t("5m ago", "5 मिनट पहले"),
      type: "success",
    },
  ];

  const [notifications, setNotifications] = useState(initialNotifications);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left Side: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                toggleMobileSidebar();
              } else {
                toggleSidebar();
              }
            }}
            className="rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-900 cursor-pointer"
            title={t("Toggle Sidebar", "साइडबार टॉगल करें")}
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </Button>

          <Link href="/dashboard" className="flex items-center">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xs border border-slate-200 bg-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain scale-115" />
            </div>
          </Link>
        </div>

        {/* Functional Search */}
        <div className="hidden md:flex items-center w-80 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              placeholder={t("Search policies by name...", "पॉलिसी का नाम खोजें...")}
              className="pl-9 pr-8 bg-slate-50 border-slate-200 rounded-xl text-sm focus:border-[#1D7A6C] font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setShowSearchResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search Dropdown Overlay */}
          {showSearchResults && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-50 animate-in fade-in-80 duration-150">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                {t("Matching Policies", "मिलती-जुलती पॉलिसियां")} ({searchResults.length})
              </div>
              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-center text-xs text-slate-500 font-sans">
                  {t("No policies found matching query", "कोई मिलती-जुलती पॉलिसी नहीं मिली")}
                </div>
              ) : (
                searchResults.map((policy) => (
                  <Link
                    key={policy.id}
                    href={`/policies/${policy.id}`}
                    onClick={() => setShowSearchResults(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="w-7 h-7 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-[#1D7A6C]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 truncate">
                        {policy.file_name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {policy.file_type} · {new Date(policy.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5">
          {/* Global Language Toggle Dropdown */}
          <LanguageToggle />

          {/* Notifications Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-xl">
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1D7A6C] rounded-full animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 shadow-lg">
              <div className="flex items-center justify-between px-3 py-2">
                <DropdownMenuLabel className="p-0 font-extrabold text-slate-900 text-sm">
                  {t("Notifications", "सूचनाएं")}
                </DropdownMenuLabel>
                {unreadNotifications > 0 && (
                  <button
                    onClick={() => setUnreadNotifications(0)}
                    className="text-[11px] text-[#1D7A6C] hover:underline font-medium"
                  >
                    {t("Mark as read", "पढ़ा हुआ चिन्हित करें")}
                  </button>
                )}
              </div>
              <DropdownMenuSeparator className="my-1" />
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-2.5 bg-slate-50/80 hover:bg-slate-100/60 rounded-xl transition-colors">
                    <div className="w-7 h-7 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1D7A6C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-sans leading-snug">
                        {n.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2.5 rounded-xl px-2 py-1 hover:bg-slate-100/80">
                <Avatar className="w-8 h-8 border border-slate-200">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="User Avatar" className="object-cover" /> : null}
                  <AvatarFallback className="bg-[#1D7A6C] text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-semibold text-slate-800 max-w-40 truncate">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-lg p-1.5">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-sm font-extrabold text-slate-900 truncate leading-snug">{displayName}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link href="/profile" className="font-semibold text-slate-700">
                  {t("My Profile", "मेरी प्रोफाइल")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                <Link href="/dashboard" className="font-semibold text-slate-700">
                  {t("Dashboard", "डैशबोर्ड")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 font-semibold cursor-pointer focus:text-red-600 focus:bg-red-50 rounded-xl"
              >
                {t("Sign Out", "साइन आउट")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

