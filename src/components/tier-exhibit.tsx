"use client";

import { useMemo, useState } from "react";
import { aromas, brandById, skuAroma, skuById, skus, tiers } from "@/catalog";
import type { AromaId, Sku, TierId } from "@/types";
import { Card } from "@/components/card";
import { useMuseum } from "@/components/shell";
import { downloadTierListCard } from "@/lib/export-cards";

const TIER_META: Record<TierId, { code: string; numeral: string; short: string }> = {
  guoyan: { code: "TIER I", numeral: "I", short: "Ceremonial apex of a formal Chinese table" },
  mingjiu: { code: "TIER II", numeral: "II", short: "National flagships & gold-medal icons" },
  jianiang: { code: "TIER III", numeral: "III", short: "Regional benchmarks & aged cellar blends" },
  kouliang: { code: "TIER IV", numeral: "IV", short: "Everyday pours & table workhorses" },
};

type CustomRowId = "S" | "A" | "B" | "C" | "TAX";

const CUSTOM_ROWS: { id: CustomRowId; code: string; zh: string; en: string; accent: string }[] = [
  { id: "S", code: "S", zh: "国宴", en: "Untouchable Apex", accent: "#c81e1e" },
  { id: "A", code: "A", zh: "名酒", en: "Serious Respect", accent: "#111111" },
  { id: "B", code: "B", zh: "佳酿", en: "Quietly Great", accent: "#404040" },
  { id: "C", code: "C", zh: "口粮", en: "Honest Daily Grain", accent: "#767676" },
  { id: "TAX", code: "税", zh: "智商税", en: "Vanity Tax", accent: "#b45309" },
];

const STARTER_RANKING: Record<CustomRowId, string[]> = {
  S: ["feitian", "puwu", "guojiao"],
  A: ["qinghua-20", "crystal", "mengzhilan-m6", "xijiu-1988", "qinghualang", "gu20"],
  B: ["tequ", "pinwei", "dong-classic", "jiugui-sack", "laobaigan-67", "xifeng-green"],
  C: ["huanggai", "bofen", "hongxing-56", "erqu", "sanhua-52", "niulan-chen"],
  TAX: ["moutai-yingbin", "jiangxiao-40"],
};

type ViewMode = "gallery" | "board" | "ranker";

export function TierExhibit() {
  const { query } = useMuseum();
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [selectedTier, setSelectedTier] = useState<TierId | "all">("all");
  const [view, setView] = useState<ViewMode>("gallery");

  const [customRows, setCustomRows] = useState<Record<CustomRowId, string[]>>(STARTER_RANKING);
  const [activeRow, setActiveRow] = useState<CustomRowId>("S");
  const [exporting, setExporting] = useState(false);

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
    };
    for (const sku of filteredSkus) counts[sku.tier]++;
    return counts;
  }, [filteredSkus]);

  const placedIds = useMemo(() => {
    const set = new Set<string>();
    for (const list of Object.values(customRows)) {
      for (const id of list) set.add(id);
    }
    return set;
  }, [customRows]);

  const unplacedSkus = useMemo(
    () => filteredSkus.filter((s) => !placedIds.has(s.id)),
    [filteredSkus, placedIds],
  );

  function addToActiveRow(skuId: string) {
    setCustomRows((prev) => {
      const next: Record<CustomRowId, string[]> = {
        S: prev.S.filter((id) => id !== skuId),
        A: prev.A.filter((id) => id !== skuId),
        B: prev.B.filter((id) => id !== skuId),
        C: prev.C.filter((id) => id !== skuId),
        TAX: prev.TAX.filter((id) => id !== skuId),
      };
      next[activeRow] = [...next[activeRow], skuId];
      return next;
    });
  }

  function removeFromRow(rowId: CustomRowId, skuId: string) {
    setCustomRows((prev) => ({
      ...prev,
      [rowId]: prev[rowId].filter((id) => id !== skuId),
    }));
  }

  async function handleExportTierList() {
    setExporting(true);
    try {
      const payload = CUSTOM_ROWS.map((row) => ({
        code: row.code,
        zh: row.zh,
        en: row.en,
        accent: row.accent,
        items: customRows[row.id].map((id) => skuById(id)).filter((s): s is Sku => Boolean(s)),
      }));
      await downloadTierListCard(payload);
    } finally {
      setExporting(false);
    }
  }

  const visibleTiers = selectedTier === "all" ? tiers : tiers.filter((t) => t.id === selectedTier);

  return (
    <>
      <p className="kicker">Exhibition Hall II · Tier System · 四档梯队</p>
      <h1>
        The Baijiu Tier System <span className="zh-inline">四档梯队</span>
      </h1>
      <p className="sub">
        A fixed curatorial hierarchy reflecting each bottle’s standing on a Chinese table — from ceremonial State Table
        apexes (国宴) down to Everyday Daily Grain (口粮). Switch to{" "}
        <strong>Rank Your Own</strong> to build and export a custom PNG tier list for X.
      </p>

      {view !== "ranker" ? (
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
      ) : null}

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
        {view !== "ranker" && selectedTier !== "all" ? (
          <button type="button" className="sort" onClick={() => setSelectedTier("all")}>
            Show all tiers
          </button>
        ) : null}
        <button type="button" className="sort" aria-pressed={view === "gallery"} onClick={() => setView("gallery")}>
          Gallery view
        </button>
        <button type="button" className="sort" aria-pressed={view === "board"} onClick={() => setView("board")}>
          Compact board
        </button>
        <button
          type="button"
          className="sort ranker-toggle"
          aria-pressed={view === "ranker"}
          onClick={() => setView("ranker")}
        >
          Rank Your Own
        </button>
      </div>

      {view === "ranker" ? (
        <section className="ranker-wrap" aria-label="Custom tier list builder">
          <div className="ranker-toolbar">
            <div>
              <strong>Click any tier row to select it, then tap bottles below to place them.</strong>
              <span className="ranker-hint">
                Tap a placed bottle to remove it. Active row:{" "}
                <b>
                  {CUSTOM_ROWS.find((r) => r.id === activeRow)?.code} ·{" "}
                  {CUSTOM_ROWS.find((r) => r.id === activeRow)?.zh}
                </b>
              </span>
            </div>
            <div className="ranker-actions">
              <button type="button" className="btn solid" onClick={handleExportTierList} disabled={exporting}>
                {exporting ? "Exporting PNG..." : "Export Tier List (PNG)"}
              </button>
              <button type="button" className="btn" onClick={() => setCustomRows(STARTER_RANKING)}>
                Reset Starter
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setCustomRows({ S: [], A: [], B: [], C: [], TAX: [] })}
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="ranker-board">
            {CUSTOM_ROWS.map((row) => {
              const items = customRows[row.id]
                .map((id) => skuById(id))
                .filter((s): s is Sku => Boolean(s));
              const isSelected = activeRow === row.id;
              return (
                <div
                  key={row.id}
                  className={isSelected ? "ranker-row is-active" : "ranker-row"}
                  onClick={() => setActiveRow(row.id)}
                >
                  <button
                    type="button"
                    className="ranker-stele"
                    style={{ borderLeftColor: row.accent }}
                    aria-pressed={isSelected}
                    onClick={() => setActiveRow(row.id)}
                  >
                    <span className="ranker-code" style={{ color: row.accent }}>
                      {row.code}
                    </span>
                    <strong className="ranker-zh">{row.zh}</strong>
                    <span className="ranker-en">{row.en}</span>
                  </button>
                  <div className="ranker-slots">
                    {items.length === 0 ? (
                      <span className="ranker-empty">
                        {isSelected ? "Active — tap any bottle below to place here" : "Click row to add bottles"}
                      </span>
                    ) : (
                      items.map((sku) => (
                        <button
                          key={sku.id}
                          type="button"
                          className="ranker-chip"
                          title="Click to remove from this tier"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeFromRow(row.id, sku.id);
                          }}
                        >
                          {sku.image ? <img src={sku.image} alt="" /> : null}
                          <span>{sku.nameEn}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="section-label">
            Unranked Specimens ({unplacedSkus.length}) — tap to place into{" "}
            {CUSTOM_ROWS.find((r) => r.id === activeRow)?.code} ·{" "}
            {CUSTOM_ROWS.find((r) => r.id === activeRow)?.zh}
          </h2>
          <div className="ranker-tray">
            {unplacedSkus.map((sku) => (
              <button
                key={sku.id}
                type="button"
                className="ranker-chip tray"
                onClick={() => addToActiveRow(sku.id)}
              >
                {sku.image ? <img src={sku.image} alt="" /> : null}
                <span>{sku.nameEn}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
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
      )}
    </>
  );
}
