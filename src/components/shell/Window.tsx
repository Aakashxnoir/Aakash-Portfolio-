import { ViewTransition, type ReactNode } from "react";

/**
 * A page as an OS window. Navigations tagged `open` grow the new window from
 * where it was opened; `close` shrinks the old one back to its desktop corner
 * (origins set by WindowOrigin, animations in globals.css). Untagged navigations
 * (back, forward) swap instantly, as does everything without motion.
 */
export default function Window({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ open: "win-open", close: "win-under", default: "none" }}
      exit={{ open: "win-behind", close: "win-close", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
