import type { Metadata } from "next";
import Link from "next/link";
import { brandById, skuAroma, skuById } from "@/catalog";
import { aromaChip, priceSheet, sheetNote, type SheetSpot } from "@/sheet";

export const metadata: Metadata = {
  title: "Price Bands (价格带)",
  description:
    "Six-band Chinese baijiu price sheet — from state-table icons to everyday grain bottles, with yuan reference figures.",
  alternates: { canonical: "/sheet" },
};

function Bottle({ spot }: { spot: SheetSpot }) {
  const sku = skuById(spot.skuId);
  const brand = sku ? brandById(sku.brandId) : undefined;
  const aroma = sku ? skuAroma(sku) : undefined;
  const mark = aromaChip(aroma?.id);
  return (
    <Link className="sheet-bottle" href={sku ? `/sku/${sku.id}` : "/sheet"}>
      <div className="sheet-photo">
        <b className="sheet-yuan">¥{spot.yuan.toLocaleString("en-US")}</b>
        {sku?.image ? (
          <img
            src={sku.image}
            alt={sku.nameEn}
            style={sku.imagePosition ? { objectPosition: sku.imagePosition } : undefined}
          />
        ) : (
          <div className="sheet-plate">
            <b>{brand?.nameZh.slice(0, 2)}</b>
          </div>
        )}
        {mark ? <span className="aroma-chip">{mark}</span> : null}
      </div>
      <div className="sheet-name">{sku?.nameEn ?? spot.label}</div>
      <div className="sheet-zh">{spot.label}</div>
    </Link>
  );
}

export default function SheetPage() {
  return (
    <>
      <p className="kicker">Price Bands · 六排价格带</p>
      <h1>
        Six Price Bands <span className="zh-inline">价格带</span>
      </h1>
      <p className="sub">{sheetNote}</p>
      <div className="sheet">
        {priceSheet.map((band) => (
          <section key={band[0]?.skuId} className="sheet-band">
            {band.map((spot) => (
              <Bottle key={spot.skuId} spot={spot} />
            ))}
          </section>
        ))}
      </div>
    </>
  );
}
