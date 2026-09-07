"use client";

import { useState, useEffect } from "react";
import {
  FullMandalData,
  updateMandalAction,
  updateMandalThemeAction,
  addTimelineEventAction,
  deleteTimelineEventAction,
  addGalleryItemAction,
  deleteGalleryItemAction,
  updateGalleryItemCaptionAction,
  addCommitteeMemberAction,
  deleteCommitteeMemberAction,
} from "@/lib/mandal-actions";
import {
  Save,
  Plus,
  Trash2,
  Globe,
  Music,
  Video,
  Image as ImageIcon,
  Users,
  Calendar,
  MapPin,
  Palette,
  FileText,
  UserCheck,
  BarChart3,
  Sparkles,
  ExternalLink,
  Flower2,
  Heart,
  QrCode,
  ShieldCheck,
  Upload,
  Lock,
  Printer,
  Check,
} from "lucide-react";
import PdfInvitationCard from "@/components/PdfInvitationCard";

interface MandalContentEditorProps {
  mandal: FullMandalData;
  activeTab: string;
  isSuperAdmin?: boolean;
}

export default function MandalContentEditor({ mandal, activeTab, isSuperAdmin = false }: MandalContentEditorProps) {
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>(
    activeTab === "edit_mandal" || activeTab === "all" ? "all" : activeTab
  );

  useEffect(() => {
    if (activeTab === "edit_mandal" || activeTab === "all") {
      setCurrentTab("all");
    } else {
      setCurrentTab(activeTab);
    }
  }, [activeTab]);

  // Form State
  const [mandalName, setMandalName] = useState(mandal.mandalName || "");
  const [mandalType, setMandalType] = useState(mandal.mandalType || "Public Mandal");
  const [subtitle, setSubtitle] = useState(mandal.subtitle || "");
  const [establishedYear, setEstablishedYear] = useState(mandal.establishedYear || "");
  const [inviteMessage, setInviteMessage] = useState(mandal.inviteMessage || "");
  const [themeId, setThemeId] = useState(mandal.themeId || "royal_gold");

  // Contact & Address State
  const [contactPersonName, setContactPersonName] = useState(mandal.contactPersonName || "");
  const [contact, setContact] = useState(mandal.contact || "");
  const [mobileNumber, setMobileNumber] = useState(mandal.mobileNumber || mandal.contact || "");
  const [whatsappNumber, setWhatsappNumber] = useState(mandal.whatsappNumber || "");
  const [email, setEmail] = useState(mandal.email || "");
  const [address, setAddress] = useState(mandal.address || "");
  const [city, setCity] = useState(mandal.city || "");
  const [district, setDistrict] = useState(mandal.district || "");
  const [stateName, setStateName] = useState(mandal.state || "Maharashtra");
  const [pincode, setPincode] = useState(mandal.pincode || "");

  // Location & Social Links State
  const [mapEmbedUrl, setMapEmbedUrl] = useState(mandal.mapEmbedUrl || "");
  const [mapsLink, setMapsLink] = useState(mandal.mapsLink || "");
  const [instagramUrl, setInstagramUrl] = useState(mandal.instagramUrl || "");
  const [facebookUrl, setFacebookUrl] = useState(mandal.facebookUrl || "");
  const [youtubeUrl, setYoutubeUrl] = useState(mandal.youtubeUrl || "");
  const [websiteUrl, setWebsiteUrl] = useState(mandal.websiteUrl || "");

  // Media & Decoration State
  const [musicUrl, setMusicUrl] = useState(mandal.musicUrl || "");
  const [heroVideoUrl, setHeroVideoUrl] = useState(mandal.heroVideoUrl || "");
  const [heroBgUrl, setHeroBgUrl] = useState(mandal.heroBgUrl || "");
  const [pdfCardImageUrl, setPdfCardImageUrl] = useState(mandal.pdfCardImageUrl || "");
  const [teamPhotoUrl, setTeamPhotoUrl] = useState(mandal.teamPhotoUrl || "");
  const [committeeName, setCommitteeName] = useState(mandal.committeeName || "");
  const [committeeDescription, setCommitteeDescription] = useState(mandal.committeeDescription || "");
  const [footerText, setFooterText] = useState(mandal.footerText || "");

  // Payment & Donation Settings State
  const [upiId, setUpiId] = useState(mandal.upiId || "");
  const [accountHolder, setAccountHolder] = useState(mandal.accountHolder || "");
  const [qrCodeUrl, setQrCodeUrl] = useState(mandal.qrCodeUrl || "");
  const [supportMobile, setSupportMobile] = useState(mandal.supportMobile || "");
  const [donationMessage, setDonationMessage] = useState(mandal.donationMessage || "");
  const [donationAmountOptions, setDonationAmountOptions] = useState(
    mandal.donationAmountOptions || "101,251,501,1001,2100"
  );

  // Sub-items forms
  const [newTimeline, setNewTimeline] = useState({ title: "", eventDate: "", eventTime: "", description: "" });
  const [newGallery, setNewGallery] = useState({ url: "", caption: "" });
  const [newMember, setNewMember] = useState({ name: "", position: "", phone: "", instagramUrl: "", photoUrl: "" });

  // Device File Upload Handler (Images & Videos)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void, isVideo = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`कृपया ${isVideo ? "५० MB" : "५ MB"} पेक्षा लहान साईझ असलेली फाईल निवडा.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        callback(evt.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGeneral = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateMandalAction(mandal.id, {
        mandalName,
        mandalType,
        subtitle,
        establishedYear,
        inviteMessage,
        ...(isSuperAdmin ? { themeId } : {}),
        contactPersonName,
        contact: mobileNumber || contact,
        mobileNumber,
        whatsappNumber,
        email,
        address,
        city,
        district,
        state: stateName,
        pincode,
        mapEmbedUrl,
        mapsLink,
        instagramUrl,
        facebookUrl,
        youtubeUrl,
        websiteUrl,
        musicUrl,
        heroVideoUrl,
        heroBgUrl,
        pdfCardImageUrl,
        teamPhotoUrl,
        committeeName,
        committeeDescription,
        footerText,
        upiId,
        accountHolder,
        qrCodeUrl,
        supportMobile,
        donationMessage,
        donationAmountOptions,
      });
      setMsg("माहिती यशस्वीरित्या सेव्ह झाली (Saved Successfully)! वेबसाईटवर बदल तात्काळ अपडेट झाले आहेत.");
      setTimeout(() => setMsg(null), 3500);
    } catch (err: any) {
      setMsg("Error saving: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimeline.title) return;
    try {
      await addTimelineEventAction(mandal.id, newTimeline);
      setNewTimeline({ title: "", eventDate: "", eventTime: "", description: "" });
      setMsg("नवीन कार्यक्रम जोडला (Timeline event added)!");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error adding event: " + err?.message);
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.url) return;
    try {
      await addGalleryItemAction(mandal.id, newGallery);
      setNewGallery({ url: "", caption: "" });
      setMsg("गॅलरी फोटो जोडला (Gallery photo added)!");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error adding photo: " + err?.message);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name) return;
    try {
      await addCommitteeMemberAction(mandal.id, newMember);
      setNewMember({ name: "", position: "", phone: "", instagramUrl: "", photoUrl: "" });
      setMsg("समिती सदस्य जोडला (Committee member added)!");
      setTimeout(() => setMsg(null), 3000);
    } catch (err: any) {
      setMsg("Error adding member: " + err?.message);
    }
  };

  // Helper Save Button
  const SaveButton = () => (
    <button
      type="button"
      suppressHydrationWarning
      disabled={saving}
      onClick={() => handleSaveGeneral()}
      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 text-[var(--admin-bg)] font-bold text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
    >
      <Save className="w-3.5 h-3.5" />
      <span>{saving ? "सेव्ह होत आहे..." : "बदल सेव्ह करा (Save Changes)"}</span>
    </button>
  );

  return (
    <div className="space-y-6 text-[var(--admin-text)]">
      {/* Toast Notification */}
      {msg && (
        <div className="rounded-xl bg-[var(--admin-border-gold)] border border-[var(--admin-border)] p-3 text-xs font-bold text-[var(--admin-gold-light)] flex items-center justify-between">
          <span>{msg}</span>
          <button type="button" suppressHydrationWarning onClick={() => setMsg(null)} className="text-white/60 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[var(--admin-border)] no-scrollbar">
        {[
          { id: "all", label: "🌟 सर्व विभाग (All Sections)" },
          { id: "hero", label: "🎬 Hero Video & Card" },
          { id: "invitation", label: "📜 निमंत्रण संदेश" },
          { id: "pdf_card", label: "📄 छापील PDF कार्ड" },
          { id: "committee", label: "👥 समिती सदस्य" },
          { id: "settings", label: "💳 UPI व देणगी" },
          { id: "gallery", label: "🖼️ गॅलरी फोटो" },
          { id: "timeline", label: "📅 वेळापत्रक" },
          { id: "music", label: "🎵 भक्ती संगीत" },
          { id: "map", label: "📍 पत्ता व मॅप" },
          { id: "theme", label: isSuperAdmin ? "🎨 थीम (Theme)" : "🔒 थीम (Locked)" },
          { id: "profile", label: "👤 संपर्क" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            suppressHydrationWarning
            onClick={() => setCurrentTab(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === t.id
                ? "bg-gradient-to-r from-[var(--admin-gold)] to-[var(--admin-gold)]/80 text-[var(--admin-bg)] shadow-lg scale-105"
                : "bg-black/40 text-amber-200/80 hover:bg-white/10 border border-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. HERO & VIDEO TAB */}
      {(currentTab === "all" || currentTab === "hero" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-400" />
              <span>Hero Background Video, Cover Photo & Printable PDF Card</span>
            </h3>
            {isSuperAdmin && <SaveButton />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hero Background Video */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[var(--admin-gold-light)] font-medium">Hero Background Video URL (.mp4)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-950/40 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपलोड (.mp4)</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setHeroVideoUrl(base64), true)}
                    />
                  </label>
                )}
                <input
                  type="text"
                  suppressHydrationWarning
                  value={heroVideoUrl}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setHeroVideoUrl(e.target.value)}
                  placeholder="/video/bg-video-mobile.mp4 or Cloudinary URL"
                  className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none ${
                    !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                  }`}
                />
              </div>
              {heroVideoUrl && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] text-amber-300 font-bold">व्हिडिओ प्रिव्ह्यू:</span>
                  <video src={heroVideoUrl} controls className="h-12 w-20 object-cover rounded-lg border border-amber-400/40 bg-black" />
                </div>
              )}
            </div>

            {/* Hero Cover Background Image */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[var(--admin-gold-light)] font-medium">Hero Cover Background Image URL</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-950/40 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपलोड फोटो</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setHeroBgUrl(base64))}
                    />
                  </label>
                )}
                <input
                  type="text"
                  suppressHydrationWarning
                  value={heroBgUrl}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setHeroBgUrl(e.target.value)}
                  placeholder="/images/backgrounds/hero-background-desktop.webp"
                  className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none ${
                    !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                  }`}
                />
              </div>
              {heroBgUrl && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] text-amber-300 font-bold">फोटो प्रिव्ह्यू:</span>
                  <img src={heroBgUrl} alt="Hero Cover" className="h-12 w-20 object-cover rounded-lg border border-amber-400/40" />
                </div>
              )}
            </div>

            {/* Printable PDF Invitation Card */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[var(--admin-gold-light)] font-medium">Printable PDF Invitation Card Image URL</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-950/40 px-2.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपलोड फोटो</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setPdfCardImageUrl(base64))}
                    />
                  </label>
                )}
                <input
                  type="text"
                  suppressHydrationWarning
                  value={pdfCardImageUrl}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setPdfCardImageUrl(e.target.value)}
                  placeholder="/images/ganapati/ganapati-murti.png"
                  className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none ${
                    !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                  }`}
                />
              </div>
              {pdfCardImageUrl && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] text-amber-300 font-bold">कार्ड प्रिव्ह्यू:</span>
                  <img src={pdfCardImageUrl} alt="PDF Card" className="h-12 w-12 object-contain rounded-lg border border-amber-400/40 bg-black p-0.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. INVITATION TEXT TAB */}
      {(currentTab === "all" || currentTab === "invitation" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Invitation Header, Message & Mandal Titles</span>
            </h3>
            <SaveButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">मंडळाचे अधिकृत नाव (Mandal Name) *</label>
              <input
                type="text"
                suppressHydrationWarning
                value={mandalName}
                onChange={(e) => setMandalName(e.target.value)}
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">स्थापना वर्ष (Established Year)</label>
              <input
                type="text"
                suppressHydrationWarning
                value={establishedYear}
                onChange={(e) => setEstablishedYear(e.target.value)}
                placeholder="उदा. २००१ / १९८५"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">उपशीर्षक / टॅगलाईन (Subtitle)</label>
              <input
                type="text"
                suppressHydrationWarning
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="उदा. सुवर्ण महोत्सवी गणेशोत्सव सोहळा"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">सस्नेह निमंत्रण संदेश (Invitation Message) *</label>
            <textarea
              rows={4}
              suppressHydrationWarning
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="आमच्या मंडळाच्या श्री गणेशोत्सवास सर्व भाविक भक्तांना सस्नेह निमंत्रण..."
              className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-[var(--admin-gold-light)] font-medium mb-1">फुटर टीप संदेश (Footer Custom Text)</label>
            <input
              type="text"
              suppressHydrationWarning
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              placeholder="उदा. विनीत: समस्त जय शंकर गणेशोत्सव मंडळ कार्यकर्ते"
              className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 2.5 PRINTABLE PDF CARD MANAGER TAB (FOR MANDAL ADMIN & SUPER ADMIN) */}
      {(currentTab === "all" || currentTab === "pdf_card" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Printable PDF Invitation Card Manager & Idol Photo Upload</span>
            </h3>
            <SaveButton />
          </div>

          {/* Mandatory Image Upload Guidelines Banner */}
          <div className="rounded-2xl border border-amber-500/40 bg-amber-950/50 p-4 space-y-2.5 text-amber-200">
            <div className="font-bold text-amber-300 flex items-center gap-2 text-xs sm:text-sm">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>श्री गणपती मूर्ती फोटो अपलोड सूचना (Mandatory Photo Upload Instructions):</span>
            </div>
            <ul className="text-xs leading-relaxed space-y-1.5 list-disc list-inside text-amber-100/90 font-medium">
              <li>
                <strong>बॅकग्राऊंड काढलेला असावा (Background Removed / Transparent PNG):</strong> अपलोड करावयाच्या फोटोचा बॅकग्राऊंड (Background) पूर्णपणे काढलेला असावा.
              </li>
              <li>
                <strong>फक्त श्री गणपतीची मूर्ती (Only Ganapati Murti Image):</strong> फोटोमध्ये केवळ श्री गणेशाची मूर्ती असावी. मागे कोणतेही इतर बॅकग्राऊंड, भिंत किंवा मंडप नसावा.
              </li>
              <li>
                <strong>फायदा:</strong> बॅकग्राऊंड नसलेल्या फोटोमुळे निमंत्रण पत्रिकेच्या छापील PDF वर श्रींची मूर्ती अत्यंत आकर्षक, सुबक आणि स्पष्ट दिसेल.
              </li>
            </ul>
          </div>

          {/* Upload Control Block */}
          <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-3">
            <label className="block text-[var(--admin-gold-light)] font-bold text-xs">
              श्री गणपती मूर्ती फोटो (Ganapati Idol Image for PDF Invitation Card)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2 flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap shadow-md">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>फोटो अपलोड करा (Upload Murti Photo)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (base64) => setPdfCardImageUrl(base64))}
                  />
                </label>
                <input
                  type="text"
                  suppressHydrationWarning
                  value={pdfCardImageUrl}
                  onChange={(e) => setPdfCardImageUrl(e.target.value)}
                  placeholder="/images/ganapati/ganapati-murti.png or Image URL"
                  className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
                />
              </div>

              {pdfCardImageUrl ? (
                <div className="flex items-center gap-2 bg-black/50 p-2 rounded-xl border border-amber-400/30">
                  <img
                    src={pdfCardImageUrl}
                    alt="PDF Card Murti"
                    className="h-12 w-12 object-contain rounded-lg border border-amber-400/40 bg-black p-0.5"
                  />
                  <div className="text-[10px] text-amber-200">
                    <div className="font-bold text-amber-300">अपलोड झालेला फोटो</div>
                    <div>(PDF कार्डवर दिसेल)</div>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-amber-200/60 italic">
                  डिफॉल्ट श्री गणपती मूर्ती फोटो वापरात आहे
                </div>
              )}
            </div>
          </div>

          {/* Interactive Live PDF Printable Card Component */}
          <div className="pt-2">
            <div className="font-bold text-xs text-[var(--admin-gold-light)] mb-2 flex items-center justify-between">
              <span>छापील PDF निमंत्रण पत्रिका प्रिव्ह्यू व प्रिंट/शेअर पर्याय (Live PDF Card Preview & Print):</span>
              <span className="text-[10px] text-amber-200/70">खालील बटणावर क्लिक करून डायरेक्ट PDF प्रिंट व डाउनलोड करा</span>
            </div>
            <PdfInvitationCard
              mandalName={mandalName}
              message={inviteMessage}
              address={address}
              contact={mobileNumber || contact}
              pdfCardImageUrl={pdfCardImageUrl}
            />
          </div>
        </div>
      )}

      {/* 3. GALLERY & MEDIA TAB */}
      {(currentTab === "all" || currentTab === "gallery" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Photo & Video Gallery Manager (Add, Edit Captions & Delete)</span>
            </h3>
          </div>

          <form onSubmit={handleAddGallery} className="space-y-3 bg-black/30 p-4 rounded-2xl border border-white/10">
            <div className="font-bold text-xs text-[var(--admin-gold-light)] flex items-center justify-between">
              <span>नवीन गॅलरी फोटो जोडा (Add Gallery Photo)</span>
              <span className="text-[10px] text-amber-200/70">आपल्या मोबाईल / संगणकावरून फोटो निवडून डायरेक्ट अपलोड करा</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>फोटो निवडा (Upload Device Photo)</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (base64) => setNewGallery({ ...newGallery, url: base64 }))}
                  />
                </label>
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  placeholder="किंवा फोटो URL टाईप करा"
                  value={newGallery.url}
                  onChange={(e) => setNewGallery({ ...newGallery, url: e.target.value })}
                  className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                />
              </div>

              <input
                type="text"
                suppressHydrationWarning
                placeholder="फोटोचे नाव / कॅप्शन (उदा. आगमन सोहळा २०२५)"
                value={newGallery.caption}
                onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {newGallery.url ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-300 font-bold">फोटो प्रिव्ह्यू:</span>
                  <img src={newGallery.url} alt="Preview" className="w-12 h-10 object-cover rounded-lg border border-amber-400" />
                </div>
              ) : <div />}

              <button
                type="submit"
                className="rounded-xl bg-[var(--admin-gold)] text-[var(--admin-bg)] font-bold py-2 px-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-105 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>नवीन फोटो गॅलरीत जोडा</span>
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {mandal.gallery.map((g) => (
              <div key={g.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/50 p-2 space-y-1">
                <img src={g.url} alt={g.caption || ""} className="w-full h-24 object-cover rounded-lg" />
                <input
                  type="text"
                  defaultValue={g.caption || ""}
                  onBlur={async (e) => {
                    if (e.target.value !== (g.caption || "")) {
                      await updateGalleryItemCaptionAction(g.id, mandal.id, e.target.value);
                      setMsg("फोटोचे नाव बदलले!");
                      setTimeout(() => setMsg(null), 3000);
                    }
                  }}
                  placeholder="फोटोचे नाव / कॅप्शन"
                  className="w-full rounded-lg border border-white/15 bg-black/60 px-2 py-1 text-[11px] text-[var(--admin-text)] outline-none focus:border-[var(--admin-gold)]"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await deleteGalleryItemAction(g.id, mandal.id);
                    setMsg("Photo deleted");
                  }}
                  className="absolute top-2 right-2 bg-red-950/80 text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TIMELINE SCHEDULE TAB */}
      {(currentTab === "all" || currentTab === "timeline" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>10-Day Festival Timeline Schedule</span>
            </h3>
          </div>

          <form onSubmit={handleAddTimeline} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/30 p-4 rounded-2xl border border-white/10">
            <input
              type="text"
              required
              suppressHydrationWarning
              placeholder="Event Title (उदा. महाआरती सोहळा)"
              value={newTimeline.title}
              onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
              className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
            />
            <input
              type="text"
              suppressHydrationWarning
              placeholder="Date (उदा. दिवस १ - ७ सप्टें)"
              value={newTimeline.eventDate}
              onChange={(e) => setNewTimeline({ ...newTimeline, eventDate: e.target.value })}
              className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
            />
            <input
              type="text"
              suppressHydrationWarning
              placeholder="Time (उदा. सकाळी ९:०० वा.)"
              value={newTimeline.eventTime}
              onChange={(e) => setNewTimeline({ ...newTimeline, eventTime: e.target.value })}
              className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
            />
            <button
              type="submit"
              suppressHydrationWarning
              className="rounded-xl bg-[var(--admin-gold)] text-[var(--admin-bg)] font-bold py-2 px-4 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </form>

          <div className="space-y-2">
            {mandal.timeline.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                <div>
                  <h4 className="font-bold text-[var(--admin-gold-light)]">{ev.title}</h4>
                  <p className="text-[11px] text-[var(--admin-text-soft)]">
                    {ev.eventDate} • {ev.eventTime}
                  </p>
                </div>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={async () => {
                    await deleteTimelineEventAction(ev.id, mandal.id);
                    setMsg("Event deleted");
                  }}
                  className="text-red-400 p-1 hover:bg-red-950/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COMMITTEE & MEMBERS TAB */}
      {(currentTab === "all" || currentTab === "committee" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Committee Members Manager & Group Photo</span>
            </h3>
            {isSuperAdmin && <SaveButton />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-black/30 p-4 rounded-2xl border border-white/10">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">समितीचे नाव (Committee Title)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                suppressHydrationWarning
                value={committeeName}
                disabled={!isSuperAdmin}
                onChange={(e) => setCommitteeName(e.target.value)}
                placeholder="उदा. उत्सव कार्यकारी समिती २०२५"
                className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] ${
                  !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                }`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">टीम ग्रुप फोटो (Team Group Photo URL)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-950/40 px-2 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपलोड</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setTeamPhotoUrl(base64))}
                    />
                  </label>
                )}
                <input
                  type="text"
                  suppressHydrationWarning
                  value={teamPhotoUrl}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setTeamPhotoUrl(e.target.value)}
                  placeholder="/images/team/group-photo.webp"
                  className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] ${
                    !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                  }`}
                />
              </div>
              {teamPhotoUrl && (
                <div className="mt-1">
                  <img src={teamPhotoUrl} alt="Team Group" className="w-20 h-10 object-cover rounded-lg border border-amber-400/40" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">समिती वर्णन (Committee Description)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                suppressHydrationWarning
                value={committeeDescription}
                disabled={!isSuperAdmin}
                onChange={(e) => setCommitteeDescription(e.target.value)}
                placeholder="उदा. गणेशोत्सवाचे नेटके नियोजन करणारी ध्येयवादी समिती"
                className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] ${
                  !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                }`}
              />
            </div>
          </div>

          {/* Add Committee Member Form */}
          {!isSuperAdmin ? (
            <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-300">
              <span className="flex items-center gap-2 font-medium">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>समिती सदस्यांची माहिती व ग्रुप फोटो केवळ सुपर ॲडमिन (Super Admin Only) बदलू शकतात. (View Only)</span>
              </span>
            </div>
          ) : (
            <form onSubmit={handleAddMember} className="space-y-3 bg-black/30 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-xs text-[var(--admin-gold-light)] flex items-center justify-between">
                <span>नवीन समिती सदस्य जोडा (Add Committee Member)</span>
                <span className="text-[10px] text-amber-200/70">नाव, पद, फोन नंबर, फोटो आणि इन्स्टाग्राम लिंक जोडा</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  placeholder="सदस्याचे नाव (उदा. आनंदराव पाटील) *"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                />
                <input
                  type="text"
                  required
                  suppressHydrationWarning
                  placeholder="पद (उदा. अध्यक्ष / कार्याध्यक्ष / खजिनदार) *"
                  value={newMember.position}
                  onChange={(e) => setNewMember({ ...newMember, position: e.target.value })}
                  className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                />
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="मोबाईल / फोन नंबर"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                />
                <input
                  type="text"
                  suppressHydrationWarning
                  placeholder="Instagram प्रोफाईल लिंक (उदा. https://instagram.com/user)"
                  value={newMember.instagramUrl}
                  onChange={(e) => setNewMember({ ...newMember, instagramUrl: e.target.value })}
                  className="rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>सदस्याचा फोटो निवडा (Upload Photo)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setNewMember({ ...newMember, photoUrl: base64 }))}
                    />
                  </label>
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="किंवा फोटो URL टाईप करा"
                    value={newMember.photoUrl}
                    onChange={(e) => setNewMember({ ...newMember, photoUrl: e.target.value })}
                    className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
                  />
                </div>

                <button
                  type="submit"
                  suppressHydrationWarning
                  className="rounded-xl bg-[var(--admin-gold)] text-[var(--admin-bg)] font-bold py-2 px-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-105 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>सदस्य जोडा (Add Member)</span>
                </button>
              </div>

              {newMember.photoUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-amber-300 font-bold">फोटो प्रिव्ह्यू:</span>
                  <img src={newMember.photoUrl} alt="Member Preview" className="w-10 h-10 object-cover rounded-full border border-amber-400" />
                </div>
              )}
            </form>
          )}

          {/* Member List Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {mandal.committee.map((c) => (
              <div key={c.id} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10 gap-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={c.photoUrl || "/images/family/person-1.webp"}
                    alt={c.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-400/50 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-[var(--admin-gold-light)] truncate">{c.name}</h4>
                    <p className="text-[11px] text-[var(--admin-text-soft)] font-medium">{c.position}</p>
                    <div className="text-[10px] text-amber-200/70 flex items-center gap-2 flex-wrap">
                      {c.phone && <span>📞 {c.phone}</span>}
                      {c.instagramUrl && (
                        <a href={c.instagramUrl} target="_blank" rel="noreferrer" className="text-pink-400 underline">
                          Insta ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {isSuperAdmin && (
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteCommitteeMemberAction(c.id, mandal.id);
                      setMsg("Member deleted");
                    }}
                    className="text-red-400 p-1.5 hover:bg-red-950/40 rounded-xl cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. MUSIC & AUDIO TAB */}
      {(currentTab === "all" || currentTab === "music" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Background Devotional Music & Audio Track</span>
            </h3>
            <SaveButton />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">भक्ती संगीत / ऑडिओ लिंक (Music Track URL .mp3)</label>
              <input
                type="text"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="/audio/bhajan.mp3 or https://domain.com/aarti.mp3"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] focus:border-[var(--admin-gold)] focus:outline-none"
              />
            </div>

            {musicUrl && (
              <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center gap-3">
                <span className="text-xs text-amber-300 font-bold">Audio Test Player:</span>
                <audio controls src={musicUrl} className="h-8 flex-1" />
              </div>
            )}

            <div className="p-3 rounded-2xl bg-black/30 border border-white/10 space-y-1">
              <span className="text-amber-300 font-bold">Preset Audio Options:</span>
              <div className="flex gap-2 flex-wrap">
                {[
                  { name: "गजानना श्री गणराया (Bhajan)", url: "/audio/bhajan.mp3" },
                  { name: "सुखकर्ता दुखहर्त्ता (Aarti)", url: "/audio/aarti.mp3" },
                  { name: "ओम गं गणपतये नमः (Chant)", url: "/audio/welcome-chant.mp3" },
                ].map((ps) => (
                  <button
                    key={ps.url}
                    type="button"
                    onClick={() => setMusicUrl(ps.url)}
                    className="rounded-xl border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-500/20 cursor-pointer"
                  >
                    + {ps.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MAP & CONTACT TAB */}
      {(currentTab === "all" || currentTab === "map" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Google Maps Embed, Full Address & Contact Info</span>
            </h3>
            <SaveButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">पत्ता (Full Address) *</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="उदा. शंकर नगर, गिरगाव चौक, मुंबई"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">शहर (City)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="उदा. मुंबई / पुणे"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">जिल्हा (District)</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="उदा. मुंबई शहर"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Google Maps Embed URL (iframe embed link)</label>
              <input
                type="text"
                value={mapEmbedUrl}
                onChange={(e) => setMapEmbedUrl(e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Google Maps Direct Share Link</label>
              <input
                type="text"
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                placeholder="https://maps.google.com/?q=Girgaon+Chowk"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Instagram Profile URL</label>
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/mandal_name"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">Facebook Page URL</label>
              <input
                type="text"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/mandal_name"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">YouTube Channel URL</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/@mandal_name"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. THEME SELECTOR TAB */}
      {(currentTab === "all" || currentTab === "theme" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span>वेबसाईट थीम (Website Theme)</span>
            </h3>
            {isSuperAdmin ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>सुपर ॲडमिन अधिकार (Super Admin Access) — थीम बदलू शकता</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/80 border border-amber-500/40 px-3 py-1 text-[11px] font-bold text-amber-400">
                <Lock className="w-3.5 h-3.5" />
                <span>थीम निवड लॉक आहे (Locked for Mandal Admin)</span>
              </span>
            )}
          </div>

          {!isSuperAdmin && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 text-xs text-amber-200/90 flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-300">
                  थीम बदल फक्त सुपर ॲडमिनद्वारेच शक्य (Theme can only be changed by Super Admin)
                </p>
                <p className="text-[11px] text-amber-200/70 leading-relaxed">
                  नोंदणीच्या वेळी तुम्ही निवडलेली थीम निश्चित करण्यात आली आहे. सुरक्षेसाठी व डिझाईन स्थिरतेसाठी, फॉर्म सबमिट झाल्यानंतर थीम बदलण्याचा अधिकार फक्त <strong>सुपर ॲडमिनला (Super Admin)</strong> आहे. मंडळाच्या ॲडमिनला थीम बदलता येत नाही. तुम्हाला थीम बदलायची असल्यास कृपया सुपर ॲडमिनशी संपर्क साधा.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "royal_gold", title: "Theme 1: Royal Gold", desc: "Classic Gold, Cream, Wood & Temple Pillars", bg: "from-amber-900 to-yellow-700" },
              { id: "peshwai", title: "Theme 2: Peshwai Heritage", desc: "Deep Maroon, Kesari, Wada Wooden Texture", bg: "from-red-950 to-orange-900" },
              { id: "divine_saffron", title: "Theme 3: Modern Premium", desc: "White, Saffron Gold, Glassmorphism", bg: "from-orange-900 to-amber-600" },
              { id: "night_darshan", title: "Theme 4: Night Darshan", desc: "Dark Blue, Floating Diyas, Golden Glow", bg: "from-slate-950 to-blue-900" },
            ].map((th) => {
              const isActive = themeId === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  disabled={!isSuperAdmin}
                  onClick={async () => {
                    if (!isSuperAdmin) return;
                    setThemeId(th.id);
                    try {
                      await updateMandalThemeAction(mandal.id, th.id);
                      setMsg(`Theme changed to ${th.title}!`);
                      setTimeout(() => setMsg(null), 3000);
                    } catch (err: any) {
                      setMsg("Error changing theme: " + err?.message);
                    }
                  }}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? "border-[var(--admin-gold)] bg-[var(--admin-border-gold)] ring-2 ring-[#e8a93b] shadow-lg"
                      : isSuperAdmin
                      ? "border-white/10 bg-black/40 hover:border-[var(--admin-border)] cursor-pointer"
                      : "border-white/5 bg-black/30 opacity-50 cursor-not-allowed"
                  }`}
                  title={!isSuperAdmin && !isActive ? "थीम बदल फक्त सुपर ॲडमिन करू शकतात" : undefined}
                >
                  <div className={`h-12 w-full rounded-xl bg-gradient-to-r ${th.bg} mb-3`} />
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[var(--admin-text)]">{th.title}</h4>
                    {!isSuperAdmin && !isActive && (
                      <Lock className="w-3.5 h-3.5 text-amber-400/60" />
                    )}
                  </div>
                  <p className="text-[11px] text-[var(--admin-text-soft)] mt-1">{th.desc}</p>
                  {isActive && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[var(--admin-gold)] px-2 py-0.5 text-[10px] font-bold text-[var(--admin-bg)]">
                      <Check className="w-3 h-3" />
                      <span>Active Theme</span>
                    </span>
                  )}
                  {!isSuperAdmin && !isActive && (
                    <span className="mt-2 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
                      Super Admin Only
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 9. ANALYTICS TAB */}
      {(currentTab === "all" || currentTab === "analytics" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2 pb-3 border-b border-[var(--admin-border)]">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Mandal Website Performance & Interaction Analytics</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-amber-500/30 bg-black/50">
              <div className="flex items-center justify-between text-amber-400">
                <span className="font-bold">एकूण पुष्प अर्पण (Flowers Offered)</span>
                <Flower2 className="w-5 h-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-amber-300">{mandal.flowerCount || 108}</p>
              <p className="text-[10px] text-white/60 mt-1">Interactive Flower Blessings Count</p>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-black/50">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="font-bold">एकूण गॅलरी फोटो (Total Photos)</span>
                <ImageIcon className="w-5 h-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-300">{mandal.gallery.length}</p>
              <p className="text-[10px] text-white/60 mt-1">Uploaded Media Gallery Items</p>
            </div>

            <div className="p-4 rounded-2xl border border-purple-500/30 bg-black/50">
              <div className="flex items-center justify-between text-purple-400">
                <span className="font-bold">वेबसाईट लिंक (Live Public URL)</span>
                <ExternalLink className="w-5 h-5" />
              </div>
              <a
                href={`/${mandal.slug}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-sm font-mono font-bold text-purple-300 hover:underline block truncate"
              >
                /{mandal.slug}
              </a>
              <p className="text-[10px] text-white/60 mt-1">Click to open live site</p>
            </div>
          </div>
        </div>
      )}

      {/* 10. PROFILE TAB */}
      {(currentTab === "all" || currentTab === "profile" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Mandal Admin Profile & Contact Info</span>
            </h3>
            <SaveButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">संपर्क व्यक्ती नाव (Contact Person Name) *</label>
              <input
                type="text"
                value={contactPersonName}
                onChange={(e) => setContactPersonName(e.target.value)}
                placeholder="उदा. आनंदराव पाटील"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">मोबाईल नंबर (Mobile Number) *</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="उदा. +91 98200 11223"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">WhatsApp नंबर (WhatsApp Number) *</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="उदा. +91 98200 11223"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">ईमेल आयडी (Email Address)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mandal@gmail.com"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
            <div>
              <label className="block text-[var(--admin-gold-light)] font-medium mb-1">सपोर्ट मोबाईल (Support Phone)</label>
              <input
                type="text"
                value={supportMobile}
                onChange={(e) => setSupportMobile(e.target.value)}
                placeholder="उदा. +91 98200 44556"
                className="w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 11. SETTINGS TAB (DONATION & ADVANCED) */}
      {(currentTab === "all" || currentTab === "settings" || currentTab === "dashboard") && (
        <div className="rounded-3xl border border-[var(--admin-border)] bg-black/40 p-6 backdrop-blur-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--admin-border)]">
            <h3 className="font-display font-bold text-base text-[var(--admin-gold-light)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>UPI Donation Settings, Payment Details & Amount Options</span>
            </h3>
            {isSuperAdmin && <SaveButton />}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">UPI ID (उदा. mandal@upi) *</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={upiId}
                disabled={!isSuperAdmin}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="8669233747@upi"
                className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] font-mono font-bold ${
                  !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                }`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">खातेदाराचे नाव (Account Holder Name)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <input
                type="text"
                value={accountHolder}
                disabled={!isSuperAdmin}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="उदा. जय शंकर गणेश मंडळ ट्रस्ट"
                className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] ${
                  !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                }`}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[var(--admin-gold-light)] font-medium">QR Code फोटो URL (QR Code Image URL)</label>
                {!isSuperAdmin && (
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>सुपर ॲडमिन (Super Admin Only)</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isSuperAdmin && (
                  <label className="cursor-pointer inline-flex items-center gap-1 rounded-xl border border-amber-500/40 bg-amber-950/40 px-2 py-2 text-xs font-bold text-amber-300 hover:bg-amber-900/60 transition-all whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>अपलोड</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (base64) => setQrCodeUrl(base64))}
                    />
                  </label>
                )}
                <input
                  type="text"
                  value={qrCodeUrl}
                  disabled={!isSuperAdmin}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  placeholder="/images/qr/mandal-qr.png"
                  className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] ${
                    !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
                  }`}
                />
              </div>
              {qrCodeUrl && (
                <div className="mt-1 flex items-center gap-2">
                  <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12 object-contain rounded-lg border border-amber-400/40 bg-white p-1" />
                  <span className="text-[10px] text-amber-200/70">मोजे/पाहण्यासाठी QR कोड उपलब्ध (View Only)</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[var(--admin-gold-light)] font-medium">देणगी पर्याय रकमा (Preset Amount Options CSV)</label>
              {!isSuperAdmin && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-500/40 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>सुपर ॲडमिन (Super Admin Only)</span>
                </span>
              )}
            </div>
            <input
              type="text"
              value={donationAmountOptions}
              disabled={!isSuperAdmin}
              onChange={(e) => setDonationAmountOptions(e.target.value)}
              placeholder="101,251,501,1001,2100"
              className={`w-full rounded-xl border border-[var(--admin-border)] bg-black/50 px-3 py-2 text-xs text-[var(--admin-text)] font-mono ${
                !isSuperAdmin ? "opacity-60 cursor-not-allowed bg-black/80" : ""
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
