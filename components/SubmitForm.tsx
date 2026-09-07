"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitCustomerRequestAction } from "@/lib/mandal-actions";
import PreviewModal from "@/components/PreviewModal";
import { InvitationData } from "@/components/InvitationPreview";
import { uploadPhoto, uploadPhotos } from "@/lib/photo-upload";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Users,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Upload,
  Heart,
  Calendar,
  Layers,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  AlertCircle,
  Eye,
  Building,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";

type TimelineDraft = {
  id: string;
  day: string;
  title: string;
  summary: string;
  date: string;
  time: string;
  bgColor?: string;
};

type GalleryDraft = {
  id: string;
  file?: File;
  preview: string;
  caption: string;
};

type CommitteeDraft = {
  id: string;
  name: string;
  position: string;
  photoPreview?: string;
  phone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  isDisplayed: boolean;
};

const THEME_OPTIONS = [
  { id: "royal_gold", name: "Royal Gold (शाही सुवर्ण)", bg: "from-amber-700 to-yellow-600" },
  { id: "peshwai", name: "Peshwai (पेशवाई लाल)", bg: "from-red-800 to-amber-700" },
  { id: "modern_saffron", name: "Modern Saffron (भगवा दिव्य)", bg: "from-orange-600 to-amber-500" },
  { id: "night_darshan", name: "Night Darshan (रात्रि दर्शन)", bg: "from-slate-900 via-indigo-950 to-amber-950" },
];

const PRESET_EVENTS = [
  {
    key: "sthapana",
    day: "दिवस १",
    title: "श्री गणेश मूर्ती प्रतिष्ठापना",
    summary: "शास्त्रोक्त विधीनुसार प्राणप्रतिष्ठापना सोहळा",
    defaultTime: "सकाळी १०:०० वा.",
    defaultDate: "२०२६-०९-१४",
    icon: "🚩",
  },
  {
    key: "aarti",
    day: "दररोज",
    title: "दैनिक महाआरती सोहळा",
    summary: "दररोजची सकाळ व संध्याकाळ मंगल आरती व तीर्थप्रसाद",
    defaultTime: "सकाळी ०८:०० वा. • संध्याकाळी ०८:०० वा.",
    defaultDate: "दररोज",
    icon: "🪔",
  },
  {
    key: "satyanarayan",
    day: "दिवस ५",
    title: "श्री सत्यनारायण महापूजा",
    summary: "सत्यनारायण पूजा, कथा व तीर्थप्रसाद वाटप",
    defaultTime: "संध्याकाळी ०५:०० वा.",
    defaultDate: "२०२६-०९-१८",
    icon: "🌸",
  },
  {
    key: "mahaprasad",
    day: "दिवस ७",
    title: "महाप्रसाद सोहळा (अन्नदान)",
    summary: "महाप्रसादाचा नैवेद्य आणि भाविकांसाठी भोजन वितरण",
    defaultTime: "दुपारी १२:०० वा.",
    defaultDate: "२०२६-०९-२०",
    icon: "🍲",
  },
  {
    key: "cultural",
    day: "दिवस ८",
    title: "सांस्कृतिक कार्यक्रम व स्पर्धा",
    summary: "भजन, कीर्तन, संगीत संध्या व विविध कला स्पर्धा",
    defaultTime: "संध्याकाळी ०७:०० वा.",
    defaultDate: "२०२६-०९-२१",
    icon: "🎭",
  },
  {
    key: "visarjan",
    day: "दिवस १०",
    title: "गणपती विसर्जन मिरवणूक सोहळा",
    summary: "उत्तरपूजा व ढोल-ताशांच्या गजरात भावपूर्ण विसर्जन सोहळा",
    defaultTime: "संध्याकाळी ०६:०० वा.",
    defaultDate: "२०२६-०९-२३",
    icon: "🌺",
  },
];

function TimeSelectInput({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const parseVal = (str: string) => {
    let hour = "08";
    let minute = "00";
    let period = "AM";
    if (str) {
      if (str.includes("PM") || str.includes("संध्याकाळी") || str.includes("रात्री") || str.includes("दुपारी")) {
        period = "PM";
      }
      const match = str.match(/(\d{1,2})[:.:](\d{2})/);
      if (match) {
        hour = match[1].padStart(2, "0");
        minute = match[2];
      }
    }
    return { hour, minute, period };
  };

  const parsed = parseVal(value);

  const update = (h: string, m: string, p: string) => {
    const periodLabel = p === "AM" ? "सकाळी" : "संध्याकाळी";
    onChange(`${periodLabel} ${h}:${m} वा.`);
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-amber-200/80 text-[11px] font-bold">{label}</label>}
      <div className="flex items-center gap-1.5">
        <select
          value={parsed.hour}
          onChange={(e) => update(e.target.value, parsed.minute, parsed.period)}
          className="rounded-xl border border-white/15 bg-black/80 px-2.5 py-1.5 text-xs font-bold text-amber-100 outline-none focus:border-[var(--t-primary)]"
        >
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((h) => (
            <option key={h} value={h} className="bg-[var(--t-bg)] text-amber-100">
              {h} तास
            </option>
          ))}
        </select>
        <span className="text-amber-400 font-bold">:</span>
        <select
          value={parsed.minute}
          onChange={(e) => update(parsed.hour, e.target.value, parsed.period)}
          className="rounded-xl border border-white/15 bg-black/80 px-2.5 py-1.5 text-xs font-bold text-amber-100 outline-none focus:border-[var(--t-primary)]"
        >
          {["00", "15", "30", "45"].map((m) => (
            <option key={m} value={m} className="bg-[var(--t-bg)] text-amber-100">
              {m} मि.
            </option>
          ))}
        </select>
        <select
          value={parsed.period}
          onChange={(e) => update(parsed.hour, parsed.minute, e.target.value)}
          className="rounded-xl border border-white/15 bg-black/80 px-2.5 py-1.5 text-xs font-bold text-amber-100 outline-none focus:border-[var(--t-primary)]"
        >
          <option value="AM" className="bg-[var(--t-bg)] text-amber-100">
            सकाळी (AM)
          </option>
          <option value="PM" className="bg-[var(--t-bg)] text-amber-100">
            संध्याकाळी/रात्री (PM)
          </option>
        </select>
      </div>
    </div>
  );
}

function DualAartiTimeInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const parts = value.split("•").map((s) => s.trim());
  const morningVal = parts[0] || "सकाळी ०८:०० वा.";
  const eveningVal = parts[1] || "संध्याकाळी ०८:०० वा.";

  const updateMorning = (newM: string) => {
    onChange(`${newM} • ${eveningVal}`);
  };

  const updateEvening = (newE: string) => {
    onChange(`${morningVal} • ${newE}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30">
      <TimeSelectInput label="१. सकाळची महाआरती वेळ" value={morningVal} onChange={updateMorning} />
      <TimeSelectInput label="२. संध्याकाळची महाआरती वेळ" value={eveningVal} onChange={updateEvening} />
    </div>
  );
}

const makeId = () => Math.random().toString(36).slice(2, 10);

export default function SubmitForm() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [attemptedStep1, setAttemptedStep1] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // STEP 1 REQUIRED & OPTIONAL FIELDS
  const [mandalName, setMandalName] = useState("");
  const [mandalType, setMandalType] = useState("Public Mandal");
  const [establishedYear, setEstablishedYear] = useState("");
  const [contactPersonName, setContactPersonName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [stateName, setStateName] = useState("महाराष्ट्र");
  const [pincode, setPincode] = useState("");
  const [mapsLink, setMapsLink] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [themeId, setThemeId] = useState("royal_gold");
  const [inviteMessage, setInviteMessage] = useState("गणरायाच्या पावन आगमनानिमित्त आमच्या मंडळाच्या उत्सव सोहळ्यात आपणास व आपल्या परिवारास सस्नेह निमंत्रण!");
  const [upiId, setUpiId] = useState("");

  // STEP 2: TIMELINE
  const [events, setEvents] = useState<TimelineDraft[]>([
    {
      id: makeId(),
      day: "दिवस १",
      title: "श्री गणेश मूर्ती प्रतिष्ठापना",
      summary: "शास्त्रोक्त विधीनुसार प्राणप्रतिष्ठापना सोहळा",
      date: "२०२६-०९-१४",
      time: "सकाळी १०:०० वा.",
    },
    {
      id: makeId(),
      day: "दररोज",
      title: "दैनिक महाआरती सोहळा",
      summary: "दररोजची सकाळ व संध्याकाळ मंगल आरती व तीर्थप्रसाद",
      date: "दररोज",
      time: "सकाळी ०८:०० वा. • संध्याकाळी ०८:०० वा.",
    },
  ]);

  // STEP 3: GALLERY
  const [gallery, setGallery] = useState<GalleryDraft[]>([]);

  // STEP 4: TEAM & COMMITTEE
  const [teamPhotoUrl, setTeamPhotoUrl] = useState("");
  const [committeeName, setCommitteeName] = useState("उत्सव समिती २०२६");
  const [committeeDescription, setCommitteeDescription] = useState("आमच्या मंडळाचे सर्व पदाधिकारी व कार्यकर्ते अहोरात्र सेवेत तत्पर असतात.");
  const [committee, setCommittee] = useState<CommitteeDraft[]>([
    {
      id: makeId(),
      name: "श्री. अमोल पाटील",
      position: "अध्यक्ष",
      photoPreview: "",
      phone: "+91 98231 23456",
      isDisplayed: true,
    },
    {
      id: makeId(),
      name: "श्री. नितीन देशपांडे",
      position: "सचिव",
      photoPreview: "",
      phone: "+91 98231 23457",
      isDisplayed: true,
    },
  ]);

  // STEP 5: DONATION SETTINGS
  const [accountHolder, setAccountHolder] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [supportMobile, setSupportMobile] = useState("");
  const [donationDescription, setDonationDescription] = useState("मंडळाच्या सामाजिक व धार्मिक कार्यासाठी ऐच्छिक वर्गणी / देणगी अर्पण करा.");
  const [donationAmountOptions, setDonationAmountOptions] = useState("101,251,501,1001,2100");

  // Autofill Demo Data
  const fillSampleData = () => {
    setMandalName("श्री जय मल्हार गणेश मंडळ");
    setMandalType("Public Mandal");
    setEstablishedYear("१९९८");
    setContactPersonName("श्री. अमोल पाटील");
    setMobileNumber("8669233747");
    setWhatsappNumber("8669233747");
    setEmail("jaymalharganeshmandal@gmail.com");
    setAddress("मुख्य चौक, कार्वे रोड, कोथरूड");
    setCity("पुणे");
    setDistrict("पुणे");
    setStateName("महाराष्ट्र");
    setPincode("४११०३८");
    setMapsLink("https://maps.google.com/?q=Kothrud+Pune");
    setInstagramUrl("https://instagram.com/shri_jay_malhar_mandal");
    setFacebookUrl("https://facebook.com/shrijaymalharmandal");
    setYoutubeUrl("https://youtube.com/@shrijaymalharmandal");
    setUpiId("jaymalhar@oksbi");
    setAccountHolder("श्री जय मल्हार गणेश मंडळ ट्रस्ट");
    setSupportMobile("8669233747");
    setInviteMessage("आमच्या श्री जय मल्हार गणेश मंडळाच्या २५ व्या रौप्य महोत्सवी गणेशोत्सवास सर्व भाविक भक्तांना सस्नेह निमंत्रण! बाप्पांच्या दर्शनाचा व महाप्रसादाचा लाभ घ्यावा.");

    if (gallery.length === 0) {
      setGallery([
        { id: makeId(), preview: "/images/gallery/gallery-1.webp", caption: "श्रींची सुवर्ण अलंकारयुक्त प्रतिष्ठापना मूर्ती" },
        { id: makeId(), preview: "/images/gallery/gallery-2.png", caption: "सायंकाळची महाआरती व भाविकांची गर्दी" },
      ]);
    }

    if (!teamPhotoUrl) {
      setTeamPhotoUrl("/images/backgrounds/FamilySection.webp");
    }

    setError("");
  };

  // STEP 1 VALIDATION
  const validateStep1 = () => {
    if (!mandalName.trim()) return false;
    if (!establishedYear.trim()) return false;
    if (!contactPersonName.trim()) return false;
    if (!mobileNumber.trim()) return false;
    if (!whatsappNumber.trim()) return false;
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return false;
    if (!address.trim()) return false;
    if (!city.trim()) return false;
    if (!district.trim()) return false;
    if (!stateName.trim()) return false;
    if (!pincode.trim()) return false;
    if (!upiId.trim()) return false;
    return true;
  };

  const handleStep1Next = () => {
    setAttemptedStep1(true);
    if (validateStep1()) {
      setError("");
      setStep(2);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } else {
      setError("कृपया लाल रंगाने दर्शवलेली सर्व आवश्यक (*) माहिती भरा.");
    }
  };

  const handleStep2Next = () => {
    setStep(3);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleStep3Next = () => {
    setStep(4);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  const handleStep4Next = () => {
    setStep(5);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  // Helper for photo upload with automatic compression
  const handleSingleImageUpload = async (file: File | null, setter: (url: string) => void) => {
    if (!file) return;
    try {
      const url = await uploadPhoto(file);
      setter(url);
    } catch (e) {
      console.error("Upload error:", e);
    }
  };

  // Timeline handlers
  const addEvent = () => {
    setEvents((prev) => [
      ...prev,
      {
        id: makeId(),
        day: `दिवस ${prev.length + 1}`,
        title: "",
        summary: "",
        date: "",
        time: "",
      },
    ]);
  };

  const togglePresetEvent = (preset: (typeof PRESET_EVENTS)[number]) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.title === preset.title);
      if (exists) {
        return prev.filter((e) => e.title !== preset.title);
      } else {
        return [
          ...prev,
          {
            id: makeId(),
            day: preset.day,
            title: preset.title,
            summary: preset.summary,
            date: preset.defaultDate,
            time: preset.defaultTime,
          },
        ];
      }
    });
  };

  const updateEvent = (id: string, field: keyof TimelineDraft, value: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const moveEvent = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= events.length) return;
    const next = [...events];
    const temp = next[index];
    next[index] = next[target];
    next[target] = temp;
    setEvents(next);
  };

  // Gallery handlers with automatic compression
  const handlePhotosUpload = async (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    try {
      const urls = await uploadPhotos(fileArray);
      setGallery((prev) => [
        ...prev,
        ...urls.map((preview) => ({ id: makeId(), preview, caption: "" })),
      ]);
    } catch (e) {
      console.error("Photos upload error:", e);
    }
  };

  const updateGalleryCaption = (id: string, caption: string) => {
    setGallery((prev) => prev.map((g) => (g.id === id ? { ...g, caption } : g)));
  };

  const removeGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  // Committee Member handlers
  const addCommitteeMember = () => {
    setCommittee((prev) => [
      ...prev,
      { id: makeId(), name: "", position: "सदस्य", phone: "", isDisplayed: true },
    ]);
  };

  const updateMember = (id: string, field: keyof CommitteeDraft, value: any) => {
    setCommittee((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const removeMember = (id: string) => {
    setCommittee((prev) => prev.filter((c) => c.id !== id));
  };

  // Build Preview Data
  const buildPreviewData = (): InvitationData => ({
    mandalName: mandalName || "तुमच्या मंडळाचे नाव",
    inviteLine: "आपणास सस्नेह निमंत्रण!",
    inviteMessage: inviteMessage || "तुमचा निमंत्रण संदेश इथे दिसेल",
    establishedYear,
    murtiPhotos: gallery.map((g) => g.preview),
    timelineEvents: events
      .filter((e) => e.title.trim())
      .map((e) => ({
        title: e.title,
        summary: e.summary,
        date: e.date || e.day || "दिवस १",
        time: e.time,
      })),
    address: `${address}, ${city}, ${district}`,
    contact: mobileNumber || "+91 98765 43210",
    mapEmbedUrl: mapsLink
      ? `https://maps.google.com/maps?q=${encodeURIComponent(address || "India")}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(address || "India")}&output=embed`,
    mapsLink: mapsLink || `https://maps.google.com/?q=${encodeURIComponent(address || "India")}`,
    galleryPhotos: gallery.map((g) => ({ url: g.preview, caption: g.caption })),
    instagramUrl: instagramUrl || undefined,
  });

  // Final Submit Action
  const handleSubmit = async () => {
    if (!upiId.trim()) {
      setError("कृपया UPI ID प्रविष्ट करा (Required).");
      setStep(5);
      return;
    }

    setError("");
    setSubmitting(true);
    setProgress("माहिती सेव्ह होत आहे व सुपर ॲडमिन कडे पाठवली जात आहे...");

    try {
      const result = await submitCustomerRequestAction({
        mandalName,
        mandalType,
        establishedYear,
        contactPersonName,
        mobileNumber,
        whatsappNumber,
        email,
        address,
        city,
        district,
        state: stateName,
        pincode,
        upiId,
        accountHolder: accountHolder || mandalName,
        qrCodeUrl: qrCodeUrl || undefined,
        supportMobile: supportMobile || mobileNumber,
        donationDescription: donationDescription || undefined,
        donationAmountOptions: donationAmountOptions || "101,251,501,1001,2100",
        inviteMessage,
        themeId,
        mapsLink: mapsLink || undefined,
        instagramUrl: instagramUrl || undefined,
        facebookUrl: facebookUrl || undefined,
        youtubeUrl: youtubeUrl || undefined,
        websiteUrl: websiteUrl || undefined,
        teamPhotoUrl: teamPhotoUrl || undefined,
        committeeName: committeeName || undefined,
        committeeDescription: committeeDescription || undefined,
        timeline: events.map((e, idx) => ({
          day: e.day,
          title: e.title,
          subtitle: e.summary,
          eventDate: e.date || e.day || "२०२६",
          eventTime: e.time || "सकाळी ९:०० वा.",
          description: e.summary,
          displayOrder: idx + 1,
        })),
        gallery: gallery.map((g, idx) => ({
          url: g.preview,
          caption: g.caption,
          displayOrder: idx + 1,
        })),
        committee: committee.map((c, idx) => ({
          name: c.name,
          position: c.position,
          photoUrl: c.photoPreview,
          phone: c.phone,
          instagramUrl: c.instagramUrl,
          facebookUrl: c.facebookUrl,
          isDisplayed: c.isDisplayed,
          displayOrder: idx + 1,
        })),
      });

      if (result && result.refNumber) {
        router.push(`/submit/thank-you?ref=${result.refNumber}`);
      } else {
        throw new Error("काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.");
      }
    } catch (e: any) {
      setError(e?.message || "सबमिट करताना एरर आली.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Header Info Banner */}
      <div className="mb-8 rounded-3xl border border-[var(--t-border)] bg-gradient-to-b from-[#2a0b0f]/95 via-[#1a0407]/95 to-[#120204]/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--t-border)] bg-[var(--t-primary)]/15 px-4 py-1 text-xs font-bold text-[var(--t-primary-light)]">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>डिजिटल गणेशोत्सव निमंत्रण फॉर्म • ५ टप्पे</span>
        </div>

        <h1 className="mt-3 font-display text-2xl sm:text-4xl font-extrabold text-[var(--t-primary-light)]">
          माझी गणेशोत्सव Website तयार करा 🚩
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-[var(--t-text-soft)] max-w-2xl mx-auto">
          कोणत्याही लॉगिनशिवाय फॉर्म भरा. माहिती सबमिट केल्यानंतर सुपर ॲडमिनद्वारे पडताळणी होऊन आपली वेबसाईट Live केली जाईल!
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
          <button
            type="button"
            onClick={fillSampleData}
            className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-bold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            🚀 नमुना माहिती भरा (Fill Sample Data)
          </button>
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="rounded-2xl border border-[var(--t-border-accent)] bg-[var(--t-primary-muted)] px-4 py-2 font-bold text-[var(--t-primary-light)] hover:bg-[var(--t-primary)] hover:text-[var(--t-bg)] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>लाइव्ह प्रिव्ह्यू पहा (Preview)</span>
          </button>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="mb-6 rounded-2xl border border-rose-500/50 bg-rose-950/80 p-4 text-xs sm:text-sm font-bold text-rose-200 shadow-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* STEPPER PROGRESS BAR */}
      <div className="mb-8 grid grid-cols-5 gap-2 text-center text-[10px] sm:text-xs font-bold">
        {[
          { num: 1, label: "१. माहिती" },
          { num: 2, label: "२. वेळापत्रक" },
          { num: 3, label: "३. गॅलरी" },
          { num: 4, label: "४. टीम फोटो" },
          { num: 5, label: "५. देणगी व सबमिट" },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => {
              if (s.num === 1 || validateStep1()) setStep(s.num);
            }}
            className={`rounded-xl py-2 px-1 border transition-all cursor-pointer ${
              step === s.num
                ? "border-[var(--t-primary)] bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] text-[var(--t-bg)] shadow-lg"
                : step > s.num
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-white/10 bg-black/40 text-[var(--t-text-muted)]"
            }`}
          >
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* FORM CONTAINER */}
      <div className="rounded-3xl border border-[var(--t-border)] bg-black/50 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-6">
        {/* =========================================================
            STEP 1: FIRST PAGE REQUIRED FIELDS
           ========================================================= */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-[var(--t-primary-light)] border-b border-white/10 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" />
              <span>पायरी १: मंडळाची प्राथमिक व संपर्क माहिती (Required Fields)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">मंडळाचे नाव (Mandal Name) *</label>
                <input
                  type="text"
                  value={mandalName}
                  onChange={(e) => setMandalName(e.target.value)}
                  placeholder="उदा. जय शंकर सार्वजनिक गणेशोत्सव मंडळ"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !mandalName.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">मंडळाचा प्रकार (Mandal Type) *</label>
                <select
                  value={mandalType}
                  onChange={(e) => setMandalType(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                >
                  <option value="Public Mandal" className="bg-[var(--t-bg)]">सार्वजनिक मंडळ (Public Mandal)</option>
                  <option value="Home Ganapati" className="bg-[var(--t-bg)]">घरगुती गणपती (Home Ganapati)</option>
                  <option value="Society" className="bg-[var(--t-bg)]">हाऊसिंग सोसायटी (Society)</option>
                  <option value="Institution" className="bg-[var(--t-bg)]">संस्था / ट्रस्ट (Institution)</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">स्थापना वर्ष (Established Year) *</label>
                <input
                  type="text"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  placeholder="उदा. १९९५"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !establishedYear.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">संपर्क व्यक्तीचे नाव (Contact Person Name) *</label>
                <input
                  type="text"
                  value={contactPersonName}
                  onChange={(e) => setContactPersonName(e.target.value)}
                  placeholder="उदा. श्री. विकास आनंद पाटील"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !contactPersonName.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">मोबाईल नंबर (Mobile Number) *</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="उदा. 8669233747"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !mobileNumber.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">WhatsApp नंबर (WhatsApp Number) *</label>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="उदा. 8669233747"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !whatsappNumber.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">ईमेल पत्ता (Email Address - Required, No Duplicates) *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="उदा. jayshankarmandal@gmail.com"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                      ? "border-rose-500"
                      : "border-white/15"
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">पूर्ण पत्ता (Address) *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="उदा. शंकर नगर, बाजीराव रोड, शनिवार वाड्या जवळ"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !address.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">शहर (City) *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="उदा. पुणे"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !city.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">जिल्हा (District) *</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="उदा. पुणे"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !district.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">राज्य (State) *</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="उदा. महाराष्ट्र"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !stateName.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">पिनकोड (Pincode) *</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="उदा. ४११०३०"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !pincode.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">UPI ID (Must Be Required) *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="उदा. 8669233747@upi"
                  className={`w-full rounded-2xl border bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)] ${
                    attemptedStep1 && !upiId.trim() ? "border-rose-500" : "border-white/15"
                  }`}
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">गूगल मॅप्स लिंक (Google Maps Link)</label>
                <input
                  type="url"
                  value={mapsLink}
                  onChange={(e) => setMapsLink(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">थीम निवड (Theme Selection)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEME_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeId(t.id)}
                      className={`rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                        themeId === t.id
                          ? "border-[var(--t-primary)] bg-[var(--t-primary-muted)] shadow-lg scale-105"
                          : "border-white/15 bg-black/40 hover:bg-white/5"
                      }`}
                    >
                      <div className={`h-4 w-full rounded-lg bg-gradient-to-r ${t.bg} mb-1.5`} />
                      <p className="text-[11px] font-bold text-amber-200">{t.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">निमंत्रण संदेश (Invitation Message)</label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={handleStep1Next}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-8 py-3.5 text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>पुढील पायरी (वेळापत्रक) →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 2: SECOND PAGE (FESTIVAL TIMELINE)
           ========================================================= */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-[var(--t-primary-light)] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-400" />
                  <span>पायरी २: १० दिवसांचे उत्सव वेळापत्रक (Festival Timeline)</span>
                </h2>
                <p className="text-xs text-[var(--t-text-soft)] mt-1">
                  प्रमुख कार्यक्रम निवडा किंवा खालील फॉर्ममध्ये नवीन कार्यक्रम जोडा.
                </p>
              </div>
              <button
                type="button"
                onClick={addEvent}
                className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>+ खास कार्यक्रम जोडा</span>
              </button>
            </div>

            {/* PRESET EVENT SELECTION GRID */}
            <div className="rounded-2xl border border-[var(--t-border)] bg-gradient-to-r from-amber-950/40 via-black/40 to-amber-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[var(--t-primary-light)] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>मुख्य कार्यक्रम निवडा (Quick Preset Selection)</span>
                </label>
                <span className="text-[11px] text-amber-200/70">क्लिक करून जोडा किंवा काढा</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {PRESET_EVENTS.map((preset) => {
                  const isSelected = events.some((e) => e.title === preset.title);
                  return (
                    <button
                      key={preset.key}
                      type="button"
                      onClick={() => togglePresetEvent(preset)}
                      className={`flex items-start gap-2 rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md ring-1 ring-emerald-500/50"
                          : "border-white/15 bg-black/60 text-amber-100 hover:border-amber-500/40 hover:bg-amber-500/5"
                      }`}
                    >
                      <span className="text-lg leading-none">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold truncate">{preset.title}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                        </div>
                        <p className="text-[10px] text-amber-200/70 mt-0.5 truncate">
                          {preset.day} • {preset.defaultTime}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EVENT INPUT CARDS LIST */}
            <div className="space-y-4">
              {events.map((ev, idx) => {
                const isDailyAarti = ev.title.includes("आरती") || ev.title.includes("महाआरती");
                return (
                  <div
                    key={ev.id}
                    className="rounded-2xl border border-amber-500/30 bg-black/60 p-4 sm:p-5 text-left space-y-4 shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--t-primary-light)]">
                        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-amber-300 border border-amber-500/30">
                          कार्यक्रम #{idx + 1}
                        </span>
                        <span>{ev.title || "नवीन कार्यक्रम"}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => moveEvent(idx, "up")}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg border border-white/10 text-xs disabled:opacity-30 hover:bg-white/10 cursor-pointer"
                          title="वर घ्या"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveEvent(idx, "down")}
                          disabled={idx === events.length - 1}
                          className="p-1.5 rounded-lg border border-white/10 text-xs disabled:opacity-30 hover:bg-white/10 cursor-pointer"
                          title="खाली घ्या"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeEvent(ev.id)}
                          className="p-1.5 rounded-lg border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs hover:bg-rose-900/60 cursor-pointer"
                          title="हटावा"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">दिवस / लेबल (Day/Label)</label>
                        <input
                          type="text"
                          value={ev.day}
                          onChange={(e) => updateEvent(ev.id, "day", e.target.value)}
                          placeholder="उदा. दिवस १ / दररोज"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">तारीख (Date)</label>
                        <input
                          type="text"
                          value={ev.date || ""}
                          onChange={(e) => updateEvent(ev.id, "date", e.target.value)}
                          placeholder="उदा. २०२६-०९-१४ / १५ सप्टें"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>

                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">कार्यक्रमाचे नाव (Title) *</label>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => updateEvent(ev.id, "title", e.target.value)}
                          placeholder="उदा. प्रतिष्ठापना / महाआरती"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-amber-200/80 mb-1 font-semibold">
                          वेळ निवड (Time Selection - 12 Hour Format)
                        </label>
                        {isDailyAarti ? (
                          <DualAartiTimeInput
                            value={ev.time}
                            onChange={(newTime) => updateEvent(ev.id, "time", newTime)}
                          />
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <TimeSelectInput
                              value={ev.time}
                              onChange={(newTime) => updateEvent(ev.id, "time", newTime)}
                            />
                            <input
                              type="text"
                              value={ev.time}
                              onChange={(e) => updateEvent(ev.id, "time", e.target.value)}
                              placeholder="किंवा थेट टाईप करा (उदा. सकाळी १०:०० वा.)"
                              className="w-full sm:w-1/2 rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-amber-200/80 mb-1 font-semibold">वर्णन (Summary / Description)</label>
                        <input
                          type="text"
                          value={ev.summary}
                          onChange={(e) => updateEvent(ev.id, "summary", e.target.value)}
                          placeholder="उदा. भाविकांसाठी महाआरती व तीर्थप्रसाद वाटप"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTTOM ADD BUTTON */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={addEvent}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-amber-500/50 bg-amber-500/10 px-8 py-3.5 text-xs font-extrabold text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>+ वेगळा / खास कार्यक्रम जोडा (Add Custom Event)</span>
              </button>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-2xl border border-white/20 bg-black/40 px-6 py-3 text-xs font-bold text-[var(--t-text)] hover:bg-white/10 transition-all cursor-pointer"
              >
                ← मागील टप्पा
              </button>
              <button
                type="button"
                onClick={handleStep2Next}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-8 py-3.5 text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>पुढील पायरी (गॅलरी) →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 3: THIRD PAGE (PHOTO GALLERY)
           ========================================================= */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-[var(--t-primary-light)] border-b border-white/10 pb-3 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <span>पायरी ३: फोटो गॅलरी अपलोड (Photo Gallery Upload)</span>
            </h2>

            <div className="rounded-2xl border-2 border-dashed border-[var(--t-border)] bg-black/40 p-8 text-center hover:bg-[var(--t-primary)]/5 transition-all">
              <Upload className="mx-auto w-10 h-10 text-amber-400 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-[var(--t-primary-light)]">
                इथे फोटो ड्रॅग आणि ड्रॉप करा किंवा ब्राऊज करा (Unlimited Photos)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handlePhotosUpload(e.target.files)}
                className="mt-3 block mx-auto text-xs text-amber-200 cursor-pointer file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--t-primary)] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[var(--t-bg)]"
              />
            </div>

            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((g) => (
                  <div key={g.id} className="relative rounded-2xl border border-white/15 bg-black/60 p-2 group space-y-2">
                    <div className="relative">
                      <img src={g.preview} alt="Gallery" className="h-32 w-full object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(g.id)}
                        className="absolute top-2 right-2 rounded-full bg-rose-600/90 p-1.5 text-white shadow-md hover:scale-110 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={g.caption || ""}
                      onChange={(e) => updateGalleryCaption(g.id, e.target.value)}
                      placeholder="फोटोचे नाव / कॅप्शन (उदा. आगमन सोहळा)"
                      className="w-full rounded-xl border border-white/15 bg-black/60 px-2.5 py-1.5 text-xs text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-2xl border border-white/20 bg-black/40 px-6 py-3 text-xs font-bold text-[var(--t-text)] hover:bg-white/10 transition-all cursor-pointer"
              >
                ← मागील टप्पा
              </button>
              <button
                type="button"
                onClick={handleStep3Next}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-8 py-3.5 text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>पुढील पायरी (टीम फोटो) →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 4: FOURTH PAGE (TEAM PHOTO SECTION - NEW)
           ========================================================= */}
        {step === 4 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-[var(--t-primary-light)] border-b border-white/10 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>पायरी ४: उत्सव समिती व टीम फोटो (Team Photo & Committee Members)</span>
            </h2>

            {/* Team Group Photo */}
            <div className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-3 text-left">
              <label className="block text-xs font-bold text-[var(--t-primary-light)]">समिती / मंडळाचा ग्रुप फोटो (Group Team Photo)</label>
              {teamPhotoUrl ? (
                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-white/20">
                  <img src={teamPhotoUrl} alt="Team" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setTeamPhotoUrl("")}
                    className="absolute top-3 right-3 rounded-full bg-rose-600 p-1.5 text-white shadow-md cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleImageUpload(e.target.files?.[0] || null, setTeamPhotoUrl)}
                  className="block w-full text-xs text-amber-200 file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--t-primary)] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[var(--t-bg)] cursor-pointer"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-xs">
              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">समितीचे नाव (Committee Name)</label>
                <input
                  type="text"
                  value={committeeName}
                  onChange={(e) => setCommitteeName(e.target.value)}
                  placeholder="उदा. उत्सव समिती २०२६"
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>
              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">समितीचे संक्षिप्त वर्णन (Description)</label>
                <input
                  type="text"
                  value={committeeDescription}
                  onChange={(e) => setCommitteeDescription(e.target.value)}
                  placeholder="उदा. अहोरात्र सेवेत तत्पर असणारा आमचा कार्यकर्ता परिवार"
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>
            </div>

            {/* Committee Members List */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <h3 className="text-xs font-bold text-[var(--t-primary-light)]">पदाधिकारी सदस्य (Unlimited Members with Photos)</h3>
                <button
                  type="button"
                  onClick={addCommitteeMember}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ सदस्य जोडा</span>
                </button>
              </div>

              {committee.map((m) => (
                <div key={m.id} className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-3 text-left shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--t-primary-light)]">सदस्य: {m.name || "नवीन सदस्य"}</span>
                    <button
                      type="button"
                      onClick={() => removeMember(m.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg border border-rose-500/40 bg-rose-950/40 text-rose-300 text-xs hover:bg-rose-900/60 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटावा</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Member Photo Upload */}
                    <div className="shrink-0">
                      <label className="block text-amber-200/80 text-[11px] font-bold mb-1">सदस्याचा फोटो</label>
                      {m.photoPreview ? (
                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-[var(--t-border-accent)]">
                          <img src={m.photoPreview} alt={m.name} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => updateMember(m.id, "photoPreview", "")}
                            className="absolute top-1 right-1 rounded-full bg-rose-600 p-1 text-white shadow-md hover:bg-rose-700 cursor-pointer"
                            title="फोटो हटावा"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-2 border-dashed border-amber-500/40 bg-black/50 hover:bg-amber-500/10 cursor-pointer transition-all">
                          <Upload className="w-5 h-5 text-amber-400 mb-1" />
                          <span className="text-[10px] text-amber-200 font-bold">फोटो जोडा</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleSingleImageUpload(file, (url) => updateMember(m.id, "photoPreview", url));
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>

                    {/* Member Details */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs w-full">
                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">नाव (Full Name) *</label>
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => updateMember(m.id, "name", e.target.value)}
                          placeholder="उदा. श्री. अमोल पाटील"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">पद (Position) *</label>
                        <input
                          type="text"
                          value={m.position}
                          onChange={(e) => updateMember(m.id, "position", e.target.value)}
                          placeholder="उदा. अध्यक्ष / सचिव / खजिनदार"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-200/80 mb-1 font-semibold">फोन नंबर (Phone)</label>
                        <input
                          type="text"
                          value={m.phone || ""}
                          onChange={(e) => updateMember(m.id, "phone", e.target.value)}
                          placeholder="उदा. +91 98231 23456"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-amber-50 outline-none focus:border-[var(--t-primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-2xl border border-white/20 bg-black/40 px-6 py-3 text-xs font-bold text-[var(--t-text)] hover:bg-white/10 transition-all cursor-pointer"
              >
                ← मागील टप्पा
              </button>
              <button
                type="button"
                onClick={handleStep4Next}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-8 py-3.5 text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span>पुढील पायरी (देणगी व सबमिट) →</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            STEP 5: FIFTH PAGE (DONATION SETTINGS & SUBMIT)
           ========================================================= */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-bold text-[var(--t-primary-light)] border-b border-white/10 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <span>पायरी ५: देणगी व वर्गणी माहिती (Donation Settings)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs">
              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">UPI ID (Must Be Required) *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="उदा. 8669233747@upi"
                  className="w-full rounded-2xl border border-[var(--t-border)] bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">खातेदाराचे नाव (Account Holder Name) *</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="उदा. जय शंकर गणेशोत्सव मंडळ ट्रस्ट"
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">QR Code फोटो (QR Code Image Upload) *</label>
                {qrCodeUrl ? (
                  <div className="relative h-36 w-36 rounded-2xl overflow-hidden border border-white/20">
                    <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain bg-white p-2" />
                    <button
                      type="button"
                      onClick={() => setQrCodeUrl("")}
                      className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white shadow-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleImageUpload(e.target.files?.[0] || null, setQrCodeUrl)}
                    className="block w-full text-xs text-amber-200 file:mr-3 file:rounded-xl file:border-0 file:bg-[var(--t-primary)] file:px-4 file:py-2 file:text-xs file:font-bold file:text-[var(--t-bg)] cursor-pointer"
                  />
                )}
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">सपोर्ट मोबाईल नंबर (Support Mobile)</label>
                <input
                  type="text"
                  value={supportMobile}
                  onChange={(e) => setSupportMobile(e.target.value)}
                  placeholder="उदा. 8669233747"
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>

              <div>
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">देणगी पर्याय (Preset Amounts)</label>
                <input
                  type="text"
                  value={donationAmountOptions}
                  onChange={(e) => setDonationAmountOptions(e.target.value)}
                  placeholder="101,251,501,1001,2100"
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[var(--t-primary-light)] font-bold mb-1">देणगी आवाहन संदेश (Donation Description)</label>
                <textarea
                  rows={2}
                  value={donationDescription}
                  onChange={(e) => setDonationDescription(e.target.value)}
                  className="w-full rounded-2xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-[var(--t-text)] outline-none focus:border-[var(--t-primary)]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-full sm:w-auto rounded-2xl border border-white/20 bg-black/40 px-6 py-3 text-xs font-bold text-[var(--t-text)] hover:bg-white/10 cursor-pointer"
              >
                ← मागील टप्पा
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-10 py-4 text-base font-extrabold text-white shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {submitting ? (
                  <span>प्रक्रिया सुरू आहे...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>वेबसाईट निर्मिती अर्ज सादर करा (Submit Request)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PREVIEW MODAL */}
      {previewOpen && (
        <PreviewModal
          data={buildPreviewData()}
          onBack={() => setPreviewOpen(false)}
          onConfirm={() => {
            setPreviewOpen(false);
            handleSubmit();
          }}
          confirmLabel="✓ वेबसाईट निर्मिती अर्ज सादर करा"
        />
      )}
    </div>
  );
}
