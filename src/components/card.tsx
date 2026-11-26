import Link from "next/link";
import { brandById, creditById, creditUrl, tierById } from "@/catalog";
import type { Brand, Sku } from "@/types";

export function Face({ sku, brand }: { sku: Sku; brand: Brand }) {
  const tier = tierById(sku.tier);
  if (!sku.image) {
    return (
      <div className="face">
        <div className="plate">
          <b>{brand.nameZh.slice(0, 2)}</b>
          <span>{brand.pinyin}</span>
        </div>
        <span className="tier-tag">{tier?.zh}</span>
      </div>
    );
  }
  return (
    <div className="face">
      <img
        src={sku.image}
        alt={`${sku.nameEn} (${sku.nameZh})`}
        style={{ objectPosition: sku.imagePosition ?? "50% 40%" }}
      />
      <span className="tier-tag">{tier?.zh}</span>
    </div>
  );
}

export function Card({ sku }: { sku: Sku }) {
  const brand = brandById(sku.brandId);
  if (!brand) return null;
  return (
    <Link className="card" href={`/sku/${sku.id}`}>
      <Face sku={sku} brand={brand} />
      <div className="name-en-main">{sku.nameEn}</div>
      <div className="name-zh-sub">{sku.nameZh}</div>
      <div className="meta">
        {sku.abv} · {sku.volume}
      </div>
      {sku.chinaPrice ? <div className="price">{sku.chinaPrice}</div> : null}
    </Link>
  );
}

export function CreditLine({ sku }: { sku: Sku }) {
  const credit = creditById(sku.creditId);
  if (!credit) return <p className="caption">{sku.caption}</p>;
  return (
    <p className="caption">
      {sku.caption} Photograph by {credit.by}, {credit.license},{" "}
      <a href={creditUrl(credit.file)}>Wikimedia Commons</a>.
    </p>
  );
}
