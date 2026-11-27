"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { brandById, skuAroma, skuById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META } from "@/field-notes";
import { downloadTablePrescriptionCard } from "@/lib/export-cards";

type OccasionId = "father" | "business" | "wedding" | "skewers" | "uncle" | "foreigner";
type RegionId = "north" | "guizhou" | "sichuan" | "jiangsu" | "anhui" | "guangdong" | "shandong";
type BudgetId = "street" | "mid" | "serious" | "nuclear";

const OCCASIONS: { id: OccasionId; label: string; zh: string }[] = [
  { id: "father", label: "Meeting partner's father", zh: "第一次见岳父" },
  { id: "business", label: "Closing a client dinner", zh: "商务宴请谈单" },
  { id: "wedding", label: "Wedding banquet", zh: "婚宴摆席" },
  { id: "skewers", label: "2am street skewers", zh: "宵夜撸串" },
  { id: "uncle", label: "Uncle who says 'bring nothing'", zh: "嘴上说别带东西" },
  { id: "foreigner", label: "First baijiu for foreign friends", zh: "带老外入坑" },
];

const REGIONS: { id: RegionId; label: string; zh: string; rule: string }[] = [
  {
    id: "north",
    label: "Beijing & North China",
    zh: "京津华北",
    rule: "Respect the elders first and keep pours honest. In Beijing, flashing an overpriced obscure box gets less respect than bringing real Fenjiu or Red Star.",
  },
  {
    id: "guizhou",
    label: "Guizhou & Southwest",
    zh: "贵州西南",
    rule: "Sauce-aroma home turf. Never bring a weak 42% bottle to a Guizhou table — 53% vol pure-grain solid-state (GB/T 26760) is the unspoken baseline.",
  },
  {
    id: "sichuan",
    label: "Sichuan & Chongqing",
    zh: "巴蜀川渝",
    rule: "Home of the Six Golden Flowers. Strong-aroma 52% rules the lazy Susan, and hosts pour generously — pace yourself early before the third toast.",
  },
  {
    id: "jiangsu",
    label: "Jiangsu & East China",
    zh: "江浙华东",
    rule: "Jiangsu tables speak in exact bottle tiers (Haizhilan < Tianzhilan < M6+ < M9). Bringing one tier below the host's expectation is noticed immediately.",
  },
  {
    id: "anhui",
    label: "Anhui & Central Plains",
    zh: "江淮中原",
    rule: "Local pride runs deep: Gujing Gu 16/20, Kouzijiao, and Yingjia command more instant warmth in Hefei than generic national labels.",
  },
  {
    id: "guangdong",
    label: "Guangdong & South",
    zh: "岭南粤港澳",
    rule: "Less forced bottoms-up ('ganbei') pressure than the north — smoothness and food pairing matter most. Never bully Cantonese guests into 67% shots.",
  },
  {
    id: "shandong",
    label: "Shandong",
    zh: "齐鲁酒桌",
    rule: "The strictest seating & toasting protocol in China: the host sits facing the door ('zhupeng'), the guest of honor sits to their right, and you do not sip before the host lifts the glass.",
  },
];

const BUDGETS: { id: BudgetId; label: string; short: string; range: string }[] = [
  { id: "street", label: "Honest Street", short: "<¥100", range: "Under ¥100" },
  { id: "mid", label: "Respectable", short: "¥150–450", range: "¥150–¥450" },
  { id: "serious", label: "Serious Face", short: "¥500–1k", range: "¥500–¥1,000" },
  { id: "nuclear", label: "Nuclear Option", short: "¥1.5k+", range: "¥1,500+" },
];

const QUICK_PRESETS: { label: string; occasion: OccasionId; region: RegionId; budget: BudgetId }[] = [
  { label: "Father-in-law · Sichuan", occasion: "father", region: "sichuan", budget: "serious" },
  { label: "Client dinner · Shandong", occasion: "business", region: "shandong", budget: "nuclear" },
  { label: "Wedding banquet", occasion: "wedding", region: "sichuan", budget: "mid" },
  { label: "“Bring nothing” uncle", occasion: "uncle", region: "north", budget: "mid" },
  { label: "2am Beijing skewers", occasion: "skewers", region: "north", budget: "street" },
];

interface Recommendation {
  primaryId: string;
  insiderId: string;
  whatGoesWrong: string;
}

function prescribe(occasion: OccasionId, region: RegionId, budget: BudgetId): Recommendation {
  if (occasion === "skewers") {
    if (region === "north") {
      return {
        primaryId: "huanggai",
        insiderId: "hongxing-56",
        whatGoesWrong:
          "Bringing a ¥800 gift box to a plastic-stool skewer stall looks completely unhinged. Everyone will worry you are about to ask them for a loan.",
      };
    }
    if (region === "guangdong") {
      return {
        primaryId: "yukbing-classic",
        insiderId: "sanhua-52",
        whatGoesWrong:
          "Dropping heavy 53% sauce aroma onto midnight Cantonese claypot rice overwhelms every dish on the table.",
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
    if (region === "jiangsu" && occasion === "business") {
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
    return {
      primaryId: "huanggai",
      insiderId: "erqu",
      whatGoesWrong:
        "Grabbing a flashy no-name gold-foil bottle from a supermarket endcap for ¥69 is the worst trap — it is almost always GB/T 20822 blended spirit dressed like a king.",
    };
  }

  if (budget === "serious") {
    if (region === "jiangsu") {
      return {
        primaryId: "mengzhilan-m6",
        insiderId: "guoyuan",
        whatGoesWrong:
          "Bringing Sea Blue or an unfamiliar regional bottle to a Jiangsu serious table quietly signals you did not take the meeting seriously.",
      };
    }
    if (region === "anhui") {
      return {
        primaryId: "gu20",
        insiderId: "guojiao",
        whatGoesWrong:
          "Skipping Anhui's hometown flagship Gu 20 for a generic ¥600 secondary label loses instant hometown goodwill.",
      };
    }
    if (region === "guizhou") {
      return {
        primaryId: "junpin",
        insiderId: "qinghualang",
        whatGoesWrong:
          "Bringing a soft low-proof strong-aroma bottle to a Guizhou sauce-aroma host gets polite smiles and half-full cups at the end of dinner.",
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
      insiderId: "honghualang",
      whatGoesWrong:
        "Choosing a white/plain bottle over festive red or crystal packaging for a wedding table gets quietly judged by every auntie before the cold dishes arrive.",
    };
  }
  if (region === "jiangsu") {
    return {
      primaryId: "guoyuan",
      insiderId: "tianzhilan",
      whatGoesWrong:
        "Bringing entry-level Sea Blue when the table expects Four-Open Guoyuan is a classic rookie mistake in Nanjing.",
    };
  }
  if (region === "anhui") {
    return {
      primaryId: "gu16",
      insiderId: "kouzi-cellar",
      whatGoesWrong:
        "Bringing an unfamiliar out-of-province brand when Anhui locals swear by Gujing Gu 16 and Kouzijiao wastes your budget.",
    };
  }
  if (region === "guizhou") {
    return {
      primaryId: "xijiu-1988",
      insiderId: "zhen-15",
      whatGoesWrong:
        "Falling for 'Moutai Yingbin' just for the four characters on the label when Xijiu Cellar 1988 drinks circles around it.",
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
    insiderId: "qinghua-20",
    whatGoesWrong:
      "Never buy a fancy-box 'special commemorative' sub-brand at ¥300 — every seasoned drinker immediately googles the wholesale price and knows it costs ¥68.",
  };
}

export function TableAdvisor() {
  const [occasion, setOccasion] = useState<OccasionId>("father");
  const [region, setRegion] = useState<RegionId>("sichuan");
  const [budget, setBudget] = useState<BudgetId>("serious");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const result = useMemo(() => {
    const rec = prescribe(occasion, region, budget);
    const primary = skuById(rec.primaryId)!;
    const insider = skuById(rec.insiderId)!;
    const primaryBrand = brandById(primary.brandId)!;
    const primaryNote = fieldNoteFor(primary, skuAroma(primary)?.id);
    const insiderNote = fieldNoteFor(insider, skuAroma(insider)?.id);
    const regionObj = REGIONS.find((r) => r.id === region)!;
    const occasionObj = OCCASIONS.find((o) => o.id === occasion)!;
    const budgetObj = BUDGETS.find((b) => b.id === budget)!;
    return {
      rec,
      primary,
      insider,
      primaryBrand,
      primaryNote,
      insiderNote,
      regionObj,
      occasionObj,
      budgetObj,
    };
  }, [occasion, region, budget]);

  const primaryPrice = result.primary.chinaPrice ?? `~¥${result.primaryNote.estYuan}`;

  async function handleExport() {
    setBusy(true);
    try {
      await downloadTablePrescriptionCard({
        occasion: result.occasionObj.label,
        region: result.regionObj.label,
        budget: result.budgetObj.range,
        primarySku: result.primary,
        primaryPrice,
        primaryNote: result.primaryNote,
        insiderName: `${result.insider.nameEn} (${result.insider.nameZh}) — ${result.insiderNote.tableSignal}`,
        whatGoesWrong: result.rec.whatGoesWrong,
        unspokenRule: result.regionObj.rule,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    const text = [
      `Baijiu Table Prescription · 局酒指南`,
      `Scenario: ${result.occasionObj.label} in ${result.regionObj.label} (${result.budgetObj.range})`,
      `Bring: ${result.primary.nameEn} (${result.primary.nameZh}) — ${primaryPrice} · ${result.primaryNote.gbCode}`,
      `Insider Alternative: ${result.insider.nameEn} (${result.insider.nameZh})`,
      `Warning: ${result.rec.whatGoesWrong}`,
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
      <p className="kicker">Interactive Curatorial Desk · Table Survival · 局酒指南</p>
      <h1>
        What Bottle Do I Bring? <span className="zh-inline">局酒指南</span>
      </h1>
      <p className="sub">
        In China, the bottle you set on a lazy Susan speaks before you sit down. Pick the occasion, region, and budget —
        get the culturally truthful recommendation, insider backup, and what goes wrong if you miss.
      </p>

      <section className="advisor-controls" aria-label="Scenario selector">
        <div className="advisor-bar">
          <div className="advisor-field">
            <label htmlFor="advisor-occasion" className="advisor-field-head">
              <span className="advisor-step">Occasion</span>
              <span className="advisor-zh">{result.occasionObj.zh}</span>
            </label>
            <div className="advisor-select-wrap">
              <select
                id="advisor-occasion"
                className="advisor-select"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value as OccasionId)}
              >
                {OCCASIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <svg className="advisor-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6l4 4 4-4"
                />
              </svg>
            </div>
          </div>

          <div className="advisor-field">
            <label htmlFor="advisor-region" className="advisor-field-head">
              <span className="advisor-step">Region</span>
              <span className="advisor-zh">{result.regionObj.zh}</span>
            </label>
            <div className="advisor-select-wrap">
              <select
                id="advisor-region"
                className="advisor-select"
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionId)}
              >
                {REGIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <svg className="advisor-chevron" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6l4 4 4-4"
                />
              </svg>
            </div>
          </div>

          <div className="advisor-field">
            <div className="advisor-field-head">
              <span className="advisor-step">Budget</span>
              <span className="advisor-budget-tag">{result.budgetObj.label}</span>
            </div>
            <div className="advisor-segments" role="radiogroup" aria-label="Budget tier">
              {BUDGETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={budget === item.id}
                  className={budget === item.id ? "advisor-seg is-on" : "advisor-seg"}
                  onClick={() => setBudget(item.id)}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="advisor-presets">
          <span className="advisor-preset-label">Presets</span>
          <div className="advisor-preset-list">
            {QUICK_PRESETS.map((preset) => {
              const active =
                occasion === preset.occasion && region === preset.region && budget === preset.budget;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={active ? "advisor-preset is-on" : "advisor-preset"}
                  onClick={() => {
                    setOccasion(preset.occasion);
                    setRegion(preset.region);
                    setBudget(preset.budget);
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <button type="button" className="advisor-shuffle" onClick={handleRandomize}>
            Random ↻
          </button>
        </div>
      </section>

      <section className="prescription" aria-live="polite">
        <div className="prescription-main">
          <Link className="prescription-photo" href={`/sku/${result.primary.id}`}>
            {result.primary.image ? (
              <img src={result.primary.image} alt={`${result.primary.nameEn} (${result.primary.nameZh})`} />
            ) : null}
          </Link>
          <div className="prescription-info">
            <span className="signal-kicker">Culturally Correct Bottle · 正选</span>
            <h2>
              <Link href={`/sku/${result.primary.id}`}>
                {result.primary.nameEn} <span className="zh-inline">{result.primary.nameZh}</span>
              </Link>
            </h2>
            <p className="prescription-meta">
              <strong>{primaryPrice}</strong> · {result.primary.abv} · {result.primaryBrand.provinceEn} ·{" "}
              {result.primaryNote.gbCode} ({GB_KIND_META[result.primaryNote.gbKind].zh})
            </p>
            <p className="prescription-quote">“{result.primaryNote.tableSignal}”</p>
            <div className="insider-box">
              <span className="insider-label">Insider Alternative · 懂行备选</span>
              <Link href={`/sku/${result.insider.id}`}>
                <strong>
                  {result.insider.nameEn} ({result.insider.nameZh})
                </strong>{" "}
                — {result.insiderNote.tableSignal}
              </Link>
            </div>
            <div className="actions">
              <button type="button" className="btn solid" onClick={handleExport} disabled={busy}>
                {busy ? "Rendering PNG..." : "Download Prescription Card (PNG)"}
              </button>
              <button type="button" className="btn" onClick={handleCopy}>
                {copied ? "Copied for X" : "Copy Verdict for X"}
              </button>
              <Link className="btn" href={`/sku/${result.primary.id}`}>
                Open full dossier →
              </Link>
            </div>
          </div>
        </div>

        <div className="prescription-warnings">
          <div className="warn-card is-danger">
            <span className="warn-kicker">What Goes Wrong If You Miss · 踩雷后果</span>
            <p>{result.rec.whatGoesWrong}</p>
          </div>
          <div className="warn-card is-rule">
            <span className="warn-kicker">
              Unspoken Regional Rule · {result.regionObj.zh}席间潜规则
            </span>
            <p>{result.regionObj.rule}</p>
          </div>
        </div>
      </section>
    </>
  );
}
