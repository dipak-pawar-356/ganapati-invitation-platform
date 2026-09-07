"use client";

import { FileText, Download, ExternalLink } from "lucide-react";

interface PdfInvitationButtonProps {
  mandalName: string;
  pdfUrl?: string;
}

export default function PdfInvitationButton({ mandalName, pdfUrl }: PdfInvitationButtonProps) {
  const targetPdf = pdfUrl || "/images/invitation/sample-invitation-card.png";

  return (
    <div className="rounded-2xl border border-[var(--t-border)] bg-black/40 p-4 text-center backdrop-blur-md max-w-sm mx-auto my-4">
      <div className="flex items-center justify-center gap-2 text-[var(--t-primary-light)] mb-1.5">
        <FileText className="w-5 h-5" />
        <span className="font-bold text-sm">डिजिटल निमंत्रण पत्रिका (PDF/Image)</span>
      </div>
      <p className="text-[11px] text-[var(--t-text-soft)] mb-3">
        {mandalName} चे छापील निमंत्रण पत्र पाहा किंवा मोबाइलवर डाउनलोड करा.
      </p>

      <div className="flex items-center justify-center gap-2">
        <a
          href={targetPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--t-border-accent)] bg-[var(--t-primary-badge)] px-3.5 py-2 text-xs font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary-muted)] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>पत्र पाहा</span>
        </a>

        <a
          href={targetPdf}
          download={`${mandalName}-invitation.pdf`}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-4 py-2 text-xs font-bold text-[var(--t-bg)] shadow-md hover:scale-105 active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>डाउनलोड करा</span>
        </a>
      </div>
    </div>
  );
}
