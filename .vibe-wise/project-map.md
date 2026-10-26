# Project Map

## Purpose
NOIR/OS: Aakash's portfolio (v3), a statically generated Next.js site styled as his own operating system, for internship applications.

## Requirements
- All content and copy from docs/PRD.md; design tokens from docs/DESIGN_SYSTEM.md; staged build in docs/IMPLEMENTATION_PLAN.md.
- Motion on by default, never gated on prefers-reduced-motion; only opt-out is System > Motion.
- Every full page load animates in (first visit and reload); boot screen once per session.
- Every page complete without JS; still fallback for every animation.

## Components
- Root layout: src/app/layout.tsx (inline head script, MenuBar, main, Boot, Extras, CRT overlay, controllers)
- Pages: src/app/{page,work,work/[slug],timeline,about,contact}
- Preferences + head script: src/lib/prefs.ts (adds `js`, `motion`, `boot` or `enter` classes on <html> before paint)
- Motion: src/components/motion/ (Boot.tsx boot screen, Motion.tsx scramble/reveal/lit via GSAP, SmoothScroll.tsx Lenis, gsap.ts lazy loader)
- ASCII art canvas: src/components/ascii/
- Shell (menu bar, windows): src/components/shell/
- Content: src/content/*.ts
- Styles: src/app/globals.css (Tailwind 4, motion CSS incl. boot + enter failsafes)

## Main Flow
Verified from code (implemented):
browser requests page --static HTML--> head script reads localStorage/sessionStorage --sets classes--> first paint
  --hydration--> MotionController loads GSAP --> [boot? wait for boot exit] --> setup(): scramble + reveals --> removes `enter`
  SmoothScroll: Lenis ticked by GSAP, feeds ScrollTrigger

## Data and Trust Boundaries
- No backend or database found. Visitor prefs in localStorage (`noiros:prefs`), boot flag in sessionStorage (`noiros:booted`).
- Contact form behaviour/integration: unknown (not inspected).

## Build and Deployment
- npm run dev / build (prebuild runs scripts/check-motion.mjs) / lint / test:motion (scripts/test-motion.mjs, headless Chrome)
- Vercel project "aakash-portfolio" (.vercel/project.json); live at aakash-portfolio-navy.vercel.app. Pushing to main on GitHub redeploys it (verified 19 Oct 2026: push of c00dbca went live).
- Motion guards: check-motion.mjs runs automatically before every build (static text check); test-motion.mjs needs Chrome, so not in Vercel builds. Since 24 Oct 2026 `.githooks/pre-push` runs build + test:motion before every push (needs `git config core.hooksPath .githooks` per clone; `--no-verify` skips).

## Unknowns
- Contact form submission path.
