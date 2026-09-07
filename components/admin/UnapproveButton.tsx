"use client";

import { useTransition } from "react";
import { unapproveMandal } from "@/lib/admin-actions";

export default function UnapproveButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(async () => { await unapproveMandal(id); })}
      disabled={pending}
      title="Unpublish — move back to pending"
      style={{
        background: "rgba(217,119,6,0.12)",
        color: "#b45309",
        border: "1px solid rgba(217,119,6,0.35)",
        borderRadius: 999,
        padding: "10px 14px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {pending ? "..." : "↩ Unapprove"}
    </button>
  );
}