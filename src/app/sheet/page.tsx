import type { Metadata } from "next";
import Link from "next/link";
import { brandById, skuAroma, skuById } from "@/catalog";
import { aromaChip, priceSheet, sheetNote, sheetNoteZh, type SheetSpot } from "@/sheet";

export const metadata: Metadata = {
  title: "价格带",
};

function Bottle({ spot }: { spot: SheetSpot }) {
  const sku = skuById(spot.skuId);
  const brand = sku ? brandById(sku.brandId) : undefined;
  const aroma = sku ? skuAroma(sku) : undefined;
  const mark = aromaChip(aroma?.id);
  return (
    <Link className="sheet-bottle" href={sku ? `/sku/${sku.id}` : "/sheet"}>
      <div className="sheet-photo">
        <b className="sheet-yuan">{spot.yuan}</b>
        {sku?.image ? (
          <img src={sku.image} alt={spot.label} style={{ objectPosition: sku.imagePosition ?? "50% 40%" }} />
        ) : (
          <div className="sheet-plate">
            <b>{brand?.nameZh.slice(0, 2)}</b>
          </div>
        )}
        {mark ? <span className="aroma-chip">{mark}</span> : null}
      </div>
      <div className="sheet-name">{spot.label}</div>
    </Link>
  );
}

export default function SheetPage() {
  return (
    <>
      <p className="kicker">Sheet · 价格带</p>
      <h1>六排价格</h1>
      <p className="en-title">Six rows, dearest at the top.</p>
      <p className="sub">{sheetNote}</p>
      <p className="sub zh-copy">{sheetNoteZh}</p>
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
