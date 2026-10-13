"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { markClose } from "@/lib/window";

/** ESC closes the current window: goes to `href`, unless a field or dialog has focus. */
export default function EscapeKey({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      const active = document.activeElement;
      if (active?.matches("input, textarea, select, [contenteditable]")) {
        (active as HTMLElement).blur();
        return;
      }
      if (document.querySelector("dialog[open], [data-modal-open]")) return;
      markClose(window.location.pathname, href);
      router.push(href, { transitionTypes: ["close"] });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [href, router]);

  return null;
}
