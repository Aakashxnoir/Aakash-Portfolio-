import { motionAllowed, onPrefsChange } from "@/lib/prefs";

/** The glyph ramp, darkest first. Index 0 is always a blank cell. */
export const RAMP = " .:-=+*#%@";

/** JetBrains Mono's advance width is 0.6em. */
const ADVANCE = 0.6;

export type Theme = { text: string; accent: string; muted: string; font: string };

/** Colours and font from the CSS tokens, so canvases follow the phosphor. */
export function readTheme(): Theme {
  const style = getComputedStyle(document.documentElement);
  const font = style.getPropertyValue("--font-jetbrains").trim() || "monospace";
  return {
    text: style.getPropertyValue("--text").trim(),
    accent: style.getPropertyValue("--accent").trim(),
    muted: style.getPropertyValue("--text-muted").trim(),
    font,
  };
}

/** A canvas laid out as a grid of glyph cells, in device pixels. */
export type Surface = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  /** Cell size in device pixels. */
  cw: number;
  ch: number;
  dpr: number;
  fontSize: number;
};

/**
 * Sizes `canvas` to its CSS box (or the given size) and works out the grid.
 * `fontSize` is in CSS pixels; `lineHeight` is a multiple of it.
 */
export function fitSurface(
  canvas: HTMLCanvasElement,
  fontSize: number,
  lineHeight = 1.15,
  size?: { width: number; height: number },
): Surface {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = size?.width ?? canvas.clientWidth;
  const height = size?.height ?? canvas.clientHeight;
  canvas.width = Math.max(1, Math.round(width * dpr));
  canvas.height = Math.max(1, Math.round(height * dpr));
  const cw = fontSize * ADVANCE * dpr;
  const ch = fontSize * lineHeight * dpr;
  const ctx = canvas.getContext("2d")!;
  return {
    canvas,
    ctx,
    cols: Math.max(1, Math.floor(canvas.width / cw)),
    rows: Math.max(1, Math.floor(canvas.height / ch)),
    cw,
    ch,
    dpr,
    fontSize,
  };
}

export type Atlas = { canvas: HTMLCanvasElement; length: number; cw: number; ch: number };

/** Pre-drawn glyphs in one colour, so each cell is one drawImage instead of a fillText. */
export function buildAtlas(surface: Surface, charset: string, color: string, font: string): Atlas {
  const glyphs = Array.from(charset);
  const cw = Math.ceil(surface.cw);
  const ch = Math.ceil(surface.ch);
  const canvas = document.createElement("canvas");
  canvas.width = cw * glyphs.length;
  canvas.height = ch;
  const ctx = canvas.getContext("2d")!;
  const px = surface.fontSize * surface.dpr;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  glyphs.forEach((glyph, index) => {
    // A glyph wider than a mono cell shrinks to fit.
    ctx.font = `${px}px ${font}`;
    const width = ctx.measureText(glyph).width;
    if (width > cw * 1.05) ctx.font = `${(px * cw) / width}px ${font}`;
    ctx.fillText(glyph, index * cw + cw / 2, ch / 2);
  });
  return { canvas, length: glyphs.length, cw, ch };
}

/** Draws one cell. `index` 0 is blank and skipped by callers. */
export function drawGlyph(surface: Surface, atlas: Atlas, index: number, col: number, row: number) {
  surface.ctx.drawImage(
    atlas.canvas,
    index * atlas.cw,
    0,
    atlas.cw,
    atlas.ch,
    Math.round(col * surface.cw),
    Math.round(row * surface.ch),
    atlas.cw,
    atlas.ch,
  );
}

/**
 * Draws a field of values. 0 to 1 maps across the glyph set in `text`; a value
 * of `1 + v` draws level `v` from the `accent` atlas (so 2 is the densest accent).
 */
export function drawValues(surface: Surface, values: Float32Array, text: Atlas, accent: Atlas) {
  const { ctx, canvas, cols, rows } = surface;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const top = text.length - 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const v = values[row * cols + col];
      if (v >= 1) {
        drawGlyph(surface, accent, Math.max(1, Math.round(Math.min(1, v - 1) * top)), col, row);
        continue;
      }
      const index = Math.round(Math.max(0, v) * top);
      if (index > 0) drawGlyph(surface, text, index, col, row);
    }
  }
}

/** Time used for the single still frame with System > Motion off. */
export const STILL_TIME = 2.4;

export type Loop = { stop: () => void; redraw: () => void };

/**
 * Runs `draw(seconds)` at up to `fps` while `el` is on screen, the tab is shown
 * and motion is allowed. With System > Motion off it draws one still frame instead.
 * Re-evaluates when System > Motion changes.
 */
export function startLoop(el: Element, draw: (time: number) => void, fps = 30): Loop {
  let raf = 0;
  let last = 0;
  let onScreen = true;
  const t0 = performance.now();
  const interval = 1000 / fps;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (now - last < interval - 2) return;
    last = now;
    draw((now - t0) / 1000);
  };

  const update = () => {
    if (!motionAllowed()) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      draw(STILL_TIME);
      return;
    }
    const run = onScreen && !document.hidden;
    if (run && !raf) raf = requestAnimationFrame(frame);
    if (!run && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const observer = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  });
  observer.observe(el);
  document.addEventListener("visibilitychange", update);
  const offPrefs = onPrefsChange(update);
  update();

  return {
    stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      offPrefs();
    },
    redraw() {
      draw(motionAllowed() ? (performance.now() - t0) / 1000 : STILL_TIME);
    },
  };
}

/** Resolves once the mono web font can be drawn on a canvas. */
export async function fontReady(font: string) {
  try {
    await document.fonts.load(`16px ${font}`);
  } catch {
    // Draw with the fallback font.
  }
}
