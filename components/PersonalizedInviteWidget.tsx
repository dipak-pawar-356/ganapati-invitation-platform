"use client";

import { useState } from "react";

type PersonalizedInviteWidgetProps = {
  mandalName: string;
  slug: string;
};

export default function PersonalizedInviteWidget({ mandalName, slug }: PersonalizedInviteWidgetProps) {
  const [guestName, setGuestName] = useState("");

  const handleSend = () => {
    const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://ganapati-invitation-platform-phi.vercel.app";
    const inviteUrl = `${siteUrl}/${slug}`;
    const greeting = guestName.trim() ? `${guestName.trim()} जी,` : "नमस्कार,";

    const message = `🙏 ${greeting}\n\n${mandalName} तर्फे आपणास सस्नेह निमंत्रण! 🐘✨\n\nकृपया खालील लिंकवर आमचे सुंदर डिजिटल निमंत्रण पहा:\n${inviteUrl}\n\nगणपती बाप्पा मोरया! 🚩`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="rounded-xl border border-amber-300/15 bg-black/35 px-4 py-4 text-left backdrop-blur-sm">
      <p className="flex items-center gap-2 text-sm font-bold text-amber-300">
        <span>🔗</span>
        मित्रांना वैयक्तिक निमंत्रण पाठवा
      </p>
      <p className="mt-0.5 text-[11px] text-amber-300/60">(Personalized Invite)</p>

      <p className="mt-2.5 text-xs leading-relaxed text-amber-100/80">
        पाहुण्यांचे नाव टाकून थेट त्यांच्या नावासह WhatsApp वर सस्नेह निमंत्रण पाठवा:
      </p>

      <input
        type="text"
        value={guestName}
        onChange={(e) => setGuestName(e.target.value)}
        placeholder="पाहुण्याचे नाव (उदा. श्री. राहुल शिंदे)"
        suppressHydrationWarning
        className="mt-3 w-full rounded-xl border border-amber-300/20 bg-black/40 px-4 py-3 text-sm text-amber-50 placeholder:text-amber-100/30 outline-none focus:border-amber-400/50"
      />

      <button
        type="button"
        onClick={handleSend}
        suppressHydrationWarning
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-transform active:scale-[0.98] cursor-pointer"
      >
        <span>✈️</span>
        WhatsApp वर पाठवा
      </button>
    </div>
  );
}