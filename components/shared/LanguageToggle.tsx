"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: "en", label: "English", nativeLabel: "English" },
    { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100/80 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs font-sans text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1D7A6C]/20",
          isOpen && "border-[#1D7A6C]/50 ring-2 ring-[#1D7A6C]/10 bg-white"
        )}
      >
        <Globe className="w-4 h-4 text-[#1D7A6C]" />
        <span className={cn("font-semibold text-slate-800", currentLang.code === "hi" && "font-hindi")}>
          {currentLang.nativeLabel}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-lg py-1.5 z-50 animate-in fade-in-80 zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Language / भाषा
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer",
                  isSelected
                    ? "bg-teal-50/80 text-[#1D7A6C] font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn(lang.code === "hi" && "font-hindi font-medium")}>
                    {lang.nativeLabel}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    ({lang.label})
                  </span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1D7A6C]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
