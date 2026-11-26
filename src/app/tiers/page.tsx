import type { Metadata } from "next";
import { TierExhibit } from "@/components/tier-exhibit";

export const metadata: Metadata = {
  title: "Baijiu Tier System (四档梯队)",
  description:
    "Explore Chinese baijiu ranked across Tier I State Table (国宴) to Tier IV Daily Grain (口粮), or build and export your own tier list.",
  alternates: { canonical: "/tiers" },
  openGraph: {
    title: "Baijiu Tier System · 酒",
    description: "Inspect every bottle across Tier I–IV — State Table to Daily Grain.",
    url: "/tiers",
  },
};

export default function TiersPage() {
  return <TierExhibit />;
}
