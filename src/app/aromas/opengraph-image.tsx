import { ImageResponse } from "next/og";
import { aromas, brandById } from "@/catalog";
import { loadMuseumOgFonts, MuseumSealSvg, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Twelve Baijiu Aromas (十二香型) — Official Chinese grain spirit flavor standards";

const AROMA_PALETTE: Record<string, { bg: string; fg: string; glyph: string }> = {
  jiang: { bg: "#b91c1c", fg: "#fef3c7", glyph: "酱" },
  nong: { bg: "#9a3412", fg: "#fff7ed", glyph: "浓" },
  qing: { bg: "#1e40af", fg: "#f8fafc", glyph: "清" },
  mi: { bg: "#047857", fg: "#ecfdf5", glyph: "米" },
  feng: { bg: "#15803d", fg: "#fef9c3", glyph: "凤" },
  jian: { bg: "#a16207", fg: "#fefce8", glyph: "兼" },
  dong: { bg: "#166534", fg: "#fef2f2", glyph: "董" },
  zhima: { bg: "#78350f", fg: "#fde68a", glyph: "芝" },
  chi: { bg: "#0f766e", fg: "#f0fdfa", glyph: "豉" },
  te: { bg: "#991b1b", fg: "#fef08a", glyph: "特" },
  laobaigan: { bg: "#1f2937", fg: "#ffffff", glyph: "白" },
  fuyu: { bg: "#be123c", fg: "#fef3c7", glyph: "馥" },
};

export default async function AromasOpenGraphImage() {
  const twelve = aromas.filter((a) => a.id !== "prepared").slice(0, 12);
  const cjkChars = `${SITE_NAME_ZH}十二香型${twelve
    .map((a) => `${a.zh}${AROMA_PALETTE[a.id]?.glyph ?? ""}`)
    .join("")}`;

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = await loadMuseumOgFonts(cjkChars);

  const items = twelve.map((aroma) => {
    const refBrand = brandById(aroma.referenceBrandId);
    const tone = AROMA_PALETTE[aroma.id] ?? { bg: "#27272a", fg: "#ffffff", glyph: aroma.zh.slice(0, 1) };
    return {
      id: aroma.id,
      zh: aroma.zh,
      en: aroma.en.replace(/\s+aroma$/i, ""),
      refEn: refBrand?.nameEn ?? "",
      ...tone,
    };
  });

  const rows = [items.slice(0, 3), items.slice(3, 6), items.slice(6, 9), items.slice(9, 12)];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #f7f4ee 0%, #f1ede5 55%, #e9e3d8 100%)",
          fontFamily: fontRegular,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 74% 48%, rgba(255,255,255,0.92) 0%, transparent 56%), radial-gradient(circle at 8% 92%, rgba(200,30,30,0.09) 0%, transparent 42%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "38px 42px",
            gap: 32,
            alignItems: "stretch",
          }}
        >
          {/* Left column */}
          <div
            style={{
              width: 408,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MuseumSealSvg size={38} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 13, color: "#767066", letterSpacing: "0.12em", fontFamily: fontBold }}>
                  {SITE_NAME.toUpperCase()}
                </span>
                <span style={{ fontSize: 12, color: "#a0988d", letterSpacing: "0.08em", fontFamily: fontSemiBold }}>
                  FLAVOR TAXONOMY
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 62, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  Twelve
                </div>
                <div style={{ fontSize: 62, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Aromas
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                十二香型
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                China’s official baijiu aroma standards — fermentation pits, grain bills, palate matcher &amp; reference bottles.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 32,
                paddingTop: 20,
                borderTop: "1px solid rgba(17,17,17,0.10)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>12</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  STANDARDS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>4</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  FOUNDATION FAMILIES
                </span>
              </div>
            </div>
          </div>

          {/* Right column: 3x4 Aroma Specimen Grid */}
          <div
            style={{
              flex: 1,
              background: "#fdfcf9",
              borderRadius: 28,
              border: "1px solid rgba(17,17,17,0.085)",
              boxShadow: "0 24px 52px rgba(17,17,17,0.09), 0 2px 8px rgba(17,17,17,0.04)",
              padding: "20px 24px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
                <span style={{ fontSize: 12, fontFamily: fontBold, color: "#767066", letterSpacing: "0.11em" }}>
                  OFFICIAL GB/T AROMA SPECTRUM
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 04 · AROMAS
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 11, margin: "12px 0" }}>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", gap: 11 }}>
                  {row.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        flex: 1,
                        background: "#f7f5f0",
                        border: "1px solid rgba(17,17,17,0.075)",
                        borderRadius: 16,
                        padding: "11px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 11,
                          background: item.bg,
                          color: item.fg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 21,
                          fontFamily: fontCjk,
                          flexShrink: 0,
                        }}
                      >
                        {item.glyph}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <span style={{ fontSize: 16, fontFamily: fontBold, color: "#111111", lineHeight: 1.1 }}>
                          {item.en}
                        </span>
                        <span style={{ fontSize: 13, fontFamily: fontCjk, color: "#5f584f", lineHeight: 1.15 }}>
                          {item.zh}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#968e83", lineHeight: 1.1 }}>
                          {item.refEn}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "1px solid rgba(17,17,17,0.06)",
              }}
            >
              <span style={{ fontSize: 12, fontFamily: fontSemiBold, color: "#767066" }}>
                Grain profiles · Qu starters · Interactive palate matcher
              </span>
              <span style={{ fontSize: 12, fontFamily: fontCjk, color: "#8a8277", letterSpacing: "0.06em" }}>
                {SITE_NAME_ZH}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, ...fontOptions },
  );
}
