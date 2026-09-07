"use client";

import { useState, useEffect } from "react";
import { getAllMandalCredentials, resetMandalPasswordAction, toggleCredentialStatusAction } from "@/lib/mandal-actions";
import { KeyRound, Copy, RefreshCw, Check, Power, LogIn, Search, ShieldCheck } from "lucide-react";

export default function CredentialsPanel() {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const data = await getAllMandalCredentials();
      setCredentials(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleCopy = (cred: any) => {
    const text = `🚩 *${cred.mandalName} — ॲडमिन लॉगिन तपशील* 🚩\n\n🔗 लॉगिन लिंक: ${window.location.origin}/mandal/login\n👤 यूजरनेम: ${cred.username}\n🔑 पासवर्ड: ${cred.tempPassword}\n\n॥ गणपती बाप्पा मोरया ॥`;
    navigator.clipboard.writeText(text);
    setCopiedId(cred.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResetPassword = async (id: string) => {
    if (!confirm("पासवर्ड रिसेट करायचा आहे का?")) return;
    try {
      const res = await resetMandalPasswordAction(id);
      if (res?.newPassword) {
        alert(`नवीन पासवर्ड तयार झाला: ${res.newPassword}`);
        fetchCredentials();
      }
    } catch (e: any) {
      alert(e.message || "रिसेट करताना एरर आली.");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCredentialStatusAction(id);
      fetchCredentials();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = credentials.filter(
    (c) =>
      c.mandalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--admin-gold)] flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Super Admin Credential Control Panel</span>
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--admin-gold-light)]">
            जनरेट केलेले मंडल ॲडमिन खाती व पासवर्ड (Mandal Credentials)
          </h2>
          <p className="text-xs text-[var(--admin-text-soft)] mt-1">
            सुपर ॲडमिन कडून मंजुरी दिल्यानंतर स्वयंचलित तयार झालेले यूजरनेम व पासवर्ड. इथून मॅन्युअली शेअर करा किंवा पासवर्ड रिसेट करा.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchCredentials}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--admin-border)] bg-black/40 px-3.5 py-2 text-xs font-bold text-[var(--admin-gold-light)] hover:bg-[var(--admin-border-gold)] cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>रिफ्रेश करा</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4 bg-black/40 p-3 rounded-2xl border border-[var(--admin-border)]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 flex-1 max-w-md">
          <Search className="w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            placeholder="Search Mandal Name or Username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-[var(--admin-text)] placeholder-[var(--admin-text-muted)] focus:outline-none w-full"
          />
        </div>
        <span className="text-xs text-[var(--admin-gold-light)] font-medium">{filtered.length} खाती</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-[var(--admin-border)] bg-black/40 backdrop-blur-md">
        <table className="w-full text-left text-xs text-[var(--admin-text)]">
          <thead className="bg-[var(--admin-bg-secondary)] text-[var(--admin-gold-light)] font-semibold border-b border-[var(--admin-border)]">
            <tr>
              <th className="p-4">मंडल नाव & स्लग</th>
              <th className="p-4">यूजरनेम (Username)</th>
              <th className="p-4">हंगामी पासवर्ड (Temp Password)</th>
              <th className="p-4">तयार तारीख</th>
              <th className="p-4">स्थिती</th>
              <th className="p-4 text-right">कृती (Actions)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((cred) => (
              <tr key={cred.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[var(--admin-text)]">{cred.mandalName}</div>
                  <div className="text-[11px] text-[var(--admin-gold)]">/{cred.slug}</div>
                </td>
                <td className="p-4 font-mono text-amber-200 select-all">{cred.username}</td>
                <td className="p-4 font-mono font-bold text-emerald-300 select-all bg-black/30 px-3 py-1 rounded-lg border border-white/10">
                  {cred.tempPassword}
                </td>
                <td className="p-4 text-[var(--admin-text-soft)]">
                  {new Date(cred.createdAt).toLocaleDateString("mr-IN")}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      cred.status === "active"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-950/60 text-red-400 border border-red-500/30"
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span className="capitalize">{cred.status}</span>
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(cred)}
                    className="inline-flex items-center gap-1 rounded-xl bg-amber-600/30 border border-amber-500/40 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-600/50 cursor-pointer"
                  >
                    {copiedId === cred.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === cred.id ? "कॉपी झाले!" : "कॉपी"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResetPassword(cred.id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-sky-600/30 border border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-600/50 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>रिसेट</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(cred.id)}
                    className="inline-flex items-center gap-1 rounded-xl bg-purple-600/30 border border-purple-500/40 px-2 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-600/50 cursor-pointer"
                  >
                    <span>{cred.status === "active" ? "डीॲक्टिव्हेट" : "ॲक्टिव्हेट"}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
