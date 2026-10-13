"use client";

import { useState, type ReactNode } from "react";
import { workLabels } from "@/content/projects";
import WorkCanvas, { type CanvasTile } from "./WorkCanvas";

type View = "canvas" | "list";

/**
 * Switches projects.vol between the draggable canvas and the list. Without JS,
 * and on phones, only the list exists for the visitor.
 */
export default function WorkView({ tiles, list }: { tiles: CanvasTile[]; list: ReactNode }) {
  const [view, setView] = useState<View>("canvas");
  const canvas = view === "canvas";

  return (
    <div className={canvas ? "md:js:flex md:js:h-[calc(100svh-var(--bar-height)-var(--path-height))] md:js:flex-col" : ""}>
      <div className="js-only flex h-10 shrink-0 items-center gap-4 border-b border-rule px-shell text-ui text-text-muted max-md:hidden">
        <span className="type-label">{workLabels.views}</span>
        <div role="group" aria-label={workLabels.views} className="flex">
          {(["canvas", "list"] as const).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className="border border-rule px-3 py-0.5 transition-colors aria-pressed:border-text-muted aria-pressed:bg-text aria-pressed:text-bg hover:text-text aria-pressed:hover:text-bg"
            >
              {workLabels[id]}
            </button>
          ))}
        </div>
        <span className="ml-auto">
          {tiles.length} {workLabels.files}
          {canvas ? ` · ${workLabels.dragHint}` : ""}
        </span>
      </div>
      {canvas && (
        <div className="js-only min-h-0 flex-1 max-md:hidden">
          <WorkCanvas tiles={tiles} />
        </div>
      )}
      <div className={canvas ? "md:js:hidden" : ""}>{list}</div>
    </div>
  );
}
