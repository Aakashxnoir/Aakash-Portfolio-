import type Lenis from "lenis";

/** The one Lenis instance, owned by MotionRoot. Null under reduced motion. */
let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}
