"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { motionAllowed, onPrefsChange } from "@/lib/prefs";
import { afterBoot, booting } from "./Boot";
import { loadMotion, motionLibs, type Motion } from "./gsap";

/** Close to the design system's cubic-bezier(0.22, 1, 0.36, 1). */
const EASE = "power4.out";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Page motion, set up again on every route:
 * - `[data-scramble]` display headings scramble in from random glyphs, once
 * - `[data-reveal]` blocks fade and rise 24px as they enter, once
 * - `[data-lit]` text lights word by word, muted to full, with scroll (LitText)
 *
 * Nothing is hidden in the server HTML. On the first page load, what is already
 * on screen stays as painted (it only animates in as the boot screen opens);
 * blocks further down are hidden only once they are off screen and the script is
 * running. Under reduced motion or System > Motion off, none of this runs.
 */
export default function MotionController() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useLayoutEffect(() => {
    const first = firstLoad.current;
    firstLoad.current = false;
    let context: ReturnType<Motion["gsap"]["context"]> | null = null;
    let cancelled = false;
    let offBoot = () => {};

    const run = (libs: Motion, entering: boolean) => {
      if (cancelled || !motionAllowed()) return;
      context = libs.gsap.context(() => setup(libs, entering));
    };

    if (motionAllowed()) {
      const libs = motionLibs();
      if (libs && !first) {
        // A navigation: set the new page's start state before it paints.
        run(libs, true);
      } else {
        const wasBooting = first && booting();
        loadMotion().then((loaded) => {
          if (cancelled) return;
          if (wasBooting) offBoot = afterBoot(() => run(loaded, true));
          else run(loaded, !first);
        });
      }
    }

    // Switching motion off shows everything as it is.
    const offPrefs = onPrefsChange(() => {
      if (!motionAllowed()) {
        context?.revert();
        context = null;
      }
    });

    return () => {
      cancelled = true;
      offBoot();
      offPrefs();
      context?.revert();
    };
  }, [pathname]);

  return null;
}

function setup({ gsap, ScrollTrigger }: Motion, entering: boolean) {
  const main = document.getElementById("main");
  if (!main) return;
  const fold = window.innerHeight;
  const place = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return rect.top > fold ? "below" : rect.bottom < 0 ? "above" : "in";
  };

  main.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
    const text = el.textContent ?? "";
    const play = () =>
      gsap.to(el, {
        duration: Math.min(1.4, 0.5 + text.length * 0.035),
        ease: "none",
        scrambleText: { text, chars: GLYPHS, speed: 0.7, revealDelay: 0.1 },
      });
    const where = place(el);
    if (where === "below") {
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () => void play(),
      });
    } else if (where === "in" && entering) {
      play();
    }
  });

  const blocks = Array.from(main.querySelectorAll<HTMLElement>("[data-reveal]"));
  const inView = blocks.filter((el) => place(el) === "in");
  if (entering && inView.length) {
    gsap.from(inView, {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: EASE,
      stagger: 0.07,
      clearProps: "opacity,transform",
    });
  }
  blocks
    .filter((el) => place(el) === "below")
    .forEach((el) => {
      gsap.set(el, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        once: true,
        onEnter: () =>
          void gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: EASE,
            clearProps: "opacity,transform",
          }),
      });
    });

  main.querySelectorAll<HTMLElement>("[data-lit]").forEach((el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-word]"),
      { "--lit": 0 },
      {
        "--lit": 1,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 40%", scrub: true },
      },
    );
  });

  ScrollTrigger.refresh();
}
