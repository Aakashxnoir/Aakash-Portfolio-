/** Copy where `{ em }` segments render as the italic accent words. */
export type RichText = (string | { em: string })[];

export const site = {
  name: "Aakash Buddha Kannan",
  shortName: "Aakash B.K.",
  handle: "Aakashxnoir",
  location: "Chennai, India",
  email: "aakashb.kannan@gmail.com",
  linkedin: "https://www.linkedin.com/in/aakashbuddhakannan",
  github: "https://github.com/Aakashxnoir",
  resume: "/Aakash_Buddha_Kannan_Resume.pdf",
  status: "Open to internships",
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

export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Functional interface labels. */
export const labels = {
  resume: "Résumé",
  downloadResume: "Download résumé",
  resumePdf: "Résumé (PDF)",
  viewWork: "View work",
  viewAllWork: "View all work",
  readCase: "Read case",
  backToWork: "Back to all work",
  nextCase: "Next case",
  github: "GitHub",
  linkedin: "LinkedIn",
  email: "Email",
  home: "Home",
  skipToContent: "Skip to content",
  loading: "Loading",
  case: "Case",
  stack: "Stack",
  education: "Education",
  notFound: "Page not found",
} as const;

export const hero = {
  label: "Portfolio 2026 / Chennai, IN",
  name: { first: "Aakash", last: "Buddha Kannan" },
  line: "Third-year computer science student building full-stack, machine learning and quantum-optimization products for real problems.",
} as const;

export const workSection = {
  label: "Work",
  heading: "Selected work",
} as const;

/** Case study section headings and fact labels. */
export const caseLabels = {
  overview: "Overview",
  built: "What I built",
  problem: "Problem",
  outcome: "Outcome",
  media: "Screens",
  year: "Year",
  role: "Role",
  team: "Team",
  stack: "Stack",
  links: "Links",
  caseNav: "Case files",
} as const;

export const contact: { label: string; heading: RichText } = {
  label: "Contact",
  heading: ["Have a problem worth ", { em: "solving?" }, " File it with me."],
};

/** Open Graph share image copy. */
export const share = {
  tagline: "Full-stack · Machine learning · Quantum optimization",
  alt: "Aakash Buddha Kannan, portfolio. Full-stack, machine learning and quantum optimization. Open to internships.",
} as const;

export const footer = {
  copyright: "© 2026 Aakash Buddha Kannan",
} as const;

/** Flattens rich copy to plain text (for metadata). */
export function richToString(text: RichText): string {
  return text.map((part) => (typeof part === "string" ? part : part.em)).join("");
}
