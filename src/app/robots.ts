import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
    ...(productionHost ? { host: productionHost } : {}),
  };
}
