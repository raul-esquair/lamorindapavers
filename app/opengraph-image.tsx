import { ImageResponse } from "next/og";

export const alt = "Lamorinda Pavers — Paver Driveways, Patios & Outdoor Living for the East Bay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#1A1A1A";
const WHITE = "#FAF8F5";
const BLUE = "#3B7DD8";
const RED = "#C94141";
const GOLD = "#E8A83E";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          color: WHITE,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              background: BLUE,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 800,
              color: WHITE,
              letterSpacing: -2,
            }}
          >
            LP
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: 88, height: 3, background: RED, marginBottom: 10 }} />
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                letterSpacing: 5,
                color: WHITE,
              }}
            >
              LAMORINDA PAVERS
            </div>
            <div style={{ width: 64, height: 3, background: GOLD, marginTop: 10 }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              fontSize: 78,
              fontWeight: 700,
              lineHeight: 1.05,
              color: WHITE,
              letterSpacing: -1,
            }}
          >
            Paver Driveways, Patios & Outdoor Living
          </div>
          <div
            style={{
              fontSize: 30,
              color: "rgba(250, 248, 245, 0.65)",
              marginTop: 24,
              fontWeight: 400,
            }}
          >
            Lafayette · Moraga · Orinda · the East Bay
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(250, 248, 245, 0.15)",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "rgba(250, 248, 245, 0.55)",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            lamorindapaving.com
          </div>
          <div style={{ width: 8, height: 56, background: GOLD, borderRadius: 4 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
