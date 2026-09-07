import { db } from "@/db";
import { mandals, users, timelineEvents, galleryItems, committeeMembers } from "@/db/schema";
import { sql } from "drizzle-orm";
import Link from "next/link";
import Image from "next/image";
import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Users as UsersIcon,
  Globe,
  ImageIcon,
  Calendar,
  RefreshCw,
  ArrowLeft,
  KeyRound,
  HardDrive,
} from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function DatabaseHealthCheckPage() {
  let isConnected = false;
  let connectionTimeMs = 0;
  let errorMessage: string | null = null;
  let dbVersion: string = "Unknown";
  let mandalsCount = 0;
  let usersCount = 0;
  let timelineCount = 0;
  let galleryCount = 0;
  let committeeCount = 0;

  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  const maskedDbUrl = dbUrl
    ? dbUrl.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:••••••••@")
    : "NOT SET IN .env.local";

  const startTime = Date.now();

  try {
    if (!dbUrl || dbUrl.includes("placeholder")) {
      throw new Error("DATABASE_URL is missing or using placeholder in .env.local");
    }

    // Ping DB and fetch version
    const versionResult = await db.execute<{ version: string }>(sql`SELECT version();`);
    connectionTimeMs = Date.now() - startTime;
    isConnected = true;

    if (versionResult && versionResult.rows && versionResult.rows[0]) {
      dbVersion = String(versionResult.rows[0].version).split(" ")[0] || "PostgreSQL";
    }

    // Query stats concurrently
    const [mandalsRes, usersRes, timelineRes, galleryRes, committeeRes] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(mandals),
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(timelineEvents),
      db.select({ count: sql<number>`count(*)` }).from(galleryItems),
      db.select({ count: sql<number>`count(*)` }).from(committeeMembers),
    ]);

    mandalsCount = Number(mandalsRes[0]?.count || 0);
    usersCount = Number(usersRes[0]?.count || 0);
    timelineCount = Number(timelineRes[0]?.count || 0);
    galleryCount = Number(galleryRes[0]?.count || 0);
    committeeCount = Number(committeeRes[0]?.count || 0);
  } catch (err: any) {
    isConnected = false;
    connectionTimeMs = Date.now() - startTime;
    const msg = err?.message || String(err);

    if (!dbUrl) {
      errorMessage = "DATABASE_URL is missing in environment variables. Please add your Neon connection string to .env.local.";
    } else if (msg.includes("fetch failed") || msg.includes("Error connecting")) {
      errorMessage = "Neon HTTP Serverless connection failed. Network unreachable or endpoint paused.";
    } else if (msg.includes("relation") && msg.includes("does not exist")) {
      errorMessage = "Database tables missing. Please run `npx drizzle-kit push` to create database schema.";
    } else if (msg.includes("password authentication failed")) {
      errorMessage = "Database password authentication failed. Check your connection string credentials.";
    } else {
      errorMessage = msg;
    }
  }

  return (
    <main className="min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)] p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--admin-border)]">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-black/40 px-4 py-2 text-xs font-bold text-[var(--admin-gold-light)] hover:bg-[var(--admin-border-gold)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to SaaS Admin Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-[var(--admin-text-muted)]">
            Path: /admin/database
          </span>
        </div>

        {/* Header Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black/40 p-2 border border-[var(--admin-border)] shadow-inner">
            <Database className="w-7 h-7 text-[var(--admin-gold)]" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--admin-gold-light)]">
              Neon PostgreSQL Database Health Check
            </h1>
            <p className="text-xs text-[var(--admin-text-soft)] mt-0.5">
              Live diagnostics, connection ping, schema stats & Neon serverless status.
            </p>
          </div>
        </div>

        {/* STATUS BANNER */}
        <div
          className={`rounded-3xl border p-6 backdrop-blur-xl shadow-xl ${
            isConnected
              ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
              : "border-red-500/40 bg-red-950/30 text-red-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400 shrink-0" />
              )}
              <div>
                <h2 className="font-bold text-lg text-white">
                  Database Status: {isConnected ? "CONNECTED & HEALTHY 🟢" : "DISCONNECTED / ATTENTION REQUIRED 🔴"}
                </h2>
                <p className="text-xs text-[var(--admin-text-soft)] mt-1 font-mono">
                  {maskedDbUrl}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-[var(--admin-text-muted)] block">Ping Latency</span>
              <span className="font-mono text-xl font-bold text-white">{connectionTimeMs} ms</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 pt-4 border-t border-red-500/30 text-xs font-mono text-red-300 space-y-1">
              <p className="font-bold">Diagnostics Error Message:</p>
              <p className="bg-black/50 p-3 rounded-xl border border-red-500/20">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[var(--admin-border)] bg-black/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[var(--admin-gold)]">
              <span className="text-xs font-bold uppercase">Total Mandals</span>
              <Globe className="w-5 h-5" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-white">{mandalsCount}</p>
            <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Registered Tenants</p>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-black/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[var(--admin-gold)]">
              <span className="text-xs font-bold uppercase">Total Users</span>
              <UsersIcon className="w-5 h-5" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-white">{usersCount}</p>
            <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Admins & Super Admins</p>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-black/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[var(--admin-gold)]">
              <span className="text-xs font-bold uppercase">Timeline Events</span>
              <Calendar className="w-5 h-5" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-white">{timelineCount}</p>
            <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Festival Schedule Items</p>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-black/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-[var(--admin-gold)]">
              <span className="text-xs font-bold uppercase">Gallery Media</span>
              <ImageIcon className="w-5 h-5" />
            </div>
            <p className="mt-2 text-3xl font-extrabold text-white">{galleryCount}</p>
            <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Photos & Videos</p>
          </div>
        </div>

        {/* TECHNICAL DETAILS CARD */}
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-xl space-y-4">
          <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--admin-gold)]" />
            <span>Database Architecture Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[var(--admin-text-muted)] block font-semibold">ORM Framework</span>
              <span className="font-bold text-[var(--admin-gold-light)] text-sm">Drizzle ORM (v0.45.2)</span>
            </div>

            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[var(--admin-text-muted)] block font-semibold">Driver</span>
              <span className="font-bold text-[var(--admin-gold-light)] text-sm">@neondatabase/serverless HTTP</span>
            </div>

            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[var(--admin-text-muted)] block font-semibold">PostgreSQL Engine</span>
              <span className="font-bold text-white text-sm">{dbVersion}</span>
            </div>

            <div className="bg-black/50 p-3.5 rounded-2xl border border-white/10">
              <span className="text-[var(--admin-text-muted)] block font-semibold">Environment Config</span>
              <span className="font-bold text-white text-sm">{dbUrl ? "DATABASE_URL Configured" : "Missing Variable"}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
