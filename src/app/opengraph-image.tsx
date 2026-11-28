import { ImageResponse } from "next/og";
import { brands, skus } from "@/catalog";
import {
  loadMuseumOgFonts,
  MuseumSealSvg,
  OG_CONTENT_TYPE,
  OG_SIZE,
  readPublicImageDataUri,
} from "@/lib/og";
import { SITE_NAME, SITE_NAME_ZH, SITE_TAGLINE } from "@/lib/site";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} · ${SITE_NAME_ZH}`;

/** Iconic bottles that read clearly at iMessage preview size. */
const HERO_BOTTLES = ["feitian", "puwu", "guojiao"] as const;

export default async function OpenGraphImage() {
  const featured = HERO_BOTTLES.map((id) => skus.find((sku) => sku.id === id)).filter(
    (sku): sku is NonNullable<typeof sku> => Boolean(sku?.image),
  );

  const [typo, images] = await Promise.all([
    loadMuseumOgFonts(SITE_NAME_ZH),
    Promise.all(featured.map((sku) => readPublicImageDataUri(sku.image))),
  ]);

  const { fontOptions, fontRegular, fontSemiBold, fontBold, fontCjk } = typo;
  const bottles = featured
    .map((sku, index) => ({ sku, src: images[index] }))
    .filter((item): item is { sku: (typeof featured)[number]; src: string } => Boolean(item.src));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #f7f4ee 0%, #f1ede5 55%, #e9e3d8 100%)",
          position: "relative",
          overflow: "hidden",
          fontFamily: fontRegular,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 78% 52%, rgba(255,255,255,0.92) 0%, transparent 56%), radial-gradient(circle at 8% 92%, rgba(200,30,30,0.09) 0%, transparent 42%)",
            display: "flex",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            padding: "44px 48px 42px",
            alignItems: "stretch",
            justifyContent: "space-between",
            gap: 28,
          }}
        >
          <div
            style={{
              width: 454,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "6px 0",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <MuseumSealSvg size={68} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    fontSize: 15,
                    fontFamily: fontBold,
                    letterSpacing: "0.14em",
                    color: "#c81e1e",
                    textTransform: "uppercase",
                  }}
                >
                  Permanent Archive
                </div>
                <div
                  style={{
                    fontSize: 56,
                    fontFamily: fontBold,
                    color: "#111111",
                    lineHeight: 1.02,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {SITE_NAME}
                </div>
                <div
                  style={{
                    fontSize: 30,
                    fontFamily: fontCjk,
                    color: "#6a655c",
                    letterSpacing: "0.06em",
                    lineHeight: 1.2,
                  }}
                >
                  {SITE_NAME_ZH}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                paddingTop: 20,
                borderTop: "1px solid rgba(17,17,17,0.10)",
              }}
            >
              <div
                style={{
                  fontSize: 25,
                  fontFamily: fontSemiBold,
                  color: "#1a1a1a",
                  lineHeight: 1.28,
                  maxWidth: 420,
                }}
              >
                {SITE_TAGLINE}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#7a756c", fontSize: 16, fontFamily: fontSemiBold }}>
                <span>{`${skus.length} specimens`}</span>
                <span>·</span>
                <span>{`${brands.length} houses`}</span>
                <span>·</span>
                <span>Tier I–IV</span>
              </div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 18,
              paddingRight: 4,
            }}
          >
            {bottles.map(({ sku, src }, index) => (
              <div
                key={sku.id}
                style={{
                  width: index === 1 ? 220 : 192,
                  height: index === 1 ? 526 : 464,
                  borderRadius: 28,
                  overflow: "hidden",
                  background: "#ffffff",
                  border: "1px solid rgba(17,17,17,0.085)",
                  boxShadow: "0 20px 44px rgba(17,17,17,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: index === 1 ? 0 : 22,
                }}
              >
                <img
                  src={src}
                  alt={sku.nameEn}
                  width={index === 1 ? 220 : 192}
                  height={index === 1 ? 526 : 464}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size, ...fontOptions },
  );
}
