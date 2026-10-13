"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Makes the <details> menus behave like an OS menu bar: one open at a time, close
 * on outside click, Escape, choosing an item or navigating; hovering another
 * title while one is open switches to it.
 */
export default function MenuController() {
  const pathname = usePathname();

  useEffect(() => {
    const menus = () =>
      Array.from(document.querySelectorAll<HTMLDetailsElement>("details[data-menu]"));
    const closeAll = (except?: Element) =>
      menus().forEach((menu) => {
        if (menu !== except) menu.open = false;
      });

    const onToggle = (event: Event) => {
      const menu = event.target as HTMLDetailsElement;
      if (menu.matches?.("details[data-menu]") && menu.open) closeAll(menu);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest("details[data-menu]")) closeAll();
    };
    const onClick = (event: MouseEvent) => {
      const item = (event.target as Element).closest("details[data-menu] a");
      if (item) closeAll();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const open = menus().find((menu) => menu.open);
      if (!open) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open.open = false;
      open.querySelector("summary")?.focus();
    };
    const onOver = (event: PointerEvent) => {
      const summary = (event.target as Element).closest?.("details[data-menu] > summary");
      if (!summary) return;
      const menu = summary.parentElement as HTMLDetailsElement;
      if (!menu.open && menus().some((m) => m.open)) menu.open = true;
    };

    document.addEventListener("toggle", onToggle, true);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerover", onOver);
    return () => {
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  // Navigating closes any open menu.
  useEffect(() => {
    document
      .querySelectorAll<HTMLDetailsElement>("details[data-menu][open]")
      .forEach((menu) => (menu.open = false));
  }, [pathname]);

  return null;
}
