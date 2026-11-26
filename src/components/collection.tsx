"use client";

import { useMemo, useState } from "react";
import { aromas, brandById, brands, skuAroma, skus, tierRank, tiers } from "@/catalog";
import type { AromaId, TierId } from "@/types";
import { Card } from "@/components/card";
import { useMuseum } from "@/components/shell";

type SortId = "tier" | "zh" | "shop";

export function Collection() {
  const { query } = useMuseum();
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [tier, setTier] = useState<TierId | "all">("all");
  const [province, setProvince] = useState("all");
  const [sort, setSort] = useState<SortId>("tier");

  const provinces = useMemo(
    () => [...new Set(brands.map((brand) => brand.provinceZh))].sort((a, b) => a.localeCompare(b, "zh")),
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = skus.filter((sku) => {
      const brand = brandById(sku.brandId);
      if (!brand) return false;
      if (aroma !== "all" && skuAroma(sku)?.id !== aroma) return false;
      if (tier !== "all" && sku.tier !== tier) return false;
      if (province !== "all" && brand.provinceZh !== province) return false;
      if (sort === "shop" && sku.shops.length === 0) return false;
      if (!q) return true;
      const hay = [sku.nameZh, sku.nameEn, brand.nameZh, brand.nameEn, brand.pinyin, brand.provinceEn, brand.provinceZh]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
    const copy = [...rows];
    if (sort === "zh") copy.sort((a, b) => a.nameZh.localeCompare(b.nameZh, "zh"));
    else
      copy.sort(
        (a, b) =>
          tierRank[a.tier] - tierRank[b.tier] ||
          (a.rank ?? 50) - (b.rank ?? 50) ||
          a.nameZh.localeCompare(b.nameZh, "zh"),
      );
    return copy;
  }, [aroma, province, query, sort, tier]);

  return (
    <>
      <p className="kicker">酒 · 藏品</p>
      <h1>中国白酒博物馆</h1>
      <p className="en-title">Chinese Baijiu Museum</p>
      <p className="sub">
        A fixed archive of the bottles China actually argues about. Chinese names, the variation in the glass, a short
        history, and the shops in Canada and the United States that list them. The order does not take votes.
      </p>
      <p className="count">
        {brands.length} brands · {skus.length} bottles
        {query || aroma !== "all" || tier !== "all" || province !== "all" || sort === "shop"
          ? ` · ${visible.length} showing`
          : ""}
      </p>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={aroma === "all"} onClick={() => setAroma("all")}>
          全部香型
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
              {item.zh}
            </button>
          ))}
      </div>
      <div className="filters">
        <button type="button" className="pill" aria-pressed={tier === "all"} onClick={() => setTier("all")}>
          全部梯队
        </button>
        {tiers.map((item) => (
          <button
            key={item.id}
            type="button"
            className="pill"
            aria-pressed={tier === item.id}
            onClick={() => setTier(tier === item.id ? "all" : item.id)}
          >
            {item.zh}
          </button>
        ))}
        <span className="grow" />
        <button type="button" className="sort" aria-pressed={sort === "tier"} onClick={() => setSort("tier")}>
          按梯队
        </button>
        <button type="button" className="sort" aria-pressed={sort === "zh"} onClick={() => setSort("zh")}>
          按中文
        </button>
        <button
          type="button"
          className="sort"
          aria-pressed={sort === "shop"}
          onClick={() => setSort(sort === "shop" ? "tier" : "shop")}
        >
          海外有货单
        </button>
        <select className="sort" value={province} onChange={(event) => setProvince(event.target.value)} aria-label="Province">
          <option value="all">全部省份</option>
          {provinces.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      {visible.length === 0 ? <p className="empty">No bottle under that name.</p> : null}
      <div className="grid">
        {visible.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}
