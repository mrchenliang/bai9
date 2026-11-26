import type { Metadata } from "next";
import { ProvinceAtlas } from "@/components/province-atlas";

export const metadata: Metadata = {
  title: "Provincial Atlas (省份图)",
  description:
    "A 27-province atlas of Chinese baijiu distilleries — regional houses, aromas, and cross-links into the permanent collection.",
  alternates: { canonical: "/provinces" },
};

export default function ProvincesPage() {
  return <ProvinceAtlas />;
}
