# CLAUDE.md

@AGENTS.md

Project: portfolio v2 ("Noir Studio") for **Aakash Buddha Kannan** (GitHub: Aakashxnoir), a third-year CSE student applying for internships. A rebuild from scratch of the v1 site at `~/Documents/Projects/My-new-website-`.

## Read these first, in order
1. `docs/PRD.md`: what the site must do, all copy and content
2. `docs/DESIGN_SYSTEM.md`: colours, type, layout, motion rules
3. `docs/IMPLEMENTATION_PLAN.md`: stages, architecture, test checklist

## Stack
Next.js 16 (App Router, statically generated, `cacheComponents` off) · TypeScript · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText) · Lenis · three.js on `/` only · Vercel.

## Working rules
- Build **one stage at a time** from `IMPLEMENTATION_PLAN.md`. Stop at the end of each stage and summarize. Do not start the next stage until told.
- **Do not invent content.** Every fact comes from `docs/PRD.md`. Optional fields (role, team, links, problem, outcome, media) stay empty and render nothing until Aakash supplies them. Never show `[link]` placeholders.
- Do not add pages, libraries or features that are not in the PRD; suggest them instead.
- Copy tone is professional, except the About statement and Contact, which may be lightly playful.
- Use the tokens from `DESIGN_SYSTEM.md`. No hard-coded colours in components.
- **Desktop only** (1280px minimum). No mobile or tablet layouts unless asked.
- **Every animation has a reduced-motion fallback, and every page reads fully without JS.** Animate only `transform` and `opacity` (exceptions are listed in the design system). Nothing blocks the nav, résumé or email link.
- Lenis is the only smooth-scroll driver; ScrollTrigger reads from it. three.js loads only on `/`, after first paint.
- Accessible by default: real `<a>` and `<button>`, visible focus, alt text, 4.5:1 contrast, one `h1` per page.
- Keep components small and all copy in `src/content/`.
- No gradients as decoration, no glow blobs, no emoji, no rounded cards, no Inter/Roboto/Arial/Geist.
- Privacy: never publish the phone number, birthday or private socials.

## Commands
```
npm run dev      # local dev server
npm run build    # must pass before finishing a stage
npm run lint     # must pass before finishing a stage
```

## Definition of done for any stage
- Build and lint pass, no console errors
- Checked at 1440px and 1280px
- Reduced-motion and no-JS fallbacks checked for anything animated
- Lighthouse desktop Performance 90+ (from Stage 2 on)
- Stage checklist in `IMPLEMENTATION_PLAN.md` ticked
