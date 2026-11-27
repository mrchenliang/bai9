"use client";

import Link from "next/link";
import { useState } from "react";

type TabId = "overview" | "jue" | "still" | "jar" | "cup";

interface HistoryEra {
  id: Exclude<TabId, "overview">;
  numeral: string;
  era: string;
  pillEn: string;
  titleEn: string;
  titleZh: string;
  summary: string;
  icon: string;
  alt: string;
  artifact: string;
}

const HISTORY_ERAS: HistoryEra[] = [
  {
    id: "jue",
    numeral: "I",
    era: "c. 7000 BCE – Shang",
    pillEn: "Grain & Qu",
    titleEn: "Grain Wine & Qu",
    titleZh: "谷酿与曲",
    summary:
      "From Neolithic Jiahu pottery jars to Shang bronze ritual jue (爵) vessels, early Chinese brewers pioneered qu (曲) — grain starter bricks rich in wild yeasts and molds that still define baijiu’s solid-state fermentation today.",
    icon: "/images/history/bronze-jue.jpg",
    alt: "Ink illustration of an ancient Chinese Shang bronze tripod jue wine vessel beside sorghum stalks",
    artifact: "Bronze Jue & Sorghum · 商代青铜爵",
  },
  {
    id: "still",
    numeral: "II",
    era: "Song – Yuan · 10th–14th c.",
    pillEn: "Distillation",
    titleEn: "Birth of Distillation",
    titleZh: "蒸馏烧酒",
    summary:
      "Clay and bronze zeng (甑) steamer stills spread across northern and southwestern China, condensing fermented grain mash into clear, high-proof shaojiu (“burnt liquor”) — the direct ancestor of modern baijiu.",
    icon: "/images/history/zeng-still.jpg",
    alt: "Ink illustration of a traditional Chinese zeng earthenware distillation still with rising steam",
    artifact: "Earthenware Zeng Still · 传统甑锅",
  },
  {
    id: "jar",
    numeral: "III",
    era: "Ming – Qing · 14th–19th c.",
    pillEn: "Mud Pits & Jars",
    titleEn: "Mud Pits & Clay Jars",
    titleZh: "窖池与陶坛",
    summary:
      "Living earthen mud pits (窖池) and breathable terracotta aging jars (陶坛) matured across Sichuan, Guizhou, and Shanxi — birthing China’s regional aroma families and centuries-old distilleries still active today.",
    icon: "/images/history/terracotta-jar.jpg",
    alt: "Ink illustration of a red-cloth-sealed Chinese earthenware baijiu aging jar beside wheat",
    artifact: "Sealed Clay Jar · 封坛陶瓮",
  },
  {
    id: "cup",
    numeral: "IV",
    era: "1952 – Present",
    pillEn: "National Liquors",
    titleEn: "National Liquors",
    titleZh: "名酒与国宴",
    summary:
      "Five state-run tastings (1952–1989) codified China’s twelve official aroma standards and crowned the Famous Liquors (名酒), cementing baijiu as the centerpiece of state banquets, business tables, and everyday toasts.",
    icon: "/images/history/banquet-cup.jpg",
    alt: "Ink illustration of a Chinese porcelain baijiu pouring flagon with two small tasting cups",
    artifact: "Flagon & Tasting Cups · 分酒器与酒杯",
  },
];

export function BaijiuOrigins({ showHeading = true }: { showHeading?: boolean }) {
  const [activeId, setActiveId] = useState<TabId>("overview");
  const activeEra = activeId === "overview" ? null : HISTORY_ERAS.find((item) => item.id === activeId) ?? null;

  return (
    <section id="about-baijiu" className="origins-section" aria-labelledby="origins-heading">
      <div className="u-section-head origins-head">
        <div>
          <h2 id="origins-heading" className="u-h2">
            {showHeading ? "What is baijiu & where it came from?" : "A brief history of baijiu"}{" "}
            <span className="zh-inline">白酒溯源</span>
          </h2>
        </div>
        <div className="origins-head-links">
          <Link className="u-hint-link" href="/aromas">
            Twelve Aromas →
          </Link>
          <span className="origins-sep" aria-hidden="true">
            ·
          </span>
          <Link className="u-hint-link" href="/maps">
            Explore the China Baijiu Map →
          </Link>
        </div>
      </div>

      <div className="u-region-strip" role="tablist" aria-label="Baijiu origins and historical eras">
        <button
          type="button"
          role="tab"
          aria-selected={activeId === "overview"}
          aria-pressed={activeId === "overview"}
          className="pill"
          onClick={() => setActiveId("overview")}
        >
          Overview <span className="zh-chip">白酒简介</span>
        </button>
        {HISTORY_ERAS.map((item) => {
          const isSelected = activeId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-pressed={isSelected}
              className="pill"
              onClick={() => setActiveId(item.id)}
            >
              {item.numeral} · {item.pillEn} <span className="zh-chip">{item.titleZh}</span>
            </button>
          );
        })}
      </div>

      <div className="origins-card" role="tabpanel">
        {activeEra ? (
          <div className="origins-era-layout">
            <div className="origins-rule">
              <span className="warn-kicker">
                Era {activeEra.numeral} · {activeEra.titleZh} ({activeEra.era})
              </span>
              <p>{activeEra.summary}</p>
            </div>
            <div className="origins-era-aside">
              <figure className="origins-feature-plate">
                <img src={activeEra.icon} alt={activeEra.alt} width={600} height={480} />
                <figcaption>{activeEra.artifact}</figcaption>
              </figure>
              <div className="origins-mini-rail" aria-label="Jump to historical era">
                {HISTORY_ERAS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={item.id === activeEra.id ? "origins-mini-btn is-active" : "origins-mini-btn"}
                    onClick={() => setActiveId(item.id)}
                    title={`${item.numeral} · ${item.titleEn} (${item.era})`}
                    aria-label={`${item.titleEn} (${item.era})`}
                  >
                    <img src={item.icon} alt="" width={120} height={96} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="origins-overview-layout">
            <div className="origins-rule">
              <span className="warn-kicker">
                Baijiu · 白酒 (40%–60% ABV · Solid-State Grain Spirit)
              </span>
              <p>
                Literally “white liquor,” baijiu is China’s clear distilled spirit — solid-state fermented from
                sorghum, wheat, rice, or corn with wild grain starter bricks (<em>qu</em>, 曲), steam-distilled, and
                rested in clay jars. Outselling vodka and whisky combined, it is the world’s most-consumed spirit and
                the centerpiece of Chinese hospitality.
              </p>
            </div>
            <div className="origins-milestones">
              <span className="origins-eyebrow">Four Eras of Baijiu</span>
              <div className="origins-chips">
                {HISTORY_ERAS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="origins-chip"
                    onClick={() => setActiveId(item.id)}
                  >
                    <img src={item.icon} alt={item.alt} width={120} height={96} loading="lazy" />
                    <span>
                      <strong>
                        {item.numeral} · {item.pillEn}
                      </strong>
                      <small>
                        {item.titleZh} · {item.era.split(" · ")[0]}
                      </small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
