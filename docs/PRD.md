# PRD: Aakash Buddha Kannan, Portfolio (v2, "Noir Studio")

## 1. Goal
A portfolio that gets Aakash internship interviews. Within 10 seconds a recruiter knows **who he is, that he is open to internships, what he builds, and where his best work is**, and can email him, open GitHub or LinkedIn, or download the résumé in one click from the first screen.

v2 is a rebuild from scratch. It replaces the v1 "Loki / Archive" site with a new identity and much more motion, without giving up clarity, speed or accessibility.

## 2. Audience
- **Primary:** internship recruiters and engineering managers who skim. Desktop browsers, 1280px and wider.
- **Secondary:** peers, club members, hackathon organisers.
- Phones and tablets are out of scope by decision (desktop only).

## 3. Success criteria
- Name, role, **OPEN TO INTERNSHIPS**, GitHub, LinkedIn and résumé are all on the first screen of `/`.
- Education (college, degree, years) is visible on `/about` and in the home intro.
- Every project has its own case-study page, reachable in one click from `/work` and from the home work section.
- Desktop Lighthouse: Performance 90+, Accessibility 95+, SEO 95+ on every route, with the 3D hero and motion running.
- Memorable: the noir look, the lit 3D object and the scroll story are what a visitor remembers. Never at the cost of reading the content.

## 4. Concept: Noir Studio
Film noir, done as a modern studio site. Near-black and off-white, one sharp red accent, very large condensed type, hard light and deep shadow. The hero is a single dark sculpted object in 3D, lit by a light that follows the cursor. Scrolling tells the story: statement, work, recognition, contact.

The theme lives in color, type, light and a few small labels ("CASE 01"). The copy itself stays plain and professional.

## 5. Tone
| Where | Tone |
|---|---|
| Hero, Work, case studies, Recognition, Stack, Education | Professional, factual, outcome-focused |
| About statement, Contact | Lightly playful; the first sentence stays plain |

Every claim must be true and sourced from section 8. Playful lines stay short.

## 6. Structure (multi-page, Next.js App Router, statically generated)

| Route | Contents |
|---|---|
| `/` | Hero (name, line, status, actions, socials, 3D object), intro statement with education, selected work, recognition strip, contact call |
| `/work` | Every case file as a large row, plus the "Also" line |
| `/work/[slug]` | Case study for one project. Slugs: `cheng`, `farmsync`, `rit-digital-twin`, `sevagan`, `infinitus`. Unknown slugs 404 |
| `/about` | Portrait, statement, body, Education, Recognition, Stack, Outside work |
| `/contact` | Contact heading, email, status, LinkedIn, GitHub, résumé |

Every route shares the top bar and footer. Routes change with a full-screen transition (Stage 3).

### Top bar
Left: `AAKASH B.K.` (link to `/`). Right: `Work`, `About`, `Contact` and `Résumé` (download). The current route is marked (`aria-current="page"`, not by colour alone). `Work` is current on `/work/[slug]`.

### Home, in order
1. **Hero:** label `PORTFOLIO 2026 / CHENNAI, IN`; name `AAKASH` / `BUDDHA KANNAN` at display size; the hero line; status `OPEN TO INTERNSHIPS`; actions **View work** (primary, to `/work`) and **Download résumé**; GitHub and LinkedIn links. The 3D object sits in the hero (Stage 5); until then, and whenever 3D is off, the hero is typographic.
2. **Intro:** the About statement, revealed by scroll (Stage 4), with the education line under it.
3. **Selected work:** every project as a panel. Stage 4 turns this into a pinned horizontal scroll. Each panel links to its case study. A `View all work` link to `/work`.
4. **Recognition strip:** the awards, one line each.
5. **Contact call:** the contact heading, the email link and `OPEN TO INTERNSHIPS`.
6. **Footer**

### Case study page (`/work/[slug]`)
Shows only fields that exist in `src/content/projects.ts`:
- Label `CASE 01`, title, kind, year, award (if any)
- Facts row: Year, Role, Team, Stack, Links. A fact with no value is not shown. A link without a URL is not shown
- Overview (description)
- What I built (bullets from the résumé)
- Optional sections, shown only when Aakash supplies them: Problem, Outcome, Media (screenshots or video)
- `Back to all work` and `Next case`

No invented problems, results, metrics, roles or screenshots.

### Signature moments (built in later stages)
| Moment | Stage | Fallback (reduced motion or no JS) |
|---|---|---|
| Loading screen: counter 000 to 100 on real loading, red line, lifts onto the hero. Once per session, any key or click skips, capped at 2.4s | 2 | Not shown |
| Smooth scroll and text reveals | 2 | Native scroll, text visible at once |
| Full-screen page transition, custom cursor, magnetic buttons | 3 | Instant route change, native cursor, still buttons (back and forward are always instant) |
| Scroll story: pinned intro statement, pinned horizontal work scroll | 4 | Normal vertical layout, every panel and link reachable |
| 3D hero: dark sculpted object, cursor-following light | 5 | Reduced motion: one still frame. No JS, no WebGL or no GPU: the typographic hero |

### Out of scope for v2
Blog, CMS, login, contact form backend (`mailto:` only), analytics beyond Vercel defaults, mobile and tablet layouts, light theme or theme toggle, sound.

## 7. Non-functional requirements
- **Performance:** desktop Lighthouse 90+ on every route. Images via `next/image`, fonts via `next/font`. three.js loads only on `/`, after first paint, and never blocks LCP. GSAP loads only where it is used.
- **Accessibility:** real `<a>` and `<button>` elements, visible focus, alt text, 4.5:1 text contrast, full keyboard use. The custom cursor never hides the native focus ring.
- **Progressive enhancement:** every page reads fully with JS off and under `prefers-reduced-motion`. Each effect has a fallback (table above).
- **Routing:** every route loads directly by URL; back and forward work and restore scroll.
- **Layout:** desktop only. Designed at 1440px, minimum 1280px.
- **SEO:** per-route title and description, Open Graph image naming the role and status, sitemap, robots.
- **Privacy:** no phone number, birthday or private social accounts on the site.

## 8. Content (source of truth)
Sources: résumé (`public/Aakash_Buddha_Kannan_Resume.pdf`), his Obsidian vault (`Me/` notes), and the approved v1 copy.

### Identity
- Name: Aakash Buddha Kannan · Handle: Aakashxnoir · Location: Chennai, India
- Email: aakashb.kannan@gmail.com
- LinkedIn: https://www.linkedin.com/in/aakashbuddhakannan
- GitHub: https://github.com/Aakashxnoir
- Résumé: `/Aakash_Buddha_Kannan_Resume.pdf`
- Status: `OPEN TO INTERNSHIPS`

### Hero
- Label: `PORTFOLIO 2026 / CHENNAI, IN`
- Name: `AAKASH` / `BUDDHA KANNAN`
- Line: "Third-year computer science student building full-stack, machine learning and quantum-optimization products for real problems."
- Actions: `View work` · `Download résumé`. Links: `GitHub` · `LinkedIn`

### Education
B.E. Computer Science, Rajalakshmi Institute of Technology, Chennai. Sep 2024 to May 2028. (CGPA stays on the résumé only.)

### About
- Statement: "I build things to see whether the idea *actually works*, and I rarely leave a problem alone once it has my attention."
- Body: "On paper, I'm a third-year CS student in Chennai who works across web, machine learning and quantum optimization, and leads the technical side of my college's mathematics club. Off paper, I'm usually building a game, or losing to one."
- Portrait: `public/images/aakash.jpg`, black-and-white noir treatment.
- Outside work (from the vault, Aakash to approve): Languages: Tamil, English, Sourashtra, learning Spanish · Sport: volleyball, spiker, played for his school · Games: competitive F1 racing games, and building his own

### Case files
Order: CHENG, FarmSync, RIT Digital Twin, Sevagan, Infinitus. Links stay empty until Aakash supplies them.

**01. CHENG** · Personal AI desktop assistant, 2026 to present
A desktop voice assistant with Claude Code as its brain. A local Node server runs the agent and streams it over WebSockets to a React interface; it wakes on a spoken phrase, answers in a single voice, drives the user's own browser over the Chrome DevTools Protocol behind a permission gate and on-screen confirmations, takes hand-gesture input through MediaPipe, and keeps long-term memory in an Obsidian vault.
Built: wake word, voice activity detection and speech-to-text in the browser, with server-side text-to-speech in one voice · Browser control over the Chrome DevTools Protocol, with a permission gate that denies tool calls before they run and confirmations on the interface for outward actions · Hand control through MediaPipe: pointing reticle, pinch to press, two-hand resize, filtered tracking · Long-term memory: notes read from an Obsidian vault into the agent's context, and every exchange written back to it
Stack: React, TypeScript, Vite, Node.js, WebSockets, Claude Agent SDK, MediaPipe, Zustand
(Source: vault `JARVIS Overview`, `JARVIS Journal`, repo `ARCHITECTURE.md`. Repo is private: no source link. Aakash to approve this copy.)

**02. FarmSync** · Quantum-AI crop advisor, 2026
Recommends crop sequences across growing seasons by combining agronomic feasibility rules, LightGBM yield prediction, and quantum optimization.
Built: a full-stack crop advisory platform combining agronomic feasibility rules, LightGBM yield prediction and quantum optimization to recommend crop sequences across multiple growing seasons · Crop sequencing formulated as a QUBO, solved by a 12-qubit SPARQ optimization pipeline in PennyLane with constraint-preserving XY mixing, warm-start initialization and measurement-based ranking
Stack: Flutter, FastAPI, LightGBM, PennyLane, PostgreSQL

**03. RIT Digital Twin** · Smart campus management platform, 2025 · Award: 1st Place, Designathon 2025
A smart campus management platform with JWT authentication, role-based access for five user types, timetable generation with PDF export, and classroom booking workflows.
Built: JWT authentication and role-based access for five user types · Timetable generation with PDF export · Classroom booking workflows · Deployed on Vercel and Render with CI/CD
Stack: React, Spring Boot (Java 21), MySQL 8, Docker, Vercel, Render

**04. Sevagan** · Civic issue tracking platform, 2026
A role-based platform with citizen, admin and worker workflows for issue reporting, assignment, status tracking and completion-photo management.
Built: citizen, admin and worker workflows for reporting, assignment, status tracking and completion photos · REST APIs with Express and Supabase/PostgreSQL persistence, including image uploads · An optional Ethereum/Hardhat layer for issue hashing and integrity verification
Stack: React, Express, Supabase, PostgreSQL, Tailwind CSS, Solidity

**05. Infinitus** · Mathematics club platform, 2026 to present
The official platform for RIT's mathematics club: event and member pages, an authenticated admin dashboard, and contact and registration workflows.
Built: reusable Next.js components, responsive event and member pages, contact workflows and an authenticated admin dashboard · Server-side API routes with Supabase/PostgreSQL persistence, event registration-link management, contact-message handling, rate limiting and email notifications through Resend
Stack: Next.js, React, Supabase, PostgreSQL, Tailwind CSS, Resend

**Also** (one quiet line):
- Irrumbu Kottaai Pallupudingi, a 2D action platformer with enemy state machines and multi-phase boss AI (Godot 4, GDScript)
- life-tracker, a personal habit and focus tracker (React, Vite, Tailwind, Firebase)
- NBOS Skill-swap, a platform for sharing and swapping skills (JavaScript)

### Recognition
- 1st Place, Designathon, 2025 (RIT Digital Twin)
- 1st Place, Grand Prix F1 Gaming Tournament (Gamathon, Revolution Games), Apr 2026
- Participant, Hack The Horizon 2.0, VIT Chennai (24-hour inter-institutional hackathon), Aug 2025
- Technical Head, Infinitus Club, RIT, 2026 to present
- Editor, Women's Empowerment Club, RIT

### Stack
- Languages: Python, Java, TypeScript, JavaScript, C/C++, SQL
- Frontend: React, Next.js, Vite, Tailwind CSS, React Router, Flutter
- Backend: FastAPI, Spring Boot, Node.js, Express, REST APIs
- ML and quantum: LightGBM, PennyLane (QUBO formulations)
- Data: PostgreSQL, MySQL, SQLite, Supabase, Firebase/Firestore
- Web3: Solidity, Hardhat
- Tools: Git, Docker, Maven, Vercel, Render, Godot 4

### Contact
- Label: `CONTACT`
- Heading: "Have a problem worth *solving?* File it with me."
- Email (large), status, LinkedIn, GitHub, Résumé (PDF)

### Footer
`© 2026 AAKASH BUDDHA KANNAN` · email · GitHub · LinkedIn · Résumé

## 9. Open items (Aakash to provide)
- [ ] Live and source links for each case file (public repos exist for FarmSync, Sevagan and Infinitus; Infinitus is live at infinitus-seven.vercel.app; he will confirm which to use)
- [ ] RIT Digital Twin links; FarmSync demo video; which repo is Irrumbu Kottaai Pallupudingi
- [ ] Role and team size per project
- [ ] Screenshots or short clips per project; Problem and Outcome lines, if he wants them
- [ ] Approve the CHENG copy and the Outside work line
- [ ] Whether the public résumé PDF keeps his phone number
