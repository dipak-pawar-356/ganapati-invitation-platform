import Hero from "@/components/Hero";
import InvitationCard from "@/components/InvitationCard";
import MurtiCarousel from "@/components/MurtiCarousel";
import Timeline from "@/components/Timeline";
import Blessings from "@/components/Blessings";
import Location from "@/components/Location";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export type InvitationData = {
  mandalName: string;
  inviteLine: string;
  inviteMessage: string;
  establishedYear: string;
  murtiPhotos: string[];
  timelineEvents: any[];
  address: string;
  contact: string;
  mapEmbedUrl: string;
  mapsLink: string;
  galleryPhotos: { url: string; caption?: string }[];
  instagramUrl?: string;
};

// The exact same section order used by the real published page (app/[slug]/page.tsx).
// Rendering this from in-memory form data (before saving to the database) is what
// makes the "preview before submit" feature show a 100% accurate result.
export default function InvitationPreview({ data }: { data: InvitationData }) {
  return (
    <main>
      <Hero mandalName={data.mandalName} inviteLine={data.inviteLine} />
      <InvitationCard mandalName={data.mandalName} message={data.inviteMessage} />
      <MurtiCarousel mandalName={data.mandalName} establishedYear={data.establishedYear} photos={data.murtiPhotos} />
      <Timeline events={data.timelineEvents} />
      <Location
        mandalName={data.mandalName}
        address={data.address}
        contact={data.contact}
        mapEmbedUrl={data.mapEmbedUrl}
        mapsLink={data.mapsLink}
      />
      <Blessings />
      <Gallery photos={data.galleryPhotos} />
      <Footer mandalName={data.mandalName} contact={data.contact} address={data.address} instagramUrl={data.instagramUrl} />
    </main>
  );
}