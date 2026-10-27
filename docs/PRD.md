# PRD: Aakash Buddha Kannan, Portfolio (v3, "NOIR/OS")

## 1. Goal
A portfolio that gets Aakash internship interviews. Within 10 seconds a recruiter knows **who he is, that he is open to internships, what he builds, and where his best work is**, and can email him, open GitHub or LinkedIn, or view or download the résumé in one click from the first screen.

v3 is a rebuild from scratch, inspired by eddy-naboulet.dev (a portfolio dressed as an operating system). It replaces v2 "Noir Studio". The identity is his own: the handle **Aakashxnoir** and the `aakash@noir-system` prompt from his GitHub README.

## 2. Audience
- **Primary:** internship recruiters and engineering managers who skim. Desktop browsers first.
- **Secondary:** peers, club members, hackathon organisers.
- **Phones:** a simple stacked layout with the same content (decision, 13 Oct 2026). The OS effects are a desktop experience.

## 3. Success criteria
- Name, role, **OPEN TO INTERNSHIPS**, GitHub, LinkedIn and résumé are all on the first screen of `/`.
- Education (college, degree, years) is visible on the desktop and on `/about`.
- Every project has its own case page, one click from `/work`.
- Desktop Lighthouse: Performance 90+, Accessibility 95+, SEO 95+ on every route.
- Memorable: the OS shell, the boot screen, the generative ASCII project art and the small toys (terminal, F1 lights game) are what a visitor remembers. Never at the cost of reading the content.

## 4. Concept: NOIR/OS
The site is Aakash's own operating system. A menu bar runs along the top (File, Extras, System, a live Chennai clock and the internship status). The home page is a desktop: four numbered apps sit in the corners and a photo of Aakash (background removed, natural colour) fills the middle with his name in huge dot-matrix letters across it. The first page of a visit opens with a `NOIR/OS` boot (loading) screen. Each app opens as a full-screen window with a path bar (`Desktop / projects`) and closes with ESC.

| App | File name | Route |
|---|---|---|
| 01 Projects | `projects` | `/work`, `/work/[slug]` |
| 02 Timeline | `timeline` | `/timeline` |
| 03 Profile | `profile` | `/about` |
| 04 Contact | `contact` | `/contact` |

Decision, 26 Oct 2026: file names have no extensions (were `projects.vol`, `timeline.log`, `profile.sys`, `contact.app`).

Extras are toys: a terminal that answers real commands about Aakash, and **Lights Out**, an F1 start-lights reaction game (he won a Grand Prix F1 gaming tournament). The System menu switches the screen's phosphor (noir, amber, green), the CRT effect and motion.

## 5. Tone
| Where | Tone |
|---|---|
| Desktop, Projects, case pages, Timeline, Profile roles | Professional, factual, outcome-focused |
| About statement, Contact, terminal replies, toys | Lightly playful; the first sentence stays plain |

Every claim is true and sourced from section 8. OS labels (file names, `[ ok ]`, commit hashes) are decoration, not claims.

## 6. Structure (Next.js App Router, statically generated)

### Shell (every route)
- **Menu bar:** home mark `ABK` (link to `/`), menus **File**, **Extras**, **System**; right side: status `open to internships` (link to `/contact`), `Résumé` (view in a new tab), `↓` (download), live clock in IST.
  - File: open each app, new message, open résumé (view), download résumé, copy email, GitHub, LinkedIn.
  - Extras: Terminal, Lights Out, Surprise me (a random case page).
  - System: phosphor (Noir, Amber, Green), CRT effect on/off, motion on/off, Sleep, About this site.
- **Path bar** on every route except `/`: breadcrumbs from `Desktop` (decision, 26 Oct 2026: not `~/desktop`, which read as odd to viewers), and `ESC - back to desktop` (or `close project` on a case page). ESC goes one level up.
- Menus work without JS (`<details>`), and every menu item is a real link or button.

### Desktop `/`
1. Four corner apps: number, file name, title.
2. Portrait behind the name: his photo, background removed, shown as a normal photo (decision, 13 Oct 2026: no ASCII treatment).
3. Role label `FULL-STACK · ML · QUANTUM`, name `AAKASH BUDDHA KANNAN` at display size.
4. Hero line, status, **Download résumé**, **View résumé**, **GitHub**, **LinkedIn**, education line.

### Projects `/work`
- **Canvas view** (desktop, JS): a draggable plane of project tiles, each with a live generative ASCII artwork and its title. Drag, wheel or arrow keys pan; click opens the case.
- **List view** (default without JS, on phones, and by toggle): index, title, kind, year, stack.
- The "Also" line under the list.

### Case page `/work/[slug]`
Slugs: `cheng`, `farmsync`, `rit-digital-twin`, `sevagan`, `infinitus`. Unknown slugs 404.
- Large generative ASCII artwork, label `05.1`-style index, title, kind, overview
- Spec table with dotted leaders: Year, Award, Role, Team, Stack, Links. Empty facts are not shown
- What I built (bullets from the résumé); optional Problem, Outcome, Media when supplied
- Previous, All projects, Up next

### Timeline `/timeline`
A git log of his path. A terminal line (`$ git log --graph`), a horizontal branch graph (`main`, `build`, `wins`, `clubs`) and one large card per commit. Scroll moves along the graph (Stage 2). Without motion it is a plain ordered list. Decision, 26 Oct 2026: no `aakash@noir-system` prompt and no commit hashes on the page (viewers read them as noise); the hashes stay in the Extras terminal.

### Profile `/about`
Portrait (the photo, unfiltered), About statement (words light with scroll in Stage 2), body, roles as large headings with a paragraph and tags, Education, Recognition, a `neofetch`-style stack card, Outside work.

### Contact `/contact`
A mail window `contact - new message`: To (email, copy button), status, From, Subject chips, Message. **Send** opens the visitor's mail app (`mailto:`, no backend; works without JS as a GET form). LinkedIn, GitHub, Résumé beside it. Heading: the contact line.

### Signature moments
| Moment | Stage | Fallback (System > Motion off or no JS) |
|---|---|---|
| Generative ASCII project art | 1 | One still frame; no JS: hidden, titles remain |
| Draggable project canvas | 1 | List view |
| Boot (loading) screen: `NOIR/OS` boot log with a real loading counter, CRT power-on. Once per session, skippable, capped at 2.4s, under the menu bar | 2 | System > Motion off or no JS: not shown |
| Lenis smooth scroll, text scramble and line reveals | 2 | Native scroll, text visible at once |
| Window open and close (View Transitions from the clicked corner) | 2 | Instant route change |
| Timeline scroll along the graph; Profile statement lighting | 2 | Plain list; statement fully lit |
| Screensaver after 90s idle: one red circle breathing, the clock | 3 | Static |
| Terminal, Lights Out, phosphor and CRT switches | 3 | Hidden without JS |

### Out of scope
Blog, CMS, login, contact form backend (`mailto:` only), analytics beyond Vercel defaults, sound, light theme.

## 7. Non-functional requirements
- **Performance:** Lighthouse desktop 90+ on every route. Fonts via `next/font`. Canvases start after first paint, pause when off screen or the tab is hidden, and cap the frame rate.
- **Accessibility:** real `<a>` and `<button>`, visible focus, alt text, 4.5:1 text contrast in all three phosphors, full keyboard use, one `h1` per page. Canvases are decorative (`aria-hidden`) and every fact they suggest is in text.
- **Progressive enhancement:** every page reads fully with JS off and with System > Motion off. Motion is on by default and does not follow `prefers-reduced-motion` (OS animation settings were turning the whole site still).
- **Routing:** every route loads by URL; back and forward work.
- **Layout:** designed at 1440px; works from 1280px; phones get the stacked layout below 768px.
- **SEO:** per-route title and description, Open Graph image naming the role and status, sitemap, robots.
- **Privacy:** no phone number, birthday or private socials anywhere on the site.

## 8. Content (source of truth)
Sources: résumé (`public/Aakash_Buddha_Kannan_Resume.pdf`), his Obsidian vault (`Aakash/Me/`, `Aakash/JARVIS/`), his public GitHub, and the approved v2 copy.

### Identity
- Name: Aakash Buddha Kannan · Handle: Aakashxnoir · Location: Chennai, India
- Email: aakashb.kannan@gmail.com
- LinkedIn: https://www.linkedin.com/in/aakashbuddhakannan
- GitHub: https://github.com/Aakashxnoir
- Résumé: `/Aakash_Buddha_Kannan_Resume.pdf`
- Status: `OPEN TO INTERNSHIPS`

### Desktop
- Label: `NOIR/OS · CHENNAI, IN`
- Role label: `FULL-STACK · ML · QUANTUM`
- Name: `AAKASH BUDDHA KANNAN`
- Line: "Third-year computer science student building full-stack, machine learning and quantum-optimization products for real problems."
- Education line: B.E. Computer Science · Rajalakshmi Institute of Technology · 2024 to 2028

### Education
B.E. Computer Science, Rajalakshmi Institute of Technology, Chennai. Sep 2024 to May 2028. (CGPA stays on the résumé only.)

### About
- Statement: "I build things to see whether the idea *actually works*, and I rarely leave a problem alone once it has my attention."
- Body: "On paper, I'm a third-year CS student in Chennai who works across web, machine learning and quantum optimization, and leads the technical side of my college's mathematics club. Off paper, I'm usually building a game, or losing to one."
- Portrait: `public/images/aakash.jpg`; the desktop uses a background-removed cut of it in natural colour (`public/images/portrait.png`).
- Outside work: Languages: Tamil, English, Sourashtra, learning Spanish · Sport: volleyball, spiker, played for his school · Games: competitive F1 racing games, and building his own

### Profile roles
1. **Full-stack builder.** React and Next.js front ends on Spring Boot, FastAPI and Express back ends, with PostgreSQL, MySQL and Supabase. Shipped RIT Digital Twin, Sevagan and Infinitus. Tags: React, Next.js, Spring Boot, FastAPI, Express, PostgreSQL
2. **ML and quantum.** In FarmSync, LightGBM predicts yields and a 12-qubit QUBO pipeline in PennyLane ranks crop sequences. Tags: LightGBM, PennyLane, QUBO, Python
3. **Agent builder.** CHENG, his desktop voice assistant, runs Claude Code through the Claude Agent SDK, drives his own browser behind a permission gate and keeps memory in an Obsidian vault. Tags: Claude Agent SDK, WebSockets, MediaPipe, Node.js
4. **Club tech lead.** Technical Head of Infinitus, RIT's mathematics club: leads its technical development, web platform and technical decisions. Editor at the Women's Empowerment Club. Tags: Leadership, Next.js, Resend
5. **Game maker.** Builds games in Godot 4, including a 2D platformer with enemy state machines and a multi-phase boss AI; won a Grand Prix F1 gaming tournament. Tags: Godot 4, GDScript

### Case files
Order: CHENG, FarmSync, RIT Digital Twin, Sevagan, Infinitus. Copy is unchanged from v2 (see `src/content/projects.ts`). Links (approved 13 Oct 2026):
- FarmSync: Source https://github.com/Aakashxnoir/FarmSync
- Sevagan: Source https://github.com/Aakashxnoir/Sevagan---Multilingual-Service-app
- Infinitus: Live https://infinitus-seven.vercel.app · Source https://github.com/Aakashxnoir/Infinitus
- CHENG: repo private, no link. RIT Digital Twin: no link yet.

**Also** (one quiet line):
- Irrumbu Kottaai Pallupudingi, a 2D action platformer with enemy state machines and multi-phase boss AI (Godot 4, GDScript). No link.
- life-tracker, a personal habit and focus tracker (React, Vite, Tailwind, Firebase). https://github.com/Aakashxnoir/life-tracker
- NBOS Skill-swap, a platform for sharing and swapping skills (JavaScript). https://github.com/Aakashxnoir/NBOS-Skill-swap-

### Timeline (commits, oldest first)
Dates are shown only as precisely as the source gives them. Within 2026, projects are ordered by their GitHub repo dates.
| Branch | Date | Commit | Detail |
|---|---|---|---|
| main | Sep 2024 | init: B.E. Computer Science | Started at Rajalakshmi Institute of Technology, Chennai |
| wins | Aug 2025 | Hack The Horizon 2.0 | 24-hour inter-institutional hackathon by the AI Club at VIT Chennai; built and presented a working prototype |
| build | 2025 | RIT Digital Twin | Smart campus management platform |
| wins | 2025 | 1st Place, Designathon 2025 | For RIT Digital Twin (merge) |
| clubs | 2026 | Technical Head, Infinitus Club | Leads technical development, web platforms and technical decisions |
| wins | Apr 2026 | 1st Place, Grand Prix F1 Gaming Tournament | Gamathon by Revolution Games, 9 to 11 April 2026, a three-day tournament |
| build | 2026 | Sevagan | Civic issue tracking platform |
| build | Aug 2026 | CHENG | First build of his desktop voice assistant |
| build | 2026 | Infinitus | The mathematics club's platform |
| build | 2026 | FarmSync | Quantum-AI crop advisor |
| main | Oct 2026 | HEAD: third year | Open to internships |
| main | May 2028 | B.E. completes | Expected (shown dashed) |

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
- Heading: "Have a problem worth *solving?* File it with me."
- Email, status, LinkedIn, GitHub, View résumé, Download résumé

## 9. Open items (Aakash to provide)
- [ ] RIT Digital Twin links; FarmSync demo video
- [ ] Role and team size per project
- [ ] Screenshots or short clips per project; Problem and Outcome lines, if he wants them
- [x] Whether the public résumé PDF keeps his phone number: no (decision, 28 Oct 2026). The copy with the number goes only to applications.
- [ ] A domain (for `NEXT_PUBLIC_SITE_URL`)
