"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "../motion/gsap";
import { motionAllowed } from "@/lib/motion";

/**
 * Pins the intro, centred on screen, for one screen of scroll and lights its words (`data-word`) in
 * order as you scroll, both ways. Unlit words are --text-muted (readable), lit ones
 * --text or the accent. Without motion it is a normal section with every word lit.
 */
export default function IntroStory({
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
    if (!section || !motionAllowed()) return;

    const words = [...section.querySelectorAll<HTMLElement>("[data-word]")];
    const clamp = gsap.utils.clamp(0, 1);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "center center",
      end: () => `+=${window.innerHeight}`,
      pin: true,
      onUpdate(self) {
        // Lighting starts a little into the pin and finishes before it ends.
        const lit = Math.round(clamp((self.progress - 0.1) / 0.75) * words.length);
        words.forEach((word, i) => word.classList.toggle("is-lit", i < lit));
      },
    });

    return () => {
      trigger.kill();
      words.forEach((word) => word.classList.remove("is-lit"));
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby={labelledBy} className={className}>
      {children}
    </section>
  );
}
