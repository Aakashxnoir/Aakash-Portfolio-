import Link from "next/link";
import type { ReactNode } from "react";
import { labels } from "@/content/site";
import EscapeKey from "./EscapeKey";

export type Crumb = { label: string; href?: string };

/**
 * The window's path under the menu bar: `~/desktop / projects.vol / cheng`, with
 * the ESC hint. ESC (and the hint) go to `up`.
 */
export default function PathBar({
  trail,
  up = "/",
  esc = labels.escBack,
  children,
}: {
  trail: Crumb[];
  up?: string;
  esc?: string;
  children?: ReactNode;
}) {
  return (
    <div className="fixed inset-x-0 top-bar z-40 flex h-path items-stretch border-b border-rule bg-bg text-[12px] text-text-muted">
      <nav aria-label={labels.path} className="flex min-w-0 items-center gap-2 px-shell">
        <Link
          href="/"
          transitionTypes={["close"]}
          className="shrink-0 transition-colors hover:text-accent"
        >
          {labels.desktop}
        </Link>
        {trail.map((crumb) => (
          <span key={crumb.label} className="flex min-w-0 items-center gap-2">
            <span aria-hidden>/</span>
            {crumb.href ? (
              <Link
                href={crumb.href}
                transitionTypes={["close"]}
                className="truncate transition-colors hover:text-accent"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate text-text">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
      {children}
      <Link
        href={up}
        transitionTypes={["close"]}
        className="ml-auto hidden shrink-0 items-center border-l border-rule px-shell transition-colors hover:text-accent md:flex"
      >
        {esc}
      </Link>
      <EscapeKey href={up} />
    </div>
  );
}
