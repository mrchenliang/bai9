import type { MetadataRoute } from "next";
import { brands, skus } from "@/catalog";

const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const STATIC_PATHS = [
  "/",
  "/tiers",
  "/table",
  "/passport",
  "/sheet",
  "/banquets",
  "/medals",
  "/provinces",
  "/brands",
  "/aromas",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${siteOrigin}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : 0.7,
    })),
    ...brands.map((brand) => ({
      url: `${siteOrigin}/brand/${brand.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...skus.map((sku) => ({
      url: `${siteOrigin}/sku/${sku.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
