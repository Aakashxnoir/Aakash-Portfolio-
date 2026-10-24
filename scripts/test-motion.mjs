// Runtime motion check. Loads the site in headless Chrome with
// `prefers-reduced-motion: reduce` (what Aakash's KDE desktop reports) and checks
// that every full page load animates in, not only the first one of a session:
//   first visit  the boot screen plays, then the page animates in
//   reload       no boot screen (once per session), the page still animates in
//   motion off   System > Motion off: nothing moves
// In every case the headings and blocks must end visible with their own text.
// Both "no motion" bugs so far (14 and 19 Oct 2026) fail this check.
//
//   npm run test:motion            starts `next start` on the last build
//   npm run test:motion -- <url>   any running copy, e.g. the live site
//
// Needs Chrome or Chromium; set CHROME to its path if it is not on PATH.
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";

const PAGES = ["/", "/timeline", "/about", "/contact"];
const CASES = [
  { name: "first visit", boot: true, moves: true },
  { name: "reload", boot: false, moves: true },
  { name: "motion off", boot: false, moves: false },
];
/** How long the probe watches after DOMContentLoaded, in ms. */
const WATCH = 5000;

// Runs in the page before any of its scripts. Watches the display headings and
// reveal blocks that are on screen at load: `moved` if any of them changes text
// or fades, `settled` if they all end fully visible with their own text.
const PROBE = `(() => {
  const r = (window.__motion = { done: false });
  addEventListener("DOMContentLoaded", () => {
    r.boot = document.documentElement.classList.contains("boot");
    const targets = [...document.querySelectorAll("main :is([data-scramble], [data-reveal])")]
      .filter((el) => { const b = el.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0; })
      .map((el) => [el, el.textContent]);
    r.targets = targets.length;
    r.moved = false;
    const id = setInterval(() => {
      for (const [el, text] of targets)
        if (el.textContent !== text || +getComputedStyle(el).opacity < 0.99) r.moved = true;
    }, 40);
    setTimeout(() => {
      clearInterval(id);
      r.settled = targets.every(([el, text]) => {
        const s = getComputedStyle(el);
        return el.textContent === text && s.opacity === "1" && s.visibility === "visible";
      });
      r.done = true;
    }, ${WATCH});
  });
})()`;

const chrome = findChrome();
let server;
let base = process.argv[2]?.replace(/\/$/, "");
if (!base) {
  if (!existsSync(".next/BUILD_ID")) fail("No build found. Run `npm run build` first.");
  const port = 4100 + Math.floor(Math.random() * 800);
  base = `http://localhost:${port}`;
  server = spawn(join("node_modules", ".bin", "next"), ["start", "-p", String(port)], { stdio: "ignore" });
  await waitFor(() => fetch(base).then((r) => r.ok, () => false), 20000, "next start");
}

const profile = mkdtempSync(join(tmpdir(), "noiros-motion-"));
const browser = spawn(
  chrome,
  ["--headless", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "about:blank"],
  { stdio: ["ignore", "ignore", "pipe"] },
);
const cdp = await connect(browser);

console.log(`Motion check: ${base} (1440x900, OS reduced motion on)`);
let failures = 0;
try {
  for (const path of PAGES) {
    const { browserContextId } = await cdp.send("Target.createBrowserContext");
    const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank", browserContextId });
    const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
    const send = (method, params) => cdp.send(method, params, sessionId);
    await send("Page.enable");
    await send("Page.addScriptToEvaluateOnNewDocument", { source: PROBE });
    await send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    for (const c of CASES) {
      if (c.name === "motion off") {
        await send("Runtime.evaluate", {
          expression: `localStorage.setItem("noiros:prefs", JSON.stringify({ motion: "off" }))`,
        });
      }
      const loaded = cdp.once("Page.loadEventFired", sessionId);
      if (c.name === "first visit") await send("Page.navigate", { url: base + path });
      else await send("Page.reload");
      await loaded;
      let r;
      await waitFor(async () => {
        r = (await send("Runtime.evaluate", { expression: "window.__motion", returnByValue: true })).result.value;
        return r?.done;
      }, WATCH + 10000, `${path} ${c.name}`);

      const problems = [];
      if (!r.targets) problems.push("no heading or block on screen to watch");
      if (r.boot !== c.boot) problems.push(c.boot ? "boot screen did not play" : "boot screen played");
      if (r.moved !== c.moves) problems.push(c.moves ? "nothing animated" : "something animated");
      if (!r.settled) problems.push("content did not end fully visible");
      failures += problems.length ? 1 : 0;
      const status = problems.length ? "[FAIL]" : "[ ok ]";
      console.log(`  ${status} ${path.padEnd(10)} ${c.name.padEnd(12)} ${problems.join("; ")}`);
    }
    await cdp.send("Target.disposeBrowserContext", { browserContextId });
  }
} finally {
  cdp.close();
  server?.kill();
  const exited = new Promise((resolve) => browser.once("exit", resolve));
  browser.kill();
  await exited;
  // Chrome's helper processes can still be writing to the profile after the
  // main process exits; a leftover temp folder must not fail the check.
  try {
    rmSync(profile, { recursive: true, force: true, maxRetries: 10 });
  } catch {}
}

if (failures) {
  fail(
    `${failures} case(s) failed. Every full page load must animate in with motion on, ` +
      "whatever the OS reduced-motion setting and whether or not the boot screen played (see CLAUDE.md).",
  );
}

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const names = ["google-chrome-stable", "google-chrome", "chromium", "chromium-browser"];
  const dirs = (process.env.PATH ?? "").split(delimiter);
  const mac = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const found = names.flatMap((n) => dirs.map((d) => join(d, n))).find(existsSync) ?? (existsSync(mac) && mac);
  if (!found) fail("Chrome or Chromium not found. Set CHROME to its path.");
  return found;
}

/** A minimal Chrome DevTools Protocol client over the browser's WebSocket. */
async function connect(proc) {
  const url = await new Promise((resolve, reject) => {
    let log = "";
    proc.stderr.on("data", (chunk) => {
      log += chunk;
      const match = log.match(/DevTools listening on (ws:\S+)/);
      if (match) resolve(match[1]);
    });
    proc.on("exit", () => reject(new Error(`Chrome exited:\n${log}`)));
  });
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  const waiters = new Set();
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    const call = pending.get(msg.id);
    if (call) {
      pending.delete(msg.id);
      if (msg.error) call.reject(new Error(msg.error.message));
      else call.resolve(msg.result);
    } else {
      for (const w of waiters) if (w.method === msg.method && w.sessionId === msg.sessionId) w.resolve();
    }
  };
  return {
    send: (method, params = {}, sessionId) =>
      new Promise((resolve, reject) => {
        pending.set(++id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params, sessionId }));
      }),
    once: (method, sessionId) =>
      new Promise((resolve) => {
        const w = { method, sessionId, resolve: () => (waiters.delete(w), resolve()) };
        waiters.add(w);
      }),
    close: () => ws.close(),
  };
}

async function waitFor(check, timeout, what) {
  const end = Date.now() + timeout;
  while (!(await check())) {
    if (Date.now() > end) throw new Error(`Timed out waiting for ${what}`);
    await new Promise((r) => setTimeout(r, 250));
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
