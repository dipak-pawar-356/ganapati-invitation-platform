"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Copy,
  Check,
  QrCode,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Send,
  Lock,
  AlertCircle,
  Upload,
  Trash2,
  ExternalLink,
} from "lucide-react";
import CornerDecoration from "@/components/common/CornerDecoration";
import { submitDonationTransactionAction } from "@/lib/mandal-actions";

type DonationWidgetProps = {
  mandalId?: string;
  mandalName: string;
  upiId?: string;
  accountHolder?: string;
  qrCodeUrl?: string;
  contactPhone?: string;
};

const suggestedAmounts = [101, 251, 501, 1001, 2100];

export default function DonationWidget({
  mandalId,
  mandalName,
  upiId = "8669233747@upi",
  accountHolder = "गणपती उत्सव मंडळ ट्रस्ट",
  qrCodeUrl = "/images/decorations/mandala.png",
  contactPhone = "8669233747",
}: DonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(501);
  const [customAmount, setCustomAmount] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [error, setError] = useState("");

  const getActiveAmount = () => {
    if (selectedAmount === "custom") {
      return customAmount ? parseInt(customAmount, 10) || 0 : 0;
    }
    return selectedAmount;
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setScreenshotUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!donorName.trim()) {
      setError("कृपया आपले नाव प्रविष्ट करा.");
      return;
    }
    if (!donorPhone.trim()) {
      setError("कृपया WhatsApp नंबर प्रविष्ट करा.");
      return;
    }
    if (!utrNumber.trim()) {
      setError("कृपया UTR / Trans ID प्रविष्ट करा.");
      return;
    }
    const amount = getActiveAmount();
    if (!amount || amount <= 0) {
      setError("कृपया वैध देणगी रक्कम निवडा.");
      return;
    }

    setSubmitting(true);
    try {
      if (mandalId) {
        const res = await submitDonationTransactionAction({
          mandalId,
          donorName,
          donorWhatsapp: donorPhone,
          amount,
          utrNumber,
          screenshotUrl,
        });

        if (res && res.whatsappUrl) {
          setWhatsappUrl(res.whatsappUrl);
        }
      } else {
        // Fallback for preview mode without mandalId
        const todayDate = new Date().toLocaleDateString("mr-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const whatsappMessage = `🙏 *नवीन देणगी प्राप्त*

*मंडळ:*
${mandalName}

*देणगीदार:*
${donorName.trim()}

*मोबाईल:*
${donorPhone.trim()}

*रक्कम:*
₹${amount}

*UTR:*
${utrNumber.trim()}

*दिनांक:*
${todayDate}

कृपया पडताळणी करा.`;

        const cleanPhone = contactPhone.replace(/[^0-9]/g, "");
        const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
        setWhatsappUrl(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(whatsappMessage)}`);
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "देणगी सबमिट करताना एरर आली.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative mx-auto my-14 w-full max-w-4xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border-2 border-[var(--t-border)] bg-gradient-to-b from-[var(--t-bg-card)] via-[var(--t-bg)] to-[var(--t-bg-footer)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center">
        {/* Corner Engraved Motifs */}
        <CornerDecoration size={32} opacity={0.35} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        {/* Four Golden Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[var(--t-primary)]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[var(--t-primary)]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[var(--t-primary)]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[var(--t-primary)]" />

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--t-border)] bg-[var(--t-primary-badge)] px-4 py-1.5 text-xs font-extrabold text-[var(--t-primary-light)] mb-3 shadow-md">
          <Heart className="w-4 h-4 fill-current text-rose-500" />
          <span>ऑनलाईन वर्गणी व देणगी सोय (Online Donation)</span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-[var(--t-primary-light)]">
          {mandalName} वर्गणी सेवा 🚩
        </h2>

        <p className="mt-2 text-xs sm:text-sm text-[var(--t-text-soft)] max-w-xl mx-auto leading-relaxed">
          आपल्या सढळ हाताने गणपती बाप्पांच्या उत्सवासाठी वर्गणी व देणगी जमा करा आणि उत्सव अधिक दिव्य करा.
        </p>

        {/* Suggested Amount Selector */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {suggestedAmounts.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount("");
              }}
              suppressHydrationWarning
              className={`rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                selectedAmount === amt
                  ? "border-[var(--t-primary)] bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] shadow-lg scale-105"
                  : "border-[var(--t-border)] bg-black/40 text-[var(--t-primary-light)] hover:bg-[var(--t-primary-badge)]"
              }`}
            >
              ₹{amt}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedAmount("custom")}
            suppressHydrationWarning
            className={`rounded-2xl border px-4 py-2.5 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              selectedAmount === "custom"
                ? "border-[var(--t-primary)] bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] shadow-lg scale-105"
                : "border-[var(--t-border)] bg-black/40 text-[var(--t-primary-light)] hover:bg-[var(--t-primary-badge)]"
            }`}
          >
            इतर रक्कम (Custom)
          </button>
        </div>

        {selectedAmount === "custom" && (
          <div className="mt-3 max-w-xs mx-auto">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="रक्कम टाका (उदा. ₹5001)"
              suppressHydrationWarning
              className="w-full rounded-2xl border border-[var(--t-border)] bg-black/60 px-4 py-2.5 text-center text-sm font-bold text-amber-200 outline-none focus:border-[var(--t-primary)]"
            />
          </div>
        )}

        {/* Selected Amount Display */}
        <div className="mt-4 text-[var(--t-primary-light)] text-sm sm:text-base font-bold">
          निवडलेली देणगी रक्कम: <span className="text-xl sm:text-2xl text-white font-extrabold ml-1">₹{getActiveAmount()}</span>
        </div>

        {/* Payment & QR Code Cards Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* QR & UPI Info Card */}
          <div className="rounded-3xl border border-[var(--t-card-border)] bg-black/50 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <p className="flex items-center gap-2 text-xs font-extrabold text-[var(--t-primary)] uppercase tracking-wider">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>UPI / QR Payment</span>
                </p>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                  १००% सुरक्षित
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-[var(--t-text-soft)]">
                <p><strong>खातेदार:</strong> {accountHolder}</p>
                <p><strong>UPI ID:</strong> <span className="text-amber-300 font-mono font-bold bg-black/60 px-2.5 py-1 rounded-lg border border-amber-500/30 select-all">{upiId}</span></p>
                <p><strong>संपर्क फोन:</strong> {contactPhone}</p>
              </div>

              {/* QR Code Display if available */}
              {qrCodeUrl && qrCodeUrl !== "/images/decorations/mandala.png" && (
                <div className="mt-4 p-2 bg-white rounded-2xl max-w-[160px] mx-auto shadow-md">
                  <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto rounded-xl object-contain" />
                </div>
              )}

              {/* Payment Steps */}
              <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 text-[11px] text-[var(--t-text-muted)]">
                <p className="font-bold text-amber-300">पेमेंट करण्याच्या सोप्या पायऱ्या:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>UPI ID कॉपी करा किंवा QR स्कॅन करा</li>
                  <li>तुमच्या पेमेंट ॲपमध्ये रक्कम टाका</li>
                  <li>पेमेंट झाल्यावर UTR नंबर इथे भरा</li>
                </ol>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCopyUpi}
                suppressHydrationWarning
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-[var(--t-border)] bg-[var(--t-primary-badge)] px-4 py-2.5 text-xs font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary)] hover:text-[var(--t-bg)] transition-all cursor-pointer"
              >
                {copiedUpi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUpi ? "UPI ID कॉपी झाला!" : "Copy UPI ID"}</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] text-amber-200/80 font-bold bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
              </div>
            </div>
          </div>

          {/* Verification Form Card */}
          <div className="rounded-3xl border border-[var(--t-card-border)] bg-black/50 p-6 backdrop-blur-md shadow-xl">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4">
                <div className="rounded-full bg-emerald-500/20 p-3 border border-emerald-500/40">
                  <ShieldCheck className="w-12 h-12 text-emerald-400" />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--t-primary-light)]">देणगी नोंद यशस्वी! 🙏</h3>
                <p className="text-xs text-[var(--t-text-soft)] leading-relaxed max-w-xs">
                  आपली ₹{getActiveAmount()} ची देणगी माहिती यशस्वीरित्या नोंदवली गेली आहे. मंडळ समितीद्वारे पडताळणी करून आपणास पावती पाठवली जाईल.
                </p>

                {/* Requirement 17: Open WhatsApp link to Mandal Admin */}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 py-3 text-xs font-bold text-white shadow-lg transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>मंडळ ॲडमिनला WhatsApp संदेश पाठवा (Notify Admin)</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-1 text-xs font-bold text-amber-300 hover:underline cursor-pointer"
                >
                  पुन्हा दुसरी देणगी नोंदवा
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitVerification} className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                  <p className="flex items-center gap-2 text-xs font-extrabold text-[var(--t-primary)] uppercase tracking-wider">
                    <CreditCard className="w-4 h-4 text-[var(--t-primary)]" />
                    <span>देणगी पावती पडताळणी अर्ज</span>
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-500/40 bg-rose-950/60 p-2.5 text-[11px] font-bold text-rose-200">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">आपले पूर्ण नाव *</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="उदा. श्री. विकास आनंद पाटील"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-amber-50 placeholder:text-amber-100/30 outline-none focus:border-[var(--t-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">मोबाईल नंबर (WhatsApp) *</label>
                  <input
                    type="tel"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder="उदा. 98200XXXXX"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-amber-50 placeholder:text-amber-100/30 outline-none focus:border-[var(--t-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">UPI UTR / Trans ID (12 अंकी) *</label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="उदा. 4234XXXX1234"
                    required
                    suppressHydrationWarning
                    className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-amber-50 placeholder:text-amber-100/30 outline-none focus:border-[var(--t-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-300 mb-1">पेमेंट पुरावा स्क्रीनशॉट (Screenshot Upload)</label>
                  {screenshotUrl ? (
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-white/20">
                      <img src={screenshotUrl} alt="Proof" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl("")}
                        className="absolute top-1 right-1 rounded-full bg-rose-600 p-1 text-white cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleScreenshotUpload(e.target.files?.[0] || null)}
                      className="block w-full text-[11px] text-amber-200 file:mr-2 file:rounded-xl file:border-0 file:bg-[var(--t-primary-muted)] file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-[var(--t-primary-light)] cursor-pointer"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  suppressHydrationWarning
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] py-3 text-xs sm:text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer transition-all mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "प्रोसेस होत आहे..." : "मी पेमेंट केले आहे - माहिती नोंदवा"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Security & Gratitude Note */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-amber-200/70">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>आपली सर्व वर्गणी माहिती व व्यवहार संपूर्णपणे सुरक्षित आहे. गणपती बाप्पांचा आशीर्वाद सदैव लाभो!</span>
        </div>
      </div>
    </section>
  );
}
