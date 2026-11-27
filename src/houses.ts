export type HouseChapterId = "powers" | "benchmarks" | "regional" | "everyday";

export interface HouseRule {
  titleEn: string;
  titleZh: string;
  body: string;
}

export interface HouseChapter {
  id: HouseChapterId;
  numeral: string;
  titleEn: string;
  titleZh: string;
  summary: string;
}

export interface HouseProfile {
  chapter: HouseChapterId;
  takeaway: string;
  badge?: string;
}

export const houseRules: HouseRule[] = [
  {
    titleEn: "Two basins, most of the prestige",
    titleZh: "赤水与川南",
    body: "The Chishui River (Moutai, Langjiu, Xijiu) and the Sichuan basin (Wuliangye, Luzhou, Jiannanchun) produce the majority of China’s top-tier banquet bottles.",
  },
  {
    titleEn: "One house = one aroma",
    titleZh: "一厂一香",
    body: "Outside Strong, Sauce, and Light, most of China’s twelve official aroma standards exist because a single historic distillery invented and defined them.",
  },
  {
    titleEn: "Prestige houses pour at ¥50 too",
    titleZh: "大厂口粮",
    body: "Fenjiu, Wuliangye, Luzhou, and Gujing all bottle everyday grain alongside their flagships — while Beijing’s Erguotou houses own the kitchen table outright.",
  },
];

export const houseChapters: HouseChapter[] = [
  {
    id: "powers",
    numeral: "I",
    titleEn: "National Table Powers",
    titleZh: "全国主力名酒",
    summary: "The ten houses that set China’s national price board and actually settle formal banquets today.",
  },
  {
    id: "benchmarks",
    numeral: "II",
    titleEn: "The Style Makers",
    titleZh: "香型标准酒厂",
    summary: "Single-house aroma benchmarks — each distillery defines its own official Chinese aroma standard.",
  },
  {
    id: "regional",
    numeral: "III",
    titleEn: "Regional Kings & Heritage Houses",
    titleZh: "区域名酒与老牌劲旅",
    summary: "Historic national gold winners and modern regional powerhouses worth knowing beyond the head table.",
  },
  {
    id: "everyday",
    numeral: "IV",
    titleEn: "Everyday & Street Houses",
    titleZh: "日常口粮与市井酒",
    summary: "Zero banquet theater, maximum volume — Erguotou and the daily grain staples China finishes at home.",
  },
];

export const houseProfiles: Record<string, HouseProfile> = {
  // I. National Table Powers
  moutai: {
    chapter: "powers",
    takeaway: "Benchmark of sauce aroma; Chishui River’s undisputed table currency.",
    badge: "5× Gold · Apex",
  },
  wuliangye: {
    chapter: "powers",
    takeaway: "Five-grain strong-aroma apex — and the default formal alternative to Moutai.",
    badge: "4× Gold · Apex",
  },
  luzhou: {
    chapter: "powers",
    takeaway: "Single-sorghum strong-aroma ancestor, spanning ¥28 Erqu to ¥855 National Cellar 1573.",
    badge: "5× Gold · Apex",
  },
  fenjiu: {
    chapter: "powers",
    takeaway: "Light aroma’s 1952 original — equally respected in a ¥52 glass bottle or a ¥400 banquet.",
    badge: "5× Gold · Standard",
  },
  jiannanchun: {
    chapter: "powers",
    takeaway: "Sichuan’s ¥400 banquet benchmark; Crystal Jiannanchun rarely loses a wedding table.",
    badge: "3× Gold",
  },
  langjiu: {
    chapter: "powers",
    takeaway: "Downstream from Moutai on the Chishui; cave-aged sauce aroma with a brisker, sweeter edge.",
    badge: "2× Gold",
  },
  yanghe: {
    chapter: "powers",
    takeaway: "Jiangsu’s ‘soft strong aroma’ giant; owns East China business tables with Dream Blue.",
    badge: "3× Gold",
  },
  gujing: {
    chapter: "powers",
    takeaway: "Anhui’s four-time gold house; powers the Yangtze valley from ¥40 daily bottles to Gu 20.",
    badge: "4× Gold",
  },
  xijiu: {
    chapter: "powers",
    takeaway: "No 1980s national medal, yet Chishui’s quiet #2 sauce-aroma force on modern tables.",
    badge: "Modern Force",
  },
  jinshiyuan: {
    chapter: "powers",
    takeaway: "Jiangsu’s banquet challenger — Guoyuan Sikou is a fixture at weddings and business lunches.",
    badge: "Modern Force",
  },

  // II. The Style Makers
  xifeng: {
    chapter: "benchmarks",
    takeaway: "Shaanxi’s 1952 original and the only reference that matters for Feng aroma.",
    badge: "4× Gold · Standard",
  },
  dongjiu: {
    chapter: "benchmarks",
    takeaway: "Zunyi’s herbal-qu icon — medicinal, polarizing, and the sole benchmark of Dong aroma.",
    badge: "4× Gold · Standard",
  },
  jiugui: {
    chapter: "benchmarks",
    takeaway: "Xiangxi’s sack-bottle original designed by Huang Yongyu; defines Layered (Fuyu) aroma.",
    badge: "Aroma Standard",
  },
  site: {
    chapter: "benchmarks",
    takeaway: "Whole-grain rice fermented with flour qu in Jiangxi — the house that defines Te aroma.",
    badge: "Aroma Standard",
  },
  kouzi: {
    chapter: "benchmarks",
    takeaway: "Anhui’s northern Mixed-aroma reference, layering cellar fruit over subtle sauce roast.",
    badge: "Mixed Reference",
  },
  baiyunbian: {
    chapter: "benchmarks",
    takeaway: "Hubei’s southern Mixed-aroma benchmark; balances strong-aroma sweetness with toasted depth.",
    badge: "Aroma Standard",
  },
  hengshui: {
    chapter: "benchmarks",
    takeaway: "Hebei’s dry, razor-clean grain benchmark — famous for hitting 67% vol without sweetening.",
    badge: "Aroma Standard",
  },
  sanhua: {
    chapter: "benchmarks",
    takeaway: "Guangxi’s crisp, floral Rice-aroma standard — still under ¥30 for honest pure-grain craft.",
    badge: "Aroma Standard",
  },
  yukbing: {
    chapter: "benchmarks",
    takeaway: "Cantonese rice spirit rested with pork fat to round the spirit near 30% — the Chi-aroma standard.",
    badge: "Aroma Standard",
  },
  jingzhi: {
    chapter: "benchmarks",
    takeaway: "Shandong’s Sesame-aroma pioneer — toasted-sesame notes built purely by high-heat fermentation.",
    badge: "Aroma Standard",
  },

  // III. Regional Kings & Heritage Houses
  shede: {
    chapter: "regional",
    takeaway: "Aged-reserve prestige face of Sichuan’s 1989 medalist Tuopai, anchored in older base spirits.",
    badge: "1989 Gold",
  },
  swellfun: {
    chapter: "regional",
    takeaway: "Built around a 1998 Chengdu distillery excavation; sleek design and wide overseas distribution.",
    badge: "Chengdu",
  },
  yingjia: {
    chapter: "regional",
    takeaway: "Anhui’s Dabie Mountain strong-aroma powerhouse; its cave-aged Dongcang line owns local tables.",
    badge: "Anhui Power",
  },
  zhenjiu: {
    chapter: "regional",
    takeaway: "Born in Zunyi from a 1975 state experiment to test if Moutai’s craft could travel outside Maotai town.",
    badge: "Zunyi Sauce",
  },
  guotai: {
    chapter: "regional",
    takeaway: "One of Maotai town’s largest modern private sauce-aroma houses; clean, structured Chishui profile.",
    badge: "Maotai Town",
  },
  wuling: {
    chapter: "regional",
    takeaway: "Hunan’s 1989 gold medalist — a rare, refined sauce-aroma house built far outside Guizhou.",
    badge: "1989 Gold",
  },
  quanxing: {
    chapter: "regional",
    takeaway: "Three-time national gold winner from Chengdu; classic Sichuan strong aroma without luxury markup.",
    badge: "3× Gold",
  },
  shuanggou: {
    chapter: "regional",
    takeaway: "Historic Jiangsu gold medalist (1984, 1989), now sister house to Yanghe with soft wetland strong aroma.",
    badge: "2× Gold",
  },
  huanghelou: {
    chapter: "regional",
    takeaway: "Wuhan’s two-time gold medalist bringing crisp northern-style light aroma to the middle Yangtze.",
    badge: "2× Gold",
  },
  baofeng: {
    chapter: "regional",
    takeaway: "Henan’s 1989 gold-medal light aroma — clean, dry, and one of China’s best under-¥100 heritage values.",
    badge: "1989 Gold",
  },
  songhe: {
    chapter: "regional",
    takeaway: "Henan’s 1989 medal-winning strong-aroma classic from Luyi; soft, sweet-grain central plains style.",
    badge: "1989 Gold",
  },
  mingriver: {
    chapter: "regional",
    takeaway: "Distilled at Luzhou Laojiao at 45% vol and 750 ml to bridge Sichuan strong aroma into Western bars.",
    badge: "Luzhou Craft",
  },

  // IV. Everyday & Street Houses
  hongxing: {
    chapter: "everyday",
    takeaway: "Beijing’s 1949 Erguotou original — the 56% green bottle is 100% pure-grain solid-state craft at ¥16.",
    badge: "Pure-Grain Daily",
  },
  niulanshan: {
    chapter: "everyday",
    takeaway: "China’s highest-volume mass-market house; honest ¥18 solid-liquid blend poured at every skewer stall.",
    badge: "Blended Daily",
  },
  jiangxiaobai: {
    chapter: "everyday",
    takeaway: "Chongqing’s 40% square-bottle light aroma — built to make baijiu lighter for younger tables and mixers.",
    badge: "Light 40%",
  },
  yilite: {
    chapter: "everyday",
    takeaway: "Xinjiang’s beloved daily strong aroma (‘Xinjiang’s Moutai’); Tianshan snowmelt clarity at honest prices.",
    badge: "Regional Daily",
  },
};
