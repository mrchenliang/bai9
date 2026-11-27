import type { Metadata } from "next";
import { ProvinceAtlas } from "@/components/province-atlas";

export const metadata: Metadata = {
  title: "China Baijiu Map (白酒地图)",
  description:
    "Interactive SVG map and list view of 27 Chinese baijiu provinces — regional distilleries, house emblems, local drinking culture, and food pairings.",
  alternates: { canonical: "/maps" },
};

export default function MapsPage() {
  return <ProvinceAtlas />;
}
