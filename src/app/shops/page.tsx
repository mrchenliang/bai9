import type { Metadata } from "next";
import { Card } from "@/components/card";
import { retailers, skus } from "@/catalog";

export const metadata: Metadata = {
  title: "Where to Buy",
};

export default function ShopsPage() {
  return (
    <>
      <p className="kicker">Shops · 北美购酒</p>
      <h1>
        Canada &amp; the United States <span className="zh-inline">何处买</span>
      </h1>
      <p className="sub">
        Provincial liquor boards decide most of the Canadian shelf, and listings go in and out of stock week to week.
        United States chains often sell 200 ml, 375 ml, or 750 ml bottles while China street prices are for 500 ml —
        always check the volume on the label. Prices below were recorded from retailer pages in November 2026.
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
      <h2 className="section-label">Bottles with a direct retail listing</h2>
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
