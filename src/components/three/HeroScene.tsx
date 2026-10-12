"use client";

import { useEffect, useRef } from "react";

/**
 * A real GPU is available. Software renderers (SwiftShader, llvmpipe) would run the
 * scene on the CPU and stall the page, so they count as no WebGL.
 */
function gpuAvailable() {
  const gl = document.createElement("canvas").getContext("webgl2", {
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) return false;
  const info = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  gl.getExtension("WEBGL_lose_context")?.loseContext();
  return !/swiftshader|llvmpipe|softpipe|software/i.test(renderer);
}

/** Runs after the page has loaded and the main thread is idle, so 3D never competes with first paint. */
function whenIdle(run: () => void) {
  // Not every browser has requestIdleCallback; fall back to a short timeout.
  const idle = window.requestIdleCallback as Window["requestIdleCallback"] | undefined;
  let idleHandle = 0;
  let timeout = 0;
  const schedule = () => {
    if (idle) idleHandle = idle(run, { timeout: 1500 });
    else timeout = window.setTimeout(run, 200);
  };
  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });
  return () => {
    window.removeEventListener("load", schedule);
    if (idleHandle) window.cancelIdleCallback(idleHandle);
    window.clearTimeout(timeout);
  };
}

/**
 * The hero's 3D layer: lazily loads three.js (this route only) and the scene module,
 * then fades the canvas in once its first frame is drawn. Decorative and
 * `aria-hidden`; never takes pointer events. Reduced motion: one still frame.
 * No JS, no WebGL or no GPU: nothing, and the hero stays typographic.
 */
export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window.WebGL2RenderingContext === "undefined") return;

    let disposed = false;
    let dispose: (() => void) | undefined;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cancel = whenIdle(async () => {
      if (!gpuAvailable()) return;
      const { createHeroScene } = await import("./scene");
      if (disposed) return;
      try {
        const scene = createHeroScene(container, {
          still,
          onFirstFrame: () => container.classList.add("is-ready"),
        });
        dispose = scene.dispose;
      } catch {
        // No usable WebGL context: the hero stays typographic.
      }
    });

    return () => {
      disposed = true;
      cancel();
      dispose?.();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="hero-scene pointer-events-none absolute inset-0 overflow-hidden"
    />
  );
}
