"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { aromaById, brandById, skuAroma, skuById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META } from "@/field-notes";
import { TastedStamp } from "@/components/shell";
import {
  banquetBands,
  banquetRules,
  giftPersonas,
  giftTraps,
  type BanquetPick,
  type BoxPalette,
  type GiftVibe,
} from "@/banquets";

const GIFTBAG_KEY = "baijiu-museum-giftbag";

interface BagItem {
  skuId: string;
  qty: number;
}

const BOX_SWATCH: Record<BoxPalette, string> = {
  red: "#c81e1e",
  gold: "#b8860b",
  blue: "#1d4ed8",
  celadon: "#2f6f5e",
  classic: "#7c5c3b",
};

const VIBE_FILTERS: { id: "all" | GiftVibe; label: string; zh?: string }[] = [
  { id: "all", label: "All Styles" },
  { id: "festive", label: "Red & Gold", zh: "红金喜庆" },
  { id: "sauce", label: "Sauce", zh: "酱香" },
  { id: "strong", label: "Strong", zh: "浓香" },
  { id: "light", label: "Light", zh: "清香" },
  { id: "distinctive", label: "Distinctive", zh: "特色香型" },
];

type PanicBudget = "any" | "under500" | "splurge";

function loadBag(): BagItem[] {
  try {
    const raw = localStorage.getItem(GIFTBAG_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is BagItem =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as BagItem).skuId === "string" &&
          typeof (item as BagItem).qty === "number" &&
          (item as BagItem).qty > 0,
      )
      .slice(0, 12);
  } catch {
    return [];
  }
}

function formatYuan(amount: number): string {
  return `¥${amount.toLocaleString("en-US")}`;
}

export function GiftGuide() {
  const [activePersonaId, setActivePersonaId] = useState<string>(giftPersonas[0].id);
  const [activeBandId, setActiveBandId] = useState<string>("all");
  const [activeVibe, setActiveVibe] = useState<"all" | GiftVibe>("all");
  const [bag, setBag] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagMode, setBagMode] = useState<"gift" | "banquet">("gift");
  const [tables, setTables] = useState(10);
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Panic Pick ("Already in the cab?") roulette state
  const [panicBudget, setPanicBudget] = useState<PanicBudget>("any");
  const [panicPick, setPanicPick] = useState<BanquetPick | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setBag(loadBag());
  }, []);

  function updateBag(updater: (prev: BagItem[]) => BagItem[]) {
    setBag((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(GIFTBAG_KEY, JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  function addOrToggleBag(skuId: string, defaultQty: number = 2) {
    updateBag((prev) => {
      const exists = prev.find((item) => item.skuId === skuId);
      if (exists) {
        return prev.filter((item) => item.skuId !== skuId);
      }
      return [...prev, { skuId, qty: defaultQty }];
    });
  }

  function setItemQty(skuId: string, qty: number) {
    if (qty <= 0) {
      updateBag((prev) => prev.filter((item) => item.skuId !== skuId));
      return;
    }
    updateBag((prev) => prev.map((item) => (item.skuId === skuId ? { ...item, qty: Math.min(99, qty) } : item)));
  }

  function clearBag() {
    updateBag(() => []);
  }

  function bagQtyOf(skuId: string): number {
    return bag.find((item) => item.skuId === skuId)?.qty ?? 0;
  }

  const allPicks = useMemo(() => banquetBands.flatMap((band) => band.picks), []);

  const panicPool = useMemo(() => {
    return allPicks.filter((pick) => {
      const sku = skuById(pick.skuId);
      if (!sku) return false;
      const note = fieldNoteFor(sku, skuAroma(sku)?.id);
      if (panicBudget === "under500") return note.estYuan <= 460;
      if (panicBudget === "splurge") return note.estYuan >= 500;
      return true;
    });
  }, [allPicks, panicBudget]);

  function spinPanicPick() {
    if (panicPool.length === 0) return;
    setIsSpinning(true);
    const candidates =
      panicPool.length > 1 && panicPick
        ? panicPool.filter((item) => item.skuId !== panicPick.skuId)
        : panicPool;
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    window.setTimeout(() => {
      setPanicPick(chosen);
      setIsSpinning(false);
    }, 180);
  }

  const activePersona = useMemo(
    () => giftPersonas.find((p) => p.id === activePersonaId) ?? giftPersonas[0],
    [activePersonaId],
  );

  const visibleBands = useMemo(() => {
    return banquetBands
      .filter((band) => activeBandId === "all" || band.id === activeBandId)
      .map((band) => ({
        ...band,
        picks: band.picks.filter((pick) => activeVibe === "all" || pick.vibe === activeVibe),
      }))
      .filter((band) => band.picks.length > 0);
  }, [activeBandId, activeVibe]);

  const totalShownCount = useMemo(
    () => visibleBands.reduce((sum, band) => sum + band.picks.length, 0),
    [visibleBands],
  );

  const bagDetailed = useMemo(() => {
    return bag
      .map((item) => {
        const sku = skuById(item.skuId);
        if (!sku) return null;
        const aroma = skuAroma(sku);
        const note = fieldNoteFor(sku, aroma?.id);
        return {
          ...item,
          sku,
          aroma,
          note,
          unitPrice: note.estYuan,
          priceLabel: sku.chinaPrice ?? `~¥${note.estYuan}`,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [bag]);

  const totalGiftBottles = useMemo(
    () => bagDetailed.reduce((sum, item) => sum + item.qty, 0),
    [bagDetailed],
  );

  const totalGiftYuan = useMemo(
    () => bagDetailed.reduce((sum, item) => sum + item.unitPrice * item.qty, 0),
    [bagDetailed],
  );

  // Banquet calculator: 2 bottles per table of 10, 6 bottles per case
  const banquetBottlesNeeded = tables * 2;
  const banquetCasesNeeded = Math.ceil(banquetBottlesNeeded / 6);
  const banquetPrimaryItem = bagDetailed[0] ?? null;
  const banquetTotalYuan = banquetPrimaryItem
    ? banquetPrimaryItem.unitPrice * banquetBottlesNeeded
    : 0;

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1800);
    } catch {
      // ignore clipboard errors
    }
  }

  function handleCopyShoppingList() {
    if (bagDetailed.length === 0) return;
    if (bagMode === "banquet" && banquetPrimaryItem) {
      const text = [
        `Banquet Wine Run · 宴席采买清单 (${tables} tables)`,
        `Bottle: ${banquetPrimaryItem.sku.nameEn} (${banquetPrimaryItem.sku.nameZh})`,
        `Quantity: ${banquetBottlesNeeded} bottles (~${banquetCasesNeeded} cases of 6, 2/table)`,
        `Est. Budget: ~${formatYuan(banquetTotalYuan)} (${banquetPrimaryItem.priceLabel}/bottle · ${banquetPrimaryItem.note.gbCode})`,
        `Tip: Ask for matching red/official carrier bags and verify sealed cases.`,
      ].join("\n");
      copyText("bag-list", text);
      return;
    }

    const lines = bagDetailed.map(
      (item) =>
        `• ${item.qty}× ${item.sku.nameEn} (${item.sku.nameZh}) — ${item.priceLabel}/ea · ${item.note.gbCode}`,
    );
    const text = [
      `Baijiu Gift List · 送礼采买清单`,
      ...lines,
      `Total: ${totalGiftBottles} bottle${totalGiftBottles === 1 ? "" : "s"} · Est. ~${formatYuan(totalGiftYuan)}`,
      `From Chinese Baijiu Museum (bai9.app/banquets)`,
    ].join("\n");
    copyText("bag-list", text);
  }

  function handleCopyGiftNote() {
    const names =
      bagDetailed.length > 0
        ? bagDetailed.map((item) => `${item.sku.nameZh} (${item.sku.nameEn})`).join(" + ")
        : `${activePersona.picks[0] ? skuById(activePersona.picks[0].skuId)?.nameZh : "佳酿"}`;
    const text = [
      `${activePersona.toastZh}`,
      `${activePersona.sayThis}`,
      `— ${names}`,
    ].join("\n");
    copyText("gift-note", text);
  }

  const panicSku = panicPick ? skuById(panicPick.skuId) : null;
  const panicNote = panicSku ? fieldNoteFor(panicSku, skuAroma(panicSku)?.id) : null;

  return (
    <>
      {/* Editorial Gift Guide Masthead */}
      <section className="gift-hero">
        <div className="gift-hero-copy">
          <div className="gift-edition-row">
            <span className="gift-chop" aria-hidden="true">
              礼
            </span>
            <p className="kicker">Gift Issue · 升学宴 · 婚宴 · 请客送礼指南</p>
          </div>
          <h1>
            The Baijiu Gift Guide <span className="zh-inline">选酒送礼指南</span>
          </h1>
          <p className="sub">
            In China, a bottle in a paper tote bag is a love letter, a status signal, and a peace offering all at once.
            Shop by the person you’re trying to impress, browse four real-world budget shelves, and pack your own gift
            list (pairs encouraged, traps avoided).
          </p>
          <div className="gift-hero-jump">
            <a href="#by-recipient">Shop by recipient</a>
            <span>·</span>
            <a href="#by-budget">Browse 4 price shelves</a>
            <span>·</span>
            <a href="#playbook">6 unwritten rules</a>
            <span>·</span>
            <Link href="/table">Need province etiquette? Try Table Advisor →</Link>
          </div>
        </div>

        {/* Playful "Already in the cab?" Panic Picker */}
        <aside className="panic-box" aria-label="Quick gift roulette">
          <div className="panic-top">
            <span className="signal-kicker">In the Cab? · 救急盲选</span>
            <div className="panic-budgets" role="group" aria-label="Quick pick budget">
              {(
                [
                  { id: "any", label: "Any" },
                  { id: "under500", label: "≤¥450" },
                  { id: "splurge", label: "¥500+" },
                ] as { id: PanicBudget; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={panicBudget === opt.id ? "panic-chip is-on" : "panic-chip"}
                  onClick={() => setPanicBudget(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {panicPick && panicSku && panicNote ? (
            <div className={isSpinning ? "panic-result is-spinning" : "panic-result"}>
              <div className="panic-result-head">
                {panicSku.image ? (
                  <Link href={`/sku/${panicSku.id}`} className="panic-thumb">
                    <img src={panicSku.image} alt={panicSku.nameEn} />
                  </Link>
                ) : null}
                <div className="panic-meta">
                  <span className="panic-arch">{panicPick.archetype}</span>
                  <Link href={`/sku/${panicSku.id}`} className="panic-name">
                    {panicSku.nameEn} <span className="zh-inline-sm">{panicSku.nameZh}</span>
                  </Link>
                  <div className="panic-price">
                    <strong>{panicSku.chinaPrice ?? `~¥${panicNote.estYuan}`}</strong> · {panicSku.abv} ·{" "}
                    {panicPick.bestFor}
                  </div>
                </div>
              </div>
              <p className="panic-line">Say at the door: “{panicPick.handoffLine}”</p>
              <div className="panic-actions">
                <button
                  type="button"
                  className={bagQtyOf(panicSku.id) > 0 ? "btn stamp-active" : "btn solid"}
                  onClick={() => addOrToggleBag(panicSku.id, 2)}
                >
                  {bagQtyOf(panicSku.id) > 0 ? `✓ In Gift Bag (×${bagQtyOf(panicSku.id)})` : "+ Add Pair (×2)"}
                </button>
                <button type="button" className="btn" onClick={spinPanicPick}>
                  Spin again ↻
                </button>
              </div>
            </div>
          ) : (
            <div className="panic-idle">
              <p>
                Running late to dinner and staring at a liquor-shop wall? Spin for an instant, zero-regret bottle plus
                the exact line to say as you hand it over.
              </p>
              <button type="button" className="btn solid panic-spin-btn" onClick={spinPanicPick}>
                Spin a Gift Pick · 盲选一瓶
              </button>
            </div>
          )}
        </aside>
      </section>

      {/* Section 1: Shop by Recipient */}
      <section id="by-recipient" className="gift-section">
        <div className="gift-section-head">
          <div>
            <p className="kicker">01 · Shop by Recipient · 按送礼对象挑</p>
            <h2 className="gift-h2">
              Who are you trying to impress? <span className="zh-inline">送给谁</span>
            </h2>
          </div>
          <span className="gift-hint">Pick a scenario for our 3-bottle editorial spread</span>
        </div>

        <div className="persona-tabs" role="tablist" aria-label="Gift recipients">
          {giftPersonas.map((persona) => {
            const isSelected = persona.id === activePersona.id;
            return (
              <button
                key={persona.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "persona-tab is-on" : "persona-tab"}
                onClick={() => setActivePersonaId(persona.id)}
              >
                <b>{persona.label}</b>
                <span>{persona.zh}</span>
              </button>
            );
          })}
        </div>

        <div className="persona-stage" role="tabpanel">
          <div className="persona-stage-head">
            <div>
              <h3>
                {activePersona.label} <span className="zh-inline">{activePersona.zh}</span>
              </h3>
              <p className="persona-tagline">{activePersona.tagline}</p>
            </div>
            <span className="persona-toast-stamp" title="Auspicious Chinese gift card phrase">
              {activePersona.toastZh}
            </span>
          </div>

          <div className="persona-grid">
            {activePersona.picks.map((pick, idx) => {
              const sku = skuById(pick.skuId);
              if (!sku) return null;
              const brand = brandById(sku.brandId);
              const aroma = skuAroma(sku) ?? (brand ? aromaById(brand.aroma) : undefined);
              const note = fieldNoteFor(sku, aroma?.id);
              const inBagQty = bagQtyOf(sku.id);
              const priceText = sku.chinaPrice ?? `~¥${note.estYuan}`;

              return (
                <article
                  key={pick.skuId}
                  className={idx === 0 ? "gift-spotlight is-hero" : "gift-spotlight"}
                >
                  <Link href={`/sku/${sku.id}`} className="spotlight-photo">
                    {sku.image ? (
                      <img src={sku.image} alt={`${sku.nameEn} (${sku.nameZh})`} />
                    ) : null}
                    <span className={idx === 0 ? "spotlight-badge is-red" : "spotlight-badge"}>
                      {pick.roleLabel} · {pick.roleZh}
                    </span>
                    <TastedStamp id={sku.id} />
                  </Link>

                  <div className="spotlight-body">
                    <div className="spotlight-top">
                      <Link href={`/sku/${sku.id}`} className="spotlight-title">
                        {sku.nameEn}
                      </Link>
                      <span className="spotlight-price">{priceText}</span>
                    </div>
                    <div className="spotlight-zh">
                      {sku.nameZh}
                      {brand ? ` · ${brand.provinceEn}` : ""}
                      {aroma ? ` · ${aroma.zh}` : ""}
                    </div>
                    <p className="spotlight-pitch">{pick.pitch}</p>
                    <p className="spotlight-signal">“{note.tableSignal}”</p>

                    <div className="spotlight-foot">
                      <span className="spotlight-gb">
                        {note.gbCode} · {GB_KIND_META[note.gbKind].zh}
                      </span>
                      <div className="spotlight-btns">
                        <button
                          type="button"
                          className={inBagQty > 0 ? "mini-bag-btn is-in" : "mini-bag-btn"}
                          onClick={() => addOrToggleBag(sku.id, pick.defaultQty)}
                        >
                          {inBagQty > 0
                            ? `✓ In Bag (×${inBagQty})`
                            : pick.defaultQty === 2
                              ? "+ Pair (×2)"
                              : "+ Gift Bag"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="persona-etiquette">
            <div className="etiquette-cell">
              <span className="etiquette-kicker">Wrap &amp; Handoff Tip · 送礼细节</span>
              <p>{activePersona.wrapTip}</p>
            </div>
            <div className="etiquette-cell is-say">
              <div className="etiquette-say-head">
                <span className="etiquette-kicker">What to Say at the Door · 递酒台词</span>
                <button
                  type="button"
                  className="copy-micro"
                  onClick={() =>
                    copyText(
                      `say-${activePersona.id}`,
                      `${activePersona.toastZh}\n${activePersona.sayThis}`,
                    )
                  }
                >
                  {copiedKey === `say-${activePersona.id}` ? "Copied ✓" : "Copy line"}
                </button>
              </div>
              <p className="say-quote">{activePersona.sayThis}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Browse by Budget Shelf */}
      <section id="by-budget" className="gift-section">
        <div className="gift-section-head">
          <div>
            <p className="kicker">02 · The Four Price Shelves · 按预算挑礼</p>
            <h2 className="gift-h2">
              Shop by Table Budget <span className="zh-inline">按档位选酒</span>
            </h2>
          </div>
          <span className="count-inline">
            Showing {totalShownCount} of {allPicks.length} curated gift &amp; banquet bottles
          </span>
        </div>

        <div className="gift-filter-bar">
          <div className="gift-filter-group" role="group" aria-label="Filter by budget">
            <button
              type="button"
              className="pill"
              aria-pressed={activeBandId === "all"}
              onClick={() => setActiveBandId("all")}
            >
              All Budgets
            </button>
            {banquetBands.map((band) => (
              <button
                key={band.id}
                type="button"
                className="pill"
                aria-pressed={activeBandId === band.id}
                onClick={() => setActiveBandId(band.id)}
              >
                {band.range}
              </button>
            ))}
          </div>

          <div className="gift-filter-group" role="group" aria-label="Filter by style">
            {VIBE_FILTERS.map((vibe) => (
              <button
                key={vibe.id}
                type="button"
                className="sort"
                aria-pressed={activeVibe === vibe.id}
                onClick={() => setActiveVibe(vibe.id)}
              >
                {vibe.label}
                {vibe.zh ? <span className="zh-chip"> {vibe.zh}</span> : null}
              </button>
            ))}
          </div>
        </div>

        {visibleBands.length === 0 ? (
          <div className="empty">
            No bottles match that exact budget + style filter.{" "}
            <button
              type="button"
              className="btn"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setActiveBandId("all");
                setActiveVibe("all");
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="gift-shelves">
            {visibleBands.map((band) => (
              <section key={band.id} className="gift-shelf">
                <div className="gift-shelf-rail">
                  <div className="shelf-badge">{band.badge}</div>
                  <div className="tasting-year">{band.range}</div>
                  <h3 className="prov-title">{band.titleEn}</h3>
                  <div className="prov-zh">{band.titleZh}</div>
                  <p className="banquet-occ">{band.occasion}</p>
                  <div className="prov-count">
                    {band.picks.length} {band.picks.length === 1 ? "pick" : "picks"}
                  </div>
                </div>

                <div className="gift-card-grid">
                  {band.picks.map((pick) => {
                    const sku = skuById(pick.skuId);
                    if (!sku) return null;
                    const brand = brandById(sku.brandId);
                    const aroma = skuAroma(sku) ?? (brand ? aromaById(brand.aroma) : undefined);
                    const note = fieldNoteFor(sku, aroma?.id);
                    const inBagQty = bagQtyOf(sku.id);
                    const priceText = sku.chinaPrice ?? `~¥${note.estYuan}`;

                    return (
                      <article
                        key={pick.skuId}
                        className={inBagQty > 0 ? "gift-card is-selected" : "gift-card"}
                      >
                        <div className="gift-card-main">
                          {sku.image ? (
                            <Link href={`/sku/${sku.id}`} className="gift-thumb">
                              <img src={sku.image} alt={`${sku.nameEn} (${sku.nameZh})`} />
                              <TastedStamp id={sku.id} />
                            </Link>
                          ) : null}

                          <div className="gift-card-info">
                            <div className="gift-card-eyebrow">
                              <span className="gift-archetype">{pick.archetype}</span>
                              {aroma ? <span className="house-aroma">{aroma.zh}</span> : null}
                            </div>

                            <Link href={`/sku/${sku.id}`} className="gift-card-title">
                              <span className="gift-en">{sku.nameEn}</span>
                              <span className="gift-zh">{sku.nameZh}</span>
                            </Link>

                            <p className="gift-card-note">{pick.note}</p>

                            <div className="gift-card-tags">
                              <span className="box-pill">
                                <i
                                  className="box-dot"
                                  style={{ background: BOX_SWATCH[pick.boxColor] }}
                                  aria-hidden="true"
                                />
                                {pick.boxLabel}
                              </span>
                              <span className="bestfor-pill">{pick.bestFor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="gift-card-foot">
                          <span className="gift-card-specs">
                            <strong>{priceText}</strong> · {sku.abv} · {sku.volume}
                          </span>
                          <button
                            type="button"
                            className={inBagQty > 0 ? "mini-bag-btn is-in" : "mini-bag-btn"}
                            onClick={() => addOrToggleBag(sku.id, 2)}
                          >
                            {inBagQty > 0 ? `✓ In Bag (×${inBagQty})` : "+ Gift Bag"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: Unwritten Gifting Playbook + Traps to Dodge */}
      <section id="playbook" className="gift-section">
        <div className="gift-section-head">
          <div>
            <p className="kicker">03 · The Unwritten Playbook · 送礼潜规则</p>
            <h2 className="gift-h2">
              Six Rules That Save Your Face <span className="zh-inline">行规六条</span>
            </h2>
          </div>
        </div>

        <div className="playbook-grid">
          {banquetRules.map((rule) => (
            <article key={rule.titleEn} className="playbook-card">
              <div className="playbook-top">
                <span className="playbook-num">{rule.num}</span>
                <span className="zh-inline-sm">{rule.titleZh}</span>
              </div>
              <h3>{rule.titleEn}</h3>
              <p>{rule.body}</p>
            </article>
          ))}
        </div>

        <div className="traps-wrap">
          <div className="traps-head">
            <span className="signal-kicker">Avoid the Endcap · 避坑对照</span>
            <h3>Three Classic Gifting Traps — and What to Bring Instead</h3>
          </div>
          <div className="traps-grid">
            {giftTraps.map((trap) => {
              const instead = skuById(trap.buyInsteadId);
              if (!instead) return null;
              const note = fieldNoteFor(instead, skuAroma(instead)?.id);
              return (
                <div key={trap.skip} className="trap-card">
                  <div className="trap-skip">
                    <span className="trap-label is-no">SKIP · 避雷</span>
                    <strong>{trap.skip}</strong>
                    <p>{trap.why}</p>
                  </div>
                  <Link href={`/sku/${instead.id}`} className="trap-swap">
                    {instead.image ? <img src={instead.image} alt={instead.nameEn} /> : null}
                    <div>
                      <span className="trap-label is-yes">BRING INSTEAD · 正选</span>
                      <strong>
                        {instead.nameEn} <span className="zh-inline-sm">{instead.nameZh}</span>
                      </strong>
                      <p>
                        {instead.chinaPrice ?? `~¥${note.estYuan}`} — {trap.buyReason}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="gift-table-bridge">
          <div>
            <span className="signal-kicker">Going to a specific province? · 地域席间指南</span>
            <h3>Need exact province seating &amp; toasting rules?</h3>
            <p>
              Use our interactive <strong>What Bottle Do I Bring?</strong> desk to match Beijing, Guizhou, Sichuan,
              Jiangsu, Anhui, Guangdong, or Shandong tables — complete with downloadable PNG prescription cards.
            </p>
          </div>
          <Link href="/table" className="btn solid">
            Open Table Advisor →
          </Link>
        </div>
      </section>

      {/* Floating Gift Bag & Banquet Calculator Dock */}
      <div className="giftbag-dock" aria-live="polite">
        {bagOpen ? (
          <div className="giftbag-panel" role="dialog" aria-label="Gift Bag and Banquet Calculator">
            <div className="giftbag-panel-head">
              <div>
                <span className="signal-kicker">礼单 · Gift Bag &amp; Table Math</span>
                <strong>
                  {bagDetailed.length === 0
                    ? "Your gift bag is empty"
                    : `${totalGiftBottles} bottle${totalGiftBottles === 1 ? "" : "s"} · ~${formatYuan(totalGiftYuan)}`}
                </strong>
              </div>
              <button
                type="button"
                className="giftbag-close"
                aria-label="Close gift bag"
                onClick={() => setBagOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="giftbag-modes" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={bagMode === "gift"}
                className={bagMode === "gift" ? "bag-mode is-on" : "bag-mode"}
                onClick={() => setBagMode("gift")}
              >
                Host Gifting · 送礼成双
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={bagMode === "banquet"}
                className={bagMode === "banquet" ? "bag-mode is-on" : "bag-mode"}
                onClick={() => setBagMode("banquet")}
              >
                Banquet Tables · 宴席算酒
              </button>
            </div>

            {bagDetailed.length === 0 ? (
              <p className="giftbag-empty">
                Tap <strong>+ Gift Bag</strong> or <strong>+ Pair (×2)</strong> on any bottle above to build a
                WeChat-ready shopping list or estimate cases for a multi-table banquet.
              </p>
            ) : bagMode === "gift" ? (
              <>
                <ul className="giftbag-list">
                  {bagDetailed.map((item) => (
                    <li key={item.skuId} className="giftbag-row">
                      {item.sku.image ? (
                        <img src={item.sku.image} alt={item.sku.nameEn} className="giftbag-thumb" />
                      ) : null}
                      <div className="giftbag-item-info">
                        <Link href={`/sku/${item.sku.id}`}>
                          {item.sku.nameEn} <span>{item.sku.nameZh}</span>
                        </Link>
                        <small>
                          {item.priceLabel}/ea · {formatYuan(item.unitPrice * item.qty)}
                        </small>
                      </div>
                      <div className="giftbag-qty">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.sku.nameEn}`}
                          onClick={() => setItemQty(item.skuId, item.qty - 1)}
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.sku.nameEn}`}
                          onClick={() => setItemQty(item.skuId, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className={totalGiftBottles % 2 === 0 ? "pair-note is-good" : "pair-note"}>
                  {totalGiftBottles % 2 === 0
                    ? "✓ Even bottle count — auspicious pair etiquette (好事成双)."
                    : "Tip: Chinese gifting favors pairs (×2) for elders, weddings, and holidays."}
                </div>
              </>
            ) : (
              <div className="banquet-calc">
                <div className="calc-row">
                  <label htmlFor="table-count">Number of banquet tables (桌数)</label>
                  <div className="giftbag-qty">
                    <button type="button" onClick={() => setTables((t) => Math.max(1, t - 1))}>
                      −
                    </button>
                    <span id="table-count">{tables}</span>
                    <button type="button" onClick={() => setTables((t) => Math.min(50, t + 1))}>
                      +
                    </button>
                  </div>
                </div>
                {banquetPrimaryItem ? (
                  <div className="calc-summary">
                    <div className="calc-bottle">
                      Using: <strong>{banquetPrimaryItem.sku.nameEn}</strong> ({banquetPrimaryItem.sku.nameZh})
                    </div>
                    <div className="calc-metrics">
                      <div>
                        <span>Bottles (2/table)</span>
                        <b>{banquetBottlesNeeded}</b>
                      </div>
                      <div>
                        <span>Cases (6/box)</span>
                        <b>{banquetCasesNeeded}</b>
                      </div>
                      <div>
                        <span>Est. Budget</span>
                        <b>~{formatYuan(banquetTotalYuan)}</b>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {showGiftNote ? (
              <div className="red-gift-tag">
                <div className="red-tag-chop">礼</div>
                <div className="red-tag-zh">{activePersona.toastZh}</div>
                <p className="red-tag-en">{activePersona.sayThis}</p>
                <button type="button" className="copy-micro" onClick={handleCopyGiftNote}>
                  {copiedKey === "gift-note" ? "Copied Gift Note ✓" : "Copy Gift Note"}
                </button>
              </div>
            ) : null}

            <div className="giftbag-actions">
              <button
                type="button"
                className="btn solid"
                disabled={bagDetailed.length === 0}
                onClick={handleCopyShoppingList}
              >
                {copiedKey === "bag-list" ? "Copied List ✓" : "Copy Shopping List"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setShowGiftNote((open) => !open)}
              >
                {showGiftNote ? "Hide Gift Tag" : "Red Gift Tag · 礼帖"}
              </button>
              {bagDetailed.length > 0 ? (
                <button type="button" className="giftbag-clear" onClick={clearBag}>
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          className={totalGiftBottles > 0 ? "giftbag-fab has-items" : "giftbag-fab"}
          onClick={() => setBagOpen((open) => !open)}
        >
          <span className="fab-chop" aria-hidden="true">
            礼
          </span>
          <span>
            {totalGiftBottles > 0
              ? `Gift Bag · ${totalGiftBottles} (${formatYuan(totalGiftYuan)})`
              : "Gift Bag & Table Calc"}
          </span>
        </button>
      </div>
    </>
  );
}
