import { ImageResponse } from "next/og";
import { brands, skus } from "@/catalog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Chinese Baijiu Museum · 中国白酒博物馆";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf8f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          border: "16px solid #ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 60,
                height: 60,
                background: "#c81e1e",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                fontWeight: 700,
              }}
            >
              酒
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#111111", letterSpacing: "0.04em" }}>
                CHINESE BAIJIU MUSEUM
              </span>
              <span style={{ fontSize: 15, color: "#767676", letterSpacing: "0.1em" }}>
                PERMANENT EDITORIAL ARCHIVE · 中国白酒博物馆
              </span>
            </div>
          </div>
          <span style={{ fontSize: 16, color: "#c81e1e", fontWeight: 700, letterSpacing: "0.1em" }}>
            TIER I–IV · GB/T VERIFIED
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#111111", lineHeight: 1.08 }}>
            The grain spirits China actually argues about.
          </div>
          <div style={{ fontSize: 26, color: "#525252", lineHeight: 1.4 }}>
            Table signals, GB/T pure-grain standards, 27-province atlas, banquet survival guide, and drinking passport.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(0,0,0,0.12)",
            paddingTop: 22,
          }}
        >
          <div style={{ display: "flex", gap: 36 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#111111" }}>{skus.length}</span>
              <span style={{ fontSize: 14, color: "#767676", letterSpacing: "0.08em" }}>SPECIMENS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#111111" }}>{brands.length}</span>
              <span style={{ fontSize: 14, color: "#767676", letterSpacing: "0.08em" }}>HOUSES</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#111111" }}>12</span>
              <span style={{ fontSize: 14, color: "#767676", letterSpacing: "0.08em" }}>AROMAS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: "#111111" }}>27</span>
              <span style={{ fontSize: 14, color: "#767676", letterSpacing: "0.08em" }}>PROVINCES</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 18, color: "#767676" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#767676">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>by @mr_chenliang</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
