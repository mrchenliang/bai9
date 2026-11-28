import { readFile } from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const GOOGLE_FONT_UA =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400;
  style: "normal";
};

// Satori's font engine can reuse cached glyph outlines across 400/600/700 weights
// under the same family name, so each weight is registered as its own family.
const DM_FONT_SPECS = [
  { weight: 400, name: "DMRegular" },
  { weight: 600, name: "DMSemiBold" },
  { weight: 700, name: "DMBold" },
] as const;

let dmFontsPromise: Promise<OgFont[]> | null = null;
const cjkFontCache = new Map<string, Promise<OgFont | null>>();

async function fetchGoogleFont(url: string, name: string): Promise<OgFont | null> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const css = await fetch(url, {
        headers: { "User-Agent": GOOGLE_FONT_UA },
        signal: AbortSignal.timeout(8000),
      }).then((res) => (res.ok ? res.text() : ""));
      const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
      if (!match) continue;
      const res = await fetch(match[1], { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      return {
        name,
        data: await res.arrayBuffer(),
        weight: 400,
        style: "normal",
      };
    } catch {
      // Retry once if parallel static generation causes a transient fetch timeout
    }
  }
  return null;
}

function loadDmFonts(): Promise<OgFont[]> {
  if (!dmFontsPromise) {
    dmFontsPromise = Promise.all(
      DM_FONT_SPECS.map((spec) =>
        fetchGoogleFont(
          `https://fonts.googleapis.com/css2?family=DM+Sans:wght@${spec.weight}&display=swap`,
          spec.name,
        ),
      ),
    ).then((items) => items.filter((item): item is OgFont => item !== null));
  }
  return dmFontsPromise;
}

function loadSubsetCjkFont(rawText: string): Promise<OgFont | null> {
  const uniqueChars = Array.from(new Set([...rawText].filter((ch) => /[^\x00-\x7F]/.test(ch))))
    .sort()
    .join("");
  if (!uniqueChars) return Promise.resolve(null);

  let pending = cjkFontCache.get(uniqueChars);
  if (!pending) {
    pending = fetchGoogleFont(
      `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@700&text=${encodeURIComponent(uniqueChars)}`,
      "NotoSerifSC",
    );
    cjkFontCache.set(uniqueChars, pending);
  }
  return pending;
}

export interface LoadedOgTypography {
  fonts: OgFont[];
  fontOptions: { fonts?: OgFont[] };
  fontRegular: string;
  fontSemiBold: string;
  fontBold: string;
  fontCjk: string;
}

export async function loadMuseumOgFonts(cjkText = ""): Promise<LoadedOgTypography> {
  const [dm, cjk] = await Promise.all([loadDmFonts(), loadSubsetCjkFont(cjkText)]);
  const hasDm = dm.length === DM_FONT_SPECS.length;
  const fonts: OgFont[] = [...(hasDm ? dm : []), ...(cjk ? [cjk] : [])];
  const fontRegular = hasDm ? "DMRegular" : "sans-serif";
  const fontSemiBold = hasDm ? "DMSemiBold" : "sans-serif";
  const fontBold = hasDm ? "DMBold" : "sans-serif";
  const fontCjk = cjk ? "NotoSerifSC" : fontBold;

  return {
    fonts,
    fontOptions: fonts.length > 0 ? { fonts: fonts.map((f) => ({ ...f })) } : {},
    fontRegular,
    fontSemiBold,
    fontBold,
    fontCjk,
  };
}

export async function readPublicImageDataUri(imagePath?: string): Promise<string | null> {
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

export function MuseumSealSvg({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <rect width="32" height="32" rx="6" ry="6" fill="#c81e1e" />
      <path
        d="M304 -766L808 -766L868 -848Q868 -848 879.5 -838.5Q891 -829 908 -815Q925 -801 943.5 -784.5Q962 -768 978 -753Q974 -737 951 -737L312 -737ZM401 -203L864 -203L864 -175L401 -175ZM401 -34L864 -34L864 -6L401 -6ZM650 -766L741 -766Q741 -756 741 -748Q741 -740 741 -733L741 -409Q741 -400 744 -396.5Q747 -393 757 -393L783 -393Q791 -393 798.5 -393Q806 -393 810 -393Q814 -393 819 -393Q824 -393 827 -394Q832 -395 838.5 -396Q845 -397 848 -398L858 -398L862 -396Q880 -389 887.5 -379.5Q895 -370 895 -356Q895 -327 867.5 -314Q840 -301 772 -301L727 -301Q693 -301 676.5 -308.5Q660 -316 655 -334Q650 -352 650 -381ZM502 -766L595 -766L595 -540Q595 -500 591 -459Q587 -418 572 -379.5Q557 -341 526.5 -307Q496 -273 442 -245L432 -255Q466 -293 480.5 -338.5Q495 -384 498.5 -435Q502 -486 502 -539ZM341 -594L341 -639L456 -594L810 -594L864 -657L965 -576Q960 -570 950.5 -564.5Q941 -559 923 -556L923 52Q923 57 898 69.5Q873 82 833 82L815 82L815 -566L444 -566L444 59Q444 65 421.5 76.5Q399 88 359 88L341 88ZM106 -836Q174 -831 214.5 -813Q255 -795 272.5 -771.5Q290 -748 290 -725Q290 -702 276.5 -686Q263 -670 240.5 -666.5Q218 -663 191 -680Q185 -707 169.5 -734.5Q154 -762 135 -787Q116 -812 98 -830ZM32 -614Q96 -605 133.5 -586Q171 -567 185.5 -544Q200 -521 198.5 -499.5Q197 -478 182 -463Q167 -448 145.5 -446.5Q124 -445 99 -463Q96 -489 84.5 -515.5Q73 -542 57 -566Q41 -590 24 -607ZM90 -214Q101 -214 106 -216.5Q111 -219 120 -235Q126 -247 131.5 -257.5Q137 -268 147 -291Q157 -314 176.5 -359Q196 -404 229.5 -483.5Q263 -563 315 -686L331 -682Q320 -645 306.5 -597Q293 -549 279 -499.5Q265 -450 252 -404Q239 -358 229.5 -323Q220 -288 217 -271Q211 -246 207 -220.5Q203 -195 203 -176Q204 -155 210 -137Q216 -119 224.5 -99Q233 -79 238.5 -54Q244 -29 243 5Q242 42 219 65Q196 88 160 88Q143 88 127.5 76.5Q112 65 107 36Q116 -16 117.5 -62Q119 -108 114 -139.5Q109 -171 97 -179Q87 -187 74.5 -190.5Q62 -194 46 -195L46 -214Q46 -214 54.5 -214Q63 -214 74 -214Q85 -214 90 -214Z"
        fill="#ffffff"
        transform="translate(4.57 24.67) scale(0.02281)"
      />
    </svg>
  );
}

export interface BrandCrest {
  glyph: string;
  bg: string;
  fg: string;
  accent: string;
}

const SERVER_BRAND_CRESTS: Record<string, BrandCrest> = {
  moutai: { glyph: "茅", bg: "#b91c1c", fg: "#fef3c7", accent: "#f59e0b" },
  wuliangye: { glyph: "五", bg: "#991b1b", fg: "#fde68a", accent: "#eab308" },
  luzhou: { glyph: "泸", bg: "#881337", fg: "#fef3c7", accent: "#d97706" },
  fenjiu: { glyph: "汾", bg: "#1e3a8a", fg: "#ffffff", accent: "#93c5fd" },
  jiannanchun: { glyph: "剑", bg: "#c81e1e", fg: "#ffffff", accent: "#fbbf24" },
  langjiu: { glyph: "郎", bg: "#b91c1c", fg: "#fde047", accent: "#f59e0b" },
  yanghe: { glyph: "洋", bg: "#1d4ed8", fg: "#f0f9ff", accent: "#60a5fa" },
  gujing: { glyph: "古", bg: "#18181b", fg: "#fbbf24", accent: "#d97706" },
  xifeng: { glyph: "凤", bg: "#15803d", fg: "#fef9c3", accent: "#f59e0b" },
  xijiu: { glyph: "习", bg: "#1f6f5b", fg: "#fef3c7", accent: "#eab308" },
  jiugui: { glyph: "鬼", bg: "#b91c1c", fg: "#fde68a", accent: "#f59e0b" },
  hongxing: { glyph: "星", bg: "#dc2626", fg: "#ffffff", accent: "#fde047" },
  niulanshan: { glyph: "牛", bg: "#1e40af", fg: "#ffffff", accent: "#ef4444" },
  shede: { glyph: "舍", bg: "#27272a", fg: "#f59e0b", accent: "#d97706" },
  swellfun: { glyph: "井", bg: "#7c2d12", fg: "#fef3c7", accent: "#f59e0b" },
  jinshiyuan: { glyph: "缘", bg: "#be123c", fg: "#fef3c7", accent: "#fbbf24" },
  kouzi: { glyph: "口", bg: "#92400e", fg: "#fef3c7", accent: "#f59e0b" },
  dongjiu: { glyph: "董", bg: "#166534", fg: "#fef2f2", accent: "#dc2626" },
  baiyunbian: { glyph: "云", bg: "#b45309", fg: "#fffbeb", accent: "#fde68a" },
  hengshui: { glyph: "干", bg: "#1f2937", fg: "#ffffff", accent: "#ef4444" },
  yukbing: { glyph: "玉", bg: "#0f766e", fg: "#f0fdfa", accent: "#99f6e4" },
  sanhua: { glyph: "花", bg: "#047857", fg: "#fef9c3", accent: "#6ee7b7" },
  site: { glyph: "特", bg: "#991b1b", fg: "#fef08a", accent: "#f59e0b" },
  jingzhi: { glyph: "芝", bg: "#78350f", fg: "#fde68a", accent: "#d97706" },
  jiangxiaobai: { glyph: "白", bg: "#2563eb", fg: "#ffffff", accent: "#93c5fd" },
  yilite: { glyph: "伊", bg: "#1e3a8a", fg: "#fde68a", accent: "#f59e0b" },
  guotai: { glyph: "国", bg: "#991b1b", fg: "#fef3c7", accent: "#fbbf24" },
  zhenjiu: { glyph: "珍", bg: "#1c1917", fg: "#fcd34d", accent: "#d97706" },
  wuling: { glyph: "武", bg: "#7f1d1d", fg: "#fef3c7", accent: "#f59e0b" },
  baofeng: { glyph: "宝", bg: "#1e40af", fg: "#f8fafc", accent: "#93c5fd" },
  songhe: { glyph: "宋", bg: "#9a3412", fg: "#fef3c7", accent: "#f59e0b" },
  huanghelou: { glyph: "楼", bg: "#b45309", fg: "#ffffff", accent: "#fde047" },
  quanxing: { glyph: "全", bg: "#991b1b", fg: "#ffffff", accent: "#fbbf24" },
  shuanggou: { glyph: "双", bg: "#1d4ed8", fg: "#ffffff", accent: "#93c5fd" },
  yingjia: { glyph: "迎", bg: "#065f46", fg: "#fef3c7", accent: "#fbbf24" },
};

const AROMA_CREST_FALLBACK: Record<string, Omit<BrandCrest, "glyph">> = {
  jiang: { bg: "#991b1b", fg: "#fef3c7", accent: "#f59e0b" },
  nong: { bg: "#9a3412", fg: "#fff7ed", accent: "#fb923c" },
  qing: { bg: "#1e40af", fg: "#f8fafc", accent: "#93c5fd" },
  jian: { bg: "#854d0e", fg: "#fefce8", accent: "#facc15" },
  feng: { bg: "#166534", fg: "#fef9c3", accent: "#fbbf24" },
  mi: { bg: "#047857", fg: "#ecfdf5", accent: "#6ee7b7" },
  chi: { bg: "#0f766e", fg: "#f0fdfa", accent: "#5eead4" },
  dong: { bg: "#166534", fg: "#fef2f2", accent: "#dc2626" },
  zhima: { bg: "#78350f", fg: "#fde68a", accent: "#d97706" },
  te: { bg: "#991b1b", fg: "#fef08a", accent: "#f59e0b" },
  laobaigan: { bg: "#1f2937", fg: "#ffffff", accent: "#ef4444" },
  fuyu: { bg: "#b91c1c", fg: "#fde68a", accent: "#f59e0b" },
};

export function brandCrestFor(brandId: string, nameZh: string, aromaId?: string): BrandCrest {
  if (SERVER_BRAND_CRESTS[brandId]) return SERVER_BRAND_CRESTS[brandId];
  const fallback = (aromaId && AROMA_CREST_FALLBACK[aromaId]) || {
    bg: "#27272a",
    fg: "#fef3c7",
    accent: "#d97706",
  };
  return { ...fallback, glyph: nameZh.slice(0, 1) };
}
