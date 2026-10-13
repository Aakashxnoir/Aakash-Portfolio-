import Link from "next/link";
import { desktop, type apps } from "@/content/site";

type App = (typeof apps)[number];

/** A desktop app in a corner. Hover or focus shows the ENTER chip. */
export default function AppIcon({ app, align }: { app: App; align: "left" | "right" }) {
  const right = align === "right";
  return (
    <Link
      href={app.href}
      transitionTypes={["open"]}
      className={`group flex items-baseline justify-between gap-4 border-b border-rule py-4 md:block md:border-0 md:py-0 ${
        right ? "md:text-right" : ""
      }`}
    >
      <span className="flex items-baseline gap-4 md:block">
        <span className="type-display block text-[22px] leading-none text-accent md:text-[26px]">
          {app.number}
        </span>
        <span className="md:mt-3 md:block">
          <span className="type-label block text-text-muted">{app.file}</span>
          <span className="block text-[20px] leading-tight text-text transition-colors group-hover:text-accent md:text-[22px]">
            {app.title}
          </span>
        </span>
      </span>
      <span
        aria-hidden
        className={`type-label inline-block bg-accent px-2 py-1 text-bg md:mt-2 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-visible:opacity-100`}
      >
        {desktop.enter} ↵
      </span>
    </Link>
  );
}
