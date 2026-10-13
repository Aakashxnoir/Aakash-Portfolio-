# CLAUDE.md

@AGENTS.md

Project: portfolio v3 ("NOIR/OS") for **Aakash Buddha Kannan** (GitHub: Aakashxnoir), a third-year CSE student applying for internships. A rebuild inspired by eddy-naboulet.dev: the site is his own operating system. v2 ("Noir Studio") is in git history.

## Read these first, in order
1. `docs/PRD.md`: what the site must do, all copy and content
2. `docs/DESIGN_SYSTEM.md`: colours, type, layout, motion rules
3. `docs/IMPLEMENTATION_PLAN.md`: stages, architecture, test checklist

## Stack
Next.js 16 (App Router, statically generated, `cacheComponents` off) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText, ScrambleText) · Lenis · Canvas 2D for the ASCII work · React `<ViewTransition>` · Vercel.

## Working rules
- Build **one stage at a time** from `IMPLEMENTATION_PLAN.md`. Stop at the end of each stage and summarize. Do not start the next stage until told.
- **Do not invent content.** Every fact comes from `docs/PRD.md`. Optional fields (role, team, links, problem, outcome, media) stay empty and render nothing until Aakash supplies them. Never show `[link]` placeholders. OS decoration (file names, hashes, `[ ok ]`) is fine; claims are not.
- Do not add pages, libraries or features that are not in the PRD; suggest them instead.
- Copy tone is professional, except the About statement, Contact, terminal replies and toys, which may be lightly playful.
- Use the tokens from `DESIGN_SYSTEM.md`. No hard-coded colours in components (canvas code reads the CSS variables).
- Desktop first (1440 and 1280); a simple stacked layout below 768px.
- **Every animation has a reduced-motion fallback, and every page reads fully without JS.** Nothing blocks the menu bar, résumé or email link.
- Lenis is the only smooth-scroll driver; ScrollTrigger reads from it. Canvases pause off screen and in hidden tabs.
- Accessible by default: real `<a>` and `<button>`, visible focus, alt text, 4.5:1 contrast in every phosphor, one `h1` per page.
- Keep components small and all copy in `src/content/`.
- No glow blobs, particle dust, decorative gradients (CRT texture is the one exception), emoji, rounded cards, or Inter/Roboto/Arial/Geist.
- Privacy: never publish the phone number, birthday or private socials.

## Commands
```
npm run dev      # local dev server
npm run build    # must pass before finishing a stage
npm run lint     # must pass before finishing a stage
```

## Definition of done for any stage
- Build and lint pass, no console errors
- Checked at 1440px, 1280px and 390px
- Reduced-motion and no-JS fallbacks checked for anything animated
- Lighthouse desktop Performance 90+ (from Stage 2 on)
- Stage checklist in `IMPLEMENTATION_PLAN.md` ticked
