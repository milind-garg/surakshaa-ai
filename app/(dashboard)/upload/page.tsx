import { Metadata } from "next";
import UploadContainer from "@/components/policy/UploadContainer";

export const metadata: Metadata = {
  title: "Upload Policy — Suraksha AI",
};

export default function UploadPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1E3A5F] dark:text-white">
          Upload Policy
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your insurance document for instant AI analysis
        </p>
        <p className="text-sm font-hindi text-gray-400 mt-0.5">
          अपनी बीमा पॉलिसी अपलोड करें — AI तुरंत विश्लेषण करेगा
        </p>
      </div>

      <UploadContainer />
    </div>
  );
}