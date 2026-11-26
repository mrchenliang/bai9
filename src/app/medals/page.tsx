import type { Metadata } from "next";
import Link from "next/link";
import { aromaById, brandById } from "@/catalog";
import { tastings } from "@/tastings";

export const metadata: Metadata = {
  title: "名酒评比",
};

export default function MedalsPage() {
  return (
    <>
      <p className="kicker">National Tastings · 五届评酒会</p>
      <h1>中国名酒评比</h1>
      <p className="en-title">Four, Old Eight, New Eight, Thirteen, and Seventeen (1952–1989)</p>
      <p className="sub">
        Between 1952 and 1989 China held five state-run liquor tastings. Only three baijiu — Moutai, Fenjiu and Luzhou
        Laojiao — won at all five. Wuliangye, Xifeng, Dongjiu and Gujing Gongjiu won four times. When people say “Old
        Eight” (老八大), they mean 1963; “New Eight” (新八大) means 1979.
      </p>
      <p className="sub zh-copy">
        新中国成立后共举办五届国家级评酒会。茅台酒、汾酒、泸州老窖在五届中全部入选；五粮液、西凤酒、董酒、古井贡酒四次入选。通常说的「老八大」指1963年第二届，「新八大」指1979年第三届。
      </p>
      <div className="tasting-list">
        {tastings.map((tasting) => (
          <section key={tasting.year} className="tasting-row">
            <div className="tasting-head">
              <div className="tasting-year">{tasting.year}</div>
              <div className="tasting-place">
                {tasting.cityZh} · {tasting.cityEn}
              </div>
              <h2 className="tasting-title">{tasting.titleZh}</h2>
              <p className="name-en">{tasting.titleEn}</p>
            </div>
            <div className="tasting-body">
              <p>{tasting.noteEn}</p>
              <p className="zh-copy">{tasting.noteZh}</p>
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
                      <span className="pick-name">{entry.medalName}</span>
                      <span className="pick-meta">
                        {brand?.provinceZh} · {aroma?.zh}
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
