import type { Metadata } from "next";
import { ProvinceAtlas } from "@/components/province-atlas";
import { SITE_NAME, siteOrigin } from "@/lib/site";
import { provinceLocalLore, provincesAtlas, REGIONS, totalRegionalHouses } from "@/provinces";

const MAP_TITLE = "China Baijiu Map (中国白酒地图)";
const MAP_OG_TITLE = "China Baijiu Map · 中国白酒地图";
const MAP_DESCRIPTION = `Interactive map of China’s ${provincesAtlas.length} baijiu provinces and ${totalRegionalHouses} regional distilleries across ${REGIONS.length} regions — house emblems, local drinking culture, and food pairings.`;
const MAP_SOCIAL_DESCRIPTION = `${provincesAtlas.length} provinces · ${REGIONS.length} regions · ${totalRegionalHouses} distilleries. Explore China’s baijiu heartlands, flagship house emblems, local drinking rituals, and food pairings.`;

export const metadata: Metadata = {
  title: MAP_TITLE,
  description: MAP_DESCRIPTION,
  keywords: [
    "China baijiu map",
    "中国白酒地图",
    "Chinese liquor map",
    "baijiu by province",
    "Chinese baijiu regions",
    "白酒产区地图",
    "Sichuan baijiu",
    "Guizhou Moutai",
    "Shanxi Fenjiu",
    "regional Chinese distilleries",
    "baijiu drinking culture",
    "Chinese Baijiu Museum",
  ],
  alternates: { canonical: "/map" },
  openGraph: {
    title: MAP_OG_TITLE,
    description: MAP_SOCIAL_DESCRIPTION,
    url: "/map",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: MAP_OG_TITLE,
    description: MAP_SOCIAL_DESCRIPTION,
    creator: "@mr_chenliang",
  },
};

export default function MapPage() {
  const origin = siteOrigin();
  const mapUrl = `${origin}/map`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: MAP_OG_TITLE,
        alternateName: ["China Baijiu Map", "中国白酒地图", "白酒地图"],
        url: mapUrl,
        description: MAP_DESCRIPTION,
        inLanguage: ["en", "zh-Hans"],
        isPartOf: {
          "@type": "WebSite",
          name: SITE_NAME,
          url: origin,
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Chinese Baijiu Provinces",
          numberOfItems: provincesAtlas.length,
          itemListElement: provincesAtlas.map((prov, index) => {
            const lore = provinceLocalLore[prov.id];
            return {
              "@type": "ListItem",
              position: index + 1,
              name: `${prov.nameEn} (${prov.nameZh})`,
              description: lore
                ? `${lore.localTitle} — ${prov.houses.length} distilleries including ${prov.houses
                    .slice(0, 3)
                    .map((h) => h.nameEn)
                    .join(", ")}.`
                : `${prov.houses.length} regional baijiu distilleries.`,
            };
          }),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SITE_NAME,
            item: origin,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "China Baijiu Map",
            item: mapUrl,
          },
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
      <ProvinceAtlas />
    </>
  );
}

