"use client";

import { useEffect, useRef } from "react";
import { EASE_IN_OUT, gsap } from "./gsap";
import { getLenis } from "./lenis";
import { hero, labels, site } from "@/content/site";
import { LOADED_KEY, LOADING_CLASS } from "@/lib/motion";

/** Shortest and longest time on screen (s): never a flash, never a trap. */
const MIN = 1.1;
const CAP = 2.4;

/**
 * First-visit loading screen. The counter follows real loading (fonts, then the
 * page's load event), eases toward it and never runs ahead. At 100 the screen lifts
 * (transform) and the page's entrance starts. Once per session; any key or click
 * skips it. Shown only while <html> has `is-loading` (set by the head script), so
 * reduced motion and no-JS visitors never see it.
 */
export default function Loader() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const loader = ref.current;
    if (!loader || !root.classList.contains(LOADING_CLASS)) return;
    try {
      sessionStorage.setItem(LOADED_KEY, "1");
    } catch {
      // Blocked storage: the loader may show again next visit.
    }
    getLenis()?.stop();

    const start = performance.now();
    let target = 0;
    document.fonts.ready.then(() => (target = Math.max(target, 50)));
    const onLoad = () => (target = 100);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    let value = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
      if (countRef.current) countRef.current.textContent = "100";
      gsap.set(lineRef.current, { scaleX: 1 });
      // Keep the screen up while it lifts; the page underneath starts its entrance now.
      loader.style.display = "flex";
      root.classList.remove(LOADING_CLASS);
      getLenis()?.start();
      gsap.to(loader, {
        yPercent: -100,
        duration: 0.9,
        delay: 0.15,
        ease: EASE_IN_OUT,
        onComplete: () => {
          loader.style.display = "none";
        },
      });
    };

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed > CAP) target = 100;
      // Ease toward the real value, but no faster than MIN allows.
      value = Math.min(value + (target - value) * 0.08, (elapsed / MIN) * 100);
      if (countRef.current) countRef.current.textContent = String(Math.round(value)).padStart(3, "0");
      gsap.set(lineRef.current, { scaleX: value / 100 });
      if (value > 99.5) finish();
    };

    gsap.ticker.add(tick);
    window.addEventListener("keydown", finish);
    window.addEventListener("pointerdown", finish);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", onLoad);
      window.removeEventListener("keydown", finish);
      window.removeEventListener("pointerdown", finish);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="loader fixed inset-0 z-[80] flex-col justify-between bg-bg"
    >
      <p role="status" className="sr-only">
        {labels.loading}
      </p>
      <div
        aria-hidden="true"
        className="mx-auto flex w-full max-w-[1440px] justify-between px-page pt-8 type-label text-text-muted"
      >
        <span>{site.name}</span>
        <span>{hero.label}</span>
      </div>
      <div
        aria-hidden="true"
        className="mx-auto flex w-full max-w-[1440px] items-end justify-between px-page pb-12"
      >
        <span
          ref={countRef}
          className="type-display text-hero font-extrabold leading-[0.8] tabular-nums text-text"
        >
          000
        </span>
        <span className="type-label text-text-muted">{labels.loading}</span>
      </div>
      <div
        ref={lineRef}
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
