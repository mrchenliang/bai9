import type { Metadata } from "next";
import Link from "next/link";
import { aromaById, brandById, skuAroma, skuById } from "@/catalog";
import { banquetBands, banquetRules } from "@/banquets";

export const metadata: Metadata = {
  title: "Banquet Guide",
};

export default function BanquetsPage() {
  return (
    <>
      <p className="kicker">Banquet Guide · 升学宴·请客送礼选酒指南</p>
      <h1>
        Banquet &amp; Gifting Guide <span className="zh-inline">选酒指南</span>
      </h1>
      <p className="sub">
        How Chinese hosts choose baijiu by table budget — from family dinners and university graduation feasts (升学宴)
        to formal gifting and head-table flagships. Budget bands reflect typical Chinese banquet groupings rather than
        daily spot quotes; click any bottle for its full archive dossier and verified 23 November 2026 street price.
      </p>

      <div className="banquet-rules">
        {banquetRules.map((rule) => (
          <div key={rule.titleEn} className="banquet-rule">
            <div className="banquet-rule-head">
              <strong>{rule.titleEn}</strong>
              <span className="zh-inline-sm">{rule.titleZh}</span>
            </div>
            <p>{rule.body}</p>
          </div>
        ))}
      </div>

      <div className="prov-list">
        {banquetBands.map((band) => (
          <section key={band.id} className="prov-row">
            <div className="prov-head">
              <div className="tasting-year">{band.range}</div>
              <h2 className="prov-title">{band.titleEn}</h2>
              <div className="prov-zh">{band.titleZh}</div>
              <p className="banquet-occ">{band.occasion}</p>
            </div>
            <div className="banquet-grid">
              {band.picks.map((pick) => {
                const sku = skuById(pick.skuId);
                if (!sku) return null;
                const brand = brandById(sku.brandId);
                const aroma = skuAroma(sku) ?? (brand ? aromaById(brand.aroma) : undefined);
                return (
                  <Link key={pick.skuId} href={`/sku/${sku.id}`} className="house-card is-archived banquet-card">
                    {sku.image ? (
                      <div className="banquet-thumb">
                        <img
                          src={sku.image}
                          alt={sku.nameEn}
                          className={sku.image.startsWith("/images/bottles/") ? "is-cutout" : undefined}
                        />
                      </div>
                    ) : null}
                    <div className="banquet-info">
                      <div className="house-top">
                        <span className="house-zh">{sku.nameZh}</span>
                        {aroma ? <span className="house-aroma">{aroma.zh}</span> : null}
                      </div>
                      <div className="house-en">{sku.nameEn}</div>
                      <div className="banquet-note">{pick.note}</div>
                      <div className="house-meta">
                        {sku.abv} · {sku.volume}
                        {sku.chinaPrice ? ` · ${sku.chinaPrice}` : ""}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
