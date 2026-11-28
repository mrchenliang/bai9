import { ImageResponse } from "next/og";
import { skuById, skus, tiers } from "@/catalog";
import {
  loadMuseumOgFonts,
  MuseumSealSvg,
  OG_CONTENT_TYPE,
  OG_SIZE,
  readPublicImageDataUri,
} from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Baijiu Tier System (四档梯队) — Tier I State Table to Tier IV Daily Grain";

const TIER_SHOWCASE = [
  {
    id: "guoyan",
    numeral: "I",
    accent: "#c81e1e",
    badgeBg: "#c81e1e",
    badgeFg: "#ffffff",
    skuIds: ["feitian", "puwu", "guojiao"],
  },
  {
    id: "mingjiu",
    numeral: "II",
    accent: "#111111",
    badgeBg: "#151413",
    badgeFg: "#ffffff",
    skuIds: ["qinghua-30", "crystal", "honghualang"],
  },
  {
    id: "jianiang",
    numeral: "III",
    accent: "#6b5c4d",
    badgeBg: "#ece6dc",
    badgeFg: "#2a2520",
    skuIds: ["dong-classic", "xifeng-green", "sanhua-52"],
  },
  {
    id: "kouliang",
    numeral: "IV",
    accent: "#8a8277",
    badgeBg: "#f2efe9",
    badgeFg: "#4b463f",
    skuIds: ["hongxing-56", "huanggai", "jiangxiao-40"],
  },
] as const;

export default async function TiersOpenGraphImage() {
  const tierText = tiers.map((t) => t.zh).join("");
  const cjkChars = `${SITE_NAME_ZH}四档梯队${tierText}`;

  const [typo, rows] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    Promise.all(
      TIER_SHOWCASE.map(async (row) => {
        const meta = tiers.find((t) => t.id === row.id);
        const count = skus.filter((s) => s.tier === row.id).length;
        const bottles = await Promise.all(
          row.skuIds.map(async (id) => {
            const sku = skuById(id);
            const src = await readPublicImageDataUri(sku?.image);
            return sku && src ? { id: sku.id, name: sku.nameEn, src } : null;
          }),
        );
        return {
          ...row,
          en: meta?.en ?? row.id,
          zh: meta?.zh ?? "",
          count,
          bottles: bottles.filter((b): b is NonNullable<typeof b> => b !== null),
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
                  CURATORIAL RANKINGS
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  Baijiu
                </div>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Tier System
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                四档梯队
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                Four Chinese table ranks from State Banquet icons to everyday grain staples — plus your own tier builder.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 34,
                paddingTop: 20,
                borderTop: "1px solid rgba(17,17,17,0.10)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1, letterSpacing: "-0.025em" }}>
                  I–IV
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  TABLE RANKS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1, letterSpacing: "-0.025em" }}>
                  {skus.length}
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  SPECIMENS
                </span>
              </div>
            </div>
          </div>

          {/* Right column: 4-tier museum board */}
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
                  STATE TABLE TO DAILY GRAIN
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 02 · TIERS
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "12px 0" }}>
              {rows.map((row) => (
                <div
                  key={row.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: row.id === "guoyan" ? "#fff8f6" : "#f7f5f0",
                    border: row.id === "guoyan" ? "1px solid rgba(200,30,30,0.22)" : "1px solid rgba(17,17,17,0.07)",
                    borderRadius: 18,
                    padding: "10px 14px",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: row.badgeBg,
                        color: row.badgeFg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        fontFamily: fontBold,
                      }}
                    >
                      {row.numeral}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 21, fontFamily: fontCjk, color: "#111111" }}>{row.zh}</span>
                        <span style={{ fontSize: 16, fontFamily: fontSemiBold, color: "#4e4942" }}>{row.en}</span>
                      </div>
                      <span style={{ fontSize: 12, fontFamily: fontSemiBold, color: "#8a8277", letterSpacing: "0.06em" }}>
                        {`${row.count} BOTTLES IN ARCHIVE`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {row.bottles.map((bottle) => (
                      <div
                        key={bottle.id}
                        style={{
                          width: 78,
                          height: 78,
                          borderRadius: 12,
                          overflow: "hidden",
                          background: "#ffffff",
                          border: "1px solid rgba(17,17,17,0.08)",
                          display: "flex",
                        }}
                      >
                        <img
                          src={bottle.src}
                          alt={bottle.name}
                          width={78}
                          height={78}
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
                Curatorial board · Drag-and-drop ranker &amp; PNG export
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
