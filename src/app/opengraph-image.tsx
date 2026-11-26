import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { skus } from "@/catalog";
import { SITE_NAME, SITE_NAME_ZH, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} · ${SITE_NAME_ZH}`;

/** Iconic bottles that read clearly at iMessage preview size. */
const HERO_BOTTLES = ["feitian", "puwu", "guojiao"] as const;

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
          display: "flex",
          background: "#f4f2ee",
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 78% 55%, rgba(255,255,255,0.95) 0%, transparent 55%), linear-gradient(135deg, #efece6 0%, #f7f5f1 48%, #ebe7e0 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -80,
            bottom: -120,
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(200, 30, 30, 0.08)",
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
            padding: "52px 56px 48px",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 460,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingTop: 12,
              paddingBottom: 8,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  border: "3px solid #c81e1e",
                  color: "#c81e1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 52,
                  fontWeight: 700,
                  background: "#ffffff",
                  boxShadow: "0 10px 30px rgba(11,11,13,0.08)",
                }}
              >
                酒
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: "#c81e1e",
                    textTransform: "uppercase",
                  }}
                >
                  Permanent Archive
                </div>
                <div style={{ fontSize: 54, fontWeight: 700, color: "#111111", lineHeight: 1.05 }}>
                  {SITE_NAME}
                </div>
                <div style={{ fontSize: 28, color: "#6a655c", lineHeight: 1.2 }}>{SITE_NAME_ZH}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 28, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.25, maxWidth: 430 }}>
                {SITE_TAGLINE}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#7a756c", fontSize: 18 }}>
                <span>{skus.length} specimens</span>
                <span>·</span>
                <span>Tier I–IV</span>
                <span>·</span>
                <span>@mr_chenliang</span>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 18,
              paddingRight: 8,
            }}
          >
            {bottles.map(({ sku, src }, index) => (
              <div
                key={sku.id}
                style={{
                  width: index === 1 ? 220 : 190,
                  height: index === 1 ? 520 : 460,
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: "1px solid rgba(11,11,13,0.08)",
                  boxShadow: "0 18px 40px rgba(11,11,13,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: index === 1 ? 0 : 24,
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
