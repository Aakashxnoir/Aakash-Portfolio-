import type { CSSProperties } from "react";
import { site } from "@/content/site";

/** "Open to internships": red mono label with a small solid square before it. */
export default function Status({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <p className={`type-label flex items-center gap-3 text-accent ${className}`} style={style}>
      <span aria-hidden="true" className="status-dot size-2 bg-accent" />
      {site.status}
    </p>
  );
}
