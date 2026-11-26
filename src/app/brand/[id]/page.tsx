import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/card";
import { aromaById, brandById, brands, skusForBrand } from "@/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return brands.map((brand) => ({ id: brand.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const brand = brandById(id);
  if (!brand) return { title: { absolute: "Chinese Baijiu Museum · 酒" } };
  const title = `${brand.nameEn} (${brand.nameZh})`;
  const description = `${brand.distilleryEn} · ${brand.placeEn}, ${brand.provinceEn}. ${brand.historyEn.slice(0, 140)}…`;
  return {
    title,
    description,
    alternates: { canonical: `/brand/${id}` },
    openGraph: {
      title: `${title} · 酒`,
      description,
      type: "article",
      url: `/brand/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · 酒`,
      description,
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { id } = await params;
  const brand = brandById(id);
  if (!brand) notFound();
  const aroma = aromaById(brand.aroma);
  const bottles = skusForBrand(brand.id);
  return (
    <>
      <p className="crumb">
        <Link href="/brands">Houses</Link> · {brand.provinceEn} ({brand.provinceZh})
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
