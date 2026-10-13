import type { Metadata } from "next";
import Link from "next/link";
import Window from "@/components/shell/Window";
import { labels } from "@/content/site";

export const metadata: Metadata = { title: labels.notFound };

export default function NotFound() {
  return (
    <Window>
      <div className="flex min-h-[calc(100svh-var(--bar-height))] items-center justify-center px-shell py-20">
        <section className="w-full max-w-xl border border-text-muted bg-surface shadow-[4px_4px_0_0_var(--rule)]">
          <p className="border-b border-text-muted px-4 py-2 text-center text-ui text-text-muted">
            {labels.errorLog}
          </p>
          <div className="p-8">
            <p className="type-display text-[96px] leading-none text-accent">404</p>
            <h1 className="type-display mt-4 text-[36px] leading-none text-text">
              {labels.notFound}
            </h1>
            <p className="mt-4 text-text-soft">{labels.notFoundBody}</p>
            <Link href="/" className="btn btn-primary mt-8">
              {labels.home}
            </Link>
          </div>
        </section>
      </div>
    </Window>
  );
}
