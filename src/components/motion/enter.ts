import type { CSSProperties } from "react";

/**
 * Delay for a first-paint entrance (`enter-line` or `enter-fade` in globals.css).
 * Entrances are CSS only, so they start with the first frame and never wait for JS.
 */
export function enterDelay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}
