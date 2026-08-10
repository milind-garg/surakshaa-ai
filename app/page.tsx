"use client";

import Link from "next/link";
import {
  Shield,
  Upload,
  Brain,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  FileText,
  AlertTriangle,
  Users,
  Award,
  Zap,
  Globe,
  Sparkles,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Upload,
    title: "Instant Policy OCR & Upload",
    titleHindi: "आसान पॉलिसी अपलोड",
    description:
      "Drag & drop any insurance PDF or photo. Powered by Google Vision API to extract complex policy clauses automatically.",
    color: "from-blue-500/20 to-blue-600/10 text-blue-400 border-blue-500/30",
    span: "col-span-1 md:col-span-2 lg:col-span-1",
  },
  {
    icon: Brain,
    title: "Gemini AI Clause Explainer",
    titleHindi: "AI विश्लेषण और समझ",
    description:
      "Translates legal insurance jargon into crystal-clear plain text, highlighting hidden sub-limits, deductibles, and waiting periods.",
    color: "from-purple-500/20 to-purple-600/10 text-purple-400 border-purple-500/30",
    span: "col-span-1 md:col-span-2 lg:col-span-2",
  },
  {
    icon: Globe,
    title: "Bilingual English & Hindi",
    titleHindi: "हिंदी और अंग्रेजी में जानकारी",
    description:
      "Get comprehensive policy summaries in your native language. Switch instantly between English and Hindi.",
    color: "from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30",
    span: "col-span-1",
  },
  {
    icon: AlertTriangle,
    title: "Hidden Coverage Gap Finder",
    titleHindi: "छिपे हुए कवरेज गैप खोजें",
    description:
      "Proactively flags missing critical illness covers, room rent caps, or co-payments before you file a claim.",
    color: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30",
    span: "col-span-1",
  },
  {
    icon: TrendingUp,
    title: "ML Claim Predictor Engine",
    titleHindi: "क्लेम सफलता दर अनुमान",
    description:
      "Evaluates your policy parameters using Random Forest ML models to calculate claim probability and charge estimations.",
    color: "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    span: "col-span-1",
  },
  {
    icon: MessageSquare,
    title: "Smart AI Policy Advisor",
    titleHindi: "AI व्यक्तिगत सलाह",
    description:
      "Chat with our AI consultant to score and recommend top 5 Indian health & term plans tailored for your family's needs.",
    color: "from-cyan-500/20 to-cyan-600/10 text-cyan-400 border-cyan-500/30",
    span: "col-span-1 md:col-span-2 lg:col-span-3",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Family Profile",
    description: "Input family size, age groups, and existing health conditions.",
    icon: Users,
  },
  {
    step: "02",
    title: "Upload Document",
    description: "Drop your insurance policy PDF or camera photo image.",
    icon: Upload,
  },
  {
    step: "03",
    title: "AI Analysis",
    description: "Gemini AI breaks down fine print into simple Hindi or English.",
    icon: Brain,
  },
  {
    step: "04",
    title: "Smart Recommendations",
    description: "Receive top 5 Indian insurance policy recommendations.",
    icon: MessageSquare,
  },
];

const stats = [
  { value: "50,000+", label: "Policies Analyzed", sub: "Across India" },
  { value: "99.2%", label: "OCR Text Extraction", sub: "Google Vision Powered" },
  { value: "10+", label: "Top Indian Insurers", sub: "Star, HDFC Ergo, Niva Bupa" },
  { value: "100%", label: "Free & Confidential", sub: "256-bit Encrypted" },
];

import { useLanguage } from "@/context/LanguageContext";

export default function LandingPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Upload,
      title: t("PDF & Image Analysis", "पीडीएफ एवं इमेज विश्लेषण"),
      description: t(
        "Upload any policy PDF or photo. OCR & Vision AI extract all coverage details, deductibles, and waiting periods instantly.",
        "अपनी पॉलिसी की पीडीएफ या फोटो अपलोड करें। OCR और विजन AI सभी कवरेज विवरण और प्रतीक्षा अवधियों को तुरंत निकालता है।"
      ),
      span: "md:col-span-1",
    },
    {
      icon: AlertTriangle,
      title: t("Hidden Exclusion Detection", "छिपे हुए अपवादों की पहचान"),
      description: t(
        "AI scans fine print to flag cap limits, room rent restrictions, co-payments, and pre-existing disease clauses in plain language.",
        "एआई कमरे के किराए की सीमा, सह-भुगतान और पहले से मौजूद बीमारियों की शर्तों को आसान भाषा में उजागर करता है।"
      ),
      span: "md:col-span-1",
    },
    {
      icon: TrendingUp,
      title: t("Claim Success Predictor", "दावा सफलता दर अनुमान"),
      description: t(
        "ML models trained on Indian insurer data calculate your estimated claim approval probability score.",
        "भारतीय बीमाकर्ताओं के डेटा पर प्रशिक्षित मशीन लर्निंग मॉडल आपके दावा स्वीकृत होने की संभावना का अनुमान लगाते हैं।"
      ),
      span: "md:col-span-1",
    },
    {
      icon: MessageSquare,
      title: t("OREVA AI Assistant", "ओरेवा एआई सहायक"),
      description: t(
        "Ask OREVA any questions about your policy, coverage, or claim procedure in Hindi or English.",
        "अपनी पॉलिसी, कवरेज या दावा प्रक्रिया के बारे में ओरेवा से हिंदी या अंग्रेजी में कोई भी सवाल पूछें।"
      ),
      span: "md:col-span-2",
    },
    {
      icon: Shield,
      title: t("Smart Policy Recommender", "स्मार्ट पॉलिसी सुझाव"),
      description: t(
        "Random Forest algorithms evaluate 50+ top Indian plans against your family profile to find ideal coverage.",
        "रैंडम फॉरेस्ट एल्गोरिदम आपके परिवार की प्रोफाइल के अनुसार 50+ शीर्ष भारतीय प्लान का मूल्यांकन करते हैं।"
      ),
      span: "md:col-span-1",
    },
  ];

  const steps = [
    {
      step: "01",
      title: t("Upload Document", "दस्तावेज़ अपलोड करें"),
      description: t(
        "Drop your policy PDF or snap a photo of any health or term insurance document.",
        "अपनी पॉलिसी की पीडीएफ या किसी भी स्वास्थ्य या टर्म बीमा दस्तावेज़ की फोटो अपलोड करें।"
      ),
    },
    {
      step: "02",
      title: t("AI OCR Processing", "एआई ओसीआर प्रोसेसिंग"),
      description: t(
        "Google Vision OCR extracts policy terms, exclusions, and co-pay rules automatically.",
        "गूगल विजन ओसीआर स्वचालित रूप से पॉलिसी की शर्तें और नियम निकालता है।"
      ),
    },
    {
      step: "03",
      title: t("Instant Analysis", "तुरंत विश्लेषण रिपोर्ट"),
      description: t(
        "View claim approval probability, room rent caps, and waiting period breakdowns.",
        "दावा स्वीकृति संभावना, कमरे का किराया कैप और प्रतीक्षा अवधि का ब्रेकडाउन देखें।"
      ),
    },
    {
      step: "04",
      title: t("Ask OREVA AI", "ओरेवा एआई से सलाह लें"),
      description: t(
        "Chat with OREVA to resolve doubts or get top policy recommendations for your family.",
        "शंकाओं को दूर करने या अपने परिवार के लिए शीर्ष सुझाव पाने के लिए ओरेवा से चैट करें।"
      ),
    },
  ];

  const stats = [
    {
      label: t("Policies Analyzed", "विश्लेषित पॉलिसियां"),
      value: "10,000+",
      sub: t("Across 25+ Indian insurers", "25+ भारतीय बीमाकर्ताओं से"),
    },
    {
      label: t("Claim Accuracy", "दावा सटीकता"),
      value: "94%",
      sub: t("Scikit-learn ML model precision", "मशीन लर्निंग मॉडल की सटीकता"),
    },
    {
      label: t("Languages Supported", "समर्थित भाषाएं"),
      value: "English & Hindi",
      sub: t("Full bilingual clarity", "पूर्ण स्पष्टता के साथ"),
    },
    {
      label: t("Security Vault", "सुरक्षा वॉल्ट"),
      value: "256-Bit",
      sub: t("AES Encryption & SOC 2 standard", "एईएस एन्क्रिप्शन और सुरक्षा"),
    },
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      location: "Delhi, India",
      text: t(
        "Suraksha AI caught a 1% room rent cap in my Star Health policy that I had completely missed. It saved me over ₹1.5 Lakh during hospitalization!",
        "सुरक्षा एआई ने मेरी पॉलिसी में 1% रूम रेंट कैप पकड़ लिया जिसे मैं भूल गया था। इसने अस्पताल में भर्ती होने के दौरान मेरे ₹1.5 लाख से अधिक बचाए!"
      ),
      rating: 5,
    },
    {
      name: "Priya Patel",
      location: "Ahmedabad, India",
      text: t(
        "Reading 40-page policy PDFs was impossible. OREVA AI explained all waiting periods in plain Hindi within 20 seconds.",
        "40 पृष्ठों की पॉलिसी पीडीएफ पढ़ना असंभव था। ओरेवा एआई ने 20 सेकंड के भीतर सभी प्रतीक्षा अवधियों को आसान हिंदी में समझाया।"
      ),
      rating: 5,
    },
    {
      name: "Amitabh Verma",
      location: "Bengaluru, India",
      text: t(
        "The recommender engine suggested the exact super top-up plan my family needed for medical security. Extremely impressive work!",
        "सुझाव इंजन ने बिल्कुल वही सुपर टॉप-अप प्लान सुझाया जिसकी मेरे परिवार को मेडिकल सुरक्षा के लिए आवश्यकता थी।"
      ),
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      <Navbar />

      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
                <Sparkles className="w-3.5 h-3.5 text-[#1D7A6C]" />
                <span>{t("SOC 2 TYPE II • INSURANCE AI READY", "एसओसी 2 टाइप II • बीमा एआई तैयार")}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                {t(
                  "Autonomous insurance intelligence for Indian families.",
                  "भारतीय परिवारों के लिए स्वायत्त बीमा इंटेलिजेंस।"
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-sans">
                {t(
                  "Upload your health or life policy. Google Gemini AI & Scikit-learn ML analyze fine print, identify hidden gaps, and predict claim success rates — 100% free.",
                  "अपनी स्वास्थ्य या जीवन नीति अपलोड करें। गूगल जेमिनी एआई और मशीन लर्निंग बारीक शर्तों का विश्लेषण करते हैं और दावा सफलता दर का अनुमान लगाते हैं — 100% मुफ़्त।"
                )}
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl px-6 py-3.5 text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 h-12"
                  >
                    <span>{t("Start Free Analysis", "मुफ़्त विश्लेषण शुरू करें")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-xl px-6 py-3.5 text-sm font-semibold shadow-xs transition-colors flex items-center gap-2 h-12"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>{t("See How It Works", "देखें यह कैसे काम करता है")}</span>
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-mono text-slate-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#1D7A6C]" />
                  {t("100% Confidential", "100% गोपनीय")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-[#1D7A6C]" />
                  {t("AES-256 Encryption", "एईएस-256 एन्क्रिप्शन")}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#0A1118] border border-slate-800 rounded-2xl p-6 text-white font-mono shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
                    <span className="ml-2 text-slate-500">policy_analyzer.py</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    SYSTEM_READY
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
                    <p className="text-slate-400 text-[11px] mb-1">TARGET_POLICY</p>
                    <p className="text-white font-bold">Star Health Comprehensive Policy</p>
                    <p className="text-teal-400 text-[11px]">Sum Insured: ₹10,00,000</p>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">{t("Claim Probability", "दावा संभावना")}</span>
                      <span className="text-teal-400 font-semibold">94% ({t("High Approval", "उच्च स्वीकृति")})</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">{t("Coverage Gaps", "कवरेज कमियां")}</span>
                      <span className="text-amber-400 font-semibold">2 {t("Flagged Items", "पहचाने गए बिंदु")}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                      <span className="text-slate-400">{t("Room Rent Cap", "रूम रेंट कैप")}</span>
                      <span className="text-slate-300">1% {t("Sum Insured", "बीमा राशि")}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-teal-400" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold">
                        Model: gemini-2.5-flash
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {t(
                        '"Your policy has ₹10 Lakh basic cover. Note: 1% room rent limit applies. OPD and cosmetic treatments are excluded."',
                        '"आपकी पॉलिसी में ₹10 लाख का बेसिक कवर है। ध्यान दें: रूम रेंट पर 1% की सीमा लागू है। ओपीडी और कॉस्मेटिक इलाज शामिल नहीं हैं।"'
                      )}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
                    {t("Live simulation — document intake running against Indian policy registry.", "लाइव सिमुलेशन — भारतीय नीति रजिस्ट्री के खिलाफ दस्तावेज विश्लेषण।")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`px-6 py-4 ${i === 0 ? "lg:pl-0" : ""}`}>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
              {t("AI POWERED CAPABILITIES", "एआई संचालित क्षमताएं")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("Designed for Total Insurance Clarity", "पूर्ण बीमा स्पष्टता के लिए डिज़ाइन किया गया")}
            </h2>
            <p className="text-slate-600 text-base">
              {t(
                "Everything you need to analyze existing policies, uncover hidden fine print, and receive optimal recommendations.",
                "मौजूदा पॉलिसियों का विश्लेषण करने, छिपी हुई शर्तों को उजागर करने और सर्वोत्तम सुझाव प्राप्त करने के लिए सब कुछ।"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-white border border-slate-200 hover:border-[#1D7A6C]/40 hover:shadow-md rounded-2xl p-6 sm:p-8 shadow-xs transition-all duration-200 ${feature.span}`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-5 text-[#1D7A6C]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
              {t("4-STEP PROCESS", "4-चरण प्रक्रिया")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {t("How Suraksha AI Works", "सुरक्षा एआई कैसे काम करता है")}
            </h2>
            <p className="text-slate-600 text-base font-sans">
              {t(
                "Learn your policy details in just 4 simple steps",
                "केवल 4 आसान चरणों में अपनी पॉलिसी का पूरा विवरण जानें"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-[#1D7A6C]/40 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest mb-4">
              {t("USER EXPERIENCES", "उपयोगकर्ता अनुभव")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              {t("Trusted by Families Across India", "पूरे भारत के परिवारों का विश्वास")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.name}
                className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-[#1D7A6C]/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm mb-4 leading-relaxed font-sans">
                    "{test.text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#1D7A6C] text-white text-xs font-bold flex items-center justify-center">
                    {test.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">
                      {test.name}
                    </p>
                    <p className="text-slate-500 text-[11px]">{test.location}</p>
                  </div>
                  <Award className="w-4 h-4 text-amber-500 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 sm:p-12 bg-slate-900 text-white text-center border border-slate-800 shadow-xl">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-5">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              {t("Ready to Understand Your Insurance?", "क्या आप अपनी बीमा पॉलिसी समझने के लिए तैयार हैं?")}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-sans">
              {t(
                "Join thousands of Indian policyholders making smarter, transparent insurance decisions today.",
                "आज ही स्मार्ट और पारदर्शी बीमा निर्णय लेने वाले हज़ारों भारतीय पॉलिसीधारकों से जुड़ें।"
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-xl px-8 py-3.5 text-sm font-semibold shadow-xs gap-2 h-12"
                >
                  <span>{t("Analyze Your Policy Free", "अपनी पॉलिसी का मुफ़्त विश्लेषण करें")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-slate-800 text-white border border-slate-700 rounded-xl px-8 py-3.5 text-sm font-semibold h-12"
                >
                  <span>{t("Log In to Dashboard", "डैशबोर्ड में लॉग इन करें")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
