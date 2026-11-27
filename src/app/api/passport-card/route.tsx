import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { skuById } from "@/catalog";
import { computePassportSummary, parseStampedParam } from "@/lib/passport";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };
const DEFAULT_SHOWCASE_IDS = ["feitian", "puwu", "guojiao", "qinghua-20"];

const GOOGLE_FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: "normal";
};

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
      { headers: { "User-Agent": GOOGLE_FONT_UA }, signal: AbortSignal.timeout(3500) },
    ).then((res) => (res.ok ? res.text() : ""));
    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
    if (!match) return null;
    const res = await fetch(match[1], { signal: AbortSignal.timeout(3500) });
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

function rankFontSize(title: string): number {
  if (title.length <= 18) return 44;
  if (title.length <= 24) return 38;
  return 34;
}

export async function GET(request: NextRequest) {
  const rawParam = request.nextUrl.searchParams.get("s") ?? undefined;
  const stampedIds = parseStampedParam(rawParam);
  const summary = computePassportSummary(stampedIds);

  const showcaseItems =
    summary.topBottles.length > 0
      ? summary.topBottles.slice(0, 4)
      : DEFAULT_SHOWCASE_IDS.map((id) => skuById(id))
          .filter((s): s is NonNullable<typeof s> => Boolean(s))
          .map((s) => ({ id: s.id, nameEn: s.nameEn, nameZh: s.nameZh, image: s.image }));

  const [fonts, bottleImages] = await Promise.all([
    loadOgFonts(),
    Promise.all(
      showcaseItems.map(async (item) => ({
        ...item,
        dataUri: await readStudioBase64(item.image),
      })),
    ),
  ]);

  const hasCustomFonts = fonts.length === FONT_SPECS.length;
  const fontOptions = hasCustomFonts
    ? { fonts: fonts.map((font) => ({ ...font })) }
    : {};
  const fontRegular = hasCustomFonts ? "DMRegular" : "sans-serif";
  const fontSemiBold = hasCustomFonts ? "DMSemiBold" : "sans-serif";
  const fontBold = hasCustomFonts ? "DMBold" : "sans-serif";

  const metrics = [
    { label: "SURVIVED", value: `${summary.tastedCount}/${summary.totalCount}` },
    { label: "MAX ABV", value: summary.maxAbv > 0 ? `${summary.maxAbv}%` : "—" },
    { label: "PROVINCES", value: `${summary.provinceCount}` },
    { label: "EST. BILL", value: `¥${summary.estBillYuan.toLocaleString("en-US")}` },
  ];

  const isPersonalized = summary.tastedCount > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f8f6f1 0%, #f1ede5 60%, #e9e4da 100%)",
          display: "flex",
          padding: 36,
          gap: 32,
          fontFamily: fontRegular,
        }}
      >
        {/* Left dossier column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="38" height="38" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="6" ry="6" fill="#c81e1e" />
                <path
                  d="M304 -766L808 -766L868 -848Q868 -848 879.5 -838.5Q891 -829 908 -815Q925 -801 943.5 -784.5Q962 -768 978 -753Q974 -737 951 -737L312 -737ZM401 -203L864 -203L864 -175L401 -175ZM401 -34L864 -34L864 -6L401 -6ZM650 -766L741 -766Q741 -756 741 -748Q741 -740 741 -733L741 -409Q741 -400 744 -396.5Q747 -393 757 -393L783 -393Q791 -393 798.5 -393Q806 -393 810 -393Q814 -393 819 -393Q824 -393 827 -394Q832 -395 838.5 -396Q845 -397 848 -398L858 -398L862 -396Q880 -389 887.5 -379.5Q895 -370 895 -356Q895 -327 867.5 -314Q840 -301 772 -301L727 -301Q693 -301 676.5 -308.5Q660 -316 655 -334Q650 -352 650 -381ZM502 -766L595 -766L595 -540Q595 -500 591 -459Q587 -418 572 -379.5Q557 -341 526.5 -307Q496 -273 442 -245L432 -255Q466 -293 480.5 -338.5Q495 -384 498.5 -435Q502 -486 502 -539ZM341 -594L341 -639L456 -594L810 -594L864 -657L965 -576Q960 -570 950.5 -564.5Q941 -559 923 -556L923 52Q923 57 898 69.5Q873 82 833 82L815 82L815 -566L444 -566L444 59Q444 65 421.5 76.5Q399 88 359 88L341 88ZM106 -836Q174 -831 214.5 -813Q255 -795 272.5 -771.5Q290 -748 290 -725Q290 -702 276.5 -686Q263 -670 240.5 -666.5Q218 -663 191 -680Q185 -707 169.5 -734.5Q154 -762 135 -787Q116 -812 98 -830ZM32 -614Q96 -605 133.5 -586Q171 -567 185.5 -544Q200 -521 198.5 -499.5Q197 -478 182 -463Q167 -448 145.5 -446.5Q124 -445 99 -463Q96 -489 84.5 -515.5Q73 -542 57 -566Q41 -590 24 -607ZM90 -214Q101 -214 106 -216.5Q111 -219 120 -235Q126 -247 131.5 -257.5Q137 -268 147 -291Q157 -314 176.5 -359Q196 -404 229.5 -483.5Q263 -563 315 -686L331 -682Q320 -645 306.5 -597Q293 -549 279 -499.5Q265 -450 252 -404Q239 -358 229.5 -323Q220 -288 217 -271Q211 -246 207 -220.5Q203 -195 203 -176Q204 -155 210 -137Q216 -119 224.5 -99Q233 -79 238.5 -54Q244 -29 243 5Q242 42 219 65Q196 88 160 88Q143 88 127.5 76.5Q112 65 107 36Q116 -16 117.5 -62Q119 -108 114 -139.5Q109 -171 97 -179Q87 -187 74.5 -190.5Q62 -194 46 -195L46 -214Q46 -214 54.5 -214Q63 -214 74 -214Q85 -214 90 -214Z"
                  fill="#ffffff"
                  transform="translate(4.57 24.67) scale(0.02281)"
                />
              </svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 15,
                    color: "#111111",
                    letterSpacing: "0.09em",
                    fontFamily: fontBold,
                  }}
                >
                  {SITE_NAME.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#767066",
                    letterSpacing: "0.10em",
                    fontFamily: fontSemiBold,
                  }}
                >
                  OFFICIAL DRINKING PASSPORT
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                border: "2px solid #c81e1e",
                borderRadius: 8,
                background: "#ffffff",
                color: "#c81e1e",
                fontSize: 14,
                fontFamily: fontBold,
                letterSpacing: "0.08em",
              }}
            >
              {isPersonalized ? `VERIFIED · ${summary.tastedCount}/${summary.totalCount}` : "STAMP YOURS"}
            </div>
          </div>

          {/* Rank callout card */}
          <div
            style={{
              background: "#ffffff",
              borderLeft: "6px solid #c81e1e",
              borderTop: "1px solid rgba(11,11,13,0.08)",
              borderRight: "1px solid rgba(11,11,13,0.08)",
              borderBottom: "1px solid rgba(11,11,13,0.08)",
              borderRadius: "0 18px 18px 0",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 12px 28px rgba(11,11,13,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#c81e1e",
                letterSpacing: "0.12em",
                fontFamily: fontBold,
              }}
            >
              <span>CURATORIAL RANK</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ fontFamily: fontRegular }}>{summary.rank.zh}</span>
            </div>
            <div
              style={{
                fontSize: rankFontSize(summary.rank.en),
                fontFamily: fontBold,
                color: "#111111",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
              }}
            >
              {summary.rank.en}
            </div>
            <div
              style={{
                fontSize: 21,
                fontFamily: fontRegular,
                color: "#4d4841",
                lineHeight: 1.38,
              }}
            >
              {`“${summary.rank.diagnosis}”`}
            </div>
          </div>

          {/* 4-Metric bar */}
          <div style={{ display: "flex", gap: 12 }}>
            {metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  flex: 1,
                  background: "#ffffff",
                  border: "1px solid rgba(11,11,13,0.09)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#767066",
                    letterSpacing: "0.09em",
                    fontFamily: fontSemiBold,
                  }}
                >
                  {m.label}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    color: "#111111",
                    fontFamily: fontBold,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              color: "#767066",
              fontFamily: fontSemiBold,
              letterSpacing: "0.04em",
            }}
          >
            <span>bai9.app/passport</span>
            <span>by @mr_chenliang</span>
          </div>
        </div>

        {/* Right 2x2 studio specimen showcase */}
        <div
          style={{
            width: 416,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.10em",
              color: "#767066",
              fontFamily: fontBold,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{isPersonalized ? "STAMPED SPECIMENS" : "FEATURED SPECIMENS"}</span>
            <span>{isPersonalized && summary.tastedCount > 4 ? `+${summary.tastedCount - 4} MORE` : "ARCHIVE"}</span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {bottleImages.map((item) => (
              <div
                key={item.id}
                style={{
                  width: 202,
                  height: 256,
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid rgba(11,11,13,0.09)",
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 8px 20px rgba(11,11,13,0.05)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 196,
                    background: "#f4f3ef",
                    borderRadius: 10,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.dataUri ? (
                    <img
                      src={item.dataUri}
                      alt={item.nameEn}
                      width={182}
                      height={196}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: fontBold,
                    color: "#111111",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {item.nameEn.length > 20 ? `${item.nameEn.slice(0, 19)}…` : item.nameEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      ...fontOptions,
      headers: {
        "Cache-Control": isPersonalized
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
