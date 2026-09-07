import { notFound } from "next/navigation";
import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";
import EditForm from "@/components/EditForm";

export default async function EditPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (!token || token.length < 10) notFound();

  let mandal: any = null;
  try {
    const rows = await db.select().from(mandals).where(eq(mandals.editToken, token)).limit(1);
    if (rows && rows.length > 0) {
      mandal = rows[0];
    }
  } catch {
    mandal = null;
  }

  // Fallback demo mandal for edit testing if token is demo-token-1
  if (!mandal && token === "demo-token-1") {
    mandal = {
      mandal_name: "जय शंकर सार्वजनिक गणेशोत्सव मंडळ",
      language: "mr",
      invite_message: "आमच्या मंडळाच्या सुवर्ण महोत्सवी गणेशोत्सवास सर्व भाविक भक्तांना सस्नेह निमंत्रण!",
      established_year: "१९९५",
      contact: "+91 98765 43210",
      address: "शंकर नगर, गिरगाव चौक, मुंबई",
      maps_link: "https://maps.google.com/?q=Girgaon+Chowk+Mumbai",
      instagram_url: "https://instagram.com/jayshankarganeshmandal",
      timeline: [],
      gallery: [],
    };
  }

  if (!mandal) notFound();

  return (
    <main className="min-h-screen bg-[#1c0609] text-[#fef9eb] p-4">
      <EditForm token={token} initial={mandal} />
    </main>
  );
}