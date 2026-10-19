# Design System: NOIR/OS

Direction: a dark operating system on an old monitor. Near-black screen, one phosphor colour for text, one red accent, dot-matrix display type, monospace everything else. Structure comes from hairlines, dotted leaders and the grid of a terminal, not from boxes and shadows. Designed at 1440px; works from 1280px; a stacked phone layout below 768px.

## 1. Never
- Glow blobs, particle dust, dotted debris, decorative gradients. The only gradients allowed are the CRT texture (scanlines, vignette), and the CRT can be switched off
- More than one accent colour on screen
- Emoji, rounded cards, soft drop shadows (windows and menus cast one hard 4px offset in `--rule`, no blur), glassmorphism
- Inter, Roboto, Arial, Geist, Space Grotesk or a system-default look
- Text that only becomes readable after an animation
- Fake screenshots, fake metrics, or any fact not in `PRD.md`

## 2. Colour tokens
Defined on `:root` in `globals.css`, switched per phosphor with `html[data-phosphor]`. Components use Tailwind utilities, never raw hex.

| Token | Noir (default) | Amber | Green | Use |
|---|---|---|---|---|
| `--bg` | `#0B0B0A` | `#17110C` | `#070F0A` | Screen |
| `--surface` | `#141413` | `#211912` | `#0D1811` | Windows, menus |
| `--text` | `#ECE8DF` | `#F4CB98` | `#B9F4C4` | Headings, primary text |
| `--text-soft` | `#BDB8AD` | `#D9AE7E` | `#93D2A0` | Body copy |
| `--text-muted` | `#8E897F` | `#A98760` | `#6FA27B` | Labels, metadata |
| `--rule` | `#2A2926` | `#3B2D20` | `#1E3325` | Hairlines, leaders |
| `--accent` | `#FF4130` | `#FF6B35` | `#FF5544` | Status, numbers, hover, focus, accent words |

All text tokens pass 4.5:1 on `--bg` and `--surface` in every phosphor (checked in Stage 1).
Selection: `--accent` background, `--bg` text.

## 3. Typography
| Role | Font | Notes |
|---|---|---|
| Display | **Doto** (variable `wght`, `ROND`), weight 800 to 900, uppercase | Name, page titles, project titles, big numbers. Dot-matrix, like an F1 timing board |
| UI and body | **JetBrains Mono** 400 and 500 (italic for accent words) | Everything else |

Scale at 1440 (fluid with `clamp()`)
| Use | Size / line-height |
|---|---|
| Desktop name | about 112px / 0.9, one line |
| Page title | 120px / 0.9 |
| Section / role heading | 72px / 0.95 |
| Project tile title | 28px / 1 |
| Statement | 36px / 1.3, mono 400, accent italic phrase |
| Lead | 18px / 1.6 |
| Body | 15px / 1.7, `--text-soft` |
| Label | 11px / 1.4, tracking 0.12em, uppercase |
| Menu bar | 13px |

## 4. Layout
- Menu bar 40px, fixed, `--bg` with a 1px `--rule` bottom line. Path bar 32px under it on inner routes.
- Page side padding 32px (desktop shell) and 80px for reading columns. Phones: 16px.
- Desktop: four apps pinned to the corners of the first screen; the portrait centred; the name across the lower middle; actions in a row under it.
- Reading pages: a 12-column grid with 24px gutters; text measure 64ch max.
- Spec tables: mono label, a dotted leader (`border-bottom: 1px dotted var(--rule)`), the value.
- Windows (contact, terminal, game): `--surface`, 1px `--text-muted` border, a title bar with the file name and a close button. Square corners.
- The screen itself has 14px rounded corners (the monitor), drawn by the CRT overlay.

## 5. Components
- **App icon (desktop):** accent number (Doto), file name (label), title (20px). Hover or focus: `ENTER ↵` chip.
- **Label:** mono 11px uppercase tracked, `--text-muted`.
- **Text link:** `--text`, 1px underline `--rule`; hover underline and text `--accent`.
- **Button:** mono label in a 1px bordered box, no fill; hover fills `--text` with `--bg` text. The primary action fills `--accent`.
- **Tag:** 1px `--accent` border box, 11px uppercase label in `--accent`.
- **Status:** `open to internships` with a small solid accent square that breathes (opacity), still with System > Motion off.
- **Focus:** 2px `--accent` outline, 3px offset, on everything. Never removed.
- **Cursor:** pixel arrow and pixel hand cursors (CSS `cursor: url()`), with system fallbacks.

## 6. ASCII rendering
- Used for the generative project artworks only (the portrait is a normal photo).
- Glyph ramp (dark to light): ` .:-=+*#%@`.
- Cells are drawn in `--text`; the brightest cells pick up `--accent` sparingly.
- One canvas per artwork, device-pixel aware, max 30fps, paused off screen and in hidden tabs.

## 7. Motion
Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for reveals, `steps()` for anything that should feel like a terminal. Durations 0.2 to 1.2s.

| Effect | Behaviour | Stage |
|---|---|---|
| Project art | Each case has its own field function animated in glyphs | 1 |
| Canvas drag | Pointer drag with inertia, wheel pan, arrow keys | 1 |
| Boot | `NOIR/OS` boot log lines with `[ ok ]`, counter 000 to 100 on real loading, CRT power-on (a line draws across), then the screen opens from the middle onto the page. Without motion it shows still and fades | 2 |
| Smooth scroll | Lenis, the only scroll driver; ScrollTrigger reads from it | 2 |
| Text | Display headings scramble in from random glyphs (ScrambleText); blocks fade and rise 24px; once | 2 |
| Windows | Route changes use View Transitions: opening grows from the clicked corner, closing shrinks back; the menu bar stays put | 2 |
| Timeline | Scroll moves the active commit along the graph; the graph line draws | 2 |
| Profile | Statement words light from muted to text with scroll | 2 |
| Screensaver | After 90s idle or System > Sleep: black screen, one red circle breathing, the clock | 3 |

Rules
- Animate `transform` and `opacity`. Exceptions: canvas drawing, hover colour, the statement's word colour, SVG stroke drawing on the timeline, view-transition snapshots.
- Every effect checks the System > Motion switch (the `motion` class on `<html>`) and has a still fallback and a no-JS fallback. Motion is **on by default and does not follow `prefers-reduced-motion`**: desktops with animations turned down (KDE "Instant", GNOME animations off, Windows animation effects off) report `reduce`, and following it left the site with no motion at all (Aakash, 14 Oct 2026). Visitors who want it still pick off in System > Motion. `npm run build` fails if `(prefers-reduced-motion` or a `motion-safe:`/`motion-reduce:` variant appears in `src/` (`scripts/check-motion.mjs`). Every full page load animates in, boot screen or not: a reload or a later page of the session must never be still (19 Oct 2026). `npm run test:motion` checks first visit, reload and motion off in Chrome.
- Nothing blocks the menu bar, the résumé or the email link while animating.

## 8. Imagery
- One photo, `public/images/aakash.jpg`, always shown as a normal photo in natural colour: the desktop uses its background-removed cut (`portrait.png`), the lower edge fading out under the name; Profile shows the full photo in a hairline frame.
- Project media (later): true colour, hairline frame, no rounding, no shadow.
- Project artworks are original generative patterns, not pictures of the product.
