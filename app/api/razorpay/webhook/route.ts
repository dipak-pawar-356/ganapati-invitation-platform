import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_placeholder")
    .update(rawBody)
    .digest("hex");

  if (expected !== signature && process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  return NextResponse.json({ received: true });
}