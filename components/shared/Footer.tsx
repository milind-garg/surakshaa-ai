import Link from "next/link";
import { Shield, Heart, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ],
  support: [
    { label: "Help Center", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  insurance: [
    { label: "Health Insurance", href: "#" },
    { label: "Life Insurance", href: "#" },
    { label: "Vehicle Insurance", href: "#" },
    { label: "Term Plans", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Suraksha AI</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              AI-powered insurance intelligence for Indian families.
              Understand your policies in plain Hindi & English.
            </p>
            <p className="text-blue-200 text-sm font-hindi">
              भारतीय परिवारों के लिए AI-संचालित बीमा सहायक
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@surakshaai.com</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Phone className="w-4 h-4" />
                <span>1800-XXX-XXXX (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Made in India 🇮🇳</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Types */}
          <div>
            <h3 className="font-semibold text-white mb-4">Insurance Types</h3>
            <ul className="space-y-2">
              {footerLinks.insurance.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-blue-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-blue-300 text-sm">
            © 2026 Suraksha AI. All rights reserved.
          </p>
          <p className="text-blue-300 text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Indian families
          </p>
          <p className="text-blue-300 text-xs">
            Not affiliated with IRDAI. For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}