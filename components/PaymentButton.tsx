"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentButton({ slug, amountLabel = "₹499" }: { slug: string; amountLabel?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay load nahi hua, internet check karo.");

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Order create nahi hua.");

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: "INR",
        name: "Ganpati Invitation",
        description: order.mandalName,
        order_id: order.orderId,
        method: { upi: true, card: false, netbanking: false, wallet: false, paylater: false, emi: false },
        prefill: { contact: order.contact },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verify = await verifyRes.json();
          if (verify.success) {
            router.push(`/${slug}`);
          } else {
            setError("Payment zala lekin verify fail hua, admin se contact karo.");
          }
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: "#f59e0b" },
      });

      rzp.open();
    } catch (e: any) {
      setError(e.message || "Kuch galat zala.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="px-8 py-3 rounded-full bg-orange-500 text-white font-semibold disabled:opacity-50"
      >
        {loading ? "प्रतीक्षा करा..." : `Pay ${amountLabel} Now (UPI)`}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}