import type { ReactNode } from "react";
import { enterDelay } from "./motion/enter";

/**
 * Opening of the inner pages: a mono label, then the page's h1 and whatever
 * follows it. Clears the fixed top bar.
 */
export default function PageHeader({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="pt-[calc(var(--nav-height)+4rem)]">
      <p className="enter-fade type-label text-text-muted" style={enterDelay(0)}>
        {label}
      </p>
      {children}
    </div>
  );
}
