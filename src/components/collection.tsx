"use client";

import { useMemo, useState } from "react";
import { aromas, brandById, brands, skuAroma, skus, tierRank, tiers } from "@/catalog";
import type { AromaId, TierId } from "@/types";
import { Card } from "@/components/card";
import { useMuseum } from "@/components/shell";

type SortId = "tier" | "az";

export function Collection() {
  const { query } = useMuseum();
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [tier, setTier] = useState<TierId | "all">("all");
  const [province, setProvince] = useState("all");
  const [sort, setSort] = useState<SortId>("tier");

  const provinces = useMemo(
    () => [...new Set(brands.map((brand) => brand.provinceEn))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = skus.filter((sku) => {
      const brand = brandById(sku.brandId);
      if (!brand) return false;
      if (aroma !== "all" && skuAroma(sku)?.id !== aroma) return false;
      if (tier !== "all" && sku.tier !== tier) return false;
      if (province !== "all" && brand.provinceEn !== province) return false;
      if (!q) return true;
      const hay = [sku.nameZh, sku.nameEn, brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceEn, brand.provinceZh]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const copy = [...rows];
    if (sort === "az") copy.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
    else
      copy.sort(
        (a, b) =>
          tierRank[a.tier] - tierRank[b.tier] ||
          (a.rank ?? 50) - (b.rank ?? 50) ||
          a.nameEn.localeCompare(b.nameEn),
      );
    return copy;
  }, [aroma, province, query, sort, tier]);

  return (
    <>
      <p className="kicker">酒 · Collection · 中国白酒博物馆</p>
      <h1>
        Chinese Baijiu Museum <span className="zh-inline">中国白酒博物馆</span>
      </h1>
      <p className="sub">
        A fixed editorial archive of the bottles China actually argues about — authentic Chinese names, the variation
        in the glass, distillery histories, and national tasting records. No votes, no ratings, no submissions.
      </p>
      <p className="count">
        {brands.length} houses · {skus.length} bottles
        {query || aroma !== "all" || tier !== "all" || province !== "all" ? ` · ${visible.length} showing` : ""}
      </p>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={aroma === "all"} onClick={() => setAroma("all")}>
          All aromas
        </button>
        {aromas
          .filter((item) => item.id !== "prepared")
          .map((item) => (
            <button
              key={item.id}
              type="button"
              className="pill"
              aria-pressed={aroma === item.id}
              onClick={() => setAroma(aroma === item.id ? "all" : item.id)}
            >
              {item.en.replace(" aroma", "")}
            </button>
          ))}
      </div>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={tier === "all"} onClick={() => setTier("all")}>
          All tiers
        </button>
        {tiers.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={tier === item.id}
            onClick={() => setTier(tier === item.id ? "all" : item.id)}
          >
            {item.en}
          </button>
        ))}
        <span className="grow" />
        <button type="button" className="sort" aria-pressed={sort === "tier"} onClick={() => setSort("tier")}>
          By tier
        </button>
        <button type="button" className="sort" aria-pressed={sort === "az"} onClick={() => setSort("az")}>
          A–Z
        </button>
        <select
          className="sort"
          value={province}
          onChange={(event) => setProvince(event.target.value)}
          aria-label="Province"
        >
          <option value="all">All provinces</option>
          {provinces.map((en) => (
            <option key={en} value={en}>
              {en}
            </option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? <p className="empty">No bottle matches that search.</p> : null}
      <div className="grid">
        {visible.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}
