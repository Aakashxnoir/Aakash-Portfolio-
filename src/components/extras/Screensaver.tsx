"use client";

import { useEffect, useRef, useState } from "react";
import Clock from "@/components/shell/Clock";
import { screensaver } from "@/content/extras";
import { onExtra } from "@/lib/extras";

const IDLE = 90_000;
/** Input in the first moments after falling asleep (the Sleep click itself) is ignored. */
const SETTLE = 700;
/** Pointer travel, in px, that counts as waking up. */
const NUDGE = 12;

/**
 * The screensaver: after 90 seconds without input, or System > Sleep, the screen
 * goes dark but for one breathing red circle and the clock (the circle is still
 * under reduced motion). Any key, click, scroll or real mouse movement wakes it;
 * that input does nothing else. While the tab is hidden its title changes.
 */
export default function Screensaver() {
  const [asleep, setAsleep] = useState(false);
  const asleepRef = useRef(false);

  useEffect(() => {
    let timer = 0;
    let since = 0;
    let travel = 0;

    const sleep = () => {
      asleepRef.current = true;
      since = performance.now();
      travel = 0;
      setAsleep(true);
    };
    const arm = () => {
      window.clearTimeout(timer);
      // An open window (terminal, game) keeps the screen awake.
      timer = window.setTimeout(
        () => (document.querySelector("dialog[open]") ? arm() : sleep()),
        IDLE,
      );
    };
    const wake = () => {
      asleepRef.current = false;
      setAsleep(false);
      arm();
    };

    const onInput = (event: Event) => {
      if (!asleepRef.current) {
        arm();
        return;
      }
      if (performance.now() - since < SETTLE) return;
      if (event.type === "pointermove") {
        const move = event as PointerEvent;
        travel += Math.abs(move.movementX) + Math.abs(move.movementY);
        if (travel < NUDGE) return;
      }
      // The waking input should not also press a key or follow a link.
      if (event.type === "keydown" || event.type === "pointerdown") event.preventDefault();
      event.stopPropagation();
      wake();
    };

    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];
    events.forEach((type) =>
      window.addEventListener(type, onInput, {
        capture: true,
        passive: type !== "keydown" && type !== "pointerdown",
      }),
    );
    const offExtra = onExtra((extra) => extra === "sleep" && sleep());

    // The tab title while the tab is hidden.
    let title = "";
    const onVisibility = () => {
      if (document.hidden) {
        title = document.title;
        document.title = screensaver.hiddenTitle;
      } else if (title) {
        document.title = title;
        title = "";
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    arm();

    return () => {
      window.clearTimeout(timer);
      events.forEach((type) => window.removeEventListener(type, onInput, { capture: true }));
      offExtra();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (!asleep) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-10 bg-bg"
    >
      <span className="breathe-circle block size-40 rounded-full bg-accent" />
      <Clock className="type-display flex items-baseline gap-3 text-[clamp(2rem,5vw,4rem)] leading-none text-text" />
      <p className="type-label absolute bottom-10 text-text-muted">{screensaver.wake}</p>
    </div>
  );
}
