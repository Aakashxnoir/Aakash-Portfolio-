"use client";

import { useEffect, useRef } from "react";
import { onPrefsChange } from "@/lib/prefs";
import { fontReady, readTheme, startLoop } from "./engine";
import { FieldRenderer } from "./FieldRenderer";
import type { FieldId } from "./fields";

/**
 * A live generative ASCII artwork. Decorative: hidden from assistive tech, and
 * every fact it hints at is in the page text. Without JS the canvas stays empty.
 */
export default function AsciiArt({
  field,
  fontSize = 12,
  fps = 24,
  className,
}: {
  field: FieldId;
  fontSize?: number;
  fps?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    let disposed = false;
    let cleanup = () => {};

    const theme = readTheme();
    fontReady(theme.font).then(() => {
      if (disposed) return;
      const renderer = new FieldRenderer(canvas, field, fontSize, theme);
      renderer.resize();
      const loop = startLoop(canvas, (t) => renderer.render(t), fps);
      const resize = new ResizeObserver(() => {
        renderer.resize();
        loop.redraw();
      });
      resize.observe(canvas);
      const offPrefs = onPrefsChange(() => {
        renderer.setTheme(readTheme());
        loop.redraw();
      });
      canvas.dataset.ready = "";
      cleanup = () => {
        loop.stop();
        resize.disconnect();
        offPrefs();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [field, fontSize, fps]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`opacity-0 transition-opacity duration-700 data-ready:opacity-100 ${className ?? ""}`}
    />
  );
}
