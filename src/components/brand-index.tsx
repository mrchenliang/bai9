"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { aromaById, aromas, brands, skusForBrand, tierRank } from "@/catalog";
import { useMuseum } from "@/components/shell";
import { fieldNoteFor } from "@/field-notes";
import { houseChapters, houseProfiles, type HouseChapterId } from "@/houses";
import type { AromaId, Brand, Sku } from "@/types";

type ViewMode = "guide" | "index";

interface HouseEntry {
  brand: Brand;
  chapter: HouseChapterId;
  takeaway: string;
  badge: string;
  aromaEn: string;
  aromaZh: string;
  flagship?: Sku;
  bottleCount: number;
  priceSpan: string;
  searchHay: string;
}

function formatYuan(value: number): string {
  return `¥${value.toLocaleString("en-US")}`;
}

function buildHouseEntries(): HouseEntry[] {
  return brands.map((brand) => {
    const profile = houseProfiles[brand.id];
    const aroma = aromaById(brand.aroma);
    const bottles = skusForBrand(brand.id).sort(
      (a, b) =>
        tierRank[a.tier] - tierRank[b.tier] ||
        (a.rank ?? 50) - (b.rank ?? 50) ||
        a.nameEn.localeCompare(b.nameEn),
    );
    const flagship = bottles[0];
    const prices = bottles
      .map((sku) => fieldNoteFor(sku, brand.aroma).estYuan)
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b);

    const priceSpan =
      prices.length === 0
        ? "—"
        : prices.length === 1 || prices[0] === prices[prices.length - 1]
          ? formatYuan(prices[0])
          : `${formatYuan(prices[0])}–${formatYuan(prices[prices.length - 1])}`;

    const aromaEn = aroma ? aroma.en.replace(" aroma", "") : "";
    const aromaZh = aroma?.zh ?? "";
    const chapter = profile?.chapter ?? "regional";
    const takeaway = profile?.takeaway ?? brand.distilleryEn;
    const badge =
      profile?.badge ?? (brand.medals.length > 0 ? `${brand.medals.length}× Gold` : `${bottles.length} bottle`);

    const searchHay = [
      brand.nameZh,
      brand.nameEn,
      brand.pinyin,
      brand.provinceZh,
      brand.provinceEn,
      brand.placeEn,
      brand.placeZh,
      aromaEn,
      aromaZh,
      takeaway,
      badge,
      ...bottles.map((s) => `${s.nameEn} ${s.nameZh}`),
    ]
      .join(" ")
      .toLowerCase();

    return {
      brand,
      chapter,
      takeaway,
      badge,
      aromaEn,
      aromaZh,
      flagship,
      bottleCount: bottles.length,
      priceSpan,
      searchHay,
    };
  });
}

const ALL_HOUSES = buildHouseEntries();

export function BrandIndex() {
  const { query } = useMuseum();
  const [chapter, setChapter] = useState<HouseChapterId | "all">("all");
  const [aroma, setAroma] = useState<AromaId | "all">("all");
  const [view, setView] = useState<ViewMode>("guide");

  const aromaOptions = useMemo(() => {
    const present = new Set(brands.map((b) => b.aroma));
    return aromas.filter((a) => present.has(a.id));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_HOUSES.filter((entry) => {
      if (chapter !== "all" && entry.chapter !== chapter) return false;
      if (aroma !== "all" && entry.brand.aroma !== aroma) return false;
      if (q && !entry.searchHay.includes(q)) return false;
      return true;
    });
  }, [aroma, chapter, query]);

  const groupedChapters = useMemo(() => {
    return houseChapters
      .map((ch) => ({
        chapter: ch,
        entries: filtered.filter((entry) => entry.chapter === ch.id),
      }))
      .filter((group) => group.entries.length > 0);
  }, [filtered]);

  return (
    <>
      <p className="kicker">Distillery Houses · 酒厂图鉴</p>
      <h1>
        Distillery Houses <span className="zh-inline">酒厂品牌</span>
      </h1>
      <p className="sub">
        {brands.length} archived Chinese distilleries, grouped by the role they actually play on modern tables — from
        national banquet powers and single-house aroma standards down to Erguotou and everyday grain.
      </p>

      <div className="filters">
        <button
          type="button"
          className="pill"
          aria-pressed={chapter === "all"}
          onClick={() => setChapter("all")}
        >
          All houses
        </button>
        {houseChapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className="pill"
            aria-pressed={chapter === ch.id}
            onClick={() => setChapter(chapter === ch.id ? "all" : ch.id)}
          >
            {ch.titleEn}
          </button>
        ))}
        <span className="grow" />
        <select
          className="sort"
          value={aroma}
          onChange={(event) => setAroma(event.target.value as AromaId | "all")}
          aria-label="Filter by aroma"
        >
          <option value="all">All aromas</option>
          {aromaOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.en.replace(" aroma", "")} · {item.zh}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="sort"
          aria-pressed={view === "guide"}
          onClick={() => setView("guide")}
        >
          Field guide
        </button>
        <button
          type="button"
          className="sort"
          aria-pressed={view === "index"}
          onClick={() => setView("index")}
        >
          Compact index
        </button>
      </div>

      <p className="count">
        Showing {filtered.length} of {brands.length} houses
      </p>

      {filtered.length === 0 ? (
        <p className="empty">No distillery house matches that search or filter.</p>
      ) : view === "guide" ? (
        <div className="prov-list">
          {groupedChapters.map(({ chapter: ch, entries }) => (
            <section key={ch.id} id={ch.id} className="prov-row house-chapter-row">
              <div className="prov-head">
                <div className="prov-region">Chapter {ch.numeral}</div>
                <h2 className="prov-title">{ch.titleEn}</h2>
                <div className="prov-zh">{ch.titleZh}</div>
                <p className="banquet-occ">{ch.summary}</p>
                <div className="prov-count">
                  {entries.length} {entries.length === 1 ? "house" : "houses"}
                </div>
              </div>
              <div className="brand-guide-grid">
                {entries.map((entry) => (
                  <Link
                    key={entry.brand.id}
                    href={`/brand/${entry.brand.id}`}
                    className="brand-card"
                  >
                    <div className="brand-card-thumb">
                      {entry.flagship?.image ? (
                        <img
                          src={entry.flagship.image}
                          alt={entry.flagship.nameEn}
                          style={
                            entry.flagship.imagePosition
                              ? { objectPosition: entry.flagship.imagePosition }
                              : undefined
                          }
                        />
                      ) : (
                        <span className="brand-thumb-fallback">{entry.brand.nameZh.slice(0, 1)}</span>
                      )}
                    </div>
                    <div className="brand-card-body">
                      <div className="brand-card-top">
                        <div className="brand-card-name">
                          <span className="name-en-main">{entry.brand.nameEn}</span>
                          <span className="zh-inline-sm">{entry.brand.nameZh}</span>
                        </div>
                        <span className="brand-badge">{entry.badge}</span>
                      </div>
                      <p className="brand-takeaway">{entry.takeaway}</p>
                      <div className="brand-card-meta">
                        <span className="brand-flagship">
                          {entry.flagship ? entry.flagship.nameEn : "—"}
                          <strong> · {entry.priceSpan}</strong>
                        </span>
                        <span className="brand-origin">
                          {entry.brand.provinceEn} · {entry.aromaEn}
                          {entry.bottleCount > 1 ? ` · ${entry.bottleCount} bottles` : ""}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="brand-list">
          <div className="brand-table-head" aria-hidden="true">
            <span />
            <span>House</span>
            <span>Origin</span>
            <span>Aroma</span>
            <span className="align-right">Street Range</span>
            <span className="align-right">Standing</span>
          </div>
          {filtered.map((entry) => (
            <Link key={entry.brand.id} className="brand-row" href={`/brand/${entry.brand.id}`}>
              <div className="brand-mini-thumb">
                {entry.flagship?.image ? (
                  <img
                    src={entry.flagship.image}
                    alt=""
                    style={
                      entry.flagship.imagePosition
                        ? { objectPosition: entry.flagship.imagePosition }
                        : undefined
                    }
                  />
                ) : (
                  <span>{entry.brand.nameZh.slice(0, 1)}</span>
                )}
              </div>
              <div className="brand-row-main">
                <div className="name-en-main">
                  {entry.brand.nameEn} <span className="zh-inline-sm">{entry.brand.nameZh}</span>
                </div>
                <div className="brand-row-sub">{entry.takeaway}</div>
              </div>
              <div className="place">
                {entry.brand.placeEn} · <span className="zh-chip">{entry.brand.provinceZh}</span>
              </div>
              <div className="place">
                {entry.aromaEn} · <span className="zh-chip">{entry.aromaZh}</span>
              </div>
              <div className="brand-price-col">{entry.priceSpan}</div>
              <div className="brand-standing-col">
                <span className="brand-badge">{entry.badge}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
