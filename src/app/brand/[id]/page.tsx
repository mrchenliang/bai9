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
  if (!brand) return { title: { absolute: "酒" } };
  return { title: `${brand.nameZh} · ${brand.nameEn}` };
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
        <Link href="/brands">品牌</Link> · {brand.provinceZh} · {brand.provinceEn}
      </p>
      <h1>{brand.nameZh}</h1>
      <p className="en-title">
        {brand.nameEn} · {brand.pinyin}
      </p>
      <p className="count">
        {brand.distilleryZh} · {aroma?.zh}
        {aroma ? ` ${aroma.en}` : ""} · {bottles.length} bottles
        {brand.medals.length ? ` · 国家名酒 ${brand.medals.join(" / ")}` : ""}
      </p>
      <div className="split prose">
        <p>{brand.historyEn}</p>
        <p className="zh-copy">{brand.historyZh}</p>
      </div>
      {brand.official ? (
        <p>
          <a className="btn" href={brand.official.url}>
            {brand.official.label}
          </a>
        </p>
      ) : null}
      <h2 className="section-label">Bottles</h2>
      <div className="grid">
        {bottles.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}
