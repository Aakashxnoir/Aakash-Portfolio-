"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { loadMotion, type Motion } from "@/components/motion/gsap";
import { timelineLabels } from "@/content/timeline";
import { motionAllowed, onPrefsChange } from "@/lib/prefs";

/** Menu bar plus path bar: where the pinned panel sticks. */
const TOP = 72;

/**
 * timeline.log with motion, from 768px: the panel (command line, graph, cards)
 * pins under the path bar and vertical scroll walks the cards sideways. The
 * active commit is ringed on the graph, the lines draw up to it, and the command
 * line shows `git show <hash>`. Focusing a card scrolls to it.
 *
 * Without motion (or JS) the same markup is a plain list. If motion is on but
 * this never runs, the card row still scrolls sideways on its own.
 */
export default function TimelineScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current!;
    let media: ReturnType<Motion["gsap"]["matchMedia"]> | null = null;
    let cancelled = false;

    const start = () =>
      loadMotion().then(({ gsap, ScrollTrigger }) => {
        if (cancelled || media || !motionAllowed()) return;
        media = gsap.matchMedia();
        media.add("(min-width: 768px)", () => {
          const viewport = section.querySelector<HTMLElement>("[data-tl-viewport]")!;
          const track = section.querySelector<HTMLElement>("[data-tl-track]")!;
          const command = section.querySelector<HTMLElement>("[data-tl-command]")!;
          const clip = section.querySelector<SVGRectElement>("[data-tl-clip]");
          const cards = Array.from(track.children) as HTMLElement[];
          const nodes = Array.from(section.querySelectorAll<SVGGElement>("[data-commit]"));
          const xs = nodes.map((node) => Number(node.dataset.x));
          const fullWidth = clip?.getAttribute("width") ?? "";
          const logCommand = command.textContent;
          const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

          let active = -1;
          const update = (progress: number) => {
            clip?.setAttribute(
              "width",
              String(xs[0] + progress * (xs[xs.length - 1] - xs[0]) + 12),
            );
            const index = Math.round(progress * (cards.length - 1));
            if (index === active) return;
            active = index;
            nodes.forEach((node, i) => node.toggleAttribute("data-active", i === index));
            cards.forEach((card, i) => card.toggleAttribute("data-active", i === index));
            command.textContent =
              progress > 0 ? `${timelineLabels.showCommand} ${cards[index].id}` : logCommand;
          };

          section.dataset.pinned = "";
          viewport.scrollLeft = 0;
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: `top ${TOP}px`,
              end: () => `+=${distance()}`,
              pin: true,
              scrub: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => update(self.progress),
            },
          });
          update(0);
          ScrollTrigger.refresh();

          // Keyboard focus on a card scrolls the page to where that card is shown.
          const onFocus = (event: FocusEvent) => {
            const card = (event.target as Element).closest<HTMLElement>("[data-tl-track] > li");
            const trigger = tween.scrollTrigger;
            if (!card || !trigger) return;
            viewport.scrollLeft = 0;
            const y =
              trigger.start +
              (cards.indexOf(card) / (cards.length - 1)) * (trigger.end - trigger.start);
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(y, { immediate: true });
            else window.scrollTo(0, y);
          };
          section.addEventListener("focusin", onFocus);

          return () => {
            section.removeEventListener("focusin", onFocus);
            delete section.dataset.pinned;
            nodes.forEach((node) => node.removeAttribute("data-active"));
            cards.forEach((card) => card.removeAttribute("data-active"));
            clip?.setAttribute("width", fullWidth);
            command.textContent = logCommand;
          };
        });
      });

    if (motionAllowed()) start();
    const offPrefs = onPrefsChange(() => {
      if (motionAllowed()) {
        start();
      } else {
        media?.revert();
        media = null;
      }
    });

    return () => {
      cancelled = true;
      offPrefs();
      media?.revert();
    };
  }, []);

  return (
    <section ref={ref} aria-label={timelineLabels.commitsLabel} className="tl">
      {children}
    </section>
  );
}
