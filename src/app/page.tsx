import type { Metadata } from "next";
import { Collection } from "@/components/collection";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} · 酒` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} · 酒`,
    description: SITE_TAGLINE,
    url: "/",
  },
};

export default function Page() {
  return <Collection />;
}
