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

const testimonials = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "Finally understood room rent caps and co-pay clauses in my HDFC Ergo policy! The Hindi explanation made all the difference.",
    textHindi: "हिंदी व्याख्या ने मेरी पॉलिसी के सारे छिपे नियम आसान कर दिए!",
  },
  {
    name: "Priya Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "Suraksha AI pointed out that critical illness wasn't covered in my plan. Upgraded my rider within 24 hours.",
    textHindi: "गैप एनालिसिस से पता चला कि महत्वपूर्ण बीमारियों का कवर नहीं था।",
  },
  {
    name: "Amit Verma",
    location: "Indore, MP",
    rating: 5,
    text: "The ML recommendation engine matched the exact term policy for my family of 4 with zero broker bias.",
    textHindi: "चैटबॉट ने मेरे पूरे परिवार के लिए बेहतरीन बीमा सलाह दी।",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline & CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Monospaced Aegis Pill Badge */}
              <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 uppercase tracking-widest">
                <span className="flex h-2 w-2 rounded-full bg-[#1D7A6C]" />
                <Sparkles className="w-3.5 h-3.5 text-[#1D7A6C]" />
                <span>SOC 2 TYPE II • INSURANCE AI READY</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Autonomous insurance intelligence for Indian families.
              </h1>

              {/* Subheadline Hindi */}
              <p className="text-lg sm:text-xl font-hindi text-slate-700 font-medium">
                बीमा पॉलिसी को समझें — हिंदी और अंग्रेजी में, बिल्कुल आसान भाषा में
              </p>

              {/* Subheadline English */}
              <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
                Upload your health or life policy. Google Gemini AI & Scikit-learn ML analyze fine print, identify hidden gaps, and predict claim success rates — 100% free.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg px-6 py-3.5 text-sm font-medium shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Start Free Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 rounded-lg px-6 py-3.5 text-sm font-medium shadow-xs transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>See How It Works</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
                {[
                  { icon: CheckCircle, text: "100% Free Forever" },
                  { icon: Lock, text: "256-Bit Security" },
                  { icon: Globe, text: "Bilingual AI" },
                  { icon: Shield, text: "All Indian Insurers" },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500"
                  >
                    <item.icon className="w-4 h-4 text-[#1D7A6C]" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: AegisFlow Dark Terminal Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#0A1118] border border-slate-800 rounded-xl p-6 text-white font-sans shadow-xl">
                
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2 font-mono text-slate-400">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-[200px]">SH-98421-star-health.pdf</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 font-mono text-[10px] uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    PARSING
                  </span>
                </div>

                {/* Parsed Fields Table */}
                <div className="space-y-3 font-mono text-xs mb-6">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Named Insured</span>
                    <span className="font-sans font-semibold text-white">Family Floater (2A + 1C)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Sum Insured</span>
                    <span className="text-white font-semibold">₹10,00,000</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Claim Success Score</span>
                    <span className="text-teal-400 font-semibold">94% (High Approval)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Coverage Gaps</span>
                    <span className="text-amber-400 font-semibold">2 Flagged Items</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Room Rent Cap</span>
                    <span className="text-slate-300">1% Sum Insured</span>
                  </div>
                </div>

                {/* AI Executive Summary Box */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-teal-400" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-teal-400 font-semibold">
                      Model: gemini-2.5-flash
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-hindi leading-relaxed">
                    "आपकी पॉलिसी में ₹10 लाख का बेसिक कवर है। ध्यान दें: रूम रेंट पर 1% की सीमा लागू है। ओपीडी और कॉस्मेटिक इलाज शामिल नहीं हैं।"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
                  Live simulation — document intake running against Indian policy registry.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR (AegisFlow 4-Column Border Grid) ── */}
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

      {/* ── BENTO GRID FEATURES SECTION ── */}
      <section id="features" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="aegis-pill mb-4">
              AI POWERED CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Designed for Total Insurance Clarity
            </h2>
            <p className="text-slate-600 text-base">
              Everything you need to analyze existing policies, uncover hidden fine print, and receive optimal recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 sm:p-8 shadow-xs transition-all duration-200 ${feature.span}`}
              >
                <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center mb-5 text-[#1D7A6C]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-xs font-hindi text-[#1D7A6C] mb-3 font-medium">
                  {feature.titleHindi}
                </p>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS TIMELINE ── */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="aegis-pill mb-4">
              4-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              How Suraksha AI Works
            </h2>
            <p className="text-slate-600 text-base font-hindi">
              केवल 4 आसान चरणों में अपनी पॉलिसी का पूरा विवरण जानें
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-slate-900 text-white font-mono font-bold text-sm flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="aegis-pill mb-4">
              USER EXPERIENCES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Trusted by Families Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm mb-2 leading-relaxed">
                    "{t.text}"
                  </p>
                  <p className="text-teal-700 text-xs font-hindi italic mb-6">
                    "{t.textHindi}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-[#1D7A6C] text-white text-xs font-bold flex items-center justify-center">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xs">
                      {t.name}
                    </p>
                    <p className="text-slate-500 text-[11px]">{t.location}</p>
                  </div>
                  <Award className="w-4 h-4 text-amber-500 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl p-8 sm:p-12 bg-slate-900 text-white text-center border border-slate-800">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-5">
              <Shield className="w-6 h-6 text-teal-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Ready to Understand Your Insurance?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-2">
              Join thousands of Indian policyholders making smarter, transparent insurance decisions.
            </p>
            <p className="text-teal-400 font-hindi text-base sm:text-xl mb-8 font-semibold">
              अभी शुरू करें — बिल्कुल मुफ़्त और सुरक्षित
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#1D7A6C] hover:bg-[#165E53] text-white rounded-lg px-8 py-3.5 text-sm font-medium shadow-xs gap-2"
                >
                  <span>Analyze Your Policy Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-slate-800 text-white border border-slate-700 rounded-lg px-8 py-3.5 text-sm font-medium"
                >
                  <span>Log In to Dashboard</span>
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
