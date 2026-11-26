import type { Metadata } from "next";
import { PassportView } from "@/components/passport-view";

export const metadata: Metadata = {
  title: "Drinking Passport (喝过酒证)",
  description:
    "Stamp every Chinese baijiu specimen you have survived, get your curatorial rank, and download an archival PNG Passport Card.",
};

export default function PassportPage() {
  return <PassportView />;
}
