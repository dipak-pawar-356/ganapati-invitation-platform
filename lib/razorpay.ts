import "server-only";
import Razorpay from "razorpay";

let _razorpay: Razorpay | null = null;

// Lazy singleton — client sirf tab banega jab pehli baar actual request aayegi,
// build-time page-data collection ke waqt nahi. Isse env vars missing hone par
// build fail nahi hoga, sirf us route ko call karne par error aayega.
export function getRazorpay() {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _razorpay;
}