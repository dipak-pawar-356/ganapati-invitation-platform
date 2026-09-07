import { NextResponse } from "next/server";
import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.json();
  const { token, ...updates } = body;

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  try {
    const rows = await db.select({ id: mandals.id }).from(mandals).where(eq(mandals.editToken, token)).limit(1);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid edit link" }, { status: 404 });
    }

    const mandal = rows[0];

    const safeData: Record<string, any> = {};
    if (updates.mandal_name) safeData.mandalName = updates.mandal_name;
    if (updates.invite_message) safeData.inviteMessage = updates.invite_message;
    if (updates.established_year) safeData.establishedYear = updates.established_year;
    if (updates.contact) safeData.contact = updates.contact;
    if (updates.address) safeData.address = updates.address;
    if (updates.maps_link) safeData.mapsLink = updates.maps_link;
    if (updates.instagram_url) safeData.instagramUrl = updates.instagram_url;

    await db.update(mandals).set(safeData).where(eq(mandals.id, mandal.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update" }, { status: 500 });
  }
}