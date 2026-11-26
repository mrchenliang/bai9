import type { Metadata } from "next";
import { Card } from "@/components/card";
import { skus, tiers } from "@/catalog";

export const metadata: Metadata = {
  title: "梯队",
};

export default function TiersPage() {
  return (
    <>
      <p className="kicker">Tiers · 梯队</p>
      <h1>四档，加一行出口</h1>
      <p className="en-title">Four rows, and a leaving-China row</p>
      <p className="sub">
        The row is the job of the bottle. A November 2026 street price sits on the card and does not choose the row.
        出口 records a Canada or United States listing. This page does not take a vote or a submission.
      </p>
      <div className="tier-board">
        {tiers.map((tier) => (
          <section key={tier.id} className={`tier-row ${tier.id}`}>
            <div className="tier-label">
              <strong>{tier.zh}</strong>
              <em>{tier.en}</em>
            </div>
            <div className="tier-scroll">
              {skus
                .filter((sku) => sku.tier === tier.id)
                .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50) || a.nameZh.localeCompare(b.nameZh, "zh"))
                .map((sku) => (
                  <Card key={sku.id} sku={sku} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
