"use client";

import Link from "next/link";
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
      <section className="museum-hero">
        <p className="kicker">Gallery I · Permanent Collection · 常设展厅</p>
        <h1>
          Chinese Baijiu Museum <span className="zh-inline">中国白酒博物馆</span>
        </h1>
        <p className="sub">
          A permanent editorial exhibition of the grain spirits China actually argues about — authentic Chinese
          calligraphy, aroma standards, distillery provenance, and national tasting records. Curated without crowd
          votes, ratings, or submissions.
        </p>
        <div className="museum-stats" aria-label="Collection summary">
          <div className="stat">
            <b>{skus.length}</b>
            <span>Catalogued Specimens · 藏品</span>
          </div>
          <div className="stat">
            <b>{brands.length}</b>
            <span>Archived Houses · 酒厂</span>
          </div>
          <div className="stat">
            <b>12</b>
            <span>Aroma Standards · 十二香型</span>
          </div>
          <div className="stat">
            <b>5</b>
            <span>State Tastings · 1952–1989</span>
          </div>
        </div>
        <Link href="/tiers" className="tier-banner">
          <div>
            <span className="banner-kicker">Featured Hall · 四档梯队展厅</span>
            <strong>Explore the Baijiu Tier System &amp; Rank Your Own</strong>
            <p>
              Inspect all {skus.length} bottles ranked across Tier I State Table (国宴) to Tier IV Daily Grain (口粮),
              or build and export your own PNG tier list.
            </p>
          </div>
          <span className="banner-cta">Enter Tier System →</span>
        </Link>
        <div className="feature-duo">
          <Link href="/table" className="feature-card">
            <span className="banner-kicker">Interactive Desk · 局酒指南</span>
            <strong>What Bottle Do I Bring?</strong>
            <p>
              Meeting your girlfriend’s father, closing a client, or 2am skewers — get the culturally truthful bottle
              and unspoken regional table rule.
            </p>
            <span className="feature-cta">Open Table Guide →</span>
          </Link>
          <Link href="/passport" className="feature-card">
            <span className="banner-kicker">Visitor Record · 喝过酒证</span>
            <strong>Stamp Your Drinking Passport</strong>
            <p>
              Mark every bottle you’ve survived, unlock your curatorial rank, and print a verified museum receipt PNG
              card for X.
            </p>
            <span className="feature-cta">Open Passport →</span>
          </Link>
        </div>
      </section>

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
      <p className="count">
        Showing {visible.length} of {skus.length} catalogued specimens
      </p>
      {visible.length === 0 ? <p className="empty">No specimen matches that filter.</p> : null}
      <div className="grid">
        {visible.map((sku) => (
          <Card key={sku.id} sku={sku} />
        ))}
      </div>
    </>
  );
}
