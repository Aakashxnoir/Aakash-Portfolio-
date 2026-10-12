import type { ReactNode } from "react";
import Reveal from "./motion/Reveal";

/** A titled section: display heading on its own row, content from column 4. */
export default function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-section grid grid-cols-12 gap-x-8">
      <Reveal as="h2" split id={id} className="type-display col-span-12 text-section font-bold text-text">
        {heading}
      </Reveal>
      <div className="col-span-9 col-start-4 mt-10">{children}</div>
    </section>
  );
}

/** Hairline rows of label and value, used for Education, Stack and Outside work. */
export function FactRows({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return (
    <Reveal as="dl" stagger className="border-b border-rule">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-9 gap-x-8 border-t border-rule py-5">
          <dt className="type-label col-span-3 pt-1 text-text-muted">{row.label}</dt>
          <dd className="col-span-6 text-body text-text-soft">{row.value}</dd>
        </div>
      ))}
    </Reveal>
  );
}
