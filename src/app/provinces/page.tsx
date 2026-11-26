import type { Metadata } from "next";
import { ProvinceAtlas } from "@/components/province-atlas";

export const metadata: Metadata = {
  title: "Provincial Atlas",
};

export default function ProvincesPage() {
  return <ProvinceAtlas />;
}
