import Link from "next/link";
import {
  Shield, Upload, Brain, MessageSquare, TrendingUp,
  CheckCircle, Star, ArrowRight, FileText, AlertTriangle,
  Users, Award, Zap, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const features = [
  {
    icon: Upload,
    title: "Upload Any Policy",
    titleHindi: "कोई भी पॉलिसी अपलोड करें",
    description:
      "Upload PDF or image of your insurance policy. Supports all major Indian insurers.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    titleHindi: "AI विश्लेषण",
    description:
      "Google Gemini AI reads and explains your entire policy in simple language.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Globe,
    title: "Hindi & English",
    titleHindi: "हिंदी और अंग्रेजी",
    description:
      "Get full explanations in Hindi or English — whichever you prefer.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: AlertTriangle,
    title: "Coverage Gap Finder",
    titleHindi: "कवरेज गैप खोजें",
    description:
      "AI identifies what your policy does NOT cover so you're never caught off guard.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: TrendingUp,
    title: "Claim Success Predictor",
    titleHindi: "क्लेम सफलता दर",
    description:
      "Know your probability of a successful claim before you file it.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    titleHindi: "AI चैटबॉट",
    description:
      "Chat with our AI to get top 5 policy recommendations tailored to your family.",
    color: "bg-teal-50 text-teal-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Create Your Profile",
    description: "Tell us about your family, income, and health needs.",
    icon: Users,
  },
  {
    step: "02",
    title: "Upload Your Policy",
    description: "Drag & drop your insurance document. PDF or image — both work.",
    icon: Upload,
  },
  {
    step: "03",
    title: "Get AI Insights",
    description: "Our AI explains everything in plain Hindi or English within seconds.",
    icon: Brain,
  },
  {
    step: "04",
    title: "Get Recommendations",
    description: "Chat with AI to get top 5 policies matching your exact needs.",
    icon: MessageSquare,
  },
];

const stats = [
  { value: "50+", label: "Insurance Policies Analyzed" },
  { value: "Hindi", label: "Native Language Support" },
  { value: "98%", label: "Analysis Accuracy" },
  { value: "Free", label: "Always Free to Use" },
];

const testimonials = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "Finally I understand what my health policy covers! The Hindi explanation was perfect.",
    textHindi: "अब मुझे समझ आया मेरी पॉलिसी क्या कवर करती है!",
  },
  {
    name: "Priya Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "The gap analysis showed I had no critical illness cover. I bought a rider immediately.",
    textHindi: "गैप एनालिसिस ने बताया मुझे क्रिटिकल इलनेस कवर नहीं था।",
  },
  {
    name: "Amit Verma",
    location: "Indore, MP",
    rating: 5,
    text: "The chatbot recommended the perfect term plan for my family of 4. Excellent!",
    textHindi: "चैटबॉट ने मेरे परिवार के लिए सही टर्म प्लान बताया।",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-[#1E3A5F] dark:text-blue-300">
                Powered by Google Gemini AI
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1E3A5F] dark:text-white leading-tight mb-6">
              Your Insurance,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#f59e0b]">
                Finally Explained
              </span>
            </h1>

            <p className="text-2xl font-hindi text-gray-500 dark:text-gray-400 mb-4">
              बीमा को समझें — हिंदी में, आसान भाषा में
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your policy. Our AI reads it, explains it in plain Hindi or
              English, finds coverage gaps, and recommends the best plans for
              your family — all for free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-[#1E3A5F] hover:bg-[#152A46] text-white rounded-2xl px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 gap-2"
                >
                  Start Free — No Credit Card
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl px-8 py-6 text-base font-semibold border-2 border-gray-200 hover:border-[#1E3A5F] gap-2"
                >
                  <FileText className="w-4 h-4" />
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {["100% Free", "No Spam", "Hindi Support", "Secure & Private"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Hero Card Preview */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-[#1E3A5F] to-[#2d5986] rounded-3xl p-6 shadow-2xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">HDFC Ergo Health Optima Policy</p>
                  <p className="text-blue-200 text-sm">Analyzed just now ✓</p>
                </div>
                <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30">
                  Analyzed
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">₹5L</p>
                  <p className="text-blue-200 text-xs">Sum Insured</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-blue-200 text-xs">Claim Success</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-blue-200 text-xs">Coverage Gaps</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-blue-100 font-hindi leading-relaxed">
                  🤖 AI: आपकी पॉलिसी में मातृत्व लाभ, मानसिक स्वास्थ्य और
                  डेंटल कवर शामिल नहीं है। इन्हें जोड़ने पर विचार करें।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-[#1E3A5F] dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-[#1E3A5F] border-blue-200 mb-4">
              Features
            </Badge>
            <h2 className="text-4xl font-bold text-[#1E3A5F] dark:text-white mb-4">
              Everything You Need to{" "}
              <span className="text-[#FF6B35]">Understand Insurance</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              From uploading your policy to getting personalized recommendations
              — Suraksha AI handles it all.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#1E3A5F] dark:text-white text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs font-hindi text-gray-400 mb-3">
                  {feature.titleHindi}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-orange-50 text-[#FF6B35] border-orange-200 mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl font-bold text-[#1E3A5F] dark:text-white mb-4">
              Get Started in{" "}
              <span className="text-[#FF6B35]">4 Simple Steps</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-hindi">
              4 आसान चरणों में शुरू करें
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#1E3A5F] to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-20 h-20 bg-[#1E3A5F] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-[#FF6B35] font-bold text-sm">{step.step}</span>
                  <h3 className="font-bold text-[#1E3A5F] dark:text-white text-lg mt-1 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-green-50 text-green-700 border-green-200 mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-bold text-[#1E3A5F] dark:text-white mb-4">
              Loved by Indian Families
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
                  "{t.text}"
                </p>
                <p className="text-gray-400 text-xs font-hindi italic mb-4">
                  "{t.textHindi}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A5F] to-[#FF6B35] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E3A5F] dark:text-white text-sm">
                      {t.name}
                    </p>
                    <p className="text-gray-400 text-xs">{t.location}</p>
                  </div>
                  <Award className="w-4 h-4 text-yellow-500 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-20 bg-gradient-to-br from-[#1E3A5F] via-[#2d5986] to-[#1E3A5F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Understand Your Insurance?
          </h2>
          <p className="text-blue-200 text-lg mb-4">
            Join thousands of Indian families making smarter insurance decisions.
          </p>
          <p className="text-blue-300 font-hindi text-xl mb-10">
            अभी शुरू करें — बिल्कुल मुफ़्त
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#FF6B35] hover:bg-[#e55a24] text-white rounded-2xl px-10 py-6 text-base font-semibold shadow-xl gap-2"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-2xl px-10 py-6 text-base font-semibold"
              >
                Already have an account? Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}