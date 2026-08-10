"use client";

import { Card } from "@/components/ui/card";

export default function UploadLoading() {
  return (
    <div className="max-w-3xl space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-56 bg-slate-200 rounded-xl" />
        <div className="h-4 w-80 bg-slate-100 rounded-md" />
      </div>

      {/* Dropzone Skeleton */}
      <Card className="p-10 border-2 border-dashed border-slate-200 bg-white rounded-3xl text-center space-y-4">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl mx-auto" />
        <div className="space-y-2">
          <div className="h-5 w-48 bg-slate-200 rounded mx-auto" />
          <div className="h-3 w-64 bg-slate-100 rounded mx-auto" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl mx-auto pt-2" />
      </Card>
    </div>
  );
}
