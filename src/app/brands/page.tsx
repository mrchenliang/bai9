import type { Metadata } from "next";
import { BrandIndex } from "@/components/brand-index";

export const metadata: Metadata = {
  title: "Distillery Houses",
};

export default function BrandsPage() {
  return <BrandIndex />;
}
