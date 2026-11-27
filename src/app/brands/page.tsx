import type { Metadata } from "next";
import { BrandIndex } from "@/components/brand-index";

export const metadata: Metadata = {
  title: "Distillery Houses (酒厂)",
  description:
    "Field guide to 36 Chinese baijiu distillery houses — national table powers, single-house aroma standards, regional kings, and everyday Erguotou.",
  alternates: { canonical: "/brands" },
};

export default function BrandsPage() {
  return <BrandIndex />;
}
