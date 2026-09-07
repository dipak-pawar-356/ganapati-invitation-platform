"use client";

import { useState, useEffect } from "react";
import { getDonationTransactionsAction, updateDonationStatusAction } from "@/lib/mandal-actions";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  Filter,
  Smartphone,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";

interface DonationsPanelProps {
  mandalId?: string;
  isPlatformAdmin?: boolean;
}

export default function DonationsPanel({ mandalId, isPlatformAdmin }: DonationsPanelProps) {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await getDonationTransactionsAction(mandalId, statusFilter);
      setDonations(data || []);
    } catch (e) {
      console.error("Error fetching donations:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [mandalId, statusFilter]);

  const handleUpdateStatus = async (id: string, status: "verified" | "rejected") => {
    try {
      await updateDonationStatusAction(id, status);
      fetchDonations();
    } catch (e: any) {
      alert(e.message || "Failed to update donation status.");
    }
  };

  const filteredDonations = donations.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorWhatsapp.includes(searchQuery) ||
      d.utrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.mandalName && d.mandalName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const exportCSV = () => {
    if (filteredDonations.length === 0) {
      alert("No donation records to export.");
      return;
    }
    const headers = ["ID", "Mandal Name", "Donor Name", "WhatsApp", "Amount (INR)", "UTR Number", "Status", "Date"];
    const rows = filteredDonations.map((d) => [
      d.id,
      `"${d.mandalName || ""}"`,
      `"${d.donorName}"`,
      `"${d.donorWhatsapp}"`,
      d.amount,
      `"${d.utrNumber}"`,
      d.status,
      `"${new Date(d.createdAt).toLocaleString("mr-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `donations_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--admin-border)] pb-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--admin-gold-light)] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <span>देणगी व वर्गणी व्यवस्थापन (Donations & Receipts)</span>
          </h2>
          <p className="text-xs text-[var(--admin-text-soft)] mt-1">
            भाविकांनी ऑनलाईन नोंदवलेल्या वर्गणी व्यवहारांची पडताळणी करा आणि पावती पाठवा.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-950/80 transition-all cursor-pointer shadow-md"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Download CSV Report</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--admin-gold-light)]/60" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाव, मोबाईल, UTR नंबर शोधा..."
            className="w-full rounded-2xl border border-[var(--admin-border)] bg-black/50 pl-10 pr-4 py-2.5 text-xs text-[var(--admin-text)] outline-none focus:border-[var(--admin-gold)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["all", "pending", "verified", "rejected"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-2 text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === st
                  ? "border border-[var(--admin-gold)] bg-[var(--admin-gold)] text-[var(--admin-bg)] shadow-md"
                  : "border border-white/10 bg-black/40 text-amber-200/70 hover:bg-white/5"
              }`}
            >
              {st === "all" ? "सर्व" : st === "pending" ? "पेंडिंग" : st === "verified" ? "मंजूर (Verified)" : "नाकारलेले"}
            </button>
          ))}
        </div>
      </div>

      {/* Donations Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-amber-300 font-bold">लोड होत आहे...</div>
      ) : filteredDonations.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-12 text-center text-xs text-[var(--admin-text-muted)]">
          कोणतीही देणगी नोंद सापडली नाही.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-[var(--admin-border)] bg-black/50 backdrop-blur-md shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--admin-border)] bg-[var(--admin-card)] text-[var(--admin-gold-light)] uppercase tracking-wider font-extrabold">
                <th className="py-3.5 px-4">दिनांक</th>
                {isPlatformAdmin && <th className="py-3.5 px-4">मंडळ</th>}
                <th className="py-3.5 px-4">देणगीदार</th>
                <th className="py-3.5 px-4">WhatsApp</th>
                <th className="py-3.5 px-4">रक्कम</th>
                <th className="py-3.5 px-4">UTR Number</th>
                <th className="py-3.5 px-4">स्क्रीनशॉट</th>
                <th className="py-3.5 px-4">स्थिती</th>
                <th className="py-3.5 px-4 text-right">कार्रवाई (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-[var(--admin-text-soft)]">
              {filteredDonations.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-all">
                  <td className="py-3 px-4 whitespace-nowrap text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString("mr-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {isPlatformAdmin && (
                    <td className="py-3 px-4 font-bold text-amber-300">
                      {item.mandalName}
                    </td>
                  )}
                  <td className="py-3 px-4 font-bold">{item.donorName}</td>
                  <td className="py-3 px-4">{item.donorWhatsapp}</td>
                  <td className="py-3 px-4 font-extrabold text-amber-400 text-sm">
                    ₹{item.amount}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-200">{item.utrNumber}</td>
                  <td className="py-3 px-4">
                    {item.screenshotUrl ? (
                      <button
                        type="button"
                        onClick={() => setSelectedScreenshot(item.screenshotUrl)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>पहा</span>
                      </button>
                    ) : (
                      <span className="text-gray-500 text-[11px]">उपलब्ध नाही</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        item.status === "verified"
                          ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                          : item.status === "rejected"
                          ? "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                          : "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {item.status === "verified" ? "मंजूर" : item.status === "rejected" ? "नाकारलेले" : "पेंडिंग"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    {item.status !== "verified" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, "verified")}
                        className="rounded-xl border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                      >
                        मंजूर करा
                      </button>
                    )}
                    {item.status !== "rejected" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(item.id, "rejected")}
                        className="rounded-xl border border-rose-500/40 bg-rose-950/50 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                      >
                        नाकारा
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SCREENSHOT PROOF MODAL */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-w-lg w-full rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-4 text-center">
            <h3 className="text-xs font-bold text-[var(--admin-gold-light)] mb-2">पेमेंट पुरावा स्क्रीनशॉट (Payment Proof)</h3>
            <img src={selectedScreenshot} alt="Payment Proof" className="max-h-96 w-full object-contain rounded-2xl bg-black" />
            <button
              type="button"
              onClick={() => setSelectedScreenshot(null)}
              className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/20 px-6 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500 transition-all cursor-pointer"
            >
              बंद करा (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
