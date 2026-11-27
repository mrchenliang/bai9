"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { aromaById, brandById, skuAroma, skuById } from "@/catalog";
import { TastedStamp } from "@/components/shell";
import { fieldNoteFor, GB_KIND_META } from "@/field-notes";
import { banquetBands, giftPersonas, giftTraps, type GiftPersona } from "@/banquets";
import { REGIONS, type RegionId } from "@/provinces";

const STREET_SKEWERS_MOMENT: GiftPersona = {
  id: "skewers",
  label: "2am Street Skewers",
  zh: "宵夜撸串",
  tagline: "Plastic stools, charcoal lamb, and zero patience for ¥800 gift boxes.",
  wrapTip:
    "Skip the tote bag entirely — grab a naked glass bottle from the corner store and pour neat into tiny paper or glass cups.",
  sayThis: "“Skip the fancy box tonight — pure-grain glass bottle and extra cumin.”",
  toastZh: "深夜小酌，不醉不归",
  picks: [
    {
      skuId: "huanggai",
      roleLabel: "Cult Hero",
      roleZh: "口粮之神",
      pitch: "Yellow-Cap Fenjiu at ¥52 — pure-grain 53% light aroma that earns instant respect from every seasoned drinker.",
      defaultQty: 1,
    },
    {
      skuId: "hongxing-56",
      roleLabel: "Beijing Original",
      roleZh: "京味正统",
      pitch: "1949 green-bottle Erguotou. 100% solid-state pure grain with crisp northern fire built for greasy late-night skewers.",
      defaultQty: 1,
    },
    {
      skuId: "erqu",
      roleLabel: "Sichuan Workhorse",
      roleZh: "川酒口粮",
      pitch: "Luzhou Laojiao’s honest everyday strong aroma — sweet cellar grain under ¥30 with zero packaging markup.",
      defaultQty: 1,
    },
  ],
};

// Curated 6-moment discovery lineup (unified from /table + /banquets)
const GUIDE_MOMENTS: GiftPersona[] = [
  giftPersonas[0], // Future Father-in-Law
  giftPersonas[3], // Boss, Mentor & Head Table
  giftPersonas[1], // Wedding & Graduation
  giftPersonas[2], // "Bring Nothing" Uncle
  STREET_SKEWERS_MOMENT, // 2am Street Skewers
  giftPersonas[5], // Curious First-Timer
];

const REGION_SAFE_BETS: Record<RegionId, string[]> = {
  southwest: ["feitian", "puwu", "guojiao"],
  central: ["jiugui-sack", "baiyunbian-cellar", "huanghelou-tezhi"],
  east: ["mengzhilan-m6", "gu20", "jingzhi-yipin"],
  north: ["qinghua-20", "huanggai", "hongxing-56"],
  northwest: ["hongxifeng", "xifeng-green", "yili-tequ"],
  northeast: ["laobaigan-67", "qinghua-20", "huanggai"],
  south: ["yukbing-classic", "sanhua-52", "qinghua-20"],
};

export function TableAdvisor() {
  const [activeMomentId, setActiveMomentId] = useState<string>(GUIDE_MOMENTS[0].id);
  const [activeRegionId, setActiveRegionId] = useState<RegionId>("southwest");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const randomPool = useMemo(() => banquetBands.flatMap((band) => band.picks), []);
  const [spinIndex, setSpinIndex] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const activeMoment = useMemo(
    () => GUIDE_MOMENTS.find((m) => m.id === activeMomentId) ?? GUIDE_MOMENTS[0],
    [activeMomentId],
  );

  const activeRegion = useMemo(
    () => REGIONS.find((r) => r.id === activeRegionId) ?? REGIONS[0],
    [activeRegionId],
  );

  const currentPick = randomPool[spinIndex % randomPool.length];
  const currentSku = currentPick ? skuById(currentPick.skuId) : undefined;
  const currentBrand = currentSku ? brandById(currentSku.brandId) : undefined;
  const currentAroma = currentSku ? skuAroma(currentSku) : undefined;
  const currentNote = currentSku ? fieldNoteFor(currentSku, currentAroma?.id) : undefined;

  function handleSpin() {
    if (randomPool.length <= 1) return;
    setIsSpinning(true);
    let next = Math.floor(Math.random() * randomPool.length);
    if (next === spinIndex) next = (spinIndex + 1) % randomPool.length;
    window.setTimeout(() => {
      setSpinIndex(next);
      setIsSpinning(false);
    }, 150);
  }

  async function copyText(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 1800);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <>
      {/* 1. Editorial Hero + Bottle Randomizer */}
      <section className="u-guide-hero">
        <div className="u-guide-hero-copy">
          <p className="kicker">Curatorial Guide · 选酒指南</p>
          <h1>
            The Baijiu Guide <span className="zh-inline">选酒指南</span>
          </h1>
          <p className="sub">
            One concise guide to choosing, gifting, and pouring Chinese baijiu — pick a moment below, spin for an
            instant bottle discovery, or dodge the three classic traps.
          </p>
          <div className="u-guide-jumps">
            <a href="#moments">By moment</a>
            <span aria-hidden="true">·</span>
            <a href="#regions">Regional rules</a>
            <span aria-hidden="true">·</span>
            <a href="#traps">3 traps to dodge</a>
            <span aria-hidden="true">·</span>
            <Link href="/price-bands">Price bands →</Link>
          </div>
        </div>

        {/* Always-Ready Bottle Randomizer */}
        {currentPick && currentSku && currentNote ? (
          <aside
            className={isSpinning ? "u-roulette is-spinning" : "u-roulette"}
            aria-label="Bottle discovery randomizer"
          >
            <div className="u-roulette-head">
              <span className="signal-kicker">Discover a Bottle · 盲选一瓶</span>
              <button type="button" className="u-roulette-spin" onClick={handleSpin}>
                Spin another ↻
              </button>
            </div>

            <div className="u-roulette-main">
              <Link href={`/sku/${currentSku.id}`} className="u-roulette-photo">
                {currentSku.image ? (
                  <img
                    src={currentSku.image}
                    alt={`${currentSku.nameEn} (${currentSku.nameZh})`}
                    style={
                      currentSku.imagePosition
                        ? { objectPosition: currentSku.imagePosition }
                        : undefined
                    }
                  />
                ) : null}
              </Link>
              <div className="u-roulette-info">
                <span className="u-roulette-arch">
                  {currentPick.archetype} · {currentPick.bestFor}
                </span>
                <Link href={`/sku/${currentSku.id}`} className="u-roulette-name">
                  {currentSku.nameEn} <span className="zh-inline-sm">{currentSku.nameZh}</span>
                </Link>
                <div className="u-roulette-specs">
                  <strong>{currentSku.chinaPrice ?? `~¥${currentNote.estYuan}`}</strong> · {currentSku.abv}
                  {currentBrand ? ` · ${currentBrand.provinceEn}` : ""}
                  {currentAroma ? ` · ${currentAroma.en.replace(" aroma", "")}` : ""}
                </div>
                <p className="u-roulette-palate">{currentNote.flavorTruth}</p>
              </div>
            </div>

            <div className="u-roulette-foot">
              <p className="u-roulette-say">
                <span>At the door:</span> “{currentPick.handoffLine}”
              </p>
              <Link href={`/sku/${currentSku.id}`} className="u-roulette-link">
                Dossier →
              </Link>
            </div>
          </aside>
        ) : null}
      </section>

      {/* 2. Browse by Moment (6 tabs, zero sub-filters) */}
      <section id="moments" className="u-guide-section">
        <div className="u-section-head">
          <div>
            <p className="kicker">01 · By Moment · 按场景选酒</p>
            <h2 className="u-h2">
              Who are you pouring for? <span className="zh-inline">什么局</span>
            </h2>
          </div>
          <span className="u-hint">Three curated bottles for every table</span>
        </div>

        <div className="u-moment-tabs" role="tablist" aria-label="Table and gifting moments">
          {GUIDE_MOMENTS.map((moment) => {
            const isSelected = moment.id === activeMoment.id;
            return (
              <button
                key={moment.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? "u-moment-tab is-on" : "u-moment-tab"}
                onClick={() => setActiveMomentId(moment.id)}
              >
                <b>{moment.label}</b>
                <span>{moment.zh}</span>
              </button>
            );
          })}
        </div>

        <div className="u-moment-stage" role="tabpanel">
          <div className="u-moment-stage-head">
            <div>
              <h3>
                {activeMoment.label} <span className="zh-inline">{activeMoment.zh}</span>
              </h3>
              <p className="u-moment-tagline">{activeMoment.tagline}</p>
            </div>
            <span className="persona-toast-stamp" title="Traditional table phrase">
              {activeMoment.toastZh}
            </span>
          </div>

          <div className="u-trio">
            {activeMoment.picks.map((pick, idx) => {
              const sku = skuById(pick.skuId);
              if (!sku) return null;
              const brand = brandById(sku.brandId);
              const aroma = skuAroma(sku) ?? (brand ? aromaById(brand.aroma) : undefined);
              const note = fieldNoteFor(sku, aroma?.id);
              const priceText = sku.chinaPrice ?? `~¥${note.estYuan.toLocaleString("en-US")}`;

              return (
                <Link
                  key={pick.skuId}
                  href={`/sku/${sku.id}`}
                  className={idx === 0 ? "u-bottle-card is-hero" : "u-bottle-card"}
                >
                  <div className="u-bottle-photo">
                    {sku.image ? (
                      <img
                        src={sku.image}
                        alt={`${sku.nameEn} (${sku.nameZh})`}
                        style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
                      />
                    ) : null}
                    <span className={idx === 0 ? "spotlight-badge is-red" : "spotlight-badge"}>
                      {pick.roleLabel} · {pick.roleZh}
                    </span>
                    <TastedStamp id={sku.id} />
                  </div>

                  <div className="u-bottle-body">
                    <div className="u-bottle-top">
                      <span className="u-bottle-title">{sku.nameEn}</span>
                      <span className="u-bottle-price">{priceText}</span>
                    </div>
                    <div className="u-bottle-sub">
                      {sku.nameZh}
                      {brand ? ` · ${brand.provinceEn}` : ""}
                      {aroma ? ` · ${aroma.en.replace(" aroma", "")}` : ""}
                    </div>
                    <p className="u-bottle-pitch">{pick.pitch}</p>
                    <p className="u-bottle-palate">
                      <span>Palate:</span> {note.flavorTruth}
                    </p>
                    <div className="u-bottle-foot">
                      <span>
                        {note.gbCode} · {GB_KIND_META[note.gbKind].zh}
                      </span>
                      <span className="u-bottle-arrow">Dossier →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="u-etiquette-row">
            <div className="u-etiquette-col">
              <span className="guide-eyebrow">Handoff &amp; Pouring · 递酒细节</span>
              <p>{activeMoment.wrapTip}</p>
            </div>
            <div className="u-etiquette-col is-say">
              <div className="u-say-head">
                <span className="guide-eyebrow">What to Say at the Door · 递酒台词</span>
                <button
                  type="button"
                  className="copy-micro"
                  onClick={() =>
                    copyText(
                      `say-${activeMoment.id}`,
                      `${activeMoment.toastZh}\n${activeMoment.sayThis}`,
                    )
                  }
                >
                  {copiedKey === `say-${activeMoment.id}` ? "Copied ✓" : "Copy line"}
                </button>
              </div>
              <p className="u-say-quote">{activeMoment.sayThis}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lightweight Regional Etiquette Strip (7 canonical regions) */}
      <section id="regions" className="u-guide-section">
        <div className="u-section-head">
          <div>
            <p className="kicker">02 · Regional Table Rules · 各地酒桌潜规则</p>
            <h2 className="u-h2">
              Dining in a specific region? <span className="zh-inline">地域礼数</span>
            </h2>
          </div>
          <Link className="u-hint-link" href="/map">
            Explore the China Baijiu Map →
          </Link>
        </div>

        <div className="u-region-strip" role="tablist" aria-label="Chinese drinking regions">
          {REGIONS.map((reg) => {
            const isSelected = reg.id === activeRegion.id;
            return (
              <button
                key={reg.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className="pill"
                aria-pressed={isSelected}
                onClick={() => setActiveRegionId(reg.id)}
              >
                {reg.en} <span className="zh-chip">{reg.zh}</span>
              </button>
            );
          })}
        </div>

        <div className="u-region-panel" role="tabpanel">
          <div className="u-region-card">
            <div className="u-region-rule">
              <span className="warn-kicker">
                {activeRegion.en} · {activeRegion.zh} ({activeRegion.provincesSummary})
              </span>
              <p>{activeRegion.tableRule}</p>
            </div>
          </div>

          <div className="u-region-bottles">
            <span className="guide-eyebrow">Local Safe Bets · 当地稳选</span>
            <div className="u-trio">
              {REGION_SAFE_BETS[activeRegion.id].map((id, idx) => {
                const sku = skuById(id);
                if (!sku) return null;
                const brand = brandById(sku.brandId);
                const aroma = skuAroma(sku) ?? (brand ? aromaById(brand.aroma) : undefined);
                const note = fieldNoteFor(sku, aroma?.id);
                const priceText = sku.chinaPrice ?? `~¥${note.estYuan.toLocaleString("en-US")}`;

                return (
                  <Link
                    key={id}
                    href={`/sku/${sku.id}`}
                    className={idx === 0 ? "u-bottle-card is-hero" : "u-bottle-card"}
                  >
                    <div className="u-bottle-photo">
                      {sku.image ? (
                        <img
                          src={sku.image}
                          alt={`${sku.nameEn} (${sku.nameZh})`}
                          style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
                        />
                      ) : null}
                      {brand ? (
                        <span className={idx === 0 ? "spotlight-badge is-red" : "spotlight-badge"}>
                          {brand.provinceEn} · {brand.provinceZh}
                        </span>
                      ) : null}
                      <TastedStamp id={sku.id} />
                    </div>

                    <div className="u-bottle-body">
                      <div className="u-bottle-top">
                        <span className="u-bottle-title">{sku.nameEn}</span>
                        <span className="u-bottle-price">{priceText}</span>
                      </div>
                      <div className="u-bottle-sub">
                        {sku.nameZh}
                        {brand ? ` · ${brand.provinceEn}` : ""}
                        {aroma ? ` · ${aroma.en.replace(" aroma", "")}` : ""}
                      </div>
                      <p className="u-bottle-pitch">{note.tableSignal}</p>
                      <p className="u-bottle-palate">
                        <span>Palate:</span> {note.flavorTruth}
                      </p>
                      <div className="u-bottle-foot">
                        <span>
                          {note.gbCode} · {GB_KIND_META[note.gbKind].zh}
                        </span>
                        <span className="u-bottle-arrow">Dossier →</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Three Classic Traps to Dodge */}
      <section id="traps" className="u-guide-section">
        <div className="u-section-head">
          <div>
            <p className="kicker">03 · Avoid the Endcap · 避坑对照</p>
            <h2 className="u-h2">
              Three Classic Traps — and What to Bring Instead <span className="zh-inline">避雷</span>
            </h2>
          </div>
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
                      {instead.chinaPrice ?? `~¥${note.estYuan.toLocaleString("en-US")}`} — {trap.buyReason}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
