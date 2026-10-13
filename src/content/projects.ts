import type { FieldId } from "@/components/ascii/fields";

export type ProjectLink = { label: string; href: string };

/** A screenshot or clip in `public/work/<slug>/`. Width and height are the file's own. */
export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  /** Alt text for images; a short description for videos. */
  alt: string;
  width: number;
  height: number;
  caption?: string;
  /** Video only: a still shown before playback. */
  poster?: string;
};

/**
 * One case file. Optional fields (award, role, team, problem, outcome) and empty
 * lists (links, media) render nothing until Aakash supplies them.
 */
export type Project = {
  slug: string;
  title: string;
  /** Short description of what it is, shown under the title. */
  kind: string;
  year: string;
  award?: string;
  description: string;
  /** "What I built": bullets from the résumé. */
  built: string[];
  stack: string[];
  role?: string;
  team?: string;
  problem?: string;
  outcome?: string;
  links: ProjectLink[];
  media: ProjectMedia[];
  /** The generative ASCII artwork drawn for this case. */
  art: FieldId;
};

/** Display order is array order. */
export const projects: Project[] = [
  {
    slug: "cheng",
    title: "CHENG",
    kind: "Personal AI desktop assistant",
    year: "2026 to present",
    description:
      "A desktop voice assistant with Claude Code as its brain. A local Node server runs the agent and streams it over WebSockets to a React interface; it wakes on a spoken phrase, answers in a single voice, drives the user's own browser over the Chrome DevTools Protocol behind a permission gate and on-screen confirmations, takes hand-gesture input through MediaPipe, and keeps long-term memory in an Obsidian vault.",
    built: [
      "Wake word, voice activity detection and speech-to-text in the browser, with server-side text-to-speech in one voice",
      "Browser control over the Chrome DevTools Protocol, with a permission gate that denies tool calls before they run and on-screen confirmations for outward actions",
      "Hand control through MediaPipe: pointing reticle, pinch to press, two-hand resize, filtered tracking",
      "Long-term memory: notes read from an Obsidian vault into the agent's context, and every exchange written back to it",
    ],
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "Node.js",
      "WebSockets",
      "Claude Agent SDK",
      "MediaPipe",
      "Zustand",
    ],
    links: [],
    media: [],
    art: "voice",
  },
  {
    slug: "farmsync",
    title: "FarmSync",
    kind: "Quantum-AI crop advisor",
    year: "2026",
    description:
      "Recommends crop sequences across growing seasons by combining agronomic feasibility rules, LightGBM yield prediction, and quantum optimization.",
    built: [
      "A full-stack crop advisory platform combining agronomic feasibility rules, LightGBM yield prediction and quantum optimization to recommend crop sequences across multiple growing seasons",
      "Crop sequencing formulated as a QUBO, solved by a 12-qubit SPARQ optimization pipeline in PennyLane with constraint-preserving XY mixing, warm-start initialization and measurement-based ranking",
    ],
    stack: ["Flutter", "FastAPI", "LightGBM", "PennyLane", "PostgreSQL"],
    links: [{ label: "Source", href: "https://github.com/Aakashxnoir/FarmSync" }],
    media: [],
    art: "field",
  },
  {
    slug: "rit-digital-twin",
    title: "RIT Digital Twin",
    kind: "Smart campus management platform",
    year: "2025",
    award: "1st Place, Designathon 2025",
    description:
      "A smart campus management platform with JWT authentication, role-based access for five user types, timetable generation with PDF export, and classroom booking workflows.",
    built: [
      "JWT authentication and role-based access for five user types",
      "Timetable generation with PDF export",
      "Classroom booking workflows",
      "Deployed on Vercel and Render with CI/CD",
    ],
    stack: ["React", "Spring Boot (Java 21)", "MySQL 8", "Docker", "Vercel", "Render"],
    links: [],
    media: [],
    art: "campus",
  },
  {
    slug: "sevagan",
    title: "Sevagan",
    kind: "Civic issue tracking platform",
    year: "2026",
    description:
      "A role-based platform with citizen, admin and worker workflows for issue reporting, assignment, status tracking and completion-photo management.",
    built: [
      "Citizen, admin and worker workflows for reporting, assignment, status tracking and completion photos",
      "REST APIs with Express and Supabase/PostgreSQL persistence, including image uploads",
      "An optional Ethereum/Hardhat layer for issue hashing and integrity verification",
    ],
    stack: ["React", "Express", "Supabase", "PostgreSQL", "Tailwind CSS", "Solidity"],
    links: [
      {
        label: "Source",
        href: "https://github.com/Aakashxnoir/Sevagan---Multilingual-Service-app",
      },
    ],
    media: [],
    art: "city",
  },
  {
    slug: "infinitus",
    title: "Infinitus",
    kind: "Mathematics club platform",
    year: "2026 to present",
    description:
      "The official platform for RIT's mathematics club: event and member pages, an authenticated admin dashboard, and contact and registration workflows.",
    built: [
      "Reusable Next.js components, responsive event and member pages, contact workflows and an authenticated admin dashboard",
      "Server-side API routes with Supabase/PostgreSQL persistence, event registration-link management, contact-message handling, rate limiting and email notifications through Resend",
    ],
    stack: ["Next.js", "React", "Supabase", "PostgreSQL", "Tailwind CSS", "Resend"],
    links: [
      { label: "Live site", href: "https://infinitus-seven.vercel.app" },
      { label: "Source", href: "https://github.com/Aakashxnoir/Infinitus" },
    ],
    media: [],
    art: "infinity",
  },
];

/** "01", "02", ... from the project's position. */
export function caseNumber(project: Project): string {
  return String(projects.indexOf(project) + 1).padStart(2, "0");
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The project after this one; the last wraps to the first. */
export function getNextProject(project: Project): Project {
  return projects[(projects.indexOf(project) + 1) % projects.length];
}

/** The project before this one; the first wraps to the last. */
export function getPreviousProject(project: Project): Project {
  return projects[(projects.indexOf(project) - 1 + projects.length) % projects.length];
}

export const also: {
  label: string;
  items: { name: string; rest: string; href?: string }[];
} = {
  label: "Also",
  items: [
    {
      name: "Irrumbu Kottaai Pallupudingi",
      rest: ", a 2D action platformer with enemy state machines and multi-phase boss AI (Godot 4, GDScript)",
    },
    {
      name: "life-tracker",
      rest: ", a personal habit and focus tracker (React, Vite, Tailwind, Firebase)",
      href: "https://github.com/Aakashxnoir/life-tracker",
    },
    {
      name: "NBOS Skill-swap",
      rest: ", a platform for sharing and swapping skills (JavaScript)",
      href: "https://github.com/Aakashxnoir/NBOS-Skill-swap-",
    },
  ],
};

export const workLabels = {
  title: "Projects",
  intro: "Five case files. Drag the canvas, or switch to the list.",
  canvas: "Canvas",
  list: "List",
  views: "View",
  dragHint: "Drag, scroll or use the arrow keys",
  files: "files",
  index: "No.",
  name: "Name",
  kind: "Kind",
  year: "Year",
  stack: "Stack",
  open: "Open",
} as const;

/** Case page section headings and fact labels. */
export const caseLabels = {
  overview: "Overview",
  built: "What I built",
  problem: "Problem",
  outcome: "Outcome",
  media: "Screens",
  year: "Year",
  award: "Award",
  role: "Role",
  team: "Team",
  stack: "Stack",
  links: "Links",
  previous: "Previous",
  allProjects: "All projects",
  upNext: "Up next",
  caseFiles: "Case files",
} as const;
