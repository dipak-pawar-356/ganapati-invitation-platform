import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { mandals } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, slug } = await request.json();

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (slug) {
    await db
      .update(mandals)
      .set({ paymentStatus: "paid", status: "approved" })
      .where(eq(mandals.slug, slug));
  }

  return NextResponse.json({ success: true, slug });
}