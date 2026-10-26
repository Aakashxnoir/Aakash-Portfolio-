import type { Metadata } from "next";
import Link from "next/link";
import PathBar from "@/components/shell/PathBar";
import Window from "@/components/shell/Window";
import GitGraph from "@/components/timeline/GitGraph";
import TimelineScroller from "@/components/timeline/TimelineScroller";
import { getApp } from "@/content/site";
import { branches, commits, timelineLabels } from "@/content/timeline";

const app = getApp("timeline");

export const metadata: Metadata = {
  title: timelineLabels.title,
  description: timelineLabels.description,
};

export default function TimelinePage() {
  return (
    <Window>
      <div className="pt-path">
        <PathBar trail={[{ label: app.file }]} />
        <header className="px-read pt-14 pb-10">
          <p className="type-label text-text-muted">
            <span className="text-accent">{app.number}</span> · {app.file}
          </p>
          <h1 data-scramble className="type-display mt-3 text-title text-text">
            {timelineLabels.title}
          </h1>
        </header>

        <TimelineScroller>
          <div className="flex shrink-0 items-center gap-3 border-y border-rule bg-surface px-shell py-3 text-ui">
            <span className="text-accent">{timelineLabels.prompt}</span>
            <span className="truncate text-text">
              {timelineLabels.logCommand}
            </span>
            <span aria-hidden className="breathe inline-block h-4 w-2 shrink-0 bg-text" />
            <span className="ml-auto hidden shrink-0 text-text-muted md:inline">
              {commits.length} {timelineLabels.steps} · {branches.length} {timelineLabels.branches}
            </span>
          </div>

          <div className="shrink-0 overflow-x-auto px-read py-8">
            <GitGraph className="h-auto w-full min-w-[900px]" />
          </div>

          <div data-tl-viewport className="tl-viewport">
            <ol data-tl-track className="tl-track px-read pb-24">
              {commits.map((commit) => (
                <li key={commit.hash} id={commit.hash} className="tl-card scroll-mt-28">
                  <article className="grid gap-4 border-t border-rule py-10 md:grid-cols-12 md:gap-6">
                    <div className="type-label flex flex-wrap gap-x-4 gap-y-1 text-text-muted md:col-span-3 md:flex-col">
                      <span>({commit.branch})</span>
                      <time>{commit.date}</time>
                    </div>
                    <div className="md:col-span-8 md:col-start-5">
                      <h2 className="type-display text-[clamp(1.75rem,3.4vw,3rem)] leading-[0.95] text-text">
                        {commit.title}
                      </h2>
                      <p className="mt-4 max-w-[62ch] text-text-soft">{commit.detail}</p>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {commit.tags.map((tag) => (
                          <span key={tag} className="tag">
                            {tag}
                          </span>
                        ))}
                        {commit.href && (
                          <Link
                            href={commit.href}
                            transitionTypes={["open"]}
                            className="link ml-3 text-ui"
                          >
                            {timelineLabels.open} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </TimelineScroller>
      </div>
    </Window>
  );
}
