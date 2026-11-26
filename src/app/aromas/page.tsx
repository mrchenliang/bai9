import type { Metadata } from "next";
import Link from "next/link";
import { aromaById, aromas, brandById } from "@/catalog";

export const metadata: Metadata = {
  title: "Twelve Aromas (十二香型)",
  description:
    "Guide to China’s twelve official baijiu aroma standards — sauce, strong, light, rice, and the regional types that shape every bottle.",
  alternates: { canonical: "/aromas" },
};

export default function AromasPage() {
  return (
    <>
      <p className="kicker">Aromas · 十二香型</p>
      <h1>
        The Twelve Aromas <span className="zh-inline">十二香型</span>
      </h1>
      <p className="sub">
        China classifies baijiu by fermentation and aroma profile, not by grain or barrel age. Twelve national aroma
        standards exist, plus steeped botanical spirits (露酒). Each style has a benchmark distillery; Yanghe’s “soft
        strong aroma” (绵柔浓香) sits inside strong aroma rather than forming a thirteenth standard.
      </p>
      <div className="aroma-grid">
        {aromas.map((item) => {
          const brand = brandById(item.referenceBrandId);
          const aroma = aromaById(item.id);
          return (
            <Link key={item.id} className="aroma" href={`/brand/${item.referenceBrandId}`}>
              <div className="aroma-head">
                <span className="name-en-main">{aroma?.en}</span>
                <span className="zh-inline-sm">{aroma?.zh}</span>
              </div>
              <p>{item.taste}</p>
              <p className="meta">
                Reference · {brand?.nameEn} ({brand?.nameZh})
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
