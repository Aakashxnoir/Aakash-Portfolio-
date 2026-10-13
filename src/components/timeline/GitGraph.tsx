import { branches, commits, type Branch } from "@/content/timeline";

const STEP = 112;
const LEFT = 84;
const LANE = 34;
const TOP = 26;
const SIZE = 10;

const graphWidth = LEFT + (commits.length - 1) * STEP + 40;
const graphHeight = TOP + (branches.length - 1) * LANE + 26;

const laneY = (branch: Branch) => TOP + branches.findIndex((b) => b.id === branch) * LANE;
const commitX = (index: number) => LEFT + index * STEP;

/**
 * The branch graph for timeline.log: lanes for main, build, wins and clubs; side
 * branches fork from main and merge back at HEAD; the expected end of the degree
 * is dashed. Decorative: the commit list carries the content.
 *
 * With motion, TimelineScroller drives it: it marks the active commit
 * (`data-active` on its `[data-commit]` group) and draws the lines up to it by
 * narrowing the `[data-tl-clip]` rectangle. Without it the graph is complete.
 */
export default function GitGraph({ className }: { className?: string }) {
  const head = commits.findIndex((c) => c.title.startsWith("HEAD"));
  const mainY = laneY("main");

  const lanes = branches
    .filter((b) => b.id !== "main")
    .map((branch) => {
      const indexes = commits.flatMap((c, i) => (c.branch === branch.id ? [i] : []));
      const first = indexes[0];
      const y = laneY(branch.id);
      const x0 = commitX(first) - STEP * 0.55;
      const xHead = commitX(head);
      return {
        id: branch.id,
        d: `M ${x0} ${mainY} L ${x0 + STEP * 0.3} ${y} L ${xHead - STEP * 0.35} ${y} L ${xHead} ${mainY}`,
      };
    });

  // RIT Digital Twin (build) won Designathon (wins): a merge between them.
  const rit = commits.findIndex((c) => c.href === "/work/rit-digital-twin");
  const designathon = commits.findIndex((c) => c.title.includes("Designathon"));

  const lines = (
    <>
      <path d={`M ${commitX(0)} ${mainY} L ${commitX(head)} ${mainY}`} />
      <path
        d={`M ${commitX(head)} ${mainY} L ${commitX(commits.length - 1)} ${mainY}`}
        strokeDasharray="4 5"
      />
      {lanes.map((lane) => (
        <path key={lane.id} d={lane.d} />
      ))}
    </>
  );

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${graphWidth} ${graphHeight}`}
      className={className}
      fill="none"
      strokeWidth={1.5}
    >
      <defs>
        <clipPath id="tl-drawn">
          <rect data-tl-clip x={0} y={0} width={graphWidth} height={graphHeight} />
        </clipPath>
      </defs>
      {branches.map((branch) => (
        <text
          key={branch.id}
          x={0}
          y={laneY(branch.id) + 4}
          className="fill-text-muted font-mono text-[11px]"
        >
          {branch.label}
        </text>
      ))}
      <g className="stroke-rule">{lines}</g>
      <g clipPath="url(#tl-drawn)">
        <g className="stroke-text-muted">{lines}</g>
        <path
          d={`M ${commitX(rit)} ${laneY("build")} L ${commitX(designathon)} ${laneY("wins")}`}
          className="stroke-accent"
        />
      </g>
      {commits.map((commit, index) => {
        const x = commitX(index);
        const y = laneY(commit.branch);
        return (
          <g key={commit.hash} data-commit={index} data-x={x}>
            <rect
              x={x - SIZE}
              y={y - SIZE}
              width={SIZE * 2}
              height={SIZE * 2}
              className="tl-ring stroke-accent"
            />
            <rect
              x={x - SIZE / 2}
              y={y - SIZE / 2}
              width={SIZE}
              height={SIZE}
              strokeDasharray={commit.future ? "2 2" : undefined}
              className={`tl-node ${
                index === head
                  ? "fill-accent stroke-accent"
                  : commit.future
                    ? "fill-bg stroke-text-muted"
                    : "fill-bg stroke-text"
              }`}
            />
          </g>
        );
      })}
    </svg>
  );
}
