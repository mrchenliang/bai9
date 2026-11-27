import { brandById, skuAroma, skuById, skus, tierRank } from "@/catalog";
import { fieldNoteFor } from "@/field-notes";
import type { Sku } from "@/types";

export interface RankVerdict {
  zh: string;
  en: string;
  diagnosis: string;
}

export interface PassportSummary {
  tastedIds: string[];
  tastedSkus: Sku[];
  tastedCount: number;
  totalCount: number;
  provinceCount: number;
  maxAbv: number;
  avgShock: string;
  pureRatio: number;
  estBillYuan: number;
  rank: RankVerdict;
  topBottles: { id: string; nameEn: string; nameZh: string; image?: string }[];
}

export function parseStampedParam(raw: string | string[] | undefined): string[] {
  const value = Array.isArray(raw) ? raw.join(",") : raw;
  if (!value) return [];
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const part of value.split(",")) {
    const id = part.trim();
    if (!id || seen.has(id)) continue;
    if (skuById(id)) {
      seen.add(id);
      valid.push(id);
    }
  }
  return valid;
}

export function encodeStampedParam(ids: string[]): string {
  const seen = new Set<string>();
  const valid: string[] = [];
  for (const id of ids) {
    if (!seen.has(id) && skuById(id)) {
      seen.add(id);
      valid.push(id);
    }
  }
  return valid.join(",");
}

export function computeRank(tastedIds: string[]): RankVerdict {
  const count = tastedIds.length;
  if (count === 0) {
    return {
      zh: "旁观者",
      en: "Curatorial Observer",
      diagnosis: "Clean liver, unblemished record. Tap any bottle below to stamp your drinking passport.",
    };
  }

  const tastedSet = new Set(tastedIds);
  const tastedSkus = tastedIds.map((id) => skuById(id)).filter((s): s is Sku => Boolean(s));

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

export function computePassportSummary(tastedIds: string[]): PassportSummary {
  const tastedSkus = tastedIds.map((id) => skuById(id)).filter((s): s is Sku => Boolean(s));
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
  const rank = computeRank(tastedIds);

  const topBottles = [...tastedSkus]
    .sort((a, b) => tierRank[a.tier] - tierRank[b.tier] || (a.rank ?? 50) - (b.rank ?? 50))
    .slice(0, 6)
    .map((s) => ({ id: s.id, nameEn: s.nameEn, nameZh: s.nameZh, image: s.image }));

  return {
    tastedIds,
    tastedSkus,
    tastedCount: tastedSkus.length,
    totalCount: skus.length,
    provinceCount: provinces.size,
    maxAbv,
    avgShock,
    pureRatio,
    estBillYuan,
    rank,
    topBottles,
  };
}

export function buildPassportTweetText(summary: PassportSummary): string {
  return [
    `My Baijiu Drinking Passport: ${summary.rank.en} (${summary.rank.zh})`,
    `${summary.tastedCount}/${summary.totalCount} survived · ${summary.maxAbv || 0}% max ABV · ${summary.provinceCount} provinces · ¥${summary.estBillYuan.toLocaleString("en-US")} table bill`,
    `“${summary.rank.diagnosis}”`,
  ].join("\n\n");
}
