import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CANARDO Floor Care — A Cleaner Home. A Fresher Everyday.",
    template: "%s | CANARDO Floor Care",
  },
  description:
    "Discover CANARDO Floor Care: premium floor cleaning liquids in six refreshing fragrances, plus a considered hand liquid wash for everyday care.",
  keywords: [
    "CANARDO",
    "CANARDO Floor Care",
    "floor cleaner",
    "floor cleaning liquid",
    "hand wash",
    "household cleaning products",
  ],
  openGraph: {
    title: "CANARDO Floor Care — A Cleaner Home. A Fresher Everyday.",
    description:
      "Premium cleaning essentials designed to bring freshness and cleanliness to your everyday life.",
    url: siteUrl(),
    siteName: "CANARDO Floor Care",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CANARDO Floor Care",
    description:
      "Premium cleaning essentials designed for a cleaner home and a fresher everyday.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#123D2B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
