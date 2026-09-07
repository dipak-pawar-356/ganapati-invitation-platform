import Image from "next/image";
import PersonalizedInviteWidget from "@/components/PersonalizedInviteWidget";
import { Phone, MapPin, ExternalLink, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

type FooterProps = {
  mandalName: string;
  contact: string;
  address: string;
  instagramUrl?: string;
  slug?: string;
};

export default function Footer({
  mandalName,
  contact,
  address,
  instagramUrl,
  slug,
}: FooterProps) {
  return (
    <footer className="relative overflow-hidden pt-12 pb-8 px-4 text-center select-none bg-[var(--t-bg-footer)] text-[var(--t-text)]">

      {/* Responsive Background Textures */}
      <Image
        src="/images/backgrounds/footer-background.png"
        alt=""
        fill
        priority={false}
        className="pointer-events-none hidden md:block absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-40 mix-blend-overlay"
      />
      <Image
        src="/images/backgrounds/footer-mobile-background.png"
        alt=""
        fill
        priority={false}
        className="pointer-events-none md:hidden absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-50 mix-blend-overlay"
      />

      {/* Temple Silhouette at Bottom */}
      <div className="absolute bottom-0 inset-x-0 w-full opacity-30 mix-blend-screen pointer-events-none -z-10">
        <Image
          src="/images/temple/मंदिराचा फिका silhouette.png"
          alt=""
          width={1400}
          height={300}
          unoptimized
          className="w-full h-auto object-cover object-bottom"
        />
      </div>

      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#110305]/80 via-[#1a0407]/90 to-[#0b0103]/98" />

      {/* Main Footer Container */}
      <div className="relative z-20 mx-auto max-w-2xl pt-4">
        {/* Ganapati Idol Image */}
        <div className="relative mx-auto mb-3 h-20 w-20 flex items-center justify-center">
          <Image
            src="/images/ganapati/ganapati-murti.png"
            alt={mandalName}
            width={80}
            height={80}
            unoptimized
            className="w-full h-auto object-contain filter drop-shadow-[0_8px_20px_rgba(232,169,59,0.5)]"
          />
        </div>

        {/* Sacred Mantra */}
        <p className="text-xs font-bold tracking-[0.25em] text-[var(--t-primary)] uppercase">
          ॥ श्री गणेशाय नमः ॥
        </p>

        {/* Mandal Title */}
        <h2 className="mt-1 font-display text-2xl sm:text-4xl font-extrabold text-[var(--t-primary-light)]">
          {mandalName}
        </h2>

        {/* Tagline */}
        <p className="mt-1 text-xs sm:text-sm font-semibold text-amber-200/90">
          गणपती बाप्पा मोरया! • भक्ती, श्रद्धा आणि एकतेचा उत्सव
        </p>

        {/* Decorative Divider */}
        <div className="my-6 flex items-center justify-center gap-2">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#e8a93b]" />
          <div className="w-2.5 h-2.5 rotate-45 border border-[var(--t-primary)] bg-[#2a080c]" />
          <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#e8a93b]" />
        </div>

        {/* Contact, Address & WhatsApp Widget */}
        <div className="mx-auto flex max-w-md flex-col gap-3 text-left">
          {slug && <PersonalizedInviteWidget mandalName={mandalName} slug={slug} />}

          {/* Contact Box */}
          <div className="rounded-2xl border border-[var(--t-primary)]/25 bg-black/50 p-4 backdrop-blur-md flex items-center gap-3">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-emerald-300 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[var(--t-primary)] uppercase">संपर्क माहिती</p>
              <p className="text-xs sm:text-sm font-bold text-amber-50">{contact}</p>
            </div>
          </div>

          {/* Address Box */}
          <div className="rounded-2xl border border-[var(--t-primary)]/25 bg-black/50 p-4 backdrop-blur-md flex items-center gap-3">
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-2.5 text-[var(--t-primary-light)] shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[var(--t-primary)] uppercase">मंडळ / देखावा पत्ता</p>
              <p className="text-xs sm:text-sm font-medium text-amber-50 leading-relaxed">{address}</p>
            </div>
          </div>

          {/* Instagram Link */}
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-pink-500/30 bg-black/50 p-4 backdrop-blur-md flex items-center justify-between gap-3 hover:border-pink-500/60 hover:bg-pink-950/20 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-pink-500/40 bg-pink-950/40 p-2.5 text-pink-400 shrink-0">
                  <FaInstagram className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-pink-300 uppercase">सोशल मीडिया</p>
                  <p className="text-xs sm:text-sm font-bold text-amber-50">अधिकृत Instagram पेज</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-pink-300" />
            </a>
          )}
        </div>

        {/* Adviks SoftTech Branding Box */}
        <div className="mt-8 mx-auto max-w-xs rounded-2xl border border-[var(--t-primary)]/30 bg-black/60 p-3 backdrop-blur-md flex items-center justify-center gap-3 shadow-lg">
          <div className="relative h-9 w-9 rounded-xl border border-[var(--t-primary)]/40 bg-white/95 p-1 shadow-sm shrink-0">
            <Image
              src="/branding/adviks-logo.png"
              alt="Adviks SoftTech"
              width={36}
              height={36}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold tracking-wider text-[var(--t-primary)] uppercase">Platform Powered By</p>
            <p className="text-xs font-extrabold text-[var(--t-primary-light)]">Adviks SoftTech</p>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-[10px] sm:text-xs leading-relaxed text-amber-200/60 font-medium">
          © 2026 {mandalName}. सर्व हक्क राखीव.
          <br />
          डिजिटल गणेशोत्सव निमंत्रण प्लॅटफॉर्म • Developed with ❤️ by Dipak Pawar
        </p>
      </div>
    </footer>
  );
}