"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { getLenis } from "../motion/lenis";
import { motionAllowed } from "@/lib/motion";

/**
 * Pins the work section and moves its track (`data-work-track`) sideways with
 * vertical scroll (transform only), filling the progress line as it goes.
 *
 * Keyboard: the pinned frame is `overflow: clip`, so focus can never scroll the track
 * natively; when a panel takes focus the page scrolls to the point where that panel
 * is in view. Without motion the vertical list shows instead (CSS, `fx:` variant).
 */
export default function WorkStory({
  className,
  labelledBy,
  children,
}: {
  className: string;
  labelledBy: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  // Layout effect: the pin spacer is undone before React removes
  // the element on a route change (a passive cleanup would run too late).
  useLayoutEffect(() => {
    const section = ref.current;
    const track = section?.querySelector<HTMLElement>("[data-work-track]");
    const progress = section?.querySelector<HTMLElement>("[data-work-progress]");
    if (!section || !track || !progress || !motionAllowed()) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, { x: () => -distance(), ease: "none" });
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      animation: tween,
      invalidateOnRefresh: true,
      onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
    });

    const onFocus = (event: FocusEvent) => {
      const panel = (event.target as Element).closest<HTMLElement>("[data-work-panel]");
      if (!panel || distance() === 0) return;
      const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
      const at = gsap.utils.clamp(0, 1, (panel.offsetLeft - pad) / distance());
      const y = trigger.start + at * (trigger.end - trigger.start);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo(0, y);
    };
    track.addEventListener("focusin", onFocus);

    return () => {
      track.removeEventListener("focusin", onFocus);
      trigger.kill();
      tween.kill();
      gsap.set([track, progress], { clearProps: "transform" });
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
