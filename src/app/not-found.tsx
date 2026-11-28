import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found (查无此页)",
  description: "That bottle, distillery, or page is not in the Chinese Baijiu Museum archive.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    title: "Page Not Found · 查无此页",
    description: "That page is not in the Chinese Baijiu Museum archive.",
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Not Found · 查无此页",
    description: "That page is not in the Chinese Baijiu Museum archive.",
    creator: "@mr_chenliang",
  },
};

const RECOVERY_LINKS = [
  { href: "/map", label: "China Baijiu Map" },
  { href: "/tiers", label: "Tier System" },
  { href: "/guide", label: "The Guide" },
  { href: "/houses", label: "Distillery Houses" },
  { href: "/aromas", label: "Twelve Aromas" },
] as const;

export default function NotFound() {
  return (
    <>
      <p className="kicker">酒 · 404</p>
      <h1>
        Page Not Found <span className="zh-inline">查无此页</span>
      </h1>
      <p className="sub">That bottle, distillery, or archive page could not be found.</p>
      <div className="actions">
        <Link className="btn solid" href="/">
          Back to collection
        </Link>
        {RECOVERY_LINKS.map((item) => (
          <Link key={item.href} className="btn" href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
