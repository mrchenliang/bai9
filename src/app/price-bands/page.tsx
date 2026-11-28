import type { Metadata } from "next";
import { PriceSheetView } from "@/components/price-sheet";
import { SITE_NAME, siteOrigin } from "@/lib/site";
import { priceSheet, sheetNote } from "@/sheet";

const PRICE_TITLE = "Six Baijiu Price Bands (六排价格带)";
const PRICE_OG_TITLE = "Six Baijiu Price Bands · 六排价格带";
const PRICE_DESCRIPTION =
  "Six-band Chinese baijiu price sheet from ¥40 everyday grain bottles to ¥2,700 state-table icons — compare Moutai, Wuliangye, National Cellar 1573, Fenjiu, and Jiannanchun across China’s shelf hierarchy.";
const PRICE_SOCIAL_DESCRIPTION =
  "How China’s baijiu shelf stratifies from ¥40 daily pours to ¥2,700 state-table icons — 6 visual reference bands with CNY benchmarks.";

export const metadata: Metadata = {
  title: PRICE_TITLE,
  description: PRICE_DESCRIPTION,
  keywords: [
    "baijiu prices",
    "baijiu price bands",
    "白酒价格带",
    "六排价格带",
    "Moutai price yuan",
    "Wuliangye price",
    "Chinese liquor price guide",
    "白酒价格表",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/price-bands" },
  openGraph: {
    title: PRICE_OG_TITLE,
    description: PRICE_SOCIAL_DESCRIPTION,
    url: "/price-bands",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: PRICE_OG_TITLE,
    description: PRICE_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function PriceBandsPage() {
  const origin = siteOrigin();
  const pageUrl = `${origin}/price-bands`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: PRICE_OG_TITLE,
        alternateName: ["Six Baijiu Price Bands", "六排价格带", "白酒价格带"],
        url: pageUrl,
        description: PRICE_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
        mainEntity: {
          "@type": "ItemList",
          name: "Six Chinese Baijiu Price Bands",
          numberOfItems: priceSheet.length,
          itemListElement: priceSheet.map((band, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `Band ${["I", "II", "III", "IV", "V", "VI"][index]}`,
            description: band.map((spot) => `${spot.label} (¥${spot.yuan})`).join(" · "),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Price Bands", item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="kicker">Price Bands · 六排价格带</p>
      <h1>
        Six Price Bands <span className="zh-inline">价格带</span>
      </h1>
      <p className="sub">{sheetNote}</p>
      <PriceSheetView />
    </>
  );
}
