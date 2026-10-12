"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";
import { setLenis } from "./lenis";
import { cancelMotionFailsafe, motionAllowed } from "@/lib/motion";

/**
 * Starts smooth scroll once per load. Lenis is the only scroll driver; it runs on
 * GSAP's ticker and feeds ScrollTrigger, so pinned and scrubbed effects stay in step.
 * Off under reduced motion (native scroll).
 */
export default function MotionRoot() {
  useEffect(() => {
    cancelMotionFailsafe();
    if (!motionAllowed()) return;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1, anchors: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Display type changes width when the web fonts land.
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
