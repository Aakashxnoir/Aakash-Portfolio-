/** The toys in Extras, plus Sleep, opened from menus or the terminal. */
export type Extra = "terminal" | "lights" | "sleep";

const EVENT = "noiros:extra";

export function openExtra(extra: Extra) {
  window.dispatchEvent(new CustomEvent<Extra>(EVENT, { detail: extra }));
}

export function onExtra(callback: (extra: Extra) => void) {
  const handler = (event: Event) => callback((event as CustomEvent<Extra>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
