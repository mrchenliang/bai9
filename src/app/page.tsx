import type { Metadata } from "next";
import { skus } from "@/catalog";
import { Collection } from "@/components/collection";
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_ZH, SITE_TAGLINE, siteOrigin } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} · 酒` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} · ${SITE_NAME_ZH}`,
    description: SITE_TAGLINE,
    url: "/",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · ${SITE_NAME_ZH}`,
    description: SITE_TAGLINE,
    creator: "@mr_chenliang",
  },
};

export default function Page() {
  const origin = siteOrigin();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${SITE_NAME} · ${SITE_NAME_ZH}`,
    url: origin,
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "zh-Hans"],
    mainEntity: {
      "@type": "ItemList",
      name: "Chinese Baijiu Museum Permanent Collection",
      numberOfItems: skus.length,
      itemListElement: skus.slice(0, 12).map((sku, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${sku.nameEn} (${sku.nameZh})`,
        url: `${origin}/sku/${sku.id}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Collection />
    </>
  );
}
