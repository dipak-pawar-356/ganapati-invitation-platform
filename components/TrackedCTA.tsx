"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export default function TrackedCTA({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={className} onClick={() => track("landing_cta_click")}>
      {children}
    </Link>
  );
}