import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brandById, skuAroma, skuById, skus, tierById } from "@/catalog";
import { fieldNoteFor } from "@/field-notes";
import { SITE_NAME } from "@/lib/site";
import type { TierId } from "@/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIER_NUMERAL: Record<TierId, string> = {
  guoyan: "I",
  mingjiu: "II",
  jianiang: "III",
  kouliang: "IV",
  export: "EX",
};

const ACCESSION_MAP = new Map<string, string>(
  skus.map((item, idx) => [item.id, `No. ${String(idx + 1).padStart(2, "0")}`]),
);

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

export default async function SkuOpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sku = skuById(id);
  const brand = sku ? brandById(sku.brandId) : null;

  if (!sku || !brand) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#f4f2ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
            color: "#111111",
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size },
    );
  }

  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const note = fieldNoteFor(sku, aroma?.id);
  const imgData = await readStudioBase64(sku.image);
  const accession = ACCESSION_MAP.get(sku.id) ?? "No. 00";
  const numeral = TIER_NUMERAL[sku.tier];
  const metaLine = [
    `Tier ${numeral}`,
    tier?.en,
    brand.provinceEn,
    sku.abv,
    sku.chinaPrice,
  ]
    .filter(Boolean)
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4f2ee",
          display: "flex",
          padding: 40,
          gap: 36,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            width: 480,
            height: 550,
            background: "#ffffff",
            borderRadius: 28,
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 18px 40px rgba(11,11,13,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {imgData ? (
            <img
              src={imgData}
              alt={sku.nameEn}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", fontSize: 72, fontWeight: 700, color: "#111111" }}>
              {brand.nameZh.slice(0, 2)}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              background: sku.tier === "guoyan" ? "#c81e1e" : "#111111",
              color: "#ffffff",
              padding: "8px 14px",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.06em",
              borderRadius: 999,
              display: "flex",
            }}
          >
            {`TIER ${numeral}`}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px 8px 6px 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  border: "2px solid #c81e1e",
                  color: "#c81e1e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  background: "#ffffff",
                }}
              >
                酒
              </div>
              <span style={{ fontSize: 18, color: "#7a756c", letterSpacing: "0.08em", fontWeight: 600 }}>
                {SITE_NAME.toUpperCase()} · {accession}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 56, fontWeight: 700, color: "#111111", lineHeight: 1.05 }}>
                {sku.nameEn}
              </div>
              <div style={{ fontSize: 28, color: "#6a655c", lineHeight: 1.2 }}>{sku.nameZh}</div>
              <div style={{ fontSize: 20, color: "#8a847a", marginTop: 4 }}>{metaLine}</div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderLeft: "5px solid #c81e1e",
              borderRadius: "0 18px 18px 0",
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 10px 28px rgba(11,11,13,0.06)",
            }}
          >
            <span style={{ fontSize: 14, color: "#c81e1e", fontWeight: 700, letterSpacing: "0.12em" }}>
              TABLE SIGNAL
            </span>
            <div style={{ fontSize: 28, fontWeight: 600, color: "#111111", lineHeight: 1.3 }}>
              {`“${note.tableSignal}”`}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
