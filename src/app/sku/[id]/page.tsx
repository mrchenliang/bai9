import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CreditLine } from "@/components/card";
import { CompareButton } from "@/components/shell";
import { brandById, skuAroma, skuById, skus, skusForBrand, tierById } from "@/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return skus.map((sku) => ({ id: sku.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) return { title: { absolute: "酒" } };
  return { title: `${sku.nameZh} · ${sku.nameEn}` };
}

export default async function SkuPage({ params }: PageProps) {
  const { id } = await params;
  const sku = skuById(id);
  if (!sku) notFound();
  const brand = brandById(sku.brandId);
  if (!brand) notFound();
  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const siblings = skusForBrand(brand.id).filter((item) => item.id !== sku.id);
  return (
    <>
      <p className="crumb">
        <Link href="/">藏品</Link> · <Link href={`/brand/${brand.id}`}>{brand.nameZh}</Link> · {sku.nameZh}
      </p>
      <div className="sku-layout">
        <div>
          <div className="sku-photo">
            {sku.image ? (
              <img src={sku.image} alt={sku.nameZh} style={{ objectPosition: sku.imagePosition ?? "50% 40%" }} />
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
            {brand.provinceZh} · {brand.provinceEn} · {tier?.zh} {tier?.en}
          </p>
          <h1>{sku.nameZh}</h1>
          <p className="en-title">{sku.nameEn}</p>
          <p className="sub">
            {brand.nameZh} · {brand.distilleryZh}
          </p>
          {sku.chinaPrice ? <p className="price">{sku.chinaPrice}</p> : null}
          {sku.chinaNote ? <p className="caption">{sku.chinaNote}</p> : null}
          <dl className="spec">
            <dt>香型</dt>
            <dd>
              {aroma?.zh} · {aroma?.en}
            </dd>
            <dt>酒精度</dt>
            <dd>{sku.abv}</dd>
            <dt>净含量</dt>
            <dd>{sku.volume}</dd>
            <dt>产地</dt>
            <dd>
              {brand.placeZh} · {brand.placeEn}
            </dd>
            <dt>梯队</dt>
            <dd>
              {tier?.zh} · {tier?.en}
            </dd>
          </dl>
          <p>{sku.role}</p>
          <p className="zh-copy">{sku.roleZh}</p>
          <div className="actions">
            <CompareButton id={sku.id} />
            <Link className="btn" href={`/brand/${brand.id}`}>
              {brand.nameZh}的其他酒
            </Link>
            {sku.specUrl ? (
              <a className="btn" href={sku.specUrl}>
                酒厂产品页
              </a>
            ) : null}
            {brand.official ? (
              <a className="btn" href={brand.official.url}>
                {brand.official.label}
              </a>
            ) : null}
          </div>
          <h2 className="section-label">Canada and the United States</h2>
          {sku.shops.length === 0 ? (
            <p className="caption">
              No verified retail page for this exact bottle. The 何处买 index lists the chains that carry the category.
            </p>
          ) : (
            <div className="shops">
              {sku.shops.map((shop) => (
                <a key={shop.url} className="shop" href={shop.url}>
                  <span className="meta">{shop.country === "Canada" ? "Canada" : "US"}</span>
                  <span>
                    <span className="shop-name">
                      {shop.retailer} · {shop.place}
                    </span>
                    <small>{shop.note}</small>
                  </span>
                  <span className="amt">{shop.price}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      {siblings.length > 0 ? (
        <>
          <h2 className="section-label">Other bottles · {brand.nameZh}</h2>
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
