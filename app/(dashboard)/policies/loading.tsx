"use client";

import { Card } from "@/components/ui/card";

export default function PoliciesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-36 bg-teal-200/80 rounded-xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
        <div className="h-10 w-full sm:w-80 bg-slate-100 rounded-xl" />
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-9 w-20 bg-slate-100 rounded-xl" />
          <div className="h-9 w-20 bg-slate-100 rounded-xl" />
          <div className="h-9 w-20 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Policies Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded" />
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl space-y-1">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded" />
              </div>
            </div>

            <div className="h-9 w-full bg-slate-100 rounded-xl pt-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}
