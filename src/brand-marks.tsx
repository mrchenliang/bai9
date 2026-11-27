"use client";

import type { RegionalHouse } from "@/provinces";

export interface BrandMarkSpec {
  glyph: string;
  bg: string;
  fg: string;
  accent: string;
  shape: "seal" | "circle" | "diamond" | "star" | "octagon" | "porcelain";
}

/** Curated heritage emblem specs modeled on each house's recognizable bottle & box identity */
const BRAND_SPECS: Record<string, BrandMarkSpec> = {
  // Archived national & regional icons
  moutai: { glyph: "茅", bg: "#b91c1c", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  wuliangye: { glyph: "五", bg: "#991b1b", fg: "#fde68a", accent: "#eab308", shape: "circle" },
  luzhou: { glyph: "泸", bg: "#881337", fg: "#fef3c7", accent: "#d97706", shape: "seal" },
  fenjiu: { glyph: "汾", bg: "#1e3a8a", fg: "#ffffff", accent: "#93c5fd", shape: "porcelain" },
  jiannanchun: { glyph: "剑", bg: "#c81e1e", fg: "#ffffff", accent: "#fbbf24", shape: "diamond" },
  langjiu: { glyph: "郎", bg: "#b91c1c", fg: "#fde047", accent: "#f59e0b", shape: "circle" },
  yanghe: { glyph: "洋", bg: "#1d4ed8", fg: "#f0f9ff", accent: "#60a5fa", shape: "porcelain" },
  gujing: { glyph: "古", bg: "#18181b", fg: "#fbbf24", accent: "#d97706", shape: "seal" },
  xifeng: { glyph: "凤", bg: "#15803d", fg: "#fef9c3", accent: "#f59e0b", shape: "circle" },
  xijiu: { glyph: "习", bg: "#1f6f5b", fg: "#fef3c7", accent: "#eab308", shape: "porcelain" },
  jiugui: { glyph: "鬼", bg: "#b91c1c", fg: "#fde68a", accent: "#f59e0b", shape: "diamond" },
  hongxing: { glyph: "星", bg: "#dc2626", fg: "#ffffff", accent: "#fde047", shape: "star" },
  niulanshan: { glyph: "牛", bg: "#1e40af", fg: "#ffffff", accent: "#ef4444", shape: "seal" },
  shede: { glyph: "舍", bg: "#27272a", fg: "#f59e0b", accent: "#d97706", shape: "circle" },
  swellfun: { glyph: "井", bg: "#7c2d12", fg: "#fef3c7", accent: "#f59e0b", shape: "octagon" },
  jinshiyuan: { glyph: "缘", bg: "#be123c", fg: "#fef3c7", accent: "#fbbf24", shape: "circle" },
  kouzi: { glyph: "口", bg: "#92400e", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  dongjiu: { glyph: "董", bg: "#166534", fg: "#fef2f2", accent: "#dc2626", shape: "octagon" },
  baiyunbian: { glyph: "云", bg: "#b45309", fg: "#fffbeb", accent: "#fde68a", shape: "circle" },
  hengshui: { glyph: "干", bg: "#1f2937", fg: "#ffffff", accent: "#ef4444", shape: "seal" },
  yukbing: { glyph: "玉", bg: "#0f766e", fg: "#f0fdfa", accent: "#99f6e4", shape: "porcelain" },
  sanhua: { glyph: "花", bg: "#047857", fg: "#fef9c3", accent: "#6ee7b7", shape: "circle" },
  site: { glyph: "特", bg: "#991b1b", fg: "#fef08a", accent: "#f59e0b", shape: "diamond" },
  jingzhi: { glyph: "芝", bg: "#78350f", fg: "#fde68a", accent: "#d97706", shape: "seal" },
  jiangxiaobai: { glyph: "白", bg: "#2563eb", fg: "#ffffff", accent: "#93c5fd", shape: "seal" },
  yilite: { glyph: "伊", bg: "#1e3a8a", fg: "#fde68a", accent: "#f59e0b", shape: "octagon" },
  guotai: { glyph: "国", bg: "#991b1b", fg: "#fef3c7", accent: "#fbbf24", shape: "seal" },
  zhenjiu: { glyph: "珍", bg: "#1c1917", fg: "#fcd34d", accent: "#d97706", shape: "circle" },
  wuling: { glyph: "武", bg: "#7f1d1d", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  baofeng: { glyph: "宝", bg: "#1e40af", fg: "#f8fafc", accent: "#93c5fd", shape: "circle" },
  songhe: { glyph: "宋", bg: "#9a3412", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  huanghelou: { glyph: "楼", bg: "#b45309", fg: "#ffffff", accent: "#fde047", shape: "octagon" },
  quanxing: { glyph: "全", bg: "#991b1b", fg: "#ffffff", accent: "#fbbf24", shape: "seal" },
  shuanggou: { glyph: "双", bg: "#1d4ed8", fg: "#ffffff", accent: "#93c5fd", shape: "circle" },
  yingjia: { glyph: "迎", bg: "#065f46", fg: "#fef3c7", accent: "#fbbf24", shape: "porcelain" },

  // Signature local champions (non-archived regional houses)
  "仰韶": { glyph: "陶", bg: "#9a3412", fg: "#ffedd5", accent: "#fb923c", shape: "circle" },
  "杜康": { glyph: "杜", bg: "#78350f", fg: "#fef3c7", accent: "#d97706", shape: "seal" },
  "泰山": { glyph: "泰", bg: "#1e293b", fg: "#fde68a", accent: "#eab308", shape: "octagon" },
  "孔府家": { glyph: "孔", bg: "#7c2d12", fg: "#fef3c7", accent: "#d97706", shape: "seal" },
  "金门高粱酒": { glyph: "金", bg: "#dc2626", fg: "#fef08a", accent: "#fbbf24", shape: "circle" },
  "八八坑道高粱酒": { glyph: "坑", bg: "#1e3a8a", fg: "#fef3c7", accent: "#93c5fd", shape: "seal" },
  "河套王": { glyph: "河", bg: "#92400e", fg: "#fef3c7", accent: "#f59e0b", shape: "circle" },
  "北大仓": { glyph: "仓", bg: "#991b1b", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  "老村长": { glyph: "村", bg: "#b91c1c", fg: "#ffffff", accent: "#fde047", shape: "diamond" },
  "榆树钱": { glyph: "榆", bg: "#854d0e", fg: "#fef9c3", accent: "#facc15", shape: "circle" },
  "老龙口": { glyph: "龙", bg: "#991b1b", fg: "#fde68a", accent: "#f59e0b", shape: "octagon" },
  "金徽": { glyph: "徽", bg: "#7c2d12", fg: "#fef3c7", accent: "#eab308", shape: "seal" },
  "天佑德青稞酒": { glyph: "青", bg: "#0369a1", fg: "#f0f9ff", accent: "#7dd3fc", shape: "porcelain" },
  "玉林泉酒": { glyph: "泉", bg: "#0f766e", fg: "#f0fdfa", accent: "#5eead4", shape: "circle" },
  "福矛酒": { glyph: "福", bg: "#b91c1c", fg: "#fef08a", accent: "#fbbf24", shape: "diamond" },
  "芦台春": { glyph: "芦", bg: "#881337", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  "丹泉酒": { glyph: "丹", bg: "#991b1b", fg: "#fef3c7", accent: "#f59e0b", shape: "circle" },
  "九江双蒸酒": { glyph: "江", bg: "#0f766e", fg: "#fef9c3", accent: "#5eead4", shape: "seal" },
  "李渡酒": { glyph: "渡", bg: "#78350f", fg: "#fef3c7", accent: "#d97706", shape: "octagon" },
};

const AROMA_FALLBACK_STYLE: Record<
  RegionalHouse["aromaGroup"],
  Omit<BrandMarkSpec, "glyph">
> = {
  jiang: { bg: "#991b1b", fg: "#fef3c7", accent: "#f59e0b", shape: "seal" },
  nong: { bg: "#9a3412", fg: "#fff7ed", accent: "#fb923c", shape: "circle" },
  qing: { bg: "#1e40af", fg: "#f8fafc", accent: "#93c5fd", shape: "porcelain" },
  jian: { bg: "#854d0e", fg: "#fefce8", accent: "#facc15", shape: "octagon" },
  feng: { bg: "#166534", fg: "#fef9c3", accent: "#fbbf24", shape: "circle" },
  mi: { bg: "#047857", fg: "#ecfdf5", accent: "#6ee7b7", shape: "circle" },
  chi: { bg: "#0f766e", fg: "#f0fdfa", accent: "#5eead4", shape: "porcelain" },
  other: { bg: "#27272a", fg: "#fef3c7", accent: "#d97706", shape: "diamond" },
};

export function brandMarkSpecFor(house: Pick<RegionalHouse, "brandId" | "nameZh" | "aromaGroup">): BrandMarkSpec {
  if (house.brandId && BRAND_SPECS[house.brandId]) {
    return BRAND_SPECS[house.brandId];
  }
  if (BRAND_SPECS[house.nameZh]) {
    return BRAND_SPECS[house.nameZh];
  }
  const fallback = AROMA_FALLBACK_STYLE[house.aromaGroup];
  return {
    ...fallback,
    glyph: house.nameZh.slice(0, 1),
  };
}

export function BrandMark({
  house,
  size = 34,
  className,
}: {
  house: Pick<RegionalHouse, "brandId" | "nameZh" | "nameEn" | "aromaGroup">;
  size?: number;
  className?: string;
}) {
  const spec = brandMarkSpecFor(house);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      className={className ? `brand-mark ${className}` : "brand-mark"}
      role="img"
      aria-label={`${house.nameEn} emblem`}
    >
      {spec.shape === "circle" ? (
        <>
          <circle cx="18" cy="18" r="16.5" fill={spec.bg} />
          <circle cx="18" cy="18" r="13.5" fill="none" stroke={spec.accent} strokeWidth="1.1" opacity="0.82" />
        </>
      ) : spec.shape === "porcelain" ? (
        <>
          <rect x="2" y="2" width="32" height="32" rx="10" fill={spec.bg} />
          <rect
            x="4.5"
            y="4.5"
            width="27"
            height="27"
            rx="7.5"
            fill="none"
            stroke={spec.accent}
            strokeWidth="1.1"
            strokeDasharray="2.5 1.5"
            opacity="0.85"
          />
        </>
      ) : spec.shape === "diamond" ? (
        <>
          <rect x="2" y="2" width="32" height="32" rx="7" fill={spec.bg} />
          <polygon
            points="18,4.5 31.5,18 18,31.5 4.5,18"
            fill="none"
            stroke={spec.accent}
            strokeWidth="1.2"
            opacity="0.9"
          />
        </>
      ) : spec.shape === "octagon" ? (
        <>
          <polygon
            points="11,2.5 25,2.5 33.5,11 33.5,25 25,33.5 11,33.5 2.5,25 2.5,11"
            fill={spec.bg}
          />
          <polygon
            points="12,5 24,5 31,12 31,24 24,31 12,31 5,24 5,12"
            fill="none"
            stroke={spec.accent}
            strokeWidth="1"
            opacity="0.82"
          />
        </>
      ) : spec.shape === "star" ? (
        <>
          <rect x="2" y="2" width="32" height="32" rx="7" fill={spec.bg} />
          <polygon
            points="18,6 20.9,13.6 29,14.1 22.7,19.2 24.8,27 18,22.5 11.2,27 13.3,19.2 7,14.1 15.1,13.6"
            fill={spec.accent}
            opacity="0.28"
          />
        </>
      ) : (
        <>
          <rect x="2" y="2" width="32" height="32" rx="6" fill={spec.bg} />
          <rect
            x="4.8"
            y="4.8"
            width="26.4"
            height="26.4"
            rx="3.6"
            fill="none"
            stroke={spec.accent}
            strokeWidth="1.15"
            opacity="0.82"
          />
        </>
      )}
      <text
        x="18"
        y="19"
        textAnchor="middle"
        dominantBaseline="central"
        fill={spec.fg}
        fontFamily='"Noto Serif SC", "Songti SC", Georgia, serif'
        fontWeight="700"
        fontSize="16.5"
      >
        {spec.glyph}
      </text>
    </svg>
  );
}
