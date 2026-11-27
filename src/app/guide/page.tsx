import type { Metadata } from "next";
import { TableAdvisor } from "@/components/table-advisor";

export const metadata: Metadata = {
  title: "The Baijiu Guide (选酒指南)",
  description:
    "One concise guide to choosing, gifting, and pouring Chinese baijiu — spin for a bottle discovery, browse six table moments, learn regional etiquette, and dodge classic traps.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "The Baijiu Guide · 选酒指南",
    description:
      "Spin for a bottle discovery, browse six table moments, learn regional rules, and dodge classic gifting traps.",
    url: "/guide",
  },
};

export default function GuidePage() {
  return <TableAdvisor />;
}
