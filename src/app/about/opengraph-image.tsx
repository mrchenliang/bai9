import { ImageResponse } from "next/og";
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
export const alt = "About Baijiu & Archive Notes (白酒溯源与档案说明) — Origins & curatorial method";

const ERAS = [
  {
    numeral: "I",
    era: "c. 7000 BCE – SHANG",
    titleEn: "Grain & Qu",
    titleZh: "谷酿与曲",
    image: "/images/history/bronze-jue.jpg",
  },
  {
    numeral: "II",
    era: "SONG – YUAN",
    titleEn: "Distillation",
    titleZh: "蒸馏烧酒",
    image: "/images/history/zeng-still.jpg",
  },
  {
    numeral: "III",
    era: "MING – QING",
    titleEn: "Mud Pits & Jars",
    titleZh: "窖池与陶坛",
    image: "/images/history/terracotta-jar.jpg",
  },
  {
    numeral: "IV",
    era: "1952 – PRESENT",
    titleEn: "National Liquors",
    titleZh: "名酒与国宴",
    image: "/images/history/banquet-cup.jpg",
  },
] as const;

export default async function AboutOpenGraphImage() {
  const cjkChars = `${SITE_NAME_ZH}白酒溯源与档案${ERAS.map((e) => e.titleZh).join("")}`;

  const [typo, plates] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    Promise.all(
      ERAS.map(async (era) => ({
        ...era,
        src: await readPublicImageDataUri(era.image),
      })),
    ),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;
  const rows = [plates.slice(0, 2), plates.slice(2, 4)];

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
                  ORIGINS &amp; ARCHIVE NOTES
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  Origins of
                </div>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Baijiu
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                白酒溯源与档案
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                Nine millennia of Chinese grain fermentation, solid-state distillation &amp; how this museum is curated.
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
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>4</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  HISTORIC ERAS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>5</span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  STATE TASTINGS
                </span>
              </div>
            </div>
          </div>

          {/* Right column: 2x2 ink illustration quad */}
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
                  CHRONOLOGY OF CHINESE DISTILLATION
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 07 · HISTORY
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "12px 0" }}>
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: "flex", gap: 14 }}>
                  {row.map((plate) => (
                    <div
                      key={plate.numeral}
                      style={{
                        flex: 1,
                        background: "#f7f5f0",
                        border: "1px solid rgba(17,17,17,0.075)",
                        borderRadius: 18,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: 146,
                          background: "#f6f3ec",
                          padding: "6px 10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        {plate.src ? (
                          <img
                            src={plate.src}
                            alt={plate.titleEn}
                            width={280}
                            height={134}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : null}
                      </div>
                      <div style={{ padding: "10px 14px 12px", display: "flex", flexDirection: "column", gap: 3 }}>
                        <span style={{ fontSize: 10, fontFamily: fontBold, color: "#c81e1e", letterSpacing: "0.11em" }}>
                          {`${plate.numeral} · ${plate.era}`}
                        </span>
                        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 6 }}>
                          <span style={{ fontSize: 16, fontFamily: fontBold, color: "#111111" }}>{plate.titleEn}</span>
                          <span style={{ fontSize: 14, fontFamily: fontCjk, color: "#6a645c" }}>{plate.titleZh}</span>
                        </div>
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
                What is baijiu · Solid-state qu · 1952–1989 medal history
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
