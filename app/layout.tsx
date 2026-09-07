import type { Metadata } from "next";
import { Rozha_One, Mukta } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const rozhaOne = Rozha_One({
  weight: "400",
  subsets: ["devanagari", "latin"],
  variable: "--font-display",
  display: "swap",
});

const mukta = Mukta({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "डिजिटल गणपती निमंत्रण प्लॅटफॉर्म | Adviks SoftTech",
  description: "आपल्या गणेश मंडळाचे सुंदर animated निमंत्रण मोफत तयार करा — WhatsApp वर सहज शेअर करा.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ganapati-invitation-platform.vercel.app"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${rozhaOne.variable} ${mukta.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}