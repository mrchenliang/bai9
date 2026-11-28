import type { Metadata } from "next";
import { skus, tiers } from "@/catalog";
import { TierExhibit } from "@/components/tier-exhibit";
import { SITE_NAME, siteOrigin } from "@/lib/site";

const TIERS_TITLE = "Baijiu Tier System (四档梯队)";
const TIERS_OG_TITLE = "Baijiu Tier System · 四档梯队";
const TIERS_DESCRIPTION = `Chinese baijiu ranked across four table tiers — State Table (国宴), Famous Liquor (名酒), Fine Grain (佳酿), and Daily Grain (口粮) — covering ${skus.length} archival bottles plus a custom tier builder.`;
const TIERS_SOCIAL_DESCRIPTION = `Inspect ${skus.length} Chinese baijiu bottles ranked across Tier I State Table (国宴) to Tier IV Daily Grain (口粮), or drag and export your own tier list.`;

export const metadata: Metadata = {
  title: TIERS_TITLE,
  description: TIERS_DESCRIPTION,
  keywords: [
    "baijiu tier list",
    "Chinese baijiu tiers",
    "白酒梯队",
    "四档梯队",
    "best Chinese baijiu",
    "国宴白酒",
    "中国名酒",
    "口粮酒",
    "Moutai Wuliangye ranking",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/tiers" },
  openGraph: {
    title: TIERS_OG_TITLE,
    description: TIERS_SOCIAL_DESCRIPTION,
    url: "/tiers",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TIERS_OG_TITLE,
    description: TIERS_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function TiersPage() {
  const origin = siteOrigin();
  const pageUrl = `${origin}/tiers`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: TIERS_OG_TITLE,
        alternateName: ["Baijiu Tier System", "四档梯队", "白酒梯队"],
        url: pageUrl,
        description: TIERS_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
        mainEntity: {
          "@type": "ItemList",
          name: "Four Chinese Baijiu Table Tiers",
          numberOfItems: tiers.length,
          itemListElement: tiers.map((tier, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `Tier ${["I", "II", "III", "IV"][index]} · ${tier.en} (${tier.zh})`,
            description: tier.line,
            url: `${pageUrl}#${tier.id}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Baijiu Tier System", item: pageUrl },
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
      <TierExhibit />
    </>
  );
}
