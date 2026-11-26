import type { Metadata } from "next";
import { BrandIndex } from "@/components/brand-index";

export const metadata: Metadata = {
  title: "品牌",
};

export default function BrandsPage() {
  return <BrandIndex />;
}
