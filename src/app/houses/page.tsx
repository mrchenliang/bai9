import type { Metadata } from "next";
import { brands } from "@/catalog";
import { BrandIndex } from "@/components/brand-index";
import { SITE_NAME, siteOrigin } from "@/lib/site";

const HOUSES_TITLE = "Chinese Baijiu Distillery Houses (中国名酒厂)";
const HOUSES_OG_TITLE = "Distillery Houses · 中国名酒厂";
const HOUSES_DESCRIPTION = `Field guide to ${brands.length} Chinese baijiu distillery houses — National Famous Liquor gold medalists, single-house aroma benchmarks, regional kings, and everyday Erguotou makers.`;
const HOUSES_SOCIAL_DESCRIPTION = `${brands.length} heritage Chinese baijiu distilleries across 4 chapters — National Table Powers, Style Makers, Regional Kings, and Street Classics.`;

export const metadata: Metadata = {
  title: HOUSES_TITLE,
  description: HOUSES_DESCRIPTION,
  keywords: [
    "Chinese baijiu brands",
    "Chinese baijiu distilleries",
    "中国名酒厂",
    "白酒品牌大全",
    "国家名酒",
    "Moutai",
    "Wuliangye",
    "Luzhou Laojiao",
    "Fenjiu",
    "Jiannanchun",
    "Yanghe",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/houses" },
  openGraph: {
    title: HOUSES_OG_TITLE,
    description: HOUSES_SOCIAL_DESCRIPTION,
    url: "/houses",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: HOUSES_OG_TITLE,
    description: HOUSES_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function HousesPage() {
  const origin = siteOrigin();
  const pageUrl = `${origin}/houses`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: HOUSES_OG_TITLE,
        alternateName: ["Distillery Houses", "中国名酒厂", "酒厂"],
        url: pageUrl,
        description: HOUSES_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
        mainEntity: {
          "@type": "ItemList",
          name: "Chinese Baijiu Distillery Houses",
          numberOfItems: brands.length,
          itemListElement: brands.map((brand, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${brand.nameEn} (${brand.nameZh})`,
            url: `${origin}/brand/${brand.id}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Distillery Houses", item: pageUrl },
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
      <BrandIndex />
    </>
  );
}
