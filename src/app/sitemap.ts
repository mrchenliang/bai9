import type { MetadataRoute } from "next";
import { brands, skus } from "@/catalog";
import { siteOrigin } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/tiers",
  "/table",
  "/passport",
  "/sheet",
  "/maps",
  "/brands",
  "/aromas",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${origin}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1 : path === "/tiers" || path === "/table" ? 0.9 : 0.7,
    })),
    ...brands.map((brand) => ({
      url: `${origin}/brand/${brand.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...skus.map((sku) => ({
      url: `${origin}/sku/${sku.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
