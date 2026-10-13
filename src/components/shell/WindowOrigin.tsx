"use client";

import { useEffect } from "react";
import { isClose, markClose, markOpen } from "@/lib/window";

/**
 * Records where each window opens from or closes to, before the navigation's
 * view transition starts: the click point (or the link's middle, for keyboard
 * clicks) when opening, the app's desktop corner when closing.
 */
export default function WindowOrigin() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest?.<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.origin !== window.location.origin ||
        link.target ||
        link.hasAttribute("download")
      ) {
        return;
      }
      const from = window.location.pathname;
      const to = link.pathname;
      if (isClose(from, to)) markClose(from, to);
      if (event.detail === 0) {
        const rect = link.getBoundingClientRect();
        markOpen(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else {
        markOpen(event.clientX, event.clientY);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
