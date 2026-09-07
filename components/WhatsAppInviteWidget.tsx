"use client";

import { useState, useEffect } from "react";
import { Share2, Send, Check } from "lucide-react";

interface WhatsAppInviteWidgetProps {
  mandalName: string;
  slug: string;
  address?: string;
  contact?: string;
}

const DEFAULT_SITE_URL = "https://ganapati-invitation-platform-phi.vercel.app";

export default function WhatsAppInviteWidget({
  mandalName,
  slug,
  address = "",
  contact = "",
}: WhatsAppInviteWidgetProps) {
  const [guestName, setGuestName] = useState("");
  const [copied, setCopied] = useState(false);
  const [siteUrl, setSiteUrl] = useState(
    process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setSiteUrl(window.location.origin);
    }
  }, []);

  const mandalUrl = `${siteUrl}/${slug}`;

  const message = `🚩 *सस्नेह निमंत्रण* 🚩

${guestName ? `प्रिय *${guestName}*,` : "प्रिय मित्र / नातेवाईक,"}

आपण आणि आपल्या परिवारास *${mandalName}* यांच्या गणेशोत्सवासाठी आग्रहाचे निमंत्रण! 🙏✨

${address ? `📍 *पत्ता:* ${address}\n` : ""}${contact ? `📞 *संपर्क:* ${contact}\n` : ""}🌐 *डिजिटल निमंत्रण पत्रिका लिंक:*
👉 ${mandalUrl}

आपली उपस्थिती हेच आमचे भाग्य!
*गणपती बाप्पा मोरया!* 🌺🙏`;

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative z-10 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-[#25D366]/40 bg-gradient-to-b from-[#0c2415]/80 via-[#06140b]/90 to-[#030a05]/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/20 text-[#25D366] mb-3">
          <Share2 className="w-6 h-6" />
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--t-text)]">
          मित्रांना वैयक्तिक निमंत्रण पाठवा
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-[var(--t-text)]/80 max-w-md mx-auto">
          पाहुण्यांचे नाव लिहा आणि एका क्लिकमध्ये त्यांच्या नावाने वैयक्तिक निमंत्रण WhatsApp वर पाठवा!
        </p>

        {/* Input box */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="पाहुण्यांचे नाव टाका (उदा. काका / शर्मा कुटुंब)"
            suppressHydrationWarning
            className="flex-1 rounded-2xl border border-[#25D366]/40 bg-black/50 px-4 py-3 text-sm text-[var(--t-text)] placeholder-[#fef9eb]/40 focus:border-[#25D366] focus:outline-none backdrop-blur-sm"
          />
          <button
            type="button"
            onClick={handleCopy}
            suppressHydrationWarning
            className="rounded-2xl border border-[#25D366]/50 bg-black/40 px-4 py-3 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : null}
            <span>{copied ? "Copied!" : "कॉपी करा"}</span>
          </button>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-7 py-3.5 text-sm sm:text-base font-bold text-[#06140b] shadow-lg shadow-[#25D366]/30 hover:bg-[#20bd5a] active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>WhatsApp वर निमंत्रण पाठवा</span>
          </a>
        </div>
      </div>
    </section>
  );
}
