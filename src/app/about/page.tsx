import type { Metadata } from "next";
import { creditById, creditUrl, moutaiNotice, priceBoard, skus } from "@/catalog";

export const metadata: Metadata = {
  title: "说明",
};

export default function AboutPage() {
  return (
    <>
      <p className="kicker">酒 · 说明</p>
      <h1>这份档案不收人投稿</h1>
      <p className="en-title">A fixed editorial order.</p>
      <div className="prose">
        <p>
          The rows are 国宴, 名酒, 佳酿, 口粮, then 出口. 出口 is a shopping fact: the bottle was made, or at least
          listed, for Canada or the United States. It is not a fifth rank. Nothing on this site is a vote, a rating, or
          a comment. 对照 stays in this browser and is never sent anywhere.
        </p>
        <p className="zh-copy">
          梯队是国宴、名酒、佳酿、口粮，然后一行出口。出口只说明这瓶酒是做给、或至少列给加拿大和美国的，不是第五个名次。这里没有投票、打分、留言。对照只留在这台浏览器里，不会送出去。
        </p>
        <p>
          China street prices, where shown as a single yuan figure with the date 23 November 2026, come from{" "}
          <a href={priceBoard.sourceUrl}>{priceBoard.sourceName}</a>. {priceBoard.method} That morning in China was the
          evening of {priceBoard.toronto}. The Flying Fairy i-Moutai price is the company’s own{" "}
          <a href={moutaiNotice.url}>{moutaiNotice.label}</a>. A yuan figure dated 9 November 2024 is a ticket visible
          in the photograph, not that national sample.
        </p>
        <p>
          National famous-liquor years follow the five tastings: four liquors in Beijing in 1952, eight in 1963, eight
          in Dalian in 1979, thirteen in Taiyuan in 1984, seventeen in Hefei in 1989. The state stopped the contest
          after that. Medal proofs are the proofs printed for that tasting. Current bottles are often lower.
        </p>
        <p>
          Shop links open the retailer. This archive does not sell alcohol. Stock, tax and the legal drinking age are
          the shop’s and the province’s or the state’s.
        </p>
      </div>
      <h2 className="section-label">Photographs</h2>
      <ul className="credits">
        {skus
          .filter((sku) => sku.creditId)
          .map((sku) => {
            const credit = creditById(sku.creditId);
            if (!credit) return null;
            return (
              <li key={sku.id}>
                {sku.nameZh} — {credit.by}, {credit.license}, <a href={creditUrl(credit.file)}>{credit.file}</a>
              </li>
            );
          })}
      </ul>
    </>
  );
}
