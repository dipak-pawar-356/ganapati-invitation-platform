import { NextResponse } from "next/server";
import { setSession, verifyPassword } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const cleanEmail = email?.trim();
    const cleanPassword = password?.trim();

    const platformAdminEmail = process.env.PLATFORM_ADMIN_EMAIL;
    const platformAdminPassword = process.env.PLATFORM_ADMIN_PASSWORD;

    // 1. Fallback Platform Admin credentials
    if (
      platformAdminEmail &&
      platformAdminPassword &&
      cleanEmail === platformAdminEmail &&
      cleanPassword === platformAdminPassword
    ) {
      await setSession({
        userId: "platform-superadmin-id",
        email: platformAdminEmail,
        role: "PLATFORM_ADMIN",
      });
      return NextResponse.json({ success: true });
    }

    // 2. Database lookup
    const userRows = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
    if (userRows && userRows.length > 0) {
      const user = userRows[0];
      const match = await verifyPassword(cleanPassword, user.passwordHash);
      if (match) {
        await setSession({
          userId: user.id,
          email: user.email,
          role: user.role as "PLATFORM_ADMIN" | "MANDAL_ADMIN",
          mandalId: user.mandalId,
        });
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Galat Email kiवा Password" }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Authentication error" }, { status: 500 });
  }
}
