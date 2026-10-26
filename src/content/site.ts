/** Copy where `{ em }` segments render as the italic accent words. */
export type RichText = (string | { em: string })[];

export const site = {
  name: "Aakash Buddha Kannan",
  handle: "Aakashxnoir",
  host: "noir-system",
  os: "NOIR/OS",
  location: "Chennai, India",
  email: "aakashb.kannan@gmail.com",
  linkedin: "https://www.linkedin.com/in/aakashbuddhakannan",
  github: "https://github.com/Aakashxnoir",
  resume: "/Aakash_Buddha_Kannan_Resume.pdf",
  status: "Open to internships",
  timeZone: "Asia/Kolkata",
} as const;

/**
 * Public origin for absolute metadata URLs, robots and the sitemap. Set
 * NEXT_PUBLIC_SITE_URL once the domain is decided; on Vercel the production
 * domain is picked up automatically.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export type AppId = "work" | "timeline" | "about" | "contact";

/** The four desktop apps, in corner order: top left, top right, bottom left, bottom right. */
export const apps: {
  id: AppId;
  number: string;
  file: string;
  title: string;
  href: string;
  blurb: string;
}[] = [
  {
    id: "work",
    number: "01",
    file: "projects",
    title: "Projects",
    href: "/work",
    blurb: "Five case files",
  },
  {
    id: "timeline",
    number: "02",
    file: "timeline",
    title: "Timeline",
    href: "/timeline",
    blurb: "git log of the path so far",
  },
  {
    id: "about",
    number: "03",
    file: "profile",
    title: "Profile",
    href: "/about",
    blurb: "Roles, stack, education",
  },
  {
    id: "contact",
    number: "04",
    file: "contact",
    title: "Contact",
    href: "/contact",
    blurb: "New message",
  },
];

export function getApp(id: AppId) {
  return apps.find((app) => app.id === id)!;
}

export const desktop = {
  role: "Full-stack · ML · Quantum",
  name: "Aakash Buddha Kannan",
  line: "Third-year computer science student building full-stack, machine learning and quantum-optimization products for real problems.",
  education: "B.E. Computer Science · Rajalakshmi Institute of Technology · 2024 to 2028",
  enter: "Enter",
  /** Background-removed cut of public/images/aakash.jpg (its own size). */
  portrait: {
    src: "/images/portrait.png",
    alt: "Aakash Buddha Kannan in a black sweater, smiling and looking to the side",
    width: 540,
    height: 418,
  },
} as const;

/** Functional interface labels. */
export const labels = {
  resume: "Résumé",
  downloadResume: "Download résumé",
  viewResume: "View résumé",
  resumePdf: "Résumé (PDF)",
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  copyEmail: "Copy email",
  copied: "Copied",
  home: "Back to desktop",
  desktop: "Desktop",
  skipToContent: "Skip to content",
  escBack: "ESC - back to desktop",
  escClose: "ESC - close project",
  escUp: "ESC - back",
  notFound: "File not found",
  notFoundBody: "No such file or directory. It may have moved, or it never existed.",
  status: "open to internships",
  noJs: "Needs JavaScript.",
  errorLog: "error.log",
  menuBar: "Menu bar",
  path: "Path",
  appsNav: "Apps",
} as const;

/** Menu bar menus. Items that need JS are marked and hidden without it. */
export const menus = {
  file: {
    label: "File",
    open: "Open",
    newMessage: "New message",
    resume: "Open résumé.pdf",
    downloadResume: "Download résumé.pdf",
    copyEmail: "Copy email address",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  extras: {
    label: "Extras",
    cartridge: "Insert a cartridge",
    terminal: "Terminal",
    lightsOut: "Lights Out",
    lightsOutNote: "F1 start",
    surprise: "Surprise me",
  },
  system: {
    label: "System",
    phosphor: "Phosphor",
    phosphors: [
      { id: "noir", label: "Noir" },
      { id: "amber", label: "Amber" },
      { id: "green", label: "Green" },
    ],
    crt: "CRT effect",
    motion: "Motion",
    sleep: "Sleep",
    about: "About this site",
    aboutBody:
      "NOIR/OS v3. Built with Next.js, TypeScript, Tailwind CSS, GSAP and Lenis. The project artworks are drawn live in glyphs on a canvas. Type set in Doto and JetBrains Mono.",
  },
} as const;

export type Phosphor = (typeof menus.system.phosphors)[number]["id"];

export const contact: {
  label: string;
  heading: RichText;
  window: string;
  to: string;
  from: string;
  fromPlaceholder: string;
  subject: string;
  subjects: string[];
  message: string;
  messagePlaceholder: string;
  send: string;
  sendNote: string;
  availability: string;
  elsewhere: string;
} = {
  label: "Contact",
  heading: ["Have a problem worth ", { em: "solving?" }, " File it with me."],
  window: "contact - new message",
  to: "To",
  from: "From",
  fromPlaceholder: "you@company.com",
  subject: "Subject",
  subjects: ["Internship", "Project", "Just saying hi"],
  message: "Message",
  messagePlaceholder:
    "Hi Aakash, we're working on... Here's what we need, the team and the timeline...",
  send: "Send message",
  sendNote: "Opens your mail app. Nothing is stored here.",
  availability: "Open to internships · Chennai, IST (UTC+5:30)",
  elsewhere: "Elsewhere",
};

/** Open Graph share image copy. */
export const share = {
  tagline: "Full-stack · Machine learning · Quantum optimization",
  alt: "Aakash Buddha Kannan, portfolio. Full-stack, machine learning and quantum optimization. Open to internships.",
} as const;

/** Flattens rich copy to plain text (for metadata). */
export function richToString(text: RichText): string {
  return text.map((part) => (typeof part === "string" ? part : part.em)).join("");
}
