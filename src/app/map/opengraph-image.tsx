import { ImageResponse } from "next/og";
import { CHINA_VIEWBOX, chinaMapProvinces, PROVINCE_PINS } from "@/china-map";
import { loadMuseumOgFonts, MuseumSealSvg, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";
import { provincesAtlas, REGIONS, totalRegionalHouses } from "@/provinces";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `China Baijiu Map (中国白酒地图) — ${provincesAtlas.length} provinces, ${totalRegionalHouses} regional distilleries`;

const VIEWBOX_W = 774;
const VIEWBOX_H = 569;
const MAP_W = 616;
const MAP_H = 453;

interface FeaturedMapPin {
  id: string;
  labelZh: string;
  glyph: string;
  bg: string;
  fg: string;
  /** Pill center offset in viewBox coordinates to guarantee zero overlap */
  dx?: number;
  dy?: number;
  featured?: boolean;
}

/** Curated geographically balanced flagship houses spanning all 7 regions */
const FEATURED_PINS: FeaturedMapPin[] = [
  { id: "xinjiang", labelZh: "伊力特", glyph: "伊", bg: "#1e3a8a", fg: "#fde68a", dx: 4, dy: 4 },
  { id: "heilongjiang", labelZh: "北大仓", glyph: "仓", bg: "#991b1b", fg: "#fef3c7", dx: -16, dy: 8 },
  { id: "beijing", labelZh: "红星", glyph: "星", bg: "#dc2626", fg: "#ffffff", dx: 42, dy: -16 },
  { id: "shanxi", labelZh: "汾酒", glyph: "汾", bg: "#1e3a8a", fg: "#ffffff", dx: -10, dy: -8 },
  { id: "shaanxi", labelZh: "西凤", glyph: "凤", bg: "#15803d", fg: "#fef9c3", dx: -14, dy: 6 },
  { id: "jiangsu", labelZh: "洋河", glyph: "洋", bg: "#1d4ed8", fg: "#f0f9ff", dx: 34, dy: -4 },
  { id: "sichuan", labelZh: "五粮液", glyph: "五", bg: "#991b1b", fg: "#fde68a", dx: -12, dy: -2, featured: true },
  { id: "guizhou", labelZh: "茅台", glyph: "茅", bg: "#b91c1c", fg: "#fef3c7", dx: 6, dy: 14, featured: true },
  { id: "guangdong", labelZh: "玉冰烧", glyph: "玉", bg: "#0f766e", fg: "#f0fdfa", dx: 24, dy: 14 },
];

const FEATURED_PIN_IDS = new Set(FEATURED_PINS.map((pin) => pin.id));

const CJK_GLYPHS = `${SITE_NAME_ZH}中国白酒地图${FEATURED_PINS.map((pin) => pin.labelZh + pin.glyph).join("")}`;

function mapFillForCount(count: number): string {
  if (count >= 10) return "#c84638";
  if (count >= 6) return "#d97864";
  if (count >= 3) return "#e5a08e";
  if (count >= 1) return "#efcabd";
  return "#ece8e0";
}

export default async function MapOpenGraphImage() {
  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = await loadMuseumOgFonts(CJK_GLYPHS);

  const countsById = new Map<string, number>(
    provincesAtlas.map((prov) => [prov.id, prov.houses.length]),
  );

  const legendSwatches = [
    { color: "#efcabd", label: "1–2" },
    { color: "#e5a08e", label: "3–5" },
    { color: "#d97864", label: "6–9" },
    { color: "#c84638", label: "10+" },
  ];

  const stats = [
    { value: String(provincesAtlas.length), label: "PROVINCES" },
    { value: String(REGIONS.length), label: "REGIONS" },
    { value: String(totalRegionalHouses), label: "HOUSES" },
  ];

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
        {/* Warm gallery ambient spotlight + soft cinnabar wash */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 72% 48%, rgba(255,255,255,0.90) 0%, transparent 56%), radial-gradient(circle at 8% 92%, rgba(200,30,30,0.09) 0%, transparent 42%)",
            display: "flex",
          }}
        />

        {/* Main 2-column museum layout */}
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
          {/* Left column: Museum placard typography */}
          <div
            style={{
              width: 408,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            {/* Brand mark lockup */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MuseumSealSvg size={38} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span
                  style={{
                    fontSize: 13,
                    color: "#767066",
                    letterSpacing: "0.12em",
                    fontFamily: fontBold,
                  }}
                >
                  {SITE_NAME.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#a0988d",
                    letterSpacing: "0.08em",
                    fontFamily: fontSemiBold,
                  }}
                >
                  PROVINCIAL ATLAS
                </span>
              </div>
            </div>

            {/* Center title & calligraphy */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 3,
                  borderRadius: 999,
                  background: "#c81e1e",
                  display: "flex",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div
                  style={{
                    fontSize: 64,
                    fontFamily: fontBold,
                    color: "#111111",
                    lineHeight: 0.98,
                    letterSpacing: "-0.032em",
                  }}
                >
                  China
                </div>
                <div
                  style={{
                    fontSize: 64,
                    fontFamily: fontBold,
                    color: "#111111",
                    lineHeight: 1.02,
                    letterSpacing: "-0.032em",
                  }}
                >
                  Baijiu Map
                </div>
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontFamily: fontCjk,
                  color: "#c81e1e",
                  letterSpacing: "0.06em",
                  lineHeight: 1.15,
                }}
              >
                中国白酒地图
              </div>
              <div
                style={{
                  fontSize: 19,
                  fontFamily: fontRegular,
                  color: "#57524b",
                  lineHeight: 1.44,
                  maxWidth: 382,
                  marginTop: 2,
                }}
              >
                Regional distilleries, house emblems, local drinking rituals &amp; hometown pairings.
              </div>
            </div>

            {/* Bottom museum spec bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                paddingTop: 20,
                borderTop: "1px solid rgba(17,17,17,0.10)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
                {stats.map((stat) => (
                  <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontSize: 34,
                        fontFamily: fontBold,
                        color: "#111111",
                        lineHeight: 1,
                        letterSpacing: "-0.025em",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: fontSemiBold,
                        color: "#7a7369",
                        letterSpacing: "0.12em",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Elevated archival cartographic plate */}
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
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Subtle cartographic plate header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "#c81e1e",
                    display: "flex",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: fontBold,
                    color: "#767066",
                    letterSpacing: "0.11em",
                  }}
                >
                  REGIONAL DISTILLERY ATLAS
                </span>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontFamily: fontSemiBold,
                  color: "#9a9287",
                  letterSpacing: "0.10em",
                }}
              >
                PLATE 01 · CN
              </span>
            </div>

            {/* Vector China map + floating heritage brand pins */}
            <div
              style={{
                position: "relative",
                width: MAP_W,
                height: MAP_H,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <svg
                width={MAP_W}
                height={MAP_H}
                viewBox={CHINA_VIEWBOX}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                {/* Faint cartographic graticule */}
                <line x1="0" y1="142" x2="774" y2="142" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="0" y1="284" x2="774" y2="284" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="0" y1="426" x2="774" y2="426" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="194" y1="0" x2="194" y2="569" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="387" y1="0" x2="387" y2="569" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="580" y1="0" x2="580" y2="569" stroke="rgba(17,17,17,0.04)" strokeWidth="1" strokeDasharray="4 6" />

                {/* Province polygons */}
                {chinaMapProvinces.map((prov) => {
                  const count = prov.atlasId ? (countsById.get(prov.atlasId) ?? 0) : 0;
                  return (
                    <path
                      key={prov.svgId}
                      d={prov.path}
                      fill={mapFillForCount(count)}
                      stroke="#fdfcf9"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  );
                })}

                {/* Quiet locator dots for the remaining non-badged atlas provinces */}
                {provincesAtlas
                  .filter((prov) => !FEATURED_PIN_IDS.has(prov.id))
                  .map((prov) => {
                    const coords = PROVINCE_PINS[prov.id];
                    if (!coords) return null;
                    return (
                      <circle
                        key={`dot-${prov.id}`}
                        cx={coords.x}
                        cy={coords.y}
                        r="3"
                        fill="#ffffff"
                        stroke="#8f2d24"
                        strokeWidth="1.3"
                        opacity="0.88"
                      />
                    );
                  })}

                {/* Leader lines & anchor dots for offset featured pins */}
                {FEATURED_PINS.map((pin) => {
                  const coords = PROVINCE_PINS[pin.id];
                  if (!coords) return null;
                  const dx = pin.dx ?? 0;
                  const dy = pin.dy ?? 0;
                  const tx = coords.x + dx;
                  const ty = coords.y + dy;
                  return (
                    <g key={`leader-${pin.id}`}>
                      {Math.abs(dx) > 6 || Math.abs(dy) > 6 ? (
                        <line
                          x1={coords.x}
                          y1={coords.y}
                          x2={tx}
                          y2={ty}
                          stroke="#2a2623"
                          strokeWidth="1.25"
                          strokeDasharray="3 2.5"
                          opacity="0.6"
                        />
                      ) : null}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="3.4"
                        fill={pin.featured ? "#c81e1e" : "#1f1f24"}
                        stroke="#ffffff"
                        strokeWidth="1.3"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* HTML heritage brand pill badges for razor-sharp typography & shadow */}
              {FEATURED_PINS.map((pin) => {
                const coords = PROVINCE_PINS[pin.id];
                if (!coords) return null;
                const tx = coords.x + (pin.dx ?? 0);
                const ty = coords.y + (pin.dy ?? 0);
                const left = (tx / VIEWBOX_W) * MAP_W;
                const top = (ty / VIEWBOX_H) * MAP_H;
                const isDark = Boolean(pin.featured);

                return (
                  <div
                    key={`badge-${pin.id}`}
                    style={{
                      position: "absolute",
                      left: left - 80,
                      top: top - 15,
                      width: 160,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 10px 3px 4px",
                        borderRadius: 999,
                        background: isDark ? "#151413" : "#ffffff",
                        border: isDark
                          ? "1.5px solid rgba(255,255,255,0.85)"
                          : "1px solid rgba(17,17,17,0.16)",
                        boxShadow: isDark
                          ? "0 6px 16px rgba(17,17,17,0.24)"
                          : "0 4px 12px rgba(17,17,17,0.12)",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          background: pin.bg,
                          color: pin.fg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontFamily: fontCjk,
                        }}
                      >
                        {pin.glyph}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontFamily: fontCjk,
                          color: isDark ? "#ffffff" : "#151413",
                          lineHeight: 1,
                        }}
                      >
                        {pin.labelZh}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom choropleth legend & museum watermark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 10,
                borderTop: "1px solid rgba(17,17,17,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: fontSemiBold,
                    color: "#8a8277",
                    letterSpacing: "0.08em",
                  }}
                >
                  HOUSES
                </span>
                {legendSwatches.map((swatch) => (
                  <div key={swatch.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: 3,
                        background: swatch.color,
                        display: "flex",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: fontSemiBold,
                        color: "#6b655c",
                      }}
                    >
                      {swatch.label}
                    </span>
                  </div>
                ))}
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontFamily: fontCjk,
                  color: "#8a8277",
                  letterSpacing: "0.06em",
                }}
              >
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
