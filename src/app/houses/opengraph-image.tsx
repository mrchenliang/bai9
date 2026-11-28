import { ImageResponse } from "next/og";
import { brandById, brands } from "@/catalog";
import { houseChapters } from "@/houses";
import { brandCrestFor, loadMuseumOgFonts, MuseumSealSvg, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `Chinese Baijiu Distillery Houses (酒厂) — Field guide to ${brands.length} heritage houses`;

const SHOWCASE_BRAND_IDS = [
  "moutai",
  "wuliangye",
  "luzhou",
  "fenjiu",
  "jiannanchun",
  "langjiu",
  "yanghe",
  "gujing",
  "xifeng",
  "xijiu",
  "jiugui",
  "hongxing",
] as const;

export default async function HousesOpenGraphImage() {
  const showcase = SHOWCASE_BRAND_IDS.map((id) => brandById(id)).filter(
    (b): b is NonNullable<typeof b> => Boolean(b),
  );
  const goldCount = brands.filter((b) => b.medals.length > 0).length;

  const cjkChars = `${SITE_NAME_ZH}中国名酒厂${showcase
    .map((b) => `${b.nameZh}${brandCrestFor(b.id, b.nameZh, b.aroma).glyph}`)
    .join("")}`;

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = await loadMuseumOgFonts(cjkChars);
  const rows = [showcase.slice(0, 4), showcase.slice(4, 8), showcase.slice(8, 12)];

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
                  DISTILLERY DIRECTORY
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  Distillery
                </div>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Houses
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                中国名酒厂
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                National table powers, single-house aroma standards, regional kings &amp; everyday Erguotou.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 30,
                paddingTop: 20,
                borderTop: "1px solid rgba(17,17,17,0.10)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>{brands.length}</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  HOUSES
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>
                  {houseChapters.length}
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  CHAPTERS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>{goldCount}</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  GOLD WINNERS
                </span>
              </div>
            </div>
          </div>

          {/* Right column: 4x3 Heritage Seal Mosaic */}
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
                  HERITAGE HOUSE EMBLEMS
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 06 · HOUSES
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "12px 0" }}>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", gap: 12 }}>
                  {row.map((brand) => {
                    const crest = brandCrestFor(brand.id, brand.nameZh, brand.aroma);
                    return (
                      <div
                        key={brand.id}
                        style={{
                          flex: 1,
                          background: "#f7f5f0",
                          border: "1px solid rgba(17,17,17,0.075)",
                          borderRadius: 18,
                          padding: "14px 10px 12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 54,
                            height: 54,
                            borderRadius: 15,
                            background: crest.bg,
                            color: crest.fg,
                            border: `2px solid ${crest.accent}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 28,
                            fontFamily: fontCjk,
                            boxShadow: "0 6px 14px rgba(17,17,17,0.12)",
                          }}
                        >
                          {crest.glyph}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: 14, fontFamily: fontBold, color: "#111111", lineHeight: 1.15 }}>
                            {brand.nameEn}
                          </span>
                          <span style={{ fontSize: 12, fontFamily: fontCjk, color: "#7a7369", lineHeight: 1.2 }}>
                            {brand.nameZh}
                          </span>
                        </div>
                      </div>
                    );
                  })}
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
                1952–1989 National Famous Liquor medalists &amp; regional leaders
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
