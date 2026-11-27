import type { Metadata } from "next";
import { GiftGuide } from "@/components/gift-guide";

export const metadata: Metadata = {
  title: "The Baijiu Gift Guide (选酒送礼指南)",
  description:
    "An editorial Chinese baijiu gift & banquet guide for weddings, graduations, family dinners, and formal gifting — shop by recipient, browse four budget shelves, and build a gift list.",
  alternates: { canonical: "/banquets" },
  openGraph: {
    title: "The Baijiu Gift Guide · 选酒送礼指南",
    description:
      "What bottle to bring for Chinese weddings, graduations, family dinners, and formal gifting — shop by recipient or budget.",
    url: "/banquets",
  },
};

export default function BanquetsPage() {
  return <GiftGuide />;
}
