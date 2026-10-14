import type { Phosphor } from "@/content/site";

/**
 * Visitor preferences (System menu): phosphor, CRT effect and motion. Stored in
 * localStorage and applied by an inline head script before first paint, as
 * attributes on <html>:
 *   data-phosphor="noir|amber|green", data-crt="on|off", data-motion="on|off"
 * Motion is on unless the visitor switches it off in System > Motion. It does
 * NOT follow prefers-reduced-motion: desktops with animations turned down (KDE
 * "Instant", GNOME animations off, Windows animation effects off) report
 * `reduce`, and following it left the site with no motion at all. Aakash's call,
 * 14 Oct 2026; see docs/DESIGN_SYSTEM.md. Older stored "auto" values mean on.
 * The script also adds `js` (JS-only controls may show), `motion` (motion
 * effects may run) and, on the first page of a session unless motion is switched
 * off, `boot` (the boot screen plays).
 * Without JS none of this happens and the page is complete, still and noir.
 */
export type Motion = "on" | "off";
export type Prefs = { phosphor: Phosphor; crt: "on" | "off"; motion: Motion };

export const DEFAULT_PREFS: Prefs = { phosphor: "noir", crt: "on", motion: "on" };

const KEY = "noiros:prefs";
/** Set once the boot screen has played in this tab's session. */
const BOOT_KEY = "noiros:booted";
export const PREFS_EVENT = "noiros:prefs";

export const prefsInitScript = `(function(){var d=document.documentElement;d.classList.add("js");var p={};try{p=JSON.parse(localStorage.getItem("${KEY}")||"{}")||{}}catch(e){}d.dataset.phosphor=p.phosphor||"noir";d.dataset.crt=p.crt||"on";var m=d.dataset.motion=p.motion==="off"?"off":"on";if(m==="on"){d.classList.add("motion");try{if(!sessionStorage.getItem("${BOOT_KEY}")){sessionStorage.setItem("${BOOT_KEY}","1");d.classList.add("boot")}}catch(e){}}})()`;

export function readPrefs(): Prefs {
  const d = document.documentElement.dataset;
  return {
    phosphor: (d.phosphor as Phosphor) ?? DEFAULT_PREFS.phosphor,
    crt: d.crt === "off" ? "off" : "on",
    motion: d.motion === "off" ? "off" : "on",
  };
}

export function writePrefs(next: Partial<Prefs>) {
  const prefs = { ...readPrefs(), ...next };
  const root = document.documentElement;
  root.dataset.phosphor = prefs.phosphor;
  root.dataset.crt = prefs.crt;
  root.dataset.motion = prefs.motion;
  root.classList.toggle("motion", prefs.motion === "on");
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
}

/** True when motion effects may run: everywhere, unless System > Motion is off. */
export function motionAllowed() {
  return document.documentElement.classList.contains("motion");
}

/** A mouse or trackpad: hover and a fine pointer. */
export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Subscribe to preference changes (System menu, other tabs' storage does not sync). */
export function onPrefsChange(callback: () => void) {
  window.addEventListener(PREFS_EVENT, callback);
  return () => window.removeEventListener(PREFS_EVENT, callback);
}
