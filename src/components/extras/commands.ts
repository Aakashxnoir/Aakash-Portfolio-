import { terminal } from "@/content/extras";
import { education, profile, recognition, stack } from "@/content/profile";
import { caseNumber, projects } from "@/content/projects";
import { apps, desktop, labels, menus, site, type Phosphor } from "@/content/site";
import { commits } from "@/content/timeline";
import type { Extra } from "@/lib/extras";
import type { Prefs } from "@/lib/prefs";

/** A piece of output: text, or a link. */
export type Part = string | { text: string; href: string; external?: boolean };
export type Line = Part[];

export type Context = {
  /** Close the terminal and open a route as a window. */
  navigate: (href: string) => void;
  /** Open a URL or file in a new tab. */
  openUrl: (href: string) => void;
  openExtra: (extra: Extra) => void;
  setPrefs: (prefs: Partial<Prefs>) => void;
  copy: (text: string) => void;
  clear: () => void;
  close: () => void;
  history: string[];
};

const phosphors = menus.system.phosphors.map((p) => p.id) as string[];

/** Names `open` understands, and where they go. */
const targets: Record<string, string> = {
  desktop: "/",
  "~": "/",
  "/": "/",
  projects: "/work",
  work: "/work",
  profile: "/about",
  about: "/about",
  timeline: "/timeline",
  contact: "/contact",
  ...Object.fromEntries(apps.map((app) => [app.file, app.href])),
  ...Object.fromEntries(projects.map((p) => [p.slug, `/work/${p.slug}`])),
};

const files = [...apps.map((app) => app.file), "resume.pdf"];

const link = (text: string, href: string, external = true): Part => ({ text, href, external });

const pad = (text: string, width: number) => text.padEnd(width, " ");

function cat(file: string | undefined): Line[] {
  switch (file) {
    case undefined:
      return [[terminal.catUsage]];
    case "profile.sys":
      return [[profile.body]];
    case "projects.vol":
      return projectLines();
    case "timeline.log":
      return commits.map((c) => [
        `${c.hash}  ${pad(`(${c.branch})`, 8)} ${pad(c.date, 9)} ${c.title}`,
      ]);
    case "contact.app":
      return contactLines();
    case "resume.pdf":
      return [[terminal.catBinary(file)]];
    default:
      return [[terminal.noSuchFile(file)]];
  }
}

function projectLines(): Line[] {
  return projects.map((p) => [
    `${caseNumber(p)}  `,
    link(pad(p.slug, 17), `/work/${p.slug}`, false),
    ` ${p.kind} · ${p.year}`,
  ]);
}

function contactLines(): Line[] {
  return [
    [link(site.email, `mailto:${site.email}`)],
    [`${site.status} · ${site.location}`],
    [
      link(labels.linkedin, site.linkedin),
      "  ",
      link(labels.github, site.github),
      "  ",
      link(labels.resumePdf, site.resume),
    ],
  ];
}

function onOff(name: string, value: string | undefined, apply: (v: "on" | "off") => void): Line[] {
  if (value !== "on" && value !== "off") return [[terminal.switchUsage(name)]];
  apply(value);
  return [[terminal.switchSet(name, value)]];
}

/** Runs one command line and returns what it prints. */
export function run(input: string, ctx: Context): Line[] {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const arg = args[0]?.toLowerCase();

  switch (command.toLowerCase()) {
    case "":
      return [];
    case "help":
      return terminal.help.map(([cmd, what]) => [pad(cmd, 38), what]);
    case "whoami":
      return [
        [`${site.name} (${site.handle})`],
        [desktop.line],
        [`${site.status} · ${site.location}`],
      ];
    case "ls":
      return [[files.join("  ")]];
    case "open":
    case "cd": {
      if (!arg) return [[terminal.openUsage]];
      if (arg === "resume" || arg === "resume.pdf") {
        ctx.openUrl(site.resume);
        return [[terminal.opening("resume.pdf")]];
      }
      const href = targets[arg];
      if (!href) return [[terminal.noSuchApp(arg)]];
      ctx.navigate(href);
      return [[terminal.opening(arg)]];
    }
    case "cat":
      return cat(arg);
    case "projects":
      return projectLines();
    case "stack":
      return stack.groups.map((g) => [pad(`${g.label}:`, 12), g.items.join(", ")]);
    case "education":
      return [[education.degree], [`${education.school}, ${education.place}`], [education.years]];
    case "wins":
    case "awards":
      return recognition.items.map((item) => [pad(item.title, 16), item.detail]);
    case "contact":
      return contactLines();
    case "email":
      ctx.copy(site.email);
      return [[link(site.email, `mailto:${site.email}`), ` ${terminal.emailNote}`]];
    case "resume":
      ctx.openUrl(site.resume);
      return [[terminal.opening("resume.pdf")]];
    case "github":
      ctx.openUrl(site.github);
      return [[terminal.opening(site.github)]];
    case "linkedin":
      ctx.openUrl(site.linkedin);
      return [[terminal.opening(site.linkedin)]];
    case "theme":
    case "phosphor":
      if (!arg || !phosphors.includes(arg)) return [[terminal.themeUsage]];
      ctx.setPrefs({ phosphor: arg as Phosphor });
      return [[terminal.themeSet(arg)]];
    case "crt":
      return onOff("crt", arg, (crt) => ctx.setPrefs({ crt }));
    case "motion":
      return onOff("motion", arg, (motion) => ctx.setPrefs({ motion }));
    case "lights":
      ctx.openExtra("lights");
      return [[terminal.lights]];
    case "sleep":
      ctx.openExtra("sleep");
      return [[terminal.sleeping]];
    case "date":
      return [
        [
          new Intl.DateTimeFormat("en-GB", {
            timeZone: site.timeZone,
            dateStyle: "full",
            timeStyle: "short",
          }).format(new Date()) + " IST",
        ],
      ];
    case "echo":
      return [[args.join(" ")]];
    case "history":
      return ctx.history.map((entry, i) => [`${String(i + 1).padStart(4)}  ${entry}`]);
    case "clear":
      ctx.clear();
      return [];
    case "exit":
      ctx.close();
      return [];
    case "sudo":
      return [[terminal.sudo]];
    case "rm":
      return [[terminal.rm]];
    default:
      return [[terminal.notFound(command)]];
  }
}

const commandNames = [
  "help",
  "whoami",
  "ls",
  "open",
  "cd",
  "cat",
  "projects",
  "stack",
  "education",
  "wins",
  "contact",
  "email",
  "resume",
  "github",
  "linkedin",
  "theme",
  "crt",
  "motion",
  "lights",
  "sleep",
  "date",
  "echo",
  "history",
  "clear",
  "exit",
];

/** Tab completion: the possible completions of the line as typed. */
export function complete(input: string): string[] {
  const words = input.trimStart().split(/\s+/);
  if (words.length <= 1) {
    return commandNames.filter((name) => name.startsWith(words[0] ?? ""));
  }
  const [command, partial] = [words[0].toLowerCase(), words[words.length - 1].toLowerCase()];
  const options: Record<string, string[]> = {
    open: [...Object.keys(targets).filter((t) => /^[a-z]/.test(t)), "resume.pdf"],
    cd: Object.keys(targets).filter((t) => /^[a-z]/.test(t)),
    cat: files,
    theme: phosphors,
    phosphor: phosphors,
    crt: ["on", "off"],
    motion: ["on", "off"],
  };
  const matches = (options[command] ?? []).filter((option) => option.startsWith(partial));
  const head = words.slice(0, -1).join(" ");
  return [...new Set(matches)].map((match) => `${head} ${match}`);
}
