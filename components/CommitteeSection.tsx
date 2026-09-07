"use client";

import Image from "next/image";
import { CommitteeMember } from "@/db/schema";
import { Phone, Users, Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import CornerDecoration from "@/components/common/CornerDecoration";

interface CommitteeSectionProps {
  members: CommitteeMember[];
  accentColor?: string;
  cardBg?: string;
}

export default function CommitteeSection({
  members,
  accentColor = "text-[var(--t-primary-light)]",
  cardBg = "bg-gradient-to-b from-[#2a080c]/90 via-[#1c0609]/95 to-[#120204]/95 border-[var(--t-primary)]/40",
}: CommitteeSectionProps) {
  if (!members || members.length === 0) return null;

  return (
    <section className="relative z-10 py-16 px-4 sm:px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--t-primary)]/40 bg-black/50 px-4 py-1.5 text-xs font-bold text-[var(--t-primary-light)] backdrop-blur-md mb-3 shadow-lg">
            <Users className="w-3.5 h-3.5 text-[var(--t-primary)]" />
            <span>कार्यकारिणी व उत्सव समिती</span>
          </div>
          <h2 className={`font-display text-3xl sm:text-5xl font-extrabold tracking-tight ${accentColor}`}>
            उत्सव समितीचे शिलेदार
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 bg-gradient-to-r from-transparent via-[var(--t-divider)] to-transparent rounded-full" />
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative rounded-3xl border p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_15px_35px_rgba(232,169,59,0.25)] ${cardBg}`}
            >
              {/* Corner Engraved Motifs */}
              <CornerDecoration size={28} opacity={0.3} />
              {/* Animated Glowing Top Border */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--t-divider)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl" />

              {/* Circular Photo with Golden Border & Halo Glow */}
              <div className="relative mx-auto mb-5 h-32 w-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse" />
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-3 border-[var(--t-primary)] shadow-2xl group-hover:border-[#f3d089] transition-colors">
                  <Image
                    src={member.photoUrl || "/images/family/person-1.png"}
                    alt={member.name}
                    fill
                    unoptimized
                    sizes="128px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Member Name */}
              <h3 className="font-display text-xl font-bold text-[var(--t-text)] group-hover:text-[var(--t-primary-light)] transition-colors leading-snug">
                {member.name}
              </h3>

              {/* Designation Badge */}
              <div className="mt-1.5 inline-block">
                <span className="inline-flex items-center gap-1 rounded-full border border-[var(--t-primary)]/30 bg-[#e8a93b]/10 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[var(--t-primary-light)]">
                  <Sparkles className="w-3 h-3 text-[var(--t-primary)]" />
                  <span>{member.position}</span>
                </span>
              </div>

              {/* Interactive Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2.5">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--t-primary)]/40 bg-[#e8a93b]/15 px-3.5 py-1.5 text-xs font-bold text-[var(--t-primary-light)] transition-all hover:bg-gradient-to-r hover:from-[var(--t-primary)] hover:to-[var(--t-secondary)] hover:text-[#1c0609] hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{member.phone}</span>
                  </a>
                )}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-600 hover:text-white transition-all active:scale-95"
                  aria-label="Instagram Handle"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
