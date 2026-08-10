"use client";

import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import type { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

function LayoutContent({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <DashboardNav user={user} />
      <div className="flex">
        <DashboardSidebar />
        <main
          className={cn(
            "flex-1 pt-16 min-h-screen transition-all duration-300 ease-in-out",
            isCollapsed ? "lg:ml-20" : "lg:ml-64"
          )}
        >
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayoutClient({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LayoutContent user={user}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
