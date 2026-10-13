"use client";

import { useEffect, useRef } from "react";
import { boot } from "@/content/extras";
import { loadMotion } from "./gsap";

type Step = keyof typeof boot.steps;
const STEPS = Object.keys(boot.steps) as Step[];

/** Time limits, in ms from navigation start. */
const MIN_SHOWN = 900;
const CAP = 1850;
/** Length of the exit (the screen opening from a line), in ms. */
const EXIT = 550;

const BOOT_EVENT = "noiros:boot-exit";
/** Set once the boot screen has started to open. */
let opened = false;

/** True while the boot screen covers the page. */
export function booting() {
  return !opened && document.documentElement.classList.contains("boot");
}

/** Runs `callback` when the boot screen starts to open, or now if there is none. */
export function afterBoot(callback: () => void) {
  if (!booting()) {
    callback();
    return () => {};
  }
  window.addEventListener(BOOT_EVENT, callback, { once: true });
  return () => window.removeEventListener(BOOT_EVENT, callback);
}

/**
 * The NOIR/OS boot screen, once per session unless System > Motion is off (the
 * head script adds `boot` to <html>; without it this markup stays hidden).
 * Without motion it plays still: no power-on or opening, it fades. The counter follows
 * real loading: fonts, images, the motion libraries and the window load event,
 * each printed as an [ ok ] line. Any key or click skips it; it never runs past
 * 2.4s, and a CSS failsafe hides it if this script never runs. It sits under
 * the menu bar, which stays usable throughout.
 */
export default function Boot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!booting()) return;
    const el = ref.current!;
    const counter = el.querySelector<HTMLElement>("[data-counter]")!;
    const bar = el.querySelector<HTMLElement>("[data-bar]")!;
    const done = new Set<Step>(["mount"]);
    let shown = 0;
    let exiting = false;
    let raf = 0;
    const timers: number[] = [];

    const mark = (step: Step) => {
      done.add(step);
      el.querySelector(`[data-step="${step}"]`)?.setAttribute("data-done", "");
    };
    mark("mount");

    const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img")).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    );
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );

    document.fonts.ready.then(() => mark("fonts"));
    Promise.all(images).then(() => mark("images"));
    loadMotion().then(
      () => mark("motion"),
      () => mark("motion"),
    );
    loaded.then(() => mark("ready"));

    const exit = () => {
      if (exiting) return;
      exiting = true;
      STEPS.forEach(mark);
      counter.textContent = "100";
      bar.style.scale = "1 1";
      el.dataset.exit = "";
      opened = true;
      window.dispatchEvent(new Event(BOOT_EVENT));
      timers.push(
        window.setTimeout(() => {
          document.documentElement.classList.remove("boot");
          cancelAnimationFrame(raf);
        }, EXIT),
      );
    };

    // The counter eases toward the share of steps done; it reaches 100 only
    // when every step has, and never before MIN_SHOWN.
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (exiting) return;
      const target = (done.size / STEPS.length) * 100;
      shown += (target - shown) * 0.12 + (shown < target ? 0.4 : 0);
      shown = Math.min(shown, target);
      counter.textContent = String(Math.round(shown)).padStart(3, "0");
      bar.style.scale = `${shown / 100} 1`;
      const now = performance.now();
      if ((shown > 99.5 && now > MIN_SHOWN) || now > CAP) exit();
    };
    raf = requestAnimationFrame(tick);

    const skip = () => exit();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="boot-layer">
      <div className="boot-half boot-half-top" />
      <div className="boot-half boot-half-bottom" />
      <div className="boot-screen flex flex-col justify-between px-shell py-8 md:py-10">
        <div className="text-ui text-text-soft">
          <p className="text-text">{boot.title}</p>
          <p className="text-text-muted">{boot.tty}</p>
          <ul className="mt-6 space-y-1">
            {STEPS.map((step) => (
              <li key={step} data-step={step} className="boot-step">
                <span className="text-accent">{boot.ok}</span> {boot.steps[step]}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p
            data-counter
            className="type-display text-[clamp(5rem,14vw,12rem)] leading-none text-text tabular-nums"
          >
            000
          </p>
          <div className="mt-4 h-1 bg-rule">
            <div data-bar className="h-full origin-left scale-x-0 bg-accent" />
          </div>
          <p className="type-label mt-4 text-text-muted">{boot.skip}</p>
        </div>
      </div>
      <div className="boot-power" />
    </div>
  );
}
