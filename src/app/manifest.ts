import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} · ${SITE_NAME_ZH}`,
    short_name: "酒",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#c41e1e",
    theme_color: "#c41e1e",
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.png?v=2",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png?v=2",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png?v=2",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png?v=2",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png?v=2",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
