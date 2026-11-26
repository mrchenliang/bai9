"use client";

import Link from "next/link";
import { aromaById, brands } from "@/catalog";
import { useMuseum } from "@/components/shell";

export function BrandIndex() {
  const { query } = useMuseum();
  const q = query.trim().toLowerCase();
  const rows = brands.filter((brand) => {
    if (!q) return true;
    return [brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceZh, brand.provinceEn]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
  return (
    <>
      <p className="kicker">Distillery Houses · 酒厂品牌</p>
      <h1>
        Distillery Houses <span className="zh-inline">酒厂品牌</span>
      </h1>
      <p className="sub">
        {rows.length} archived houses with full bottle dossiers. National Famous Liquor medal years (1952–1989) are
        noted on the right. Looking for smaller regional producers?{" "}
        <Link href="/provinces">Browse the 27-province regional atlas →</Link>
      </p>
      <div className="brand-list">
        {rows.map((brand) => {
          const aroma = aromaById(brand.aroma);
          return (
            <Link key={brand.id} className="brand-row" href={`/brand/${brand.id}`}>
              <div>
                <div className="name-en-main">
                  {brand.nameEn} <span className="zh-inline-sm">{brand.nameZh}</span>
                </div>
                <div className="name-en">{brand.distilleryEn}</div>
              </div>
              <div className="place">
                {brand.placeEn} · <span className="zh-chip">{brand.provinceZh}</span>
              </div>
              <div className="place">
                {aroma?.en.replace(" aroma", "")} · <span className="zh-chip">{aroma?.zh}</span>
              </div>
              <div className="medals">{brand.medals.length ? brand.medals.join(" ") : "—"}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
