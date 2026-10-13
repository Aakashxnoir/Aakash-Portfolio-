/** Copy for the boot screen, the toys (terminal, Lights Out) and the screensaver. */

export const boot = {
  title: "NOIR/OS v3",
  tty: "aakash@noir-system · tty1",
  /** One line per real loading step, printed with [ ok ] as each finishes. */
  steps: {
    mount: "mounted /home/aakash",
    fonts: "loaded fonts · Doto, JetBrains Mono",
    images: "loaded images",
    motion: "started motion · GSAP, Lenis",
    ready: "reached target: desktop",
  },
  ok: "[ ok ]",
  skip: "Press any key to skip",
} as const;

export const screensaver = {
  wake: "Move the mouse or press any key",
  /** Tab title while the tab is hidden. */
  hiddenTitle: "Still here · NOIR/OS",
} as const;

export const lightsOut = {
  title: "Lights Out",
  file: "lights-out.exe",
  intro:
    "An F1 start. Five red lights come on one by one, then all go out. React the moment they go out. Jump the start and you are penalised.",
  controls: "Space, Enter or click",
  start: "Start",
  wait: "Wait for it...",
  go: "Go!",
  again: "Go again",
  jumpStart: "Jump start",
  jumpStartNote: "Lights were still on. Drive-through penalty.",
  reaction: "Reaction",
  best: "Best",
  newBest: "New best",
  noBest: "none yet",
  /** A tip line chosen by reaction time, fastest first (ms ceiling, line). */
  verdicts: [
    [180, "Pole position reflexes."],
    [250, "Clean getaway."],
    [350, "Decent launch. Watch the mirrors."],
    [Infinity, "Bogged down off the line."],
  ] as [number, string][],
  close: "Close",
} as const;

export const terminal = {
  title: "terminal",
  prompt: "aakash@noir-system:~$",
  inputLabel: "Terminal command",
  welcome: ["NOIR/OS v3 · type `help` to see what this terminal can do."],
  close: "Close",
  notFound: (command: string) => `command not found: ${command}. Type \`help\`.`,
  help: [
    ["help", "this list"],
    ["whoami", "who runs this machine"],
    ["ls", "the desktop"],
    ["open <app|project>", "open a window (projects, timeline, profile, contact, cheng...)"],
    ["projects", "the five case files"],
    ["stack", "languages, frameworks and tools"],
    ["education", "the degree"],
    ["wins", "recognition"],
    ["contact", "how to reach Aakash"],
    ["resume", "open the résumé (PDF)"],
    ["github · linkedin", "open a profile"],
    ["theme <noir|amber|green>", "switch the phosphor"],
    ["crt <on|off> · motion <on|off>", "system switches"],
    ["lights", "play Lights Out"],
    ["sleep", "start the screensaver"],
    ["date · echo · history · clear · exit", "the usual"],
  ] as [string, string][],
  sudo: "aakash is not in the sudoers file. This incident will be reported.",
  rm: "Nice try. This filesystem is read-only.",
  opening: (target: string) => `opening ${target}...`,
  openUsage: "usage: open <projects|timeline|profile|contact|project>",
  noSuchApp: (name: string) => `open: ${name}: no such app or project`,
  themeUsage: "usage: theme <noir|amber|green>",
  themeSet: (phosphor: string) => `phosphor set to ${phosphor}`,
  switchUsage: (name: string) => `usage: ${name} <on|off>`,
  switchSet: (name: string, value: string) => `${name} ${value}`,
  emailNote: "(copied to clipboard)",
  catUsage: "usage: cat <file>",
  catBinary: (file: string) => `cat: ${file}: binary file. Try \`resume\`.`,
  noSuchFile: (file: string) => `cat: ${file}: no such file`,
  sleeping: "goodnight...",
  lights: "insert cartridge: lights-out.exe",
} as const;
