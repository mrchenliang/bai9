export interface SheetSpot {
  skuId: string;
  label: string;
  yuan: number;
}

export const sheetNote =
  "The yuan figures are the ones printed on this price-band sheet. They are round guide numbers. They are not the 23 November 2026 Sina street averages kept on each bottle.";

export const sheetNoteZh =
  "这些元数是这张价格带上印的整数。不是每瓶酒上留着的2026年11月23日新浪街价。";

export const priceSheet: SheetSpot[][] = [
  [
    { skuId: "feitian", label: "茅台飞天", yuan: 2500 },
    { skuId: "zodiac", label: "茅台生肖酒", yuan: 2700 },
  ],
  [
    { skuId: "puwu", label: "五粮液普五", yuan: 950 },
    { skuId: "guojiao", label: "国窖1573", yuan: 930 },
    { skuId: "qinghua-30", label: "汾酒青花30", yuan: 850 },
    { skuId: "mengzhilan-m9", label: "梦之蓝M9", yuan: 1400 },
    { skuId: "qinghualang", label: "青花郎", yuan: 1000 },
  ],
  [
    { skuId: "junpin", label: "君品", yuan: 850 },
    { skuId: "moutai-1935", label: "茅台1935", yuan: 850 },
    { skuId: "dongfanghong", label: "剑南春东方红", yuan: 1300 },
    { skuId: "hongxifeng", label: "红西凤", yuan: 900 },
    { skuId: "neican", label: "酒鬼内参", yuan: 1400 },
  ],
  [
    { skuId: "crystal", label: "水晶剑", yuan: 450 },
    { skuId: "qinghua-20", label: "汾酒青花20", yuan: 400 },
    { skuId: "xijiu-1988", label: "窖藏1988", yuan: 520 },
    { skuId: "honghualang", label: "红花郎", yuan: 550 },
    { skuId: "gu20", label: "古20", yuan: 650 },
    { skuId: "mengzhilan-m6", label: "梦6+", yuan: 650 },
  ],
  [
    { skuId: "pinwei", label: "舍得品味", yuan: 400 },
    { skuId: "swellfun-no8", label: "水井坊八号", yuan: 360 },
    { skuId: "jiugui-sack", label: "酒鬼酒", yuan: 210 },
    { skuId: "tequ", label: "泸州老窖特曲", yuan: 290 },
    { skuId: "gu8", label: "古井贡古8", yuan: 280 },
    { skuId: "wuliangchun", label: "五粮春", yuan: 260 },
  ],
  [
    { skuId: "touqu", label: "泸州老窖头曲", yuan: 80 },
    { skuId: "xifeng-green", label: "西凤绿瓶", yuan: 50 },
    { skuId: "huanggai", label: "黄盖汾", yuan: 50 },
    { skuId: "rubogong", label: "乳玻贡", yuan: 50 },
    { skuId: "jianzhuang", label: "尖庄", yuan: 40 },
    { skuId: "shunpin", label: "郎酒顺品郎", yuan: 40 },
  ],
];

const aromaMark: Record<string, string> = {
  jiang: "酱",
  nong: "浓",
  qing: "清",
  mi: "米",
  feng: "凤",
  jian: "兼",
  dong: "董",
  zhima: "芝",
  chi: "豉",
  te: "特",
  laobaigan: "白",
  fuyu: "馥郁",
  prepared: "配",
};

export function aromaChip(id: string | undefined): string {
  if (!id) return "";
  return aromaMark[id] ?? "";
}

export function sheetSpot(skuId: string): SheetSpot | undefined {
  for (const band of priceSheet) {
    const spot = band.find((item) => item.skuId === skuId);
    if (spot) return spot;
  }
  return undefined;
}
