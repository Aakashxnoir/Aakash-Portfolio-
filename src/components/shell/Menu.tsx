import Link from "next/link";
import type { ReactNode } from "react";

/**
 * A menu bar menu. Built on <details> so it opens without JS; MenuController adds
 * one-open-at-a-time, outside click, Escape and hover-to-switch.
 */
export function Menu({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  align?: "left" | "right";
}) {
  return (
    <details data-menu className="group/menu relative h-full">
      <summary className="flex h-full list-none items-center px-3 text-text-soft transition-colors select-none hover:text-text group-open/menu:text-text md:px-4 [&::-webkit-details-marker]:hidden">
        <span className="group-open/menu:before:content-['['] group-open/menu:after:content-[']']">
          {label}
        </span>
      </summary>
      <div
        className={`absolute top-full z-10 mt-px min-w-64 border border-text-muted bg-surface py-2 shadow-[4px_4px_0_0_var(--rule)] ${
          align === "right" ? "right-0" : "left-0"
        }`}
      >
        {children}
      </div>
    </details>
  );
}

const itemClass =
  "flex w-full items-center justify-between gap-6 px-4 py-1.5 text-left text-text-soft transition-colors hover:bg-text hover:text-bg focus-visible:bg-text focus-visible:text-bg focus-visible:outline-offset-[-2px]";

export function MenuLink({
  href,
  children,
  note,
  external,
  download,
}: {
  href: string;
  children: ReactNode;
  note?: ReactNode;
  external?: boolean;
  download?: boolean;
}) {
  const content = (
    <>
      <span>{children}</span>
      {note && <span className="text-text-muted">{note}</span>}
    </>
  );
  if (external || download) {
    return (
      <a
        href={href}
        className={itemClass}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        {...(download ? { download: true } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} transitionTypes={["open"]} className={itemClass} data-menu-item>
      {content}
    </Link>
  );
}

export function MenuButton({
  onClick,
  children,
  note,
  pressed,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  note?: ReactNode;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`${itemClass} ${className ?? ""}`}
    >
      <span>{children}</span>
      {note && <span className="text-text-muted">{note}</span>}
    </button>
  );
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <p className="type-label px-4 pt-2 pb-1 text-text-muted">{children}</p>;
}

export function MenuRule() {
  return <hr className="my-2 border-rule" />;
}
