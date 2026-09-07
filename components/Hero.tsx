"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CoconutBreak from "./coconut/CoconutBreak";
import BackgroundVideo from "@/components/common/BackgroundVideo";
import { Volume2, VolumeX, ChevronDown } from "lucide-react";

// Doors overlay uses Framer Motion's AnimatePresence
const DoorsOverlay = dynamic(() => import("./DoorsOverlay"), {
  ssr: false,
});

type HeroProps = {
  mandalName: string;
  inviteLine: string;
  heroVideoUrl?: string | null;
  aartiTimes?: {
    morning?: string;
    evening?: string;
  } | string;
  showPlatformActions?: boolean;
};

export default function Hero({
  mandalName,
  inviteLine,
  heroVideoUrl,
  aartiTimes,
  showPlatformActions = false,
}: HeroProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playBellSound = () => {
    if (typeof window !== "undefined") {
      try {
        const bellAudio = new Audio("/audio/temple-bell.mp3");
        bellAudio.currentTime = 0;
        bellAudio.volume = 0.85;
        bellAudio.play().catch(() => {});
      } catch {
        // Safe audio playback fallback
      }
    }
  };

  // Handle door opening with smooth flower shower and temple bell audio
  const handleOpenDoors = (e?: React.MouseEvent) => {
    if (doorsOpen) return;
    setDoorsOpen(true);

    if (typeof window !== "undefined") {
      playBellSound();

      const clickX = e?.clientX ?? window.innerWidth / 2;
      const clickY = e?.clientY ?? window.innerHeight / 2;
      window.dispatchEvent(
        new CustomEvent("trigger-flower-burst", {
          detail: { x: clickX, y: clickY, count: 48 },
        })
      );
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          setPlaying(false);
        });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden text-center select-none bg-(--t-bg) text-(--t-text) flex flex-col items-center justify-between">
      {/* =====================================================
          1. INTRO DOORS OVERLAY
      ====================================================== */}
      <DoorsOverlay doorsOpen={doorsOpen} onOpen={handleOpenDoors} />

      {/* =====================================================
          2. DYNAMIC BACKGROUND VIDEO
      ====================================================== */}
      <BackgroundVideo
        videoUrl={heroVideoUrl}
        posterUrl="/images/backgrounds/hero-background-mobile.webp"
        overlayGradient="from-black/70 via-black/50 to-[var(--t-bg)]"
      />

      {/* =====================================================
          3. MASTER DECORATIONS: GARLANDS & BELLS (TORAN REMOVED)
      ====================================================== */}

      {/* LAYER 1: FLOWER GARLANDS (LEFT: FLOWER-GARLAND.PNG, RIGHT: FLOWER-GARLAND-RIGHT.WEBP) */}
      <div className="pointer-events-none absolute left-0 top-0 z-20 w-18.75 sm:w-30 md:w-40 lg:w-50 max-w-[20vw] overflow-hidden">
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
            style={{ height: "auto" }}
            className="w-full h-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-20 w-18.75 sm:w-30 md:w-40 lg:w-50 max-w-[20vw] overflow-hidden">
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
            style={{ height: "auto" }}
            className="w-full h-auto object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
          />
        </motion.div>
      </div>

      {/* LAYER 2: INTERACTIVE TEMPLE BELLS (PROMINENT SIZE & TOP RANGE ALIGNMENT WITH GARLANDS) */}
      <div
        onClick={playBellSound}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playBellSound();
          }
        }}
        suppressHydrationWarning
        className="pointer-events-auto absolute left-10 sm:left-16 md:left-24 lg:left-28 top-2 sm:top-4 md:top-5 z-40 w-11 sm:w-16 md:w-20 lg:w-24 cursor-pointer origin-top hover:scale-110 active:scale-95 transition-transform duration-300 select-none"
        role="button"
        tabIndex={0}
        aria-label="Play Temple Bell Sound"
      >
        <div className="w-full h-full animate-bell-swing-gentle origin-top">
          <Image
            src="/images/bells/temple-bell.png"
            alt="Play Temple Bell Sound"
            width={84}
            height={160}
            unoptimized
            style={{ height: "auto" }}
            className="w-full h-auto object-contain filter drop-shadow-[0_14px_22px_var(--t-primary-glow-lg,rgba(232,169,59,0.65))] transition-all"
          />
        </div>
      </div>

      <div
        onClick={playBellSound}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            playBellSound();
          }
        }}
        suppressHydrationWarning
        className="pointer-events-auto absolute right-10 sm:right-16 md:right-24 lg:right-28 top-2 sm:top-4 md:top-5 z-40 w-11 sm:w-16 md:w-20 lg:w-24 cursor-pointer origin-top hover:scale-110 active:scale-95 transition-transform duration-300 select-none"
        role="button"
        tabIndex={0}
        aria-label="Play Temple Bell Sound"
      >
        <div
          className="w-full h-full animate-bell-swing-gentle origin-top"
          style={{ animationDelay: "1.4s" }}
        >
          <Image
            src="/images/bells/temple-bell.png"
            alt="Play Temple Bell Sound"
            width={84}
            height={160}
            unoptimized
            style={{ height: "auto" }}
            className="w-full h-auto object-contain filter drop-shadow-[0_14px_22px_var(--t-primary-glow-lg,rgba(232,169,59,0.65))] transition-all"
          />
        </div>
      </div>

      {/* FIXED SIDE BORDER LINE MANDALAS (STATIC, NO ROTATION, FIXED ON LEFT & RIGHT MIDDLE BORDER LINES) */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-65 sm:w-90 md:w-112.5 opacity-20 mix-blend-screen z-10">
        <Image
          src="/images/decorations/mandala.png"
          alt=""
          width={450}
          height={450}
          unoptimized
          style={{ height: "auto" }}
          className="w-full h-auto object-contain filter blur-[0.5px] drop-shadow-[0_0_30px_var(--t-primary-glow)]"
        />
      </div>

      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-65 sm:w-90 md:w-112.5 opacity-20 mix-blend-screen z-10">
        <Image
          src="/images/decorations/mandala-v2.png"
          alt=""
          width={450}
          height={450}
          unoptimized
          style={{ height: "auto" }}
          className="w-full h-auto object-contain filter blur-[0.5px] drop-shadow-[0_0_30px_var(--t-primary-glow)]"
        />
      </div>

      {/* NATURAL FLOATING PETALS SCATTER */}
      <div className="pointer-events-none absolute top-12 left-1/4 z-10 w-6 opacity-75 animate-petal-drift">
        <Image src="/images/petals/petals.png" alt="" width={24} height={24} unoptimized style={{ height: "auto" }} className="w-full h-auto object-contain" />
      </div>
      <div className="pointer-events-none absolute top-20 right-1/4 z-10 w-6 opacity-75 animate-petal-drift" style={{ animationDelay: "4s" }}>
        <Image src="/images/petals/petals.png" alt="" width={24} height={24} unoptimized style={{ height: "auto" }} className="w-full h-auto object-contain" />
      </div>

      {/* Audio Play/Pause Button */}
      <div className="absolute right-4 top-16 sm:top-20 z-40">
        <button
          type="button"
          suppressHydrationWarning
          onClick={toggleMusic}
          className="flex items-center justify-center h-10 w-10 rounded-full border border-(--t-border) bg-black/60 text-(--t-primary-light) backdrop-blur-md shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label={playing ? "Pause Bhajan" : "Play Bhajan"}
        >
          {playing ? <Volume2 className="w-5 h-5 animate-pulse text-(--t-primary)" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* =====================================================
          4. MAIN HERO CONTENT CONTAINER (VISUAL HIERARCHY)
      ====================================================== */}
      <div className="relative z-20 mx-auto flex w-full max-w-4xl flex-col items-center text-center pt-24 sm:pt-32 md:pt-36 lg:pt-40 pb-8 px-4 flex-1 pointer-events-none *:pointer-events-auto">

        {/* WELCOME TEXT (CLEAR OF TOP TORAN) */}
        <div className="w-full max-w-2xl px-2 relative z-30">
          <p className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-(--t-primary) uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            ॥ श्री गणेशाय नमः ॥
          </p>

          <div className="mx-auto mt-2 h-0.5 w-16 sm:w-24 rounded-full bg-linear-to-r from-transparent via-(--t-divider) to-transparent" />

          <p className="mx-auto mt-3 max-w-lg text-xs sm:text-base md:text-lg font-semibold leading-relaxed text-(--t-text) drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {inviteLine}
          </p>

          {/* DAILY AARTI BADGE */}
          <div className="mt-3.5 inline-flex items-center justify-center gap-2 rounded-full border border-(--t-border) bg-black/75 px-4 py-1.5 backdrop-blur-md shadow-2xl">
            <span className="text-sm">🪔</span>
            <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs sm:text-sm font-bold text-(--t-primary-light)">
              <span>दैनिक आरती:</span>
              <span className="text-white">सकाळी ८:०० | संध्याकाळी ७:३०</span>
            </div>
          </div>

          {/* MANDAL NAME */}
          <h1 className="mt-4 font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-(--t-primary-light) tracking-normal wrap-break-word drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)]">
            {mandalName}
          </h1>
        </div>

        {/* ===================================================
            5. GANAPATI MURTI & 360° ROTATING HEAD HALO MANDALA (MANDALA-F2.PNG)
        ==================================================== */}
        <div className="relative mt-6 sm:mt-8 flex items-center justify-center w-full max-w-md">

          {/* 360° ROTATING HEAD MANDALA DIRECTLY BEHIND GANPATI IDOL HEAD (MANDALA-F2.PNG) */}
          <div className="pointer-events-none absolute left-[calc(50%+52px)] sm:left-[calc(50%+72px)] md:left-[calc(50%+92px)] top-[22%] sm:top-[24%] md:top-[26%] -translate-x-1/2 -translate-y-1/2 w-32.5 sm:w-42.5 md:w-52.5 opacity-60 mix-blend-screen z-0 animate-rotate-ultra-slow">
            <Image
              src="/images/decorations/mandala-f2.png"
              alt=""
              width={210}
              height={210}
              unoptimized
              style={{ height: "auto" }}
              className="w-full h-auto object-contain filter drop-shadow-[0_0_25px_rgba(232,169,59,0.85)]"
            />
          </div>

          {/* Soft Golden Ambient Radial Halo Glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-55 w-55 sm:h-75 sm:w-75 md:h-90 md:w-90 rounded-full bg-linear-to-r from-(--t-primary)/25 via-(--t-primary)/35 to-(--t-secondary)/25 blur-3xl animate-divine-halo"
            aria-hidden="true"
          />

          {/* Elevated Floating Ganapati Murti Idol */}
          <motion.div
            className="relative z-10 w-57.5 sm:w-70 md:w-82.5 lg:w-92.5"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/ganesh/ganeshmurti.png"
              alt="श्री गणपती बाप्पा"
              width={370}
              height={370}
              priority
              unoptimized
              style={{ height: "auto" }}
              className="w-full h-auto object-contain filter drop-shadow-[0_22px_40px_var(--t-primary-glow)]"
            />
          </motion.div>

          {/* Symmetrical Diyas Below Murti */}
          <div className="pointer-events-none absolute left-0 sm:left-4 bottom-2 z-20 w-10 sm:w-14 animate-diya-flame">
            <Image src="/images/diyas/diya.png" alt="" width={56} height={56} unoptimized style={{ height: "auto" }} className="w-full h-auto object-contain" />
          </div>
          <div className="pointer-events-none absolute right-0 sm:right-4 bottom-2 z-20 w-10 sm:w-14 animate-diya-flame">
            <Image src="/images/diyas/diya.png" alt="" width={56} height={56} unoptimized style={{ height: "auto" }} className="w-full h-auto object-contain" />
          </div>
        </div>

        {/* ===================================================
            6. COCONUT OFFERING & ACTION BUTTONS
        ==================================================== */}
        <div className="relative z-20 mt-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center gap-2">
            <Image src="/images/decorations/coconut-left.png" alt="" width={32} height={32} unoptimized style={{ height: "auto" }} className="w-6 h-6 object-contain opacity-80" />
            <CoconutBreak
              size={110}
              upwardDistance={55}
              downwardDistance={45}
            />
            <Image src="/images/decorations/coconut-right.png" alt="" width={32} height={32} unoptimized style={{ height: "auto" }} className="w-6 h-6 object-contain opacity-80" />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 max-w-65 text-center text-xs font-bold leading-relaxed text-(--t-primary-light) sm:text-sm drop-shadow-md"
          >
            नारळ धरून वर उचला आणि खाली आणून फोडा 🥥
          </motion.p>

          {/* ACTION BUTTONS (ONLY IF showPlatformActions IS TRUE) */}
          {showPlatformActions && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
              <a
                href="/submit"
                suppressHydrationWarning
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-(--t-primary) bg-linear-to-r from-(--t-btn-bg-from) via-(--t-btn-bg-via) to-(--t-btn-bg-to) px-6 py-3 text-xs sm:text-sm font-extrabold text-(--t-text) shadow-[0_8px_20px_var(--t-primary-glow)] hover:shadow-[0_12px_30px_rgba(232,169,59,0.55)] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <span>🌸 माझी वेबसाइट तयार करा</span>
              </a>

              <a
                href="/admin/login"
                suppressHydrationWarning
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-amber-400/80 bg-linear-to-r from-amber-950/90 via-amber-900/90 to-amber-950/90 px-6 py-3 text-xs sm:text-sm font-extrabold text-(--t-primary-light) shadow-[0_8px_20px_var(--t-primary-glow)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.45)] hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 backdrop-blur-md cursor-pointer"
              >
                <span>🔑 Login Portal</span>
              </a>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="mt-7 flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-[11px] font-bold text-(--t-primary-light) tracking-widest uppercase">खाली स्क्रोल करा</span>
          <ChevronDown className="w-4 h-4 text-(--t-primary-light) animate-bounce" />
        </div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} src="/audio/bhajan.mp3" preload="none" loop />
    </section>
  );
}