import { apps } from "@/content/site";

/**
 * Transform origins for the window view transitions, as CSS variables on <html>
 * (the transition pseudo-elements inherit them). Each is relative to the page
 * element being animated, which starts under the menu bar.
 */
const BAR = 40;
/** Distance of a desktop app's corner point from the screen edges. */
const INSET = 56;

function set(name: string, x: number, y: number) {
  const style = document.documentElement.style;
  style.setProperty(`--win-${name}-x`, `${Math.round(x)}px`);
  style.setProperty(`--win-${name}-y`, `${Math.round(y)}px`);
}

/** The new window grows from this viewport point (it opens scrolled to the top). */
export function markOpen(x: number, y: number) {
  set("open", x, y - BAR);
}

/**
 * The current window shrinks back to where it came from: an app's desktop corner
 * when going home, otherwise the middle of the screen.
 */
export function markClose(from: string, to: string) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  let x = w / 2;
  let y = h / 2;
  if (to === "/") {
    const index = apps.findIndex((app) => from === app.href || from.startsWith(`${app.href}/`));
    if (index >= 0) {
      x = index % 2 ? w - INSET : INSET;
      y = index < 2 ? BAR + INSET : h - INSET;
    }
  }
  set("close", x, y - BAR + window.scrollY);
}

/** True when `to` is the desktop or a parent of `from` (a close, not an open). */
export function isClose(from: string, to: string) {
  return to === "/" || (from !== to && from.startsWith(`${to}/`));
}
