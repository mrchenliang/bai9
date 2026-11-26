import Link from "next/link";
import { brandById, creditById, creditUrl, skuAroma, skus, tierById } from "@/catalog";
import type { Brand, Sku, TierId } from "@/types";

const TIER_NUMERAL: Record<TierId, string> = {
  guoyan: "I",
  mingjiu: "II",
  jianiang: "III",
  kouliang: "IV",
  export: "EX",
};

const ACCESSION_MAP = new Map<string, string>(
  skus.map((item, idx) => [item.id, `№ ${String(idx + 1).padStart(2, "0")}`]),
);

export function accessionNumber(skuId: string): string {
  return ACCESSION_MAP.get(skuId) ?? "№ —";
}

export function tierNumeral(tier: TierId): string {
  return TIER_NUMERAL[tier];
}

export function Face({ sku, brand }: { sku: Sku; brand: Brand }) {
  const tier = tierById(sku.tier);
  const num = TIER_NUMERAL[sku.tier];
  const catNo = accessionNumber(sku.id);
  if (!sku.image) {
    return (
      <div className="face">
        <div className="plate">
          <b>{brand.nameZh.slice(0, 2)}</b>
          <span>{brand.pinyin}</span>
        </div>
        <span className={`tier-tag ${sku.tier}`}>
          <i>{num}</i> {tier?.zh}
        </span>
        <span className="cat-tag">{catNo}</span>
      </div>
    );
  }
  return (
    <div className="face">
      <img
        src={sku.image}
        alt={`${sku.nameEn} (${sku.nameZh})`}
        style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
      />
      <span className={`tier-tag ${sku.tier}`}>
        <i>{num}</i> {tier?.zh}
      </span>
      <span className="cat-tag">{catNo}</span>
    </div>
  );
}

export function Card({ sku }: { sku: Sku }) {
  const brand = brandById(sku.brandId);
  if (!brand) return null;
  const aroma = skuAroma(sku);
  return (
    <Link className="card" href={`/sku/${sku.id}`}>
      <Face sku={sku} brand={brand} />
      <div className="placard">
        <div className="name-en-main">{sku.nameEn}</div>
        <div className="name-zh-sub">{sku.nameZh}</div>
        <div className="placard-origin">
          {brand.provinceEn}
          {aroma ? ` · ${aroma.en.replace(" aroma", "")}` : ""}
        </div>
        <div className="placard-foot">
          <span className="meta">
            {sku.abv} · {sku.volume}
          </span>
          {sku.chinaPrice ? <span className="price">{sku.chinaPrice}</span> : null}
        </div>
      </div>
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
