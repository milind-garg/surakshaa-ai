"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function UploadHeader() {
  const { t } = useLanguage();

  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-3">
        <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C] animate-pulse" />
        <span>{t("OCR ENGINE v3.0 • GOOGLE VISION & GEMINI AI", "ओसीआर इंजन v3.0 • गूगल विजन एवं एआई")}</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {t("Upload Insurance Policy", "बीमा पॉलिसी अपलोड करें")}
      </h1>
      <p className="text-slate-500 text-sm mt-1">
        {t(
          "Upload any health or life policy PDF or image for instant AI clause extraction and gap analysis",
          "तुरंत एआई क्लॉज विश्लेषण और कमियों की जांच के लिए स्वास्थ्य या जीवन नीति पीडीएफ या छवि अपलोड करें"
        )}
      </p>
    </div>
  );
}
