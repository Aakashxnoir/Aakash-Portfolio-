"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { lightsOut as copy } from "@/content/extras";
import AppWindow from "./AppWindow";

type Phase = "idle" | "arming" | "holding" | "go" | "result" | "jump";

const LIGHTS = 5;
const BEST_KEY = "noiros:lights-best";

function readBest(): number | null {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return value > 0 ? value : null;
  } catch {
    return null;
  }
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(3)}s`;

/**
 * Extras > Lights Out: an F1 start. Five lights come on a second apart, hold for
 * a random 0.2 to 3 seconds, then go out; the time from lights out to the press
 * is the reaction. Pressing early is a jump start. Best time stays in this
 * browser (localStorage).
 */
export default function LightsOut({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(0);
  const [time, setTime] = useState<number | null>(null);
  // Client-only component (loaded on first open), so storage is there.
  const [best, setBest] = useState<number | null>(readBest);
  const [newBest, setNewBest] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  const goAt = useRef(0);
  const timers = useRef<number[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const to = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  useEffect(() => {
    if (open) buttonRef.current?.focus();
    else clearTimers();
  }, [open]);

  // Closing mid-start abandons it.
  const close = () => {
    clearTimers();
    setLit(0);
    to("idle");
    onClose();
  };

  useEffect(() => clearTimers, []);

  const start = () => {
    clearTimers();
    setLit(0);
    setTime(null);
    setNewBest(false);
    to("arming");
    for (let i = 1; i <= LIGHTS; i++) {
      timers.current.push(window.setTimeout(() => setLit(i), i * 1000));
    }
    timers.current.push(
      window.setTimeout(() => to("holding"), LIGHTS * 1000),
      window.setTimeout(
        () => {
          setLit(0);
          goAt.current = performance.now();
          to("go");
        },
        LIGHTS * 1000 + 200 + Math.random() * 2800,
      ),
    );
  };

  const press = (at: number) => {
    const current = phaseRef.current;
    if (current === "arming" || current === "holding") {
      clearTimers();
      to("jump");
      return;
    }
    if (current === "go") {
      const reaction = Math.max(0, at - goAt.current);
      setTime(reaction);
      if (best === null || reaction < best) {
        setBest(reaction);
        setNewBest(true);
        try {
          localStorage.setItem(BEST_KEY, String(Math.round(reaction)));
        } catch {
          // Storage blocked: the best lasts for this visit.
        }
      }
      to("result");
      return;
    }
    start();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) press(performance.now());
  };
  // Pointer presses act on the way down; clicks from the keyboard or assistive
  // tech (detail 0) are the only clicks that act.
  const onClick = (event: MouseEvent) => {
    if (event.detail === 0) press(performance.now());
  };

  const status =
    phase === "idle"
      ? seconds(0)
      : phase === "arming" || phase === "holding"
        ? copy.wait
        : phase === "go"
          ? copy.go
          : phase === "jump"
            ? copy.jumpStart
            : seconds(time ?? 0);

  const verdict =
    phase === "result" && time !== null ? copy.verdicts.find(([limit]) => time < limit)?.[1] : null;

  return (
    <AppWindow title={copy.file} closeLabel={copy.close} open={open} onClose={close}>
      <div className="p-5 md:p-6">
        <p className="max-w-[56ch] text-ui text-text-soft">{copy.intro}</p>
        <button
          ref={buttonRef}
          type="button"
          onPointerDown={(event) => {
            if (event.button === 0) press(event.timeStamp);
          }}
          onKeyDown={onKeyDown}
          onClick={onClick}
          aria-label={copy.title}
          aria-describedby="lights-status"
          className="mt-5 block w-full touch-manipulation border border-rule bg-bg px-4 py-6 select-none md:py-8"
        >
          <span aria-hidden className="flex justify-center gap-2 md:gap-4">
            {Array.from({ length: LIGHTS }, (_, i) => (
              <span
                key={i}
                className="flex flex-col gap-2 border border-rule bg-surface p-2 md:p-3"
              >
                {[0, 1].map((row) => (
                  <span
                    key={row}
                    className={`block size-7 rounded-full md:size-10 ${i < lit ? "bg-accent" : "bg-rule"}`}
                  />
                ))}
              </span>
            ))}
          </span>
          <span className="type-label mt-5 block text-text-muted">
            {phase === "result" || phase === "jump" ? copy.again : copy.start} · {copy.controls}
          </span>
        </button>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div id="lights-status" aria-live="assertive">
            <p
              className={`type-display text-[clamp(2rem,6vw,3.5rem)] leading-none normal-case ${
                phase === "jump" || phase === "go"
                  ? "text-accent"
                  : phase === "idle"
                    ? "text-text-muted"
                    : "text-text"
              }`}
            >
              {status}
            </p>
            <p className="mt-2 text-ui text-text-soft">
              {phase === "jump" ? copy.jumpStartNote : verdict}
              {newBest && phase === "result" && (
                <span className="ml-2 text-accent">{copy.newBest}</span>
              )}
            </p>
          </div>
          <p className="type-label text-text-muted">
            {copy.best} ·{" "}
            <span className="text-text normal-case">{best === null ? copy.noBest : seconds(best)}</span>
          </p>
        </div>
      </div>
    </AppWindow>
  );
}
