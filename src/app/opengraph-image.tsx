import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hero, share, site } from "@/content/site";

export const alt = share.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the tokens in globals.css (the image renders outside the page's CSS).
const BG = "#0a0a0a";
const TEXT = "#ededed";
const MUTED = "#8f8f8f";
const ACCENT = "#ff3d2e";

export default async function OpengraphImage() {
  const fonts = join(process.cwd(), "src/assets/fonts");
  const [display, mono] = await Promise.all([
    readFile(join(fonts, "Archivo-Condensed-ExtraBold.ttf")),
    readFile(join(fonts, "JetBrainsMono-Regular.ttf")),
  ]);

  const label = {
    fontFamily: "Mono",
    fontSize: 18,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: BG,
          color: TEXT,
        }}
      >
        <div style={{ ...label, color: MUTED }}>{hero.label}</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Display",
            fontSize: 156,
            lineHeight: 0.86,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <span>{hero.name.first}</span>
          <span>{hero.name.last}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #2a2a2a",
            paddingTop: 28,
          }}
        >
          <span style={{ ...label, color: MUTED }}>{share.tagline}</span>
          <span style={{ ...label, color: ACCENT, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 12, height: 12, background: ACCENT }} />
            {site.status}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
