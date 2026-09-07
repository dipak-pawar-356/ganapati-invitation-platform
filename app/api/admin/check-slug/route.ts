import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/slug";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSlug = searchParams.get("slug") || "";

    if (!rawSlug.trim()) {
      return NextResponse.json({ available: false, message: "Slug parameter is required." }, { status: 400 });
    }

    const formattedSlug = slugify(rawSlug);

    const existing = await db
      .select({ id: mandals.id })
      .from(mandals)
      .where(eq(mandals.slug, formattedSlug))
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({
        available: false,
        formattedSlug,
        message: "❌ Already Exists",
      });
    }

    return NextResponse.json({
      available: true,
      formattedSlug,
      message: "✅ Available",
    });
  } catch (error: any) {
    return NextResponse.json({ available: false, message: error.message || "Failed to check slug availability." }, { status: 500 });
  }
}
