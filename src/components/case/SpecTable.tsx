import type { ReactNode } from "react";

export type Spec = { label: string; value: ReactNode };

/** Label, dotted leader, value. Rows with no value are left out by the caller. */
export default function SpecTable({ rows, className }: { rows: Spec[]; className?: string }) {
  return (
    <dl className={className}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline gap-3 border-b border-rule py-3">
          <dt className="type-label shrink-0 text-text-muted">{row.label}</dt>
          <span aria-hidden className="leader" />
          <dd className="max-w-[65%] text-right text-text">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
