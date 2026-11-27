import Link from "next/link";

interface HistoryEra {
  numeral: string;
  era: string;
  titleEn: string;
  titleZh: string;
  summary: string;
  icon: string;
  alt: string;
}

const HISTORY_ERAS: HistoryEra[] = [
  {
    numeral: "I",
    era: "c. 7000 BCE – Shang",
    titleEn: "Grain Wine & Qu",
    titleZh: "谷酿与曲",
    summary:
      "Neolithic pottery jars and bronze ritual jue (爵) vessels paired grain with qu (曲) starter bricks — pioneering China’s solid-state fermentation craft.",
    icon: "/images/history/bronze-jue.jpg",
    alt: "Ink illustration of an ancient Chinese Shang bronze tripod jue wine vessel beside sorghum stalks",
  },
  {
    numeral: "II",
    era: "Song – Yuan · 10th–14th c.",
    titleEn: "Birth of Distillation",
    titleZh: "蒸馏烧酒",
    summary:
      "Clay and bronze zeng (甑) stills spread across northern and southwestern China, turning fermented grain mash into clear, fiery shaojiu (“burnt liquor”).",
    icon: "/images/history/zeng-still.jpg",
    alt: "Ink illustration of a traditional Chinese zeng earthenware distillation still with rising steam",
  },
  {
    numeral: "III",
    era: "Ming – Qing · 14th–19th c.",
    titleEn: "Mud Pits & Clay Jars",
    titleZh: "窖池与陶坛",
    summary:
      "Earthen mud-pit fermentation and terracotta aging jars matured across Sichuan, Guizhou, and Shanxi — birthing regional aromas and houses still running today.",
    icon: "/images/history/terracotta-jar.jpg",
    alt: "Ink illustration of a red-cloth-sealed Chinese earthenware baijiu aging jar beside wheat",
  },
  {
    numeral: "IV",
    era: "1952 – Present",
    titleEn: "National Liquors",
    titleZh: "名酒与国宴",
    summary:
      "Five state-run tastings (1952–1989) codified twelve official aroma standards and crowned the Famous Liquors (名酒), defining modern banquets and daily toasts.",
    icon: "/images/history/banquet-cup.jpg",
    alt: "Ink illustration of a Chinese porcelain baijiu pouring flagon with two small tasting cups",
  },
];

export function BaijiuOrigins({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="about-baijiu" className="origins-section" aria-labelledby="origins-heading">
      <div className="origins-intro">
        <div className="origins-title-col">
          <p className="kicker">About Baijiu · 白酒溯源</p>
          {showHeading ? (
            <h2 id="origins-heading" className="origins-heading">
              What Is Baijiu &amp; Where It Came From <span className="zh-inline">白酒简史</span>
            </h2>
          ) : (
            <h2 id="origins-heading" className="origins-heading">
              A Brief History of Baijiu <span className="zh-inline">白酒简史</span>
            </h2>
          )}
        </div>
        <div className="origins-lead">
          <p>
            Literally “white liquor” (<strong>白酒</strong>), baijiu is China’s clear distilled grain spirit —
            fermented in solid state from sorghum, wheat, rice, or corn with wild grain starter bricks (
            <em>qu</em>, 曲), steam-distilled, and rested in clay jars, usually at 40%–60% ABV. Outselling vodka and
            whisky combined, it is the world’s most-consumed spirit by volume and the anchor of Chinese table culture.
          </p>
          <p className="origins-links">
            <Link href="/aromas">Twelve Aroma Standards →</Link>
            <span aria-hidden="true">·</span>
            <Link href="/provinces">27-Province Regional Atlas →</Link>
          </p>
        </div>
      </div>

      <ol className="origins-grid">
        {HISTORY_ERAS.map((item) => (
          <li key={item.numeral} className="origin-card">
            <div className="origin-plate">
              <img src={item.icon} alt={item.alt} width={600} height={480} loading="lazy" />
              <span className="origin-num" aria-hidden="true">
                {item.numeral}
              </span>
            </div>
            <div className="origin-body">
              <span className="origin-era">{item.era}</span>
              <h3 className="origin-title">
                {item.titleEn} <span className="zh-inline-sm">{item.titleZh}</span>
              </h3>
              <p className="origin-desc">{item.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
