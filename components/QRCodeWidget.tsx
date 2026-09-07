"use client";

import { useState, useEffect } from "react";
import { QrCode, Download, Share2, Check } from "lucide-react";

interface QRCodeWidgetProps {
  mandalName: string;
  slug: string;
}

const DEFAULT_SITE_URL = "https://ganapati-invitation-platform.vercel.app";

export default function QRCodeWidget({ mandalName, slug }: QRCodeWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const fullUrl = `${siteUrl}/${slug}`;

  // External high-resolution QR API image for instant dynamic QR rendering
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}&color=200608&bgcolor=f3d089`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-[var(--t-primary)]/40 bg-gradient-to-b from-[var(--t-bg-card)]/95 to-[var(--t-bg-footer)]/95 p-6 text-center shadow-2xl backdrop-blur-xl max-w-sm mx-auto">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--t-primary-muted)] text-[var(--t-primary)] mb-3">
        <QrCode className="w-6 h-6" />
      </div>

      <h3 className="font-display text-lg font-bold text-[var(--t-primary-light)]">
        डिजिटल QR कोड (Scan & Share)
      </h3>
      <p className="text-xs text-[var(--t-text)]/75 mt-1">
        हा QR कोड स्कॅन करून थेट {mandalName} चे निमंत्रण पत्र उघडा.
      </p>

      {/* QR Display Frame */}
      <div className="mt-4 mx-auto w-48 h-48 p-3 rounded-2xl bg-gradient-to-br from-[var(--t-primary-light)] to-[var(--t-primary)] border-2 border-[var(--t-primary)] shadow-xl flex items-center justify-center">
        <img
          src={qrImageUrl}
          alt={`QR Code for ${mandalName}`}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <a
          href={qrImageUrl}
          download={`${slug}-qr-code.png`}
          target="_blank"
          rel="noopener noreferrer"
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-4 py-2 text-xs font-bold text-[var(--t-bg)] shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>QR कोड डाउनलोड करा</span>
        </a>

        <button
          type="button"
          onClick={handleCopyLink}
          suppressHydrationWarning
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--t-primary)]/40 bg-black/40 px-3.5 py-2 text-xs font-semibold text-[var(--t-primary-light)] hover:bg-[var(--t-primary-badge)] cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied!" : "लिंक कॉपी करा"}</span>
        </button>
      </div>
    </div>
  );
}
