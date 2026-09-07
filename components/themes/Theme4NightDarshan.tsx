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
import { NightDarshanDecorations } from "@/components/common/ThemeDecorations";
import { FullMandalData } from "@/lib/mandal-actions";

export default function Theme4NightDarshan({ mandal }: { mandal: FullMandalData }) {
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
    <div className="relative min-h-screen bg-[#050b14] text-[#e0f2fe] selection:bg-[#38bdf8] selection:text-black overflow-x-hidden">
      {/* Background Texture - Night Darshan Deep Blue & Gold Glow */}
      <div className="fixed inset-0 -z-10 bg-[url('/images/backgrounds/ganpati-desktop-bg.png')] bg-cover bg-center opacity-40 mix-blend-color-dodge pointer-events-none" />

      {/* Night Darshan Theme Specific Decorations */}
      <NightDarshanDecorations />

      {/* Night Darshan Top Header Banner */}
      <div className="relative z-20 w-full border-b border-[#38bdf8]/35 bg-[#091527]/90 py-2.5 px-4 text-center text-xs font-bold text-[#7dd3fc] backdrop-blur-md">
        <span>🌙 शांत व मंगलमय दिव्य रात्र दर्शन सोहळा • {mandal.mandalName} 🪔</span>
      </div>

      <Hero
        mandalName={mandal.mandalName}
        inviteLine={mandal.inviteMessage}
        heroVideoUrl={mandal.heroVideoUrl}
      />

      <SectionDivider />

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

      <Timeline events={timelineEvents} />

      <SectionDivider />

      <Gallery photos={galleryPhotos} />

      <SectionDivider />

      <CommitteeSection
        members={mandal.committee}
        accentColor="text-[#7dd3fc]"
        cardBg="bg-[#0b1d38]/85 border-[#38bdf8]/35"
      />

      <TeamGroupPhotoSection
        teamPhotoUrl={mandal.teamPhotoUrl}
        presidentGroupPhotoUrl={mandal.presidentGroupPhotoUrl}
        committeeGroupPhotoUrl={mandal.committeeGroupPhotoUrl}
        volunteerGroupPhotoUrl={mandal.volunteerGroupPhotoUrl}
        teamCaption={mandal.teamCaption}
        teamDescription={mandal.teamDescription}
        showTeamSection={mandal.showTeamSection}
        accentColor="text-[#7dd3fc]"
        cardBg="bg-[#0b1d38]/85 border-[#38bdf8]/35"
      />

      <SectionDivider />

      <DonationWidget
        mandalId={mandal.id}
        mandalName={mandal.mandalName}
        upiId={mandal.upiId || undefined}
        accountHolder={mandal.accountHolder || mandal.mandalName}
        qrCodeUrl={mandal.qrCodeUrl || undefined}
        contactPhone={mandal.supportMobile || mandal.mobileNumber || mandal.contact}
      />

      <Blessings />

      <WhatsAppInviteWidget mandalName={mandal.mandalName} slug={mandal.slug} />

      <SectionDivider />

      <GoogleMapSection
        mandalName={mandal.mandalName}
        address={mandal.address}
        contact={mandal.contact}
        mapEmbedUrl={mandal.mapEmbedUrl}
        mapsLink={mandal.mapsLink}
      />

      <Footer
        mandalName={mandal.mandalName}
        contact={mandal.contact}
        address={mandal.address}
        instagramUrl={mandal.instagramUrl || undefined}
        slug={mandal.slug}
      />

      <FestiveAudioAndBlessing />
    </div>
  );
}
