import type { Metadata } from "next";
import Link from "next/link";
import { aromaById, brandById } from "@/catalog";
import { tastings } from "@/tastings";

export const metadata: Metadata = {
  title: "National Famous Liquors",
};

export default function MedalsPage() {
  return (
    <>
      <p className="kicker">National Tastings · 五届评酒会</p>
      <h1>
        National Famous Liquors <span className="zh-inline">中国名酒评比</span>
      </h1>
      <p className="sub">
        Between 1952 and 1989 China held five state-run liquor tastings. Only three baijiu — Moutai (茅台), Fenjiu
        (汾酒), and Luzhou Laojiao (泸州老窖) — won at all five. Wuliangye (五粮液), Xifeng (西凤), Dongjiu (董酒), and
        Gujing Gongjiu (古井贡酒) won four times. “Old Eight” (老八大) refers to 1963; “New Eight” (新八大) refers to
        1979.
      </p>
      <div className="tasting-list">
        {tastings.map((tasting) => (
          <section key={tasting.year} className="tasting-row">
            <div className="tasting-head">
              <div className="tasting-year">{tasting.year}</div>
              <div className="tasting-place">
                {tasting.cityEn} · <span className="zh-chip">{tasting.cityZh}</span>
              </div>
              <h2 className="tasting-title">{tasting.titleEn}</h2>
              <p className="tasting-zh">{tasting.titleZh}</p>
            </div>
            <div className="tasting-body">
              <p>{tasting.noteEn}</p>
              <div className="tasting-picks">
                {tasting.entries.map((entry) => {
                  const brand = brandById(entry.brandId);
                  const aroma = brand ? aromaById(brand.aroma) : undefined;
                  return (
                    <Link
                      key={entry.brandId}
                      href={`/brand/${entry.brandId}`}
                      className={entry.isNew ? "tasting-pick is-new" : "tasting-pick"}
                    >
                      <span className="pick-en">{brand?.nameEn ?? entry.brandId}</span>
                      <span className="pick-name">{entry.medalName}</span>
                      <span className="pick-meta">
                        {brand?.provinceEn} · {aroma?.zh}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
