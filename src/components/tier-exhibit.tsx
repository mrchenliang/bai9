"use client";

import { useMemo, useState } from "react";
import { aromas, brandById, skuAroma, skus, tiers } from "@/catalog";
import type { AromaId, TierId } from "@/types";
import { Card } from "@/components/card";
import { useMuseum } from "@/components/shell";

const TIER_META: Record<TierId, { code: string; numeral: string; short: string }> = {
  guoyan: { code: "TIER I", numeral: "I", short: "Ceremonial apex of a formal Chinese table" },
  mingjiu: { code: "TIER II", numeral: "II", short: "National flagships & gold-medal icons" },
  jianiang: { code: "TIER III", numeral: "III", short: "Regional benchmarks & aged cellar blends" },
  kouliang: { code: "TIER IV", numeral: "IV", short: "Everyday pours & table workhorses" },
  export: { code: "EXPORT", numeral: "EX", short: "Bottled & formatted for overseas tables" },
};

type ViewMode = "gallery" | "board";

export function TierExhibit() {
  const { query } = useMuseum();
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [selectedTier, setSelectedTier] = useState<TierId | "all">("all");
  const [view, setView] = useState<ViewMode>("gallery");

  const filteredSkus = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skus.filter((sku) => {
      if (aroma !== "all" && skuAroma(sku)?.id !== aroma) return false;
      if (!q) return true;
      const brand = brandById(sku.brandId);
      const hay = [
        sku.nameEn,
        sku.nameZh,
        brand?.nameEn ?? "",
        brand?.nameZh ?? "",
        brand?.provinceEn ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [aroma, query]);

  const countsByTier = useMemo(() => {
    const counts: Record<TierId, number> = {
      guoyan: 0,
      mingjiu: 0,
      jianiang: 0,
      kouliang: 0,
      export: 0,
    };
    for (const sku of filteredSkus) counts[sku.tier]++;
    return counts;
  }, [filteredSkus]);

  const visibleTiers = selectedTier === "all" ? tiers : tiers.filter((t) => t.id === selectedTier);

  return (
    <>
      <p className="kicker">Exhibition Hall II · Tier System · 四档梯队</p>
      <h1>
        The Baijiu Tier System <span className="zh-inline">四档梯队</span>
      </h1>
      <p className="sub">
        A fixed curatorial hierarchy reflecting each bottle’s standing on a Chinese table — from ceremonial State Table
        apexes (国宴) down to Everyday Daily Grain (口粮), followed by Export bottlings (出口). Street prices are
        recorded on each specimen placard, never used to buy a higher rank.
      </p>

      <div className="tier-overview" role="region" aria-label="Tier overview">
        {tiers.map((tier) => {
          const meta = TIER_META[tier.id];
          const isActive = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              type="button"
              className={`tier-pillar ${tier.id}${isActive ? " is-selected" : ""}`}
              aria-pressed={isActive}
              onClick={() => setSelectedTier(isActive ? "all" : tier.id)}
            >
              <div className="pillar-top">
                <span className="pillar-code">{meta.code}</span>
                <span className="pillar-count">{countsByTier[tier.id]}</span>
              </div>
              <div className="pillar-zh">{tier.zh}</div>
              <div className="pillar-en">{tier.en}</div>
              <p className="pillar-short">{meta.short}</p>
            </button>
          );
        })}
      </div>

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
        <span className="grow" />
        {selectedTier !== "all" ? (
          <button type="button" className="sort" onClick={() => setSelectedTier("all")}>
            Show all tiers
          </button>
        ) : null}
        <button
          type="button"
          className="sort"
          aria-pressed={view === "gallery"}
          onClick={() => setView("gallery")}
        >
          Gallery view
        </button>
        <button
          type="button"
          className="sort"
          aria-pressed={view === "board"}
          onClick={() => setView("board")}
        >
          Compact board
        </button>
      </div>

      <div className={view === "board" ? "tier-board is-compact" : "tier-board is-gallery"}>
        {visibleTiers.map((tier) => {
          const meta = TIER_META[tier.id];
          const rows = filteredSkus
            .filter((sku) => sku.tier === tier.id)
            .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50) || a.nameEn.localeCompare(b.nameEn));
          return (
            <section key={tier.id} id={tier.id} className={`tier-wing ${tier.id}`}>
              <div className="tier-stele">
                <div className="stele-head">
                  <span className="stele-numeral">{meta.numeral}</span>
                  <span className="stele-code">{meta.code}</span>
                </div>
                <strong className="stele-zh">{tier.zh}</strong>
                <em className="stele-en">{tier.en}</em>
                <p className="stele-line">{tier.line}</p>
                <div className="stele-count">
                  {rows.length} {rows.length === 1 ? "specimen" : "specimens"}
                </div>
              </div>
              {rows.length === 0 ? (
                <div className="tier-empty">No specimens in this tier match the current filter.</div>
              ) : view === "board" ? (
                <div className="tier-scroll">
                  {rows.map((sku) => (
                    <Card key={sku.id} sku={sku} />
                  ))}
                </div>
              ) : (
                <div className="tier-gallery-grid">
                  {rows.map((sku) => (
                    <Card key={sku.id} sku={sku} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
