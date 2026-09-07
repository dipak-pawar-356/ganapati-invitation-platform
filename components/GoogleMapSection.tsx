"use client";

import { MapPin, Navigation, Phone, MessageSquare, Clock, Car, Bus, Accessibility, Compass, ShieldCheck } from "lucide-react";
import Image from "next/image";
import CornerDecoration from "@/components/common/CornerDecoration";

interface GoogleMapSectionProps {
  mandalName: string;
  address: string;
  contact: string;
  mapEmbedUrl?: string | null;
  mapsLink?: string | null;
}

export default function GoogleMapSection({
  mandalName,
  address,
  contact,
  mapEmbedUrl,
  mapsLink,
}: GoogleMapSectionProps) {
  const defaultEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const defaultLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const embedSrc = mapEmbedUrl || defaultEmbed;
  const directLink = mapsLink || defaultLink;

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Temple Card Wrapper with Golden Corner Accents & Ornate Border */}
        <div className="relative rounded-3xl border-2 border-[var(--t-primary)]/50 bg-gradient-to-b from-[var(--t-bg-card)] via-[var(--t-bg)] to-[var(--t-bg-footer)] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          {/* Corner Engraved Motifs */}
          <CornerDecoration size={32} opacity={0.35} />
          {/* Background Ornate Texture */}
          <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/location-background.png')] bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none rounded-3xl" />

          {/* Four Ornate Golden Corners */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-3 border-l-3 border-[var(--t-primary)]" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-3 border-r-3 border-[var(--t-primary)]" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-3 border-l-3 border-[var(--t-primary)]" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-3 border-r-3 border-[var(--t-primary)]" />

          {/* Section Header */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--t-primary)]/40 bg-[var(--t-primary-badge)] px-4 py-1.5 text-xs font-extrabold text-[var(--t-primary-light)] backdrop-blur-md mb-2 shadow-md">
              <MapPin className="w-4 h-4 text-[var(--t-primary)]" />
              <span>📍 मंदिर व देखावा स्थान (Temple Location)</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-[var(--t-primary-light)]">
              {mandalName} दर्शन स्थान
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--t-text)]/80 font-medium max-w-lg mx-auto leading-relaxed">
              &quot;गणपती बाप्पांच्या दर्शनासाठी सर्व भाविक भक्तांचे सहर्ष स्वागत आहे.&quot;
            </p>
          </div>

          {/* Main Grid: Embedded Map Left, Info & Actions Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
            {/* Left Column: Embedded Map */}
            <div className="lg:col-span-7 relative overflow-hidden rounded-2xl border-2 border-[var(--t-primary)]/40 shadow-2xl min-h-[320px] lg:min-h-[400px]">
              <iframe
                src={embedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${mandalName} Google Map`}
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Right Column: Address Details & Action Buttons */}
            <div className="lg:col-span-5 rounded-2xl border border-[var(--t-primary)]/35 bg-black/50 p-6 backdrop-blur-md flex flex-col justify-between text-left space-y-5 shadow-xl">
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--t-primary-light)] mb-2">{mandalName}</h3>
                <p className="text-xs sm:text-sm text-[var(--t-text)]/90 flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 text-[var(--t-primary)] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </p>

                <div className="mt-5 pt-4 border-t border-white/10 space-y-2.5 text-xs text-[var(--t-text)]/85">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>संपर्क क्रमांक: <strong className="text-amber-200">{contact}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[var(--t-primary)]" />
                    <span>दर्शन वेळ: <strong className="text-amber-200">सकाळी ६:०० ते रात्री १२:००</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Navigate, Call, WhatsApp */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <a
                  href={directLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--t-primary)] to-[var(--t-secondary)] py-3.5 text-xs sm:text-sm font-bold text-[var(--t-bg)] shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Google Maps वर दिशा शोधा (Navigate)</span>
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${contact}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    <span>कॉल्स करा</span>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${contact.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/50 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Route & Amenity Badges */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center relative z-10">
            <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-3 text-xs">
              <Compass className="w-4 h-4 text-[var(--t-primary)] mx-auto mb-1" />
              <p className="font-bold text-amber-200">जवळचे लँडमार्क</p>
              <p className="text-[10px] text-[var(--t-text)]/70 mt-0.5">मुख्य बस स्थानकाजवळ</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-3 text-xs">
              <Car className="w-4 h-4 text-[var(--t-primary)] mx-auto mb-1" />
              <p className="font-bold text-amber-200">पार्किंग सोय</p>
              <p className="text-[10px] text-[var(--t-text)]/70 mt-0.5">२ व ४ चाकी वाहने उपलब्ध</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-3 text-xs">
              <Accessibility className="w-4 h-4 text-[var(--t-primary)] mx-auto mb-1" />
              <p className="font-bold text-amber-200">व्हीलचेअर सोय</p>
              <p className="text-[10px] text-[var(--t-text)]/70 mt-0.5">ज्येष्ठांसाठी सुलभ दर्शन</p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-black/40 p-3 text-xs">
              <Bus className="w-4 h-4 text-[var(--t-primary)] mx-auto mb-1" />
              <p className="font-bold text-amber-200">सार्वजनिक वाहतूक</p>
              <p className="text-[10px] text-[var(--t-text)]/70 mt-0.5">सिटी बस व ऑटो सेवा</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
