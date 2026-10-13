import type { gsap as Gsap } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

export type Motion = { gsap: typeof Gsap; ScrollTrigger: typeof ScrollTriggerType };

let loaded: Motion | null = null;
let loading: Promise<Motion> | null = null;

/**
 * GSAP with ScrollTrigger and ScrambleText, loaded after first paint so they
 * stay out of the initial bundle. Resolves to the same instance every time.
 */
export function loadMotion(): Promise<Motion> {
  loading ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/ScrambleTextPlugin"),
  ]).then(([{ gsap }, { ScrollTrigger }, { ScrambleTextPlugin }]) => {
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
    loaded = { gsap, ScrollTrigger };
    return loaded;
  });
  return loading;
}

/** The loaded libraries, or null before loadMotion() has finished. */
export function motionLibs() {
  return loaded;
}
