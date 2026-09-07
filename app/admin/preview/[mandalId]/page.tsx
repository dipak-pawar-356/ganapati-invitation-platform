import { notFound } from "next/navigation";
import { db } from "@/db";
import { mandals, timelineEvents, galleryItems, committeeMembers } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { requirePlatformAdmin } from "@/lib/auth";
import ThemeRenderer from "@/components/themes/ThemeRenderer";
import { FullMandalData } from "@/lib/mandal-actions";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function AdminMandalPreviewPage({
  params,
}: {
  params: Promise<{ mandalId: string }>;
}) {
  await requirePlatformAdmin();
  const { mandalId } = await params;

  const mandalRows = await db.select().from(mandals).where(eq(mandals.id, mandalId)).limit(1);
  if (!mandalRows || mandalRows.length === 0) {
    notFound();
  }

  const mandal = mandalRows[0];

  const [events, gallery, committee] = await Promise.all([
    db.select().from(timelineEvents).where(eq(timelineEvents.mandalId, mandal.id)).orderBy(asc(timelineEvents.displayOrder)),
    db.select().from(galleryItems).where(eq(galleryItems.mandalId, mandal.id)).orderBy(asc(galleryItems.displayOrder)),
    db.select().from(committeeMembers).where(eq(committeeMembers.mandalId, mandal.id)).orderBy(asc(committeeMembers.displayOrder)),
  ]);

  const fullMandalData: FullMandalData = {
    ...mandal,
    timeline: events,
    gallery,
    committee,
  };

  return (
    <main className="min-h-screen bg-[var(--admin-card)] text-[var(--admin-text)] relative selection:bg-[var(--admin-gold)] selection:text-black">
      {/* Top Banner Notice: Admin Only Preview */}
      <div className="sticky top-0 z-50 w-full border-b border-amber-500/40 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 py-2.5 px-4 text-center text-xs font-bold text-amber-100 flex items-center justify-center gap-3 shadow-lg">
        <Lock className="w-4 h-4 text-amber-300" />
        <span>॥ सुपर ॲडमिन प्रिव्ह्यू (Not Public Yet) • {mandal.mandalName} ॥</span>
        <Link
          href="/admin"
          className="rounded-full bg-black/40 px-3 py-1 text-[11px] text-amber-200 hover:bg-black/60 transition-all ml-2"
        >
          ← Back to Admin Panel
        </Link>
      </div>

      <ThemeRenderer mandal={fullMandalData} />
    </main>
  );
}
