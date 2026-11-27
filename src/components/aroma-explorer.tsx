"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { aromas, brandById, skuAroma, skus } from "@/catalog";
import { AromaGrainIcon, GrainGroupIcon, type GrainGroupId } from "@/components/grain-icons";
import { useMuseum } from "@/components/shell";
import type { AromaId } from "@/types";

type DrinkVibeId = "whisky" | "bourbon" | "sake" | "amaro" | "wild";

interface AromaProfile {
  grainGroup: GrainGroupId;
  grainLabel: string;
  grainRecipe: string;
  tint: string;
  abv: string;
  notes: [string, string, string];
  hook: string;
  drinkTwin: string;
  drinkVibes: DrinkVibeId[];
  bars: {
    punch: number;
    sweet: number;
    funk: number;
    heat: number;
  };
}

const AROMA_PROFILES: Record<AromaId, AromaProfile> = {
  jiang: {
    grainGroup: "sorghum",
    grainLabel: "Red Sorghum",
    grainRecipe: "Red glutinous sorghum + high-temp wheat qu",
    tint: "#fdf0ec",
    abv: "53%",
    notes: ["Soy", "Roasted", "Umami"],
    hook: "Empty cup stays fragrant",
    drinkTwin: "Peated Scotch & aged sherry",
    drinkVibes: ["whisky"],
    bars: { punch: 5, sweet: 2, funk: 5, heat: 4 },
  },
  nong: {
    grainGroup: "multi",
    grainLabel: "5 Grains",
    grainRecipe: "Sorghum, rice, glutinous rice, wheat & corn",
    tint: "#fef6e4",
    abv: "52%",
    notes: ["Ripe fruit", "Cellar", "Sweet"],
    hook: "King of Chinese banquets",
    drinkTwin: "Bourbon & Jamaican rum",
    drinkVibes: ["bourbon"],
    bars: { punch: 4, sweet: 4, funk: 4, heat: 4 },
  },
  qing: {
    grainGroup: "sorghum",
    grainLabel: "Barley & Pea",
    grainRecipe: "Sorghum + barley-and-pea qu",
    tint: "#eef7ef",
    abv: "42–53%",
    notes: ["Crisp pear", "Clean", "Floral"],
    hook: "Zero funk, pure crisp grain",
    drinkTwin: "Dry gin & crisp sake",
    drinkVibes: ["sake"],
    bars: { punch: 2, sweet: 2, funk: 1, heat: 3 },
  },
  mi: {
    grainGroup: "rice",
    grainLabel: "Paddy Rice",
    grainRecipe: "Steamed rice + Xiaoqu starter",
    tint: "#f2f6ea",
    abv: "38–52%",
    notes: ["Sweet rice", "Honey", "Soft"],
    hook: "3 rings of surface beads",
    drinkTwin: "Junmai sake & floral shochu",
    drinkVibes: ["sake"],
    bars: { punch: 2, sweet: 4, funk: 1, heat: 2 },
  },
  feng: {
    grainGroup: "sorghum",
    grainLabel: "Sorghum & Pea",
    grainRecipe: "Sorghum + barley-pea qu, willow-vat aged",
    tint: "#fcf4e8",
    abv: "45–52%",
    notes: ["Almond", "Citrus", "Balanced"],
    hook: "Aged in woven willow vats",
    drinkTwin: "Irish whiskey & orchard brandy",
    drinkVibes: ["bourbon"],
    bars: { punch: 3, sweet: 3, funk: 2, heat: 3 },
  },
  jian: {
    grainGroup: "multi",
    grainLabel: "Sorghum + Wheat",
    grainRecipe: "Sorghum & multi-grain, dual-fermented",
    tint: "#fdf2ea",
    abv: "42–53%",
    notes: ["Caramel", "Peach", "Savory"],
    hook: "Sauce + strong in one glass",
    drinkTwin: "Sherry-cask single malt",
    drinkVibes: ["whisky", "bourbon"],
    bars: { punch: 4, sweet: 3, funk: 3, heat: 4 },
  },
  dong: {
    grainGroup: "botanical",
    grainLabel: "Sorghum + Herbs",
    grainRecipe: "Sorghum + twin qu with 130+ herbs",
    tint: "#eaf5f1",
    abv: "54%",
    notes: ["Herbal", "Earthy", "Spiced"],
    hook: "130+ secret mountain herbs",
    drinkTwin: "Fernet-Branca & Chartreuse",
    drinkVibes: ["amaro", "wild"],
    bars: { punch: 5, sweet: 2, funk: 5, heat: 4 },
  },
  zhima: {
    grainGroup: "multi",
    grainLabel: "Sesame & Grain",
    grainRecipe: "Sorghum, wheat & bran (zero syrup)",
    tint: "#f9f1e6",
    abv: "52%",
    notes: ["Sesame", "Nutty", "Toasted"],
    hook: "Roasted aroma from fermentation",
    drinkTwin: "Rye whisky & roasted oolong",
    drinkVibes: ["whisky"],
    bars: { punch: 4, sweet: 2, funk: 3, heat: 4 },
  },
  chi: {
    grainGroup: "rice",
    grainLabel: "Rice + Pork Fat",
    grainRecipe: "Rice spirit rested with aged pork fat",
    tint: "#faf1eb",
    abv: "~30%",
    notes: ["Silky", "Mild", "Savory"],
    hook: "Fat-washed before it was cool",
    drinkTwin: "Light shochu & fat-washed cocktails",
    drinkVibes: ["wild", "sake"],
    bars: { punch: 2, sweet: 3, funk: 3, heat: 1 },
  },
  te: {
    grainGroup: "rice",
    grainLabel: "Whole Rice",
    grainRecipe: "Uncrushed whole rice + flour-brick qu",
    tint: "#f8f5e8",
    abv: "45–52%",
    notes: ["Steamed rice", "Bright", "Crisp"],
    hook: "Whole rice, zero husking",
    drinkTwin: "Dry sake & crisp vodka",
    drinkVibes: ["sake"],
    bars: { punch: 3, sweet: 3, funk: 2, heat: 3 },
  },
  laobaigan: {
    grainGroup: "sorghum",
    grainLabel: "Dry Sorghum",
    grainRecipe: "Sorghum + pure wheat medium-temp qu",
    tint: "#fceee8",
    abv: "67%",
    notes: ["Dry grain", "Fiery", "Clean"],
    hook: "67% northern rocket fuel",
    drinkTwin: "Cask-strength rye & moonshine",
    drinkVibes: ["wild"],
    bars: { punch: 5, sweet: 1, funk: 1, heat: 5 },
  },
  fuyu: {
    grainGroup: "multi",
    grainLabel: "5 Grains",
    grainRecipe: "Five grains, three aromas layered in one",
    tint: "#f7f0ec",
    abv: "52–54%",
    notes: ["Fruity", "Clean", "Savory"],
    hook: "3 aromas in a sack bottle",
    drinkTwin: "Complex blended single malt",
    drinkVibes: ["whisky", "bourbon"],
    bars: { punch: 4, sweet: 3, funk: 4, heat: 4 },
  },
  prepared: {
    grainGroup: "botanical",
    grainLabel: "Bamboo + Grain",
    grainRecipe: "Fenjiu grain base steeped with bamboo leaf",
    tint: "#ebf6ee",
    abv: "45%",
    notes: ["Bamboo", "Botanical", "Sweet"],
    hook: "Fenjiu steeped in green bamboo",
    drinkTwin: "Green Chartreuse & herbal aperitif",
    drinkVibes: ["amaro"],
    bars: { punch: 3, sweet: 4, funk: 1, heat: 2 },
  },
};

const GRAIN_FILTERS: { id: "all" | GrainGroupId; label: string }[] = [
  { id: "all", label: "All grains" },
  { id: "sorghum", label: "Sorghum" },
  { id: "multi", label: "Multi-grain" },
  { id: "rice", label: "Rice" },
  { id: "botanical", label: "Botanical" },
];

const DRINK_VIBES: { id: DrinkVibeId; label: string }[] = [
  { id: "whisky", label: "Peated Whisky" },
  { id: "bourbon", label: "Bourbon / Rum" },
  { id: "sake", label: "Gin / Sake" },
  { id: "amaro", label: "Amaro / Fernet" },
  { id: "wild", label: "Wild & Bold" },
];

function PunchDots({ level }: { level: number }) {
  return (
    <span className="punch-meter" aria-label={`Aroma punch ${level} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <i key={n} className={n <= level ? "is-on" : undefined} />
      ))}
    </span>
  );
}

export function AromaExplorer() {
  const { query } = useMuseum();
  const [grainFilter, setGrainFilter] = useState<"all" | GrainGroupId>("all");
  const [drinkVibe, setDrinkVibe] = useState<DrinkVibeId | null>(null);
  const [activeId, setActiveId] = useState<AromaId | null>(null);
  const [spunId, setSpunId] = useState<AromaId | null>(null);
  const [spinningId, setSpinningId] = useState<AromaId | null>(null);
  const spinTimerRef = useRef<number | null>(null);

  const enriched = useMemo(() => {
    return aromas.map((item) => {
      const profile = AROMA_PROFILES[item.id];
      const brand = brandById(item.referenceBrandId);
      const matchingSkus = skus.filter((s) => skuAroma(s)?.id === item.id);
      return {
        item,
        profile,
        brand,
        matchingSkus,
      };
    });
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = enriched.filter(({ item, profile, brand }) => {
      if (grainFilter !== "all" && profile.grainGroup !== grainFilter) return false;
      if (!q) return true;
      return [
        item.en,
        item.zh,
        profile.grainLabel,
        profile.grainRecipe,
        profile.hook,
        profile.drinkTwin,
        ...profile.notes,
        brand?.nameEn ?? "",
        brand?.nameZh ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });

    if (drinkVibe) {
      return [...list].sort((a, b) => {
        const aMatch = a.profile.drinkVibes.includes(drinkVibe) ? 1 : 0;
        const bMatch = b.profile.drinkVibes.includes(drinkVibe) ? 1 : 0;
        return bMatch - aMatch;
      });
    }
    return list;
  }, [drinkVibe, enriched, grainFilter, query]);

  const activeEntry = useMemo(
    () => (activeId ? enriched.find((entry) => entry.item.id === activeId) ?? null : null),
    [activeId, enriched]
  );

  const stepActive = useCallback(
    (delta: number) => {
      if (!activeId || visible.length === 0) return;
      const idx = visible.findIndex((entry) => entry.item.id === activeId);
      if (idx === -1) return;
      const next = visible[(idx + delta + visible.length) % visible.length];
      setActiveId(next.item.id);
      setSpunId(null);
    },
    [activeId, visible]
  );

  useEffect(() => {
    if (!activeId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveId(null);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        stepActive(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepActive(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, stepActive]);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current !== null) window.clearTimeout(spinTimerRef.current);
    };
  }, []);

  function spinACup() {
    if (visible.length === 0) return;
    if (spinTimerRef.current !== null) window.clearTimeout(spinTimerRef.current);
    setSpunId(null);
    const pool = visible.map((e) => e.item.id);
    const target = pool[Math.floor(Math.random() * pool.length)];
    let step = 0;
    const totalSteps = Math.min(8, Math.max(5, pool.length));

    const tick = () => {
      if (step < totalSteps) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setSpinningId(pick);
        step += 1;
        spinTimerRef.current = window.setTimeout(tick, 70 + step * 18);
      } else {
        setSpinningId(target);
        spinTimerRef.current = window.setTimeout(() => {
          setSpinningId(null);
          setSpunId(target);
          setActiveId(target);
        }, 220);
      }
    };
    tick();
  }

  return (
    <>
      <div className="aroma-hero">
        <div>
          <p className="kicker">Aromas · 十二香型</p>
          <h1>
            The Twelve Aromas <span className="zh-inline">十二香型</span>
          </h1>
          <p className="sub">12 official styles + steeped botanicals. Pick a grain, match your palate, or spin a cup.</p>
        </div>
        <button
          type="button"
          className={spinningId ? "spin-btn is-spinning" : "spin-btn"}
          onClick={spinACup}
          disabled={visible.length === 0}
        >
          <span className="spin-die" aria-hidden="true">
            酒
          </span>
          {spinningId ? "Pouring…" : "Spin a cup"}
        </button>
      </div>

      <div className="aroma-controls">
        <div className="aroma-filter-row" role="group" aria-label="Filter by grain">
          {GRAIN_FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? enriched.length
                : enriched.filter((e) => e.profile.grainGroup === f.id).length;
            return (
              <button
                key={f.id}
                type="button"
                className="pill grain-pill"
                aria-pressed={grainFilter === f.id}
                onClick={() => setGrainFilter(grainFilter === f.id && f.id !== "all" ? "all" : f.id)}
              >
                {f.id !== "all" ? <GrainGroupIcon group={f.id} size={15} /> : null}
                <span>{f.label}</span>
                <em className="pill-num">{count}</em>
              </button>
            );
          })}
        </div>

        <div className="vibe-bar" role="group" aria-label="Match by what you usually drink">
          <span className="vibe-label">Usually drink</span>
          {DRINK_VIBES.map((vibe) => (
            <button
              key={vibe.id}
              type="button"
              className="vibe-chip"
              aria-pressed={drinkVibe === vibe.id}
              onClick={() => setDrinkVibe(drinkVibe === vibe.id ? null : vibe.id)}
            >
              {vibe.label}
            </button>
          ))}
          {drinkVibe ? (
            <button type="button" className="vibe-clear" onClick={() => setDrinkVibe(null)}>
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {visible.length === 0 ? <p className="empty">No aromas match that filter.</p> : null}

      <div className="aroma-deck">
        {visible.map(({ item, profile, brand, matchingSkus }) => {
          const isMatch = drinkVibe ? profile.drinkVibes.includes(drinkVibe) : false;
          const isDimmed = Boolean(drinkVibe && !isMatch);
          const isSpinning = spinningId === item.id;
          const isSpun = spunId === item.id;
          const displayTitle = item.en.replace(/\s+aroma$/i, "");

          return (
            <button
              key={item.id}
              type="button"
              id={`aroma-${item.id}`}
              className={[
                "aroma-card",
                isMatch ? "is-match" : "",
                isDimmed ? "is-dimmed" : "",
                isSpinning ? "is-spinning" : "",
                isSpun ? "is-spun" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                setSpunId(null);
                setActiveId(item.id);
              }}
            >
              <div className="aroma-card-top">
                <span className="grain-badge" style={{ background: profile.tint }} title={profile.grainRecipe}>
                  <AromaGrainIcon id={item.id} size={28} />
                </span>
                <div className="aroma-title-wrap">
                  <div className="aroma-title-row">
                    <span className="aroma-en">{displayTitle}</span>
                    <span className="aroma-zh">{item.zh}</span>
                  </div>
                  <div className="aroma-grain-line">
                    <span>{profile.grainLabel}</span>
                    <i>·</i>
                    <span>{profile.abv}</span>
                  </div>
                </div>
                {isMatch ? <span className="match-chop">Match</span> : null}
              </div>

              <div className="aroma-card-mid">
                <div className="aroma-notes-col">
                  <div className="note-chips">
                    {profile.notes.map((note) => (
                      <span key={note} className="note-chip">
                        {note}
                      </span>
                    ))}
                  </div>
                  <div className="punch-row">
                    <span className="punch-label">Punch</span>
                    <PunchDots level={profile.bars.punch} />
                  </div>
                </div>
              </div>

              <div className="aroma-card-foot">
                <span className="aroma-hook">{profile.hook}</span>
                <span className="aroma-ref">
                  {brand?.nameEn}
                  {matchingSkus.length > 1 ? ` · ${matchingSkus.length}` : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeEntry ? (
        <div
          className="aroma-modal-backdrop"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveId(null);
          }}
        >
          <div
            className="aroma-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="aroma-modal-title"
          >
            <div className="aroma-modal-bar">
              <div className="aroma-modal-nav">
                <button type="button" className="modal-icon-btn" onClick={() => stepActive(-1)} aria-label="Previous aroma">
                  ←
                </button>
                <button type="button" className="modal-icon-btn" onClick={() => stepActive(1)} aria-label="Next aroma">
                  →
                </button>
                <button
                  type="button"
                  className="modal-spin-btn"
                  onClick={() => {
                    const others = visible.filter((e) => e.item.id !== activeEntry.item.id);
                    const pool = others.length > 0 ? others : visible;
                    const pick = pool[Math.floor(Math.random() * pool.length)];
                    if (pick) {
                      setSpunId(pick.item.id);
                      setActiveId(pick.item.id);
                    }
                  }}
                >
                  Spin again
                </button>
                {spunId === activeEntry.item.id ? <span className="spun-pill">Tonight’s pour · 今日一盏</span> : null}
              </div>
              <button
                type="button"
                className="modal-icon-btn"
                onClick={() => setActiveId(null)}
                aria-label="Close tasting card"
              >
                ✕
              </button>
            </div>

            <div className="aroma-modal-head">
              <span className="grain-badge grain-badge-lg" style={{ background: activeEntry.profile.tint }}>
                <AromaGrainIcon id={activeEntry.item.id} size={42} />
              </span>
              <div>
                <h2 id="aroma-modal-title">
                  {activeEntry.item.en} <span className="zh-inline-sm">{activeEntry.item.zh}</span>
                </h2>
                <p className="aroma-modal-grain">
                  <strong>{activeEntry.profile.grainLabel}</strong> — {activeEntry.profile.grainRecipe}
                </p>
              </div>
            </div>

            <div className="aroma-modal-tags">
              {activeEntry.profile.notes.map((note) => (
                <span key={note} className="note-chip note-chip-solid">
                  {note}
                </span>
              ))}
              <span className="twin-pill">Drink twin · {activeEntry.profile.drinkTwin}</span>
            </div>

            <div className="flavor-bars">
              {(
                [
                  ["Punch", activeEntry.profile.bars.punch],
                  ["Sweet", activeEntry.profile.bars.sweet],
                  ["Funk", activeEntry.profile.bars.funk],
                  ["Heat", activeEntry.profile.bars.heat],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="flavor-bar-row">
                  <span>{label}</span>
                  <div className="flavor-track">
                    <div className="flavor-fill" style={{ width: `${val * 20}%` }} />
                  </div>
                  <b>{val}/5</b>
                </div>
              ))}
            </div>

            <div className="aroma-modal-note">
              <p>{activeEntry.item.taste}</p>
              <p className="aroma-modal-note-zh">{activeEntry.item.tasteZh}</p>
            </div>

            {activeEntry.brand ? (
              <div className="aroma-modal-bottles">
                <div className="modal-sec-head">
                  <span>Reference style · {activeEntry.brand.nameEn} ({activeEntry.brand.nameZh})</span>
                  <Link href={`/brand/${activeEntry.item.referenceBrandId}`} className="modal-brand-link">
                    Explore house →
                  </Link>
                </div>
                {activeEntry.matchingSkus.length > 0 ? (
                  <div className="modal-text-links">
                    {activeEntry.matchingSkus.slice(0, 6).map((sku) => (
                      <Link key={sku.id} href={`/sku/${sku.id}`} className="modal-text-chip">
                        <b>{sku.nameEn}</b>
                        <span>{sku.nameZh}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
