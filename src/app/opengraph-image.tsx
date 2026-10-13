import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { apps, desktop, share, site } from "@/content/site";

export const alt = share.alt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Colours mirror the Noir tokens in globals.css (the image renders outside the page's CSS).
const BG = "#0b0b0a";
const TEXT = "#ece8df";
const MUTED = "#8e897f";
const RULE = "#2a2926";
const ACCENT = "#ff4130";

export default async function OpengraphImage() {
  const fonts = join(process.cwd(), "src/assets/fonts");
  const [display, mono] = await Promise.all([
    readFile(join(fonts, "Doto-Black.ttf")),
    readFile(join(fonts, "JetBrainsMono-Regular.ttf")),
  ]);

  const label = {
    fontFamily: "Mono",
    fontSize: 18,
    letterSpacing: 2,
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
          background: BG,
          color: TEXT,
        }}
      >
        <div
          style={{
            ...label,
            display: "flex",
            justifyContent: "space-between",
            borderBottom: `1px solid ${RULE}`,
            padding: "18px 40px",
            color: MUTED,
          }}
        >
          <span>{`${site.os} · ${site.handle}`}</span>
          <span style={{ color: ACCENT, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 12, height: 12, background: ACCENT }} />
            {site.status}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
          }}
        >
          <span style={{ ...label, color: MUTED, letterSpacing: 6 }}>{desktop.role}</span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Display",
              fontSize: 112,
              lineHeight: 0.95,
              textTransform: "uppercase",
              marginTop: 24,
            }}
          >
            <span>Aakash</span>
            <span>Buddha Kannan</span>
          </div>
        </div>
        <div
          style={{
            ...label,
            display: "flex",
            gap: 40,
            borderTop: `1px solid ${RULE}`,
            padding: "22px 64px",
            color: MUTED,
          }}
        >
          {apps.map((app) => (
            <span key={app.id} style={{ display: "flex", gap: 10 }}>
              <span style={{ color: ACCENT }}>{app.number}</span>
              {app.file}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 900, style: "normal" },
        { name: "Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
