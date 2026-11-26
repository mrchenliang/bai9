export interface BanquetPick {
  skuId: string;
  note: string;
}

export interface BanquetBand {
  id: string;
  range: string;
  titleEn: string;
  titleZh: string;
  occasion: string;
  picks: BanquetPick[];
}

export const banquetBands: BanquetBand[] = [
  {
    id: "100-300",
    range: "¥100–300",
    titleEn: "Family Dinners & Everyday Hosting",
    titleZh: "家宴聚会 · 100–300元左右",
    occasion:
      "Honest, recognizable bottles from major houses for multi-table family feasts, casual hosting, and value-minded graduation dinners.",
    picks: [
      { skuId: "moutai-yingbin", note: "Entry Moutai sauce aroma" },
      { skuId: "prince", note: "Golden Prince · everyday sauce benchmark" },
      { skuId: "haizhilan", note: "Yanghe’s crowd-pleasing soft strong" },
      { skuId: "xifeng-6", note: "Festive red-gold box · Shaanxi staple" },
      { skuId: "laobaifen", note: "Classic brown-jar northern light aroma" },
      { skuId: "gujing-1989", note: "Retro-label Anhui strong aroma" },
      { skuId: "gu8", note: "Mid-entry Year Puree banquet bottle" },
      { skuId: "tequ", note: "Five-time medalist strong aroma" },
      { skuId: "wuliangchun", note: "Wuliangye’s core multi-grain line" },
    ],
  },
  {
    id: "300-500",
    range: "¥300–500",
    titleEn: "Graduation & Celebration Banquets",
    titleZh: "升学宴·喜宴中坚 · 300–500元左右",
    occasion:
      "The sweet spot of Chinese celebration tables (升学宴, 婚宴): iconic red, blue, or gold presentation with unmistakable national-brand credibility.",
    picks: [
      { skuId: "crystal", note: "China’s perennial wedding & graduation king" },
      { skuId: "qinghua-20", note: "Blue-and-white porcelain light flagship" },
      { skuId: "jiugui-hongtan", note: "Vermilion tied-sack fuyu aroma" },
      { skuId: "jiaoling-60", note: "60-year mud-pit strong aroma in gold" },
      { skuId: "guotai-guobiao", note: "Vintage-dated Maotai-town sauce aroma" },
      { skuId: "zhihui-shede", note: "8-year aged Sichuan cellar blend" },
      { skuId: "tianzhilan", note: "Middle tier of Yanghe’s Blue Classic" },
      { skuId: "gu16", note: "East China red-and-black banquet favorite" },
    ],
  },
  {
    id: "500-800",
    range: "¥500–800",
    titleEn: "Senior Tables & Formal Gifting",
    titleZh: "商务宴请·送礼 · 500–800元左右",
    occasion:
      "Stepped-up aged blends reserved for mentors, elders, and formal gift boxes — where crimson ceramics and deep blue glass signal real weight.",
    picks: [
      { skuId: "honghualang", note: "15-year crimson porcelain sauce aroma" },
      { skuId: "zhen-15", note: "Zunyi aged sauce classic" },
      { skuId: "pinwei", note: "Shede’s signature aged strong blend" },
      { skuId: "laimao-blue", note: "Moutai subsidiary’s gifting staple" },
      { skuId: "xijiu-1988", note: "Chishui River’s benchmark banquet sauce" },
      { skuId: "mengzhilan-m6", note: "High-table Jiangsu soft strong" },
    ],
  },
  {
    id: "1000-plus",
    range: "¥1,000+",
    titleEn: "Head-Table Flagships",
    titleZh: "千元压轴名酒 · 千元左右",
    occasion:
      "The unmistakable top shelf of a Chinese banquet hall: bottles whose names alone close the conversation.",
    picks: [
      { skuId: "feitian", note: "53% Flying Fairy · the state standard" },
      { skuId: "puwu", note: "Eighth-generation five-grain flagship" },
      { skuId: "guojiao", note: "National Cellar 1573 · Ming-era pits" },
      { skuId: "qinghualang", note: "Langjiu’s pinnacle cave-aged sauce" },
      { skuId: "neican", note: "Jiugui’s top-tier fuyu collectible" },
      { skuId: "junpin", note: "Xijiu’s prestige celadon bottle" },
    ],
  },
];

export const banquetRules = [
  {
    titleEn: "Red & Gold for Joy",
    titleZh: "红金喜庆",
    body: "Weddings (婚宴) and university graduation banquets (升学宴) favor red, vermilion, and gold boxes — Crystal Jiannanchun (水晶剑), Honghualang (红花郎), Jiugui Red Altar (酒鬼红坛), and Guotai Guobiao (国台国标).",
  },
  {
    titleEn: "The Regional Anchor",
    titleZh: "地域主场",
    body: "Hosts almost always pick a bottle elders recognize locally: Fenjiu in Shanxi, Xifeng in Shaanxi, Gujing in Anhui, Yanghe in Jiangsu, and Wuliangye or Jiannanchun in Sichuan.",
  },
  {
    titleEn: "52%–53% Vol & 500 ml",
    titleZh: "高度正装",
    body: "Formal Chinese tables still default to high-proof 500 ml bottles (52% for strong aroma, 53% for sauce and light), even as lower-proof 40.8%–42% options grow for casual dinners.",
  },
];
