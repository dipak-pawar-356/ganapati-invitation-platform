"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, ArrowRight, Sparkles, Check, BookmarkCheck, PhoneCall, KeyRound } from "lucide-react";
import { FestiveAudioAndBlessing } from "@/components/FestiveAudioAndBlessing";

const contactPhone = "8669233747";
const platformUrl = "https://ganapati-invitation-platform-phi.vercel.app";

const demos = [
  {
    id: "royal_gold",
    name: "Theme 1: Royal Temple Gold",
    mandalName: "श्री जय मल्हार गणेश मंडळ",
    location: "कोथरूड, पुणे",
    established: "Est. १९९८",
    slug: "shri-jay-malhar-ganesh-mandal",
    color: "Gold & Brass",
    bgGradient: "from-amber-900 via-yellow-800 to-amber-950",
    borderColor: "border-[var(--t-border)]",
    hoverBorder: "hover:border-[var(--t-primary)]",
    badgeBg: "bg-[#e8a93b] text-[var(--t-bg)]",
    description: "सुवर्ण मंदिर, पितळी स्तंभ, पारंपारिक मंदिर दरवाजे व शाही गणेशोत्सवाचा अनुभव.",
    features: ["सुवर्ण मंदिर थीम", "पितळी घंटानाद", "पारंपारिक १०-दिवस टाइमलाइन", "शाही फोटो गॅलरी"],
  },
  {
    id: "peshwai",
    name: "Theme 2: Peshwai Heritage",
    mandalName: "श्री स्वामी समर्थ मित्र मंडळ",
    location: "सोमवार पेठ, कराड",
    established: "Est. १९८८",
    slug: "shri-swami-samarth-mitra-mandal",
    color: "Maroon & Kesari",
    bgGradient: "from-red-950 via-rose-900 to-orange-950",
    borderColor: "border-[#d96a2b]/40",
    hoverBorder: "hover:border-[#d96a2b]",
    badgeBg: "bg-[#d96a2b] text-white",
    description: "मराठमोळी वाड्याची रचना, केसरी तोरणे व तुतारी वादनाचा शाही गणेशोत्सव थाट.",
    features: ["वाडा डिझाइन", "मराठमोळी तुतारी", "पेशवाई लाकडी बॉर्डर", "पारंपारिक समिती"],
  },
  {
    id: "divine_saffron",
    name: "Theme 3: Divine Saffron",
    mandalName: "श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळ",
    location: "पोवई नाका, सातारा",
    established: "Est. २००२",
    slug: "shri-shivneri-ganesh-mandal",
    color: "Saffron & White",
    bgGradient: "from-orange-900 via-amber-800 to-yellow-900",
    borderColor: "border-orange-500/40",
    hoverBorder: "hover:border-orange-400",
    badgeBg: "bg-orange-500 text-white",
    description: "शुभ्र व भगवी चकाकी, ग्लासमॉर्फिक आधुनिक कार्ड्स व आधुनिक डिजिटल निमंत्रण.",
    features: ["ग्लासमॉर्फिक कार्ड्स", "भगवी दिव्य चकाकी", "मोबाईल फ्रेंडली गॅलरी", "आधुनिक क्यूआर कोड"],
  },
  {
    id: "night_darshan",
    name: "Theme 4: Night Darshan",
    mandalName: "श्री संत ज्ञानेश्वर गणेश मंडळ",
    location: "विश्रामबाग, सांगली",
    established: "Est. १९९३",
    slug: "shri-sant-dnyaneshwar-ganesh-mandal",
    color: "Dark Blue & Glowing Diyas",
    bgGradient: "from-slate-950 via-blue-950 to-indigo-950",
    borderColor: "border-sky-500/40",
    hoverBorder: "hover:border-sky-400",
    badgeBg: "bg-sky-500 text-slate-950",
    description: "रात्रीचा रोषणाई सोहळा, दीपमाळांचा सोनेरी प्रकाश, अंधारातील दिव्य वातावरण.",
    features: ["रातराणी रोषणाई", "चमकणाऱ्या दीपमाळा", "रात्रीचे लाईव्ह दर्शन", "स्टारलाईट बॅकग्राउंड"],
  },
  {
    id: "swarna_mandap",
    name: "Theme 5: Swarna Mandap Deluxe",
    mandalName: "श्री सिद्धिविनायक सार्वजनिक गणेश मंडळ",
    location: "हडपसर, पुणे",
    established: "Est. २००६",
    slug: "shri-siddhivinayak-sarvajanik-mandal",
    color: "Imperial Gold & Ruby",
    bgGradient: "from-amber-950 via-red-950 to-[#2c050a]",
    borderColor: "border-yellow-500/40",
    hoverBorder: "hover:border-yellow-400",
    badgeBg: "bg-yellow-500 text-amber-950",
    description: "सम्राट सुवर्ण मंडप रचना, तोरणे, धूप धूर व महाआरती विशेष रोषणाई सोहळा.",
    features: ["सम्राट सुवर्ण मंडप", "महाआरती रोषणाई", "विशेष VIP दर्शन लिंक", "लाइव्ह भक्ती संगीत"],
  },
  {
    id: "heritage_wada",
    name: "Theme 6: Heritage Wada Utsav",
    mandalName: "श्री छत्रपती शिवाजी महाराज गणेश मंडळ",
    location: "शिवाजी पेठ, कोल्हापूर",
    established: "Est. १९९१",
    slug: "shri-chhatrapati-shivaji-mandal",
    color: "Teak Wood & Terracotta",
    bgGradient: "from-stone-900 via-orange-950 to-stone-950",
    borderColor: "border-[var(--t-border)]",
    hoverBorder: "hover:border-[var(--t-primary)]",
    badgeBg: "bg-amber-600 text-white",
    description: "ऐतिहासिक वाडा संस्कृती, ढोल-ताशा पथक देखावा व पारंपरिक सार्वजनिक गणेशोत्सव.",
    features: ["ऐतिहासिक पेठ वाडा", "ढोल-ताशा पथक", "पारंपारिक महाप्रसाद", "विशेष उत्सव गॅलरी"],
  },
];

export default function DemoDirectoryPage() {
  return (
    <main className="relative min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] selection:bg-[var(--t-selection-bg)] selection:text-[var(--t-selection-text)] overflow-x-hidden">
      {/* Background Image */}
      <picture className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30 mix-blend-overlay">
        <Image
          src="/images/backgrounds/hero-background-desktop.webp"
          alt="Festive Background"
          fill
          priority
          className="object-cover object-center"
        />
      </picture>

      {/* Top Header */}
      <div className="relative z-20 w-full border-b border-[var(--t-border)] bg-[var(--t-bg-card)]/90 backdrop-blur-md py-3 px-4 text-center">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs sm:text-sm">
          <Link href="/" className="flex items-center gap-1.5 font-bold text-[var(--t-primary-light)]">
            <span>॥ श्री गणेशाय नमः ॥ • Adviks Softtech</span>
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${contactPhone}`}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[var(--t-primary-light)] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{contactPhone}</span>
            </a>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-3.5 py-1 text-[11px] font-bold text-[var(--t-bg)] shadow-md hover:scale-105 transition-all"
            >
              <KeyRound className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-8 text-center sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--t-primary-muted)] px-4 py-1.5 text-xs font-bold text-[var(--t-primary-light)] border border-[var(--t-border)] mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>६ उत्कृष्ट डेव्हलप्ड थिम्स चा संपूर्ण संग्रह</span>
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[var(--t-primary-light)] sm:text-5xl">
          Live Demo Website Directory
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base text-[var(--t-text-soft)]">
          प्रत्येक थिममध्ये समान डेटा स्ट्रक्चर असूनही तिचे दृश्य रूप, रंगसंगती, बॉर्डर व ॲनिमेशन्स पूर्णपणे अद्वितीय आहेत.
        </p>
      </section>

      {/* Demo Cards Grid */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map((demo) => (
            <div
              key={demo.id}
              className={`group relative rounded-3xl border ${demo.borderColor} ${demo.hoverBorder} bg-black/60 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between`}
            >
              <div>
                {/* Theme Banner Box */}
                <div className={`relative h-48 w-full overflow-hidden rounded-2xl bg-gradient-to-br ${demo.bgGradient} p-5 flex flex-col justify-between border border-white/15 shadow-inner`}>
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full ${demo.badgeBg} px-3 py-1 text-xs font-bold`}>
                      {demo.name}
                    </span>
                    <span className="text-[11px] font-semibold text-white/80 bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {demo.color}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-white drop-shadow-md">
                      {demo.mandalName}
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      {demo.established} • {demo.location}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-[var(--t-text-soft)] leading-relaxed">
                  {demo.description}
                </p>

                {/* Features Pill List */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {demo.features.map((feat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-medium text-[var(--t-primary-light)]"
                    >
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={`/${demo.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-5 py-2.5 text-xs sm:text-sm font-bold text-[var(--t-bg)] shadow-md hover:scale-105 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Live Demo</span>
                </Link>

                <Link
                  href="/submit"
                  className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--t-border)] bg-black/40 px-4 py-2.5 text-xs sm:text-sm font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary-muted)] transition-all"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Use Theme</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--t-border)] bg-[var(--t-bg-footer)] py-8 px-4 text-center text-xs text-[var(--t-text-muted)]">
        <p className="font-display text-sm text-[var(--t-primary-light)] font-bold">
          डिजिटल गणपती निमंत्रण प्लॅटफॉर्म • Adviks Softtech
        </p>
        <p className="mt-1 text-[10px] text-[var(--t-text-muted)]">
          Powered by Adviks Softtech • Developed by Dipak Pawar
        </p>
      </footer>

      <FestiveAudioAndBlessing />
    </main>
  );
}
