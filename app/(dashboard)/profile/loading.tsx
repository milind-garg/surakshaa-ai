"use client";

import { Card } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="space-y-6 max-w-4xl animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 bg-slate-100 rounded-md" />
        </div>
        <div className="h-9 w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* Profile Card Skeleton */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-36 bg-slate-100 rounded-md" />
          </div>
        </div>

        {/* Info Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-5 w-32 bg-slate-200 rounded-md" />
            </div>
          ))}
        </div>
      </Card>

      {/* Family Members Skeleton */}
      <Card className="p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-4">
        <div className="h-6 w-40 bg-slate-200 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-3 w-36 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
