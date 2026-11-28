import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { Shell } from "@/components/shell";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteOrigin } from "@/lib/site";
import "./globals.css";

const origin = siteOrigin();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: `${SITE_NAME} · 酒`,
    template: "%s · 酒",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "baijiu",
    "Chinese liquor",
    "Chinese Baijiu Museum",
    "Moutai",
    "Wuliangye",
    "National Cellar 1573",
    "酱香",
    "浓香",
    "白酒博物馆",
    "baijiu tier system",
    "国宴",
    "名酒",
  ],
  authors: [{ name: "Chen Liang", url: "https://x.com/mr_chenliang" }],
  creator: "Chen Liang",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "48x48" },
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico?v=2"],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg?v=2", color: "#c41e1e" },
      { rel: "apple-touch-icon-precomposed", url: "/apple-touch-icon-precomposed.png?v=2" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "酒",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: `${SITE_NAME} · 酒`,
    description: SITE_TAGLINE,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: origin,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · 酒`,
    description: SITE_TAGLINE,
    creator: "@mr_chenliang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "food and drink",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: ["酒", "中国白酒博物馆"],
      url: origin,
      description: SITE_DESCRIPTION,
      inLanguage: ["en", "zh-Hans"],
      publisher: {
        "@type": "Person",
        name: "Chen Liang",
        url: "https://x.com/mr_chenliang",
      },
    },
    {
      "@type": "Museum",
      name: SITE_NAME,
      alternateName: ["酒", "中国白酒博物馆"],
      description: SITE_DESCRIPTION,
      url: origin,
      sameAs: ["https://x.com/mr_chenliang"],
    },
  ],
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
