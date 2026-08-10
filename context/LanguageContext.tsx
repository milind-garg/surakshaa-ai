"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, hi: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = "suraksha_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (saved === "en" || saved === "hi") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);
  };

  const t = (en: string, hi: string) => {
    if (!mounted) return en; // SSR safety
    return language === "hi" ? hi : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: "en" as Language,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (en: string, hi: string) => en,
    };
  }
  return context;
}
