"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface FlowerParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  drag: number;
  size: number;
  opacity: number;
  image: HTMLImageElement;
  life: number;
  maxLife: number;
}

export function FestiveAudioAndBlessing() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRingingBell, setIsRingingBell] = useState(false);
  const [blessingCount, setBlessingCount] = useState(108);
  const [showShowerToast, setShowShowerToast] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bellAudioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<FlowerParticle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Cached preloaded flower images
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  // Preload flower images for instant 60fps canvas rendering
  useEffect(() => {
    const saved = localStorage.getItem("ganesh_blessings_count");
    if (saved) {
      setBlessingCount(parseInt(saved, 10));
    }

    const srcs = [
      "/images/decorations/marigold.png",
      "/images/decorations/Plumeria.png",
    ];

    loadedImagesRef.current = srcs.map((src) => {
      const img = new window.Image();
      img.src = src;
      return img;
    });

    // Handle canvas resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    const handleCustomFlowerShower = (e: any) => {
      const x = e.detail?.x ?? window.innerWidth / 2;
      const y = e.detail?.y ?? window.innerHeight / 2;
      triggerBurst(x, y, e.detail?.count ?? 55);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("trigger-flower-burst", handleCustomFlowerShower);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("trigger-flower-burst", handleCustomFlowerShower);
    };
  }, []);

  // Audio control (Bhajan)
  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/bhajan.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.55;
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {
          if (audioRef.current) {
            audioRef.current.src = "/audio/welcome-chant.mp3";
            audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {});
          }
        });
    }
  };

  // Bell chime
  const ringBell = () => {
    setIsRingingBell(true);
    if (!bellAudioRef.current) {
      bellAudioRef.current = new Audio("/audio/temple-bell.mp3");
      bellAudioRef.current.volume = 0.75;
    }
    bellAudioRef.current.currentTime = 0;
    bellAudioRef.current.play().catch(() => {});

    setTimeout(() => {
      setIsRingingBell(false);
    }, 1200);
  };

  // Canvas 60fps physics animation loop
  const updateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Physics update
      p.vx *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // Smooth fade-out near end of life or past bottom
      if (p.life > p.maxLife * 0.7) {
        p.opacity = Math.max(0, (p.maxLife - p.life) / (p.maxLife * 0.3));
      }

      if (p.y > canvas.height + 60 || p.opacity <= 0.01) {
        particles.splice(i, 1);
        continue;
      }

      // Render Clean 2D Flower (No rotation or 3D warping)
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);

      // Draw flower image centered at exact aspect ratio
      const drawSize = p.size;
      if (p.image.complete && p.image.naturalWidth > 0) {
        ctx.drawImage(
          p.image,
          -drawSize / 2,
          -drawSize / 2,
          drawSize,
          drawSize
        );
      } else {
        // Fallback golden circular glow particle if image still loading
        ctx.beginPath();
        ctx.arc(0, 0, drawSize / 3, 0, Math.PI * 2);
        ctx.fillStyle = "#e8a93b";
        ctx.fill();
      }

      ctx.restore();
    }

    if (particles.length > 0) {
      animFrameIdRef.current = requestAnimationFrame(updateParticles);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrameIdRef.current = null;
    }
  }, []);

  // Reusable flower explosion function from any screen point
  const triggerBurst = useCallback((startX: number, startY: number, count = 40) => {
    const availableImages = loadedImagesRef.current.length > 0
      ? loadedImagesRef.current
      : [];

    const newParticles: FlowerParticle[] = [];

    for (let i = 0; i < count; i++) {
      const img = availableImages[i % availableImages.length] || availableImages[0];

      // Spray spread: 185 to 355 degrees (gentle upward fountain)
      const angle = (185 + Math.random() * 170) * (Math.PI / 180);
      
      // Gentle, graceful devotional shower velocity
      const power = 7.5 + Math.random() * 8.5; // Soft upward launch
      const vx = Math.cos(angle) * power * (0.7 + Math.random() * 0.6);
      const vy = Math.sin(angle) * power * 1.05;

      newParticles.push({
        x: startX + (Math.random() - 0.5) * 30,
        y: startY + (Math.random() - 0.5) * 15,
        vx,
        vy,
        gravity: 0.14 + Math.random() * 0.08, // Very gentle floaty gravity
        drag: 0.991, // Smooth air glide
        size: Math.floor(Math.random() * 20 + 34), // 34px to 54px
        opacity: 1,
        image: img,
        life: 0,
        maxLife: Math.floor(240 + Math.random() * 120), // 4 to 6 seconds duration
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    if (canvasRef.current) {
      if (canvasRef.current.width !== window.innerWidth || canvasRef.current.height !== window.innerHeight) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    }

    if (!animFrameIdRef.current) {
      animFrameIdRef.current = requestAnimationFrame(updateParticles);
    }
  }, [updateParticles]);

  // Explosive flower blast eruption on button tap
  const showerFlowers = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const newCount = blessingCount + 1;
    setBlessingCount(newCount);
    localStorage.setItem("ganesh_blessings_count", newCount.toString());

    setShowShowerToast(true);
    setTimeout(() => setShowShowerToast(false), 2500);

    // Get origin coordinates of the button
    let startX = window.innerWidth - 80;
    let startY = window.innerHeight - 80;

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    } else if (e) {
      startX = e.clientX;
      startY = e.clientY;
    }

    triggerBurst(startX, startY, 40);
  };

  return (
    <>
      {/* High-Performance 60FPS Hardware-Accelerated Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      />

      {/* Floating Control Toolbar */}
      <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
        
        {/* Devotional Toast */}
        {showShowerToast && (
          <div className="rounded-2xl border border-[var(--t-primary)]/60 bg-[var(--t-bg)]/95 px-4 py-2 text-xs sm:text-sm font-bold text-[var(--t-primary-light)] shadow-2xl backdrop-blur-md animate-bounce select-none">
            🌸 बाप्पांच्या चरणी पुष्प अर्पण केले! ({blessingCount})
          </div>
        )}

        {/* Flower Offering Button with Explosive Burst */}
        <button
          ref={buttonRef}
          type="button"
          suppressHydrationWarning
          onClick={showerFlowers}
          className="group relative flex items-center gap-2.5 rounded-full border border-[var(--t-primary)]/60 bg-gradient-to-r from-[var(--t-bg-card)] to-[var(--t-bg)] p-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-[var(--t-text)] shadow-[0_8px_30px_rgba(0,0,0,0.8)] shadow-amber-950/40 backdrop-blur-xl transition-all hover:scale-105 hover:border-[var(--t-primary)] active:scale-95 cursor-pointer ring-1 ring-[var(--t-border)]"
          title="बाप्पांना पुष्प अर्पण करा"
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <Image
              src="/images/decorations/Plumeria.png"
              alt="पुष्प"
              width={30}
              height={30}
              className="h-6 w-6 object-contain transition-transform group-hover:scale-125"
            />
          </span>
          <span className="hidden sm:inline font-bold text-[var(--t-primary-light)] tracking-wide">
            पुष्प अर्पण करा <span className="ml-1 rounded-full bg-[var(--t-primary-muted)] px-2 py-0.5 text-[11px] text-[var(--t-text)]">({blessingCount})</span>
          </span>
        </button>

        {/* Secondary Row: Temple Bell + Audio Toggle */}
        <div className="flex items-center gap-2">
          {/* Temple Bell */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={ringBell}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--t-primary)]/50 bg-[var(--t-bg)]/90 text-xl shadow-lg backdrop-blur-md transition-all hover:border-[var(--t-primary)] hover:scale-110 active:scale-90 cursor-pointer ${
              isRingingBell ? "animate-[bell-swing_0.6s_ease-in-out_infinite] ring-2 ring-amber-400" : ""
            }`}
            title="घंटा वाजवा (Ring Temple Bell)"
          >
            🔔
          </button>

          {/* Aarti Audio Toggle */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleAudio}
            className={`flex h-11 items-center gap-2 rounded-full border px-4 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
              isPlayingAudio
                ? "border-amber-400 bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] font-bold shadow-amber-900/50"
                : "border-[var(--t-primary)]/40 bg-[var(--t-bg)]/90 text-[var(--t-primary-light)] hover:border-[var(--t-primary)]"
            }`}
            title={isPlayingAudio ? "आरती थांबवा" : "भजन ऐका"}
          >
            <span className="text-base">{isPlayingAudio ? "🔊" : "🔈"}</span>
            <span className="text-xs font-bold hidden xs:inline">
              {isPlayingAudio ? "भजन सुरू आहे" : "भजन ऐका"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
