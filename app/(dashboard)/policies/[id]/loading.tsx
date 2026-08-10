"use client";

import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PolicyDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button Skeleton */}
      <Link href="/policies">
        <Button variant="ghost" size="sm" className="gap-2 text-slate-400 text-xs pointer-events-none">
          <ArrowLeft className="w-4 h-4" />
          Back to My Policies
        </Button>
      </Link>

      {/* Header Dark Box Skeleton */}
      <div className="bg-[#0A1118] border border-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="h-6 w-48 bg-slate-800 rounded-md mb-4" />

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="h-6 w-56 sm:w-72 bg-slate-800 rounded-lg" />
              <div className="h-4 w-40 bg-slate-800/60 rounded-md" />
              <div className="h-3 w-28 bg-slate-800/40 rounded-md" />
            </div>
          </div>
          <div className="h-6 w-24 bg-slate-800 rounded-full" />
        </div>

        {/* Key Metrics Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 h-16 flex flex-col items-center justify-center space-y-1">
            <div className="h-5 w-16 bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-800/60 rounded" />
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 h-16 flex flex-col items-center justify-center space-y-1">
            <div className="h-5 w-16 bg-slate-800 rounded" />
            <div className="h-3 w-20 bg-slate-800/60 rounded" />
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 h-16 flex flex-col items-center justify-center space-y-1 col-span-2 sm:col-span-1">
            <div className="h-5 w-12 bg-teal-950/80 rounded" />
            <div className="h-3 w-20 bg-slate-800/60 rounded" />
          </div>
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column Skeletons */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Skeleton */}
          <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="h-5 w-40 bg-slate-200 rounded" />
              <div className="h-7 w-32 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-4/6 bg-slate-100 rounded" />
          </Card>

          {/* Coverage Details Skeleton */}
          <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs space-y-4">
            <div className="h-5 w-36 bg-slate-200 rounded" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-slate-200 rounded-full shrink-0" />
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-48 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-12 bg-teal-100 rounded shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column Skeletons */}
        <div className="space-y-6">
          {/* Claim Probability Gauge Skeleton */}
          <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-10 w-24 bg-slate-200 rounded" />
            <div className="h-2 w-full bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </Card>

          {/* Key Benefits Skeleton */}
          <Card className="p-6 border-slate-200 bg-white rounded-xl shadow-xs space-y-3">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded" />
              <div className="h-3 w-5/6 bg-slate-100 rounded" />
              <div className="h-3 w-4/6 bg-slate-100 rounded" />
            </div>
          </Card>

          {/* Coverage Gaps Skeleton */}
          <Card className="p-6 border-amber-200/60 bg-amber-50/30 rounded-xl shadow-xs space-y-3">
            <div className="h-4 w-28 bg-amber-200/60 rounded" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-amber-100/60 rounded" />
              <div className="h-3 w-4/5 bg-amber-100/60 rounded" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
