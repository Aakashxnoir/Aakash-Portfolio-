import type { ReactNode } from "react";
import { enterDelay } from "./motion/enter";

/** A page h1 that rises out of a mask on first paint (CSS only; still without motion). */
export default function EnterTitle({
  id,
  className,
  delay = 80,
  children,
}: {
  id?: string;
  className: string;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <h1 id={id} className={className}>
      <span className="mask">
        <span className="enter-line block" style={enterDelay(delay)}>
          {children}
        </span>
      </span>
    </h1>
  );
}
