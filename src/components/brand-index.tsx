"use client";

import Link from "next/link";
import { aromaById, brands } from "@/catalog";
import { useMuseum } from "@/components/shell";

export function BrandIndex() {
  const { query } = useMuseum();
  const q = query.trim().toLowerCase();
  const rows = brands.filter((brand) => {
    if (!q) return true;
    return [brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceZh, brand.provinceEn].join(" ").toLowerCase().includes(q);
  });
  return (
    <>
      <p className="kicker">Brands · 品牌</p>
      <h1>品牌</h1>
      <p className="en-title">{rows.length} houses. The seventeen of 1989 are marked with that year.</p>
      <div className="brand-list">
        {rows.map((brand) => {
          const aroma = aromaById(brand.aroma);
          return (
            <Link key={brand.id} className="brand-row" href={`/brand/${brand.id}`}>
              <div>
                <div className="name-zh">{brand.nameZh}</div>
                <div className="name-en">{brand.nameEn}</div>
              </div>
              <div className="place">
                {brand.provinceZh} · {brand.placeEn}
              </div>
              <div className="place">{aroma?.zh}</div>
              <div className="medals">{brand.medals.length ? brand.medals.join(" ") : "—"}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
