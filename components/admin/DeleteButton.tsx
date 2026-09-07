"use client";

import { useState, useTransition } from "react";
import { deleteMandal } from "@/lib/admin-actions";

// Click once to arm, click again within 3s to actually delete.
// Safer than window.confirm() on mobile, and doesn't block the UI thread.
export default function DeleteButton({ id, label = "Delete" }: { id: string; label?: string }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteMandal(id);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title={confirming ? "Click again to confirm delete" : "Delete permanently"}
      style={{
        background: confirming ? "#b91c1c" : "rgba(185,28,28,0.12)",
        color: confirming ? "#fff" : "#b91c1c",
        border: "1px solid rgba(185,28,28,0.35)",
        borderRadius: 999,
        padding: "10px 16px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all 200ms ease",
      }}
    >
      {pending ? "Deleting..." : confirming ? "Confirm delete?" : label}
    </button>
  );
}