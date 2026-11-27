import type { Metadata } from "next";
import { creditById, creditUrl, moutaiNotice, priceBoard, skus } from "@/catalog";
import { BaijiuOrigins } from "@/components/baijiu-origins";

export const metadata: Metadata = {
  title: "About Baijiu & Archive Notes (白酒溯源与档案说明)",
  description:
    "What baijiu is, a brief history of Chinese distilled grain spirits, and how the Chinese Baijiu Museum is curated.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const creditedSkus = skus.filter((sku) => sku.creditId);
  return (
    <>
      <p className="kicker">酒 · About &amp; Archive Notes · 白酒与档案</p>
      <h1>
        About Baijiu &amp; This Archive <span className="zh-inline">白酒溯源</span>
      </h1>
      <BaijiuOrigins showHeading={false} />
      <h2 className="section-label">Curatorial Method · 档案说明</h2>
      <div className="prose">
        <p>
          The tier board uses four Chinese table ranks — State Banquet (国宴), Famous Liquor (名酒), Fine Bottle (佳酿),
          and Everyday Pour (口粮). Nothing on this site is a vote, a crowd rating, or a user comment. The comparison
          tray stays strictly in your browser.
        </p>
        <p>
          China street prices dated 23 November 2026 come from{" "}
          <a href={priceBoard.sourceUrl}>{priceBoard.sourceName}</a>. {priceBoard.method} That morning in China was the
          evening of {priceBoard.toronto}. The Flying Fairy (飞天茅台) i-Moutai price is the company’s own{" "}
          <a href={moutaiNotice.url}>{moutaiNotice.label}</a>. Yuan figures dated 9 November 2024 are shelf tickets
          visible in historical reference photographs rather than that national sample.
        </p>
        <p>
          National Famous Liquor (国家名酒) years follow China’s five state-run tastings: four liquors in Beijing in
          1952, eight in Beijing in 1963 (老八大), eight in Dalian in 1979 (新八大), thirteen in Taiyuan in 1984, and
          seventeen in Hefei in 1989. The state ended the national contest thereafter. Medal proofs are those recorded
          for each tasting; modern bottlings are often lower in ABV.
        </p>
        <p>
          The China Baijiu Map surveys over 140 local Chinese distilleries grouped by province and region,
          with cross-links to full dossiers wherever a house is held in the main collection.
        </p>
      </div>
      <h2 className="section-label">Photographs · 摄影说明</h2>
      {creditedSkus.length > 0 ? (
        <ul className="credits">
          {creditedSkus.map((sku) => {
            const credit = creditById(sku.creditId);
            if (!credit) return null;
            return (
              <li key={sku.id}>
                {sku.nameEn} ({sku.nameZh}) — {credit.by}, {credit.license},{" "}
                <a href={creditUrl(credit.file)}>{credit.file}</a>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="prose">
          <p>
            All {skus.length} bottle plates in this archive use uniform 1:1 studio photographs shot upright on a soft
            off-white gallery backdrop (#f6f6f8) with diffused lighting and subtle contact shadow, so bottles across
            tiers, price bands, and banquet guides can be compared side by side without shelf clutter or mismatched
            aspect ratios.
          </p>
        </div>
      )}
    </>
  );
}
