"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-[#1E3A5F] text-lg">
                Suraksha
              </span>
              <span className="text-[10px] font-medium text-[#FF6B35] tracking-wider uppercase">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-[#1E3A5F] bg-blue-50"
                    : "text-gray-600 hover:text-[#1E3A5F] hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage((prev) => (prev === "en" ? "hi" : "en"))}
              className="gap-1 text-gray-600"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {language === "en" ? "EN" : "हि"}
              </span>
            </Button>

            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1E3A5F] font-medium"
              >
                {language === "en" ? "Log In" : "लॉग इन"}
              </Button>
            </Link>

            <Link href="/signup">
              <Button
                size="sm"
                className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-xl px-5 shadow-md"
              >
                {language === "en" ? "Get Started" : "शुरू करें"}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button
                className="w-full bg-[#1E3A5F] text-white"
                size="sm"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}