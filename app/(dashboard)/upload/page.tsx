import { Metadata } from "next";
import UploadContainer from "@/components/policy/UploadContainer";

export const metadata: Metadata = {
  title: "Upload Policy — Suraksha AI",
};

export default function UploadPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">
          <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C] animate-pulse" />
          <span>OCR ENGINE v3.0 • GOOGLE VISION & GEMINI AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Insurance Policy
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Upload any health or life policy PDF or image for instant AI clause extraction and gap analysis
        </p>
        <p className="text-xs font-hindi text-[#1D7A6C] mt-0.5 font-semibold">
          अपनी बीमा पॉलिसी अपलोड करें — AI तुरंत बारीक अक्षरों का विश्लेषण करेगा
        </p>
      </div>

      <UploadContainer />
    </div>
  );
}