import { ImageResponse } from "next/og";
import { brandById, skuAroma, skuById, skus, tierById } from "@/catalog";
import { fieldNoteFor, GB_KIND_META } from "@/field-notes";
import {
  loadMuseumOgFonts,
  MuseumSealSvg,
  OG_CONTENT_TYPE,
  OG_SIZE,
  readPublicImageDataUri,
} from "@/lib/og";
import { SITE_NAME } from "@/lib/site";
import type { TierId } from "@/types";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} specimen card`;

export function generateStaticParams() {
  return skus.map((sku) => ({ id: sku.id }));
}

const TIER_NUMERAL: Record<TierId, string> = {
  guoyan: "I",
  mingjiu: "II",
  jianiang: "III",
  kouliang: "IV",
};

const ACCESSION_MAP = new Map<string, string>(
  skus.map((item, idx) => [item.id, `NO. ${String(idx + 1).padStart(2, "0")}`]),
);

function titleFontSize(nameEn: string): number {
  if (nameEn.length <= 16) return 54;
  if (nameEn.length <= 23) return 46;
  return 40;
}

function signalFontSize(signal: string): number {
  if (signal.length <= 72) return 26;
  if (signal.length <= 96) return 23;
  return 21;
}

function compactAbv(rawAbv: string, maxAbv: number): string {
  const exact = rawAbv.trim().match(/^(\d+(?:\.\d+)?)%\s*vol$/i);
  if (exact) return `${exact[1]}% vol`;
  return `${maxAbv}% vol`;
}

function compactVolume(rawVolume: string): string | null {
  const match = rawVolume.match(/(\d+(?:\.\d+)?)\s*ml/i);
  return match ? `${match[1]} ml` : null;
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
    const { fontOptions, fontBold } = await loadMuseumOgFonts();
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
            fontFamily: fontBold,
            color: "#111111",
          }}
        >
          {SITE_NAME}
        </div>
      ),
      { ...size, ...fontOptions },
    );
  }

  const aroma = skuAroma(sku);
  const tier = tierById(sku.tier);
  const note = fieldNoteFor(sku, aroma?.id);
  const gbMeta = GB_KIND_META[note.gbKind];
  const cjkChars = `${sku.nameZh}${brand.nameZh}${tier?.zh ?? ""}${gbMeta.zh}局意`;

  const [typo, imgData] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    readPublicImageDataUri(sku.image),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;
  const accession = ACCESSION_MAP.get(sku.id) ?? "NO. 00";
  const numeral = TIER_NUMERAL[sku.tier];
  const tierEnBadge = `TIER ${numeral}`;
  const tierZhBadge = tier?.zh ?? "";
  const originLine = [brand.provinceEn, aroma?.en, tier?.en].filter(Boolean).join(" · ");
  const specLabel = [compactAbv(sku.abv, note.maxAbv), compactVolume(sku.volume)]
    .filter(Boolean)
    .join(" · ");

  const gbTone =
    note.gbKind === "pure"
      ? { bg: "#ffffff", border: "rgba(11,11,13,0.14)", color: "#1a1a1a", dot: "#16a34a" }
      : note.gbKind === "blended"
        ? { bg: "#fef7ec", border: "rgba(180,83,9,0.28)", color: "#92400e", dot: "#d97706" }
        : { bg: "#f2f7f4", border: "rgba(21,128,61,0.24)", color: "#166534", dot: "#15803d" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f6f4ef 0%, #f1eee8 60%, #eae6de 100%)",
          display: "flex",
          padding: 40,
          gap: 36,
          fontFamily: fontRegular,
        }}
      >
        <div
          style={{
            width: 550,
            height: 550,
            background: "#f2f0ec",
            borderRadius: 26,
            border: "1px solid rgba(11,11,13,0.08)",
            boxShadow: "0 20px 44px rgba(11,11,13,0.10)",
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
              width={550}
              height={550}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ display: "flex", fontSize: 72, fontFamily: fontCjk, color: "#111111" }}>
              {brand.nameZh.slice(0, 2)}
            </div>
          )}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: 18,
              background: sku.tier === "guoyan" ? "#c81e1e" : "#111111",
              color: "#ffffff",
              padding: "8px 16px",
              fontSize: 16,
              letterSpacing: "0.06em",
              borderRadius: 999,
              boxShadow: "0 6px 18px rgba(11,11,13,0.18)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span style={{ fontFamily: fontBold }}>{tierEnBadge}</span>
            {tierZhBadge ? (
              <>
                <span style={{ fontFamily: fontRegular, opacity: 0.72 }}>·</span>
                <span style={{ fontFamily: fontCjk, opacity: 0.96 }}>{tierZhBadge}</span>
              </>
            ) : null}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "6px 0",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MuseumSealSvg size={38} />
              <span
                style={{
                  fontSize: 16,
                  color: "#767066",
                  letterSpacing: "0.10em",
                  fontFamily: fontBold,
                }}
              >
                {`${SITE_NAME.toUpperCase()} · ${accession}`}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  fontSize: titleFontSize(sku.nameEn),
                  fontFamily: fontBold,
                  color: "#111111",
                  lineHeight: 1.05,
                  letterSpacing: "-0.025em",
                }}
              >
                {sku.nameEn}
              </div>
              <div style={{ fontSize: 28, fontFamily: fontCjk, color: "#524d46", lineHeight: 1.2 }}>
                {sku.nameZh}
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#7d776d", marginTop: 2 }}>
                {originLine}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              {sku.chinaPrice ? (
                <div
                  style={{
                    background: "#111111",
                    color: "#ffffff",
                    padding: "8px 14px",
                    borderRadius: 10,
                    fontSize: 18,
                    fontFamily: fontBold,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {sku.chinaPrice}
                </div>
              ) : null}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(11,11,13,0.12)",
                  color: "#1a1a1a",
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 17,
                  fontFamily: fontSemiBold,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {specLabel}
              </div>
              <div
                style={{
                  background: gbTone.bg,
                  border: `1px solid ${gbTone.border}`,
                  color: gbTone.color,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: gbTone.dot,
                    display: "flex",
                    marginRight: 2,
                  }}
                />
                <span style={{ fontFamily: fontSemiBold }}>{note.gbCode}</span>
                <span style={{ fontFamily: fontRegular, opacity: 0.55 }}>·</span>
                <span style={{ fontFamily: fontCjk }}>{gbMeta.zh}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              borderLeft: "5px solid #c81e1e",
              borderTop: "1px solid rgba(11,11,13,0.06)",
              borderRight: "1px solid rgba(11,11,13,0.06)",
              borderBottom: "1px solid rgba(11,11,13,0.06)",
              borderRadius: "0 18px 18px 0",
              padding: "24px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 10px 28px rgba(11,11,13,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                color: "#c81e1e",
                letterSpacing: "0.12em",
              }}
            >
              <span style={{ fontFamily: fontBold }}>TABLE SIGNAL</span>
              <span style={{ fontFamily: fontRegular, opacity: 0.6 }}>·</span>
              <span style={{ fontFamily: fontCjk }}>局意</span>
            </div>
            <div
              style={{
                fontSize: signalFontSize(note.tableSignal),
                fontFamily: fontSemiBold,
                color: "#111111",
                lineHeight: 1.32,
              }}
            >
              {`“${note.tableSignal}”`}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...fontOptions },
  );
}
