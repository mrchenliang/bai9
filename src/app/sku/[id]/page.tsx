import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CreditLine } from "@/components/card";
import { CompareButton } from "@/components/shell";
import { brandById, skuAroma, skuById, skus, skusForBrand, tierById } from "@/catalog";
import { sheetSpot } from "@/sheet";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return skus.map((sku) => ({ id: sku.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) return { title: { absolute: "Chinese Baijiu Museum · 酒" } };
  return { title: `${sku.nameEn} (${sku.nameZh})` };
}

export default async function SkuPage({ params }: PageProps) {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) notFound();
  const brand = brandById(sku.brandId);
  if (!brand) notFound();
  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const printed = sheetSpot(sku.id);
  const siblings = skusForBrand(brand.id).filter((item) => item.id !== sku.id);
  return (
    <>
      <p className="crumb">
        <Link href="/">Collection</Link> · <Link href={`/brand/${brand.id}`}>{brand.nameEn}</Link> · {sku.nameEn}
      </p>
      <div className="sku-layout">
        <div>
          <div className={sku.image?.startsWith("/images/bottles/") ? "sku-photo is-cutout" : "sku-photo"}>
            {sku.image ? (
              <img
                src={sku.image}
                alt={`${sku.nameEn} (${sku.nameZh})`}
                style={
                  sku.image.startsWith("/images/bottles/")
                    ? undefined
                    : { objectPosition: sku.imagePosition ?? "50% 40%" }
                }
              />
            ) : (
              <div className="plate">
                <b>{brand.nameZh.slice(0, 2)}</b>
                <span>{brand.pinyin}</span>
              </div>
            )}
          </div>
          <CreditLine sku={sku} />
        </div>
        <div>
          <p className="kicker">
            {brand.provinceEn} ({brand.provinceZh}) · {tier?.en} {tier?.zh}
          </p>
          <h1>
            {sku.nameEn} <span className="zh-inline">{sku.nameZh}</span>
          </h1>
          <p className="sub">
            {brand.nameEn} · {brand.distilleryZh}
          </p>
          {sku.chinaPrice ? <p className="price">{sku.chinaPrice}</p> : null}
          {sku.chinaNote ? <p className="caption">{sku.chinaNote}</p> : null}
          {printed ? (
            <p className="caption">
              The six-band price sheet prints {printed.yuan} for {printed.label}. That figure reflects the reference
              sheet rather than today’s spot quote.
            </p>
          ) : null}
          <dl className="spec">
            <dt>Aroma</dt>
            <dd>
              {aroma?.en} · <span className="zh-chip">{aroma?.zh}</span>
            </dd>
            <dt>ABV</dt>
            <dd>{sku.abv}</dd>
            <dt>Volume</dt>
            <dd>{sku.volume}</dd>
            <dt>Origin</dt>
            <dd>
              {brand.placeEn} · <span className="zh-chip">{brand.placeZh}</span>
            </dd>
            <dt>Tier</dt>
            <dd>
              {tier?.en} · <span className="zh-chip">{tier?.zh}</span>
            </dd>
          </dl>
          <p>{sku.role}</p>
          <div className="actions">
            <CompareButton id={sku.id} />
            <Link className="btn" href={`/brand/${brand.id}`}>
              More from {brand.nameEn}
            </Link>
            {sku.specUrl ? (
              <a className="btn" href={sku.specUrl}>
                Distillery spec page
              </a>
            ) : null}
            {brand.official ? (
              <a className="btn" href={brand.official.url}>
                {brand.official.label}
              </a>
            ) : null}
          </div>
        </div>
      </div>
      {siblings.length > 0 ? (
        <>
          <h2 className="section-label">
            Other bottles from {brand.nameEn} · {brand.nameZh}
          </h2>
          <div className="grid">
            {siblings.map((item) => (
              <Card key={item.id} sku={item} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
