"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Menu, X, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
];

import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: t("Home", "मुख्य पृष्ठ") },
    { href: "#features", label: t("Features", "विशेषताएं") },
    { href: "#how-it-works", label: t("How It Works", "यह कैसे काम करता है") },
    { href: "#about", label: t("About", "हमारे बारे में") },
  ];

  return (
    <motion.header
      initial={{ y: -15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Clean AegisFlow Style Logo */}
        <Link href="/" className="flex items-center group">
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200/80 bg-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 shrink-0">
            <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain scale-115" />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-base font-medium transition-all duration-200",
                pathname === link.href
                  ? "text-slate-900 bg-slate-100 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Language Toggle Pill */}
          <LanguageToggle />

          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-base font-medium rounded-lg h-10 px-4"
            >
              {t("Log In", "लॉग इन")}
            </Button>
          </Link>

          <Link href="/signup">
            <Button
              size="sm"
              className="bg-[#1D7A6C] hover:bg-[#165E53] text-white font-medium rounded-lg px-5 h-10 shadow-xs transition-colors gap-2 text-base"
            >
              <span>{t("Get Started", "शुरू करें")}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-3 border-t border-slate-200">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full border-slate-200 text-slate-800 hover:bg-slate-50" size="sm">
                {t("Log In", "लॉग इन")}
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button
                className="w-full bg-[#1D7A6C] hover:bg-[#165E53] text-white font-medium"
                size="sm"
              >
                {t("Get Started", "शुरू करें")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}