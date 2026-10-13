import type { RichText } from "./site";

export const profile: {
  title: string;
  statement: RichText;
  body: string;
  portrait: { src: string; alt: string };
} = {
  title: "Profile",
  statement: [
    "I build things to see whether the idea ",
    { em: "actually works" },
    ", and I rarely leave a problem alone once it has my attention.",
  ],
  body: "On paper, I'm a third-year CS student in Chennai who works across web, machine learning and quantum optimization, and leads the technical side of my college's mathematics club. Off paper, I'm usually building a game, or losing to one.",
  portrait: {
    src: "/images/aakash.jpg",
    alt: "Aakash Buddha Kannan in a black sweater, smiling and looking to the side, in front of a carved stone wall",
  },
};

export const roles: { title: string; body: string; tags: string[] }[] = [
  {
    title: "Full-stack builder",
    body: "React and Next.js front ends on Spring Boot, FastAPI and Express back ends, with PostgreSQL, MySQL and Supabase. Shipped RIT Digital Twin, Sevagan and Infinitus.",
    tags: ["React", "Next.js", "Spring Boot", "FastAPI", "Express", "PostgreSQL"],
  },
  {
    title: "ML and quantum",
    body: "In FarmSync, LightGBM predicts yields and a 12-qubit QUBO pipeline in PennyLane ranks crop sequences.",
    tags: ["LightGBM", "PennyLane", "QUBO", "Python"],
  },
  {
    title: "Agent builder",
    body: "CHENG, my desktop voice assistant, runs Claude Code through the Claude Agent SDK, drives my own browser behind a permission gate and keeps its memory in an Obsidian vault.",
    tags: ["Claude Agent SDK", "WebSockets", "MediaPipe", "Node.js"],
  },
  {
    title: "Club tech lead",
    body: "Technical Head of Infinitus, RIT's mathematics club: I lead its technical development, web platform and technical decisions. Also an editor at the Women's Empowerment Club.",
    tags: ["Leadership", "Next.js", "Resend"],
  },
  {
    title: "Game maker",
    body: "I build games in Godot 4, including a 2D platformer with enemy state machines and a multi-phase boss AI. I also won a Grand Prix F1 gaming tournament.",
    tags: ["Godot 4", "GDScript"],
  },
];

export const education = {
  heading: "Education",
  degree: "B.E. Computer Science",
  school: "Rajalakshmi Institute of Technology",
  place: "Chennai",
  years: "Sep 2024 to May 2028",
  labels: { school: "School", place: "City", years: "Years" },
} as const;

export const rolesLabel = "Roles";

export const recognition = {
  heading: "Recognition",
  items: [
    { title: "1st Place", detail: "Designathon, 2025 (RIT Digital Twin)" },
    {
      title: "1st Place",
      detail: "Grand Prix F1 Gaming Tournament (Gamathon, Revolution Games), Apr 2026",
    },
    {
      title: "Participant",
      detail:
        "Hack The Horizon 2.0, VIT Chennai (24-hour inter-institutional hackathon), Aug 2025",
    },
    { title: "Technical Head", detail: "Infinitus Club, RIT, 2026 to present" },
    { title: "Editor", detail: "Women's Empowerment Club, RIT" },
  ],
} as const;

export const stack = {
  heading: "Stack",
  command: "neofetch",
  groups: [
    { label: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "C/C++", "SQL"] },
    {
      label: "Frontend",
      items: ["React", "Next.js", "Vite", "Tailwind CSS", "React Router", "Flutter"],
    },
    { label: "Backend", items: ["FastAPI", "Spring Boot", "Node.js", "Express", "REST APIs"] },
    { label: "ML/Quantum", items: ["LightGBM", "PennyLane (QUBO formulations)"] },
    { label: "Data", items: ["PostgreSQL", "MySQL", "SQLite", "Supabase", "Firebase/Firestore"] },
    { label: "Web3", items: ["Solidity", "Hardhat"] },
    { label: "Tools", items: ["Git", "Docker", "Maven", "Vercel", "Render", "Godot 4"] },
  ],
} as const;

export const outside = {
  heading: "Outside work",
  items: [
    { label: "Speaks", value: "Tamil, English and Sourashtra; learning Spanish" },
    { label: "Sport", value: "Volleyball, as a spiker; played for my school" },
    { label: "Games", value: "Competitive F1 racing games, and building my own" },
  ],
} as const;
