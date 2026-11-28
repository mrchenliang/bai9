import { ImageResponse } from "next/og";
import { skuById } from "@/catalog";
import {
  loadMuseumOgFonts,
  MuseumSealSvg,
  OG_CONTENT_TYPE,
  OG_SIZE,
  readPublicImageDataUri,
} from "@/lib/og";
import { priceSheet } from "@/sheet";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Six Baijiu Price Bands (六排价格带) — ¥40 everyday grain to ¥2,700 state-table icons";

const BAND_META = [
  { numeral: "I", range: "¥2,500+", label: "Apex & Collector", barPct: 100, color: "#c81e1e" },
  { numeral: "II", range: "¥850–1,400", label: "Head-Table Flagships", barPct: 82, color: "#c84638" },
  { numeral: "III", range: "¥850–1,400", label: "Sub-Apex Challengers", barPct: 72, color: "#d66854" },
  { numeral: "IV", range: "¥400–650", label: "Banquet Backbone", barPct: 54, color: "#d98872" },
  { numeral: "V", range: "¥210–400", label: "Business & Reunion", barPct: 38, color: "#a89d90" },
  { numeral: "VI", range: "¥40–80", label: "Daily Grain Staples", barPct: 20, color: "#7d766d" },
] as const;

export default async function PriceBandsOpenGraphImage() {
  const totalBottles = priceSheet.reduce((sum, band) => sum + band.length, 0);
  const cjkChars = `${SITE_NAME_ZH}六排价格带`;

  const [typo, bands] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    Promise.all(
      priceSheet.map(async (spots, idx) => {
        const meta = BAND_META[idx];
        const thumbs = await Promise.all(
          spots.slice(0, 3).map(async (spot) => {
            const sku = skuById(spot.skuId);
            const src = await readPublicImageDataUri(sku?.image);
            return src ? { id: spot.skuId, src } : null;
          }),
        );
        return {
          ...meta,
          count: spots.length,
          thumbs: thumbs.filter((t): t is NonNullable<typeof t> => t !== null),
        };
      }),
    ),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;

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
                  REFERENCE PRICE SHEET
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  Six Price
                </div>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Bands
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                六排价格带
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                How China’s baijiu shelf actually stratifies — from ¥2,500 state-table icons down to ¥40 daily pours.
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
                <span style={{ fontSize: 32, fontFamily: fontBold, color: "#111111", lineHeight: 1, letterSpacing: "-0.02em" }}>
                  ¥40–2.7k
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  CNY LADDER
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 32, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>
                  {totalBottles}
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  BENCHMARKS
                </span>
              </div>
            </div>
          </div>

          {/* Right column: 6-row Price Ladder */}
          <div
            style={{
              flex: 1,
              background: "#fdfcf9",
              borderRadius: 28,
              border: "1px solid rgba(17,17,17,0.085)",
              boxShadow: "0 24px 52px rgba(17,17,17,0.09), 0 2px 8px rgba(17,17,17,0.04)",
              padding: "20px 26px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
                <span style={{ fontSize: 12, fontFamily: fontBold, color: "#767066", letterSpacing: "0.11em" }}>
                  CHINA SHELF STRATIFICATION
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 05 · PRICING
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "12px 0" }}>
              {bands.map((band) => (
                <div
                  key={band.numeral}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: band.numeral === "I" ? "#fff8f6" : "#f7f5f0",
                    border: band.numeral === "I" ? "1px solid rgba(200,30,30,0.20)" : "1px solid rgba(17,17,17,0.07)",
                    borderRadius: 15,
                    padding: "8px 12px",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: band.numeral === "I" ? "#c81e1e" : "#151413",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontFamily: fontBold,
                      flexShrink: 0,
                    }}
                  >
                    {band.numeral}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 16, fontFamily: fontBold, color: "#111111" }}>{band.range}</span>
                      <span style={{ fontSize: 13, fontFamily: fontSemiBold, color: "#6f6960" }}>{band.label}</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: 6,
                        borderRadius: 999,
                        background: "rgba(17,17,17,0.07)",
                        display: "flex",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${band.barPct}%`,
                          height: "100%",
                          borderRadius: 999,
                          background: band.color,
                          display: "flex",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, width: 150, justifyContent: "flex-end" }}>
                    {band.thumbs.map((thumb) => (
                      <div
                        key={thumb.id}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 9,
                          overflow: "hidden",
                          background: "#ffffff",
                          border: "1px solid rgba(17,17,17,0.08)",
                          display: "flex",
                        }}
                      >
                        <img
                          src={thumb.src}
                          alt=""
                          width={44}
                          height={44}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
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
                6 reference bands · Direct links to every specimen dossier
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
