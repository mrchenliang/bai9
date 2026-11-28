import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/opengraph-image": ["./public/images/studio/**/*"],
    "/tiers/opengraph-image": ["./public/images/studio/**/*"],
    "/guide/opengraph-image": ["./public/images/studio/**/*"],
    "/price-bands/opengraph-image": ["./public/images/studio/**/*"],
    "/about/opengraph-image": ["./public/images/history/**/*"],
    "/brand/[id]/opengraph-image": ["./public/images/studio/**/*"],
    "/sku/[id]/opengraph-image": ["./public/images/studio/**/*"],
    "/api/passport-card": ["./public/images/studio/**/*"],
  },
};

export default nextConfig;
