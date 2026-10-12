"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";
import { finePointer, motionAllowed } from "@/lib/motion";

const INTERACTIVE = "a[href], button";

/**
 * A small off-white dot that follows the pointer and swells over links and buttons.
 * `mix-blend-difference` inverts whatever is under it. Mouse or trackpad only, off
 * under reduced motion; the native cursor is hidden only while it runs, and focus
 * rings are untouched.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = ref.current;
    if (!dot || !motionAllowed() || !finePointer()) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");
    gsap.set(dot, { xPercent: -50, yPercent: -50, scale: 0, visibility: "visible" });
    const toX = gsap.quickTo(dot, "x", { duration: 0.25, ease: "power3.out" });
    const toY = gsap.quickTo(dot, "y", { duration: 0.25, ease: "power3.out" });
    let shown = false;
    let hovering = false;

    const onMove = (event: PointerEvent) => {
      toX(event.clientX);
      toY(event.clientY);
      if (!shown) {
        shown = true;
        gsap.set(dot, { x: event.clientX, y: event.clientY });
        gsap.to(dot, { scale: hovering ? 4 : 1, duration: 0.3 });
      }
    };
    const onOver = (event: PointerEvent) => {
      const over = Boolean((event.target as Element | null)?.closest?.(INTERACTIVE));
      if (over === hovering) return;
      hovering = over;
      gsap.to(dot, { scale: over ? 4 : 1, duration: 0.35, ease: "power3.out" });
    };
    const onLeave = () => {
      shown = false;
      gsap.to(dot, { scale: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none invisible fixed left-0 top-0 z-[70] size-3 rounded-full bg-text mix-blend-difference"
    />
  );
}
