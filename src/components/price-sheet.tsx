"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { aromaById, brandById, skuAroma, skuById } from "@/catalog";
import { aromaChip, priceSheet, type SheetSpot } from "@/sheet";
import type { AromaId } from "@/types";

interface LegendEntry {
  id: AromaId;
  mark: string;
  en: string;
  zh: string;
  taste: string;
  count: number;
}

function buildLegendEntries(): LegendEntry[] {
  const counts = new Map<AromaId, number>();
  for (const band of priceSheet) {
    for (const spot of band) {
      const sku = skuById(spot.skuId);
      const aroma = sku ? skuAroma(sku) : undefined;
      if (!aroma) continue;
      counts.set(aroma.id, (counts.get(aroma.id) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const aroma = aromaById(id)!;
      return {
        id,
        mark: aromaChip(id),
        en: aroma.en.replace(" aroma", ""),
        zh: aroma.zh,
        taste: aroma.taste,
        count,
      };
    });
}

const LEGEND_ENTRIES = buildLegendEntries();

function Bottle({
  spot,
  activeAroma,
}: {
  spot: SheetSpot;
  activeAroma: AromaId | null;
}) {
  const sku = skuById(spot.skuId);
  const brand = sku ? brandById(sku.brandId) : undefined;
  const aroma = sku ? skuAroma(sku) : undefined;
  const mark = aromaChip(aroma?.id);
  const isDimmed = activeAroma !== null && aroma?.id !== activeAroma;
  const isMatch = activeAroma !== null && aroma?.id === activeAroma;

  return (
    <Link
      className={
        isDimmed
          ? "sheet-bottle is-dimmed"
          : isMatch
            ? "sheet-bottle is-match"
            : "sheet-bottle"
      }
      href={sku ? `/sku/${sku.id}` : "/price-bands"}
    >
      <div className="sheet-photo">
        <b className="sheet-yuan">¥{spot.yuan.toLocaleString("en-US")}</b>
        {sku?.image ? (
          <img
            src={sku.image}
            alt={sku.nameEn}
            style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
          />
        ) : (
          <div className="sheet-plate">
            <b>{brand?.nameZh.slice(0, 2)}</b>
          </div>
        )}
        {mark ? (
          <span
            className="aroma-chip"
            title={aroma ? `${aroma.en} (${aroma.zh})` : undefined}
            aria-label={aroma ? `${aroma.en} (${aroma.zh})` : mark}
          >
            {mark}
          </span>
        ) : null}
      </div>
      <div className="sheet-name">{sku?.nameEn ?? spot.label}</div>
      <div className="sheet-zh">{spot.label}</div>
    </Link>
  );
}

export function PriceSheetView() {
  const [activeAroma, setActiveAroma] = useState<AromaId | null>(null);

  const selectedEntry = useMemo(
    () => (activeAroma ? LEGEND_ENTRIES.find((item) => item.id === activeAroma) ?? null : null),
    [activeAroma],
  );

  return (
    <>
      <aside className="sheet-legend" aria-label="Aroma badge legend">
        <div className="sheet-legend-row">
          <span className="sheet-legend-kicker">Aroma Key · 香型</span>
          <div className="sheet-legend-items" role="group" aria-label="Highlight bottles by aroma">
            {LEGEND_ENTRIES.map((item) => {
              const isSelected = activeAroma === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={isSelected ? "sheet-legend-pill is-active" : "sheet-legend-pill"}
                  aria-pressed={isSelected}
                  onClick={() => setActiveAroma(isSelected ? null : item.id)}
                  title={`${item.en} aroma (${item.zh}) — click to highlight`}
                >
                  <span className="sheet-legend-dot" aria-hidden="true">
                    {item.mark}
                  </span>
                  <span className="sheet-legend-en">{item.en}</span>
                  <span className="sheet-legend-count">{item.count}</span>
                </button>
              );
            })}
            {activeAroma ? (
              <button
                type="button"
                className="sheet-legend-clear"
                onClick={() => setActiveAroma(null)}
              >
                Show all
              </button>
            ) : null}
          </div>
          <Link className="sheet-legend-link" href="/aromas">
            All 12 aromas →
          </Link>
        </div>
        {selectedEntry ? (
          <p className="sheet-legend-note">
            <strong>
              {selectedEntry.en} aroma ({selectedEntry.zh})
            </strong>{" "}
            — {selectedEntry.taste}
          </p>
        ) : null}
      </aside>

      <div className="sheet">
        {priceSheet.map((band) => (
          <section key={band[0]?.skuId} className="sheet-band">
            {band.map((spot) => (
              <Bottle key={spot.skuId} spot={spot} activeAroma={activeAroma} />
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
