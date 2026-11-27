export type BoxPalette = "red" | "gold" | "blue" | "celadon" | "classic";

export type GiftVibe = "festive" | "sauce" | "strong" | "light" | "distinctive";

export interface BanquetPick {
  skuId: string;
  archetype: string;
  note: string;
  bestFor: string;
  boxColor: BoxPalette;
  boxLabel: string;
  vibe: GiftVibe;
  handoffLine: string;
}

export interface BanquetBand {
  id: string;
  range: string;
  badge: string;
  titleEn: string;
  titleZh: string;
  occasion: string;
  picks: BanquetPick[];
}

export interface GiftPersonaPick {
  skuId: string;
  roleLabel: string;
  roleZh: string;
  pitch: string;
  defaultQty: 1 | 2;
}

export interface GiftPersona {
  id: string;
  label: string;
  zh: string;
  tagline: string;
  wrapTip: string;
  sayThis: string;
  toastZh: string;
  picks: GiftPersonaPick[];
}

export interface GiftRule {
  num: string;
  titleEn: string;
  titleZh: string;
  body: string;
}

export interface GiftTrap {
  skip: string;
  why: string;
  buyInsteadId: string;
  buyReason: string;
}

export const giftPersonas: GiftPersona[] = [
  {
    id: "father-in-law",
    label: "Future Father-in-Law",
    zh: "第一次见岳父",
    tagline: "He says he “doesn’t drink much anymore.” He is testing you.",
    wrapTip:
      "Always bring a pair (成双成对) inside the original factory tote bag. Never crack the seal before he invites you to pour.",
    sayThis: "“Heard you appreciate real solid-state grain — brought a pair for the cabinet.”",
    toastZh: "薄酒成双，敬祝安康",
    picks: [
      {
        skuId: "puwu",
        roleLabel: "Safe Hero",
        roleZh: "稳妥王牌",
        pitch: "Instant respect before your coat is off. Everyone at the table knows what an eighth-gen Puwu costs and means.",
        defaultQty: 2,
      },
      {
        skuId: "qinghua-30",
        roleLabel: "Insider Flex",
        roleZh: "懂行暗秀",
        pitch: "For the father-in-law who thinks Moutai is too loud — China’s cleanest, silkiest luxury light-aroma pour.",
        defaultQty: 2,
      },
      {
        skuId: "xijiu-1988",
        roleLabel: "Smart Value",
        roleZh: "精明之选",
        pitch: "Genuine Chishui River sauce aroma with serious banquet credibility at less than a third of Flying Fairy.",
        defaultQty: 2,
      },
    ],
  },
  {
    id: "celebration",
    label: "Wedding & Graduation",
    zh: "婚宴 · 升学宴",
    tagline: "Twenty round tables, twelve opinionated aunties, zero tolerance for pale boxes.",
    wrapTip:
      "Stick to crimson, vermilion, gold, or crystal presentation. Budget 1.5–2 bottles per table of ten (about 1 six-bottle case per 3–4 tables).",
    sayThis: "“A little red and gold for the big day — here’s to the next chapter!”",
    toastZh: "金榜题名 · 喜结良缘",
    picks: [
      {
        skuId: "crystal",
        roleLabel: "Undefeated King",
        roleZh: "婚宴霸主",
        pitch: "The perennial ¥400 champion of Chinese wedding and graduation halls. Zero complaints in three decades.",
        defaultQty: 2,
      },
      {
        skuId: "honghualang",
        roleLabel: "Red Ceramic Armor",
        roleZh: "红瓷喜气",
        pitch: "Lacquer-crimson stoneware built specifically to glow under banquet chandeliers and delight proud parents.",
        defaultQty: 2,
      },
      {
        skuId: "jiugui-hongtan",
        roleLabel: "Room-Wide Presence",
        roleZh: "一眼出挑",
        pitch: "Hunan’s vermilion tied-sack stoneware — unmistakable from across a crowded ballroom with layered fuyu aroma.",
        defaultQty: 2,
      },
    ],
  },
  {
    id: "bring-nothing",
    label: "“Bring Nothing” Uncle",
    zh: "嘴上说别带东西",
    tagline: "The oldest trap in Chinese hospitality. Showing up empty-handed is a diplomatic incident.",
    wrapTip:
      "Aim right in the ¥150–¥450 zone: thoughtful enough to show warmth, relaxed enough that he won’t try to shove cash back into your pocket.",
    sayThis: "“Nothing fancy — just a clean pure-grain bottle to open with dinner.”",
    toastZh: "小酌怡情，常来常往",
    picks: [
      {
        skuId: "qinghua-20",
        roleLabel: "Cultured Default",
        roleZh: "雅致首选",
        pitch: "Blue-and-white porcelain that reads refined and generous without turning dinner into a corporate invoice.",
        defaultQty: 2,
      },
      {
        skuId: "pinwei",
        roleLabel: "Label-Reader’s Pick",
        roleZh: "老饕心头好",
        pitch: "Aged Sichuan cellar blend for the uncle who flips every bottle over to check the GB/T pure-grain code.",
        defaultQty: 2,
      },
      {
        skuId: "laobaifen",
        roleLabel: "Warm Family Classic",
        roleZh: "家宴熟面孔",
        pitch: "Classic Shanxi brown jar — honest, recognizable, and zero chance he leaves it locked in a display case.",
        defaultQty: 2,
      },
    ],
  },
  {
    id: "mentor-boss",
    label: "Boss, Mentor & Head Table",
    zh: "恩师 · 商务压轴",
    tagline: "Where the name on the bottle settles the conversation before the hot dishes land.",
    wrapTip:
      "Present with both hands, keep the tamper seal and official paper tote untouched, and never ask if they want to open it right now.",
    sayThis: "“Thank you for looking out for me this year — brought something proper for your shelf.”",
    toastZh: "感念提携，顺颂时祺",
    picks: [
      {
        skuId: "feitian",
        roleLabel: "The State Standard",
        roleZh: "硬通货压轴",
        pitch: "53% Flying Fairy. Needs zero introduction, holds its value like bullion, and closes every room.",
        defaultQty: 2,
      },
      {
        skuId: "junpin",
        roleLabel: "Quiet Diplomacy",
        roleZh: "君子雅赠",
        pitch: "Xijiu’s prestige celadon bottle — polished Guizhou sauce aroma when Feitian feels a shade too loud.",
        defaultQty: 2,
      },
      {
        skuId: "guojiao",
        roleLabel: "Sichuan Prestige",
        roleZh: "浓香顶流",
        pitch: "National Cellar 1573 — Ming-era mud-pit silk for hosts who prefer lush orchard aroma over sauce intensity.",
        defaultQty: 2,
      },
    ],
  },
  {
    id: "design-collector",
    label: "Design Snob & Collector",
    zh: "颜控 · 藏家 · 谈资",
    tagline: "Bottles so handsome they stay on the bookshelf long after the last drop is gone.",
    wrapTip:
      "A single standout collector bottle is totally acceptable for a design-minded friend — pair it with two 15 ml ceramic tasting cups.",
    sayThis: "“Even before you uncork it, the bottle itself deserves a spot on the shelf.”",
    toastZh: "器美酒醇，赏心乐事",
    picks: [
      {
        skuId: "jiugui-sack",
        roleLabel: "Art-World Icon",
        roleZh: "大师设计",
        pitch: "The sculptural burlap-sack stoneware designed by master painter Huang Yongyu — instant tabletop conversation.",
        defaultQty: 1,
      },
      {
        skuId: "jingtai",
        roleLabel: "Glasswork Showpiece",
        roleZh: "雕花美学",
        pitch: "Chengdu’s engraved octagonal vessel with a sunken historic-well base and fragrant jasmine-pear lift.",
        defaultQty: 1,
      },
      {
        skuId: "zodiac",
        roleLabel: "Heirloom Trophy",
        roleZh: "生肖藏品",
        pitch: "Annual ceramic Zodiac Moutai — doubles as a Lunar New Year display piece and a liquid time capsule.",
        defaultQty: 1,
      },
    ],
  },
  {
    id: "first-timer",
    label: "Curious First-Timer",
    zh: "带朋友入坑 · 海外伴手礼",
    tagline: "Convert a baijiu skeptic without ambushing them with 67% northern rocket fuel.",
    wrapTip:
      "Tell them to pour tiny 15 ml sips alongside salty food or over a big ice cube, and smell the empty glass sixty seconds later.",
    sayThis: "“Treat it like aged rum or grappa — tiny sips, big nose, zero shot-glass bravado.”",
    toastZh: "初逢佳酿，细品生香",
    picks: [
      {
        skuId: "ming-river",
        roleLabel: "Cocktail Bridge",
        roleZh: "调酒入门",
        pitch: "Luzhou Laojiao distilled for Western bars — bright pineapple funk, pink peppercorn, and a friendly 45% ABV.",
        defaultQty: 1,
      },
      {
        skuId: "qinghua-20",
        roleLabel: "Gateway Porcelain",
        roleZh: "清香惊艳",
        pitch: "Crisp Asian pear and mineral clarity with zero mud-pit shock — wins over gin, vodka, and sake drinkers alike.",
        defaultQty: 1,
      },
      {
        skuId: "zhuyeqing",
        roleLabel: "Botanical Wildcard",
        roleZh: "竹叶草本",
        pitch: "Jade-tinted Fenjiu steeped with bamboo leaf and citrus peel — looks like tea, pours like a heritage liqueur.",
        defaultQty: 1,
      },
    ],
  },
];

export const banquetBands: BanquetBand[] = [
  {
    id: "100-300",
    range: "¥100–300",
    badge: "Everyday Heroes",
    titleEn: "Family Dinners & Casual Hosting",
    titleZh: "家宴聚会 · 100–300元左右",
    occasion:
      "Honest, recognizable bottles from major houses for multi-table family feasts, casual hosting, and value-minded graduation dinners.",
    picks: [
      {
        skuId: "moutai-yingbin",
        archetype: "The Nameplate Entry",
        note: "Entry Moutai sauce aroma that puts the iconic badge on a casual table under ¥200.",
        bestFor: "Family dinners",
        boxColor: "red",
        boxLabel: "Classic Red & White",
        vibe: "sauce",
        handoffLine: "Brought a little Moutai family sauce aroma for the table.",
      },
      {
        skuId: "prince",
        archetype: "Everyday Sauce Benchmark",
        note: "Golden Prince — Moutai factory bloodline with warm roasted grain and zero receipt shock.",
        bestFor: "Casual gifting",
        boxColor: "gold",
        boxLabel: "Golden Box",
        vibe: "sauce",
        handoffLine: "Golden Prince — pure-grain Chishui sauce without the fuss.",
      },
      {
        skuId: "haizhilan",
        archetype: "East China Crowd-Pleaser",
        note: "Yanghe’s cotton-soft blue classic — smooth, forgiving, and instantly familiar from Nanjing to Hefei.",
        bestFor: "Big family tables",
        boxColor: "blue",
        boxLabel: "Ocean Blue",
        vibe: "strong",
        handoffLine: "Easy-drinking Ocean Blue so everyone enjoys a second toast.",
      },
      {
        skuId: "xifeng-6",
        archetype: "Xi’an Graduation Favorite",
        note: "Festive red-gold presentation with beeswax-vat feng aroma — a Shaanxi celebration staple.",
        bestFor: "Graduations · 升学宴",
        boxColor: "red",
        boxLabel: "Red & Gold",
        vibe: "festive",
        handoffLine: "Red and gold Xifeng for good luck and a warm Shaanxi toast.",
      },
      {
        skuId: "laobaifen",
        archetype: "Northern Comfort Classic",
        note: "Iconic brown stoneware jar from Xinghuacun — crisp pear clarity with beloved hometown warmth.",
        bestFor: "Sunday family table",
        boxColor: "classic",
        boxLabel: "Brown Ceramic Jar",
        vibe: "light",
        handoffLine: "Old-school brown-jar Fenjiu — clean grain, zero hangover drama.",
      },
      {
        skuId: "gujing-1989",
        archetype: "Retro Gold Medalist",
        note: "Throwback label celebrating Anhui’s 1989 national gold — nostalgia plus honest cellar fruit.",
        bestFor: "Nostalgic uncles",
        boxColor: "classic",
        boxLabel: "Vintage Ivory",
        vibe: "strong",
        handoffLine: "Retro 1989 Gujing — tastes like the classics our dads grew up on.",
      },
      {
        skuId: "gu8",
        archetype: "Bozhou Table Workhorse",
        note: "Mid-entry Year Puree bottle — respectable enough for relatives, painless enough for two cases.",
        bestFor: "Multi-table banquets",
        boxColor: "gold",
        boxLabel: "Black & Gold",
        vibe: "strong",
        handoffLine: "Smooth Anhui Gu 8 — goes down easy all evening.",
      },
      {
        skuId: "tequ",
        archetype: "Five-Time Gold Medalist",
        note: "The dictionary definition of single-grain Luzhou strong aroma — zero flash, pure pedigree.",
        bestFor: "Purist drinkers",
        boxColor: "classic",
        boxLabel: "Heritage Seal",
        vibe: "strong",
        handoffLine: "Five-time national medalist — the real benchmark of Luzhou.",
      },
      {
        skuId: "wuliangchun",
        archetype: "Yibin Younger Sibling",
        note: "Wuliangye’s core multi-grain line — crisp five-grain sweetness that everyone recognizes immediately.",
        bestFor: "Relatives & neighbors",
        boxColor: "red",
        boxLabel: "Crimson & Gold",
        vibe: "festive",
        handoffLine: "Five-grain pedigree from Yibin — festive box, smooth pour.",
      },
    ],
  },
  {
    id: "300-500",
    range: "¥300–500",
    badge: "Sweet Spot",
    titleEn: "Graduation & Celebration Banquets",
    titleZh: "升学宴·喜宴中坚 · 300–500元左右",
    occasion:
      "The golden sweet spot of Chinese celebration tables (升学宴, 婚宴): iconic red, blue, or gold presentation with unmistakable national-brand credibility.",
    picks: [
      {
        skuId: "crystal",
        archetype: "The Wedding King",
        note: "China’s perennial wedding and graduation champion — crystalline five-grain snap in an unmistakable box.",
        bestFor: "Weddings · 婚宴",
        boxColor: "red",
        boxLabel: "Festive Red & Crystal",
        vibe: "festive",
        handoffLine: "Crystal Jiannanchun — the one bottle every banquet guest cheers for.",
      },
      {
        skuId: "qinghua-20",
        archetype: "Porcelain Minimalist",
        note: "Blue-and-white porcelain light-aroma flagship — cultured, spotless, and loved by modern hosts.",
        bestFor: "Refined host gift",
        boxColor: "blue",
        boxLabel: "Blue & White Porcelain",
        vibe: "light",
        handoffLine: "Qinghua 20 — crisp, clean, and looks like museum porcelain on the table.",
      },
      {
        skuId: "jiugui-hongtan",
        archetype: "Vermilion Showstopper",
        note: "Tied-sack red stoneware from western Hunan — layered three-aroma fuyu style that owns the room.",
        bestFor: "Celebration centerpieces",
        boxColor: "red",
        boxLabel: "Vermilion Stoneware",
        vibe: "distinctive",
        handoffLine: "Red Altar Jiugui — art-piece bottle with Hunan’s layered fuyu aroma.",
      },
      {
        skuId: "jiaoling-60",
        archetype: "60-Year Mud-Pit Flex",
        note: "Distilled from active 60-year Luzhou fermentation pits in a gleaming gold-trimmed banquet box.",
        bestFor: "Graduation feasts",
        boxColor: "gold",
        boxLabel: "Imperial Gold",
        vibe: "festive",
        handoffLine: "Sixty-year Luzhou mud pits — half the price of 1573, full cellar soul.",
      },
      {
        skuId: "guotai-guobiao",
        archetype: "Vintage-Dated Challenger",
        note: "Crimson Maotai-town sauce aroma stamped with its exact distillation year right on the glass.",
        bestFor: "Sauce-aroma celebrations",
        boxColor: "red",
        boxLabel: "Crimson Glass",
        vibe: "sauce",
        handoffLine: "Vintage-dated Maotai-town sauce aroma — festive red outside, serious craft inside.",
      },
      {
        skuId: "zhihui-shede",
        archetype: "Thinking-Host Reserve",
        note: "8-year aged Sichuan cellar blend in a sleek amber bottle — smooth, mature, and quietly clever.",
        bestFor: "Mentors & peers",
        boxColor: "gold",
        boxLabel: "Amber & Gold",
        vibe: "strong",
        handoffLine: "Aged Sichuan cellar stock — smooth enough to sip all night.",
      },
      {
        skuId: "tianzhilan",
        archetype: "Polite Blue Upgrade",
        note: "The middle rung of Yanghe’s Blue Classic — steps up cleanly when uncles and professors share a table.",
        bestFor: "Graduation & teacher gifts",
        boxColor: "blue",
        boxLabel: "Sky Blue",
        vibe: "strong",
        handoffLine: "Sky Blue — soft Jianghuai texture that keeps every toast effortless.",
      },
      {
        skuId: "gu16",
        archetype: "East China Favorite",
        note: "Red-and-black Year Puree standout — commands instant local respect across Anhui and Jiangsu.",
        bestFor: "East China banquets",
        boxColor: "red",
        boxLabel: "Red & Obsidian",
        vibe: "festive",
        handoffLine: "Gujing Gu 16 — plush Bozhou fruit in a sharp banquet box.",
      },
    ],
  },
  {
    id: "500-800",
    range: "¥500–800",
    badge: "Serious Gifting",
    titleEn: "Senior Tables & Formal Gifts",
    titleZh: "商务宴请·送礼 · 500–800元左右",
    occasion:
      "Stepped-up aged blends reserved for mentors, elders, and formal gift boxes — where crimson ceramics and deep blue glass signal real weight.",
    picks: [
      {
        skuId: "honghualang",
        archetype: "Crimson Porcelain Armor",
        note: "15-year red-lacquer stoneware from the Chishui River — built for weddings, elders, and Lunar New Year.",
        bestFor: "Elders & festive gifting",
        boxColor: "red",
        boxLabel: "Crimson Porcelain",
        vibe: "festive",
        handoffLine: "Honghualang — Chishui sauce depth wrapped in celebratory red porcelain.",
      },
      {
        skuId: "zhen-15",
        archetype: "Zunyi Heritage Secret",
        note: "Born from a 1975 state project to recreate Moutai off-site — deep Zunyi sauce aroma with real backstory.",
        bestFor: "Sauce connoisseurs",
        boxColor: "classic",
        boxLabel: "Matte Onyx & Gold",
        vibe: "sauce",
        handoffLine: "Zhen 15 — classic Zunyi sauce pedigree with a great history behind it.",
      },
      {
        skuId: "pinwei",
        archetype: "Old-Stock Connoisseur",
        note: "Shede’s signature aged strong blend — mellow apricot warmth beloved by drinkers who read back labels.",
        bestFor: "Discerning elders",
        boxColor: "classic",
        boxLabel: "Frosted Ivory & Gold",
        vibe: "strong",
        handoffLine: "Pinwei Shede — pure aged Sichuan stock, zero raw burn.",
      },
      {
        skuId: "laimao-blue",
        archetype: "Gas-Station Insider Legend",
        note: "Brewed by Moutai’s Laimao subsidiary — one of the best-kept value secrets among serious sauce drinkers.",
        bestFor: "Insider sauce gift",
        boxColor: "blue",
        boxLabel: "Royal Blue",
        vibe: "sauce",
        handoffLine: "Moutai-group Laimao — the bottle real sauce drinkers actually buy for themselves.",
      },
      {
        skuId: "xijiu-1988",
        archetype: "Benchmark Banquet Sauce",
        note: "Chishui River’s poised middle-high icon — earns immediate nods when Flying Fairy feels over-the-top.",
        bestFor: "Mentors & client dinners",
        boxColor: "gold",
        boxLabel: "Matte Bronze & Gold",
        vibe: "sauce",
        handoffLine: "Xijiu Cellar 1988 — balanced Chishui elegance, zero flash needed.",
      },
      {
        skuId: "mengzhilan-m6",
        archetype: "Jiangsu Power Move",
        note: "High-table Jiangsu soft strong aroma in deep sapphire glass — speaks fluent East China executive.",
        bestFor: "Business gifting",
        boxColor: "blue",
        boxLabel: "Sapphire Cobalt",
        vibe: "strong",
        handoffLine: "Dream Blue M6+ — velvet-smooth Jianghuai style for a proper toast.",
      },
    ],
  },
  {
    id: "1000-plus",
    range: "¥1,000+",
    badge: "Head Table",
    titleEn: "Head-Table Flagships",
    titleZh: "千元压轴名酒 · 千元左右",
    occasion:
      "The unmistakable top shelf of a Chinese banquet hall: bottles whose names alone close the conversation.",
    picks: [
      {
        skuId: "feitian",
        archetype: "The State Standard",
        note: "53% Flying Fairy — the ultimate currency of Chinese gifting. Set two down and the room goes quiet.",
        bestFor: "Milestone gifts · 压轴",
        boxColor: "red",
        boxLabel: "White Porcelain & Red Ribbon",
        vibe: "sauce",
        handoffLine: "Brought a pair of Flying Fairy — nothing less for tonight.",
      },
      {
        skuId: "puwu",
        archetype: "Five-Grain Sovereign",
        note: "Eighth-generation Wuliangye — explosive orchard aroma in its iconic crystal sleeve. Instant father-in-law approval.",
        bestFor: "Head tables & elders",
        boxColor: "red",
        boxLabel: "Crystal Sleeve & Red Gold",
        vibe: "strong",
        handoffLine: "Eighth-gen Wuliangye — classic five-grain elegance for the head table.",
      },
      {
        skuId: "guojiao",
        archetype: "Ming-Era Cellar Silk",
        note: "National Cellar 1573 — single-sorghum Luzhou royalty for hosts who prize plush silkiness over sauce fire.",
        bestFor: "Executive & VIP dinners",
        boxColor: "gold",
        boxLabel: "Gold & Crimson Case",
        vibe: "strong",
        handoffLine: "National Cellar 1573 — four centuries of Luzhou cellar heritage.",
      },
      {
        skuId: "qinghualang",
        archetype: "Cave-Aged Rival",
        note: "Langjiu’s pinnacle Chishui sauce bottle — dramatic mineral grip and museum-worthy blue-black ceramic.",
        bestFor: "Collectors & bold hosts",
        boxColor: "blue",
        boxLabel: "Midnight Ceramic",
        vibe: "sauce",
        handoffLine: "Qinghualang — cave-aged on the Sichuan bank of the Chishui.",
      },
      {
        skuId: "neican",
        archetype: "State-Briefing Energy",
        note: "Jiugui’s top-tier fuyu collectible — named after confidential briefings, Hunan’s ultimate status gift.",
        bestFor: "Hunan & insider VIPs",
        boxColor: "gold",
        boxLabel: "Gilded Vessel",
        vibe: "distinctive",
        handoffLine: "Jiugui Neican — three aromas layered in one unforgettable bottle.",
      },
      {
        skuId: "junpin",
        archetype: "Celadon Diplomacy",
        note: "Xijiu’s prestige jade-celadon bottle — refined, floral-edged sauce aroma for tasteful boardrooms.",
        bestFor: "Mentors & executives",
        boxColor: "celadon",
        boxLabel: "Jade Celadon",
        vibe: "sauce",
        handoffLine: "Xijiu Junpin — understated celadon poise for a refined table.",
      },
    ],
  },
];

export const banquetRules: GiftRule[] = [
  {
    num: "01",
    titleEn: "Always Bring Pairs",
    titleZh: "好事成双",
    body: "Good fortune travels in twos. For elders, weddings, and Lunar New Year visits, two matching bottles in one bag feel complete — a single bottle only works for rare collectors or casual dinner drop-ins.",
  },
  {
    num: "02",
    titleEn: "Red & Gold for Joy",
    titleZh: "红金喜庆",
    body: "Weddings (婚宴) and university graduation banquets (升学宴) favor red, vermilion, and gold boxes — Crystal Jiannanchun (水晶剑), Honghualang (红花郎), Jiugui Red Altar (酒鬼红坛), and Guotai Guobiao (国台国标).",
  },
  {
    num: "03",
    titleEn: "The Regional Anchor",
    titleZh: "地域主场",
    body: "Hosts almost always pick a bottle elders recognize locally: Fenjiu in Shanxi, Xifeng in Shaanxi, Gujing in Anhui, Yanghe in Jiangsu, and Wuliangye or Jiannanchun in Sichuan.",
  },
  {
    num: "04",
    titleEn: "52%–53% Vol & 500 ml",
    titleZh: "高度正装",
    body: "Formal Chinese tables still default to high-proof 500 ml bottles (52% for strong aroma, 53% for sauce and light), even as lower-proof 40.8%–42% options grow for casual dinners.",
  },
  {
    num: "05",
    titleEn: "Check the GB/T Code",
    titleZh: "认准纯粮国标",
    body: "Flip the box before paying. Solid-state pure-grain codes like GB/T 10781 (strong/light), GB/T 26760 (sauce), or GB/T 18356 (Moutai) guarantee zero neutral-spirit shortcuts.",
  },
  {
    num: "06",
    titleEn: "Keep the Factory Tote",
    titleZh: "留好原厂手提袋",
    body: "Ask the shop for the matching official paper carrier bag and keep the bottle’s outer box crisp — seasoned hosts judge presentation before the ribbon is even untied.",
  },
];

export const giftTraps: GiftTrap[] = [
  {
    skip: "Flashy ¥299 “Moutai Town Internal Reserve” gold-foil box",
    why: "Looks expensive to outsiders, immediately flagged as tourist markup by every uncle who checks wholesale prices.",
    buyInsteadId: "xijiu-1988",
    buyReason: "Real Chishui River pedigree with zero awkwardness.",
  },
  {
    skip: "Low-proof 38%–42% bottle for a Guizhou or Sichuan formal elder",
    why: "Serious banquet drinkers treat sub-50% bottles as weekday casual pours, not milestone gifts.",
    buyInsteadId: "crystal",
    buyReason: "Full 52% vol five-grain prestige at the exact same price.",
  },
  {
    skip: "Showing up empty-handed when your host says “just bring yourself”",
    why: "Polite modesty is script, not instruction — walking in with nothing leaves everyone slightly uncomfortable.",
    buyInsteadId: "qinghua-20",
    buyReason: "Refined porcelain beauty that feels warm, never heavy-handed.",
  },
];
