"use client";

import Image from "next/image";
import { Users, Sparkles } from "lucide-react";
import CornerDecoration from "@/components/common/CornerDecoration";

interface TeamGroupPhotoSectionProps {
  teamPhotoUrl?: string | null;
  presidentGroupPhotoUrl?: string | null;
  committeeGroupPhotoUrl?: string | null;
  volunteerGroupPhotoUrl?: string | null;
  teamCaption?: string | null;
  teamDescription?: string | null;
  showTeamSection?: boolean | number | null;
  accentColor?: string;
  cardBg?: string;
}

export default function TeamGroupPhotoSection({
  teamPhotoUrl,
  presidentGroupPhotoUrl,
  committeeGroupPhotoUrl,
  volunteerGroupPhotoUrl,
  teamCaption = "मंडळ कार्यकारी संघ व स्वयंसेवक परिवार",
  teamDescription = "उत्सव यशस्वी करण्यासाठी अहोरात्र परिश्रम घेणारे आमचे सर्व कार्यकर्ते व उत्सव समिती.",
  showTeamSection = 1,
  accentColor = "text-[#f3d089]",
  cardBg = "bg-gradient-to-b from-[#2a080c]/90 via-[#1c0609]/95 to-[#120204]/95 border-[#e8a93b]/40",
}: TeamGroupPhotoSectionProps) {
  if (showTeamSection === 0 || showTeamSection === false) return null;

  const photos = [
    { title: "मुख्य मंडळ संघ फोटो", url: teamPhotoUrl },
    { title: "अध्यक्ष व पदाधिकारी संघ", url: presidentGroupPhotoUrl },
    { title: "कार्यकारिणी समिती फोटो", url: committeeGroupPhotoUrl },
    { title: "स्वयंसेवक व युवा संघ", url: volunteerGroupPhotoUrl },
  ].filter((p) => p.url);

  if (photos.length === 0) return null;

  return (
    <section className="relative z-10 py-14 px-4 sm:px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-10 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#e8a93b]/40 bg-black/50 px-4 py-1.5 text-xs font-bold text-[#f3d089] backdrop-blur-md mb-3 shadow-lg">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>{teamCaption || "मंडळ कार्यसंघ"}</span>
          </div>
          <h2 className={`font-display text-2xl sm:text-4xl font-extrabold tracking-tight ${accentColor}`}>
            उत्सव मंडळ ग्रुप फोटो
          </h2>
          {teamDescription && (
            <p className="mt-2 text-xs sm:text-sm text-[#fef9eb]/75 max-w-2xl mx-auto leading-relaxed">
              {teamDescription}
            </p>
          )}
          <div className="mx-auto mt-3 h-1 w-20 bg-gradient-to-r from-transparent via-[#e8a93b] to-transparent rounded-full" />
        </div>

        {/* Group Photos Grid */}
        <div className={`grid grid-cols-1 ${photos.length > 1 ? "md:grid-cols-2" : "max-w-3xl mx-auto"} gap-6 sm:gap-8`}>
          {photos.map((item, index) => (
            <div
              key={index}
              className={`group relative rounded-3xl border p-4 sm:p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 shadow-2xl overflow-hidden ${cardBg}`}
            >
              <CornerDecoration size={24} opacity={0.3} />

              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border-2 border-[#e8a93b]/40 bg-black">
                <Image
                  src={item.url!}
                  alt={item.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-black/60 px-3 py-1 text-xs font-bold text-[#f3d089] backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{item.title}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
