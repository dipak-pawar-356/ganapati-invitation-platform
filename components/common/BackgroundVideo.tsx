"use client";

import Image from "next/image";

type BackgroundVideoProps = {
  overlayGradient?: string;
  posterUrl?: string;
  videoUrl?: string | null;
  opacity?: number;
};

export default function BackgroundVideo({
  overlayGradient = "from-black/60 via-black/45 to-[var(--t-bg)]",
  posterUrl = "/images/backgrounds/hero-background-mobile.webp",
  videoUrl,
  opacity = 0.85,
}: BackgroundVideoProps) {
  const activeVideo = (videoUrl && videoUrl.trim()) ? videoUrl.trim() : "/video/bg-video-mobile.mp4";

  return (
    <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden pointer-events-none select-none">
      {/* Responsive Background Poster Images */}
      <div className="absolute inset-0 -z-30 h-full w-full">
        {/* Desktop Background Image (>= md) */}
        <div className="hidden md:block absolute inset-0 h-full w-full">
          <Image
            src="/images/backgrounds/hero-background-desktop.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Mobile Background Image (< md) */}
        <div className="md:hidden absolute inset-0 h-full w-full">
          <Image
            src="/images/backgrounds/hero-background-mobile.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>

      {/* Dynamic Video Element across Desktop, Tablet & Mobile */}
      <video
        key={activeVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        onContextMenu={(e) => e.preventDefault()}
        poster={posterUrl}
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity }}
      >
        <source src={activeVideo} type="video/mp4" />
        <source src={activeVideo} type="video/webm" />
      </video>

      {/* Cinematic Dark & Ambient Gradient Overlay */}
      <div className={`absolute inset-0 -z-10 bg-gradient-to-b ${overlayGradient}`} />

      {/* Soft Temple Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
