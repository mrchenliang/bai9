import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Shell } from "@/components/shell";
import "./globals.css";

const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const siteDescription =
  "Chinese Baijiu Museum (酒) — a permanent editorial archive of China’s grain spirits: tier system, table signals, GB/T standards, and drinking passport.";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Chinese Baijiu Museum · 酒",
    template: "%s · 酒",
  },
  description: siteDescription,
  keywords: [
    "baijiu",
    "Chinese liquor",
    "Moutai",
    "Wuliangye",
    "酱香",
    "白酒博物馆",
    "baijiu tier system",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Chinese Baijiu Museum · 酒",
    description: "The grain spirits China actually argues about.",
    type: "website",
    siteName: "Chinese Baijiu Museum",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese Baijiu Museum · 酒",
    description: "The grain spirits China actually argues about.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Museum",
  name: "Chinese Baijiu Museum",
  alternateName: ["酒", "中国白酒博物馆"],
  description: siteDescription,
  url: siteOrigin,
  sameAs: ["https://x.com/mr_chenliang"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+SC:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
