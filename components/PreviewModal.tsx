"use client";

import { useState } from "react";
import InvitationPreview, {
  InvitationData,
} from "@/components/InvitationPreview";
import { Monitor, Tablet, Smartphone } from "lucide-react";

export default function PreviewModal({
  data,
  onBack,
  onConfirm,
  confirmLabel = "✓ पुष्टी करा, मंजुरीसाठी पाठवा",
  confirming = false,
}: {
  data: InvitationData;
  onBack: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirming?: boolean;
}) {
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const getContainerWidth = () => {
    switch (deviceView) {
      case "mobile":
        return "max-w-[390px]";
      case "tablet":
        return "max-w-[768px]";
      case "desktop":
      default:
        return "max-w-5xl";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--t-bg)] text-white overflow-y-auto">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-32 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 -right-32 h-80 w-80 rounded-full bg-red-500/5 blur-3xl" />
      </div>

      {/* Top action bar */}
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div className="mx-auto max-w-6xl px-3 pt-3 sm:px-5">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[var(--t-bg-card)]/90 px-3 py-3 shadow-2xl backdrop-blur-xl sm:px-4">
            {/* Back / Edit button */}
            <button
              type="button"
              onClick={onBack}
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs sm:text-sm font-bold text-amber-50 transition-all hover:border-amber-400/30 hover:bg-amber-400/10 active:scale-95 cursor-pointer"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/5 text-sm group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
              <span>संपादित करा</span>
            </button>

            {/* Device View Switcher Toggle */}
            <div className="flex items-center rounded-xl border border-[var(--t-border)] bg-black/60 p-1">
              <button
                type="button"
                onClick={() => setDeviceView("desktop")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  deviceView === "desktop"
                    ? "bg-[var(--t-primary)] text-[var(--t-bg)] shadow-md"
                    : "text-[var(--t-text-soft)] hover:text-white"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView("tablet")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  deviceView === "tablet"
                    ? "bg-[var(--t-primary)] text-[var(--t-bg)] shadow-md"
                    : "text-[var(--t-text-soft)] hover:text-white"
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                type="button"
                onClick={() => setDeviceView("mobile")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  deviceView === "mobile"
                    ? "bg-[var(--t-primary)] text-[var(--t-bg)] shadow-md"
                    : "text-[var(--t-text-soft)] hover:text-white"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Confirm Submit button */}
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirming}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-950/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {confirming ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>पाठवत आहे...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>{confirmLabel}</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Preview area */}
      <main className="relative z-10 min-h-screen px-3 pb-12 pt-24 sm:px-6 sm:pt-28">
        <div className="mb-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-400/80">
            Submission Live Preview Mode
          </p>
          <h2 className="mt-0.5 text-sm sm:text-base font-bold text-amber-50">
            आमंत्रण पूर्वावलोकन (Preview)
          </h2>
        </div>

        {/* Dynamic device view container */}
        <div className={`mx-auto w-full transition-all duration-300 ${getContainerWidth()}`}>
          <div className="relative overflow-hidden rounded-2xl border border-amber-300/20 bg-[var(--t-bg-card)]/60 p-1 sm:p-2 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl">
              <InvitationPreview data={data} />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-white/50">
            <span className="h-px w-8 bg-white/10" />
            <span>वरील निमंत्रण तपासा. मंजुरीनंतर ही वेबसाइट लाइव्ह होईल.</span>
            <span className="h-px w-8 bg-white/10" />
          </div>
        </div>
      </main>
    </div>
  );
}