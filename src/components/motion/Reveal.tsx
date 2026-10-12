"use client";

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import { EASE_OUT, gsap, SplitText } from "./gsap";
import { motionAllowed } from "@/lib/motion";

/**
 * Reveals its element once, as it scrolls into view. `split` raises each line of a
 * heading out of a mask; `stagger` raises its children in turn; otherwise the block
 * fades and rises 32px.
 *
 * `data-reveal` hides the element before hydration only while motion is on (see
 * globals.css), so without JS or under reduced motion it is simply there.
 */
export default function Reveal({
  as: Tag = "div",
  split = false,
  stagger = false,
  delay = 0,
  className,
  children,
  ...rest
}: {
  as?: ElementType;
  split?: boolean;
  /** Animate the children in turn (list rows) rather than the whole element. */
  stagger?: boolean;
  delay?: number;
  className?: string;
  children: ReactNode;
  id?: string;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // Layout effect: the split lines are undone before React removes
  // the element on a route change (a passive cleanup would run too late).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) {
      el.style.visibility = "visible";
      return;
    }

    const trigger = { trigger: el, start: "top 88%", once: true };
    const ctx = gsap.context(() => {
      if (split) {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.1,
              stagger: 0.08,
              delay,
              ease: EASE_OUT,
              scrollTrigger: trigger,
            });
          },
        });
      } else if (stagger) {
        gsap.set(el, { visibility: "visible" });
        gsap.from(el.children, {
          autoAlpha: 0,
          y: 24,
          duration: 0.8,
          stagger: 0.07,
          delay,
          ease: EASE_OUT,
          scrollTrigger: trigger,
        });
      } else {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 32 },
          { autoAlpha: 1, y: 0, duration: 0.9, delay, ease: EASE_OUT, scrollTrigger: trigger },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [split, stagger, delay]);

  return (
    <Tag ref={ref} data-reveal="" className={className} {...rest}>
      {children}
    </Tag>
  );
}
