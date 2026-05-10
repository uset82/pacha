import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { siteDetails } from "@/lib/site";
import { ChatWidget } from "@/components/ChatWidget";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-pacha-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-pacha-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: `${siteDetails.name} | Bergen`,
    template: `%s | ${siteDetails.shortName}`,
  },
  description: "Luxury international food, Peruvian specials, and warm hospitality at Strandgaten 85 in Bergen.",
  openGraph: {
    title: `${siteDetails.name} | Bergen`,
    description: "A luxurious culinary journey in Bergen.",
    images: ["/images/polloalaparrila.jpg"],
    type: "website",
  },
  icons: {
    icon: "/pacha-mark.svg",
    apple: "/pacha-mark.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a
          href="#main"
          className="focus-ring fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-brass px-4 py-2 text-sm font-semibold text-ink transition focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
