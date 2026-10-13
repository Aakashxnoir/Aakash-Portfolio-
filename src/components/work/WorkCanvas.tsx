"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motionAllowed, onPrefsChange } from "@/lib/prefs";
import { fontReady, readTheme, STILL_TIME } from "@/components/ascii/engine";
import { FieldRenderer } from "@/components/ascii/FieldRenderer";
import type { FieldId } from "@/components/ascii/fields";
import { workLabels } from "@/content/projects";

export type CanvasTile = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  number: string;
  art: FieldId;
};

/** One repeat of the plane, in CSS pixels, and where each tile sits in it. */
const PATTERN_W = 1560;
const PATTERN_H = 1060;
const SLOTS = [
  [70, 40],
  [560, 120],
  [1050, 30],
  [250, 430],
  [790, 470],
];
const TILE_W = 360;
const ART_H = 240;
const MARGIN_X = TILE_W + 40;
const MARGIN_Y = ART_H + 120;
const ART_FPS = 24;

function mod(a: number, n: number) {
  return ((a % n) + n) % n;
}

/**
 * projects.vol as an endless plane: the five case files repeat in a pattern you
 * drag, scroll or arrow-key around. Artworks are drawn off screen once per frame
 * and stamped onto one canvas behind the DOM tiles (which are the real links).
 * Only the first copy of each tile is focusable and announced.
 */
export default function WorkCanvas({ tiles }: { tiles: CanvasTile[] }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const focusRef = useRef<(index: number) => void>(() => {});
  const [copies, setCopies] = useState({ nx: 2, ny: 2 });

  useEffect(() => {
    const frame = frameRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let disposed = false;

    let width = frame.clientWidth;
    let height = frame.clientHeight;
    let dpr = 1;
    let nx = copies.nx;
    let ny = copies.ny;

    // Start with all five in view, centred on wide screens.
    const cam = { x: Math.max(0, (width - 1480) / 2), y: Math.max(0, (height - 800) / 2) };
    const vel = { x: 0, y: 0 };
    let target: { x: number; y: number } | null = null;
    let lastInput = performance.now();
    let hovered = -1;
    let dirty = true;

    // Off-screen artworks, one per case file.
    let theme = readTheme();
    let arts: FieldRenderer[] = [];
    let artsReady = false;
    let lastArt = 0;
    const t0 = performance.now();

    fontReady(theme.font).then(() => {
      if (disposed) return;
      arts = tiles.map((tile) => {
        const renderer = new FieldRenderer(document.createElement("canvas"), tile.art, 9, theme);
        renderer.resize({ width: TILE_W, height: ART_H });
        renderer.render(STILL_TIME);
        return renderer;
      });
      artsReady = true;
      dirty = true;
      frame.dataset.ready = "";
    });

    const resize = () => {
      width = frame.clientWidth;
      height = frame.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const next = {
        nx: Math.ceil(width / PATTERN_W) + 1,
        ny: Math.ceil(height / PATTERN_H) + 1,
      };
      if (next.nx !== nx || next.ny !== ny) {
        nx = next.nx;
        ny = next.ny;
        setCopies(next);
      }
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    resize();

    /** Screen position of copy `c` (index into the rendered tiles). */
    const position = (c: number) => {
      const k = c % tiles.length;
      const copy = Math.floor(c / tiles.length);
      const i = copy % nx;
      const j = Math.floor(copy / nx);
      const x = mod(SLOTS[k][0] + i * PATTERN_W + cam.x + MARGIN_X, nx * PATTERN_W) - MARGIN_X;
      const y = mod(SLOTS[k][1] + j * PATTERN_H + cam.y + MARGIN_Y, ny * PATTERN_H) - MARGIN_Y;
      return [x, y];
    };

    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const count = tiles.length * nx * ny;
      for (let c = 0; c < count; c++) {
        const [x, y] = position(c);
        const el = tileRefs.current[c];
        if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        if (!artsReady || x > width || y > height || x + TILE_W < 0 || y + ART_H < 0) continue;
        ctx.drawImage(arts[c % tiles.length].canvas, x, y, TILE_W, ART_H);
        if (c === hovered) {
          ctx.globalCompositeOperation = "source-atop";
          ctx.fillStyle = theme.accent;
          ctx.fillRect(x, y, TILE_W, ART_H);
          ctx.globalCompositeOperation = "source-over";
        }
      }
    };

    let raf = 0;
    let onScreen = true;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const motion = motionAllowed();
      if (!dragging) {
        if (target) {
          const k = motion ? 0.16 : 1;
          cam.x += (target.x - cam.x) * k;
          cam.y += (target.y - cam.y) * k;
          if (Math.abs(target.x - cam.x) + Math.abs(target.y - cam.y) < 0.5) target = null;
          dirty = true;
        } else if (motion && Math.abs(vel.x) + Math.abs(vel.y) > 0.05) {
          cam.x += vel.x;
          cam.y += vel.y;
          vel.x *= 0.93;
          vel.y *= 0.93;
          dirty = true;
        } else if (motion && now - lastInput > 2500) {
          cam.x -= 0.18;
          cam.y -= 0.08;
          dirty = true;
        }
      }
      if (artsReady && motion && now - lastArt > 1000 / ART_FPS) {
        lastArt = now;
        const t = (now - t0) / 1000;
        arts.forEach((art) => art.render(t));
        dirty = true;
      }
      if (dirty) {
        dirty = false;
        paint();
      }
    };
    const update = () => {
      const run = onScreen && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(tick);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    visibility.observe(frame);
    document.addEventListener("visibilitychange", update);
    const offPrefs = onPrefsChange(() => {
      theme = readTheme();
      arts.forEach((art) => {
        art.setTheme(theme);
        art.render(STILL_TIME);
      });
      dirty = true;
    });
    update();

    // Dragging. Capture starts only once the pointer has moved, so a plain click
    // still reaches the link under it.
    let down: { id: number; x: number; y: number; t: number } | null = null;
    let dragging = false;
    let moved = 0;
    let suppressClick = false;

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      down = { id: event.pointerId, x: event.clientX, y: event.clientY, t: event.timeStamp };
      moved = 0;
      vel.x = vel.y = 0;
      target = null;
      lastInput = performance.now();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!down || event.pointerId !== down.id) return;
      const dx = event.clientX - down.x;
      const dy = event.clientY - down.y;
      moved += Math.abs(dx) + Math.abs(dy);
      if (!dragging && moved > 6) {
        dragging = true;
        frame.setPointerCapture(event.pointerId);
        frame.dataset.dragging = "";
      }
      if (!dragging) return;
      const dt = Math.max(1, event.timeStamp - down.t);
      cam.x += dx;
      cam.y += dy;
      vel.x = vel.x * 0.5 + ((dx / dt) * 16) * 0.5;
      vel.y = vel.y * 0.5 + ((dy / dt) * 16) * 0.5;
      down = { id: down.id, x: event.clientX, y: event.clientY, t: event.timeStamp };
      lastInput = performance.now();
      dirty = true;
    };
    const onPointerUp = () => {
      if (dragging) suppressClick = true;
      dragging = false;
      down = null;
      delete frame.dataset.dragging;
      lastInput = performance.now();
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      target = null;
      cam.x -= event.deltaX;
      cam.y -= event.deltaY;
      lastInput = performance.now();
      dirty = true;
    };
    const onKey = (event: KeyboardEvent) => {
      const step = event.shiftKey ? 480 : 160;
      const delta: Record<string, [number, number]> = {
        ArrowLeft: [step, 0],
        ArrowRight: [-step, 0],
        ArrowUp: [0, step],
        ArrowDown: [0, -step],
      };
      const d = delta[event.key];
      if (!d) return;
      event.preventDefault();
      const from = target ?? cam;
      target = { x: from.x + d[0], y: from.y + d[1] };
      lastInput = performance.now();
    };
    const onOver = (event: PointerEvent) => {
      const el = (event.target as Element).closest<HTMLElement>("[data-copy]");
      const next = el ? Number(el.dataset.copy) : -1;
      if (next !== hovered) {
        hovered = next;
        dirty = true;
      }
    };

    // Focusing a tile from the keyboard brings it to the middle.
    focusRef.current = (c: number) => {
      const [x, y] = position(c);
      target = {
        x: cam.x + (width - TILE_W) / 2 - x,
        y: cam.y + (height - ART_H) / 2 - y,
      };
      lastInput = performance.now();
    };

    frame.addEventListener("pointerdown", onPointerDown);
    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerup", onPointerUp);
    frame.addEventListener("pointercancel", onPointerUp);
    frame.addEventListener("click", onClick, true);
    frame.addEventListener("wheel", onWheel, { passive: false });
    frame.addEventListener("keydown", onKey);
    frame.addEventListener("pointerover", onOver);
    frame.addEventListener("pointerleave", onOver);

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", update);
      offPrefs();
      frame.removeEventListener("pointerdown", onPointerDown);
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerup", onPointerUp);
      frame.removeEventListener("pointercancel", onPointerUp);
      frame.removeEventListener("click", onClick, true);
      frame.removeEventListener("wheel", onWheel);
      frame.removeEventListener("keydown", onKey);
      frame.removeEventListener("pointerover", onOver);
      frame.removeEventListener("pointerleave", onOver);
    };
    // The copy count only changes the DOM; the effect reads it through `copies` once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles]);

  const count = tiles.length * copies.nx * copies.ny;

  return (
    <div
      ref={frameRef}
      tabIndex={0}
      role="region"
      aria-label={`${workLabels.title}. ${workLabels.dragHint}.`}
      data-lenis-prevent
      className="group/frame relative h-full touch-none overflow-hidden select-none data-dragging:cursor-grabbing focus-visible:outline-offset-[-4px]"
    >
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      {Array.from({ length: count }, (_, c) => {
        const tile = tiles[c % tiles.length];
        const first = c < tiles.length;
        return (
          <Link
            key={c}
            ref={(el) => {
              tileRefs.current[c] = el;
            }}
            href={`/work/${tile.slug}`}
            transitionTypes={["open"]}
            data-copy={c}
            draggable={false}
            tabIndex={first ? 0 : -1}
            aria-hidden={first ? undefined : true}
            onFocus={first ? () => focusRef.current(c) : undefined}
            className="group absolute top-0 left-0 block will-change-transform"
            style={{ width: TILE_W, transform: "translate3d(-9999px, 0, 0)" }}
          >
            <span
              className="block border border-transparent transition-colors group-hover:border-accent group-focus-visible:border-accent"
              style={{ height: ART_H }}
            />
            <span className="mt-3 flex items-baseline justify-between gap-3">
              <span className="type-display text-tile text-text transition-colors group-hover:text-accent">
                {tile.title}
              </span>
              <span className="type-label text-accent">{tile.number}</span>
            </span>
            <span className="type-label mt-1 block text-text-muted">
              {tile.kind} · {tile.year}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
