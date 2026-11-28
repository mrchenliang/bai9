import type { MetadataRoute } from "next";
import { brands, skus } from "@/catalog";
import { siteOrigin } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/tiers",
  "/guide",
  "/passport",
  "/price-bands",
  "/map",
  "/houses",
  "/aromas",
  "/about",
];

const STATIC_PRIORITY: Record<string, number> = {
  "/": 1,
  "/tiers": 0.9,
  "/guide": 0.9,
  "/map": 0.9,
  "/aromas": 0.85,
  "/price-bands": 0.85,
  "/houses": 0.85,
  "/passport": 0.8,
  "/about": 0.75,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const now = new Date();
  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${origin}${path}`,
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: STATIC_PRIORITY[path] ?? 0.7,
    })),
    ...brands.map((brand) => ({
      url: `${origin}/brand/${brand.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...skus.map((sku) => ({
      url: `${origin}/sku/${sku.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
