"use client";

import type Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motionAllowed, onPrefsChange } from "@/lib/prefs";
import { loadMotion } from "./gsap";

let lenis: Lenis | null = null;

/** The running Lenis instance, or null when motion is off. */
export function getLenis() {
  return lenis;
}

/**
 * Lenis smooth scroll, the only scroll driver, ticked by GSAP so ScrollTrigger
 * reads the same frame. Runs only while motion is allowed; otherwise the page
 * scrolls natively.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    let disposed = false;
    let stop = () => {};

    const start = async () => {
      if (lenis || !motionAllowed()) return;
      const [{ default: LenisClass }, { gsap, ScrollTrigger }] = await Promise.all([
        import("lenis"),
        loadMotion(),
      ]);
      if (disposed || lenis || !motionAllowed()) return;
      const instance = new LenisClass({ anchors: true, stopInertiaOnNavigate: true });
      lenis = instance;
      instance.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        instance.destroy();
        lenis = null;
        stop = () => {};
      };
    };

    start();
    const offPrefs = onPrefsChange(() => (motionAllowed() ? start() : stop()));
    return () => {
      disposed = true;
      offPrefs();
      stop();
    };
  }, []);

  // A navigation drops any leftover inertia, so the new page keeps the scroll
  // position the router gives it.
  useEffect(() => {
    lenis?.stop();
    lenis?.start();
  }, [pathname]);

  return null;
}
