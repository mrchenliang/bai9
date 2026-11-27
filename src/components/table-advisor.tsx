"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { brandById, skuAroma, skuById, tierById } from "@/catalog";
import { tierNumeral } from "@/components/card";
import { fieldNoteFor, GB_KIND_META, SHOCK_LABELS } from "@/field-notes";
import { downloadTablePrescriptionCard } from "@/lib/export-cards";
import { REGIONS, type RegionId } from "@/provinces";

type OccasionId = "father" | "business" | "wedding" | "skewers" | "uncle" | "foreigner";
type BudgetId = "street" | "mid" | "serious" | "nuclear";

const OCCASIONS: { id: OccasionId; label: string; zh: string }[] = [
  { id: "father", label: "Meeting partner's father", zh: "第一次见岳父" },
  { id: "business", label: "Closing a client dinner", zh: "商务宴请谈单" },
  { id: "wedding", label: "Wedding banquet", zh: "婚宴摆席" },
  { id: "skewers", label: "2am street skewers", zh: "宵夜撸串" },
  { id: "uncle", label: "Uncle who says 'bring nothing'", zh: "嘴上说别带东西" },
  { id: "foreigner", label: "First baijiu for foreign friends", zh: "带老外入坑" },
];

const BUDGETS: { id: BudgetId; label: string; short: string; range: string }[] = [
  { id: "street", label: "Honest Street", short: "<¥100", range: "Under ¥100" },
  { id: "mid", label: "Respectable", short: "¥150–450", range: "¥150–¥450" },
  { id: "serious", label: "Serious Face", short: "¥500–1k", range: "¥500–¥1,000" },
  { id: "nuclear", label: "Apex Table", short: "¥1.5k+", range: "¥1,500+" },
];

const CURATED_MOMENTS: {
  title: string;
  zh: string;
  meta: string;
  occasion: OccasionId;
  region: RegionId;
  budget: BudgetId;
}[] = [
  {
    title: "Meet the Father-in-Law",
    zh: "初次见岳父",
    meta: "Southwest · ¥500–1k",
    occasion: "father",
    region: "southwest",
    budget: "serious",
  },
  {
    title: "East China Client Table",
    zh: "华东商务宴",
    meta: "East · ¥1.5k+",
    occasion: "business",
    region: "east",
    budget: "nuclear",
  },
  {
    title: "Wedding Lazy Susan",
    zh: "喜宴红桌",
    meta: "Southwest · ¥150–450",
    occasion: "wedding",
    region: "southwest",
    budget: "mid",
  },
  {
    title: "“Bring Nothing” Uncle",
    zh: "客气长辈",
    meta: "North · ¥150–450",
    occasion: "uncle",
    region: "north",
    budget: "mid",
  },
  {
    title: "2am Northern Skewers",
    zh: "胡同撸串",
    meta: "North · <¥100",
    occasion: "skewers",
    region: "north",
    budget: "street",
  },
];

interface Recommendation {
  primaryId: string;
  insiderId: string;
  whatGoesWrong: string;
}

function prescribe(occasion: OccasionId, region: RegionId, budget: BudgetId): Recommendation {
  if (occasion === "skewers") {
    if (region === "north" || region === "northeast") {
      return {
        primaryId: "huanggai",
        insiderId: "hongxing-56",
        whatGoesWrong:
          "Bringing a ¥800 gift box to a plastic-stool skewer stall looks completely unhinged. Everyone will worry you are about to ask them for a loan.",
      };
    }
    if (region === "south") {
      return {
        primaryId: "yukbing-classic",
        insiderId: "sanhua-52",
        whatGoesWrong:
          "Dropping heavy 53% sauce aroma onto midnight Cantonese claypot rice overwhelms every dish on the table.",
      };
    }
    if (region === "northwest") {
      return {
        primaryId: "xifeng-green",
        insiderId: "yili-tequ",
        whatGoesWrong:
          "Over-dressing a charcoal lamb-skewer night kills the vibe — crisp Green Xifeng or Xinjiang Yilite earns immediate respect.",
      };
    }
    return {
      primaryId: "huanggai",
      insiderId: "niulan-chen",
      whatGoesWrong:
        "Over-dressing a 2am skewer table kills the mood instantly. Pure-grain Yellow-Cap Fenjiu at ¥55 earns instant nods from real drinkers.",
    };
  }

  if (occasion === "foreigner") {
    if (budget === "street") {
      return {
        primaryId: "sanhua-52",
        insiderId: "huanggai",
        whatGoesWrong:
          "Handing a first-timer warm 56% Red Star or medicinal Dongjiu on sip one guarantees they tell every friend for the next decade that baijiu tastes like jet fuel.",
      };
    }
    return {
      primaryId: "ming-river",
      insiderId: "qinghua-20",
      whatGoesWrong:
        "Starting with intense aged sauce aroma without food or tiny cups shocks Western palates. Begin with crisp Qinghua 20 or bright pineapple-forward Ming River.",
    };
  }

  if (budget === "nuclear") {
    if (region === "east" && occasion === "business") {
      return {
        primaryId: "feitian",
        insiderId: "mengzhilan-m9",
        whatGoesWrong:
          "Only two things can go wrong at ¥1,700+: bringing a counterfeit bottle from an unverified shop, or forgetting that two bottles is the polite minimum for an elder.",
      };
    }
    return {
      primaryId: "feitian",
      insiderId: "jingpin",
      whatGoesWrong:
        "Bringing only a single bottle to a serious elder gift feels incomplete — Chinese gifting favors pairs ('chengshuang'). Also never open it before confirming the host isn't saving it.",
    };
  }

  if (budget === "street") {
    if (occasion === "father" || occasion === "business") {
      return {
        primaryId: "bofen",
        insiderId: "xifeng-green",
        whatGoesWrong:
          "Truthful warning: showing up under ¥100 to meet your future father-in-law or close a business deal only works if you frame it as a nostalgic tasting side-pour alongside a serious bottle.",
      };
    }
    if (region === "northwest") {
      return {
        primaryId: "xifeng-green",
        insiderId: "yili-tequ",
        whatGoesWrong:
          "Buying a flashy supermarket gold box under ¥100 usually means blended GB/T 20822 spirit — stick to honest Green Xifeng or Yilite.",
      };
    }
    return {
      primaryId: "huanggai",
      insiderId: "erqu",
      whatGoesWrong:
        "Grabbing a flashy no-name gold-foil bottle from a supermarket endcap for ¥69 is the worst trap — it is almost always GB/T 20822 blended spirit dressed like a king.",
    };
  }

  if (budget === "serious") {
    if (region === "east") {
      return {
        primaryId: "mengzhilan-m6",
        insiderId: "gu20",
        whatGoesWrong:
          "Bringing entry-level Sea Blue or an unfamiliar out-of-region bottle to a serious East China table quietly signals you did not take the meeting seriously.",
      };
    }
    if (region === "central") {
      return {
        primaryId: "neican",
        insiderId: "guojiao",
        whatGoesWrong:
          "Ignoring Central China's local heavyweights like Jiugui Neican for a generic billboard sub-brand misses instant regional prestige.",
      };
    }
    if (region === "northwest") {
      return {
        primaryId: "hongxifeng",
        insiderId: "qinghua-30",
        whatGoesWrong:
          "In Xi'an and the Northwest, skipping royal Red Xifeng for a generic ¥600 label leaves hometown prestige on the table.",
      };
    }
    if (region === "northeast") {
      return {
        primaryId: "puwu",
        insiderId: "qinghua-30",
        whatGoesWrong:
          "Bringing a weak low-proof bottle to a serious Northeast banquet gets polite nods and quiet jokes after you leave.",
      };
    }
    if (region === "south") {
      return {
        primaryId: "qinghua-30",
        insiderId: "junpin",
        whatGoesWrong:
          "Heavy, harsh fire clashes with delicate southern banquets — silky Qinghua 30 or polished celadon Junpin lands far better.",
      };
    }
    return {
      primaryId: occasion === "wedding" ? "puwu" : "guojiao",
      insiderId: "qinghua-30",
      whatGoesWrong:
        "Buying an obscure 'Moutai Town custom reserve' instead of a recognized Tier I/II flagship like 8th-Gen Wuliangye or National Cellar 1573 screams tourist markup.",
    };
  }

  // Budget === "mid" (¥150–¥450)
  if (occasion === "wedding") {
    return {
      primaryId: "crystal",
      insiderId: region === "central" ? "jiugui-hongtan" : "honghualang",
      whatGoesWrong:
        "Choosing a white/plain bottle over festive red or crystal packaging for a wedding table gets quietly judged by every auntie before the cold dishes arrive.",
    };
  }
  if (region === "east") {
    return {
      primaryId: "guoyuan",
      insiderId: "gu16",
      whatGoesWrong:
        "Bringing entry-level Sea Blue when East China tables expect Guoyuan Sikou or Gujing Gu 16 is a classic rookie mistake.",
    };
  }
  if (region === "central") {
    return {
      primaryId: "jiugui-hongtan",
      insiderId: "baiyunbian-cellar",
      whatGoesWrong:
        "Skipping Hunan's Jiugui or Hubei's Baiyunbian for a random generic label misses instant hometown warmth across Central China.",
    };
  }
  if (region === "northwest") {
    return {
      primaryId: "xifeng-6",
      insiderId: "yili-tequ",
      whatGoesWrong:
        "Bringing an unfamiliar coastal label to a Shaanxi or Xinjiang table when Xifeng 6-Year and Yilite are beloved local anchors.",
    };
  }
  if (region === "northeast") {
    return {
      primaryId: "qinghua-20",
      insiderId: "laobaigan-67",
      whatGoesWrong:
        "Paying ¥400 for fancy cardboard instead of clean high-proof pure grain is spotted immediately at a Northeast table.",
    };
  }
  if (region === "south") {
    return {
      primaryId: "qinghua-20",
      insiderId: "tianzhilan",
      whatGoesWrong:
        "Forcing harsh, aggressive liquor on a Cantonese or Guangxi dinner table ruins food pairing — clean porcelain Qinghua 20 wins everyone over.",
    };
  }
  if (occasion === "uncle") {
    return {
      primaryId: "qinghua-20",
      insiderId: "pinwei",
      whatGoesWrong:
        "Believing him when he says 'don't bring anything' is fatal. 'Bring nothing' translates literally to: bring a genuinely tasteful ¥350–¥450 pure-grain bottle.",
    };
  }
  return {
    primaryId: "crystal",
    insiderId: "xijiu-1988",
    whatGoesWrong:
      "Never buy a fancy-box “special commemorative” sub-brand at ¥300 — every seasoned drinker immediately googles the wholesale price and knows it costs ¥68.",
  };
}

export function TableAdvisor() {
  const [occasion, setOccasion] = useState<OccasionId>("father");
  const [region, setRegion] = useState<RegionId>("southwest");
  const [budget, setBudget] = useState<BudgetId>("serious");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const result = useMemo(() => {
    const rec = prescribe(occasion, region, budget);
    const primary = skuById(rec.primaryId)!;
    const insider = skuById(rec.insiderId)!;
    const primaryBrand = brandById(primary.brandId)!;
    const primaryAroma = skuAroma(primary);
    const primaryTier = tierById(primary.tier);
    const primaryNote = fieldNoteFor(primary, primaryAroma?.id);
    const insiderNote = fieldNoteFor(insider, skuAroma(insider)?.id);
    const regionObj = REGIONS.find((r) => r.id === region) ?? REGIONS[0];
    const occasionObj = OCCASIONS.find((o) => o.id === occasion)!;
    const budgetObj = BUDGETS.find((b) => b.id === budget)!;
    return {
      rec,
      primary,
      insider,
      primaryBrand,
      primaryAroma,
      primaryTier,
      primaryNote,
      insiderNote,
      regionObj,
      occasionObj,
      budgetObj,
    };
  }, [occasion, region, budget]);

  const primaryPrice = result.primary.chinaPrice ?? `~¥${result.primaryNote.estYuan.toLocaleString("en-US")}`;
  const insiderPrice = result.insider.chinaPrice ?? `~¥${result.insiderNote.estYuan.toLocaleString("en-US")}`;
  const shockMeta = SHOCK_LABELS[result.primaryNote.shock];

  async function handleExport() {
    setBusy(true);
    try {
      await downloadTablePrescriptionCard({
        occasion: result.occasionObj.label,
        region: `${result.regionObj.en} (${result.regionObj.provincesSummary})`,
        budget: result.budgetObj.range,
        primarySku: result.primary,
        primaryPrice,
        primaryNote: result.primaryNote,
        insiderName: `${result.insider.nameEn} (${result.insider.nameZh}) — ${result.insiderNote.tableSignal}`,
        whatGoesWrong: result.rec.whatGoesWrong,
        unspokenRule: result.regionObj.tableRule,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const text = [
      `Chinese Baijiu Guide · 选酒指南`,
      `Table: ${result.occasionObj.label} · ${result.regionObj.en} (${result.budgetObj.range})`,
      `Pour: ${result.primary.nameEn} (${result.primary.nameZh}) — ${primaryPrice} · ${result.primaryNote.gbCode}`,
      `Palate: ${result.primaryNote.flavorTruth}`,
      `Insider Backup: ${result.insider.nameEn} (${result.insider.nameZh})`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  function handleRandomize() {
    const nextOcc = OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)].id;
    const nextReg = REGIONS[Math.floor(Math.random() * REGIONS.length)].id;
    const nextBud = BUDGETS[Math.floor(Math.random() * BUDGETS.length)].id;
    setOccasion(nextOcc);
    setRegion(nextReg);
    setBudget(nextBud);
  }

  return (
    <>
      <p className="kicker">Curatorial Guide · 选酒指南</p>
      <h1>
        Find Your Bottle <span className="zh-inline">选酒指南</span>
      </h1>
      <p className="sub">
        Every Chinese table speaks through the bottle set on it. Choose a moment below — or compose your own table — to
        discover the right pour, how it actually tastes, and what locals quietly notice.
      </p>

      {/* Curated Discovery Moments */}
      <section className="guide-moments-wrap" aria-label="Curated drinking moments">
        <div className="guide-moments-head">
          <span className="guide-eyebrow">Explore by Moment · 场景选酒</span>
          <button type="button" className="guide-surprise" onClick={handleRandomize}>
            Surprise me ↻
          </button>
        </div>
        <div className="guide-moments">
          {CURATED_MOMENTS.map((moment) => {
            const active =
              occasion === moment.occasion && region === moment.region && budget === moment.budget;
            const previewRec = prescribe(moment.occasion, moment.region, moment.budget);
            const previewSku = skuById(previewRec.primaryId);
            return (
              <button
                key={moment.title}
                type="button"
                className={active ? "guide-moment is-active" : "guide-moment"}
                aria-pressed={active}
                onClick={() => {
                  setOccasion(moment.occasion);
                  setRegion(moment.region);
                  setBudget(moment.budget);
                }}
              >
                <span className="guide-moment-thumb" aria-hidden="true">
                  {previewSku?.image ? <img src={previewSku.image} alt="" /> : null}
                </span>
                <span className="guide-moment-copy">
                  <strong>{moment.title}</strong>
                  <span className="guide-moment-zh">{moment.zh}</span>
                  <span className="guide-moment-meta">{moment.meta}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Editorial Inline Table Composer */}
      <section className="guide-composer" aria-label="Customize occasion, region, and budget">
        <div className="guide-sentence">
          <span className="guide-phrase">Pouring for</span>
          <label className="guide-inline-select">
            <span className="visually-hidden">Occasion</span>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value as OccasionId)}
            >
              {OCCASIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6l4 4 4-4"
              />
            </svg>
          </label>

          <span className="guide-phrase">in</span>

          <label className="guide-inline-select">
            <span className="visually-hidden">Region</span>
            <select
              id="advisor-region"
              value={region}
              onChange={(e) => setRegion(e.target.value as RegionId)}
            >
              {REGIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.en} ({item.provincesSummary})
                </option>
              ))}
            </select>
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6l4 4 4-4"
              />
            </svg>
          </label>
        </div>

        <div className="guide-spend-row">
          <span className="guide-eyebrow">
            Spend · <em>{result.budgetObj.label}</em>
          </span>
          <div className="guide-spend-pills" role="radiogroup" aria-label="Budget">
            {BUDGETS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="radio"
                aria-checked={budget === item.id}
                className={budget === item.id ? "guide-spend-pill is-on" : "guide-spend-pill"}
                onClick={() => setBudget(item.id)}
              >
                {item.short}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Bottle Showcase */}
      <section className="guide-showcase" aria-live="polite">
        <div className="guide-spread">
          <div className="guide-pedestal-col">
            <Link className="guide-pedestal" href={`/sku/${result.primary.id}`}>
              {result.primary.image ? (
                <img
                  src={result.primary.image}
                  alt={`${result.primary.nameEn} (${result.primary.nameZh})`}
                  style={
                    result.primary.imagePosition
                      ? { objectPosition: result.primary.imagePosition }
                      : undefined
                  }
                />
              ) : null}
              <span className={`tier-tag ${result.primary.tier}`}>
                <i>{tierNumeral(result.primary.tier)}</i> {result.primaryTier?.zh}
              </span>
              <span className="guide-price-tag">{primaryPrice}</span>
            </Link>

            <div className="guide-placard">
              <div className="guide-placard-row">
                <span className="guide-placard-k">Standard</span>
                <span className="guide-placard-v">
                  {result.primaryNote.gbCode} · {GB_KIND_META[result.primaryNote.gbKind].zh}
                </span>
              </div>
              <div className="guide-placard-row">
                <span className="guide-placard-k">First-Timer Shock</span>
                <span className="guide-placard-v">
                  <span className="shock-dots" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={n <= result.primaryNote.shock ? "dot is-on" : "dot"}
                      />
                    ))}
                  </span>{" "}
                  {shockMeta.title}
                </span>
              </div>
            </div>
          </div>

          <div className="guide-dossier">
            <span className="signal-kicker">
              The Pour · 正选 · {result.primaryBrand.provinceEn} ·{" "}
              {result.primaryAroma?.en.replace(" aroma", "")}
            </span>
            <h2 className="guide-bottle-title">
              <Link href={`/sku/${result.primary.id}`}>
                {result.primary.nameEn} <span className="zh-inline">{result.primary.nameZh}</span>
              </Link>
            </h2>
            <p className="guide-specs">
              <strong>{primaryPrice}</strong> · {result.primary.abv} · {result.primary.volume} ·{" "}
              {result.primaryBrand.nameEn}
            </p>

            <blockquote className="guide-signal">“{result.primaryNote.tableSignal}”</blockquote>

            <div className="guide-palate">
              <span className="guide-eyebrow">On the Palate · 入口风味</span>
              <p>{result.primaryNote.flavorTruth}</p>
            </div>

            <Link className="guide-insider" href={`/sku/${result.insider.id}`}>
              <span className="guide-insider-thumb" aria-hidden="true">
                {result.insider.image ? <img src={result.insider.image} alt="" /> : null}
              </span>
              <span className="guide-insider-copy">
                <span className="guide-eyebrow">Insider Backup · 懂行备选 · {insiderPrice}</span>
                <strong>
                  {result.insider.nameEn}{" "}
                  <span className="zh-inline-sm">{result.insider.nameZh}</span>
                </strong>
                <span className="guide-insider-note">{result.insiderNote.tableSignal}</span>
              </span>
              <span className="guide-insider-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            <div className="actions">
              <Link className="btn solid" href={`/sku/${result.primary.id}`}>
                Open full dossier →
              </Link>
              <button type="button" className="btn" onClick={handleExport} disabled={busy}>
                {busy ? "Rendering PNG..." : "Save Card (PNG)"}
              </button>
              <button type="button" className="btn" onClick={handleCopy}>
                {copied ? "Copied for X" : "Copy Verdict"}
              </button>
            </div>
          </div>
        </div>

        <div className="guide-notes">
          <div className="guide-note is-danger">
            <span className="warn-kicker">If You Miss the Mark · 踩雷后果</span>
            <p>{result.rec.whatGoesWrong}</p>
          </div>
          <div className="guide-note is-rule">
            <span className="warn-kicker">
              Regional Table Rule · {result.regionObj.en} ({result.regionObj.zh})
            </span>
            <p>{result.regionObj.tableRule}</p>
          </div>
        </div>
      </section>
    </>
  );
}
