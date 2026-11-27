import type { Metadata } from "next";
import { PriceSheetView } from "@/components/price-sheet";
import { sheetNote } from "@/sheet";

export const metadata: Metadata = {
  title: "Price Bands (价格带)",
  description:
    "Six-band Chinese baijiu price sheet — from state-table icons to everyday grain bottles, with yuan reference figures.",
  alternates: { canonical: "/price-bands" },
};

export default function PriceBandsPage() {
  return (
    <>
      <p className="kicker">Price Bands · 六排价格带</p>
      <h1>
        Six Price Bands <span className="zh-inline">价格带</span>
      </h1>
      <p className="sub">{sheetNote}</p>
      <PriceSheetView />
    </>
  );
}
