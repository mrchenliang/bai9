import type { Metadata } from "next";
import { PassportView } from "@/components/passport-view";
import { computePassportSummary, encodeStampedParam, parseStampedParam } from "@/lib/passport";
import { SITE_NAME, siteOrigin } from "@/lib/site";

interface PageProps {
  searchParams: Promise<{ s?: string | string[] }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { s } = await searchParams;
  const sharedIds = parseStampedParam(s);
  const encoded = encodeStampedParam(sharedIds);
  const cardUrl = encoded ? `/api/passport-card?s=${encodeURIComponent(encoded)}` : "/api/passport-card";

  if (sharedIds.length === 0) {
    return {
      title: "Drinking Passport (喝过酒证)",
      description:
        "Stamp every Chinese baijiu specimen you have survived, get your curatorial rank, and share your Passport Card on X.",
      keywords: [
        "baijiu drinking passport",
        "baijiu checklist",
        "喝过酒证",
        "白酒打卡",
        "Chinese liquor tracker",
        "Chinese Baijiu Museum",
      ],
      alternates: { canonical: "/passport" },
      openGraph: {
        title: "Drinking Passport · 中国白酒博物馆酒证",
        description: "Stamp the bottles you’ve survived and share your archival Passport Card.",
        url: "/passport",
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
        images: [{ url: cardUrl, width: 1200, height: 630, alt: "Chinese Baijiu Museum Drinking Passport" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Drinking Passport · 中国白酒博物馆酒证",
        description: "Stamp the bottles you’ve survived and share your archival Passport Card.",
        creator: "@mr_chenliang",
        images: [cardUrl],
      },
    };
  }

  const summary = computePassportSummary(sharedIds);
  const title = `${summary.rank.en} (${summary.rank.zh}) — Drinking Passport`;
  const description = `${summary.tastedCount}/${summary.totalCount} baijiu specimens survived · ${summary.maxAbv}% max ABV · ${summary.provinceCount} provinces · ¥${summary.estBillYuan.toLocaleString("en-US")} est. table bill. ${summary.rank.diagnosis}`;
  const pageUrl = `/passport?s=${encodeURIComponent(encoded)}`;

  return {
    title,
    description,
    alternates: { canonical: "/passport" },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: cardUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@mr_chenliang",
      images: [cardUrl],
    },
  };
}

export default async function PassportPage({ searchParams }: PageProps) {
  const { s } = await searchParams;
  const sharedIds = parseStampedParam(s);
  const origin = siteOrigin();
  const pageUrl = `${origin}/passport`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Chinese Baijiu Drinking Passport (喝过酒证)",
        url: pageUrl,
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        description:
          "Interactive checklist to stamp every Chinese baijiu specimen you have tasted, calculate your max ABV and table bill, and generate a shareable archival passport card.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Drinking Passport", item: pageUrl },
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
      <PassportView sharedIds={sharedIds} />
    </>
  );
}
