import type { Metadata } from "next";
import { GiftGuide } from "@/components/gift-guide";

export const metadata: Metadata = {
  title: "The Baijiu Gift Guide (选酒送礼指南)",
  description:
    "An editorial Chinese baijiu gift & banquet guide: shop by recipient, browse four budget shelves, spin a quick panic pick, and build a pair-checked gift list.",
  alternates: { canonical: "/banquets" },
  openGraph: {
    title: "The Baijiu Gift Guide · 选酒送礼指南",
    description:
      "Shop by recipient, browse four banquet budget shelves, dodge gifting traps, and build your bottle list.",
    url: "/banquets",
  },
};

export default function BanquetsPage() {
  return <GiftGuide />;
}
