"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

/**
 * A modal OS window (terminal, game): a native <dialog>, so focus stays inside,
 * the page behind is inert and ESC closes it. `onClose` runs only when the
 * visitor closes it (ESC or the × button), not when the parent does.
 */
export default function AppWindow({
  title,
  closeLabel,
  open,
  onClose,
  className,
  children,
}: {
  title: string;
  closeLabel: string;
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const openRef = useRef(open);
  const id = useId();

  useEffect(() => {
    openRef.current = open;
    const dialog = ref.current!;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={() => {
        if (openRef.current) onClose();
      }}
      className={`m-auto max-h-[calc(100svh-2rem)] w-[min(46rem,calc(100vw-2rem))] border border-text-muted bg-surface p-0 text-text shadow-[4px_4px_0_0_var(--rule)] backdrop:bg-bg/70 ${
        className ?? ""
      }`}
    >
      <div className="flex items-center border-b border-text-muted">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="flex size-11 shrink-0 items-center justify-center border-r border-text-muted text-text-muted transition-colors hover:bg-accent hover:text-bg"
        >
          ×
        </button>
        <h2 id={id} className="flex-1 truncate px-2 text-center text-ui text-text">
          {title}
        </h2>
        <span className="size-11 shrink-0" aria-hidden />
      </div>
      {children}
    </dialog>
  );
}
