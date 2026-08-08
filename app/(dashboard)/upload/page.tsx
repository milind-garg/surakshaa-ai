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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Upload Policy
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Upload your insurance document for instant AI analysis
        </p>
        <p className="text-xs font-hindi text-[#1D7A6C] mt-0.5 font-medium">
          अपनी बीमा पॉलिसी अपलोड करें — AI तुरंत विश्लेषण करेगा
        </p>
      </div>

      <UploadContainer />
    </div>
  );
}