import type { Metadata } from "next";
import { BrandIndex } from "@/components/brand-index";

export const metadata: Metadata = {
  title: "Distillery Houses (酒厂)",
  description:
    "Browse the archived Chinese baijiu houses in the museum — Moutai, Wuliangye, Luzhou Laojiao, Fenjiu, and more.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <BrandIndex />;
}
