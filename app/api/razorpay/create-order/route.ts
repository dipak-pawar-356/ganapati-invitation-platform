import { NextResponse } from "next/server";
import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const razorpay = getRazorpay();
  const { slug } = await request.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  try {
    const rows = await db.select().from(mandals).where(eq(mandals.slug, slug)).limit(1);
    if (!rows || rows.length === 0) return NextResponse.json({ error: "Mandal not found" }, { status: 404 });
    const mandal = rows[0];

    if (mandal.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });

    const amountPaise = (mandal.amount ?? 499) * 100;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: slug,
      notes: { slug },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: amountPaise,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      mandalName: mandal.mandalName,
      contact: mandal.contact,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Payment creation failed" }, { status: 500 });
  }
}