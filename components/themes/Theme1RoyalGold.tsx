"use client";

import SectionDivider from "@/components/common/SectionDivider";
import Hero from "@/components/Hero";
import InvitationCard from "@/components/InvitationCard";
import PdfInvitationCard from "@/components/PdfInvitationCard";
import Timeline from "@/components/Timeline";
import Blessings from "@/components/Blessings";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";
import CommitteeSection from "@/components/CommitteeSection";
import TeamGroupPhotoSection from "@/components/TeamGroupPhotoSection";
import HeroVideoSection from "@/components/HeroVideoSection";
import WhatsAppInviteWidget from "@/components/WhatsAppInviteWidget";
import GoogleMapSection from "@/components/GoogleMapSection";
import DonationWidget from "@/components/DonationWidget";
import { FestiveAudioAndBlessing } from "@/components/FestiveAudioAndBlessing";
import { RoyalGoldDecorations } from "@/components/common/ThemeDecorations";
import { FullMandalData } from "@/lib/mandal-actions";

export default function Theme1RoyalGold({ mandal }: { mandal: FullMandalData }) {
  const galleryPhotos = mandal.gallery.map((item) => ({
    url: item.url,
    caption: item.caption || undefined,
  }));

  const timelineEvents = mandal.timeline.map((event) => ({
    title: event.title,
    summary: event.description || event.subtitle || "",
    date: event.eventDate,
    time: event.eventTime,
    place: mandal.address,
  }));

  return (
    <div className="relative min-h-screen bg-[#1c0609] text-[#fef9eb] selection:bg-[#e8a93b] selection:text-black overflow-x-hidden">
      {/* Background Image Texture - Royal Gold Temple */}
      <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/hero-background-desktop.webp')] bg-cover bg-center opacity-35 mix-blend-overlay pointer-events-none" />

      {/* Royal Temple Theme Specific Decorations (Bells, Garlands, Lamps) */}
      <RoyalGoldDecorations />

      {/* Royal Temple Gold Theme Banner */}
      <div className="relative z-20 w-full border-b border-[#e8a93b]/40 bg-[#2a0a0e]/95 py-2.5 px-4 text-center text-xs font-extrabold text-[#f3d089] tracking-widest backdrop-blur-md">
        <span>👑 राजेशाही सुवर्ण महागणेशोत्सव • {mandal.mandalName} 🚩</span>
      </div>

      {/* Hero Section */}
      <Hero
        mandalName={mandal.mandalName}
        inviteLine={mandal.inviteMessage}
        heroVideoUrl={mandal.heroVideoUrl}
      />

      <SectionDivider />

      {/* Invitation Card */}
      <InvitationCard
        mandalName={mandal.mandalName}
        message={mandal.inviteMessage}
      />

      <PdfInvitationCard
        mandalName={mandal.mandalName}
        message={mandal.inviteMessage}
        address={mandal.address}
        contact={mandal.contact}
        slug={mandal.slug}
        pdfCardImageUrl={mandal.pdfCardImageUrl || undefined}
      />

      {/* Hero Video */}
      {mandal.heroVideoUrl && (
        <>
          <SectionDivider />
          <HeroVideoSection
            videoUrl={mandal.heroVideoUrl}
            mandalName={mandal.mandalName}
          />
        </>
      )}

      <SectionDivider />

      {/* Timeline Section */}
      <Timeline events={timelineEvents} />

      <SectionDivider />

      {/* Gallery Section */}
      <Gallery photos={galleryPhotos} />

      <SectionDivider />

      {/* Committee Section */}
      <CommitteeSection members={mandal.committee} />

      {/* Team Group Photos Section */}
      <TeamGroupPhotoSection
        teamPhotoUrl={mandal.teamPhotoUrl}
        presidentGroupPhotoUrl={mandal.presidentGroupPhotoUrl}
        committeeGroupPhotoUrl={mandal.committeeGroupPhotoUrl}
        volunteerGroupPhotoUrl={mandal.volunteerGroupPhotoUrl}
        teamCaption={mandal.teamCaption}
        teamDescription={mandal.teamDescription}
        showTeamSection={mandal.showTeamSection}
      />

      <SectionDivider />

      {/* Online Donation Section */}
      <DonationWidget
        mandalId={mandal.id}
        mandalName={mandal.mandalName}
        upiId={mandal.upiId || undefined}
        accountHolder={mandal.accountHolder || mandal.mandalName}
        qrCodeUrl={mandal.qrCodeUrl || undefined}
        contactPhone={mandal.supportMobile || mandal.mobileNumber || mandal.contact}
      />

      {/* Blessings Section */}
      <Blessings />

      {/* WhatsApp Invite Widget */}
      <WhatsAppInviteWidget mandalName={mandal.mandalName} slug={mandal.slug} />

      <SectionDivider />

      {/* Location / Google Map Section */}
      <GoogleMapSection
        mandalName={mandal.mandalName}
        address={mandal.address}
        contact={mandal.contact}
        mapEmbedUrl={mandal.mapEmbedUrl}
        mapsLink={mandal.mapsLink}
      />

      {/* Footer */}
      <Footer
        mandalName={mandal.mandalName}
        contact={mandal.contact}
        address={mandal.address}
        instagramUrl={mandal.instagramUrl || undefined}
        slug={mandal.slug}
      />

      {/* Audio, Bell & Live Flower Counter */}
      <FestiveAudioAndBlessing />
    </div>
  );
}
