import type { Metadata } from "next";
import { aromas } from "@/catalog";
import { AromaExplorer } from "@/components/aroma-explorer";
import { SITE_NAME, siteOrigin } from "@/lib/site";

const AROMAS_TITLE = "Twelve Baijiu Aromas (十二香型)";
const AROMAS_OG_TITLE = "Twelve Baijiu Aromas · 十二香型";
const AROMAS_DESCRIPTION =
  "Interactive guide to China’s twelve official baijiu aroma standards (十二香型) — Sauce, Strong, Light, Rice, Feng, Mixed, Dong, Sesame, Chi, Te, Laobaigan, and Fuyu — with grains, flavor notes, and reference bottles.";
const AROMAS_SOCIAL_DESCRIPTION =
  "Explore all 12 official Chinese baijiu aroma standards — fermentation pits, grain profiles, interactive palate matcher, and reference bottles.";

export const metadata: Metadata = {
  title: AROMAS_TITLE,
  description: AROMAS_DESCRIPTION,
  keywords: [
    "baijiu aroma types",
    "twelve baijiu aromas",
    "十二香型",
    "白酒香型",
    "sauce aroma baijiu",
    "strong aroma baijiu",
    "light aroma baijiu",
    "酱香 浓香 清香 米香",
    "baijiu flavor guide",
    "GB/T baijiu standards",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/aromas" },
  openGraph: {
    title: AROMAS_OG_TITLE,
    description: AROMAS_SOCIAL_DESCRIPTION,
    url: "/aromas",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: AROMAS_OG_TITLE,
    description: AROMAS_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function AromasPage() {
  const origin = siteOrigin();
  const pageUrl = `${origin}/aromas`;
  const officialAromas = aromas.filter((a) => a.id !== "prepared");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: AROMAS_OG_TITLE,
        alternateName: ["Twelve Baijiu Aromas", "十二香型", "白酒十二香型"],
        url: pageUrl,
        description: AROMAS_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
        mainEntity: {
          "@type": "DefinedTermSet",
          name: "Twelve Official Chinese Baijiu Aroma Standards (白酒十二香型)",
          hasDefinedTerm: officialAromas.map((aroma) => ({
            "@type": "DefinedTerm",
            name: `${aroma.en} (${aroma.zh})`,
            description: aroma.taste,
            termCode: aroma.id,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Twelve Aromas", item: pageUrl },
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
      <AromaExplorer />
    </>
  );
}
