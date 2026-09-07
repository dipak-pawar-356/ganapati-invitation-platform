"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText as FileTextIcon, Download as DownloadIcon, Printer as PrinterIcon, X as XIcon, Share2 as ShareIcon } from "lucide-react";

interface PdfInvitationCardProps {
  mandalName: string;
  message?: string;
  address?: string;
  contact?: string;
  slug?: string;
  pdfCardImageUrl?: string;
}

export default function PdfInvitationCard({
  mandalName,
  message = "गणेशोत्सवाच्या या पावन प्रसंगी आपणास कुटुंबियांसह श्रींच्या दर्शनासाठी व महाप्रसादासाठी सहर्ष निमंत्रित करत आहोत.",
  address = "मुख्य रस्ता, सार्वजनिक गणेशोत्सव मंडळ",
  contact = "8669233747",
  slug = "mandal",
  pdfCardImageUrl,
}: PdfInvitationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${mandalName} - गणेशोत्सव निमंत्रण पत्रिका`,
          text: `॥ श्री गणेशाय नमः ॥\n\n${mandalName} चे गणेशोत्सव निमंत्रण पत्र पाहा:\n`,
          url: window.location.href,
        });
      } catch (e) {
        console.log("Share aborted");
      }
    } else {
      if (typeof window !== "undefined") {
        navigator.clipboard.writeText(window.location.href);
        alert("निमंत्रण लिक कॉपी झाली आहे!");
      }
    }
  };

  return (
    <>
      {/* Trigger Card Widget */}
      <div className="rounded-2xl border border-[var(--t-border)] bg-black/40 p-5 text-center backdrop-blur-md max-w-md mx-auto my-6 shadow-xl">
        <div className="flex items-center justify-center gap-2 text-[var(--t-primary-light)] mb-2">
          <FileTextIcon className="w-5 h-5 text-[var(--t-primary)]" />
          <span className="font-bold text-sm tracking-wide">छापील PDF निमंत्रण पत्रिका (Printable PDF Card)</span>
        </div>
        <p className="text-xs text-[var(--t-text)]/75 mb-4">
          {mandalName} ची डिजिटल व छापील निमंत्रण पत्रिका पाहा, डाउनलोड करा किंवा प्रिंट करा.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--t-border-accent)] bg-[var(--t-primary-badge)] px-4 py-2.5 text-xs font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary-muted)] transition-all cursor-pointer"
          >
            <PrinterIcon className="w-4 h-4" />
            <span>पत्र उघडा / प्रिंट करा</span>
          </button>

          <button
            type="button"
            suppressHydrationWarning
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-4 py-2.5 text-xs font-bold text-[var(--t-bg)] shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShareIcon className="w-4 h-4" />
            <span>शेअर करा</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Printable PDF Card Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto print:p-0 print:bg-white">
          <div className="relative w-full max-w-xl rounded-3xl border-2 border-[var(--t-border-accent)] bg-[var(--t-bg)] p-6 sm:p-8 text-[var(--t-text)] shadow-2xl print:border-none print:shadow-none print:bg-white print:text-black">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--t-border)] print:hidden">
              <span className="text-xs font-bold text-[var(--t-primary-light)]">॥ निमंत्रण पत्रिका PDF Preview ॥</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-3.5 py-1.5 text-xs font-bold text-[var(--t-bg)] hover:scale-105 transition-all cursor-pointer"
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  <span>PDF प्रिंट / सेव करा</span>
                </button>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-white/20 p-1.5 text-white/70 hover:bg-white/10 cursor-pointer"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Invitation Document Content */}
            <div id="printable-card" className="space-y-4 text-center p-4 rounded-2xl border border-[var(--t-border)] bg-[var(--t-bg-card)] print:bg-white print:border-black print:text-black">
              {/* Header Shloka */}
              <div className="text-xs font-bold text-[var(--t-primary)] print:text-amber-800 uppercase tracking-widest">
                ॥ श्री गणेशाय नमः ॥
              </div>

              {/* Ganapati Murti Focal Point */}
              <div className="relative flex justify-center my-3">
                <div className="absolute inset-0 m-auto h-28 w-28 rounded-full bg-amber-400/20 blur-xl print:hidden" />
                <Image
                  src={pdfCardImageUrl || "/images/ganapati/ganapati-murti.png"}
                  alt="Ganapati Murti"
                  width={140}
                  height={140}
                  unoptimized
                  style={{ width: "auto" }}
                  className="relative z-10 h-32 w-auto object-contain filter drop-shadow-[0_8px_16px_rgba(232,169,59,0.5)]"
                />
              </div>

              {/* Mandal Name */}
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--t-primary-light)] print:text-amber-900">
                {mandalName}
              </h2>

              <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-[var(--t-primary)] to-transparent print:bg-amber-700" />

              {/* Invitation Message */}
              <p className="text-sm leading-relaxed text-[var(--t-text)]/90 print:text-gray-900 px-2 sm:px-6">
                {message}
              </p>

              {/* Event Highlights & Timings */}
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[var(--t-border)] text-xs print:border-gray-400">
                <div className="p-2 rounded-xl bg-black/30 print:bg-gray-100">
                  <div className="font-bold text-[var(--t-primary-light)] print:text-amber-900">🌅 सकाळची आरती</div>
                  <div className="text-[var(--t-text)]/80 print:text-gray-800 font-semibold">सकाळी ८:०० वाजता</div>
                </div>
                <div className="p-2 rounded-xl bg-black/30 print:bg-gray-100">
                  <div className="font-bold text-[var(--t-primary-light)] print:text-amber-900">🌙 सायंकाळची आरती</div>
                  <div className="text-[var(--t-text)]/80 print:text-gray-800 font-semibold">रात्री ८:०० वाजता</div>
                </div>
              </div>

              {/* Venue & Address */}
              <div className="text-xs space-y-1 text-[var(--t-text)]/80 print:text-gray-900">
                <div className="font-bold text-[var(--t-primary-light)] print:text-amber-900">📍 स्थान / पत्ता</div>
                <p className="font-medium">{address}</p>
                <p className="font-semibold text-[var(--t-primary)] print:text-amber-800">संपर्क: {contact}</p>
              </div>

              {/* Printable Footer Attribution */}
              <div className="pt-3 border-t border-[var(--t-border)] text-[10px] text-[var(--t-text)]/60 print:text-gray-600 flex items-center justify-between">
                <span>विनीत: {mandalName} कार्यकर्ते</span>
                <span>Powered by Adviks SoftTech</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
