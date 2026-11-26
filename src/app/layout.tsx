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

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Chinese Baijiu Museum · 酒",
    template: "%s · 酒",
  },
  description:
    "酒 is a permanent editorial archive of Chinese baijiu: table signals, GB/T pure-grain truth, drinking passport, banquet survival guide, and provincial atlas.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Chinese Baijiu Museum · 酒",
    description:
      "The grain spirits China actually argues about — table signals, GB/T pure-grain standards, drinking passport, and banquet survival guide.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chinese Baijiu Museum · 酒",
    description:
      "The grain spirits China actually argues about — table signals, GB/T pure-grain standards, drinking passport, and banquet survival guide.",
  },
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
      </head>
      <body>
        <Shell>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
