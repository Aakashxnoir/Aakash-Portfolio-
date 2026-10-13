"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** "Tue 13 · 16:03": the time in Chennai, to the minute. */
function now() {
  const parts = Object.fromEntries(format.formatToParts(new Date()).map((p) => [p.type, p.value]));
  return `${parts.weekday} ${parts.day} · ${parts.hour}:${parts.minute}`;
}

function subscribe(callback: () => void) {
  const id = window.setInterval(callback, 10_000);
  return () => window.clearInterval(id);
}

/** Live clock in IST. Renders nothing on the server, so there is no stale time in the HTML. */
export default function Clock({ className }: { className?: string }) {
  const time = useSyncExternalStore(subscribe, now, () => "");
  return (
    <span className={className}>
      <time suppressHydrationWarning className="tabular-nums">
        {time}
      </time>
      {time && <span className="text-text-muted">IST</span>}
    </span>
  );
}
