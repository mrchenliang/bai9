"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { brandById, skuAroma, skuById, skus, tierRank, tiers } from "@/catalog";
import { fieldNoteFor } from "@/field-notes";
import { downloadPassportCard } from "@/lib/export-cards";
import { useMuseum } from "@/components/shell";
import type { TierId } from "@/types";

interface RankVerdict {
  zh: string;
  en: string;
  diagnosis: string;
}

function computeRank(tastedIds: string[]): RankVerdict {
  const count = tastedIds.length;
  if (count === 0) {
    return {
      zh: "旁观者",
      en: "Curatorial Observer",
      diagnosis: "Clean liver, unblemished record. Tap any bottle below to stamp your drinking passport.",
    };
  }

  const tastedSet = new Set(tastedIds);
  const tastedSkus = tastedIds.map((id) => skuById(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));

  const hasAllGuoyan = tastedSet.has("feitian") && tastedSet.has("puwu") && tastedSet.has("guojiao");
  const hasFinalBoss =
    tastedSet.has("laobaigan-67") || tastedSet.has("dong-classic") || tastedSet.has("yukbing-classic");

  let kouliangCount = 0;
  let sauceCount = 0;
  let strongCount = 0;
  let lightCount = 0;
  const provinces = new Set<string>();

  for (const s of tastedSkus) {
    if (s.tier === "kouliang") kouliangCount++;
    const aroma = skuAroma(s)?.id;
    if (aroma === "jiang") sauceCount++;
    if (aroma === "nong") strongCount++;
    if (aroma === "qing") lightCount++;
    const b = brandById(s.brandId);
    if (b) provinces.add(b.provinceEn);
  }

  if (count >= 20) {
    return {
      zh: "白酒活化石",
      en: "National Tasting Committee",
      diagnosis: `${count} specimens across ${provinces.size} provinces. You read GB/T codes before looking at the front label.`,
    };
  }
  if (hasAllGuoyan && count >= 5) {
    return {
      zh: "国宴席主",
      en: "Lazy-Susan Diplomat",
      diagnosis: "Survived the holy trinity (Feitian, Wuliangye, 1573). Someone else is definitely paying the dinner bill.",
    };
  }
  if (hasFinalBoss && count >= 3) {
    return {
      zh: "烈酒渡劫者",
      en: "Final-Boss Survivor",
      diagnosis: "67% Hebei fire, medicinal Dongjiu, or Cantonese pork-fat spirit — your palate no longer recognizes fear.",
    };
  }
  if (kouliangCount >= 3 && kouliangCount / count >= 0.55) {
    return {
      zh: "胡同老炮",
      en: "Hutong Realist",
      diagnosis: "Zero packaging tax, maximum grain honesty. You prefer Yellow-Cap Bofen over ¥1,500 gift boxes.",
    };
  }
  if (sauceCount >= 3 && sauceCount >= strongCount && sauceCount >= lightCount) {
    return {
      zh: "赤水信徒",
      en: "Chishui River Purist",
      diagnosis: "Once soy-sesame sauce aroma acquires you back, vodka starts tasting like hospital air.",
    };
  }
  if (strongCount >= 4 && strongCount > sauceCount) {
    return {
      zh: "川酒当家",
      en: "Basin Cellar Boss",
      diagnosis: "Sichuan mud-pit esters run in your bloodstream. Every wedding table in China considers you safe hands.",
    };
  }
  if (provinces.size >= 6) {
    return {
      zh: "九州酒客",
      en: "Provincial Cartographer",
      diagnosis: `Crossed ${provinces.size} regional liquor borders without starting a province argument at the table.`,
    };
  }
  if (count >= 4) {
    return {
      zh: "席间常客",
      en: "Seasoned Table Regular",
      diagnosis: "Knows how to clink lower than the host and never volunteers to drive home.",
    };
  }
  return {
    zh: "初入酒门",
    en: "First-Cup Initiate",
    diagnosis: "Still remembers the exact face they made on their very first 52% sip. Keep stamping.",
  };
}

export function PassportView() {
  const { tasted, toggleTasted, clearTasted, query } = useMuseum();
  const [tierFilter, setTierFilter] = useState<TierId | "all">("all");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const summary = useMemo(() => {
    const tastedSkus = tasted.map((id) => skuById(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
    const provinces = new Set<string>();
    let maxAbv = 0;
    let totalShock = 0;
    let pureCount = 0;
    let estBillYuan = 0;

    for (const s of tastedSkus) {
      const b = brandById(s.brandId);
      if (b) provinces.add(b.provinceEn);
      const note = fieldNoteFor(s, skuAroma(s)?.id);
      if (note.maxAbv > maxAbv) maxAbv = note.maxAbv;
      totalShock += note.shock;
      if (note.gbKind === "pure") pureCount++;
      estBillYuan += note.estYuan;
    }

    const avgShock = tastedSkus.length ? (totalShock / tastedSkus.length).toFixed(1) : "0.0";
    const pureRatio = tastedSkus.length ? Math.round((pureCount / tastedSkus.length) * 100) : 100;
    const rank = computeRank(tasted);

    const topBottles = [...tastedSkus]
      .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || (a.rank ?? 50) - (b.rank ?? 50))
      .slice(0, 6)
      .map((s) => ({ nameEn: s.nameEn, nameZh: s.nameZh, image: s.image }));

    return {
      tastedSkus,
      provinceCount: provinces.size,
      maxAbv,
      avgShock,
      pureRatio,
      estBillYuan,
      rank,
      topBottles,
    };
  }, [tasted]);

  const visibleSkus = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...skus]
      .filter((sku) => {
        if (tierFilter !== "all" && sku.tier !== tierFilter) return false;
        if (!q) return true;
        const b = brandById(sku.brandId);
        return [sku.nameEn, sku.nameZh, b?.nameEn ?? "", b?.provinceEn ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || (a.rank ?? 50) - (b.rank ?? 50));
  }, [tierFilter, query]);

  async function handleExport() {
    setBusy(true);
    try {
      await downloadPassportCard({
        rankZh: summary.rank.zh,
        rankEn: summary.rank.en,
        diagnosis: summary.rank.diagnosis,
        tastedCount: tasted.length,
        totalCount: skus.length,
        maxAbv: summary.maxAbv,
        provinceCount: summary.provinceCount,
        avgShock: summary.avgShock,
        pureRatio: summary.pureRatio,
        estBillYuan: summary.estBillYuan,
        topBottles: summary.topBottles,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const text = [
      `Chinese Baijiu Museum Passport · 酒证`,
      `Rank: ${summary.rank.en} (${summary.rank.zh})`,
      `Specimens Survived: ${tasted.length}/${skus.length} · Max ABV: ${summary.maxAbv || 0}% · Provinces: ${summary.provinceCount} · Est. Table Bill: ¥${summary.estBillYuan.toLocaleString()}`,
      `“${summary.rank.diagnosis}”`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <p className="kicker">Visitor Record · Drinking Passport · 中国白酒博物馆酒证</p>
      <h1>
        Drinking Passport <span className="zh-inline">喝过酒证</span>
      </h1>
      <p className="sub">
        Tap every bottle you have actually survived at a real table. The museum assigns your curatorial rank, calculates
        your pure-grain ratio and estimated dinner bill, and prints a verified archival receipt card for X.
      </p>

      <section className="passport-dossier" aria-label="Your drinking passport summary">
        <div className="passport-head">
          <div>
            <span className="signal-kicker">Curatorial Rank · 酒桌称号</span>
            <h2 className="passport-rank">
              {summary.rank.en} <span className="zh-inline">{summary.rank.zh}</span>
            </h2>
            <p className="passport-diag">{summary.rank.diagnosis}</p>
          </div>
          <div className="passport-seal" aria-hidden="true">
            <b>{tasted.length}</b>
            <span>OF {skus.length}</span>
          </div>
        </div>

        <div className="passport-metrics">
          <div className="p-metric">
            <span>Specimens</span>
            <b>
              {tasted.length} / {skus.length}
            </b>
          </div>
          <div className="p-metric">
            <span>Max ABV Survived</span>
            <b>{summary.maxAbv > 0 ? `${summary.maxAbv}%` : "—"}</b>
          </div>
          <div className="p-metric">
            <span>Provinces</span>
            <b>{summary.provinceCount}</b>
          </div>
          <div className="p-metric">
            <span>Avg Shock Index</span>
            <b>{summary.avgShock} / 5</b>
          </div>
          <div className="p-metric">
            <span>Pure-Grain Ratio</span>
            <b>{summary.pureRatio}%</b>
          </div>
          <div className="p-metric">
            <span>Est. Table Bill</span>
            <b>¥{summary.estBillYuan.toLocaleString()}</b>
          </div>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn solid"
            onClick={handleExport}
            disabled={busy || tasted.length === 0}
          >
            {busy ? "Printing passport PNG..." : "Download Passport Card (PNG)"}
          </button>
          <button type="button" className="btn" onClick={handleCopy} disabled={tasted.length === 0}>
            {copied ? "Copied for X" : "Copy Passport Summary"}
          </button>
          {tasted.length > 0 ? (
            <button type="button" className="btn" onClick={clearTasted}>
              Clear all stamps
            </button>
          ) : null}
        </div>
      </section>

      <div className="filters">
        <button
          type="button"
          className="pill"
          aria-pressed={tierFilter === "all"}
          onClick={() => setTierFilter("all")}
        >
          All tiers
        </button>
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            className="pill"
            aria-pressed={tierFilter === t.id}
            onClick={() => setTierFilter(tierFilter === t.id ? "all" : t.id)}
          >
            {t.en}
          </button>
        ))}
        <span className="grow" />
        <span className="count-inline">Tap any bottle to stamp 已饮</span>
      </div>

      <div className="stamp-grid">
        {visibleSkus.map((sku) => {
          const isStamped = tasted.includes(sku.id);
          const brand = brandById(sku.brandId);
          const note = fieldNoteFor(sku, skuAroma(sku)?.id);
          return (
            <div key={sku.id} className={isStamped ? "stamp-tile is-stamped" : "stamp-tile"}>
              <button
                type="button"
                className="stamp-btn"
                aria-pressed={isStamped}
                onClick={() => toggleTasted(sku.id)}
              >
                <div className="stamp-thumb">
                  {sku.image ? <img src={sku.image} alt={`${sku.nameEn} (${sku.nameZh})`} /> : null}
                  {isStamped ? <span className="tasted-chop">已饮</span> : null}
                </div>
                <div className="stamp-body">
                  <strong>{sku.nameEn}</strong>
                  <span className="stamp-zh">{sku.nameZh}</span>
                  <span className="stamp-meta">
                    {brand?.provinceEn} · {sku.abv} · {note.gbCode}
                  </span>
                </div>
              </button>
              <Link className="stamp-dossier-link" href={`/sku/${sku.id}`} title="Inspect full dossier">
                Dossier →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
