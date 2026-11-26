import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/sku/[id]/opengraph-image": ["./public/images/studio/**/*"],
  },
};

export default nextConfig;
