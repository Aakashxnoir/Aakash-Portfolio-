export type Branch = "main" | "build" | "wins" | "clubs";

export type Commit = {
  /** Decorative short hash, stable per commit. */
  hash: string;
  branch: Branch;
  /** As precise as the source allows ("2026", "Apr 2026"). */
  date: string;
  title: string;
  detail: string;
  tags: string[];
  /** Case page, when the commit is a project. */
  href?: string;
  /** Not happened yet (drawn dashed). */
  future?: boolean;
};

/** Lanes top to bottom in the graph. */
export const branches: { id: Branch; label: string }[] = [
  { id: "main", label: "main" },
  { id: "build", label: "build" },
  { id: "wins", label: "wins" },
  { id: "clubs", label: "clubs" },
];

/**
 * Oldest first. Dates are only as precise as the sources (résumé, vault). Within
 * 2026 the projects follow their GitHub repo dates.
 */
export const commits: Commit[] = [
  {
    hash: "a1c0e24",
    branch: "main",
    date: "Sep 2024",
    title: "init: B.E. Computer Science",
    detail: "Started the B.E. in Computer Science at Rajalakshmi Institute of Technology, Chennai.",
    tags: ["education"],
  },
  {
    hash: "3f9b1d7",
    branch: "wins",
    date: "Aug 2025",
    title: "Hack The Horizon 2.0",
    detail:
      "A 24-hour inter-institutional hackathon run by the AI Club at VIT Chennai. Built and presented a working prototype.",
    tags: ["hackathon", "24 hours"],
  },
  {
    hash: "7d2e8a0",
    branch: "build",
    date: "2025",
    title: "RIT Digital Twin",
    detail:
      "A smart campus management platform: JWT authentication, role-based access for five user types, timetable generation with PDF export and classroom booking.",
    tags: ["React", "Spring Boot", "MySQL"],
    href: "/work/rit-digital-twin",
  },
  {
    hash: "c4a61f3",
    branch: "wins",
    date: "2025",
    title: "1st Place, Designathon 2025",
    detail: "RIT Digital Twin took first place at Designathon 2025.",
    tags: ["award"],
  },
  {
    hash: "e05b9c2",
    branch: "clubs",
    date: "2026",
    title: "Technical Head, Infinitus Club",
    detail:
      "Leads the technical development, web platforms and technical decisions of RIT's mathematics club.",
    tags: ["leadership"],
  },
  {
    hash: "91f3a6e",
    branch: "wins",
    date: "Apr 2026",
    title: "1st Place, Grand Prix F1 Gaming Tournament",
    detail:
      "Gamathon by Revolution Games, 9 to 11 April 2026: a three-day competitive F1 gaming tournament.",
    tags: ["F1", "3 days"],
  },
  {
    hash: "5b8d0c4",
    branch: "build",
    date: "2026",
    title: "Sevagan",
    detail:
      "A civic issue tracking platform with citizen, admin and worker workflows, and an optional Ethereum integrity layer.",
    tags: ["React", "Express", "Supabase", "Solidity"],
    href: "/work/sevagan",
  },
  {
    hash: "2a7f4e9",
    branch: "build",
    date: "Aug 2026",
    title: "CHENG",
    detail:
      "First build of a desktop voice assistant with Claude Code as its brain, browser control and hand gestures.",
    tags: ["Claude Agent SDK", "MediaPipe"],
    href: "/work/cheng",
  },
  {
    hash: "d63c1b5",
    branch: "build",
    date: "2026",
    title: "Infinitus",
    detail:
      "The official platform for RIT's mathematics club, with an authenticated admin dashboard.",
    tags: ["Next.js", "Supabase", "Resend"],
    href: "/work/infinitus",
  },
  {
    hash: "8e1a7d0",
    branch: "build",
    date: "2026",
    title: "FarmSync",
    detail:
      "A quantum-AI crop advisor: LightGBM yield prediction and a 12-qubit QUBO pipeline in PennyLane.",
    tags: ["FastAPI", "LightGBM", "PennyLane"],
    href: "/work/farmsync",
  },
  {
    hash: "f0e9d8c",
    branch: "main",
    date: "Oct 2026",
    title: "HEAD: third year",
    detail: "Third year of the B.E., and open to internships.",
    tags: ["open to internships"],
  },
  {
    hash: "0000000",
    branch: "main",
    date: "May 2028",
    title: "B.E. completes",
    detail: "Expected end of the degree.",
    tags: ["expected"],
    future: true,
  },
];

export const timelineLabels = {
  title: "Timeline",
  description:
    "Aakash's path so far as a git log: the B.E. at Rajalakshmi Institute of Technology, projects, wins and club roles.",
  prompt: "aakash@noir-system:~$",
  logCommand: "git log --graph --all --oneline",
  showCommand: "git show",
  steps: "commits",
  branches: "branches",
  open: "Open case",
  legend: "Branches",
  commitsLabel: "Commits",
} as const;
