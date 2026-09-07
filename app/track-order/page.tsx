"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, PhoneCall, KeyRound, CheckCircle2, Clock, ShieldAlert, ArrowRight } from "lucide-react";
import { FestiveAudioAndBlessing } from "@/components/FestiveAudioAndBlessing";

const contactPhone = "8669233747";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{
    found: boolean;
    appNumber?: string;
    mandalName?: string;
    status?: string;
    submittedAt?: string;
    theme?: string;
    contact?: string;
  } | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearched(true);
    // Dynamic lookup mock response for tracking applications
    const cleaned = query.trim().toLowerCase();
    if (cleaned.includes("9820") || cleaned.includes("mandal") || cleaned.includes("app") || cleaned.length > 3) {
      setResult({
        found: true,
        appNumber: `GANAPATI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        mandalName: "श्री जय शंकर गणेश मंडळ",
        status: "Pending Verification / Under Review",
        submittedAt: new Date().toLocaleDateString("mr-IN"),
        theme: "Royal Temple Gold",
        contact: contactPhone,
      });
    } else {
      setResult({ found: false });
    }
  };

  return (
    <main className="relative min-h-screen bg-[#1c0609] text-[var(--t-text)] selection:bg-[var(--t-selection-bg)] selection:text-[var(--t-selection-text)] overflow-x-hidden">
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

      {/* Main Track Order Box */}
      <section className="relative z-10 mx-auto max-w-3xl px-4 pt-16 pb-24 text-center sm:px-6">
        <div className="rounded-3xl border border-[var(--t-border)] bg-black/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <span className="text-3xl">🔍</span>
          <h1 className="mt-2 font-display text-2xl sm:text-4xl font-extrabold text-[var(--t-primary-light)]">
            तुमच्या अर्जाची स्थिती तपासा (Track Order)
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[var(--t-text-soft)]">
            तुमचा मोबाईल नंबर किंवा Application ID टाकून वेबसाइट मंजुरीची सद्यस्थिती तपासा.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Application ID / मोबाईल नंबर (उदा. 8669233747)"
              suppressHydrationWarning
              required
              className="w-full rounded-2xl border border-[var(--t-border)] bg-black/50 px-4 py-3.5 text-sm text-[var(--t-text)] placeholder:text-[var(--t-text-muted)] outline-none focus:border-[var(--t-primary)]"
            />
            <button
              type="submit"
              suppressHydrationWarning
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-7 py-3.5 text-sm font-bold text-[var(--t-bg)] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              <span>शोध घ्या</span>
            </button>
          </form>

          {/* Result View */}
          {searched && result && (
            <div className="mt-8 pt-6 border-t border-white/10 text-left">
              {result.found ? (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-5 backdrop-blur-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--t-primary)]">Application Found</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold text-[var(--t-primary-light)] border border-amber-500/30">
                      <Clock className="w-3 h-3" />
                      <span>{result.status}</span>
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{result.mandalName}</h3>
                    <p className="text-xs text-[var(--t-text-muted)]">Application ID: {result.appNumber}</p>
                  </div>
                  <div className="text-xs space-y-1 text-[var(--t-text-soft)] pt-2 border-t border-white/10">
                    <p><strong>निवडलेली थिम:</strong> {result.theme}</p>
                    <p><strong>अर्ज तारीख:</strong> {result.submittedAt}</p>
                    <p><strong>संपर्क फोन:</strong> {result.contact}</p>
                  </div>
                  <div className="pt-2 text-[11px] text-amber-200/70 italic">
                    * Super Admin द्वारे मंजुरी मिळाल्यानंतर तुम्हाला SMS व WhatsApp द्वारे लॉगिन पासवर्ड प्राप्त होईल.
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-center space-y-2">
                  <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
                  <h3 className="font-bold text-red-200 text-sm">माहिती मिळाली नाही</h3>
                  <p className="text-xs text-[var(--t-text-muted)]">
                    कृपया टाकलेला मोबाईल नंबर किंवा Application ID तपासून पुन्हा प्रयत्न करा किंवा थेट {contactPhone} वर संपर्क करा.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-4 flex justify-between items-center text-xs">
            <Link href="/submit" className="text-[var(--t-primary-light)] hover:underline font-semibold flex items-center gap-1">
              <span>नवीन अर्ज करा →</span>
            </Link>
            <Link href="/demo" className="text-[var(--t-primary-light)] hover:underline font-semibold flex items-center gap-1">
              <span>Demo Websites पहा →</span>
            </Link>
          </div>
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
