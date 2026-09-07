"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, KeyRound, Check } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAutofill = (eMail: string, pass: string) => {
    setEmail(eMail);
    setPassword(pass);
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Login failed. Please check credentials.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--admin-bg)] p-4 text-[var(--admin-text)]">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/hero-background-desktop.webp')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Top Back Navigation */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-border)] bg-black/50 px-4 py-2 text-xs font-bold text-[var(--admin-gold-light)] backdrop-blur-md hover:bg-white/10"
        >
          <span>← Back to Home</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 p-1 border border-[var(--admin-border)] shadow-sm">
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
          SaaS Admin Portal Login
        </h1>

        <p className="mt-1 text-xs text-[var(--admin-text-soft)]">
          Sign in as Platform Admin or Mandal Admin to manage websites.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-950/70 border border-red-500/40 p-3 text-xs font-semibold text-red-300">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-5 space-y-3.5 text-left text-xs">
          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="advikssoftware@ganpatiplatform.com"
              className="w-full rounded-2xl border border-[var(--admin-border)] bg-black/50 px-4 py-3 text-sm text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-[var(--admin-border)] bg-black/50 px-4 py-3 text-sm text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[var(--admin-text-soft)] pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded accent-[var(--admin-gold)]" />
              <span>Remember Me</span>
            </label>
            <span className="text-[var(--admin-gold-light)] cursor-pointer hover:underline">Forgot Password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 py-3.5 text-sm font-bold text-[var(--admin-bg)] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-2 cursor-pointer"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNTS ONE-TOUCH AUTO-FILL BOX */}
        <div className="mt-6 pt-5 border-t border-[var(--admin-border)] text-left">
          <p className="text-[11px] font-bold text-[var(--admin-gold)] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
            <KeyRound className="w-3.5 h-3.5" />
            <span>One-Touch Demo Credentials</span>
          </p>

          <div className="space-y-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleAutofill("advikssoftware@ganpatiplatform.com", "Adviks@2425#ASD$")}
              className="w-full flex items-center justify-between bg-black/40 hover:bg-[var(--admin-border-gold)] p-2 rounded-xl border border-white/10 text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-bold text-[var(--admin-gold-light)]">Platform Super Admin</span>
                <div className="text-[10px] text-[var(--admin-text-muted)]">advikssoftware@ganpatiplatform.com • Adviks@2425#ASD$</div>
              </div>
              <span className="text-[10px] font-bold text-[var(--admin-gold)] bg-[var(--admin-border-gold)] px-2 py-0.5 rounded-md">Fill</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutofill("admin@jaymalhar.com", "mandal123")}
              className="w-full flex items-center justify-between bg-black/40 hover:bg-[var(--admin-border-gold)] p-2 rounded-xl border border-white/10 text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-bold text-[var(--admin-gold-light)]">Demo 1: Royal Gold Admin</span>
                <div className="text-[10px] text-[var(--admin-text-muted)]">admin@jaymalhar.com • mandal123</div>
              </div>
              <span className="text-[10px] font-bold text-[var(--admin-gold)] bg-[var(--admin-border-gold)] px-2 py-0.5 rounded-md">Fill</span>
            </button>

            <button
              type="button"
              onClick={() => handleAutofill("admin@swamisamarth.com", "mandal123")}
              className="w-full flex items-center justify-between bg-black/40 hover:bg-[var(--admin-border-gold)] p-2 rounded-xl border border-white/10 text-left transition-colors cursor-pointer"
            >
              <div>
                <span className="font-bold text-[var(--admin-gold-light)]">Demo 2: Peshwai Admin</span>
                <div className="text-[10px] text-[var(--admin-text-muted)]">admin@swamisamarth.com • mandal123</div>
              </div>
              <span className="text-[10px] font-bold text-[var(--admin-gold)] bg-[var(--admin-border-gold)] px-2 py-0.5 rounded-md">Fill</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
