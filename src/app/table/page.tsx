import type { Metadata } from "next";
import { TableAdvisor } from "@/components/table-advisor";

export const metadata: Metadata = {
  title: "Baijiu Guide — Find Your Bottle (选酒指南)",
  description:
    "Discover the right Chinese baijiu for any table: explore tasting moments, set occasion, region, and spend, and uncover flavor notes and regional etiquette.",
  alternates: { canonical: "/table" },
  openGraph: {
    title: "Baijiu Guide · 选酒指南",
    description: "Discover the culturally right bottle — flavor notes, insider backups, and unspoken table rules.",
    url: "/table",
  },
};

export default function TablePage() {
  return <TableAdvisor />;
}
