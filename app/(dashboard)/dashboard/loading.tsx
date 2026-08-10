"use client";

import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <div className="bg-[#0A1118] border border-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="h-6 w-36 bg-slate-800 rounded-md mb-4" />
        <div className="h-9 w-64 sm:w-80 bg-slate-800 rounded-xl mb-3" />
        <div className="h-4 w-full sm:w-96 bg-slate-800/60 rounded-md" />

        {/* Action Button Skeleton */}
        <div className="flex gap-3 mt-6">
          <div className="h-10 w-36 bg-teal-900/80 rounded-xl" />
          <div className="h-10 w-36 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Metrics Stat Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 border-slate-200 bg-white rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="w-8 h-8 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </Card>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="h-6 w-40 bg-slate-200 rounded-lg" />
              <div className="h-4 w-24 bg-slate-100 rounded" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                  <div className="space-y-1">
                    <div className="h-4 w-40 bg-slate-200 rounded" />
                    <div className="h-3 w-28 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-slate-200 rounded-full shrink-0" />
              </div>
            ))}
          </Card>
        </div>

        {/* Right Column Skeleton */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200 bg-white rounded-2xl shadow-xs space-y-4">
            <div className="h-6 w-44 bg-slate-200 rounded-lg" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-4/5 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
