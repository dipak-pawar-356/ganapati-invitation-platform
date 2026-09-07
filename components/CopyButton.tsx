"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={copy} className="text-xs px-2.5 py-1.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}