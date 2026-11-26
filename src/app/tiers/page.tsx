import type { Metadata } from "next";
import { TierExhibit } from "@/components/tier-exhibit";

export const metadata: Metadata = {
  title: "Tier System",
};

export default function TiersPage() {
  return <TierExhibit />;
}
