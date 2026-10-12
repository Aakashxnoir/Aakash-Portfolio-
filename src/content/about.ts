import type { RichText } from "./site";

export const about: {
  label: string;
  statement: RichText;
  body: string;
  portrait: { src: string; alt: string };
} = {
  label: "About",
  statement: [
    "I build things to see whether the idea ",
    { em: "actually works" },
    ", and I rarely leave a problem alone once it has my attention.",
  ],
  body: "On paper, I'm a third-year CS student in Chennai who works across web, machine learning and quantum optimization, and leads the technical side of my college's mathematics club. Off paper, I'm usually building a game, or losing to one.",
  portrait: {
    src: "/images/aakash.jpg",
    alt: "Portrait of Aakash Buddha Kannan",
  },
};

export const education = {
  heading: "Education",
  degree: "B.E. Computer Science",
  school: "Rajalakshmi Institute of Technology",
  place: "Chennai",
  years: "Sep 2024 to May 2028",
  yearsLabel: "Years",
} as const;

export const recognition = {
  heading: "Recognition",
  items: [
    { title: "1st Place", detail: "Designathon, 2025 (RIT Digital Twin)" },
    {
      title: "1st Place",
      detail:
        "Grand Prix F1 Gaming Tournament (Gamathon, Revolution Games), Apr 2026",
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
  groups: [
    {
      label: "Languages",
      items: ["Python", "Java", "TypeScript", "JavaScript", "C/C++", "SQL"],
    },
    {
      label: "Frontend",
      items: ["React", "Next.js", "Vite", "Tailwind CSS", "React Router", "Flutter"],
    },
    {
      label: "Backend",
      items: ["FastAPI", "Spring Boot", "Node.js", "Express", "REST APIs"],
    },
    {
      label: "ML and quantum",
      items: ["LightGBM", "PennyLane (QUBO formulations)"],
    },
    {
      label: "Data",
      items: ["PostgreSQL", "MySQL", "SQLite", "Supabase", "Firebase/Firestore"],
    },
    { label: "Web3", items: ["Solidity", "Hardhat"] },
    {
      label: "Tools",
      items: ["Git", "Docker", "Maven", "Vercel", "Render", "Godot 4"],
    },
  ],
} as const;

export const outside = {
  heading: "Outside work",
  items: [
    {
      label: "Languages",
      value: "Tamil, English and Sourashtra; learning Spanish",
    },
    { label: "Sport", value: "Volleyball, as a spiker; played for my school" },
    { label: "Games", value: "Competitive F1 racing games, and building my own" },
  ],
} as const;
