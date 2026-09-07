"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import CreateMandalModal from "./CreateMandalModal";
import MandalContentEditor from "./MandalContentEditor";
import CredentialsPanel from "./CredentialsPanel";
import VersionHistoryPanel from "./VersionHistoryPanel";
import DonationsPanel from "./DonationsPanel";
import PreviewModal from "@/components/PreviewModal";
import {
  FullMandalData,
  approveMandalAction,
  getMandalBySlug,
  rejectMandalAction,
  requestChangesMandalAction,
} from "@/lib/mandal-actions";
import { SessionPayload } from "@/lib/auth";
import { getAppBaseUrl, slugify } from "@/lib/slug";
import {
  Plus,
  Search,
  Globe,
  Eye,
  Trash2,
  CheckCircle2,
  Ban,
  Flower2,
  Users,
  Image as ImageIcon,
  Video,
  HardDrive,
  Activity,
  FileCheck,
  Edit,
  KeyRound,
  Copy,
  Check,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  Send,
  Sparkles,
  Smartphone,
  MapPin,
} from "lucide-react";

interface AdminDashboardClientProps {
  session: SessionPayload;
  allMandals: any[];
  mandalData: FullMandalData | null;
  onLogout: () => Promise<void>;
  updateStatusAction: (id: string, status: any) => Promise<void>;
  deleteMandalAction: (id: string) => Promise<void>;
}

export default function AdminDashboardClient({
  session,
  allMandals,
  mandalData,
  onLogout,
  updateStatusAction,
  deleteMandalAction,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState(session.role === "PLATFORM_ADMIN" ? "submissions" : "hero");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMandal, setSelectedMandal] = useState<FullMandalData | null>(mandalData);
  const [editingMandal, setEditingMandal] = useState<FullMandalData | null>(null);
  const [previewingMandal, setPreviewingMandal] = useState<FullMandalData | null>(null);

  // Approval & Slug Modal State
  const [approvalModal, setApprovalModal] = useState<{
    id: string;
    mandalName: string;
    email: string;
    whatsapp: string;
    initialSlug: string;
  } | null>(null);
  const [customSlug, setCustomSlug] = useState("");
  const [slugStatus, setSlugStatus] = useState<{ checking: boolean; available?: boolean; message?: string }>({
    checking: false,
  });

  // Generated Credentials Modal State
  const [generatedCredsModal, setGeneratedCredsModal] = useState<{
    mandalName: string;
    slug: string;
    username: string;
    tempPassword: string;
    whatsapp: string;
  } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Reject Modal State
  const [rejectReasonModal, setRejectReasonModal] = useState<{ id: string; mandalName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Delete Confirm Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{ id: string; mandalName: string } | null>(null);

  // Filters & Counts
  const filteredMandals = allMandals.filter((m) => {
    const matchesSearch =
      m.mandalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.refNumber && m.refNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" ? true : m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = allMandals.filter((m) => m.status === "pending").length;
  const approvedCount = allMandals.filter((m) => m.status === "approved" || m.status === "published").length;
  const rejectedCount = allMandals.filter((m) => m.status === "rejected").length;
  const needChangesCount = allMandals.filter((m) => m.status === "need_changes").length;
  const totalFlowers = allMandals.reduce((sum, m) => sum + (m.flowerCount || 108), 0);

  // Real-time Slug Availability Verification
  useEffect(() => {
    if (!customSlug.trim()) {
      setSlugStatus({ checking: false });
      return;
    }
    const timer = setTimeout(async () => {
      setSlugStatus({ checking: true });
      try {
        const formatted = slugify(customSlug);
        const res = await fetch(`/api/admin/check-slug?slug=${encodeURIComponent(formatted)}`);
        const data = await res.json();
        setSlugStatus({
          checking: false,
          available: data.available,
          message: data.message,
        });
      } catch {
        setSlugStatus({ checking: false, available: false, message: "Error checking slug" });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [customSlug]);

  // Open Approval & Slug Modal
  const handleOpenApproveModal = (m: any) => {
    const suggested = slugify(m.mandalName);
    setApprovalModal({
      id: m.id,
      mandalName: m.mandalName,
      email: m.email || "",
      whatsapp: m.whatsappNumber || m.mobileNumber || m.contact || "",
      initialSlug: suggested,
    });
    setCustomSlug(suggested);
  };

  // Submit Approval & Assign Slug
  const handleConfirmApproval = async () => {
    if (!approvalModal) return;
    if (slugStatus.available === false) {
      alert("कृपया वैध आणि युनिक (Available) स्लग प्रविष्ट करा.");
      return;
    }

    try {
      const res = await approveMandalAction(approvalModal.id, customSlug);
      if (res && res.username && res.tempPassword) {
        setGeneratedCredsModal({
          mandalName: approvalModal.mandalName,
          slug: res.slug,
          username: res.username,
          tempPassword: res.tempPassword,
          whatsapp: approvalModal.whatsapp,
        });
        setApprovalModal(null);
      }
    } catch (e: any) {
      alert(e.message || "Approve action failed");
    }
  };

  // Copy Credentials Text
  const handleCopyGenerated = () => {
    if (!generatedCredsModal) return;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : getAppBaseUrl();
    const websiteUrl = `${baseUrl}/${generatedCredsModal.slug}`;
    const text = `🚩 *${generatedCredsModal.mandalName} — ॲडमिन कडून निमंत्रण वेबसाइट तयार झाल्याचे अभिनंदन!* 🚩

🌐 *आपली वेबसाइट लिंक:*
${websiteUrl}

👤 *लॉगिन यूजरनेम:* ${generatedCredsModal.username}
🔐 *लॉगिन पासवर्ड:* ${generatedCredsModal.tempPassword}
🔗 *लॉगिन पोर्टल:* ${baseUrl}/mandal/login

॥ गणपती बाप्पा मोरया ॥`;

    navigator.clipboard.writeText(text);
    setCopiedCreds(true);
    setTimeout(() => setCopiedCreds(false), 2500);
  };

  // Open WhatsApp to Customer with Credentials
  const handleSendWhatsAppNotification = () => {
    if (!generatedCredsModal) return;
    const baseUrl = typeof window !== "undefined" ? window.location.origin : getAppBaseUrl();
    const websiteUrl = `${baseUrl}/${generatedCredsModal.slug}`;
    const whatsappMsg = `🚩 *अभिनंदन!*

आपल्या गणेश मंडळाची वेबसाइट तयार झाली आहे.

🌐 *Website:*
${websiteUrl}

👤 *Login:*
${generatedCredsModal.username}

🔐 *Password:*
${generatedCredsModal.tempPassword}

🙏 *गणपती बाप्पा मोरया*`;

    const cleanPhone = generatedCredsModal.whatsapp.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappMsg)}`;
    window.open(waUrl, "_blank");
  };

  const handleOpenPreview = async (slug: string) => {
    const full = await getMandalBySlug(slug);
    if (full) setPreviewingMandal(full);
  };

  const handleOpenEdit = async (slug: string) => {
    const full = await getMandalBySlug(slug);
    if (full) {
      setEditingMandal(full);
      setSelectedMandal(full);
      setActiveTab("edit_mandal");
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectReasonModal) return;
    try {
      await rejectMandalAction(rejectReasonModal.id, rejectReason);
      setRejectReasonModal(null);
      setRejectReason("");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmModal) return;
    try {
      await deleteMandalAction(deleteConfirmModal.id);
      setDeleteConfirmModal(null);
    } catch (e: any) {
      alert(e.message || "Delete failed");
    }
  };

  const handleSuspendMandal = async (id: string) => {
    if (confirm("तुम्ही हे मंडळ स्थगित (Suspend) करू इच्छिता का?")) {
      try {
        await updateStatusAction(id, "suspended");
      } catch (e: any) {
        alert(e.message || "Suspend failed");
      }
    }
  };

  const handleActivateMandal = async (id: string) => {
    try {
      await updateStatusAction(id, "approved");
    } catch (e: any) {
      alert(e.message || "Activation failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== "edit_mandal") setEditingMandal(null);
          setActiveTab(tab);
        }}
        role={session.role}
        mandalName={selectedMandal?.mandalName || "Mandal Admin"}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-[var(--admin-border)]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--admin-gold)]">
              {session.role === "PLATFORM_ADMIN" ? "Platform Super Admin Dashboard" : "Mandal Control Panel"}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--admin-gold-light)]">
              {session.role === "PLATFORM_ADMIN"
                ? "Ganapati Mandal SaaS Platform Review & Credentials System"
                : selectedMandal?.mandalName || "My Mandal Website"}
            </h1>
          </div>

          {session.role === "PLATFORM_ADMIN" && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 px-5 py-3 text-xs sm:text-sm font-bold text-[var(--admin-bg)] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Mandal (Direct)</span>
            </button>
          )}
        </div>

        {/* METRICS CARDS */}
        {activeTab === "dashboard" && (
          <>
            {session.role === "PLATFORM_ADMIN" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl border border-[var(--admin-border)] bg-black/40 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[var(--admin-gold)]">
                    <span className="text-xs font-semibold uppercase">Total Requests</span>
                    <Globe className="w-5 h-5" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--admin-text)]">{allMandals.length}</p>
                  <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Total Customer Submissions</p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-black/40 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="text-xs font-semibold uppercase">Pending Approval</span>
                    <Clock className="w-5 h-5" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-amber-400">{pendingCount}</p>
                  <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Awaiting Super Admin Review</p>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-black/40 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-emerald-400">
                    <span className="text-xs font-semibold uppercase">Approved & Live</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400">{approvedCount}</p>
                  <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Publicly Published Websites</p>
                </div>

                <div className="rounded-2xl border border-rose-500/30 bg-black/40 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="text-xs font-semibold uppercase">Rejected</span>
                    <Ban className="w-5 h-5" />
                  </div>
                  <p className="mt-2 text-2xl sm:text-3xl font-bold text-rose-400">{rejectedCount}</p>
                  <p className="mt-1 text-[11px] text-[var(--admin-text-muted)]">Not meeting guidelines</p>
                </div>
              </div>
            ) : (
              /* MANDAL ADMIN DASHBOARD OVERVIEW */
              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-2xl border border-emerald-500/30 bg-black/40 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="text-xs font-bold uppercase">वेबसाईट स्टेटस (Website Status)</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="mt-2 text-xl font-extrabold text-emerald-300 capitalize">
                      {selectedMandal?.status === "approved" || selectedMandal?.status === "published"
                        ? "Live & Published"
                        : selectedMandal?.status || "Live"}
                    </p>
                    {selectedMandal?.slug && (
                      <a
                        href={`/${selectedMandal.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                      >
                        <span>वेबसाईट पहा (View Website)</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>

                  <div className="rounded-2xl border border-amber-500/30 bg-black/40 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="text-xs font-bold uppercase">एकूण पुष्प अर्पण (Flowers Offered)</span>
                      <Flower2 className="w-5 h-5" />
                    </div>
                    <p className="mt-2 text-3xl font-extrabold text-amber-300">
                      {selectedMandal?.flowerCount || 108}
                    </p>
                    <p className="mt-1 text-[11px] text-white/60">भाविक भक्तांनी दिलेले ऑनलाईन पुष्प</p>
                  </div>

                  <div className="rounded-2xl border border-sky-500/30 bg-black/40 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-sky-400">
                      <span className="text-xs font-bold uppercase">समिती सदस्य (Committee Members)</span>
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="mt-2 text-3xl font-extrabold text-sky-300">
                      {selectedMandal?.committee?.length || 0}
                    </p>
                    <p className="mt-1 text-[11px] text-white/60">मंडळाचे नोंदणीकृत कार्यकर्ते</p>
                  </div>

                  <div className="rounded-2xl border border-purple-500/30 bg-black/40 p-5 backdrop-blur-md">
                    <div className="flex items-center justify-between text-purple-400">
                      <span className="text-xs font-bold uppercase">गॅलरी फोटो (Gallery Items)</span>
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <p className="mt-2 text-3xl font-extrabold text-purple-300">
                      {selectedMandal?.gallery?.length || 0}
                    </p>
                    <p className="mt-1 text-[11px] text-white/60">अपलोड केलेले फोटो</p>
                  </div>
                </div>

                {/* Mandal Summary Card */}
                {selectedMandal && (
                  <div className="rounded-3xl border border-[var(--admin-border)] bg-black/50 p-6 backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <h3 className="font-display font-bold text-lg text-[var(--admin-gold-light)]">
                        🚩 {selectedMandal.mandalName} — मंडळ माहिती (Overview)
                      </h3>
                      {selectedMandal.refNumber && (
                        <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-500/30">
                          {selectedMandal.refNumber}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[var(--admin-text-soft)]">
                      <div>
                        <span className="text-[var(--admin-gold)] font-semibold block">संपर्क व्यक्ती & मोबाईल:</span>
                        <p className="font-bold text-white text-sm">{selectedMandal.contactPersonName || selectedMandal.contact}</p>
                        <p className="text-amber-200">{selectedMandal.mobileNumber || selectedMandal.whatsappNumber || selectedMandal.contact}</p>
                      </div>

                      <div>
                        <span className="text-[var(--admin-gold)] font-semibold block">पत्ता & ठिकाण:</span>
                        <p>{selectedMandal.address}</p>
                        <p className="text-white/70">{selectedMandal.city ? `${selectedMandal.city}, ${selectedMandal.district}` : ""}</p>
                      </div>

                      <div>
                        <span className="text-[var(--admin-gold)] font-semibold block">UPI देणगी Details:</span>
                        <p className="font-mono font-bold text-amber-300">{selectedMandal.upiId || "Not set"}</p>
                        <p className="text-white/70">{selectedMandal.accountHolder || ""}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* PENDING SUBMISSIONS & MANDALS LIST TAB */}
        {session.role === "PLATFORM_ADMIN" && (activeTab === "submissions" || activeTab === "mandals" || activeTab === "dashboard") && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                {["all", "pending", "approved", "suspended", "rejected"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-all cursor-pointer ${
                      statusFilter === st
                        ? "border border-[var(--admin-gold)] bg-[var(--admin-gold)] text-[var(--admin-bg)] shadow-md"
                        : "border border-white/10 bg-black/40 text-amber-200/70 hover:bg-white/5"
                    }`}
                  >
                    {st === "all"
                      ? "सर्व"
                      : st === "pending"
                      ? `पेंडिंग (${pendingCount})`
                      : st === "approved"
                      ? "मंजूर"
                      : st === "suspended"
                      ? "स्थगित (Suspended)"
                      : "नाकारलेले"}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 flex-1 max-w-xs">
                <Search className="w-4 h-4 text-[var(--admin-text-muted)]" />
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="नाव, ईमेल, रिफ नंबर किंवा स्लग शोधा..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-[var(--admin-text)] placeholder-[var(--admin-text-muted)] focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Mandals Table */}
            <div className="overflow-x-auto rounded-3xl border border-[var(--admin-border)] bg-black/40 backdrop-blur-md">
              <table className="w-full text-left text-xs text-[var(--admin-text)]">
                <thead className="bg-[var(--admin-bg-secondary)] text-[var(--admin-gold-light)] font-semibold border-b border-[var(--admin-border)]">
                  <tr>
                    <th className="p-4">Ref & Mandal Name</th>
                    <th className="p-4">Contact & Email</th>
                    <th className="p-4">UPI & Location</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Created Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMandals.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-[10px] font-bold text-amber-300 block mb-0.5">
                          {m.refNumber || `REF-2026-${(m.slug || "MD").slice(0, 4).toUpperCase()}`}
                        </span>
                        <div className="font-bold text-[var(--admin-text)] text-sm">{m.mandalName}</div>
                        <div className="text-[11px] text-[var(--admin-gold)] font-mono">
                          {m.slug?.startsWith("pending-") ? "(No Public Slug Assigned Yet)" : `/${m.slug}`}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white/90">{m.contactPersonName || "मंड़ळ पदाधिकारी"}</div>
                        <div className="text-[11px] text-amber-200">{m.contact || m.mobileNumber || m.whatsappNumber}</div>
                        <div className="text-[11px] text-emerald-300 font-medium">{m.email || `${m.slug?.replace(/-/g, "")}@gmail.com`}</div>
                      </td>
                      <td className="p-4 text-[11px]">
                        <div className="font-mono text-amber-300 font-bold">{m.upiId || `${m.slug?.replace(/-/g, "")}@oksbi`}</div>
                        <div className="text-white/70 line-clamp-1">{m.address}</div>
                        <a
                          href={m.mapsLink || `https://maps.google.com/?q=${encodeURIComponent(m.address || m.mandalName)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-200 hover:underline"
                        >
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>📍 Google Map ↗</span>
                        </a>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            m.status === "approved" || m.status === "published"
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                              : m.status === "pending"
                              ? "bg-amber-950/60 text-amber-400 border border-amber-500/30 animate-pulse"
                              : m.status === "suspended"
                              ? "bg-purple-950/60 text-purple-400 border border-purple-500/30"
                              : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          <span className="capitalize">{m.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-white/70">
                        {new Date(m.createdAt).toLocaleDateString("mr-IN")}
                      </td>
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Admin Preview Route */}
                        <a
                          href={`/admin/preview/${m.id}`}
                          target="_blank"
                          rel="noreferrer"
                          suppressHydrationWarning
                          className="inline-flex items-center gap-1 rounded-xl bg-purple-600/30 border border-purple-500/40 px-2.5 py-1 text-[11px] font-semibold text-purple-300 hover:bg-purple-600/50 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </a>

                        {/* Full Edit button */}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => handleOpenEdit(m.slug)}
                          className="inline-flex items-center gap-1 rounded-xl bg-sky-600/30 border border-sky-500/40 px-2.5 py-1 text-[11px] font-semibold text-sky-300 hover:bg-sky-600/50 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Approve & Assign Slug Button */}
                        {m.status !== "approved" && m.status !== "published" && m.status !== "suspended" && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => handleOpenApproveModal(m)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600/30 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-600/50 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Assign Slug & Approve</span>
                          </button>
                        )}

                        {/* Suspend Mandal Option (For Approved Mandals) */}
                        {(m.status === "approved" || m.status === "published") && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => handleSuspendMandal(m.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-amber-600/30 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-600/50 cursor-pointer"
                            title="Suspend Website"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        )}

                        {/* Activate / Unsuspend Mandal Option */}
                        {m.status === "suspended" && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => handleActivateMandal(m.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-600/30 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-600/50 cursor-pointer"
                            title="Activate Website"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </button>
                        )}

                        {/* Reject button */}
                        {m.status === "pending" && (
                          <button
                            type="button"
                            suppressHydrationWarning
                            onClick={() => setRejectReasonModal({ id: m.id, mandalName: m.mandalName })}
                            className="rounded-xl bg-rose-600/30 border border-rose-500/40 p-1 text-rose-300 hover:bg-rose-600/50 cursor-pointer"
                            title="Reject Request"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Permanently Delete Button */}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => setDeleteConfirmModal({ id: m.id, mandalName: m.mandalName })}
                          className="rounded-xl bg-rose-950/80 border border-rose-500/40 p-1 text-rose-400 hover:bg-rose-900 cursor-pointer"
                          title="Permanently Delete Mandal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === "donations" && (
          <DonationsPanel
            isPlatformAdmin={session.role === "PLATFORM_ADMIN"}
            mandalId={session.role === "MANDAL_ADMIN" ? session.mandalId || undefined : undefined}
          />
        )}

        {/* CREDENTIALS MANAGEMENT PANEL TAB */}
        {session.role === "PLATFORM_ADMIN" && activeTab === "credentials" && <CredentialsPanel />}

        {/* MANDAL CONTENT EDITOR (FULL EDIT FOR SUPER ADMIN OR MANDAL ADMIN) */}
        {activeTab === "edit_mandal" && editingMandal && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--admin-gold)]">
                  Full Super Admin Edit Access
                </span>
                <h2 className="font-display text-2xl font-bold text-[var(--admin-gold-light)]">
                  Editing: {editingMandal.mandalName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingMandal(null);
                  setActiveTab("submissions");
                }}
                className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-white/10 cursor-pointer"
              >
                ← Back to Submissions List
              </button>
            </div>

            <MandalContentEditor mandal={editingMandal} activeTab="all" isSuperAdmin={true} />

            <VersionHistoryPanel mandalId={editingMandal.id} />
          </div>
        )}

        {/* MANDAL ADMIN CONTENT EDITOR */}
        {selectedMandal &&
          activeTab !== "edit_mandal" &&
          activeTab !== "credentials" &&
          activeTab !== "submissions" &&
          activeTab !== "dashboard" &&
          activeTab !== "mandals" &&
          activeTab !== "donations" && (
            <MandalContentEditor
              mandal={selectedMandal}
              activeTab={activeTab}
              isSuperAdmin={session.role === "PLATFORM_ADMIN"}
            />
          )}
      </main>

      {/* 1. APPROVAL & SLUG ASSIGNMENT MODAL (Super Admin Only) */}
      {approvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-lg font-bold text-[var(--admin-gold-light)] flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <span>Assign Slug & Approve Website</span>
              </h2>
              <button
                type="button"
                onClick={() => setApprovalModal(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[var(--admin-text-soft)] space-y-2 text-left">
              <p>
                <strong>मंडळाचे नाव:</strong> {approvalModal.mandalName}
              </p>
              <p>
                <strong>ईमेल (User Login):</strong> {approvalModal.email}
              </p>
              <p>
                <strong>WhatsApp Number:</strong> {approvalModal.whatsapp}
              </p>
            </div>

            <div className="text-left space-y-1.5">
              <label className="block text-xs font-bold text-[var(--admin-gold-light)]">
                वेबसाईट स्लग प्रविष्ट करा (Website Slug Input) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  placeholder="उदा. jay-shankar-ganesh-mandal"
                  className="w-full rounded-2xl border border-white/20 bg-black/60 px-4 py-3 text-sm text-white outline-none focus:border-[var(--admin-gold)] font-mono"
                />
              </div>

              {/* Real-time Slug Status Message */}
              {slugStatus.checking ? (
                <p className="text-[11px] text-amber-300 font-bold">तपासत आहे (Checking database...)...</p>
              ) : slugStatus.message ? (
                <p
                  className={`text-[11px] font-bold ${
                    slugStatus.available ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {slugStatus.message}
                </p>
              ) : null}

              <p className="text-[11px] text-[var(--admin-text-muted)]">
                Live URL: <span className="text-amber-300 font-mono">{typeof window !== "undefined" ? window.location.origin : ""}/{slugify(customSlug || "mandal")}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setApprovalModal(null)}
                className="rounded-2xl border border-white/20 bg-black/40 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                disabled={slugStatus.available === false || slugStatus.checking}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 disabled:opacity-40 cursor-pointer"
              >
                Approve & Generate Login →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GENERATED CREDENTIALS & WHATSAPP NOTIFICATION MODAL */}
      {generatedCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-2xl">
              <KeyRound className="w-7 h-7" />
            </div>

            <h2 className="font-display text-xl font-bold text-[var(--admin-gold-light)]">
              Mandal Approved & Credentials Generated! 🚩
            </h2>
            <p className="text-xs text-[var(--admin-text-soft)]">
              {generatedCredsModal.mandalName} साठी वेबसाईट लाइव्ह झाली आहे व मंडळ ॲडमिन खाते तयार झाले आहे.
            </p>

            <div className="rounded-2xl border border-[var(--admin-border)] bg-black/60 p-4 text-left font-mono text-xs space-y-2 select-all">
              <div>
                <span className="text-[var(--admin-gold)]">🌐 Website URL:</span>{" "}
                <span className="text-emerald-300 font-bold">{typeof window !== "undefined" ? window.location.origin : ""}/{generatedCredsModal.slug}</span>
              </div>
              <div>
                <span className="text-[var(--admin-gold)]">👤 Username:</span>{" "}
                <span className="text-white font-bold">{generatedCredsModal.username}</span>
              </div>
              <div>
                <span className="text-[var(--admin-gold)]">🔐 Password:</span>{" "}
                <span className="text-emerald-300 font-bold">{generatedCredsModal.tempPassword}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyGenerated}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-border-gold)] py-3 text-xs font-bold text-[var(--admin-gold-light)] hover:bg-[var(--admin-gold)] hover:text-[var(--admin-bg)] transition-all cursor-pointer"
              >
                {copiedCreds ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCreds ? "कॉपी झाले!" : "लॉगिन संदेश कॉपी करा"}</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsAppNotification}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-extrabold text-white shadow-lg transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp द्वारे पाठवा (WhatsApp Customer)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setGeneratedCredsModal(null)}
              className="mt-2 text-xs font-bold text-gray-400 hover:underline cursor-pointer"
            >
              खिडकी बंद करा (Close Window)
            </button>
          </div>
        </div>
      )}

      {/* REJECT REASON MODAL */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-[var(--admin-card)] p-6 shadow-2xl text-center space-y-4">
            <h3 className="font-display text-lg font-bold text-rose-300">
              Reject Request: {rejectReasonModal.mandalName}
            </h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason for customer..."
              className="w-full rounded-2xl border border-rose-500/30 bg-black/60 p-3 text-xs text-white outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectReasonModal(null)}
                className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/50 bg-[var(--admin-card)] p-6 shadow-2xl text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="font-display text-lg font-bold text-rose-300">
              मंडळ कायमस्वरूपी डिलीट करा? (Permanently Delete)
            </h3>
            <p className="text-xs text-[var(--admin-text-soft)] leading-relaxed">
              <strong>{deleteConfirmModal.mandalName}</strong> ची सर्व माहिती (Credentials, Photos, Timeline, Payments, Donations) कायमस्वरूपी डिलीट केली जाईल. हा बदल पूर्ववत करता येणार नाही.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmModal(null)}
                className="rounded-xl border border-white/20 bg-black/40 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 cursor-pointer"
              >
                रद्द करा (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg cursor-pointer"
              >
                होय, कायमस्वरूपी डिलीट करा
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CREATE MANDAL MODAL */}
      {isModalOpen && <CreateMandalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
