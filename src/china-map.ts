import chinaMapRaw from "@svg-maps/china";

export interface ChinaMapProvince {
  svgId: string;
  atlasId: string | null;
  name: string;
  path: string;
}

export interface ProvincePinCoords {
  /** Geographic interior dot coordinate inside the province polygon */
  x: number;
  y: number;
  /** Optional offset for the brand logo pill when neighboring provinces are tight */
  dx?: number;
  dy?: number;
  /** Show brand logo chip at default zoom (true for all 27 atlas provinces, priority controls clutter) */
  tier: "major" | "regional";
}

const SVG_TO_ATLAS_ID: Record<string, string> = {
  anhui: "anhui",
  beijing: "beijing",
  chongqing: "chongqing",
  fujian: "fujian",
  gansu: "gansu",
  guangdong: "guangdong",
  "guangxi-zhuang": "guangxi",
  guizhou: "guizhou",
  hebei: "hebei",
  heilongjiang: "heilongjiang",
  henan: "henan",
  hubei: "hubei",
  hunan: "hunan",
  jiangsu: "jiangsu",
  jiangxi: "jiangxi",
  jilin: "jilin",
  liaoning: "liaoning",
  "nei-mongol": "neimenggu",
  quinghai: "qinghai",
  shaanxi: "shaanxi",
  shandong: "shandong",
  shanxi: "shanxi",
  sichuan: "sichuan",
  tianjin: "tianjin",
  "xinjiang-uygur": "xinjiang",
  yunnan: "yunnan",
  taiwan: "taiwan",
};

/** Hand-tuned interior coordinates on the 774x569 viewBox so brand pins sit cleanly with minimal overlap */
export const PROVINCE_PINS: Record<string, ProvincePinCoords> = {
  sichuan: { x: 372, y: 398, tier: "major" },
  guizhou: { x: 422, y: 448, tier: "major" },
  chongqing: { x: 434, y: 404, dx: 0, dy: -4, tier: "regional" },
  yunnan: { x: 356, y: 478, tier: "regional" },
  henan: { x: 508, y: 344, tier: "major" },
  hunan: { x: 482, y: 444, tier: "major" },
  hubei: { x: 486, y: 392, tier: "major" },
  shandong: { x: 572, y: 312, dx: 8, dy: -2, tier: "major" },
  anhui: { x: 548, y: 379, dx: -6, dy: 4, tier: "major" },
  jiangsu: { x: 582, y: 356, dx: 18, dy: -4, tier: "major" },
  jiangxi: { x: 536, y: 442, tier: "major" },
  fujian: { x: 568, y: 468, tier: "regional" },
  taiwan: { x: 614, y: 492, dx: 18, dy: 4, tier: "major" },
  shanxi: { x: 490, y: 292, dx: -6, dy: 0, tier: "major" },
  hebei: { x: 526, y: 274, dx: -8, dy: 8, tier: "regional" },
  beijing: { x: 542, y: 245, dx: 8, dy: -16, tier: "major" },
  tianjin: { x: 554, y: 260, dx: 24, dy: 2, tier: "regional" },
  neimenggu: { x: 486, y: 204, tier: "major" },
  shaanxi: { x: 442, y: 332, tier: "major" },
  gansu: { x: 368, y: 306, tier: "regional" },
  qinghai: { x: 288, y: 326, tier: "regional" },
  xinjiang: { x: 146, y: 222, tier: "major" },
  heilongjiang: { x: 678, y: 108, tier: "major" },
  jilin: { x: 668, y: 188, tier: "regional" },
  liaoning: { x: 618, y: 232, tier: "regional" },
  guangdong: { x: 506, y: 504, dx: 6, dy: 4, tier: "major" },
  guangxi: { x: 442, y: 494, dx: -4, dy: 4, tier: "major" },
};

const TAIWAN_PATH =
  "M 610 470 C 615 468 620 473 621 481 C 622 490 618 503 612 513 C 609 516 606 513 605 508 C 603 498 604 484 607 474 C 608 471 609 470 610 470 Z";

interface RawLocation {
  id: string;
  name: string;
  path: string;
}

interface RawMap {
  viewBox: string;
  locations: RawLocation[];
}

const rawMap = (chinaMapRaw as unknown as { default?: RawMap }).default ?? (chinaMapRaw as unknown as RawMap);

export const CHINA_VIEWBOX = rawMap.viewBox || "0 0 774 569";

export const chinaMapProvinces: ChinaMapProvince[] = [
  ...rawMap.locations.map((loc) => ({
    svgId: loc.id,
    atlasId: SVG_TO_ATLAS_ID[loc.id] ?? null,
    name: loc.name.trim(),
    path: loc.path,
  })),
  {
    svgId: "taiwan",
    atlasId: "taiwan",
    name: "Taiwan",
    path: TAIWAN_PATH,
  },
];
