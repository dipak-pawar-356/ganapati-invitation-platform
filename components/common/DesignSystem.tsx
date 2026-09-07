"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, X, Phone, Copy, QrCode, Heart, Smartphone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

/* 1. Section Title */
export function SectionTitle({
  title,
  subtitle,
  accent = "॥ श्री गणेशाय नमः ॥",
  light = false,
  theme = "gold",
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  light?: boolean;
  theme?: "gold" | "peshwai" | "saffron" | "night";
}) {
  const titleColors = {
    gold: light ? "text-amber-950" : "text-[var(--t-primary-light)]",
    peshwai: light ? "text-amber-950" : "text-[#fcd34d]",
    saffron: light ? "text-zinc-900" : "text-[#fdba74]",
    night: light ? "text-slate-900" : "text-[#7dd3fc]",
  };

  const accentColors = {
    gold: "text-[var(--t-primary)]",
    peshwai: "text-[#d96a2b]",
    saffron: "text-[#ea580c]",
    night: "text-[#38bdf8]",
  };

  return (
    <div className="text-center my-8 px-4 relative z-10">
      {accent && (
        <span className={`text-xs font-bold uppercase tracking-[0.25em] ${accentColors[theme]} block mb-1.5`}>
          {accent}
        </span>
      )}
      <h2
        className={`font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md ${titleColors[theme]}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2.5 text-xs sm:text-sm max-w-xl mx-auto font-medium leading-relaxed ${
            light ? "text-gray-700" : "text-amber-100/80"
          }`}
        >
          {subtitle}
        </p>
      )}
      <DecorativeDivider theme={theme} />
    </div>
  );
}

/* 2. Decorative Divider */
export function DecorativeDivider({
  className = "",
  theme = "gold",
}: {
  className?: string;
  theme?: "gold" | "peshwai" | "saffron" | "night";
}) {
  const lineGradients = {
    gold: "from-transparent to-[#e8a93b]",
    peshwai: "from-transparent to-[#d96a2b]",
    saffron: "from-transparent to-[#ea580c]",
    night: "from-transparent to-[#38bdf8]",
  };

  const lineGradientsReverse = {
    gold: "from-[#e8a93b] to-transparent",
    peshwai: "from-[#d96a2b] to-transparent",
    saffron: "from-[#ea580c] to-transparent",
    night: "from-[#38bdf8] to-transparent",
  };

  const centerBorders = {
    gold: "border-[var(--t-primary)] bg-[#2a080c]",
    peshwai: "border-[#d96a2b] bg-[#3a080a]",
    saffron: "border-[#ea580c] bg-[#180a03]",
    night: "border-[#38bdf8] bg-[#050b14]",
  };

  return (
    <div className={`flex items-center justify-center gap-2.5 my-4 ${className}`}>
      <div className={`h-0.5 w-12 sm:w-16 bg-gradient-to-r ${lineGradients[theme]}`} />
      <div className={`w-2.5 h-2.5 rotate-45 border-2 ${centerBorders[theme]} shadow-sm`} />
      <div className={`h-0.5 w-12 sm:w-16 bg-gradient-to-r ${lineGradientsReverse[theme]}`} />
    </div>
  );
}

/* 3. Premium Button */
export function PremiumButton({
  children,
  onClick,
  href,
  variant = "gold",
  className = "",
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  variant?: "gold" | "peshwai" | "saffron" | "night" | "outline" | "glass" | "danger";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none";

  const variants = {
    gold: "bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[#200608] hover:scale-105 shadow-[#e8a93b]/25 border border-[#f3d089]/40",
    peshwai: "bg-gradient-to-r from-[#d96a2b] to-[#7a2e12] text-[#fff8ea] hover:scale-105 shadow-[#d96a2b]/25 border border-[#fcd34d]/30",
    saffron: "bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white hover:scale-105 shadow-orange-500/25 border border-orange-300/30",
    night: "bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#38bdf8] text-white hover:scale-105 shadow-sky-500/25 border border-sky-300/30",
    outline: "border border-[var(--t-border-accent)] bg-[var(--t-primary-badge)] text-[var(--t-primary-light)] hover:bg-[var(--t-primary)]/25",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 text-[var(--t-text)] hover:bg-white/20",
    danger: "bg-red-600/90 text-white border border-red-500 hover:bg-red-700 shadow-red-600/20",
  };

  const combined = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combined} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} suppressHydrationWarning className={combined}>
      {children}
    </button>
  );
}

/* 4. Glass Card */
export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-[var(--t-primary)]/25 bg-black/40 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-[var(--t-primary)]/45 ${className}`}
    >
      {children}
    </div>
  );
}

/* 5. Traditional Card */
export function TraditionalCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl border-2 border-[var(--t-border)] bg-[var(--t-bg-card)]/90 p-6 text-[var(--t-text)] shadow-2xl backdrop-blur-md ${className}`}
    >
      {/* Corner Ornaments */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[var(--t-primary)]" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[var(--t-primary)]" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[var(--t-primary)]" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[var(--t-primary)]" />
      {children}
    </div>
  );
}

/* 6. Timeline Card */
export function TimelineCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[var(--t-border)] bg-[var(--t-bg-card)]/90 p-5 text-left text-[var(--t-text)] shadow-xl backdrop-blur-md transition-all duration-300 hover:border-[var(--t-primary)] hover:shadow-2xl sm:rounded-3xl sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/* 7. Gallery Card */
export function GalleryCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border border-[var(--t-border)] bg-black/40 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-[var(--t-primary)] cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

/* 8. Committee Card */
export function CommitteeCard({
  name,
  position,
  photoUrl,
  phone,
  instagramUrl,
  className = "",
}: {
  name: string;
  position: string;
  photoUrl?: string | null;
  phone?: string | null;
  instagramUrl?: string | null;
  className?: string;
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-[var(--t-border)] bg-[var(--t-bg-card)]/90 p-5 text-center backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-[var(--t-primary)] shadow-xl hover:shadow-[var(--t-primary-glow)] ${className}`}
    >
      {/* Photo */}
      <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-3 border-[var(--t-primary)] shadow-lg group-hover:border-[var(--t-primary-light)]">
        <Image
          src={photoUrl || "/images/family/person-1.webp"}
          alt={name}
          fill
          unoptimized
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Name & Position */}
      <h3 className="font-display text-lg font-bold text-[var(--t-text)] group-hover:text-[var(--t-primary-light)] transition-colors">
        {name}
      </h3>
      <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-[var(--t-primary)]/90">
        {position}
      </p>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--t-border)] bg-[var(--t-primary-badge)] px-3 py-1 text-xs font-bold text-[var(--t-primary-light)] transition-all hover:bg-[var(--t-primary)] hover:text-[var(--t-bg)]"
          >
            <Phone className="w-3 h-3" />
            <span>{phone}</span>
          </a>
        )}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500 hover:text-white transition-all"
            aria-label="Instagram Profile"
          >
            <FaInstagram className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

/* 9. QR Card */
export function QRCard({
  mandalName,
  upiId = "8669233747@upi",
  accountHolder = "गणपती उत्सव मंडळ ट्रस्ट",
  contactPhone = "8669233747",
}: {
  mandalName: string;
  upiId?: string;
  accountHolder?: string;
  contactPhone?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-[var(--t-border)] bg-black/60 p-6 backdrop-blur-xl shadow-2xl text-left">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display text-lg font-bold text-[var(--t-primary-light)]">UPI & QR देणगी कार्ड</h3>
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-0.5 text-[10px] font-bold text-emerald-300">
          सुरक्षित UPI
        </span>
      </div>

      <div className="space-y-2 text-xs text-[var(--t-text-soft)]">
        <p><strong>मंडळ:</strong> {mandalName}</p>
        <p><strong>खातेदार:</strong> {accountHolder}</p>
        <p><strong>UPI ID:</strong> <span className="font-mono text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-500/30">{upiId}</span></p>
        <p><strong>संपर्क:</strong> {contactPhone}</p>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-xl border border-[var(--t-border)] bg-[var(--t-primary-badge)] px-4 py-2.5 text-xs font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary)] hover:text-[var(--t-bg)] transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "UPI ID कॉपी झाला!" : "Copy UPI ID"}</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] text-amber-200/60 font-semibold">
          <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
        </div>
      </div>
    </div>
  );
}

/* 10. Hero Badge */
export function HeroBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--t-border)] bg-[var(--t-bg-card)]/90 px-4 py-1.5 text-xs font-bold text-[var(--t-primary-light)] shadow-lg backdrop-blur-md mb-4">
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      <span>{text}</span>
    </div>
  );
}

/* 11. Decorative Border */
export function DecorativeBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative p-1 rounded-3xl bg-gradient-to-r from-[var(--t-primary)]/40 via-[var(--t-primary-light)]/20 to-[var(--t-secondary)]/40 ${className}`}>
      <div className="rounded-[22px] bg-[var(--t-bg)] p-5">{children}</div>
    </div>
  );
}

/* 12. Floating Decoration */
export function FloatingDecoration({
  src,
  alt = "",
  className = "",
  size = 60,
}: {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-20 ${className}`}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image src={src} alt={alt} width={size} height={size} unoptimized className="h-auto w-auto object-contain drop-shadow-md" />
    </motion.div>
  );
}

/* 13. Theme Background Wrapper */
export function ThemeBackgroundWrapper({
  children,
  theme = "gold",
  className = "",
}: {
  children: React.ReactNode;
  theme?: "gold" | "peshwai" | "saffron" | "night";
  className?: string;
}) {
  const themeStyles = {
    gold: "bg-[#1c0609] text-[var(--t-text)] selection:bg-[var(--t-primary)] selection:text-black",
    peshwai: "bg-[#2c0507] text-[#fff8ea] selection:bg-[#d96a2b] selection:text-white",
    saffron: "bg-[#180a03] text-[#fffcf5] selection:bg-[#ea580c] selection:text-white",
    night: "bg-[#050b14] text-[#e0f2fe] selection:bg-[#38bdf8] selection:text-black",
  };

  return <div className={`relative min-h-screen ${themeStyles[theme]} ${className}`}>{children}</div>;
}

/* 14. Animated Section Wrapper */
export function AnimatedSectionWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* 15. Premium Modal */
export function PremiumModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--t-border)] bg-[var(--t-bg-card)] p-6 shadow-2xl text-[var(--t-text)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="font-display text-xl font-bold text-[var(--t-primary-light)]">{title || "माहिती"}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-[var(--t-primary-light)] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* 16. Premium Form Inputs */
export function PremiumInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && <label className="block text-xs font-bold text-[var(--t-primary-light)]">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        suppressHydrationWarning
        className="w-full rounded-2xl border border-[var(--t-card-border)] bg-black/50 px-4 py-3 text-xs sm:text-sm text-[var(--t-text)] placeholder:text-[var(--t-text)]/40 outline-none focus:border-[var(--t-primary)] focus:ring-2 focus:ring-[var(--t-primary)]/30 transition-all"
      />
    </div>
  );
}

export function PremiumSelect({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label?: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && <label className="block text-xs font-bold text-[var(--t-primary-light)]">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        suppressHydrationWarning
        className="w-full rounded-2xl border border-[var(--t-card-border)] bg-black/50 px-4 py-3 text-xs sm:text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#1f0609] text-[var(--t-text)]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PremiumTextarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className = "",
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 text-left ${className}`}>
      {label && <label className="block text-xs font-bold text-[var(--t-primary-light)]">{label}</label>}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        suppressHydrationWarning
        className="w-full rounded-2xl border border-[var(--t-card-border)] bg-black/50 px-4 py-3 text-xs sm:text-sm text-[var(--t-text)] placeholder:text-[var(--t-text)]/40 outline-none focus:border-[var(--t-primary)] focus:ring-2 focus:ring-[var(--t-primary)]/30 transition-all resize-y"
      />
    </div>
  );
}

/* 17. Traditional Badge */
export function TraditionalBadge({
  text,
  icon,
}: {
  text: string;
  icon?: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--t-border)] bg-[var(--t-primary-badge)] px-3 py-1 text-xs font-bold text-[var(--t-primary-light)] shadow-sm">
      {icon || <Sparkles className="w-3.5 h-3.5 text-[var(--t-primary)]" />}
      <span>{text}</span>
    </span>
  );
}

/* 18. Specialized Unique Section Headers */
export function TimelineSectionHeader({ title = "उत्सवाचा मंगल प्रवास", subtitle = "गणरायाच्या आगमनापासून विसर्जनापर्यंतचा संपूर्ण कार्यक्रम" }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center my-10 px-4 relative z-10">
      <div className="inline-flex items-center gap-2 mb-2">
        <Image src="/images/decorations/om.png" alt="OM" width={28} height={28} unoptimized className="w-7 h-7 object-contain" />
        <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--t-primary)]">
          ॥ श्री गणेशाय नमः ॥
        </span>
        <Image src="/images/decorations/om.png" alt="OM" width={28} height={28} unoptimized className="w-7 h-7 object-contain" />
      </div>
      <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[var(--t-primary-light)] drop-shadow-md">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-lg mx-auto">{subtitle}</p>}
      <div className="mx-auto mt-4 flex items-center justify-center gap-3 w-full max-w-xs">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--t-divider)]/60 to-transparent" />
      </div>
    </div>
  );
}

export function GallerySectionHeader({ title = "उत्सव छायाचित्र गॅलरी", subtitle = "बाप्पांच्या नयनमनोहारी रूपाचे मंगल दर्शन" }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center my-10 px-4 relative z-10">
      <div className="mx-auto mb-3 w-full max-w-xs">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--t-divider)]/60 to-transparent" />
      </div>
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--t-primary-light)] block mb-1">
        ॥ छायाचित्र दालन ॥
      </span>
      <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[var(--t-primary-light)] drop-shadow-md">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-lg mx-auto">{subtitle}</p>}
    </div>
  );
}

export function CommitteeSectionHeader({ title = "उत्सव समितीचे शिलेदार", subtitle = "गणेशोत्सवाच्या यशस्वी आयोजनासाठी कार्यरत कार्यकर्ते" }: { title?: string; subtitle?: string }) {
  return (
    <div className="text-center my-10 px-4 relative z-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-[var(--t-border)] bg-black/50 px-4 py-1.5 text-xs font-bold text-[var(--t-primary-light)] backdrop-blur-md mb-3 shadow-lg">
        <Sparkles className="w-4 h-4 text-[var(--t-primary)]" />
        <span>कार्यकारिणी व उत्सव समिती</span>
      </div>
      <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[var(--t-primary-light)]">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-xs sm:text-sm text-amber-100/80 max-w-lg mx-auto">{subtitle}</p>}
      <DecorativeDivider theme="gold" />
    </div>
  );
}

