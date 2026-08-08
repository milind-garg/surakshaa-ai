"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Bell, Search } from "lucide-react";
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

export default function DashboardNav({ user }: { user: User }) {
  const router = useRouter();
  const initials = user.email?.slice(0, 2).toUpperCase() ?? "SA";

  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("suraksha_user_avatar");
      if (saved) setAvatarUrl(saved);
    }
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1D7A6C] rounded-lg flex items-center justify-center shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 hidden sm:block text-base tracking-tight">
            Suraksha<span className="text-[#1D7A6C]">.ai</span>
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center w-80">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search policies..."
              className="pl-9 bg-slate-50 border-slate-200 rounded-lg text-sm focus:border-[#1D7A6C]"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1D7A6C] rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="font-semibold text-slate-900">
                Notifications
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-2">
                <div className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#1D7A6C] rounded-full mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-900">
                      Welcome to Suraksha AI!
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Upload your first policy to get started.
                    </p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <p className="text-xs text-slate-400">
                  More notifications coming soon
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 rounded-lg">
                <Avatar className="w-8 h-8 border border-slate-200">
                  {avatarUrl ? <AvatarImage src={avatarUrl} alt="User Avatar" className="object-cover" /> : null}
                  <AvatarFallback className="bg-[#1D7A6C] text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-28 truncate">
                  {user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-gray-500">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
