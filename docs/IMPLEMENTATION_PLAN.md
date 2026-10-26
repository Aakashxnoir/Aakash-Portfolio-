# Implementation Plan (v3, NOIR/OS)

Build in stages. **Finish a stage, run the checks, summarize, then stop and wait.** Every stage leaves the site working and deployable. v2 ("Noir Studio") is in git history (`7632f97`).

## Architecture
**Stack:** Next.js 16 (App Router, static, `cacheComponents` off) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText, ScrambleText) · Lenis · Canvas 2D for all ASCII work · React `<ViewTransition>` for windows · Vercel. three.js is removed.

```
src/
├── app/
│   ├── layout.tsx            fonts, metadata, prefs head script, Shell
│   ├── page.tsx              / desktop
│   ├── work/page.tsx         projects.vol (canvas + list)
│   ├── work/[slug]/page.tsx  case page (generateStaticParams, dynamicParams false)
│   ├── timeline/page.tsx     timeline.log
│   ├── about/page.tsx        profile.sys
│   ├── contact/page.tsx      contact.app
│   ├── not-found.tsx · sitemap.ts · robots.ts · icon.svg · opengraph-image.tsx
│   └── globals.css           tokens (three phosphors), type, CRT, base styles
├── components/
│   ├── shell/                MenuBar, Menu, Clock, PathBar, EscapeKey, Window (view transition), WindowOrigin
│   ├── ascii/                engine (glyph renderer), fields (project artworks), AsciiArt
│   ├── desktop/ work/ case/ timeline/ profile/ contact/
│   ├── motion/               Boot, SmoothScroll (Lenis), Motion (scramble, reveals, lit text), LitText, gsap loader
│   └── extras/               Extras host, AppWindow, Terminal (+ commands), LightsOut, Screensaver
├── content/                  site.ts · projects.ts · profile.ts · timeline.ts · extras.ts (all copy)
└── lib/                      prefs (phosphor, CRT, motion), window (transition origins), extras (open events)
```

Principles
- **All copy in `src/content/`**, verbatim from `docs/PRD.md`.
- **Server first.** Every page is complete HTML with JS off. Client components add motion and toys on top.
- **Optional fields render nothing when empty.**
- **Preferences** (phosphor, CRT, motion) live in `localStorage`, applied by an inline head script before first paint, as `data-*` attributes on `<html>`.

---

## Stage 1: Foundation, shell, every route, ASCII
Done (13 Oct 2026).
- [x] Remove three.js and v2 components; Doto + JetBrains Mono; tokens for three phosphors; CRT overlay
- [x] Content files: `site.ts`, `projects.ts` (with links), `profile.ts`, `timeline.ts`
- [x] Shell: menu bar (File, Extras, System as `<details>` menus), status, résumé, IST clock; path bar with ESC
- [x] ASCII engine (glyph atlases, one drawImage per cell); portrait from `portrait-cutout.png` (red rim light, cursor light, scramble, per-app character sets incl. Tamil, still with System > Motion off, static text without JS)
- [x] Desktop `/` with four apps, name, line, actions, education
- [x] Five generative project artworks; `/work` canvas (drag, wheel, keys, inertia, idle drift) and list; `/work/[slug]` case pages
- [x] `/timeline` (graph + commit list), `/about` (dithered cut-out with a lens onto the photo, statement, roles, education, recognition, neofetch stack with outside work), `/contact` (mailto form)
- [x] Phosphor switch in System menu (CRT and Motion switches too)
- [x] Phone layout below 768px
- [x] Metadata, sitemap, robots, icon, favicon, OG image; 404
- [x] Build and lint pass; 1440, 1280 and 390 checked (no overflow, one `h1` per page, no console errors); JS off and motion off checked
- *Decision: the portrait cut-out was made with rembg (u2net_human_seg) from `aakash.jpg`, cropped to head and shoulders, contrast-equalised.*
- *Superseded 13 Oct 2026 (Aakash): the portrait is a normal photo, not ASCII or dithered. The desktop shows `portrait.png` (the same cut, in colour, from `aakash.jpg`); Profile shows `aakash.jpg`. The ASCII portrait, per-app character sets and the dither lens were removed.*

## Stage 2: Motion
Done (13 Oct 2026).
- [x] Lenis + GSAP ticker + ScrollTrigger (GSAP loads after first paint); motion class before first paint. Nothing is hidden in the server HTML, so no failsafe is needed for content; the boot screen has a CSS failsafe (hidden after 4s)
- [x] Boot (loading) screen: once per session, skippable, real loading (fonts, images, motion libraries, window load), capped at 2.4s, under the menu bar. Not shown with System > Motion off or without JS
- [x] Scramble (display headings) and fade-and-rise reveals (blocks), once each; they play on every full load, with or without the boot screen (a reload is never still; fixed 19 Oct 2026, checked by `npm run test:motion`)
- [x] View-transition windows: open grows from the click point, close shrinks to the app's desktop corner; menu bar anchored
- [x] Timeline: pinned horizontal scroll along the graph from 768px (active commit ringed, lines draw, focus scrolls to a card; the `git show <hash>` command line was dropped 26 Oct 2026 with the visible hashes); Profile statement lighting
- *Decision (revised 14 Oct 2026): System > Motion is on by default and ignores prefers-reduced-motion; OS animation settings were switching the whole site still. Off in System > Motion is the opt-out. Guarded by `scripts/check-motion.mjs` before every build.*

## Stage 3: Extras
Done (13 Oct 2026).
- [x] Terminal (command parser, history, tab completion, navigation, theme switching)
- [x] Lights Out (F1 start reaction game, best time in `localStorage`)
- [x] Screensaver (idle 90s or System > Sleep), tab title while hidden
- [x] CRT and motion switches wired; Surprise me (done in Stage 1)

## Stage 4: Polish, performance, deploy
- [x] Lighthouse desktop 90+ on every route; no console errors (13 Oct 2026: 100 / 100 / 100 / 100 on all six routes, LCP 0.6 to 0.8s)
- [x] Contrast check in all phosphors (lowest pair 5.2:1); keyboard pass
- [ ] GitHub repo, Vercel, `NEXT_PUBLIC_SITE_URL` (waiting on Aakash: push, Vercel project, domain)

---

## Test checklist (every stage)
**Build:** `npm run build` and `npm run lint` pass.
**Layout:** 1440px, 1280px and 390px; no overflow or clipped text.
**Routing:** each route loads by URL; `/work/nope` 404s; back and forward work; ESC goes up one level.
**Content:** every fact matches `PRD.md`; no phone number or birthday; no `[link]` placeholders; email, GitHub, LinkedIn and résumé work.
**Accessibility:** keyboard reaches everything with visible focus; one `h1` per page; alt text; 4.5:1 contrast in all phosphors.
**Motion:** plays with OS reduced-motion on (KDE "Instant" animations), on a first visit and on a reload (`npm run test:motion`); System > Motion off and JS off both show every page fully; nothing blocks the menu bar.
**Performance:** Lighthouse desktop 90+.
