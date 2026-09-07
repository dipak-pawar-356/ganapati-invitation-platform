"use client";

import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { createMandalAction } from "@/lib/mandal-actions";

interface CreateMandalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMandalModal({ isOpen, onClose }: CreateMandalModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mandalName, setMandalName] = useState("");
  const [slug, setSlug] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [themeId, setThemeId] = useState("royal_gold");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");

  if (!isOpen) return null;

  const handleMandalNameChange = (val: string) => {
    setMandalName(val);
    if (!slug) {
      // Auto generate slug from mandal name
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(autoSlug || "mandal-" + Math.floor(Math.random() * 1000));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createMandalAction({
        mandalName,
        slug,
        adminEmail,
        adminPassword,
        themeId,
        contact,
        address,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to create mandal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 shadow-2xl text-[var(--admin-text)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--admin-gold)]" />
            <h3 className="font-display font-bold text-lg text-[var(--admin-gold-light)]">
              Create New Mandal Website
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--admin-text-muted)] hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-950/60 border border-red-500/30 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Mandal Name *</label>
            <input
              type="text"
              required
              value={mandalName}
              onChange={(e) => handleMandalNameChange(e.target.value)}
              placeholder="उदा. श्री जय मल्हार गणेश मंडळ"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3.5 py-2.5 text-sm text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="shri-jay-malhar-ganesh-mandal"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Theme *</label>
              <select
                value={themeId}
                onChange={(e) => setThemeId(e.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              >
                <option value="royal_gold">Theme 1: Royal Temple Gold</option>
                <option value="peshwai">Theme 2: Peshwai Heritage</option>
                <option value="divine_saffron">Theme 3: Modern Premium</option>
                <option value="night_darshan">Theme 4: Night Darshan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Admin Email *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@jaymalhar.com"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Admin Password *</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Set password"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98231 23456"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Mandap Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="उदा. मुख्य चौक, कार्वे रोड, कोथरूड, पुणे"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--admin-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--admin-text-soft)] hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 text-[var(--admin-bg)] shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Website →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
