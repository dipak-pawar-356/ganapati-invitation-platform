"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { X, ChevronLeft, ChevronRight, Maximize2, LayoutGrid, Layers, Filter } from "lucide-react";

export type GalleryPhoto = {
  url: string;
  caption?: string;
  category?: string;
};

type GalleryProps = {
  photos: GalleryPhoto[];
};

const CATEGORIES = ["सर्व", "अभिषेक व मूर्ती", "उत्सव व आरती", "देखावा व सजावट"];

const FRAME = {
  mobile: {
    top: "24%",
    bottom: "8%",
    left: "10%",
    right: "10%",
  },
  desktop: {
    top: "20%",
    bottom: "6%",
    left: "8%",
    right: "8%",
  },
};

/* ============================================================
   LIGHTBOX MODAL WITH SWIPE & KEYBOARD SUPPORT
============================================================ */
function LightboxModal({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const currentPhoto = photos[currentIndex];

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrev(),
    trackMouse: true,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!currentPhoto) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 select-none">
        {/* Backdrop Click Close */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 rounded-full bg-white/15 p-2.5 text-white hover:bg-white/30 transition-all cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Counter Pill */}
        <div className="absolute top-4 left-4 z-30 rounded-full border border-[var(--t-border)] bg-black/60 px-4 py-1.5 text-xs font-bold text-[var(--t-primary-light)] backdrop-blur-md">
          {currentIndex + 1} / {photos.length}
        </div>

        {/* Previous Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 z-30 rounded-full bg-white/10 p-3 text-white hover:bg-[var(--t-primary)] hover:text-[var(--t-selection-text)] transition-all cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Next Button */}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 z-30 rounded-full bg-white/10 p-3 text-white hover:bg-[var(--t-primary)] hover:text-[var(--t-selection-text)] transition-all cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}

        {/* Main Image Container */}
        <div
          {...swipeHandlers}
          className="relative z-20 max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--t-border)] shadow-2xl"
          >
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.caption || "Ganapati Photo"}
              width={1200}
              height={900}
              unoptimized
              className="max-h-[75vh] w-auto h-auto object-contain rounded-2xl"
              priority
            />
          </motion.div>

          {currentPhoto.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-sm sm:text-base font-semibold text-[var(--t-primary-light)] bg-black/60 px-6 py-2 rounded-full border border-[var(--t-border)] backdrop-blur-md"
            >
              {currentPhoto.caption}
            </motion.p>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}

/* ============================================================
   MARQUEE STRIP
============================================================ */
function MarqueeStrip({
  photos,
  onSelect,
}: {
  photos: GalleryPhoto[];
  onSelect: (i: number) => void;
}) {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="flex w-full justify-center pb-1">
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => onSelect(0)}
          className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border-2 border-[var(--t-primary)] sm:h-11 sm:w-11 cursor-pointer"
        >
          <Image src={photos[0].url} alt="" fill unoptimized sizes="44px" className="object-cover" />
        </button>
      </div>
    );
  }

  const duplicatedPhotos = [...photos, ...photos];

  return (
    <div className="relative w-full max-w-full overflow-hidden pb-1">
      <motion.div
        className="flex w-max gap-1.5"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            duration: Math.max(photos.length * 3, 18),
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {duplicatedPhotos.map((photo, index) => (
          <button
            key={`${photo.url}-${index}`}
            type="button"
            suppressHydrationWarning
            onClick={() => onSelect(index % photos.length)}
            className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border-2 border-[var(--t-border)] transition-all duration-300 hover:border-[var(--t-primary)] active:scale-95 sm:h-11 sm:w-11 cursor-pointer"
          >
            <Image src={photo.url} alt="" fill unoptimized sizes="44px" className="object-cover" />
          </button>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================
   SHOWCASE VIEWS
============================================================ */
function MobileShowcase({ photos, onOpenLightbox }: { photos: GalleryPhoto[]; onOpenLightbox: (i: number) => void }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % photos.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [photos.length]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-1">
      <div
        onClick={() => onOpenLightbox(active)}
        className="relative min-h-0 w-full max-w-[420px] flex-1 overflow-hidden rounded-xl cursor-pointer group"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={photos[active].url}
              alt={photos[active].caption ?? ""}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 420px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>

        {photos.length > 1 && (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-[var(--t-text)] backdrop-blur-sm">
            {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
          </div>
        )}

        {photos[active].caption && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 text-left">
            <p className="text-xs font-semibold text-[var(--t-text)]">{photos[active].caption}</p>
          </div>
        )}
      </div>

      <MarqueeStrip photos={photos} onSelect={setActive} />
    </div>
  );
}

function DesktopShowcase({ photos, onOpenLightbox }: { photos: GalleryPhoto[]; onOpenLightbox: (i: number) => void }) {
  const cells = 9;
  const [offset, setOffset] = useState(0);
  const isDense = photos.length >= 5;

  useEffect(() => {
    if (!isDense || photos.length <= cells) return;
    const id = window.setInterval(() => {
      setOffset((current) => (current + 1) % photos.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, [photos.length, isDense]);

  if (photos.length === 1) {
    return (
      <div className="flex h-full w-full flex-col gap-3 px-2 py-1">
        <motion.div
          onClick={() => onOpenLightbox(0)}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl cursor-pointer group"
        >
          <Image src={photos[0].url} alt="" fill unoptimized sizes="60vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isDense) {
    const cols = photos.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3";
    return (
      <div className="flex h-full w-full flex-col gap-3 px-2 py-1">
        <div className={`grid min-h-0 flex-1 ${cols} gap-2`}>
          {photos.map((photo, index) => (
            <motion.div
              key={`${photo.url}-${index}`}
              onClick={() => onOpenLightbox(index)}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
            >
              <Image src={photo.url} alt="" fill unoptimized sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  const shown = Array.from({ length: Math.min(cells, photos.length) }).map((_, index) => photos[(offset + index) % photos.length]);

  return (
    <div className="flex h-full w-full flex-col gap-3 px-2 py-1">
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-2">
        <AnimatePresence mode="popLayout">
          {shown.map((photo, index) => {
            const actualIndex = (offset + index) % photos.length;
            return (
              <motion.div
                key={`${photo.url}-${offset}-${index}`}
                onClick={() => onOpenLightbox(actualIndex)}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7 }}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
              >
                <Image src={photo.url} alt="" fill unoptimized sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <MarqueeStrip photos={photos} onSelect={setOffset} />
    </div>
  );
}

/* ============================================================
   RESPONSIVE PINTEREST MASONRY / GRID LAYOUT
============================================================ */
function MasonryGrid({ photos, onOpenLightbox }: { photos: GalleryPhoto[]; onOpenLightbox: (i: number) => void }) {
  // Varied aspect ratio presets for Pinterest Masonry feel
  const aspectRatios = ["aspect-square", "aspect-[4/3]", "aspect-[3/4]", "aspect-[16/10]"];

  return (
    <div className="columns-2 sm:columns-2 md:columns-3 gap-4 max-w-6xl mx-auto px-4 py-6 space-y-4">
      {photos.map((photo, index) => {
        const aspectClass = aspectRatios[index % aspectRatios.length];
        return (
          <motion.div
            key={`${photo.url}-${index}`}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.08 }}
            onClick={() => onOpenLightbox(index)}
            className={`group glass-reflection relative break-inside-avoid overflow-hidden rounded-2xl border border-[var(--t-border)] bg-black/60 shadow-xl hover:shadow-[0_12px_35px_var(--t-primary-glow)] hover:border-[var(--t-primary)] hover:-translate-y-1.5 transition-all duration-500 cursor-pointer ${aspectClass}`}
          >
            <Image
              src={photo.url}
              alt={photo.caption || "Ganapati Photo"}
              width={600}
              height={600}
              unoptimized
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-3 flex flex-col justify-end">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-[var(--t-text)] line-clamp-2 drop-shadow-md">
                  {photo.caption || `बाप्पा दर्शन #${index + 1}`}
                </p>
                <span className="shrink-0 rounded-full bg-[var(--t-primary-muted)] p-1.5 text-[var(--t-primary)] border border-[var(--t-border-accent)] group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ============================================================
   MAIN GALLERY COMPONENT
============================================================ */
export default function Gallery({ photos }: GalleryProps) {
  const [viewMode, setViewMode] = useState<"frame" | "masonry">("frame");
  const [selectedCategory, setSelectedCategory] = useState("सर्व");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const filteredPhotos = photos.filter((p) => {
    if (selectedCategory === "सर्व") return true;
    return p.category === selectedCategory;
  });

  const activeList = filteredPhotos.length > 0 ? filteredPhotos : photos;

  return (
    <section className="relative w-full overflow-hidden py-10">
      {/* Header & Controls */}
      <div className="mx-auto max-w-6xl px-4 text-center mb-8 relative z-20">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--t-primary)] block mb-1">
          ॥ श्री दर्शन दालन ॥
        </span>
        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-[var(--t-primary-light)]">
          उत्सव छायाचित्र गॅलरी
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[var(--t-text-soft)] font-medium">
          बाप्पांच्या उत्सवाच्या नयनमनोहारी क्षणांची झलक
        </p>

        {/* View Toggle */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setViewMode("frame")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === "frame"
                ? "bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] shadow-md"
                : "border border-[var(--t-border)] bg-black/40 text-amber-200 hover:bg-white/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>मंदिर फ्रेम</span>
          </button>
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setViewMode("masonry")}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              viewMode === "masonry"
                ? "bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] shadow-md"
                : "border border-[var(--t-border)] bg-black/40 text-amber-200 hover:bg-white/10"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>२-कॉलम ग्रीड</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "frame" ? (
        <>
          {/* MOBILE View */}
          <div className="relative w-full md:hidden" style={{ aspectRatio: "1023 / 1537" }}>
            <Image src="/images/backgrounds/gallery-mobile-bg.png" alt="" fill sizes="100vw" priority className="-z-10 object-cover" />
            <div className="absolute" style={FRAME.mobile}>
              <MobileShowcase photos={activeList} onOpenLightbox={(i) => setLightboxIndex(i)} />
            </div>
          </div>

          {/* DESKTOP View (Constrained max width & tight temple frame bounds) */}
          <div className="mx-auto max-w-6xl px-4">
            <div className="relative hidden w-full md:block overflow-hidden rounded-3xl border border-[var(--t-border)] shadow-2xl" style={{ aspectRatio: "1536 / 1024", maxHeight: "650px" }}>
              <Image src="/images/backgrounds/gallery-desktop-bg.png" alt="" fill sizes="(max-width: 1200px) 100vw, 1200px" priority className="-z-10 object-cover" />
              <div className="absolute" style={FRAME.desktop}>
                <DesktopShowcase photos={activeList} onOpenLightbox={(i) => setLightboxIndex(i)} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <MasonryGrid photos={activeList} onOpenLightbox={(i) => setLightboxIndex(i)} />
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          photos={activeList}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((prev) => (prev === null ? 0 : (prev - 1 + activeList.length) % activeList.length))}
          onNext={() => setLightboxIndex((prev) => (prev === null ? 0 : (prev + 1) % activeList.length))}
        />
      )}
    </section>
  );
}