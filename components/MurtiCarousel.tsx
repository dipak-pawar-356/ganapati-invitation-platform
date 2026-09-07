"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type MurtiCarouselProps = {
  mandalName: string;
  establishedYear: string;
  photos: string[]; // dynamic per client — from Neon Database, 3-6 photos work best here
};

export default function MurtiCarousel({ mandalName, establishedYear, photos }: MurtiCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const total = photos.length;

  // Smooth transition: current card exits, index changes, new card settles in
  const changeSlide = useCallback(
    (direction: "next" | "previous") => {
      if (total <= 1 || isShuffling) return;
      setIsShuffling(true);

      window.setTimeout(() => {
        setActiveIndex((prev) => {
          if (direction === "next") return prev === total - 1 ? 0 : prev + 1;
          return prev === 0 ? total - 1 : prev - 1;
        });
        window.setTimeout(() => setIsShuffling(false), 650);
      }, 180);
    },
    [isShuffling, total]
  );

  const goNext = useCallback(() => changeSlide("next"), [changeSlide]);
  const goPrevious = useCallback(() => changeSlide("previous"), [changeSlide]);

  // Auto-slideshow every 3s
  useEffect(() => {
    if (total <= 1) return;
    const interval = window.setInterval(() => changeSlide("next"), 3000);
    return () => window.clearInterval(interval);
  }, [changeSlide, total]);

  if (total === 0) return null;

  return (
    <section className="relative min-h-[720px] overflow-hidden py-14 sm:py-16 lg:min-h-[850px] lg:py-20">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/backgrounds/background3.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* SWINGING GARLANDS */}
      <div className="pointer-events-none absolute left-0 top-[110px] z-20 w-[115px] sm:w-[165px] md:w-[210px] lg:top-[125px] lg:w-[250px] xl:w-[290px]">
        <div className="garland-swing-left">
          <Image src="/images/decorations/flower-garland-left.webp" alt="" width={600} height={900} className="h-auto w-full object-contain" />
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 top-[110px] z-20 w-[115px] sm:w-[165px] md:w-[210px] lg:top-[125px] lg:w-[250px] xl:w-[290px]">
        <div className="garland-swing-right">
          <Image src="/images/decorations/flower-garland-right.webp" alt="" width={600} height={900} className="h-auto w-full object-contain" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-30 mx-auto flex max-w-6xl flex-col items-center px-5">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-[var(--color-gold-light)] sm:text-[11px]">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <h2 className="mt-1 text-center text-[25px] font-bold leading-tight text-[var(--color-ivory)] drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)] sm:text-3xl md:text-4xl">
          {mandalName}
        </h2>
        <p className="mt-2 text-center text-[9px] font-medium leading-relaxed text-[var(--color-gold)] sm:text-xs">
          गणेशोत्सवाच्या मंगलमय सोहळ्यात
          <br />
          आपले हार्दिक स्वागत
        </p>

        {/* CIRCULAR CAROUSEL */}
        <div className="relative mt-8 w-full sm:mt-10">
          <div className="relative mx-auto h-[430px] w-full overflow-hidden sm:h-[515px] md:h-[560px]">
            {photos.map((photo, index) => {
              let offset = index - activeIndex;
              if (offset > total / 2) offset -= total;
              if (offset < -total / 2) offset += total;

              const isVisible = Math.abs(offset) <= 1;
              const isActive = offset === 0;
              const mobileDistance = 165;

              return (
                <div
                  key={photo + index}
                  className="absolute left-1/2 top-0 flex justify-center will-change-transform transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    zIndex: isActive ? 20 : 10,
                    opacity: isVisible ? (isActive ? 1 : 0.58) : 0,
                    transform: `translateX(calc(-50% + ${offset * mobileDistance}px)) scale(${isActive ? 1 : 0.82}) rotateY(${offset * -4}deg)`,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <div className="relative w-[300px] h-[400px] aspect-[4/3] overflow-hidden rounded-[28px] bg-[var(--color-ivory)] shadow-[0_18px_45px_rgba(30,10,0,0.38)] sm:w-[420px] md:w-[520px] lg:w-[560px]">
                    <div className="relative h-full w-full overflow-hidden">
                      <Image
                        src={photo}
                        alt=""
                        fill
                        priority={index === 0}
                        unoptimized
                        sizes="(max-width: 640px) 300px, (max-width: 768px) 420px, (max-width: 1024px) 520px, 560px"
                        className="object-cover object-center"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    </div>
                    {isActive && (
                      <div className="absolute bottom-3 left-0 right-0 text-center">
                        <span className="bg-black/50 text-[var(--color-gold-light)] text-sm px-4 py-1 rounded-full">
                          स्थापना : {establishedYear}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONTROLS */}
          {total > 1 && (
            <div className="relative z-40 mt-5 flex items-center justify-center gap-3 sm:mt-6">
              <button
                type="button"
                onClick={goPrevious}
                aria-label="Previous photo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold-light)] text-[var(--color-maroon-dark)] shadow-[0_5px_15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next photo"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-gold-light)] text-[var(--color-maroon-dark)] shadow-[0_5px_15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 active:scale-95 sm:h-10 sm:w-10"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CURVE */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[65px] w-full overflow-hidden">
        <div className="absolute -bottom-[48px] left-1/2 h-[95px] w-[120%] -translate-x-1/2 rounded-[50%_50%_0_0] bg-[var(--color-ivory)]" />
      </div>

      {/* DIYA */}
      <div className="pointer-events-none absolute bottom-1 left-4 z-30 text-xl sm:left-8 sm:text-2xl" aria-hidden="true">
        🪔
      </div>
    </section>
  );
}