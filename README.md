# Aakash Buddha Kannan, Portfolio

Personal portfolio of Aakash Buddha Kannan, a third-year computer science student in Chennai building full-stack, machine learning and quantum-optimization products. Open to internships.

**Noir Studio:** near-black and off-white with one red accent and very large condensed type. A dark 3D column in the hero, lit by a light that follows the cursor; a scroll story on the home page (a pinned statement that lights word by word, then the case files in a pinned horizontal track); full-screen page transitions, a custom cursor and magnetic links.

Every effect has a fallback: with reduced motion or without JavaScript, every page is complete and still.

## Stack
Next.js 16 (App Router, statically generated) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · three.js (home only, loaded after first paint) · Archivo and JetBrains Mono via `next/font`.

## Run it
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live
- `src/content/`: all copy (site, projects, about). Edit text here, not in components. Case-study media, roles, team sizes and links go in `projects.ts`.
- `src/components/`: small server components; `home/` holds the home sections, `motion/` the client effects, `three/` the hero scene.
- `src/lib/motion.ts`: the motion switch (a `motion` class on `<html>` set before first paint).
- `src/app/`: routes `/`, `/work`, `/work/[slug]`, `/about`, `/contact`, plus sitemap, robots, icons and the Open Graph image.
- `docs/`: PRD, design system and the staged build plan.

Desktop only (1280px and wider) by design.

## Seeing the motion
The site follows the operating system's reduced-motion setting. If animations are turned off on your machine (for example KDE's animation speed set to instant, or GTK animations disabled), browsers report reduced motion and the site shows its still version.
