import type { Phosphor } from "@/content/site";

/**
 * Visitor preferences (System menu): phosphor, CRT effect and motion. Stored in
 * localStorage and applied by an inline head script before first paint, as
 * attributes on <html>:
 *   data-phosphor="noir|amber|green", data-crt="on|off", data-motion="auto|on|off"
 * Motion "auto" follows prefers-reduced-motion; "on" and "off" are the visitor's
 * own choice in System > Motion and win over it.
 * The script also adds `js` (JS-only controls may show), `motion` (motion
 * effects may run) and, on the first page of a session unless motion is switched
 * off, `boot` (the boot screen plays; without `motion` it plays still).
 * Without JS none of this happens and the page is complete, still and noir.
 */
export type Motion = "auto" | "on" | "off";
export type Prefs = { phosphor: Phosphor; crt: "on" | "off"; motion: Motion };

export const DEFAULT_PREFS: Prefs = { phosphor: "noir", crt: "on", motion: "auto" };

const KEY = "noiros:prefs";
/** Set once the boot screen has played in this tab's session. */
const BOOT_KEY = "noiros:booted";
export const PREFS_EVENT = "noiros:prefs";
const REDUCE = "(prefers-reduced-motion: reduce)";

export const prefsInitScript = `(function(){var d=document.documentElement;d.classList.add("js");var p={};try{p=JSON.parse(localStorage.getItem("${KEY}")||"{}")||{}}catch(e){}d.dataset.phosphor=p.phosphor||"noir";d.dataset.crt=p.crt||"on";var m=d.dataset.motion=p.motion||"auto";if(m==="on"||(m==="auto"&&!matchMedia("${REDUCE}").matches))d.classList.add("motion");if(m!=="off")try{if(!sessionStorage.getItem("${BOOT_KEY}")){sessionStorage.setItem("${BOOT_KEY}","1");d.classList.add("boot")}}catch(e){}})()`;

export function readPrefs(): Prefs {
  const d = document.documentElement.dataset;
  return {
    phosphor: (d.phosphor as Phosphor) ?? DEFAULT_PREFS.phosphor,
    crt: d.crt === "off" ? "off" : "on",
    motion: d.motion === "on" || d.motion === "off" ? d.motion : "auto",
  };
}

/** Whether motion runs for this preference and the system setting. */
function motionFor(motion: Motion) {
  return motion === "on" || (motion === "auto" && !reducedMotion());
}

export function writePrefs(next: Partial<Prefs>) {
  const prefs = { ...readPrefs(), ...next };
  const root = document.documentElement;
  root.dataset.phosphor = prefs.phosphor;
  root.dataset.crt = prefs.crt;
  root.dataset.motion = prefs.motion;
  root.classList.toggle("motion", motionFor(prefs.motion));
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked: the choice lasts for this page view only.
  }
  window.dispatchEvent(new Event(PREFS_EVENT));
}

export function reducedMotion() {
  return window.matchMedia(REDUCE).matches;
}

/** True when motion effects may run (see Motion above). */
export function motionAllowed() {
  return document.documentElement.classList.contains("motion");
}

/** A mouse or trackpad: hover and a fine pointer. */
export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/** Subscribe to preference changes (System menu, other tabs' storage does not sync). */
export function onPrefsChange(callback: () => void) {
  const media = window.matchMedia(REDUCE);
  const onMedia = () => {
    document.documentElement.classList.toggle("motion", motionFor(readPrefs().motion));
    callback();
  };
  window.addEventListener(PREFS_EVENT, callback);
  media.addEventListener("change", onMedia);
  return () => {
    window.removeEventListener(PREFS_EVENT, callback);
    media.removeEventListener("change", onMedia);
  };
}
