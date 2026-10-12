# Implementation Plan

Build in stages. **Finish a stage, run the checks, summarize, then stop and wait.** Every stage leaves the site working and deployable.

## Architecture
**Stack:** Next.js 16 (App Router, static) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText (Stage 2 on) · Lenis (Stage 2 on) · three.js (Stage 5, `/` only) · Vercel.

One animation library (GSAP) for everything; no Framer Motion. Lenis is the only scroll driver.

`cacheComponents` is **off**: the site is fully static, and Cache Components keeps old routes mounted but hidden, which fights page transitions and pinned scroll. `dynamicParams = false` makes unknown case slugs 404.

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata, top bar, footer
│   ├── page.tsx              / : hero, intro, work, recognition, contact call
│   ├── work/page.tsx         /work
│   ├── work/[slug]/page.tsx  case study (generateStaticParams, 404 for unknown)
│   ├── about/page.tsx · contact/page.tsx · not-found.tsx
│   ├── sitemap.ts · robots.ts · icon.svg · opengraph-image
│   └── globals.css           tokens, type scale, base styles
├── components/               small server components (Nav, Footer, Hero, WorkRow, CaseFacts, ...)
│   ├── motion/               Stage 2 to 4 client pieces (SmoothScroll, Reveal, Curtain, Cursor, Magnetic, ...)
│   └── three/                Stage 5 (HeroScene, dynamic import, still fallback)
├── content/                  site.ts · projects.ts · about.ts (all copy lives here)
└── lib/                      small helpers
```

Principles
- **All copy in `src/content/`**, verbatim from `docs/PRD.md`. Components only render it.
- **Server first.** Every page is complete HTML with JS off. Client components only add motion on top.
- **Optional fields render nothing when empty** (role, team, links, problem, outcome, media).

---

## Stage 1: Foundation and static site
Done. Motion, 3D, Lighthouse and media wait for their stages.
- [x] Next.js app in `~/Documents/Projects/Portfolio`; `cacheComponents` off; git initialised (no commit until asked)
- [x] Fonts (Archivo with `wdth` axis, JetBrains Mono) and every token from `DESIGN_SYSTEM.md` in `globals.css`
- [x] Content files: `site.ts`, `projects.ts` (5 case files + Also), `about.ts` (education, recognition, stack, outside work)
- [x] Top bar with current-route marking, footer
- [x] `/`: hero (no 3D yet), intro with education, selected work, recognition strip, contact call
- [x] `/work`, `/work/[slug]` (5 case studies, optional sections hidden when empty), `/about` (portrait, education, recognition, stack, outside work), `/contact`, 404
- [x] Per-route metadata, sitemap, robots, icon, Open Graph image with role and status
- [x] Portrait and résumé in `public/`
- [x] Checked at 1440px and 1280px; build and lint pass; no console errors

## Stage 2: Motion foundation
Done.
- [x] `gsap`, `lenis` installed; Lenis runs on GSAP's ticker and feeds ScrollTrigger (`motion/MotionRoot.tsx`), off under reduced motion
- [x] Motion switch: an inline head script adds `motion` to `<html>` before first paint when motion is allowed (`lib/motion.ts`), with a 6s failsafe if the app never hydrates. All motion CSS and the `fx:` Tailwind variant key off it
- [x] First-screen entrances are CSS only (`enter-line` mask rise, `enter-fade`), so they never wait for JS and never delay LCP
- [x] `Reveal` (SplitText line masks, or fade and rise) for content that scrolls into view; once only
- [x] No-JS and reduced motion: no class, so every page is complete and still (checked with JS off and with reduced motion)
- *Decision: the separate hairline-draw effect was dropped; rows reveal as a whole.*

## Stage 3: Page transitions, cursor, magnetic
Done.
- [x] Full-screen curtain (`motion/PageTransition.tsx`): internal link clicks raise it, the route changes underneath, it lifts and the new page's entrance plays. Shows the destination's name. Never takes pointer events or focus; 2.5s give-up
- [x] *Decision: browser back and forward change routes instantly (no curtain), so the browser's own scroll restoration is untouched.*
- [x] Custom cursor (`motion/Cursor.tsx`): fine pointer only, off under reduced motion; native cursor hidden only while it runs; focus rings untouched
- [x] Magnetic nav links, hero actions, contact email and next case (`motion/Magnetic.tsx`)
- [x] GSAP cleanups run in layout effects, so pin spacers and split lines are undone before React removes a page (fixes a route-change crash)

## Stage 4: Scroll story (home)
Done.
- [x] Pinned intro: the statement's words light in order with scroll (unlit words stay `--text-muted`, readable)
- [x] Pinned horizontal work track with a progress line; panels are single links to the case studies; tabbing to a panel scrolls it into view (the frame is `overflow: clip`, so focus never shifts the track natively)
- [x] Fallback: the vertical list is rendered too and shown by CSS when motion is off; only one layout is ever in the accessibility tree
- [x] Back and forward across the pins restore position, no stuck pin spacer

## Stage 5: 3D hero
Done.
- [x] `three` installed; `three/HeroScene.tsx` loads `three/scene.ts` with a dynamic import after `load` and idle, on `/` only
- [x] A dark twisted column (original geometry), softbox key light following the pointer with damping, faint studio reflections, rim light, red kicker; renders only while the hero is visible and the tab is shown; shaders compile asynchronously
- [x] *Decision: no still image file. Reduced motion renders one still WebGL frame; no JS, no WebGL or a software renderer (no GPU) keep the typographic hero.*
- [x] three.js is in the home route's chunks only

## Stage 6: Case study media
Ready, waiting on content.
- [x] `CaseMedia` (image or video, hairline frame, true colour, no autoplay) and the Role, Team, Problem, Outcome and Links fields render when present
- [ ] Aakash to supply media, roles, team sizes and links (see `PRD.md` open items)

## Stage 7: Polish and performance
Done. Lighthouse desktop on the production build: Performance 99 on `/`, 100 on `/work`, `/work/farmsync`, `/about` and `/contact`; Accessibility, Best Practices and SEO 100 on every route; CLS 0. (Lighthouse runs without a GPU, so `/` is measured with the typographic hero.)
- [x] Checked at 1440px and 1280px with motion on and off; no overflow; no console errors
- [x] Decorative case numbers drawn by CSS (not text) so they pass the contrast audit

## Revisions after review (13 Oct)
- [x] Home intro pins by its centre (no blank half-screen after it)
- [x] JARVIS renamed CHENG (`/work/cheng`)
- [x] Section headings (About and the home Recognition strip) on their own full-width row, so long words are never clipped
- [x] Faster curtain (about 1.1s) with the destination name rising in
- [x] Loading screen (once per session), link hover underline, portrait mask reveal, staggered list rows. Lighthouse still 100 on `/` with the loader

## Stage 8: Deploy
- [ ] GitHub repo, Vercel import, `NEXT_PUBLIC_SITE_URL`; live URL on résumé, LinkedIn and GitHub

---

## Test checklist (every stage)
**Build:** `npm run build` and `npm run lint` pass.
**Layout:** 1440px and 1280px, no overflow or clipped text.
**Routing:** each route loads by URL; `/work/nope` 404s; back and forward work.
**Content:** every fact matches `PRD.md`; no phone number; no `[link]` placeholders shown; email, GitHub, LinkedIn and résumé work.
**Accessibility:** keyboard reaches everything with visible focus; one `h1` per page with a correct accessible name; alt text; contrast 4.5:1.
**Motion (Stage 2 on):** reduced motion and JS off both show every page fully; nothing blocks the nav.
**Performance:** Lighthouse desktop 90+; GSAP and three.js only where used.
