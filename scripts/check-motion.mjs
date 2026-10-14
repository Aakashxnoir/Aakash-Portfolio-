// Fails the build if motion is gated on the OS reduced-motion setting again.
// Desktops with animations turned down report `prefers-reduced-motion: reduce`,
// and following it left NOIR/OS with no motion at all (14 Oct 2026). Motion is
// on by default; the only switch is System > Motion (src/lib/prefs.ts).
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const BANNED = [
  [/\(\s*prefers-reduced-motion/, "a prefers-reduced-motion media query"],
  [/\bmotion-(safe|reduce):/, "a Tailwind motion-safe/motion-reduce variant"],
  [/\breducedMotion\b|\buseReducedMotion\b/, "a reduced-motion check"],
];

const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(join(dir, e.name)) : /\.(tsx?|css|mjs|js|svg)$/.test(e.name) ? [join(dir, e.name)] : [],
  );

const hits = ["src", "scripts/readme", ".github/readme"].flatMap(files).flatMap((file) =>
  readFileSync(file, "utf8")
    .split("\n")
    .flatMap((line, i) =>
      BANNED.filter(([re]) => re.test(line)).map(([, what]) => `${file}:${i + 1}  ${what}`),
    ),
);

if (hits.length) {
  console.error(
    "Motion must not follow prefers-reduced-motion (see CLAUDE.md). Use motionAllowed() from src/lib/prefs.ts.\n" +
      hits.join("\n"),
  );
  process.exit(1);
}
