"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FestiveAudioAndBlessing } from "@/components/FestiveAudioAndBlessing";
import SectionDivider from "@/components/common/SectionDivider";
import {
  ArrowRight,
  Eye,
  Globe,
  Film,
  Music,
  MapPin,
  Share2,
  QrCode,
  Calendar,
  LayoutDashboard,
  Palette,
  KeyRound,
  PhoneCall,
  MessageSquare,
  BookmarkCheck,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Crown,
  UserCheck,
} from "lucide-react";

const platformUrl = "https://ganapati-invitation-platform.vercel.app";
const contactPhone = "8669233747";

const defaultWhatsappMessage = `🚩 यंदाच्या गणेशोत्सवासाठी आपल्या मंडळाची Premium Digital Invitation Website तयार करा!

🙏 आपल्या मंडळासाठी आम्ही आधुनिक, आकर्षक आणि पूर्णपणे सानुकूल Digital Invitation Website तयार करून देतो.

✨ यात समाविष्ट:

🌺 सुंदर पारंपरिक डिझाइन
🎥 Hero Background Video
📸 फोटो गॅलरी
📅 कार्यक्रम वेळापत्रक
📍 Google Maps
🎵 भक्ती संगीत
🔔 घंटानाद
🌸 पुष्पवृष्टी
📲 WhatsApp निमंत्रण
📄 PDF Invitation
📱 Mobile Friendly Website

👉 अधिक माहितीसाठी कृपया संपर्क करा.

Website:
${platformUrl}

Phone:
${contactPhone}

गणपती बाप्पा मोरया! 🙏🚩`;

const whatsappLink = `https://api.whatsapp.com/send?phone=918669233747&text=${encodeURIComponent(defaultWhatsappMessage)}`;

const adminTeam = [
  {
    id: 1,
    roleMr: "ॲडमिन टीम प्रमुख (Main Admin)",
    roleEn: "Main Admin Lead",
    nameMr: "धिरज गायकवाड",
    nameEn: "Dhiraj Gaikwad",
    phone: "8600570542",
    badge: "👑 ॲडमिन #1",
  },
  {
    id: 2,
    roleMr: "अधिकृत ॲडमिन",
    roleEn: "Authorized Admin",
    nameMr: "कौस्तुभ रोंगे",
    nameEn: "Kaustubh Ronge",
    phone: "7498444684",
    badge: "👑 ॲडमिन #2",
  },
  {
    id: 3,
    roleMr: "अधिकृत ॲडमिन",
    roleEn: "Authorized Admin",
    nameMr: "दिपक पवार",
    nameEn: "Dipak Pawar",
    phone: "8669233747",
    badge: "👑 ॲडमिन #3",
  },
  {
    id: 4,
    roleMr: "अधिकृत ॲडमिन",
    roleEn: "Authorized Admin",
    nameMr: "विजय पाटील",
    nameEn: "Vijay Patil",
    phone: "7620198805",
    badge: "👑 ॲडमिन #4",
  },
  {
    id: 5,
    roleMr: "अधिकृत ॲडमिन",
    roleEn: "Authorized Admin",
    nameMr: "विवेक पवार",
    nameEn: "Vivek Pawar",
    phone: "9890528006",
    badge: "👑 ॲडमिन #5",
  },
  {
    id: 6,
    roleMr: "अधिकृत ॲडमिन",
    roleEn: "Authorized Admin",
    nameMr: "अथर्व मालवदे",
    nameEn: "Atharva Malvade",
    phone: "9322027844",
    badge: "👑 ॲडमिन #6",
  },
];

const getAdminWhatsappLink = (phone: string, nameMr: string) => {
  const msg = `नमस्कार ${nameMr} दादा, मला गणपती निमंत्रण प्लॅटफॉर्मवर आमच्या मंडळाची डिजिटल निमंत्रण वेबसाइट तयार करायची आहे. कृपया अधिक माहिती द्या! 🙏🚩`;
  const cleanPhone = phone.replace(/\D/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`;
};

export default function PlatformLandingPage() {
  const [lang, setLang] = useState<"mr" | "en">("mr");

  const playBellSound = () => {
    if (typeof window !== "undefined") {
      const bellAudio = new Audio("/audio/temple-bell.mp3");
      bellAudio.play().catch(() => {});
    }
  };

  return (
    <main className="relative min-h-screen bg-[#1c0609] text-[#fef9eb] selection:bg-[#e8a93b] selection:text-black overflow-x-hidden">
      {/* Background Video Stream */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/backgrounds/hero-background-mobile.webp"
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover md:hidden opacity-30 mix-blend-overlay"
      >
        <source src="/video/bg-video-mobile.mp4" type="video/mp4" />
      </video>

      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/backgrounds/hero-background-desktop.webp"
        className="pointer-events-none fixed inset-0 z-0 hidden h-full w-full object-cover md:block opacity-30 mix-blend-overlay"
      >
        <source src="/video/bg-video.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/85" />

      {/* Top Header Banner */}
      <div className="relative z-30 w-full border-b border-[#e8a93b]/30 bg-[#2a0a0e]/90 backdrop-blur-md py-2.5 px-4 text-center">
        <div className="mx-auto flex max-w-6xl items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 font-bold text-[#f3d089]">
            <span>॥ श्री गणेशाय नमः ॥</span>
          </span>
          <span className="hidden md:inline text-[#f3d089]/90 text-xs font-semibold tracking-wide">
            🚩 DIGITAL GANAPATI INVITATION PLATFORM — ADVIKS SOFTTECH
          </span>
          <div className="flex items-center gap-2.5">
            {/* Language Toggle Button */}
            <button
              onClick={() => setLang(lang === "mr" ? "en" : "mr")}
              className="inline-flex items-center gap-1 rounded-full border border-[#e8a93b]/50 bg-black/60 px-3 py-1 text-[11px] font-bold text-[#f3d089] hover:bg-[#e8a93b]/20 transition-all cursor-pointer shadow-sm"
              title="Change Language"
            >
              <span>🌐 {lang === "mr" ? "English" : "मराठी"}</span>
            </button>

            <a
              href={`tel:${contactPhone}`}
              suppressHydrationWarning
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#f3d089] hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{contactPhone}</span>
            </a>

            <Link
              href="/submit"
              className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e8a93b] to-[#d96a2b] px-3.5 py-1 text-[11px] font-bold text-[#1c0609] shadow-md hover:scale-105 transition-all"
            >
              <BookmarkCheck className="w-3 h-3" />
              <span>{lang === "mr" ? "माझी वेबसाइट तयार करा" : "Create My Website"}</span>
            </Link>

            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1 rounded-full border border-[#e8a93b]/40 bg-black/40 px-3 py-1 text-[11px] font-bold text-[#f3d089] hover:bg-[#e8a93b]/10 transition-all"
            >
              <KeyRound className="w-3 h-3" />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          1. HERO BANNER
      ====================================================== */}
      <section className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-4 pb-12 text-center sm:px-6 sm:pt-8 sm:pb-20">

        {/* Top Left Garland */}
        <div className="pointer-events-none absolute left-0 top-0 z-20 w-[75px] sm:w-[120px] md:w-[160px] lg:w-[200px] max-w-[20vw] overflow-hidden">
          <motion.div
            animate={{ rotate: [-1.5, 1.2, -1.5] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="origin-top-left"
          >
            <Image
              src="/images/decorations/flower-garland.png"
              alt=""
              width={200}
              height={280}
              priority
              unoptimized
              className="w-full h-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* Top Right Garland */}
        <div className="pointer-events-none absolute right-0 top-0 z-20 w-[75px] sm:w-[120px] md:w-[160px] lg:w-[200px] max-w-[20vw] overflow-hidden">
          <motion.div
            animate={{ rotate: [1.5, -1.2, 1.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="origin-top-right"
          >
            <Image
              src="/images/decorations/flower-garland-right.webp"
              alt=""
              width={200}
              height={280}
              priority
              unoptimized
              className="w-full h-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

        {/* Interactive Temple Bells */}
        <div
          onClick={playBellSound}
          className="pointer-events-auto absolute left-10 sm:left-16 md:left-24 lg:left-28 top-2 sm:top-4 md:top-5 z-30 w-11 sm:w-16 md:w-20 lg:w-24 animate-bell-swing-gentle cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          role="button"
          tabIndex={0}
          aria-label="Play Temple Bell Sound"
        >
          <Image
            src="/images/bells/temple-bell.png"
            alt=""
            width={84}
            height={160}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_14px_22px_rgba(232,169,59,0.65)]"
          />
        </div>

        <div
          onClick={playBellSound}
          className="pointer-events-auto absolute right-10 sm:right-16 md:right-24 lg:right-28 top-2 sm:top-4 md:top-5 z-30 w-11 sm:w-16 md:w-20 lg:w-24 animate-bell-swing-gentle cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          style={{ animationDelay: "1.4s" }}
          role="button"
          tabIndex={0}
          aria-label="Play Temple Bell Sound"
        >
          <Image
            src="/images/bells/temple-bell.png"
            alt=""
            width={84}
            height={160}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_14px_22px_rgba(232,169,59,0.65)]"
          />
        </div>

        {/* Side Mandalas */}
        <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[260px] sm:w-[360px] md:w-[450px] opacity-20 mix-blend-screen z-10">
          <Image
            src="/images/decorations/mandala.png"
            alt=""
            width={450}
            height={450}
            unoptimized
            className="w-full h-auto object-contain filter blur-[0.5px] drop-shadow-[0_0_30px_rgba(232,169,59,0.4)]"
          />
        </div>

        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[260px] sm:w-[360px] md:w-[450px] opacity-20 mix-blend-screen z-10">
          <Image
            src="/images/decorations/mandala-v2.png"
            alt=""
            width={450}
            height={450}
            unoptimized
            className="w-full h-auto object-contain filter blur-[0.5px] drop-shadow-[0_0_30px_rgba(232,169,59,0.4)]"
          />
        </div>

        {/* Murti & Halo */}
        <div className="relative mt-8 sm:mt-12 mb-4 flex items-center justify-center w-full max-w-sm sm:max-w-md">

          {/* 360° Rotating Head Mandala */}
          <div className="pointer-events-none absolute left-[calc(50%+52px)] sm:left-[calc(50%+72px)] md:left-[calc(50%+92px)] top-[22%] sm:top-[24%] md:top-[26%] -translate-x-1/2 -translate-y-1/2 w-[130px] sm:w-[170px] md:w-[210px] opacity-60 mix-blend-screen z-0 animate-rotate-ultra-slow">
            <Image
              src="/images/decorations/mandala-f2.png"
              alt=""
              width={210}
              height={210}
              unoptimized
              className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(232,169,59,0.85)]"
            />
          </div>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] sm:h-[280px] sm:w-[280px] md:h-[340px] md:w-[340px] rounded-full bg-gradient-to-r from-amber-400/25 via-yellow-400/35 to-orange-400/25 blur-3xl animate-divine-halo"
            aria-hidden="true"
          />

          <motion.div
            className="relative z-10 w-[200px] sm:w-[260px] md:w-[300px]"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/ganesh/ganeshmurti.png"
              alt="श्री गणपती बाप्पा"
              width={300}
              height={300}
              priority
              unoptimized
              className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(232,169,59,0.5)] select-none"
            />
          </motion.div>

          <div className="pointer-events-none absolute left-1 sm:left-4 bottom-0 z-20 w-9 sm:w-12 animate-diya-flame">
            <Image src="/images/diyas/diya.png" alt="" width={48} height={48} unoptimized className="w-full h-auto object-contain" />
          </div>
          <div className="pointer-events-none absolute right-1 sm:right-4 bottom-0 z-20 w-9 sm:w-12 animate-diya-flame">
            <Image src="/images/diyas/diya.png" alt="" width={48} height={48} unoptimized className="w-full h-auto object-contain" />
          </div>
        </div>

        {/* Large Heading */}
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#f3d089] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] drop-shadow-md">
          {lang === "mr" ? (
            <>
              आपल्या गणपती मंडळासाठी <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-lg">Premium Digital Invitation Website</span> 🚩
            </>
          ) : (
            <>
              For Your Ganapati Mandal <br className="hidden sm:inline" />
              <span className="text-white drop-shadow-lg">Premium Digital Invitation Website</span> 🚩
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#fef9eb]/90 sm:text-lg md:text-xl font-medium">
          {lang === "mr"
            ? "अवघ्या काही मिनिटांत आपल्या गणपती मंडळाची सुंदर Digital Invitation Website तयार करा आणि WhatsApp वर हजारो भाविकांपर्यंत पोहोचा."
            : "Create a stunning digital invitation website for your Ganapati Mandal in minutes and reach thousands of devotees via WhatsApp."}
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex w-full max-w-lg flex-col gap-3.5 sm:flex-row sm:justify-center relative z-20">
          <Link
            href="/submit"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8a93b] to-[#d96a2b] px-7 py-4 text-base sm:text-lg font-bold text-[#200608] shadow-[0_12px_35px_rgba(217,106,43,0.35)] transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <BookmarkCheck className="w-5 h-5" />
            <span>{lang === "mr" ? "माझी वेबसाइट तयार करा" : "Create My Website"}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/admin/login"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-[#e8a93b]/50 bg-black/40 px-6 py-4 text-base font-bold text-[#f3d089] backdrop-blur-md transition-all duration-200 hover:bg-[#e8a93b]/20 active:scale-95"
          >
            <KeyRound className="w-4 h-4 text-[#e8a93b]" />
            <span>Login Portal</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-[#f3d089] font-medium">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-[#e8a93b]/20 px-3.5 py-1.5 backdrop-blur-sm">
            ⚡ 100% Dynamic SaaS Engine
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-[#e8a93b]/20 px-3.5 py-1.5 backdrop-blur-sm">
            🐘 4 Premium Distinct Themes
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-[#e8a93b]/20 px-3.5 py-1.5 backdrop-blur-sm">
            📞 Call Now: {contactPhone}
          </span>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <SectionDivider />

      {/* =====================================================
          2. LIVE DEMO WEBSITES SHOWCASE (STRICTLY 4 THEMES)
      ====================================================== */}
      <section id="demo-websites" className="relative z-10 bg-[#24080c]/85 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e8a93b]">
              {lang === "mr" ? "उत्कृष्ट थिम्स (Premium Demo Websites)" : "Premium Themes (Live Demo Websites)"}
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#f3d089]">
              Live Demo Websites
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#fef9eb]/75 max-w-xl mx-auto">
              {lang === "mr"
                ? "प्रत्येक थिममध्ये समान डाटा पण पूर्णपणे वेगळी पारंपरिक व आधुनिक कलाकृती, सजावट आणि ॲनिमेशन समाविष्ट आहे."
                : "Every theme features identical backend data logic with completely unique visual styling, decorations, and animations."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Demo 1: Royal Gold */}
            <div className="group relative rounded-3xl border border-[#e8a93b]/40 bg-black/50 p-5 text-left backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#e8a93b] shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950 p-4 flex flex-col justify-between mb-4 border border-[#e8a93b]/30">
                  <span className="self-start rounded-full bg-[#e8a93b] px-2.5 py-0.5 text-[10px] font-bold text-[#200608]">
                    Theme 1: Royal Temple Gold
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">श्री जय मल्हार गणेश मंडळ</h3>
                    <p className="text-[11px] text-amber-200">Est. १९९८ • कोथरूड, पुणे</p>
                  </div>
                </div>
                <p className="text-xs text-[#fef9eb]/80 leading-relaxed">
                  {lang === "mr"
                    ? "सुवर्ण मंदिर, पितळी स्तंभ, पारंपारिक मंदिर दरवाजे व शाही गणेशोत्सवाचा अनुभव."
                    : "Golden temple pillars, brass motifs, traditional archways and royal mandal aesthetic."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/shri-jay-malhar-ganesh-mandal"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f3d089] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Demo 1 →</span>
                </Link>
              </div>
            </div>

            {/* Demo 2: Peshwai Heritage */}
            <div className="group relative rounded-3xl border border-[#d96a2b]/40 bg-black/50 p-5 text-left backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[#d96a2b] shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-red-950 via-rose-900 to-orange-950 p-4 flex flex-col justify-between mb-4 border border-[#d96a2b]/30">
                  <span className="self-start rounded-full bg-[#d96a2b] px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Theme 2: Peshwai Heritage
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">श्री स्वामी समर्थ मित्र मंडळ</h3>
                    <p className="text-[11px] text-rose-200">Est. १९८८ • सोमवार पेठ, कराड</p>
                  </div>
                </div>
                <p className="text-xs text-[#fef9eb]/80 leading-relaxed">
                  {lang === "mr"
                    ? "मराठमोळी वाड्याची रचना, केसरी तोरणे व तुतारी वादनाचा शाही गणेशोत्सव थाट."
                    : "Traditional Wada architecture, deep royal crimson themes and Maharashtrian heritage."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/shri-swami-samarth-mitra-mandal"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f3d089] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Demo 2 →</span>
                </Link>
              </div>
            </div>

            {/* Demo 3: Modern Premium */}
            <div className="group relative rounded-3xl border border-orange-500/40 bg-black/50 p-5 text-left backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-orange-400 shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 p-4 flex flex-col justify-between mb-4 border border-orange-500/30">
                  <span className="self-start rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Theme 3: Divine Saffron
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळ</h3>
                    <p className="text-[11px] text-orange-200">Est. २००२ • पोवई नाका, सातारा</p>
                  </div>
                </div>
                <p className="text-xs text-[#fef9eb]/80 leading-relaxed">
                  {lang === "mr"
                    ? "शुभ्र व भगवी चकाकी, ग्लासमॉर्फिक आधुनिक कार्ड्स व आधुनिक डिजिटल निमंत्रण."
                    : "Vibrant saffron themes, glassmorphism cards and modern sleek UI elements."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/shri-shivneri-ganesh-mandal"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f3d089] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Demo 3 →</span>
                </Link>
              </div>
            </div>

            {/* Demo 4: Night Darshan */}
            <div className="group relative rounded-3xl border border-sky-500/40 bg-black/50 p-5 text-left backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-sky-400 shadow-xl flex flex-col justify-between">
              <div>
                <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 flex flex-col justify-between mb-4 border border-sky-500/30">
                  <span className="self-start rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-bold text-slate-950">
                    Theme 4: Night Darshan
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">श्री संत ज्ञानेश्वर गणेश मंडळ</h3>
                    <p className="text-[11px] text-sky-200">Est. १९९३ • विश्रामबाग, सांगली</p>
                  </div>
                </div>
                <p className="text-xs text-[#fef9eb]/80 leading-relaxed">
                  {lang === "mr"
                    ? "रात्रीचा रोषणाई सोहळा, दीपमाळांचा सोनेरी प्रकाश, अंधारातील दिव्य वातावरण."
                    : "Night illumination effects, glowing oil lamps, and deep midnight divine ambience."}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href="/shri-sant-dnyaneshwar-ganesh-mandal"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f3d089] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Demo 4 →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <SectionDivider />

      {/* =====================================================
          3. SUPER ADMIN CONTACT TEAM SECTION
      ====================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6 bg-[#1f0508]/90">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#e8a93b] bg-[#e8a93b]/10 px-3 py-1 rounded-full border border-[#e8a93b]/30">
              <Crown className="w-3.5 h-3.5 text-[#e8a93b]" />
              <span>{lang === "mr" ? "अधिकृत ॲडमिन संपर्क" : "Super Admin Team"}</span>
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-[#f3d089]">
              {lang === "mr" ? "👑 अधिकृत ॲडमिन टीम संपर्क माहिती" : "👑 Official Admin Team Contact Info"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#fef9eb]/80 max-w-2xl mx-auto leading-relaxed">
              {lang === "mr"
                ? "तुमच्या मंडळाची निमंत्रण वेबसाइट तयार करण्यासाठी किंवा कोणत्याही मदतीसाठी आमच्या अधिकृत ॲडमिनशी थेट संपर्क साधू शकता."
                : "For website creation, custom setup, or technical assistance, contact our official admin team directly."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminTeam.map((admin) => {
              const waUrl = getAdminWhatsappLink(admin.phone, admin.nameMr);
              return (
                <div
                  key={admin.id}
                  className="group relative rounded-2xl border border-[#e8a93b]/40 bg-gradient-to-b from-[#2e090e]/90 to-[#180406]/95 p-5 backdrop-blur-xl shadow-xl hover:border-[#e8a93b] hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header Badge & Role */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#e8a93b]/20 pb-3 mb-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3 py-1 text-xs font-bold text-[#f3d089] border border-[#e8a93b]/40">
                        {admin.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#e8a93b]" />
                        <span>{lang === "mr" ? admin.roleMr : admin.roleEn}</span>
                      </span>
                    </div>

                    {/* Admin Name */}
                    <h3 className="font-display text-xl font-bold text-white tracking-wide group-hover:text-[#f3d089] transition-colors">
                      {lang === "mr" ? admin.nameMr : admin.nameEn}
                    </h3>
                    <p className="text-xs text-[#fef9eb]/70 mt-0.5">
                      Phone: <span className="font-semibold text-amber-200">{admin.phone}</span>
                    </p>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2.5 pt-3 border-t border-white/10">
                    <a
                      href={`tel:${admin.phone}`}
                      suppressHydrationWarning
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#e8a93b] to-[#d96a2b] px-3 py-2 text-xs font-bold text-[#1c0609] shadow-md hover:scale-105 active:scale-95 transition-all"
                      title={`Call ${admin.nameMr}`}
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{lang === "mr" ? "कॉल करा" : "Call"}</span>
                    </a>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      suppressHydrationWarning
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#25D366]/20 hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all"
                      title={`WhatsApp ${admin.nameMr}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <SectionDivider />

      {/* =====================================================
          4. HOW IT WORKS (7-STEP TIMELINE WORKFLOW)
      ====================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6 bg-[#1c0609]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e8a93b]">
              {lang === "mr" ? "सोपी कार्यपद्धती (How It Works)" : "Simple Process (How It Works)"}
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#f3d089]">
              {lang === "mr" ? "७ टप्प्यांत आपली वेबसाइट तयार करा" : "Build Your Website in 7 Easy Steps"}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#fef9eb]/75 max-w-xl mx-auto">
              {lang === "mr"
                ? "कोणतेही तांत्रिक ज्ञान आवश्यक नाही. तुमची माहिती भरा आणि तुमची वेबसाइट सहज तयार करा."
                : "No technical knowledge required. Fill your details, submit your request, and launch your mandal website effortlessly."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: "Step 1", titleMr: "थिम निवडा", titleEn: "Choose Theme", descMr: "४ उत्कृष्ट थिम्समधून आवडती थिम निवडा.", descEn: "Select from 4 traditional distinct themes." },
              { step: "Step 2", titleMr: "माहिती भरा", titleEn: "Fill Details", descMr: "मंडळाचे नाव, पत्ता व निमंत्रण तपशील भरा.", descEn: "Enter mandal info, contact & invitation notes." },
              { step: "Step 3", titleMr: "फोटो अपलोड", titleEn: "Upload Media", descMr: "गॅलरी फोटो, व्हिडिओ आणि मुख्य मीडिया जोड.", descEn: "Upload gallery photos, videos & hero media." },
              { step: "Step 4", titleMr: "सबमिट करा", titleEn: "Submit Form", descMr: "सर्व तपशील तपासून अर्ज सबमिट करा.", descEn: "Review details & submit request effortlessly." },
              { step: "Step 5", titleMr: "ॲडमिन पडताळणी", titleEn: "Admin Verification", descMr: "सुपर ॲडमिन माहितीची पडताळणी करतील.", descEn: "Super Admin verifies details & payment." },
              { step: "Step 6", titleMr: "वेबसाइट लाइव्ह", titleEn: "Website Live", descMr: "तुमची डिजिटल वेबसाइट लगेच सुरू होईल.", descEn: "Your mandal website goes live instantly." },
              { step: "Step 7", titleMr: "लॉगिन मिळवा", titleEn: "Get Admin Access", descMr: "नंतर बदलांसाठी लॉगिन आयडी व पासवर्ड मिळवा.", descEn: "Get credentials to edit & manage anytime." },
            ].map((st, i) => (
              <div key={i} className="rounded-2xl border border-[#e8a93b]/20 bg-black/40 p-4 backdrop-blur-md text-left relative overflow-hidden">
                <span className="text-[10px] font-bold text-[#e8a93b] uppercase tracking-wider bg-[#e8a93b]/10 px-2 py-0.5 rounded-full border border-[#e8a93b]/20">
                  {st.step}
                </span>
                <h3 className="mt-2.5 font-bold text-[#fef9eb] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#e8a93b]" />
                  <span>{lang === "mr" ? st.titleMr : st.titleEn}</span>
                </h3>
                <p className="mt-1 text-[11px] text-[#fef9eb]/70 leading-relaxed">{lang === "mr" ? st.descMr : st.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <SectionDivider />

      {/* =====================================================
          5. HOMEPAGE CTA & WHATSAPP BOOKING SECTION
      ====================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#e8a93b]/40 bg-gradient-to-b from-[#2e090e]/95 via-[#1e0508]/95 to-[#150306]/95 p-8 text-center shadow-2xl backdrop-blur-xl">
          <span className="text-3xl">🚩</span>
          <h2 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-[#f3d089] leading-snug">
            {lang === "mr"
              ? "आपल्या गणपती मंडळासाठी Premium Digital Invitation Website तयार करा"
              : "Build a Premium Digital Invitation Website for Your Mandal"}
          </h2>
          <p className="mt-3 text-xs sm:text-base text-[#fef9eb]/85 max-w-xl mx-auto leading-relaxed">
            {lang === "mr"
              ? "अवघ्या काही मिनिटांत तुमच्या मंडळाचे सुंदर Digital Invitation Website तयार करा आणि WhatsApp द्वारे हजारो भाविकांपर्यंत पोहोचा."
              : "Create a stunning digital invitation website in minutes and reach thousands of devotees seamlessly via WhatsApp."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#e8a93b] to-[#d96a2b] px-7 py-3.5 text-sm sm:text-base font-bold text-[#200608] shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>{lang === "mr" ? "माझी वेबसाइट तयार करा" : "Create My Website"}</span>
            </Link>

            <a
              href="#demo-websites"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#e8a93b]/50 bg-black/40 px-6 py-3.5 text-sm sm:text-base font-bold text-[#f3d089] backdrop-blur-sm hover:bg-[#e8a93b]/20 active:scale-95 transition-all"
            >
              <Eye className="w-4 h-4 text-[#e8a93b]" />
              <span>{lang === "mr" ? "Live Demo पहा" : "View Live Demos"}</span>
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
              className="inline-flex items-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm sm:text-base font-bold text-[#06140b] shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] active:scale-95 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>{lang === "mr" ? "WhatsApp वर संपर्क करा" : "WhatsApp Contact"}</span>
            </a>

            <a
              href={`tel:${contactPhone}`}
              suppressHydrationWarning
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-5 py-3.5 text-sm sm:text-base font-semibold text-[#fef9eb] hover:bg-white/10 active:scale-95 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call ({contactPhone})</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <SectionDivider />

      {/* =====================================================
          6. ESSENTIAL PLATFORM FEATURES (MARATHI & ENGLISH)
      ====================================================== */}
      <section className="relative z-10 py-16 px-4 sm:px-6 bg-[#24080c]/60">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e8a93b]">
              {lang === "mr" ? "महत्त्वाची वैशिष्ट्ये (Platform Features)" : "Key Features (Platform Highlights)"}
            </span>
            <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-[#f3d089]">
              {lang === "mr" ? "गणेशोत्सवासाठी आवश्यक सर्व सोयी" : "Everything You Need for Digital Ganeshotsav"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              { icon: Globe, titleMr: "✔ अमर्याद मंडळे", titleEn: "✔ Unlimited Mandals", descMr: "अनेक मंडळांच्या डिजिटल वेबसाइट्स तयार करा.", descEn: "Create & host multiple mandal websites." },
              { icon: Palette, titleMr: "✔ ४ सुवर्ण थिम्स", titleEn: "✔ 4 Premium Themes", descMr: "रॉयल गोल्ड, पेशवाई, भगवी आणि नाईट दर्शन थिम्स.", descEn: "Royal Gold, Peshwai, Saffron, Night Darshan." },
              { icon: LayoutDashboard, titleMr: "✔ ॲडमिन पॅनेल", titleEn: "✔ Admin Dashboard", descMr: "मंडळाची माहिती व फोटो हवे तेव्हा अपडेट करा.", descEn: "Full control panel for mandal content management." },
              { icon: Film, titleMr: "✔ व्हिडिओ बॅकग्राउंड", titleEn: "✔ Hero Video Stream", descMr: "हाई-रिझोल्यूशन देखावा व आरती व्हिडिओ.", descEn: "High-res background & featured video player." },
              { icon: Share2, titleMr: "✔ WhatsApp निमंत्रण", titleEn: "✔ WhatsApp Sharing", descMr: "भाविकांना एका क्लिकवर निमंत्रण पाठवा.", descEn: "Send direct invite messages to devotees." },
              { icon: MapPin, titleMr: "✔ गूगल मॅप्स", titleEn: "✔ Google Maps Direction", descMr: "मंडळाचे अचूक ठिकाण व मार्गदर्शक दिशा.", descEn: "Embedded location map and live directions." },
              { icon: Calendar, titleMr: "✔ १० दिवसांचे वेळापत्रक", titleEn: "✔ 10-Day Timeline", descMr: "दैनंदिन आरती व कार्यक्रमांचे वेळापत्रक.", descEn: "Reorderable 10-day event & aarti schedule." },
              { icon: FileText, titleMr: "✔ गॅलरी व व्हिडिओ", titleEn: "✔ Photo & Video Gallery", descMr: "मंडळाचे फोटो व व्हिडिओ अपलोड करा.", descEn: "Unlimited photo & video uploads." },
              { icon: Music, titleMr: "✔ भक्ती संगीत", titleEn: "✔ Devotional Audio", descMr: "मंत्रमुग्ध करणारे आरती व भक्ती संगीत प्लेअर.", descEn: "Custom devotional audio player with bell sound." },
              { icon: QrCode, titleMr: "✔ QR कोड", titleEn: "✔ Dynamic QR Code", descMr: "स्कॅन करून वेबसाइट उघडण्यासाठी QR कोड.", descEn: "Dynamic scan & share QR code generator." },
              { icon: FileText, titleMr: "✔ PDF निमंत्रण कार्ड", titleEn: "✔ Printable PDF Card", descMr: "छपाईयोग्य निमंत्रण पत्रिका डाऊनलोड करा.", descEn: "Printable PDF card downloads." },
              { icon: ShieldCheck, titleMr: "✔ मोबाईल फ्रेंडली", titleEn: "✔ Mobile Responsive", descMr: "सर्व मोबाईल व संगणकावर सुरळीत चालणारी रचना.", descEn: "Optimized for all mobile and desktop screens." },
            ].map((ft, i) => {
              const Icon = ft.icon;
              return (
                <div key={i} className="rounded-2xl border border-[#e8a93b]/20 bg-black/40 p-4 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8a93b]/20 text-[#e8a93b] mb-2.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-[#fef9eb] text-xs sm:text-sm">{lang === "mr" ? ft.titleMr : ft.titleEn}</h3>
                  <p className="mt-1 text-[11px] text-[#fef9eb]/70 leading-relaxed">{lang === "mr" ? ft.descMr : ft.descEn}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          STICKY FLOATING WHATSAPP BUTTON (DESKTOP & MOBILE)
      ====================================================== */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="flex items-center gap-2 rounded-full border border-[#25D366]/60 bg-gradient-to-r from-[#25D366] to-[#128C7E] px-4 py-3 text-xs font-bold text-white shadow-[0_8px_30px_rgba(37,211,102,0.4)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="WhatsApp वर संपर्क साधा"
        >
          <MessageSquare className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">WhatsApp Booking</span>
        </a>
      </div>

      {/* =====================================================
          FOOTER (ADVIKS SOFTTECH)
      ====================================================== */}
      <footer className="relative z-10 border-t border-[#e8a93b]/20 bg-[#140305] py-10 px-4 text-center text-xs text-[#fef9eb]/60">
        <div className="mx-auto max-w-4xl space-y-3">
          <p className="font-display text-base text-[#f3d089] font-bold">
            डिजिटल गणपती निमंत्रण प्लॅटफॉर्म
          </p>
          <p className="text-xs font-semibold text-[#fef9eb]/80">
            Powered by Adviks Softtech • Developed by Dipak Pawar
          </p>
          <div className="flex justify-center flex-wrap gap-4 text-xs font-semibold text-[#fef9eb]/80 pt-1">
            <a href={platformUrl} className="hover:text-[#f3d089]">Website</a>
            <span>•</span>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" suppressHydrationWarning className="hover:text-[#f3d089]">WhatsApp ({contactPhone})</a>
            <span>•</span>
            <a href={`tel:${contactPhone}`} suppressHydrationWarning className="hover:text-[#f3d089]">Call ({contactPhone})</a>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-[#f3d089]">Admin Portal</Link>
          </div>
          <p className="text-[10px] tracking-wider text-[#f3d089]/50 pt-3">
            © 2026 ADVIKS SOFTTECH • ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>

      <FestiveAudioAndBlessing />
    </main>
  );
}