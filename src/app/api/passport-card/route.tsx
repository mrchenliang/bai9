import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { skuById } from "@/catalog";
import { loadMuseumOgFonts, MuseumSealSvg, OG_SIZE, readPublicImageDataUri } from "@/lib/og";
import { computePassportSummary, parseStampedParam } from "@/lib/passport";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";

const SIZE = OG_SIZE;
const DEFAULT_SHOWCASE_IDS = ["feitian", "puwu", "guojiao", "qinghua-20"];

function rankFontSize(title: string): number {
  if (title.length <= 18) return 44;
  if (title.length <= 24) return 38;
  return 34;
}

export async function GET(request: NextRequest) {
  const rawParam = request.nextUrl.searchParams.get("s") ?? undefined;
  const stampedIds = parseStampedParam(rawParam);
  const summary = computePassportSummary(stampedIds);

  const showcaseItems =
    summary.topBottles.length > 0
      ? summary.topBottles.slice(0, 4)
      : DEFAULT_SHOWCASE_IDS.map((id) => skuById(id))
          .filter((s): s is NonNullable<typeof s> => Boolean(s))
          .map((s) => ({ id: s.id, nameEn: s.nameEn, nameZh: s.nameZh, image: s.image }));

  const [typo, bottleImages] = await Promise.all([
    loadMuseumOgFonts(summary.rank.zh),
    Promise.all(
      showcaseItems.map(async (item) => ({
        ...item,
        dataUri: await readPublicImageDataUri(item.image),
      })),
    ),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;

  const metrics = [
    { label: "SURVIVED", value: `${summary.tastedCount}/${summary.totalCount}` },
    { label: "MAX ABV", value: summary.maxAbv > 0 ? `${summary.maxAbv}%` : "—" },
    { label: "PROVINCES", value: `${summary.provinceCount}` },
    { label: "EST. BILL", value: `¥${summary.estBillYuan.toLocaleString("en-US")}` },
  ];

  const isPersonalized = summary.tastedCount > 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #f8f6f1 0%, #f1ede5 60%, #e9e4da 100%)",
          display: "flex",
          padding: 36,
          gap: 32,
          fontFamily: fontRegular,
        }}
      >
        {/* Left dossier column */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <MuseumSealSvg size={38} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 15,
                    color: "#111111",
                    letterSpacing: "0.09em",
                    fontFamily: fontBold,
                  }}
                >
                  {SITE_NAME.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#767066",
                    letterSpacing: "0.10em",
                    fontFamily: fontSemiBold,
                  }}
                >
                  OFFICIAL DRINKING PASSPORT
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                border: "2px solid #c81e1e",
                borderRadius: 8,
                background: "#ffffff",
                color: "#c81e1e",
                fontSize: 14,
                fontFamily: fontBold,
                letterSpacing: "0.08em",
              }}
            >
              {isPersonalized ? `VERIFIED · ${summary.tastedCount}/${summary.totalCount}` : "STAMP YOURS"}
            </div>
          </div>

          {/* Rank callout card */}
          <div
            style={{
              background: "#ffffff",
              borderLeft: "6px solid #c81e1e",
              borderTop: "1px solid rgba(11,11,13,0.08)",
              borderRight: "1px solid rgba(11,11,13,0.08)",
              borderBottom: "1px solid rgba(11,11,13,0.08)",
              borderRadius: "0 18px 18px 0",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              boxShadow: "0 12px 28px rgba(11,11,13,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
                color: "#c81e1e",
                letterSpacing: "0.12em",
                fontFamily: fontBold,
              }}
            >
              <span>CURATORIAL RANK</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ fontFamily: fontCjk }}>{summary.rank.zh}</span>
            </div>
            <div
              style={{
                fontSize: rankFontSize(summary.rank.en),
                fontFamily: fontBold,
                color: "#111111",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
              }}
            >
              {summary.rank.en}
            </div>
            <div
              style={{
                fontSize: 21,
                fontFamily: fontRegular,
                color: "#4d4841",
                lineHeight: 1.38,
              }}
            >
              {`“${summary.rank.diagnosis}”`}
            </div>
          </div>

          {/* 4-Metric bar */}
          <div style={{ display: "flex", gap: 12 }}>
            {metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  flex: 1,
                  background: "#ffffff",
                  border: "1px solid rgba(11,11,13,0.09)",
                  borderRadius: 14,
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: "#767066",
                    letterSpacing: "0.09em",
                    fontFamily: fontSemiBold,
                  }}
                >
                  {m.label}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    color: "#111111",
                    fontFamily: fontBold,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
              color: "#767066",
              fontFamily: fontSemiBold,
              letterSpacing: "0.04em",
            }}
          >
            <span>bai9.app/passport</span>
            <span>by @mr_chenliang</span>
          </div>
        </div>

        {/* Right 2x2 studio specimen showcase */}
        <div
          style={{
            width: 416,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.10em",
              color: "#767066",
              fontFamily: fontBold,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{isPersonalized ? "STAMPED SPECIMENS" : "FEATURED SPECIMENS"}</span>
            <span>{isPersonalized && summary.tastedCount > 4 ? `+${summary.tastedCount - 4} MORE` : "ARCHIVE"}</span>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            {bottleImages.map((item) => (
              <div
                key={item.id}
                style={{
                  width: 202,
                  height: 256,
                  background: "#ffffff",
                  borderRadius: 16,
                  border: "1px solid rgba(11,11,13,0.09)",
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 8px 20px rgba(11,11,13,0.05)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 196,
                    background: "#f4f3ef",
                    borderRadius: 10,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.dataUri ? (
                    <img
                      src={item.dataUri}
                      alt={item.nameEn}
                      width={182}
                      height={196}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: fontBold,
                    color: "#111111",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {item.nameEn.length > 20 ? `${item.nameEn.slice(0, 19)}…` : item.nameEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      ...fontOptions,
      headers: {
        "Cache-Control": isPersonalized
          ? "public, max-age=31536000, immutable"
          : "public, max-age=3600, s-maxage=3600",
      },
    },
  );
}
