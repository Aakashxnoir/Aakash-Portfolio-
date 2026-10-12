"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { EASE_IN_OUT, gsap, ScrollTrigger } from "./gsap";
import { getLenis } from "./lenis";
import { getProject } from "@/content/projects";
import { labels, nav } from "@/content/site";
import { motionAllowed } from "@/lib/motion";

const COVER = 0.45;
const REVEAL = 0.55;
/** If the new route has not arrived this long after the cover, the curtain lifts anyway. */
const GIVE_UP = 2500;

/** The word shown on the curtain: the destination page's name. */
function titleFor(pathname: string) {
  const slug = pathname.match(/^\/work\/([^/]+)/)?.[1];
  if (slug) return getProject(slug)?.title ?? "";
  return nav.find((link) => link.href === pathname)?.label ?? labels.home;
}

/** Lifts the curtain off the new page and hands scrolling back. */
function lift(curtain: HTMLElement) {
  gsap.to(curtain, {
    yPercent: -100,
    duration: REVEAL,
    ease: EASE_IN_OUT,
    onComplete: () => {
      gsap.set(curtain, { visibility: "hidden" });
    },
  });
  getLenis()?.start();
}

/**
 * Full-screen curtain between routes. A plain click on an internal link raises the
 * curtain (transform only), the route changes underneath, then the curtain lifts
 * away and the new page's entrance plays. Back and forward, modified clicks,
 * downloads, new-tab and same-page links are never intercepted. The curtain never
 * takes pointer events or focus. Reduced motion: no curtain, instant route change.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  /** Set while a navigation we started is waiting for its route. */
  const pending = useRef<{ from: string; timer: number } | null>(null);

  // The route we navigated to has arrived: start at the top, then lift.
  useEffect(() => {
    const wait = pending.current;
    if (!wait || wait.from === pathname) return;
    window.clearTimeout(wait.timer);
    pending.current = null;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    if (curtainRef.current) lift(curtainRef.current);
  }, [pathname]);

  useEffect(() => {
    if (!motionAllowed()) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();
      if (pending.current) return;

      const curtain = curtainRef.current;
      if (!curtain || !labelRef.current) return;
      labelRef.current.textContent = titleFor(url.pathname);
      // The new page's entrance waits for the curtain to lift.
      document.documentElement.style.setProperty("--enter-delay", `${REVEAL * 0.5}s`);
      getLenis()?.stop();

      const from = window.location.pathname;
      pending.current = {
        from,
        timer: window.setTimeout(() => {
          pending.current = null;
          lift(curtain);
        }, GIVE_UP),
      };

      gsap.fromTo(labelRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.6, delay: 0.15, ease: "expo.out" });
      gsap.fromTo(
        curtain,
        { yPercent: 100, visibility: "visible" },
        {
          yPercent: 0,
          duration: COVER,
          ease: EASE_IN_OUT,
          onComplete: () => router.push(url.pathname + url.search + url.hash),
        },
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div
      ref={curtainRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[60] flex items-end border-t border-accent bg-bg"
    >
      <div className="mx-auto w-full max-w-[1440px] px-page pb-12">
        <div className="overflow-hidden">
          <p ref={labelRef} className="type-display text-title font-bold text-text" />
        </div>
      </div>
    </div>
  );
}
