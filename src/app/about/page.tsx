import type { Metadata } from "next";
import { creditById, creditUrl, moutaiNotice, priceBoard, skus } from "@/catalog";
import { BaijiuOrigins } from "@/components/baijiu-origins";
import { SITE_NAME, siteOrigin } from "@/lib/site";

const ABOUT_TITLE = "About Baijiu & Archive Notes (白酒溯源与档案说明)";
const ABOUT_OG_TITLE = "Origins of Baijiu · 白酒溯源与档案";
const ABOUT_DESCRIPTION =
  "What baijiu is, nine millennia of Chinese grain fermentation and solid-state distillation, the five National Famous Liquor tastings (1952–1989), and how the Chinese Baijiu Museum is curated.";
const ABOUT_SOCIAL_DESCRIPTION =
  "What is baijiu? From Shang bronze vessels and earthenware zeng stills to the 1952–1989 National Famous Liquor tastings — plus archive methodology.";

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  keywords: [
    "what is baijiu",
    "history of baijiu",
    "白酒溯源",
    "白酒历史",
    "National Famous Liquor",
    "国家名酒 1952 1963 1979 1984 1989",
    "solid state fermentation qu",
    "Chinese distilled grain spirit",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: ABOUT_OG_TITLE,
    description: ABOUT_SOCIAL_DESCRIPTION,
    url: "/about",
    type: "article",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_OG_TITLE,
    description: ABOUT_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function AboutPage() {
  const creditedSkus = skus.filter((sku) => sku.creditId);
  const origin = siteOrigin();
  const pageUrl = `${origin}/about`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: ABOUT_OG_TITLE,
        alternateName: ["About Baijiu", "白酒溯源"],
        url: pageUrl,
        description: ABOUT_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is baijiu?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Baijiu (白酒) is China’s traditional clear distilled grain spirit, typically fermented in solid state from sorghum, wheat, rice, or corn using grain starter bricks called qu (曲) and distilled in earthenware or metal zeng steamer stills.",
            },
          },
          {
            "@type": "Question",
            name: "What were China’s five National Famous Liquor (国家名酒) tastings?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "China held five state-run national blind tastings: 4 liquors in Beijing (1952), 8 in Beijing (1963, Old Eight), 8 in Dalian (1979, New Eight), 13 in Taiyuan (1984), and 17 in Hefei (1989), establishing the modern pantheon of Chinese baijiu houses.",
            },
          },
          {
            "@type": "Question",
            name: "How are bottles ranked in the Chinese Baijiu Museum?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bottles are curated into four Chinese table ranks — Tier I State Banquet (国宴), Tier II Famous Liquor (名酒), Tier III Fine Grain (佳酿), and Tier IV Everyday Pour (口粮) — with transparent GB/T fermentation standards and reference China street prices.",
            },
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "About Baijiu", item: pageUrl },
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
      <p className="kicker">酒 · About &amp; Archive Notes · 白酒与档案</p>
      <h1>
        About Baijiu &amp; This Archive <span className="zh-inline">白酒溯源</span>
      </h1>
      <BaijiuOrigins showHeading={false} />
      <h2 className="section-label">Curatorial Method · 档案说明</h2>
      <div className="prose">
        <p>
          The tier board uses four Chinese table ranks — State Banquet (国宴), Famous Liquor (名酒), Fine Bottle (佳酿),
          and Everyday Pour (口粮). Nothing on this site is a vote, a crowd rating, or a user comment. The comparison
          tray stays strictly in your browser.
        </p>
        <p>
          China street prices dated 23 November 2026 come from{" "}
          <a href={priceBoard.sourceUrl}>{priceBoard.sourceName}</a>. {priceBoard.method} That morning in China was the
          evening of {priceBoard.toronto}. The Flying Fairy (飞天茅台) i-Moutai price is the company’s own{" "}
          <a href={moutaiNotice.url}>{moutaiNotice.label}</a>. Yuan figures dated 9 November 2024 are shelf tickets
          visible in historical reference photographs rather than that national sample.
        </p>
        <p>
          National Famous Liquor (国家名酒) years follow China’s five state-run tastings: four liquors in Beijing in
          1952, eight in Beijing in 1963 (老八大), eight in Dalian in 1979 (新八大), thirteen in Taiyuan in 1984, and
          seventeen in Hefei in 1989. The state ended the national contest thereafter. Medal proofs are those recorded
          for each tasting; modern bottlings are often lower in ABV.
        </p>
        <p>
          The China Baijiu Map surveys over 140 local Chinese distilleries grouped by province and region,
          with cross-links to full dossiers wherever a house is held in the main collection.
        </p>
      </div>
      <h2 className="section-label">Photographs · 摄影说明</h2>
      {creditedSkus.length > 0 ? (
        <ul className="credits">
          {creditedSkus.map((sku) => {
            const credit = creditById(sku.creditId);
            if (!credit) return null;
            return (
              <li key={sku.id}>
                {sku.nameEn} ({sku.nameZh}) — {credit.by}, {credit.license},{" "}
                <a href={creditUrl(credit.file)}>{credit.file}</a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="prose">
          <p>
            All {skus.length} bottle plates in this archive use uniform 1:1 studio photographs shot upright on a soft
            off-white gallery backdrop (#f6f6f8) with diffused lighting and subtle contact shadow, so bottles across
            tiers, price bands, and banquet guides can be compared side by side without shelf clutter or mismatched
            aspect ratios.
          </p>
        </div>
      )}
    </>
  );
}
