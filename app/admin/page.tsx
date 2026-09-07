import Image from "next/image";
import { Inter } from "next/font/google";
import { getSession, logoutSession, setSession, verifyPassword } from "@/lib/auth";
import { getAllMandals, getMandalBySlug, updateMandalStatusAction, deleteMandalAction, FullMandalData } from "@/lib/mandal-actions";
import { db } from "@/db";
import { users, mandals } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export default async function AdminPage() {
  const session = await getSession();

  // Handle Login Server Action
  async function handleLogin(formData: FormData) {
    "use server";
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    const platformAdminEmail = process.env.PLATFORM_ADMIN_EMAIL;
    const platformAdminPassword = process.env.PLATFORM_ADMIN_PASSWORD;

    // Default Platform Admin credentials check
    if (
      platformAdminEmail &&
      platformAdminPassword &&
      email === platformAdminEmail &&
      password === platformAdminPassword
    ) {
      await setSession({
        userId: "platform-admin-id",
        email: platformAdminEmail,
        role: "PLATFORM_ADMIN",
      });
      return;
    }

    // Database lookup for registered Platform Admin or Mandal Admin
    try {
      const userRows = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (userRows && userRows.length > 0) {
        const user = userRows[0];
        const match = await verifyPassword(password, user.passwordHash);
        if (match) {
          await setSession({
            userId: user.id,
            email: user.email,
            role: user.role as "PLATFORM_ADMIN" | "MANDAL_ADMIN",
            mandalId: user.mandalId,
          });
          return;
        }
      }
    } catch (e) {
      console.error("Login DB error:", e);
    }
  }

  // Handle Logout
  async function handleLogout() {
    "use server";
    await logoutSession();
  }

  // 1. LOGIN SCREEN IF NOT AUTHENTICATED
  if (!session) {
    return (
      <main className={`min-h-screen flex items-center justify-center bg-[var(--admin-bg)] p-4 text-[var(--admin-text)] ${inter.className}`}>
        {/* Background Image */}
        <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/hero-background-desktop.webp')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none" />

        <div className="w-full max-w-md rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 p-1.5 border border-[var(--admin-border)] shadow-md">
            <Image
              src="/branding/adviks-logo.png"
              alt="Adviks Softtech"
              width={60}
              height={60}
              priority
              unoptimized
              className="object-contain"
            />
          </div>

          <p className="text-xs font-semibold text-[var(--admin-gold)] uppercase tracking-widest">
            ॥ श्री गणेशाय नमः ॥
          </p>

          <h1 className="mt-1 font-display text-2xl font-bold text-[var(--admin-gold-light)]">
            SaaS Platform Admin Login
          </h1>

          <p className="mt-1.5 text-xs text-[var(--admin-text-soft)]">
            Log in as Platform Admin or Mandal Admin to manage invitation websites.
          </p>

          <form action={handleLogin} className="mt-6 space-y-4 text-left text-xs">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Email / Username</label>
              <input
                type="text"
                name="email"
                required
                placeholder="advikssoftware@ganpatiplatform.com"
                defaultValue="advikssoftware@ganpatiplatform.com"
                className="w-full rounded-2xl border border-[var(--admin-border)] bg-black/50 px-4 py-3 text-sm text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                defaultValue="Adviks@2425#ASD$"
                className="w-full rounded-2xl border border-[var(--admin-border)] bg-black/50 px-4 py-3 text-sm text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 py-3.5 text-sm font-bold text-[var(--admin-bg)] shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-2 cursor-pointer"
            >
              Sign In to Admin Dashboard →
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-[var(--admin-border)]">
            <Link href="/admin/login" className="text-xs text-[var(--admin-gold-light)] hover:underline font-medium">
              Go to Dedicated Login Page (/admin/login) →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Fetch Mandals Data
  const allMandals = await getAllMandals();

  let mandalData: FullMandalData | null = null;
  if (session.role === "MANDAL_ADMIN" && session.mandalId) {
    const found = allMandals.find((m) => m.id === session.mandalId);
    if (found) {
      mandalData = await getMandalBySlug(found.slug);
    }
  }

  return (
    <AdminDashboardClient
      session={session}
      allMandals={allMandals}
      mandalData={mandalData}
      onLogout={handleLogout}
      updateStatusAction={updateMandalStatusAction}
      deleteMandalAction={deleteMandalAction}
    />
  );
}