# Aakash Buddha Kannan, Portfolio (NOIR/OS)

Personal portfolio of Aakash Buddha Kannan, a third-year computer science student in Chennai building full-stack, machine learning and quantum-optimization products. Open to internships.

**NOIR/OS:** the site is his own operating system. A boot screen on the first page of a visit; a menu bar with File, Extras and System menus and a live Chennai clock; a desktop with four apps in the corners around his photo; apps that open as windows (view transitions); projects on a draggable canvas of generative ASCII artworks; a git-graph timeline that scrolls sideways; a mail-window contact. Extras holds a terminal that answers questions about him and Lights Out, an F1 start reaction game; the screen sleeps after 90 seconds. System switches the phosphor (noir, amber, green), the CRT effect and motion.

Every effect has a fallback: with reduced motion or without JavaScript, every page is complete and still.

## Stack
Next.js 16 (App Router, statically generated) · TypeScript · Tailwind CSS 4 · React `<ViewTransition>` · GSAP (ScrollTrigger, ScrambleText) and Lenis · Canvas 2D for the ASCII artworks · Doto and JetBrains Mono via `next/font`.

## Run it
```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Where things live
- `src/content/`: all copy (site, projects, profile, timeline, extras). Case-study media, roles, team sizes and links go in `projects.ts`.
- `src/components/shell/`: menu bar, menus, clock, path bar, ESC handling, window transitions.
- `src/components/ascii/`: the glyph engine and the project artworks (`fields.ts`).
- `src/components/motion/`: boot screen, Lenis smooth scroll, heading scramble, reveals, scroll-lit text.
- `src/components/extras/`: terminal (`commands.ts`), Lights Out, screensaver.
- `src/components/{desktop,work,case,timeline,profile,contact}/`: one folder per app.
- `src/lib/prefs.ts`: phosphor, CRT and motion preferences (set on `<html>` before first paint).
- `docs/`: PRD, design system and the staged build plan.
