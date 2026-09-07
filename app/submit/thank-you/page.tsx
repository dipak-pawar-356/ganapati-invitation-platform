import Image from "next/image";
import Link from "next/link";
import { getMandalBySlug, getMandalByRefNumber } from "@/lib/mandal-actions";
import CopyButton from "@/components/CopyButton";
import { Clock, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; ref?: string }>;
}) {
  const { slug, ref } = await searchParams;

  let mandal = null;
  if (ref) {
    mandal = await getMandalByRefNumber(ref);
  } else if (slug) {
    mandal = await getMandalBySlug(slug);
  }

  const referenceNumber = ref || mandal?.refNumber || "REF-20260907-PENDING";

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center bg-[#1c0609] text-[var(--t-text)] overflow-x-hidden selection:bg-[var(--t-selection-bg)] selection:text-[var(--t-selection-text)]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <Image
          src="/images/backgrounds/background3.webp"
          alt="Festive Background"
          fill
          priority
          className="object-cover object-center opacity-40"
        />
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-[var(--t-border)] bg-gradient-to-b from-[var(--t-bg-card)] via-[var(--t-bg)] to-[var(--t-bg-footer)] p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
        <div className="relative mb-5 flex items-center justify-center">
          <div className="animate-ganapati-float flex items-center justify-center">
            <Image
              src="/images/ganesh/ganeshmurti.png"
              alt="श्री गणपती बाप्पा"
              width={200}
              height={200}
              priority
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain select-none"
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-[var(--t-primary-light)] tracking-widest mb-1">
          ॥ श्री गणेशाय नमः ॥
        </p>

        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--t-text)]">
          आपली माहिती प्राप्त झाली आहे! 🙏
        </h1>

        {mandal && (
          <div className="mt-3 inline-block rounded-full border border-[var(--t-border)] bg-amber-950/40 px-4 py-1 text-sm font-bold text-[var(--t-primary-light)]">
            🚩 {mandal.mandalName}
          </div>
        )}

        {/* STATUS BADGE: PENDING APPROVAL */}
        <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 text-left space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
              <Clock className="w-4 h-4 animate-spin text-amber-400" />
              <span>स्थिती: सुपर ॲडमिन मंजुरीची वाट पाहत आहे (Pending Approval)</span>
            </div>
          </div>
          <p className="text-xs text-[var(--t-text)]/80 leading-relaxed">
            आपली माहिती सुरक्षितपणे जतन करण्यात आली आहे. सुपर ॲडमिनद्वारे पडताळणी व मंजुरीनंतरच तुमची वेबसाइट सार्वजनिकपणे **Live** होईल.
          </p>
        </div>

        {/* REFERENCE NUMBER DISPLAY */}
        <div className="mt-4 w-full text-left space-y-1">
          <label className="block text-xs font-semibold text-[var(--t-primary-light)]">
            📋 यूनिक संदर्भ क्रमांक (Unique Reference Number):
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--t-border)] bg-[var(--t-bg-footer)]/90 p-2.5 shadow-inner">
            <span className="flex-1 font-mono text-sm font-bold text-[var(--t-text)] truncate px-2 select-all">
              {referenceNumber}
            </span>
            <CopyButton text={referenceNumber} />
          </div>
        </div>

        {/* WORKFLOW STEPS NOTICE */}
        <div className="mt-6 text-left border-t border-[var(--t-border)] pt-4 space-y-2.5">
          <h3 className="text-xs font-bold text-[var(--t-primary-light)] uppercase tracking-wider">
            काय घडेल पुढील टप्प्यात?
          </h3>
          <ul className="space-y-2 text-xs text-[var(--t-text)]/80">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">१.</span>
              <span>सुपर ॲडमिन आपल्या मंडळाची सर्व माहिती व फोटो तपासेल.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">२.</span>
              <span>मंजुरीनंतर सिस्टीमद्वारे स्वयंचलितपणे मंडल ॲडमिन खाते तयार होईल.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">३.</span>
              <span>सुपर ॲडमिन तुम्हाला तुमचे लॉगिन यूजरनेम व पासवर्ड पाठवेल.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">४.</span>
              <span>लॉगिन केल्यानंतर तुम्ही तुमची लाइव्ह वेबसाईट कधीही एडिट करू शकाल.</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 border-t border-[var(--t-border)] pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[var(--t-primary-light)] hover:underline"
          >
            ← मुख्य पानावर परत जा (Return to Home)
          </Link>
        </div>
      </div>
    </main>
  );
}
