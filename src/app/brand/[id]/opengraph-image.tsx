import { ImageResponse } from "next/og";
import { aromaById, brandById, brands, skusForBrand } from "@/catalog";
import { houseProfiles } from "@/houses";
import {
  brandCrestFor,
  loadMuseumOgFonts,
  MuseumSealSvg,
  OG_CONTENT_TYPE,
  OG_SIZE,
  readPublicImageDataUri,
  renderNotFoundOgCard,
} from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH } from "@/lib/site";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} distillery house dossier`;

export function generateStaticParams() {
  return brands.map((brand) => ({ id: brand.id }));
}

function brandTitleSize(nameEn: string): number {
  if (nameEn.length <= 12) return 56;
  if (nameEn.length <= 18) return 48;
  return 40;
}

export default async function BrandOpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = brandById(id);

  if (!brand) {
    return renderNotFoundOgCard("distillery");
  }

  const aroma = aromaById(brand.aroma);
  const profile = houseProfiles[brand.id];
  const crest = brandCrestFor(brand.id, brand.nameZh, brand.aroma);
  const bottles = skusForBrand(brand.id).filter((s) => Boolean(s.image));
  const featured = bottles.slice(0, 3);

  const cjkChars = `${SITE_NAME_ZH}${brand.nameZh}${brand.distilleryZh}${brand.provinceZh}${aroma?.zh ?? ""}${crest.glyph}国家名酒酒厂档案`;

  const [typo, imgs] = await Promise.all([
    loadMuseumOgFonts(cjkChars),
    Promise.all(featured.map((sku) => readPublicImageDataUri(sku.image))),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;
  const gallery = featured
    .map((sku, idx) => ({ sku, src: imgs[idx] }))
    .filter((item): item is { sku: (typeof featured)[number]; src: string } => Boolean(item.src));

  const quote = profile?.takeaway ?? brand.historyEn.split(/(?<=[.!?])\s+/)[0] ?? brand.historyEn.slice(0, 130);

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
              "radial-gradient(ellipse at 76% 50%, rgba(255,255,255,0.92) 0%, transparent 56%), radial-gradient(circle at 8% 92%, rgba(200,30,30,0.08) 0%, transparent 42%)",
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
            gap: 34,
            alignItems: "stretch",
          }}
        >
          {/* Left column: Distillery Dossier */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MuseumSealSvg size={36} />
                <span style={{ fontSize: 13, color: "#767066", letterSpacing: "0.11em", fontFamily: fontBold }}>
                  {`${SITE_NAME.toUpperCase()} · DISTILLERY DOSSIER`}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 20,
                    background: crest.bg,
                    color: crest.fg,
                    border: `2.5px solid ${crest.accent}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 40,
                    fontFamily: fontCjk,
                    boxShadow: "0 12px 26px rgba(17,17,17,0.14)",
                    flexShrink: 0,
                  }}
                >
                  {crest.glyph}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div
                    style={{
                      fontSize: brandTitleSize(brand.nameEn),
                      fontFamily: fontBold,
                      color: "#111111",
                      lineHeight: 1.02,
                      letterSpacing: "-0.028em",
                    }}
                  >
                    {brand.nameEn}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 28, fontFamily: fontCjk, color: "#c81e1e", lineHeight: 1.15 }}>
                      {brand.nameZh}
                    </span>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 5, fontSize: 16, color: "#7a7369" }}>
                      <span style={{ fontFamily: fontRegular }}>{brand.provinceEn}</span>
                      <span style={{ fontFamily: fontRegular, opacity: 0.6 }}>·</span>
                      <span style={{ fontFamily: fontCjk }}>{brand.provinceZh}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, alignItems: "center" }}>
                {aroma ? (
                  <div
                    style={{
                      background: "#151413",
                      color: "#ffffff",
                      padding: "7px 14px",
                      borderRadius: 10,
                      fontSize: 15,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <span style={{ fontFamily: fontBold }}>{aroma.en}</span>
                    <span style={{ opacity: 0.55 }}>·</span>
                    <span style={{ fontFamily: fontCjk }}>{aroma.zh}</span>
                  </div>
                ) : null}
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(17,17,17,0.12)",
                    color: "#1a1a1a",
                    padding: "7px 14px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontFamily: fontSemiBold,
                    display: "flex",
                  }}
                >
                  {`${bottles.length} ${bottles.length === 1 ? "specimen" : "specimens"}`}
                </div>
                {brand.medals.length > 0 ? (
                  <div
                    style={{
                      background: "#fef6e7",
                      border: "1px solid rgba(180,83,9,0.28)",
                      color: "#92400e",
                      padding: "7px 14px",
                      borderRadius: 10,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ fontFamily: fontCjk }}>国家名酒</span>
                    <span style={{ fontFamily: fontBold }}>{brand.medals.join(" · ")}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Editorial takeaway box */}
            <div
              style={{
                background: "#ffffff",
                borderLeft: "5px solid #c81e1e",
                borderTop: "1px solid rgba(17,17,17,0.06)",
                borderRight: "1px solid rgba(17,17,17,0.06)",
                borderBottom: "1px solid rgba(17,17,17,0.06)",
                borderRadius: "0 18px 18px 0",
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                boxShadow: "0 10px 26px rgba(17,17,17,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c81e1e", letterSpacing: "0.12em" }}>
                <span style={{ fontFamily: fontBold }}>HOUSE NOTE</span>
                <span style={{ opacity: 0.6 }}>·</span>
                <span style={{ fontFamily: fontCjk }}>酒厂档案</span>
              </div>
              <div style={{ fontSize: 21, fontFamily: fontSemiBold, color: "#151413", lineHeight: 1.35 }}>
                {quote.length > 135 ? `${quote.slice(0, 132)}…` : quote}
              </div>
            </div>
          </div>

          {/* Right column: Studio bottle showcase */}
          <div
            style={{
              width: gallery.length === 1 ? 470 : 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            {gallery.length === 1 ? (
              <div
                style={{
                  width: 468,
                  height: 546,
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: "1px solid rgba(17,17,17,0.085)",
                  boxShadow: "0 22px 48px rgba(17,17,17,0.11)",
                  display: "flex",
                }}
              >
                <img
                  src={gallery[0].src}
                  alt={gallery[0].sku.nameEn}
                  width={468}
                  height={546}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : gallery.length === 2 ? (
              gallery.map((item, idx) => (
                <div
                  key={item.sku.id}
                  style={{
                    flex: 1,
                    height: idx === 0 ? 520 : 480,
                    borderRadius: 24,
                    overflow: "hidden",
                    background: "#ffffff",
                    border: "1px solid rgba(17,17,17,0.085)",
                    boxShadow: "0 18px 40px rgba(17,17,17,0.11)",
                    display: "flex",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.sku.nameEn}
                    width={240}
                    height={520}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))
            ) : (
              gallery.map((item, idx) => (
                <div
                  key={item.sku.id}
                  style={{
                    flex: 1,
                    height: idx === 1 ? 524 : 458,
                    borderRadius: 22,
                    overflow: "hidden",
                    background: "#ffffff",
                    border: "1px solid rgba(17,17,17,0.085)",
                    boxShadow: "0 18px 40px rgba(17,17,17,0.11)",
                    display: "flex",
                    marginTop: idx === 1 ? 0 : 20,
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.sku.nameEn}
                    width={160}
                    height={524}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    ),
    { ...size, ...fontOptions },
  );
}
