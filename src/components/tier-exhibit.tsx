"use client";

import { type DragEvent, useMemo, useState } from "react";
import { aromas, brandById, skuAroma, skuById, skus, tiers } from "@/catalog";
import type { AromaId, Sku, TierId } from "@/types";
import { Card } from "@/components/card";
import { AromaGrainIcon } from "@/components/grain-icons";
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

interface DragState {
  skuId: string;
  source: CustomRowId | "tray";
}

interface ChipDropTarget {
  rowId: CustomRowId;
  skuId: string;
  position: "before" | "after";
}

export function TierExhibit() {
  const { query } = useMuseum();
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [selectedTier, setSelectedTier] = useState<TierId | "all">("all");
  const [view, setView] = useState<ViewMode>("gallery");

  const [customRows, setCustomRows] = useState<Record<CustomRowId, string[]>>(STARTER_RANKING);
  const [activeRow, setActiveRow] = useState<CustomRowId>("S");
  const [exporting, setExporting] = useState(false);

  const [dragItem, setDragItem] = useState<DragState | null>(null);
  const [dragOverRow, setDragOverRow] = useState<CustomRowId | null>(null);
  const [dragOverChip, setDragOverChip] = useState<ChipDropTarget | null>(null);
  const [dragOverTray, setDragOverTray] = useState(false);

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

  function moveBottleToRow(
    skuId: string,
    targetRow: CustomRowId,
    targetChipId?: string,
    position: "before" | "after" = "after",
  ) {
    setCustomRows((prev) => {
      const next: Record<CustomRowId, string[]> = {
        S: prev.S.filter((id) => id !== skuId),
        A: prev.A.filter((id) => id !== skuId),
        B: prev.B.filter((id) => id !== skuId),
        C: prev.C.filter((id) => id !== skuId),
        TAX: prev.TAX.filter((id) => id !== skuId),
      };
      const targetList = [...next[targetRow]];
      if (targetChipId && targetChipId !== skuId) {
        const idx = targetList.indexOf(targetChipId);
        if (idx !== -1) {
          targetList.splice(position === "before" ? idx : idx + 1, 0, skuId);
        } else {
          targetList.push(skuId);
        }
      } else {
        targetList.push(skuId);
      }
      next[targetRow] = targetList;
      return next;
    });
  }

  function addToActiveRow(skuId: string) {
    moveBottleToRow(skuId, activeRow);
  }

  function removeFromAllRows(skuId: string) {
    setCustomRows((prev) => ({
      S: prev.S.filter((id) => id !== skuId),
      A: prev.A.filter((id) => id !== skuId),
      B: prev.B.filter((id) => id !== skuId),
      C: prev.C.filter((id) => id !== skuId),
      TAX: prev.TAX.filter((id) => id !== skuId),
    }));
  }

  function removeFromRow(rowId: CustomRowId, skuId: string) {
    setCustomRows((prev) => ({
      ...prev,
      [rowId]: prev[rowId].filter((id) => id !== skuId),
    }));
  }

  function clearDragState() {
    setDragItem(null);
    setDragOverRow(null);
    setDragOverChip(null);
    setDragOverTray(false);
  }

  function handleDragStart(event: DragEvent<HTMLElement>, skuId: string, source: CustomRowId | "tray") {
    setDragItem({ skuId, source });
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", skuId);
  }

  function handleRowDragOver(event: DragEvent<HTMLDivElement>, rowId: CustomRowId) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverRow !== rowId) setDragOverRow(rowId);
    if (dragOverChip !== null) setDragOverChip(null);
    if (dragOverTray) setDragOverTray(false);
  }

  function handleRowDragLeave(event: DragEvent<HTMLDivElement>, rowId: CustomRowId) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    if (dragOverRow === rowId) setDragOverRow(null);
    if (dragOverChip?.rowId === rowId) setDragOverChip(null);
  }

  function handleChipDragOver(event: DragEvent<HTMLButtonElement>, rowId: CustomRowId, skuId: string) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    if (dragOverRow !== rowId) setDragOverRow(rowId);
    if (dragOverTray) setDragOverTray(false);
    if (dragItem?.skuId === skuId) {
      if (dragOverChip !== null) setDragOverChip(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const position: "before" | "after" = event.clientX < rect.left + rect.width / 2 ? "before" : "after";
    if (
      !dragOverChip ||
      dragOverChip.rowId !== rowId ||
      dragOverChip.skuId !== skuId ||
      dragOverChip.position !== position
    ) {
      setDragOverChip({ rowId, skuId, position });
    }
  }

  function handleRowDrop(event: DragEvent<HTMLElement>, rowId: CustomRowId) {
    event.preventDefault();
    event.stopPropagation();
    const skuId = dragItem?.skuId || event.dataTransfer.getData("text/plain");
    if (skuId) {
      const targetChip = dragOverChip?.rowId === rowId ? dragOverChip : null;
      moveBottleToRow(skuId, rowId, targetChip?.skuId, targetChip?.position);
      setActiveRow(rowId);
    }
    clearDragState();
  }

  function handleTrayDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (!dragOverTray) setDragOverTray(true);
    if (dragOverRow !== null) setDragOverRow(null);
    if (dragOverChip !== null) setDragOverChip(null);
  }

  function handleTrayDragLeave(event: DragEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setDragOverTray(false);
  }

  function handleTrayDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const skuId = dragItem?.skuId || event.dataTransfer.getData("text/plain");
    if (skuId) {
      removeFromAllRows(skuId);
    }
    clearDragState();
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
              className="pill aroma-pill"
              aria-pressed={aroma === item.id}
              onClick={() => setAroma(aroma === item.id ? "all" : item.id)}
            >
              <span className="aroma-pill-icon" aria-hidden="true">
                <AromaGrainIcon id={item.id} size={16} />
              </span>
              <span>{item.en.replace(" aroma", "")}</span>
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
              <strong>Drag bottles between tiers, reorder within a row, or drop below to unrank.</strong>
              <span className="ranker-hint">
                Or click a row and tap bottles to place/remove. Active row:{" "}
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
              const isDropTarget = dragOverRow === row.id;
              return (
                <div
                  key={row.id}
                  className={[
                    "ranker-row",
                    isSelected ? "is-active" : "",
                    isDropTarget ? "is-drag-over" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setActiveRow(row.id)}
                  onDragOver={(event) => handleRowDragOver(event, row.id)}
                  onDragLeave={(event) => handleRowDragLeave(event, row.id)}
                  onDrop={(event) => handleRowDrop(event, row.id)}
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
                        {isDropTarget
                          ? `Drop here to place into ${row.code} · ${row.zh}`
                          : isSelected
                            ? "Active — drag or tap any bottle below to place here"
                            : "Drop bottles here or click row"}
                      </span>
                    ) : (
                      items.map((sku) => {
                        const isDragging = dragItem?.skuId === sku.id;
                        const dropSide =
                          dragOverChip && dragOverChip.rowId === row.id && dragOverChip.skuId === sku.id
                            ? dragOverChip.position
                            : null;
                        return (
                          <button
                            key={sku.id}
                            type="button"
                            draggable
                            className={[
                              "ranker-chip",
                              isDragging ? "is-dragging" : "",
                              dropSide === "before" ? "is-drop-before" : "",
                              dropSide === "after" ? "is-drop-after" : "",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            title="Drag to move or reorder · Click to remove"
                            onDragStart={(event) => handleDragStart(event, sku.id, row.id)}
                            onDragEnd={clearDragState}
                            onDragOver={(event) => handleChipDragOver(event, row.id, sku.id)}
                            onDrop={(event) => handleRowDrop(event, row.id)}
                            onClick={(event) => {
                              event.stopPropagation();
                              removeFromRow(row.id, sku.id);
                            }}
                          >
                            {sku.image ? <img src={sku.image} alt="" draggable={false} /> : null}
                            <span>{sku.nameEn}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="section-label">
            Unranked Specimens ({unplacedSkus.length}) — drag into a tier or tap to place into{" "}
            {CUSTOM_ROWS.find((r) => r.id === activeRow)?.code} ·{" "}
            {CUSTOM_ROWS.find((r) => r.id === activeRow)?.zh}
          </h2>
          <div
            className={dragOverTray ? "ranker-tray is-drag-over" : "ranker-tray"}
            onDragOver={handleTrayDragOver}
            onDragLeave={handleTrayDragLeave}
            onDrop={handleTrayDrop}
          >
            {unplacedSkus.length === 0 ? (
              <span className="ranker-empty">
                {dragOverTray ? "Drop here to return bottle to unranked" : "All matching specimens are ranked above — drag any bottle here to unrank it."}
              </span>
            ) : (
              unplacedSkus.map((sku) => {
                const isDragging = dragItem?.skuId === sku.id;
                return (
                  <button
                    key={sku.id}
                    type="button"
                    draggable
                    className={isDragging ? "ranker-chip tray is-dragging" : "ranker-chip tray"}
                    title="Drag into any tier row · Click to place in active row"
                    onDragStart={(event) => handleDragStart(event, sku.id, "tray")}
                    onDragEnd={clearDragState}
                    onClick={() => addToActiveRow(sku.id)}
                  >
                    {sku.image ? <img src={sku.image} alt="" draggable={false} /> : null}
                    <span>{sku.nameEn}</span>
                  </button>
                );
              })
            )}
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
