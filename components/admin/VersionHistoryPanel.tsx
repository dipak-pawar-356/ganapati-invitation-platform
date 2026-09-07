"use client";

import { useState, useEffect } from "react";
import { getVersionHistoryAction, restoreVersionAction } from "@/lib/mandal-actions";
import { History, RotateCcw, User, Calendar, FileText } from "lucide-react";

export default function VersionHistoryPanel({ mandalId }: { mandalId: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getVersionHistoryAction(mandalId);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mandalId) fetchHistory();
  }, [mandalId]);

  const handleRestore = async (historyId: string, versionNumber: number) => {
    if (!confirm(`आवृत्ती (Version ${versionNumber}) पूर्ववत (Restore) करायची आहे का?`)) return;
    try {
      await restoreVersionAction(historyId);
      alert(`आवृत्ती V${versionNumber} पूर्ववत करण्यात आली आहे.`);
      fetchHistory();
    } catch (err: any) {
      alert(err.message || "पूर्ववत करताना एरर आली.");
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-[var(--admin-gold)]/25 bg-black/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-[var(--admin-gold)]/20 pb-3">
        <h3 className="font-display text-lg font-bold text-[var(--admin-gold-light)] flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>व्हर्जन इतिहास व ऑडिट लॉग (Version History & Audit Log)</span>
        </h3>
        <button
          type="button"
          onClick={fetchHistory}
          className="text-xs text-[var(--admin-gold)] hover:underline"
        >
          रिफ्रेश करा
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-xs text-[var(--admin-text)]/60">लोड होत आहे...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-4 text-xs text-[var(--admin-text)]/60">अजुन कोणताही बदल झालेला नाही.</div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div
              key={record.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/50 p-3.5 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[var(--admin-gold)]/20 border border-[var(--admin-gold)]/40 px-2 py-0.5 text-[10px] font-bold text-[var(--admin-gold-light)]">
                    Version {record.versionNumber}
                  </span>
                  <span className="font-bold text-[var(--admin-text)]">{record.changeSummary}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[var(--admin-text)]/60">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-amber-400" />
                    <span>{record.editedBy}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>{new Date(record.createdAt).toLocaleString("mr-IN")}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRestore(record.id, record.versionNumber)}
                className="inline-flex items-center gap-1 rounded-xl bg-amber-600/30 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-600/50 cursor-pointer self-start sm:self-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>हा व्हर्जन रिस्टोअर करा (Restore)</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
