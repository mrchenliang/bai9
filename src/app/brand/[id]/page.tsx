import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/card";
import { aromaById, brandById, brands, skusForBrand } from "@/catalog";
import { SITE_NAME, siteOrigin } from "@/lib/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return brands.map((brand) => ({ id: brand.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const brand = brandById(id);
  if (!brand) {
    return {
      title: "Page Not Found (查无此页)",
      description: "That distillery house is not in the Chinese Baijiu Museum archive.",
      robots: { index: false, follow: true },
      openGraph: {
        title: "Page Not Found · 查无此页",
        description: "That distillery house is not in the Chinese Baijiu Museum archive.",
        type: "website",
        siteName: SITE_NAME,
      },
      twitter: {
        card: "summary_large_image",
        title: "Page Not Found · 查无此页",
        description: "That distillery house is not in the Chinese Baijiu Museum archive.",
      },
    };
  }
  const aroma = aromaById(brand.aroma);
  const title = `${brand.nameEn} (${brand.nameZh})`;
  const ogTitle = `${brand.nameEn} · ${brand.nameZh}`;
  const medalText = brand.medals.length ? ` · National Famous Liquor ${brand.medals.join("/")}` : "";
  const description = `${brand.distilleryEn} (${brand.placeEn}, ${brand.provinceEn})${
    aroma ? ` — ${aroma.en} (${aroma.zh})` : ""
  }${medalText}. ${brand.historyEn.slice(0, 125)}…`;

  return {
    title,
    description,
    keywords: [
      brand.nameEn,
      brand.nameZh,
      brand.distilleryEn,
      brand.distilleryZh,
      `${brand.nameEn} baijiu`,
      `${brand.provinceEn} baijiu`,
      aroma?.en ?? "baijiu",
      aroma?.zh ?? "白酒",
      "Chinese Baijiu Museum",
    ],
    alternates: { canonical: `/brand/${id}` },
    openGraph: {
      title: ogTitle,
      description,
      type: "article",
      url: `/brand/${id}`,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      creator: "@mr_chenliang",
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { id } = await params;
  const brand = brandById(id);
  if (!brand) notFound();
  const aroma = aromaById(brand.aroma);
  const bottles = skusForBrand(brand.id);
  const origin = siteOrigin();
  const pageUrl = `${origin}/brand/${brand.id}`;
  const heroImg = bottles.find((b) => b.image)?.image;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Brand",
        name: brand.nameEn,
        alternateName: [brand.nameZh, brand.distilleryEn, brand.distilleryZh],
        url: pageUrl,
        description: brand.historyEn,
        ...(heroImg ? { image: `${origin}${heroImg}` } : {}),
        ...(brand.official ? { sameAs: [brand.official.url] } : {}),
      },
      {
        "@type": "ItemList",
        name: `${brand.nameEn} (${brand.nameZh}) Archive Bottles`,
        numberOfItems: bottles.length,
        itemListElement: bottles.map((sku, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${sku.nameEn} (${sku.nameZh})`,
          url: `${origin}/sku/${sku.id}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: origin },
          { "@type": "ListItem", position: 2, name: "Distillery Houses", item: `${origin}/houses` },
          { "@type": "ListItem", position: 3, name: brand.nameEn, item: pageUrl },
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
      <p className="crumb">
        <Link href="/houses">Houses</Link> · {brand.provinceEn} ({brand.provinceZh})
      </p>
      <h1>
        {brand.nameEn} <span className="zh-inline">{brand.nameZh}</span>
      </h1>
      <p className="en-title">
        {brand.distilleryEn} · {brand.distilleryZh}
      </p>
      <p className="count">
        {brand.placeEn} ({brand.placeZh}) · {aroma ? `${aroma.en} ${aroma.zh}` : ""} · {bottles.length}{" "}
        {bottles.length === 1 ? "bottle" : "bottles"}
        {brand.medals.length ? ` · National Famous Liquor (国家名酒) ${brand.medals.join(" / ")}` : ""}
      </p>
      <div className="prose">
        <p>{brand.historyEn}</p>
      </div>
      {brand.craftEn ? (
        <>
          <h2 className="section-label">Craft &amp; Method · 工艺</h2>
          <div className="prose">
            <p>{brand.craftEn}</p>
          </div>
        </>
      ) : null}
      {brand.verse ? (
        <blockquote className="verse">
          <p className="zh-copy">{brand.verse.lines}</p>
          <footer>— {brand.verse.by}</footer>
        </blockquote>
      ) : null}
      {brand.official ? (
        <p>
          <a className="btn" href={brand.official.url}>
            {brand.official.label}
          </a>
        </p>
      ) : null}
      <h2 className="section-label">Bottles · 藏品</h2>
      <div className="grid">
        {bottles.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}
