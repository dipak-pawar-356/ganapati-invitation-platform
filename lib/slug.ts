import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";

export function slugify(input: string): string {
  const ascii = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (ascii.length >= 3) return ascii;
  return "mandal-" + Math.random().toString(36).slice(2, 8);
}

// Checks Drizzle DB and appends -2, -3 etc. if the slug is already taken
export async function getUniqueSlug(baseName: string): Promise<string> {
  const base = slugify(baseName);
  let candidate = base;
  let attempt = 1;

  while (true) {
    try {
      const rows = await db.select({ id: mandals.id }).from(mandals).where(eq(mandals.slug, candidate)).limit(1);
      if (!rows || rows.length === 0) return candidate;
    } catch {
      return candidate;
    }
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }
}

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

