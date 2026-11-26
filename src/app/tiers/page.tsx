import type { Metadata } from "next";
import { Card } from "@/components/card";
import { skus, tiers } from "@/catalog";

export const metadata: Metadata = {
  title: "Tiers",
};

export default function TiersPage() {
  return (
    <>
      <p className="kicker">Tiers · 梯队</p>
      <h1>
        Four Tiers &amp; Export <span className="zh-inline">四档梯队</span>
      </h1>
      <p className="sub">
        The row reflects the role of the bottle on a Chinese table — State Banquet (国宴), Famous Liquor (名酒), Fine
        Bottle (佳酿), and Everyday Pour (口粮) — followed by Export (出口), which records bottles bottled or listed for
        Canada and the United States. Street prices sit on the card and do not determine the row.
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
                .sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50) || a.nameEn.localeCompare(b.nameEn))
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
