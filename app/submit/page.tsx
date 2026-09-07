import SubmitForm from "@/components/SubmitForm";

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#140407] text-[var(--t-text)] selection:bg-[var(--t-selection-bg)] selection:text-[var(--t-selection-text)] relative">
      {/* Background Texture */}
      <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/submitform-bg.png')] bg-cover bg-center opacity-30 mix-blend-overlay pointer-events-none" />

      {/* Top Banner */}
      <div className="relative z-10 w-full border-b border-[var(--t-border)] bg-[var(--t-bg-card)]/90 py-2.5 px-4 text-center text-xs font-bold text-[var(--t-primary-light)] backdrop-blur-md">
        <span>॥ श्री गणेशाय नमः ॥ • डिजिटल निमंत्रण वेबसाइट निर्मिती सोहळा 🚩</span>
      </div>

      <SubmitForm />
    </main>
  );
}
