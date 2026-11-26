import type { Metadata } from "next";
import { Card } from "@/components/card";
import { retailers, skus } from "@/catalog";

export const metadata: Metadata = {
  title: "何处买",
};

export default function ShopsPage() {
  return (
    <>
      <p className="kicker">Shops · 何处买</p>
      <h1>加拿大与美国</h1>
      <p className="en-title">Where a bottle was actually listed.</p>
      <p className="sub">
        Provincial boards decide most of the Canadian shelf. A page can be out of stock the same week. United States
        chains often sell 200 ml, 375 ml or 750 ml, while the China price is for 500 ml. Read the label. Prices below
        were copied from the retailer page in November 2026.
      </p>
      <div className="shop-index">
        {(["Canada", "United States"] as const).map((country) => (
          <section key={country}>
            <h2 className="section-label">{country}</h2>
            {retailers
              .filter((shop) => shop.country === country)
              .map((shop) => (
                <a key={shop.url} className="retailer" href={shop.url}>
                  <strong>
                    {shop.name} · {shop.place}
                  </strong>
                  <p>{shop.note}</p>
                </a>
              ))}
          </section>
        ))}
      </div>
      <h2 className="section-label">Bottles with a direct page</h2>
      <div className="grid">
        {skus
          .filter((sku) => sku.shops.length > 0)
          .map((sku) => (
            <Card key={sku.id} sku={sku} />
          ))}
      </div>
    </>
  );
}
