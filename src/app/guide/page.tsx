import type { Metadata } from "next";
import { giftPersonas } from "@/banquets";
import { TableAdvisor } from "@/components/table-advisor";
import { SITE_NAME, siteOrigin } from "@/lib/site";

const GUIDE_TITLE = "The Baijiu Guide (选酒指南)";
const GUIDE_OG_TITLE = "The Baijiu Guide · 选酒指南";
const GUIDE_DESCRIPTION =
  "Practical guide to choosing, gifting, and pouring Chinese baijiu — bottle discovery spinner, six banquet & gifting moments, regional drinking etiquette, and classic buying traps to avoid.";
const GUIDE_SOCIAL_DESCRIPTION =
  "Choose the right bottle for any Chinese table — six gifting & banquet scenarios, regional etiquette rules, discovery spinner, and classic traps to skip.";

export const metadata: Metadata = {
  title: GUIDE_TITLE,
  description: GUIDE_DESCRIPTION,
  keywords: [
    "baijiu gift guide",
    "how to choose baijiu",
    "选酒指南",
    "Chinese baijiu etiquette",
    "baijiu banquet guide",
    "best baijiu to gift",
    "meeting Chinese father in law gift",
    "Chinese wedding baijiu",
    "送礼白酒推荐",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/guide" },
  openGraph: {
    title: GUIDE_OG_TITLE,
    description: GUIDE_SOCIAL_DESCRIPTION,
    url: "/guide",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: GUIDE_OG_TITLE,
    description: GUIDE_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function GuidePage() {
  const origin = siteOrigin();
  const pageUrl = `${origin}/guide`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: GUIDE_OG_TITLE,
        alternateName: ["The Baijiu Guide", "选酒指南", "白酒送礼指南"],
        url: pageUrl,
        description: GUIDE_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: origin },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What baijiu should I gift when meeting a Chinese father-in-law for the first time?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bring a matched pair (成双成对) in the original factory tote bag. Eighth-generation Wuliangye (普五) is the safest prestige pick, Fenjiu Qinghua 30 is the connoisseur light-aroma choice, and Xijiu Cellar 1988 offers credible Chishui sauce aroma at a sharper price.",
            },
          },
          {
            "@type": "Question",
            name: "Which baijiu works best for Chinese weddings and graduation banquets?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Stick to festive crimson, gold, or crystal boxes and budget 1.5 to 2 bottles per table of ten. Crystal Jiannanchun (水晶剑) is China’s perennial ¥400 wedding benchmark alongside Honghualang (红花郎) and Jiugui Hongtan.",
            },
          },
          {
            "@type": "Question",
            name: "How can I avoid low-grade or gimmick baijiu when buying a gift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Check the GB/T standard code on the back label to verify pure solid-state grain fermentation (such as GB/T 26760 for sauce aroma or GB/T 10781.1 for strong aroma) and stick to core flagship lines from established houses rather than obscure sub-labels.",
            },
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Baijiu Gifting & Table Scenarios",
        numberOfItems: giftPersonas.length,
        itemListElement: giftPersonas.map((persona, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${persona.label} (${persona.zh})`,
          description: persona.tagline,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "The Baijiu Guide", item: pageUrl },
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
      <TableAdvisor />
    </>
  );
}
