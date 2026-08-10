"use client";

import { Card } from "@/components/ui/card";

export default function ChatbotLoading() {
  return (
    <div className="h-[calc(100vh-6rem)] flex gap-4 animate-pulse">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex flex-col w-64 border border-slate-200 bg-white rounded-2xl p-4 space-y-4">
        <div className="h-10 w-full bg-teal-200/80 rounded-xl" />
        <div className="space-y-2 flex-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main Chat Window Skeleton */}
      <Card className="flex-1 flex flex-col border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        {/* Chat Header Skeleton */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 rounded-xl" />
            <div className="space-y-1">
              <div className="h-4 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-44 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
        </div>

        {/* Chat Messages Area Skeleton */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 bg-slate-200 rounded-xl shrink-0" />
            <div className="p-4 bg-slate-100 rounded-2xl space-y-2 flex-1">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-4 w-5/6 bg-slate-200 rounded" />
            </div>
          </div>

          <div className="flex gap-3 max-w-lg ml-auto flex-row-reverse">
            <div className="w-8 h-8 bg-teal-200 rounded-xl shrink-0" />
            <div className="p-4 bg-[#1D7A6C]/10 rounded-2xl space-y-2 flex-1">
              <div className="h-4 w-4/5 bg-teal-200/60 rounded" />
            </div>
          </div>
        </div>

        {/* Input Bar Skeleton */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="h-12 w-full bg-white border border-slate-200 rounded-2xl" />
        </div>
      </Card>
    </div>
  );
}
