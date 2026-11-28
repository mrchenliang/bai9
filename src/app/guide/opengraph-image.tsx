import { ImageResponse } from "next/og";
import { giftPersonas } from "@/banquets";
import { skuById } from "@/catalog";
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
export const alt = "The Baijiu Guide (选酒指南) — Choosing, gifting, and pouring Chinese baijiu";

const GUIDE_CARDS = [
  {
    tag: "SAFE HERO",
    titleEn: "Future Father-in-Law",
    titleZh: "第一次见岳父",
    toastZh: "薄酒成双，敬祝安康",
    skuId: "puwu",
    highlight: true,
  },
  {
    tag: "WEDDING KING",
    titleEn: "Wedding & Graduation",
    titleZh: "婚宴 · 升学宴",
    toastZh: "金榜题名 · 喜结良缘",
    skuId: "crystal",
    highlight: false,
  },
  {
    tag: "INSIDER FLEX",
    titleEn: "Quiet Connoisseur Table",
    titleZh: "懂行暗秀之选",
    toastZh: "清雅绵甜 · 入口生津",
    skuId: "qinghua-30",
    highlight: false,
  },
] as const;

export default async function GuideOpenGraphImage() {
  const cjkChars = `${SITE_NAME_ZH}选酒指南${GUIDE_CARDS.map((c) => c.titleZh + c.toastZh).join("")}`;

  const [typo, cards] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    Promise.all(
      GUIDE_CARDS.map(async (card) => {
        const sku = skuById(card.skuId);
        const src = await readPublicImageDataUri(sku?.image);
        return {
          ...card,
          skuName: sku?.nameEn ?? "",
          skuPrice: sku?.chinaPrice ?? "",
          src,
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
                  TABLE &amp; GIFTING PLAYBOOK
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 36, height: 3, borderRadius: 999, background: "#c81e1e", display: "flex" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 0.98, letterSpacing: "-0.032em" }}>
                  The Baijiu
                </div>
                <div style={{ fontSize: 60, fontFamily: fontBold, color: "#111111", lineHeight: 1.02, letterSpacing: "-0.032em" }}>
                  Guide
                </div>
              </div>
              <div style={{ fontSize: 32, fontFamily: fontCjk, color: "#c81e1e", letterSpacing: "0.06em", lineHeight: 1.15 }}>
                选酒指南
              </div>
              <div style={{ fontSize: 19, fontFamily: fontRegular, color: "#57524b", lineHeight: 1.44, maxWidth: 382 }}>
                Choose the right bottle for any Chinese table, nail the handoff line, and dodge classic gifting traps.
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
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>
                  {giftPersonas.length}
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  MOMENTS
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <span style={{ fontSize: 34, fontFamily: fontBold, color: "#111111", lineHeight: 1 }}>
                  7
                </span>
                <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#7a7369", letterSpacing: "0.12em" }}>
                  REGIONAL RULES
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Occasion cue cards */}
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
                  BANQUET &amp; GIFTING SCENARIOS
                </span>
              </div>
              <span style={{ fontSize: 11, fontFamily: fontSemiBold, color: "#9a9287", letterSpacing: "0.10em" }}>
                PLATE 03 · GUIDE
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "12px 0" }}>
              {cards.map((card) => (
                <div
                  key={card.titleEn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    background: card.highlight ? "#fff8f6" : "#f7f5f0",
                    border: card.highlight ? "1px solid rgba(200,30,30,0.22)" : "1px solid rgba(17,17,17,0.07)",
                    borderRadius: 20,
                    padding: "12px 16px",
                  }}
                >
                  {card.src ? (
                    <div
                      style={{
                        width: 108,
                        height: 108,
                        borderRadius: 16,
                        overflow: "hidden",
                        background: "#ffffff",
                        border: "1px solid rgba(17,17,17,0.08)",
                        display: "flex",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={card.src}
                        alt={card.skuName}
                        width={108}
                        height={108}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ) : null}

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: fontBold,
                          color: card.highlight ? "#c81e1e" : "#767066",
                          letterSpacing: "0.12em",
                        }}
                      >
                        {card.tag}
                      </span>
                      <span style={{ fontSize: 14, fontFamily: fontCjk, color: "#9a9287" }}>{card.toastZh}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 22, fontFamily: fontBold, color: "#111111", letterSpacing: "-0.02em" }}>
                        {card.titleEn}
                      </span>
                      <span style={{ fontSize: 16, fontFamily: fontCjk, color: "#c81e1e" }}>{card.titleZh}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontFamily: fontSemiBold,
                          color: "#151413",
                          background: "#ffffff",
                          border: "1px solid rgba(17,17,17,0.10)",
                          padding: "4px 10px",
                          borderRadius: 999,
                        }}
                      >
                        {card.skuName}
                      </span>
                      {card.skuPrice ? (
                        <span style={{ fontSize: 13, fontFamily: fontSemiBold, color: "#6e675e" }}>{card.skuPrice}</span>
                      ) : null}
                    </div>
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
                Discovery spinner · Etiquette rules · Classic traps
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
