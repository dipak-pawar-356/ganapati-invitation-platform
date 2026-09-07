import { notFound } from "next/navigation";
import { getMandalBySlug, FullMandalData } from "@/lib/mandal-actions";
import ThemeRenderer from "@/components/themes/ThemeRenderer";
import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldAlert } from "lucide-react";

// Fallback demo mandals if database is unseeded or offline
const DEMO_MANDALS: Record<string, any> = {
  "shri-jay-malhar-ganesh-mandal": {
    id: "demo-1",
    refNumber: "REF-2026-JM01",
    slug: "shri-jay-malhar-ganesh-mandal",
    mandalName: "श्री जय मल्हार गणेश मंडळ",
    contactPersonName: "श्री. अमोल पाटील",
    email: "jaymalhar.kothrud@gmail.com",
    upiId: "jaymalhar@oksbi",
    city: "पुणे",
    district: "पुणे",
    pincode: "४११०३८",
    establishedYear: "१९९८",
    language: "mr",
    inviteMessage: "आमच्या श्री जय मल्हार गणेश मंडळाच्या २५ व्या रौप्य महोत्सवी गणेशोत्सवास सर्व भाविक भक्तांना सस्नेह निमंत्रण! बाप्पांच्या दर्शनाचा व महाप्रसादाचा लाभ घ्यावा.",
    themeId: "royal_gold",
    status: "approved",
    paymentStatus: "paid",
    amount: 499,
    heroVideoUrl: "/video/bg-video-mobile.mp4",
    heroBgUrl: "/images/backgrounds/hero-background-desktop.webp",
    musicUrl: "/audio/bhajan.mp3",
    contact: "+91 98231 23456 / +91 98231 23457",
    address: "मुख्य चौक, कार्वे रोड, कोथरूड, पुणे - ४११०३८",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.560123!2d73.812345!3d18.507890!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapsLink: "https://maps.google.com/?q=Karve+Road+Kothrud+Pune",
    instagramUrl: "https://instagram.com/shri_jay_malhar_mandal",
    editToken: "demo-token-1",
    flowerCount: 1008,
    createdAt: new Date(),
    timeline: [
      { id: "t1", mandalId: "demo-1", day: "दिवस १", title: "श्री गणेश मूर्ती आगमन मिरवणूक", subtitle: "ढोल-ताशांच्या गजरात", eventDate: "दिवस १ - ७ सप्टें", eventTime: "सकाळी ९:०० वा.", description: "भव्य मिरवणूक व पुष्पवृष्टीसह बाप्पांचे आगमन.", imageUrl: null, bgColor: null, displayOrder: 1, createdAt: new Date() },
      { id: "t2", mandalId: "demo-1", day: "दिवस १", title: "प्राणप्रतिष्ठापना व महाआरती", subtitle: "वेदमूर्ती शास्त्रीजींच्या हस्ते", eventDate: "दिवस १ - ७ सप्टें", eventTime: "दुपारी १२:१५ वा.", description: "शास्त्रोक्त विधीनुसार प्राणप्रतिष्ठापना व महाआरती.", imageUrl: null, bgColor: null, displayOrder: 2, createdAt: new Date() },
      { id: "t3", mandalId: "demo-1", day: "दिवस ३", title: "सांस्कृतिक भजन संध्या", subtitle: "प्रसिद्ध भजनी मंडळ", eventDate: "दिवस ३ - ९ सप्टें", eventTime: "रात्री ८:०० वा.", description: "पारंपारिक भजनांचा कार्यक्रम.", imageUrl: null, bgColor: null, displayOrder: 3, createdAt: new Date() },
    ],
    gallery: [
      { id: "g1", mandalId: "demo-1", mediaType: "image", url: "/images/gallery/gallery-1.webp", caption: "श्रींची सुवर्ण अलंकारयुक्त प्रतिष्ठापना मूर्ती", displayOrder: 1, createdAt: new Date() },
      { id: "g2", mandalId: "demo-1", mediaType: "image", url: "/images/gallery/gallery-2.webp", caption: "आरती सोहळा व भाविकांची गर्दी", displayOrder: 2, createdAt: new Date() },
    ],
    committee: [
      { id: "c1", mandalId: "demo-1", name: "श्री. अमोल पाटील", position: "अध्यक्ष", photoUrl: "/images/family/person-1.webp", phone: "+91 98231 23456", instagramUrl: null, facebookUrl: null, isDisplayed: 1, displayOrder: 1, createdAt: new Date() },
      { id: "c2", mandalId: "demo-1", name: "श्री. नितीन देशपांडे", position: "सचिव", photoUrl: "/images/family/person-2.webp", phone: "+91 98231 23457", instagramUrl: null, facebookUrl: null, isDisplayed: 1, displayOrder: 2, createdAt: new Date() },
    ],
  },
  "shri-swami-samarth-mitra-mandal": {
    id: "demo-2",
    refNumber: "REF-2026-SS02",
    slug: "shri-swami-samarth-mitra-mandal",
    mandalName: "श्री स्वामी समर्थ मित्र मंडळ",
    contactPersonName: "श्री. संभाजीराव कदम",
    email: "swamisamarth.karad@gmail.com",
    upiId: "swamisamarth@okaxis",
    city: "कराड",
    district: "सातारा",
    pincode: "४१५११०",
    establishedYear: "१९८८",
    language: "mr",
    inviteMessage: "कराड शहरातील श्री स्वामी समर्थ मित्र मंडळाच्या ३६ व्या वार्षिक गणेशोत्सवात बाप्पांचे दर्शन घेण्यास आपणास व आपल्या परिवारास सस्नेह आमंत्रण.",
    themeId: "peshwai",
    status: "approved",
    paymentStatus: "paid",
    amount: 499,
    heroVideoUrl: "/video/bg-video-mobile.mp4",
    heroBgUrl: "/images/backgrounds/FamilySection.webp",
    musicUrl: "/audio/welcome-chant.mp3",
    contact: "+91 98502 34567 / +91 98502 34568",
    address: "सोमवारा पेठ, कृष्ण काट रस्ता, कराड, सातारा - ४१५११०",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3810.123456!2d74.181234!3d17.288901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapsLink: "https://maps.google.com/?q=Somwar+Peth+Karad",
    instagramUrl: "https://instagram.com/swamisamarthmandal_karad",
    editToken: "demo-token-2",
    flowerCount: 750,
    createdAt: new Date(),
    timeline: [
      { id: "t10", mandalId: "demo-2", day: "दिवस १", title: "पारंपारिक पालखी सोहळा", subtitle: "पुणेरी पगडी व तुतारी गजरात", eventDate: "दिवस १", eventTime: "सकाळी १०:०० वा.", description: "शाही मिरवणूक आणि वैदिक सुक्तांचे पठन.", imageUrl: null, bgColor: null, displayOrder: 1, createdAt: new Date() },
    ],
    gallery: [
      { id: "g10", mandalId: "demo-2", mediaType: "image", url: "/images/gallery/gallery-2.webp", caption: "ऐतिहासिक वाडा देखावा व सिंहासन", displayOrder: 1, createdAt: new Date() },
    ],
    committee: [
      { id: "c10", mandalId: "demo-2", name: "श्री. संभाजीराव कदम", position: "अध्यक्ष", photoUrl: "/images/family/person-2.webp", phone: "+91 98502 34567", instagramUrl: null, facebookUrl: null, isDisplayed: 1, displayOrder: 1, createdAt: new Date() },
    ],
  },
  "shri-shivneri-ganesh-mandal": {
    id: "demo-3",
    refNumber: "REF-2026-SH03",
    slug: "shri-shivneri-ganesh-mandal",
    mandalName: "श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळ",
    contactPersonName: "श्री. महेश भोसले",
    email: "shivneri.satara@gmail.com",
    upiId: "shivnerimandal@oksbi",
    city: "सातारा",
    district: "सातारा",
    pincode: "४१५००१",
    establishedYear: "२००२",
    language: "mr",
    inviteMessage: "सातारा नगरीतील श्री शिवनेरी सार्वजनिक गणेशोत्सव मंडळातर्फे सर्व भाविकांना गणेशोत्सवाच्या हार्दिक शुभेच्छा! बाप्पांच्या दर्शन सोहळ्यास नक्की या.",
    themeId: "divine_saffron",
    status: "approved",
    paymentStatus: "paid",
    amount: 499,
    heroVideoUrl: "/video/bg-video-mobile.mp4",
    heroBgUrl: "/images/backgrounds/invitation-desktop-bg.png",
    musicUrl: "/audio/bhajan.mp3",
    contact: "+91 99703 45678 / +91 99703 45679",
    address: "पोवई नाका, राजवाडा रस्ता, सातारा - ४१५००१",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3816.234567!2d73.991234!3d17.688901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapsLink: "https://maps.google.com/?q=Powai+Naka+Satara",
    instagramUrl: "https://instagram.com/shivneri_ganesh_satara",
    editToken: "demo-token-3",
    flowerCount: 888,
    createdAt: new Date(),
    timeline: [
      { id: "t20", mandalId: "demo-3", day: "दिवस १", title: "गणेश आगमन सोहळा", subtitle: "भगवी आरास", eventDate: "दिवस १", eventTime: "सकाळी ९:३० वा.", description: "धार्मिक वातावरणात आगमन सोहळा.", imageUrl: null, bgColor: null, displayOrder: 1, createdAt: new Date() },
    ],
    gallery: [
      { id: "g20", mandalId: "demo-3", mediaType: "image", url: "/images/gallery/gallery-4.webp", caption: "श्री शिवनेरी गणेश दर्शन", displayOrder: 1, createdAt: new Date() },
    ],
    committee: [
      { id: "c20", mandalId: "demo-3", name: "श्री. महेश भोसले", position: "अध्यक्ष", photoUrl: "/images/family/person-3.webp", phone: "+91 99703 45678", instagramUrl: null, facebookUrl: null, isDisplayed: 1, displayOrder: 1, createdAt: new Date() },
    ],
  },
  "shri-sant-dnyaneshwar-ganesh-mandal": {
    id: "demo-4",
    refNumber: "REF-2026-SD04",
    slug: "shri-sant-dnyaneshwar-ganesh-mandal",
    mandalName: "श्री संत ज्ञानेश्वर गणेश मंडळ",
    contactPersonName: "श्री. दत्तात्रय कुलकर्णी",
    email: "dnyaneshwar.sangli@gmail.com",
    upiId: "dnyaneshwarsangli@icici",
    city: "सांगली",
    district: "सांगली",
    pincode: "४१६४१५",
    establishedYear: "१९९३",
    language: "mr",
    inviteMessage: "सांगली येथील श्री संत ज्ञानेश्वर गणेश मंडळाच्या भव्य रोषणाई व रात्र दर्शन सोहळ्यात सहकुटुंब सहभागी व्हावे ही नम्र विनंती.",
    themeId: "night_darshan",
    status: "approved",
    paymentStatus: "paid",
    amount: 499,
    heroVideoUrl: "/video/bg-video-mobile.mp4",
    heroBgUrl: "/images/backgrounds/ganpati-desktop-bg.png",
    musicUrl: "/audio/temple-bell.mp3",
    contact: "+91 94224 56789 / +91 94224 56790",
    address: "स्टेशन रोड, विश्रामबाग, सांगली - ४१६४१५",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.345678!2d74.581234!3d16.858901!2m3!1f0!0!f0!3f0!3m2!1i1024!2i768!4f13.1",
    mapsLink: "https://maps.google.com/?q=Vishrambag+Sangli",
    instagramUrl: "https://instagram.com/dnyaneshwarganeshmandal",
    editToken: "demo-token-4",
    flowerCount: 1500,
    createdAt: new Date(),
    timeline: [
      { id: "t30", mandalId: "demo-4", day: "दिवस ५", title: "दीपोत्सव व रात्र महाआरती", subtitle: "१००१ दिव्यांची आरास", eventDate: "दिवस ५", eventTime: "रात्री ८:०० वा.", description: "दीपोत्सवाची भव्य आरास.", imageUrl: null, bgColor: null, displayOrder: 1, createdAt: new Date() },
    ],
    gallery: [
      { id: "g30", mandalId: "demo-4", mediaType: "image", url: "/images/gallery/gallery-6.webp", caption: "रात्र दर्शनाची विलोभनीय रोषणाई", displayOrder: 1, createdAt: new Date() },
    ],
    committee: [
      { id: "c30", mandalId: "demo-4", name: "श्री. दत्तात्रय कुलकर्णी", position: "अध्यक्ष", photoUrl: "/images/family/person-1.webp", phone: "+91 94224 56789", instagramUrl: null, facebookUrl: null, isDisplayed: 1, displayOrder: 1, createdAt: new Date() },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mandal = (await getMandalBySlug(slug)) || DEMO_MANDALS[slug];

  return {
    title: mandal ? `${mandal.mandalName} — डिजिटल निमंत्रण` : "गणपती निमंत्रण",
    description: mandal ? mandal.inviteMessage : "गणेशोत्सव डिजिटल निमंत्रण",
    openGraph: {
      title: mandal ? mandal.mandalName : "गणपती निमंत्रण",
      description: mandal ? mandal.inviteMessage : "गणेशोत्सव डिजिटल निमंत्रण",
      images: [`/api/og?slug=${slug}`],
    },
  };
}

export default async function PublicMandalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let mandal: FullMandalData | null = await getMandalBySlug(slug);

  if (!mandal && DEMO_MANDALS[slug]) {
    mandal = DEMO_MANDALS[slug];
  }

  if (!mandal) {
    notFound();
  }

  // SUSPENDED RULE: Display dedicated suspension notice if mandal is suspended
  if (mandal.status === "suspended") {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center bg-[var(--t-bg)] text-[var(--t-text)] selection:bg-[#e8a93b] selection:text-[var(--t-bg)]">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/background3.webp"
            alt="Festive Background"
            fill
            priority
            className="object-cover object-center opacity-30"
          />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-rose-500/40 bg-[var(--t-bg-card)]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-950/60 p-3 border border-rose-500/40 shadow-md text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest">
            ॥ संकेतस्थळ स्थगित ॥
          </p>

          <h1 className="mt-2 font-display text-xl sm:text-2xl font-bold text-[var(--t-primary-light)]">
            {mandal.mandalName}
          </h1>

          <div className="mt-3 rounded-2xl border border-rose-500/40 bg-black/50 p-4 text-center">
            <p className="text-xs font-bold text-rose-300">
              🚫 स्थिती: वेबसाईट स्थगित (Suspended)
            </p>
            <p className="text-xs text-[var(--t-text-soft)] mt-1.5 leading-relaxed">
              ही गणेशोत्सव वेबसाईट प्रशासकीय कारणास्तव सुपर ॲडमिन कडून सध्या स्थगित (Suspended) करण्यात आली आहे. अधिक माहितीसाठी कृपया मंडळाशी किंवा प्लॅटफॉर्म ॲडमिनशी संपर्क साधावा.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--t-border)]">
            <Link
              href="/"
              className="inline-block rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-6 py-2.5 text-xs font-bold text-[var(--t-bg)]"
            >
              ← मुख्य पानावर जा (Home)
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // PROTECTION RULE: Website CANNOT go live before Super Admin Approval
  if (mandal.status !== "approved" && mandal.status !== "published") {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center bg-[var(--t-bg)] text-[var(--t-text)] selection:bg-[#e8a93b] selection:text-[var(--t-bg)]">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <Image
            src="/images/backgrounds/background3.webp"
            alt="Festive Background"
            fill
            priority
            className="object-cover object-center opacity-30"
          />
        </div>

        <div className="relative z-10 w-full max-w-md rounded-3xl border border-[var(--t-border)] bg-[var(--t-bg-card)]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-950/60 p-3 border border-[var(--t-border)] shadow-md text-amber-400">
            <Clock className="w-8 h-8 animate-spin" />
          </div>

          <p className="text-xs font-semibold text-[var(--t-primary)] uppercase tracking-widest">
            ॥ श्री गणेशाय नमः ॥
          </p>

          <h1 className="mt-2 font-display text-xl sm:text-2xl font-bold text-[var(--t-primary-light)]">
            {mandal.mandalName}
          </h1>

          <div className="mt-3 rounded-2xl border border-amber-500/40 bg-black/50 p-4 text-center">
            <p className="text-xs font-bold text-amber-300">
              ⏳ स्थिती: सुपर ॲडमिन मंजुरीची वाट पाहत आहे
            </p>
            <p className="text-xs text-[var(--t-text-soft)] mt-1.5 leading-relaxed">
              ही गणेशोत्सव वेबसाईट सध्या पडताळणी प्रक्रियेत आहे. सुपर ॲडमिन मंजुरीनंतर ही वेबसाईट सार्वजनिकपणे **Live** होईल.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--t-border)]">
            <Link
              href="/"
              className="inline-block rounded-xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] px-6 py-2.5 text-xs font-bold text-[var(--t-bg)]"
            >
              ← मुख्य पानावर जा (Home)
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <ThemeRenderer mandal={mandal} />;
}