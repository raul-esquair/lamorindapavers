import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { company } from "@/lib/data/company";

export const alt = "How did we do? — share your experience with Lamorinda Pavers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#F5F0EB";
const INK = "#1A1612";
const MUTED = "rgba(26, 22, 18, 0.55)";
const BLUE = "#3B7DD8";
const RED = "#C94141";
const ORANGE = "#D98C4A";
const GOLD = "#E8A83E";

// Same four faces as the page itself, inlined as SVG data URIs. Satori
// renders <img> data URIs reliably; keep them in sync with MOUTHS in
// FeedbackPageContent.tsx.
function faceUri(color: string, mouth: string, arcEyes = false) {
  const eyes = arcEyes
    ? `<path d="M14 20 Q17.5 16.5 21 20"/><path d="M27 20 Q30.5 16.5 34 20"/>`
    : `<circle cx="17.5" cy="19.5" r="1.7" fill="${color}" stroke="none"/><circle cx="30.5" cy="19.5" r="1.7" fill="${color}" stroke="none"/>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" ` +
    `stroke="${color}" stroke-width="2.4" stroke-linecap="round">` +
    `<circle cx="24" cy="24" r="21"/>${eyes}<path d="${mouth}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const FACES = [
  { color: RED, uri: faceUri(RED, "M15 34 Q24 25 33 34") },
  { color: ORANGE, uri: faceUri(ORANGE, "M15 31.5 Q24 27.5 33 31.5") },
  { color: GOLD, uri: faceUri(GOLD, "M15 28 Q24 34 33 28") },
  { color: BLUE, uri: faceUri(BLUE, "M14 27 Q24 38 34 27", true) },
];

export default async function OpengraphImage() {
  // Inline the real logo lockup. Satori cannot resolve app-relative URLs, so
  // the file is read off disk at build time and embedded as a data URI.
  const logo = await readFile(join(process.cwd(), "public/images/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: INK,
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand lockup */}
        <div style={{ display: "flex" }}>
          <img src={logoSrc} width={470} height={120} alt={company.name} />
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            How did we do?
          </div>
          <div style={{ fontSize: 31, color: MUTED, marginTop: 22, fontWeight: 400 }}>
            {`${company.owner} reads every one of these personally. It takes about thirty seconds.`}
          </div>
        </div>

        {/* Faces + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(26, 22, 18, 0.12)",
            paddingTop: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            {FACES.map((face) => (
              <img key={face.color} src={face.uri} width={78} height={78} alt="" />
            ))}
          </div>
          <div
            style={{
              fontSize: 21,
              color: MUTED,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            lamorindapaving.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
