import type { Metadata } from "next";
import { PassportView } from "@/components/passport-view";

export const metadata: Metadata = {
  title: "Drinking Passport (喝过酒证)",
  description:
    "Stamp every Chinese baijiu specimen you have survived, get your curatorial rank, and download an archival PNG Passport Card.",
  alternates: { canonical: "/passport" },
  openGraph: {
    title: "Drinking Passport · 酒",
    description: "Stamp the bottles you’ve survived and export a museum passport card.",
    url: "/passport",
  },
};

export default function PassportPage() {
  return <PassportView />;
}
