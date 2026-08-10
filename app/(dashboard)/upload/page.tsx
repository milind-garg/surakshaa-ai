import { Metadata } from "next";
import UploadContainer from "@/components/policy/UploadContainer";

import UploadHeader from "@/components/policy/UploadHeader";

export const metadata: Metadata = {
  title: "Upload Policy — Suraksha AI",
};

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <UploadHeader />
      <UploadContainer />
    </div>
  );
}