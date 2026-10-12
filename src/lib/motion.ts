/**
 * Motion switch. An inline <head> script adds `motion` to <html> before first paint
 * when the visitor allows motion. CSS entrances, pre-reveal hiding and the scroll
 * story layouts all key off that class, so without JS (no script) or under reduced
 * motion (no class) every page renders complete and still. On the first visit of a
 * session it also adds `is-loading`, which shows the loading screen (blocked storage
 * throws, so the loader just stays off).
 */
export const MOTION_CLASS = "motion";
/** On <html> while the first-visit loading screen is up (once per session). */
export const LOADING_CLASS = "is-loading";
export const LOADED_KEY = "loaded";

/** If the app never hydrates, the head script removes the class by itself after this long (ms). */
const FAILSAFE_MS = 6000;

declare global {
  interface Window {
    __motionFailsafe?: number;
  }
}

export const motionInitScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.classList.add("${MOTION_CLASS}");window.__motionFailsafe=setTimeout(function(){d.classList.remove("${MOTION_CLASS}","${LOADING_CLASS}")},${FAILSAFE_MS});if(!sessionStorage.getItem("${LOADED_KEY}"))d.classList.add("${LOADING_CLASS}")}}catch(e){}`;

/** The app has hydrated and drives motion from here. */
export function cancelMotionFailsafe() {
  window.clearTimeout(window.__motionFailsafe);
}

/** True when motion effects may run (head script ran and reduced motion is off). */
export function motionAllowed() {
  return (
    document.documentElement.classList.contains(MOTION_CLASS) &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** A mouse or trackpad: hover and a fine pointer. */
export function finePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
