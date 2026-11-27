import type { Metadata } from "next";
import { AromaExplorer } from "@/components/aroma-explorer";

export const metadata: Metadata = {
  title: "Twelve Aromas (十二香型)",
  description:
    "Interactive guide to China’s twelve official baijiu aroma standards — grains, flavor profiles, palate matcher, and reference bottles.",
  alternates: { canonical: "/aromas" },
};

export default function AromasPage() {
  return <AromaExplorer />;
}
