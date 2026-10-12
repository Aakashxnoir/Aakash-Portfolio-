"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "./gsap";
import { finePointer, motionAllowed } from "@/lib/motion";

/** Furthest the element drifts toward the pointer (px). */
const MAX = 8;
const STRENGTH = 0.3;

/**
 * Wraps a link so it drifts up to 8px toward the pointer while hovered and springs
 * back on leave (transform only). Mouse or trackpad only, off under reduced motion.
 */
export default function Magnetic({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionAllowed() || !finePointer()) return;

    const toX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const toY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const clamp = gsap.utils.clamp(-MAX, MAX);

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      toX(clamp((event.clientX - (box.left + box.width / 2)) * STRENGTH));
      toY(clamp((event.clientY - (box.top + box.height / 2)) * STRENGTH));
    };
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)", overwrite: true });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
