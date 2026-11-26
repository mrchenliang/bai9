import type { Metadata } from "next";
import Link from "next/link";
import { aromaById, aromas, brandById } from "@/catalog";

export const metadata: Metadata = {
  title: "香型",
};

export default function AromasPage() {
  return (
    <>
      <p className="kicker">Aroma · 香型</p>
      <h1>十二种香型</h1>
      <p className="en-title">The twelve national types, plus one steeped wine.</p>
      <p className="sub">
        Each type has a reference distillery. Yanghe’s “soft strong aroma” stays inside strong aroma. It is not a
        thirteenth type.
      </p>
      <div className="aroma-grid">
        {aromas.map((item) => {
          const brand = brandById(item.referenceBrandId);
          const aroma = aromaById(item.id);
          return (
            <Link key={item.id} className="aroma" href={`/brand/${item.referenceBrandId}`}>
              <div className="name-zh">
                {aroma?.zh} · {aroma?.en}
              </div>
              <p>{item.taste}</p>
              <p className="zh-copy">{item.tasteZh}</p>
              <p className="meta">标准 · {brand?.nameZh}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
