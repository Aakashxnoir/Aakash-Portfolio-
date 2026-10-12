# Design System: Noir Studio

Scope: **desktop only**, designed at 1440px, minimum 1280px.

Direction: film noir as a modern studio site. Near-black and off-white, one sharp red, very large condensed type, hard light, deep shadow, lots of black space. Structure comes from type scale and hairlines, not boxes.

## 1. Anti-patterns (never)
- Gradient backgrounds, glow blobs, particle dust, dotted debris. The only soft light is the real light on the 3D object
- More than one accent colour on screen
- Emoji, stickers, rounded cards, cards with a coloured left border, drop shadows
- Glassmorphism panels (not this direction)
- Inter, Roboto, Arial, Geist, Space Grotesk or a system-default look
- Text that only becomes readable after an animation
- Marvel, DC or film stills, posters or logos

## 2. Colour tokens
Defined once on `:root` in `globals.css`. Components use the Tailwind utilities, never raw hex.

| Token | Value | Use | Contrast on `--bg` |
|---|---|---|---|
| `--bg` | `#0A0A0A` | Page | |
| `--surface` | `#141414` | Raised areas, image backing | |
| `--text` | `#EDEDED` | Headings, primary text | 16.9:1 |
| `--text-soft` | `#B8B8B8` | Body copy | 10.0:1 |
| `--text-muted` | `#8F8F8F` | Labels, metadata | 6.1:1 |
| `--text-faint` | `#6B6B6B` | Decorative only (index numerals at display size) | 3.7:1, never for body |
| `--rule` | `#2A2A2A` | 1px hairlines | |
| `--accent` | `#FF3D2E` | The one red: status, primary underline, hover, focus, italic accent words | 5.6:1 |

Selection: `--accent` background, `--bg` text (5.6:1).

## 3. Typography
Loaded with `next/font/google`.

| Role | Font | Notes |
|---|---|---|
| Display | **Archivo**, variable, condensed (`font-stretch: 62%`), weight 600 to 800, uppercase | Name, page titles, project titles, big numerals |
| Body and UI | **Archivo**, normal width, weight 300 to 500 | Same family keeps it one voice |
| Labels | **JetBrains Mono** 400 and 500, uppercase, tracked | Labels, metadata, nav |

Scale at 1440 (fluid between 1280 and 1440 via `clamp()` on `vw`)
| Use | Size / line-height | Style |
|---|---|---|
| Hero name | about 216px / 0.82 | Display 800, condensed, uppercase, -0.01em |
| Page title (inner pages, case title) | 160px / 0.85 | Display 700, condensed, uppercase |
| Section heading | 88px / 0.9 | Display 700, condensed, uppercase |
| Work row title | 120px / 0.85 | Display 700, condensed, uppercase |
| Statement | 56px / 1.12 | Body 300, normal width, accent italic phrase |
| Contact heading | 128px / 0.9 | Display 700, condensed, uppercase, accent word |
| Lead | 22px / 1.5 | Body 300 |
| Body | 18px / 1.65 | Body 300, `--text-soft` |
| Label | 12px / 1.4, tracking 0.16em | Mono 400, uppercase |

## 4. Layout
- Page side padding **80px** at all supported widths. Content max width 1440px, centred.
- 12-column grid, 32px gutters, for anything that needs columns.
- Sections separated by 160 to 200px.
- Structure from **1px hairlines** (`--rule`).
- Top bar: 88px tall, fixed, solid `--bg` fill so content scrolls cleanly under it (no blur, no shadow). Left: home link. Right: nav links and Résumé, 40px apart.
- Hero: full first screen. Label top-left; name anchored bottom-left across the width; right column (4 of 12) holds the line, status, actions and socials; the 3D object sits behind and above the name (Stage 5).
- Work rows (`/work`): a hairline, then the index label, the title (display, huge) and kind and year (mono) on the left 7 columns; the summary and stack on the right 5 columns. Everything is visible without hover.
- Case study: label, giant title, then a facts row on the 12-column grid (Year, Role, Team, Stack, Links), then text sections in a 7-column measure starting at column 5.
- Footer: hairline, then a row: copyright left, links right.

## 5. Components
- **Label:** mono, uppercase, 12px, tracked. `--text-muted` by default, `--accent` for status.
- **Text link:** `--text`, 1px underline in `--rule`. Hover: text and underline go `--accent`.
- **Primary action:** text link with a 1px `--accent` underline. No filled buttons.
- **Nav link:** mono label. Current route: `--text` with a 1px underline and `aria-current="page"`; others `--text-muted`, hover `--text`.
- **Focus:** 2px `--accent` outline, 4px offset, on every interactive element. Never removed, never covered by the cursor.
- **Status:** `OPEN TO INTERNSHIPS` in mono `--accent`, with a small solid red square before it (no pulse until Stage 2, and none under reduced motion).
- **Portrait (About):** black and white, hard contrast: `grayscale(1) contrast(1.2) brightness(0.85)`. Hairline frame, no rounding, no shadow.
- **Case facts row:** `dl` of mono labels over values, hairline above.
- **Project index:** mono `CASE 01` style label; display numerals only as decoration and `aria-hidden`.

## 6. Motion (stages 2 to 5)
Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for reveals, `cubic-bezier(0.76, 0, 0.24, 1)` for the page curtain. Durations 0.5 to 1.2s.

| Effect | Behaviour | Stage |
|---|---|---|
| Loading screen | First visit of a session: name and label on top, a hero-size counter 000 to 100 following real loading (fonts, then load), a red line along the bottom; at 100 it lifts (transform) and the entrances start. Any key or click skips; capped at 2.4s | 2 |
| Link hover | A red line draws over the grey underline, left to right | 2 |
| Portrait (About) | Rises into its frame while the photo settles from a 1.25 zoom | 2 |
| Smooth scroll | Lenis, low intensity. The only scroll driver; GSAP ScrollTrigger reads from it | 2 |
| First-paint entrance | Page titles and the hero name rise from a mask; the first screen's other items fade and rise 24px. CSS only, staggered | 2 |
| Text reveal | Headings that scroll into view rise line by line from a mask (SplitText), staggered 0.08s; blocks fade and rise 32px; once | 2 |
| Page transition | Full-screen `--bg` curtain with a 1px red top edge sweeps up (transform) showing the destination's name, the route changes underneath, then it leaves. About 1.2s in total. Back and forward are instant | 3 |
| Custom cursor | A small off-white dot that grows to a ring over links, with `mix-blend-mode: difference`. Native cursor hidden only while it runs; focus rings unaffected | 3 |
| Magnetic buttons | Primary actions and nav links drift up to 8px toward the pointer (transform), spring back | 3 |
| Pinned intro | The statement pins and its words go from `--text-muted` to `--text` (accent words to `--accent`) with scroll; colour on spans is the allowed exception | 4 |
| Horizontal work scroll | The work section pins and the panels move sideways with vertical scroll (transform only) | 4 |
| 3D hero | One dark twisted column, slow idle turn, a tall softbox light that follows the cursor with damping. Renders only while visible. Reduced motion: one still frame. No WebGL or no GPU: typographic hero | 5 |
| Status | The square before `OPEN TO INTERNSHIPS` breathes (opacity) | 2 |

Rules
- Animate only `transform` and `opacity` (exceptions: hover colour, the pinned statement's word colour, ScrollTrigger's pin spacer).
- Every effect checks `prefers-reduced-motion` and has a no-JS fallback. Under reduced motion: no smooth scroll, no reveals, no curtain, no custom cursor, no pins, no 3D animation (a still frame).
- Nothing blocks the nav, the résumé or the email link while animating.
- Each reveal plays once; scroll-scrubbed effects follow scroll both ways.

## 7. Imagery
- One portrait (`public/images/aakash.jpg`) on `/about`, noir-treated.
- Project media (later): full width of the content column, hairline border, no shadow, no rounding, shown in true colour (no noir filter on screenshots).
- The 3D object is original geometry, not a model of anything recognisable.
