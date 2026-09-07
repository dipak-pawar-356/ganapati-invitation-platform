"use client";

import Image from "next/image";
import { Film } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroVideoSectionProps {
  videoUrl?: string | null;
  posterUrl?: string | null;
  mandalName: string;
}

export default function HeroVideoSection({
  videoUrl,
  posterUrl = "/images/backgrounds/hero-background-desktop.webp",
  mandalName,
}: HeroVideoSectionProps) {
  const [activeVideo, setActiveVideo] = useState<string>("/video/bg-video.mp4");

  useEffect(() => {
    if (videoUrl) {
      setActiveVideo(videoUrl);
      return;
    }

    const isMobile = window.innerWidth < 768;
    setActiveVideo(isMobile ? "/video/bg-video-mobile.mp4" : "/video/bg-video.mp4");

    const handleResize = () => {
      if (!videoUrl) {
        setActiveVideo(window.innerWidth < 768 ? "/video/bg-video-mobile.mp4" : "/video/bg-video.mp4");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [videoUrl]);

  return (
    <section className="relative z-10 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--t-border)] bg-black/40 px-4 py-1 text-xs font-semibold text-[var(--t-primary-light)] backdrop-blur-md mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>विशेष देखावा व्हीडिओ</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--t-primary-light)]">
            {mandalName} — विशेष झलक
          </h2>
        </div>

        {/* Video Player Container with Traditional Decorative Frame */}
        <div className="relative mx-auto overflow-hidden rounded-3xl border-2 border-[var(--t-border-accent)] bg-black/60 p-2 shadow-2xl backdrop-blur-md">

          <video
            key={activeVideo}
            src={activeVideo}
            poster={posterUrl || undefined}
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-inner"
          />

        </div>
      </div>
    </section>
  );
}
