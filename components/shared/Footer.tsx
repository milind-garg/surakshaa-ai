"use client";

import Link from "next/link";
import { Shield, Heart, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const footerLinks = {
  product: [
    { label: "Features", href: "#features", id: "features" },
    { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
    { label: "Policy Analysis", href: "/upload", id: "upload" },
    { label: "AI Chatbot", href: "/chatbot", id: "chatbot" },
  ],
  support: [
    { label: "Help Center", href: "#help", id: "help" },
    { label: "Privacy Policy", href: "#privacy", id: "privacy" },
    { label: "Terms of Service", href: "#terms", id: "terms" },
    { label: "Contact Support", href: "#contact", id: "contact" },
  ],
  insurance: [
    { label: "Health Insurance", href: "#health", id: "health" },
    { label: "Life Insurance", href: "#life", id: "life" },
    { label: "Term Plans", href: "#term", id: "term" },
    { label: "Critical Illness", href: "#critical", id: "critical" },
  ],
};

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-700 bg-white flex items-center justify-center shadow-xs shrink-0">
                <img src="/logo_option4.png" alt="Surakshaa.ai" className="w-full h-full object-contain" />
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              {t(
                "AI-powered insurance intelligence for Indian families. Understand fine print clearly.",
                "भारतीय परिवारों के लिए AI-संचालित बीमा सहायक। बारीक शर्तों को आसानी से समझें।"
              )}
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Mail className="w-4 h-4 text-[#1D7A6C]" />
                <span>support@surakshaai.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-[#1D7A6C]" />
                <span>Made with Pride in India 🇮🇳</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm tracking-wider uppercase">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm tracking-wider uppercase">Support</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Types */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm tracking-wider uppercase">Insurance Coverage</h3>
            <ul className="space-y-2.5">
              {footerLinks.insurance.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs sm:text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs">
            © 2026 Suraksha AI. All rights reserved.
          </p>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 mx-0.5" /> for Indian policyholders
          </p>
          <p className="text-slate-500 text-[11px]">
            Independent AI analysis platform. Not affiliated with IRDAI.
          </p>
        </div>
      </div>
    </footer>
  );
}
