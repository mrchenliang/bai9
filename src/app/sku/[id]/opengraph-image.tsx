import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { brandById, skuAroma, skuById, skus, tierById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META, SHOCK_LABELS } from "@/field-notes";
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
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
          }}
        >
          Chinese Baijiu Museum
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
  const tierText = `TIER ${numeral} · ${(tier?.en ?? "").toUpperCase()}`;
  const headerText = `CHINESE BAIJIU MUSEUM · SPECIMEN ${accession}`;
  const gbText = `${note.gbCode} · ${GB_KIND_META[note.gbKind].badge.split(" · ")[0]}`;
  const subText = `${brand.nameEn} · ${brand.provinceEn} · ${sku.abv}${sku.chinaPrice ? ` · ${sku.chinaPrice}` : ""}`;
  const quoteText = `"${note.tableSignal}"`;
  const shockText = `First-Timer Survival: ${note.shock}/5 (${SHOCK_LABELS[note.shock].title})`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          padding: 36,
          gap: 36,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: 440,
            height: 558,
            background: "#f6f6f8",
            border: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {imgData ? (
            <img
              src={imgData}
              alt={sku.nameEn}
              style={{ width: 400, height: 400, objectFit: "contain" }}
            />
          ) : null}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              background: sku.tier === "guoyan" ? "#c81e1e" : "#111111",
              color: "#ffffff",
              padding: "6px 12px",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.06em",
              display: "flex",
            }}
          >
            {tierText}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 18,
              color: "#767676",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
            }}
          >
            {accession}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "8px 4px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, color: "#c81e1e", fontWeight: 700, letterSpacing: "0.06em" }}>
                {headerText}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: note.gbKind === "pure" ? "#111111" : "#92400e",
                  border: "1px solid rgba(0,0,0,0.18)",
                  padding: "4px 10px",
                  fontWeight: 600,
                }}
              >
                {gbText}
              </span>
            </div>

            <div style={{ display: "flex", fontSize: 48, fontWeight: 700, color: "#111111", lineHeight: 1.08 }}>
              {sku.nameEn}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#525252" }}>
              {subText}
            </div>
          </div>

          <div
            style={{
              background: "#faf8f5",
              borderLeft: "5px solid #c81e1e",
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14, color: "#c81e1e", fontWeight: 700, letterSpacing: "0.1em" }}>
              TABLE SIGNAL
            </span>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#111111", lineHeight: 1.32 }}>
              {quoteText}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(0,0,0,0.1)",
              paddingTop: 18,
              fontSize: 16,
              color: "#525252",
            }}
          >
            <span>{shockText}</span>
            <span style={{ color: "#767676" }}>by @mr_chenliang</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
