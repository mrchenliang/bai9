import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { skus } from "@/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Chinese Baijiu Museum · 中国白酒博物馆";

const HERO_BOTTLES = ["feitian", "guojiao", "puwu", "bofen", "honghualang"] as const;

async function readStudioBase64(imagePath?: string): Promise<string | null> {
  if (!imagePath || !imagePath.startsWith("/")) return null;
  try {
    const file = path.join(process.cwd(), "public", imagePath);
    const buf = await readFile(file);
    const ext = path.extname(file).toLowerCase() === ".png" ? "png" : "jpeg";
    return `data:image/${ext};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const featured = HERO_BOTTLES.map((id) => skus.find((sku) => sku.id === id)).filter(
    (sku): sku is NonNullable<typeof sku> => Boolean(sku?.image),
  );
  const images = await Promise.all(featured.map((sku) => readStudioBase64(sku.image)));
  const bottles = featured
    .map((sku, index) => ({ sku, src: images[index] }))
    .filter((item): item is { sku: (typeof featured)[number]; src: string } => Boolean(item.src));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0b0b0d",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 18% 20%, rgba(200,30,30,0.22), transparent 42%), radial-gradient(circle at 82% 78%, rgba(255,255,255,0.08), transparent 36%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "48px 56px",
            justifyContent: "space-between",
            alignItems: "stretch",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 520,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  border: "2px solid #c81e1e",
                  color: "#c81e1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                酒
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", letterSpacing: "0.08em" }}>
                  CHINESE BAIJIU MUSEUM
                </span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>
                  中国白酒博物馆
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ fontSize: 58, fontWeight: 700, color: "#ffffff", lineHeight: 1.05 }}>
                The grain spirits China actually argues about.
              </div>
              <div style={{ fontSize: 24, color: "rgba(255,255,255,0.68)", lineHeight: 1.35 }}>
                Permanent editorial archive — tiers, table signals, and tasting provenance.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, color: "rgba(255,255,255,0.55)", fontSize: 18 }}>
              <span>{skus.length} specimens</span>
              <span style={{ color: "rgba(255,255,255,0.28)" }}>·</span>
              <span>by @mr_chenliang</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 14,
              paddingBottom: 4,
            }}
          >
            {bottles.slice(0, 4).map(({ sku, src }, index) => (
              <div
                key={sku.id}
                style={{
                  width: index === 1 || index === 2 ? 168 : 148,
                  height: index === 1 || index === 2 ? 420 : 360,
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "#f6f6f8",
                  border: "1px solid rgba(255,255,255,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: index % 2 === 0 ? 28 : 0,
                }}
              >
                <img
                  src={src}
                  alt={sku.nameEn}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
