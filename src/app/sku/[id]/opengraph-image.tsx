import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brandById, skuAroma, skuById, skus, tierById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META } from "@/field-notes";
import { SITE_NAME } from "@/lib/site";
import type { TierId } from "@/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} specimen card`;

export function generateStaticParams() {
  return skus.map((sku) => ({ id: sku.id }));
}

const TIER_NUMERAL: Record<TierId, string> = {
  guoyan: "I",
  mingjiu: "II",
  jianiang: "III",
  kouliang: "IV",
};

const ACCESSION_MAP = new Map<string, string>(
  skus.map((item, idx) => [item.id, `NO. ${String(idx + 1).padStart(2, "0")}`]),
);

const GOOGLE_FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: "normal";
};

// Satori's font engine can reuse cached glyph outlines across 400/600 weights
// under the same family name, so each weight is registered as its own family.
const FONT_SPECS = [
  { weight: 400, name: "DMRegular" },
  { weight: 600, name: "DMSemiBold" },
  { weight: 700, name: "DMBold" },
] as const;

let fontsPromise: Promise<OgFont[]> | null = null;

async function fetchDmSansFont(weight: number, name: string): Promise<OgFont | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=DM+Sans:wght@${weight}&display=swap`,
      { headers: { "User-Agent": GOOGLE_FONT_UA } },
    ).then((res) => (res.ok ? res.text() : ""));
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1]);
    if (!res.ok) return null;
    return {
      name,
      data: await res.arrayBuffer(),
      weight: 400,
      style: "normal",
    };
  } catch {
    return null;
  }
}

function loadOgFonts(): Promise<OgFont[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all(
      FONT_SPECS.map((spec) => fetchDmSansFont(spec.weight, spec.name)),
    ).then((items) => items.filter((item): item is OgFont => item !== null));
  }
  return fontsPromise;
}

async function readStudioBase64(imagePath?: string): Promise<string | null> {
  if (!imagePath || !imagePath.startsWith("/")) return null;
  try {
    const relativePath = imagePath.replace(/^\/+/, "");
    const file = path.join(process.cwd(), "public", relativePath);
    const buf = await readFile(file);
    const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function titleFontSize(nameEn: string): number {
  if (nameEn.length <= 16) return 54;
  if (nameEn.length <= 23) return 46;
  return 40;
}

function signalFontSize(signal: string): number {
  if (signal.length <= 72) return 26;
  if (signal.length <= 96) return 23;
  return 21;
}

function compactAbv(rawAbv: string, maxAbv: number): string {
  const exact = rawAbv.trim().match(/^(\d+(?:\.\d+)?)%\s*vol$/i);
  if (exact) return `${exact[1]}% vol`;
  return `${maxAbv}% vol`;
}

function compactVolume(rawVolume: string): string | null {
  const match = rawVolume.match(/(\d+(?:\.\d+)?)\s*ml/i);
  return match ? `${match[1]} ml` : null;
}

export default async function SkuOpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sku = skuById(id);
  const brand = sku ? brandById(sku.brandId) : null;
  const fonts = await loadOgFonts();
  const hasCustomFonts = fonts.length === FONT_SPECS.length;
  const fontOptions = hasCustomFonts
    ? { fonts: fonts.map((font) => ({ ...font })) }
    : {};
  const fontRegular = hasCustomFonts ? "DMRegular" : "sans-serif";
  const fontSemiBold = hasCustomFonts ? "DMSemiBold" : "sans-serif";
  const fontBold = hasCustomFonts ? "DMBold" : "sans-serif";

  if (!sku || !brand) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#f4f2ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontFamily: fontBold,
            color: "#111111",
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size, ...fontOptions },
    );
  }

  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const note = fieldNoteFor(sku, aroma?.id);
  const gbMeta = GB_KIND_META[note.gbKind];
  const imgData = await readStudioBase64(sku.image);
  const accession = ACCESSION_MAP.get(sku.id) ?? "NO. 00";
  const numeral = TIER_NUMERAL[sku.tier];
  const tierEnBadge = `TIER ${numeral}`;
  const tierZhBadge = tier?.zh ?? "";
  const originLine = [brand.provinceEn, aroma?.en, tier?.en].filter(Boolean).join(" · ");
  const specLabel = [compactAbv(sku.abv, note.maxAbv), compactVolume(sku.volume)]
    .filter(Boolean)
    .join(" · ");

  const gbTone =
    note.gbKind === "pure"
      ? { bg: "#ffffff", border: "rgba(11,11,13,0.14)", color: "#1a1a1a", dot: "#16a34a" }
      : note.gbKind === "blended"
        ? { bg: "#fef7ec", border: "rgba(180,83,9,0.28)", color: "#92400e", dot: "#d97706" }
        : { bg: "#f2f7f4", border: "rgba(21,128,61,0.24)", color: "#166534", dot: "#15803d" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f6f4ef 0%, #f1eee8 60%, #eae6de 100%)",
          display: "flex",
          padding: 40,
          gap: 36,
          fontFamily: fontRegular,
        }}
      >
        <div
          style={{
            width: 550,
            height: 550,
            background: "#f2f0ec",
            borderRadius: 26,
            border: "1px solid rgba(11,11,13,0.08)",
            boxShadow: "0 20px 44px rgba(11,11,13,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {imgData ? (
            <img
              src={imgData}
              alt={sku.nameEn}
              width={550}
              height={550}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", fontSize: 72, fontFamily: fontBold, color: "#111111" }}>
              {brand.nameZh.slice(0, 2)}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              background: sku.tier === "guoyan" ? "#c81e1e" : "#111111",
              color: "#ffffff",
              padding: "8px 16px",
              fontSize: 16,
              letterSpacing: "0.06em",
              borderRadius: 999,
              boxShadow: "0 6px 18px rgba(11,11,13,0.18)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontFamily: fontBold }}>{tierEnBadge}</span>
            {tierZhBadge ? (
              <>
                <span style={{ fontFamily: fontRegular, opacity: 0.72 }}>·</span>
                <span style={{ fontFamily: fontRegular, opacity: 0.94 }}>{tierZhBadge}</span>
              </>
            ) : null}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "6px 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="38" height="38" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="6" ry="6" fill="#c81e1e" />
                <path
                  d="M304 -766L808 -766L868 -848Q868 -848 879.5 -838.5Q891 -829 908 -815Q925 -801 943.5 -784.5Q962 -768 978 -753Q974 -737 951 -737L312 -737ZM401 -203L864 -203L864 -175L401 -175ZM401 -34L864 -34L864 -6L401 -6ZM650 -766L741 -766Q741 -756 741 -748Q741 -740 741 -733L741 -409Q741 -400 744 -396.5Q747 -393 757 -393L783 -393Q791 -393 798.5 -393Q806 -393 810 -393Q814 -393 819 -393Q824 -393 827 -394Q832 -395 838.5 -396Q845 -397 848 -398L858 -398L862 -396Q880 -389 887.5 -379.5Q895 -370 895 -356Q895 -327 867.5 -314Q840 -301 772 -301L727 -301Q693 -301 676.5 -308.5Q660 -316 655 -334Q650 -352 650 -381ZM502 -766L595 -766L595 -540Q595 -500 591 -459Q587 -418 572 -379.5Q557 -341 526.5 -307Q496 -273 442 -245L432 -255Q466 -293 480.5 -338.5Q495 -384 498.5 -435Q502 -486 502 -539ZM341 -594L341 -639L456 -594L810 -594L864 -657L965 -576Q960 -570 950.5 -564.5Q941 -559 923 -556L923 52Q923 57 898 69.5Q873 82 833 82L815 82L815 -566L444 -566L444 59Q444 65 421.5 76.5Q399 88 359 88L341 88ZM106 -836Q174 -831 214.5 -813Q255 -795 272.5 -771.5Q290 -748 290 -725Q290 -702 276.5 -686Q263 -670 240.5 -666.5Q218 -663 191 -680Q185 -707 169.5 -734.5Q154 -762 135 -787Q116 -812 98 -830ZM32 -614Q96 -605 133.5 -586Q171 -567 185.5 -544Q200 -521 198.5 -499.5Q197 -478 182 -463Q167 -448 145.5 -446.5Q124 -445 99 -463Q96 -489 84.5 -515.5Q73 -542 57 -566Q41 -590 24 -607ZM90 -214Q101 -214 106 -216.5Q111 -219 120 -235Q126 -247 131.5 -257.5Q137 -268 147 -291Q157 -314 176.5 -359Q196 -404 229.5 -483.5Q263 -563 315 -686L331 -682Q320 -645 306.5 -597Q293 -549 279 -499.5Q265 -450 252 -404Q239 -358 229.5 -323Q220 -288 217 -271Q211 -246 207 -220.5Q203 -195 203 -176Q204 -155 210 -137Q216 -119 224.5 -99Q233 -79 238.5 -54Q244 -29 243 5Q242 42 219 65Q196 88 160 88Q143 88 127.5 76.5Q112 65 107 36Q116 -16 117.5 -62Q119 -108 114 -139.5Q109 -171 97 -179Q87 -187 74.5 -190.5Q62 -194 46 -195L46 -214Q46 -214 54.5 -214Q63 -214 74 -214Q85 -214 90 -214Z"
                  fill="#ffffff"
                  transform="translate(4.57 24.67) scale(0.02281)"
                />
              </svg>
              <span
                style={{
                  fontSize: 16,
                  color: "#767066",
                  letterSpacing: "0.10em",
                  fontFamily: fontBold,
                }}
              >
                {`${SITE_NAME.toUpperCase()} · ${accession}`}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: titleFontSize(sku.nameEn),
                  fontFamily: fontBold,
                  color: "#111111",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                }}
              >
                {sku.nameEn}
              </div>
              <div style={{ fontSize: 28, fontFamily: fontRegular, color: "#524d46", lineHeight: 1.2 }}>
                {sku.nameZh}
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#7d776d", marginTop: 2 }}>
                {originLine}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {sku.chinaPrice ? (
                <div
                  style={{
                    background: "#111111",
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 18,
                    fontFamily: fontBold,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {sku.chinaPrice}
                </div>
              ) : null}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(11,11,13,0.12)",
                  color: "#1a1a1a",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 17,
                  fontFamily: fontSemiBold,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {specLabel}
              </div>
              <div
                style={{
                  background: gbTone.bg,
                  border: `1px solid ${gbTone.border}`,
                  color: gbTone.color,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: gbTone.dot,
                    display: "flex",
                    marginRight: 2,
                  }}
                />
                <span style={{ fontFamily: fontSemiBold }}>{note.gbCode}</span>
                <span style={{ fontFamily: fontRegular, opacity: 0.55 }}>·</span>
                <span style={{ fontFamily: fontRegular }}>{gbMeta.zh}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderLeft: "5px solid #c81e1e",
              borderTop: "1px solid rgba(11,11,13,0.06)",
              borderRight: "1px solid rgba(11,11,13,0.06)",
              borderBottom: "1px solid rgba(11,11,13,0.06)",
              borderRadius: "0 18px 18px 0",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 10px 28px rgba(11,11,13,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#c81e1e",
                letterSpacing: "0.12em",
              }}
            >
              <span style={{ fontFamily: fontBold }}>TABLE SIGNAL</span>
              <span style={{ fontFamily: fontRegular, opacity: 0.6 }}>·</span>
              <span style={{ fontFamily: fontRegular }}>局意</span>
            </div>
            <div
              style={{
                fontSize: signalFontSize(note.tableSignal),
                fontFamily: fontSemiBold,
                color: "#111111",
                lineHeight: 1.32,
              }}
            >
              {`“${note.tableSignal}”`}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...fontOptions },
  );
}
