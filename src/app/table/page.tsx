import type { Metadata } from "next";
import { TableAdvisor } from "@/components/table-advisor";

export const metadata: Metadata = {
  title: "What Bottle Do I Bring? (局酒指南)",
  description:
    "Chinese baijiu banquet survival calculator: pick occasion, province, and budget to get the culturally correct bottle and unspoken table etiquette.",
};

export default function TablePage() {
  return <TableAdvisor />;
}
