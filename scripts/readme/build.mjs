// Builds the README's animated SVGs into .github/readme/.
//
//   node --experimental-strip-types scripts/readme/build.mjs   (Node 22; no flag from 23.6)
//
// Needs ImageMagick (`magick`) for the portrait. Everything is read from the
// site itself: copy from src/content, colours from globals.css, the project
// artworks from the real field functions, Doto from src/assets/fonts. GitHub
// shows these as plain images, so everything moves with CSS keyframes. They
// always animate: OS reduced-motion settings are ignored, as on the site.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fields } from '../../src/components/ascii/fields.ts'
import { boot, lightsOut, screensaver, terminal } from '../../src/content/extras.ts'
import { projects, workLabels } from '../../src/content/projects.ts'
import { apps, desktop, labels, menus, site } from '../../src/content/site.ts'
import { branches, commits, timelineLabels } from '../../src/content/timeline.ts'
import { loadFont } from './font.mjs'

const ROOT = join(import.meta.dirname, '..', '..')
const OUT = join(ROOT, '.github', 'readme')
mkdirSync(OUT, { recursive: true })

const DOTO = loadFont(join(ROOT, 'src/assets/fonts/Doto-Black.ttf'))
/** Glyph ramp and still-frame time from src/components/ascii/engine.ts. */
const RAMP = ' .:-=+*#%@'
const STILL_TIME = 2.4
/** One monospace cell, in em. */
const CELL = 0.6

const f2 = (n) => +n.toFixed(2)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Seeded, so a rebuild writes the same files. */
function random(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  }
}

// --- Colour ----------------------------------------------------------------

/** Class letter to token: `f-t` fills with --text, `s-r` strokes with --rule. */
const ROLES = { b: 'bg', f: 'surface', t: 'text', s: 'text-soft', u: 'text-muted', r: 'rule', a: 'accent' }

/** The three phosphors, in the order globals.css defines them (:root, amber, green). */
function readPhosphors() {
  const css = readFileSync(join(ROOT, 'src/app/globals.css'), 'utf8')
  const sets = []
  for (const [, name, hex] of css.matchAll(
    /--(bg|surface|text|text-soft|text-muted|rule|accent):\s*(#[0-9a-fA-F]{6})/g,
  )) {
    if (name === 'bg') sets.push({})
    sets.at(-1)[name] = hex.toUpperCase()
  }
  const ids = menus.system.phosphors.map((p) => p.id)
  if (sets.length !== ids.length) throw new Error(`expected ${ids.length} phosphors in globals.css`)
  return Object.fromEntries(ids.map((id, i) => [id, sets[i]]))
}
const PHOSPHOR = readPhosphors()
const NOIR = PHOSPHOR.noir

const paletteCss = (p) =>
  Object.entries(ROLES)
    .map(([k, role]) => `.f-${k}{fill:${p[role]}}.s-${k}{stroke:${p[role]}}`)
    .join('')

const BASE_CSS = `.mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace;white-space:pre}
.fb{transform-box:fill-box;transform-origin:center}.fl{transform-box:fill-box;transform-origin:left center}.fr{transform-box:fill-box;transform-origin:right center}`

// --- Keyframes -------------------------------------------------------------

const pct = (t, dur) => `${+((Math.min(dur, Math.max(0, t)) / dur) * 100).toFixed(3)}%`

/** Keyframes on class `name` from [seconds, declarations, timing to the next stop] stops. */
function anim(name, dur, stops) {
  const kf = stops
    .map(([t, decl, tf]) => `${pct(t, dur)}{${decl}${tf ? `;animation-timing-function:${tf}` : ''}}`)
    .join('')
  return `@keyframes ${name}{${kf}}.${name}{animation:${name} ${dur}s linear infinite}`
}

/** Opacity windows on class `name`: shown in each [from, to), faded over `fade` seconds. */
function windows(name, dur, spans, fade = 0.15) {
  const stops = [[0, `opacity:${spans.some(([a]) => a <= 0) ? 1 : 0}`]]
  for (const [a, b] of spans) {
    const f = Math.min(fade, (b - a) / 2)
    if (a > 0) stops.push([a, 'opacity:0'], [a + f, 'opacity:1'])
    if (b < dur) stops.push([b - f, 'opacity:1'], [b, 'opacity:0'])
  }
  stops.push([dur, `opacity:${spans.some(([, b]) => b >= dur) ? 1 : 0}`])
  return anim(name, dur, stops)
}

// --- Type ------------------------------------------------------------------

/** Doto, set as outlines; each SVG gets its own glyph defs. */
class Doto {
  used = new Set()

  /** `y` is the baseline. */
  text(str, x, y, size, { anchor = 'start', cls = 'f-t' } = {}) {
    const k = size / DOTO.upm
    let pen = 0
    let uses = ''
    for (const ch of str) {
      const glyph = DOTO.glyph(ch)
      if (!glyph) throw new Error(`Doto has no glyph for "${ch}" (in "${str}")`)
      if (glyph.d) {
        this.used.add(ch)
        uses += `<use href="#g${ch.codePointAt(0)}"${pen ? ` x="${pen}"` : ''}/>`
      }
      pen += glyph.advance
    }
    const width = pen * k
    const left = anchor === 'middle' ? x - width / 2 : anchor === 'end' ? x - width : x
    return `<g class="${cls}" transform="translate(${f2(left)} ${f2(y)}) scale(${+k.toFixed(5)} ${-k.toFixed(5)})">${uses}</g>`
  }

  defs() {
    return [...this.used]
      .map((ch) => `<path id="g${ch.codePointAt(0)}" d="${DOTO.glyph(ch).d}"/>`)
      .join('\n')
  }
}

/** A run of `tspan`s from [text, class] pairs. */
const spans = (parts) => parts.map(([s, cls]) => `<tspan class="${cls}">${esc(s)}</tspan>`).join('')

/** Monospace text. `content` is plain text, or [text, class] pairs. */
function mono(x, y, content, size, cls, { anchor, spacing, length } = {}) {
  let a = ''
  if (anchor) a += ` text-anchor="${anchor}"`
  if (spacing) a += ` letter-spacing="${spacing}"`
  if (length) a += ` textLength="${f2(length)}" lengthAdjust="spacing"`
  const body = Array.isArray(content) ? spans(content) : esc(content)
  return `<text class="mono ${cls}" x="${f2(x)}" y="${f2(y)}" font-size="${size}"${a} xml:space="preserve">${body}</text>`
}

/** The UI label: mono, small, uppercase, tracked. */
const label = (x, y, str, cls = 'f-u', opts = {}) =>
  mono(x, y, str.toUpperCase(), 9.5, cls, { spacing: 1.2, ...opts })
const labelWidth = (str) => str.length * (9.5 * CELL + 1.2)

function wrap(text, max) {
  const lines = ['']
  for (const word of text.split(' ')) {
    const line = lines.at(-1)
    if (line && line.length + word.length + 1 > max) lines.push(word)
    else lines[lines.length - 1] = line ? `${line} ${word}` : word
  }
  return lines
}

// --- Pieces of the OS ------------------------------------------------------

function frame(w, h, glyphs, body, { title, css = '', defs = '', palette = paletteCss(NOIR) }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title).replace(/"/g, '&quot;')}">
<title>${esc(title)}</title>
<defs>
<clipPath id="screen"><rect width="${w}" height="${h}" rx="14"/></clipPath>
${glyphs ? glyphs.defs() : ''}
${defs}
</defs>
<style>${BASE_CSS}${palette}${css}</style>
<g clip-path="url(#screen)">
<rect width="${w}" height="${h}" class="f-b"/>
${body}
</g>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="13.5" fill="none" class="s-r"/>
</svg>
`
}

/** The menu bar: ABK, File / Extras / System, status, résumé, clock. */
function menuBar(G, W) {
  const H = 32
  const y = 20.5
  let s = `<rect width="${W}" height="${H}" class="f-b"/><path d="M0 ${H - 0.5}H${W}" class="s-r"/>`
  s += G.text('ABK', 14, 21.5, 15)
  s += `<path d="M58.5 0V${H}" class="s-r"/>`
  let x = 74
  for (const menu of [menus.file.label, menus.extras.label, menus.system.label]) {
    s += mono(x, y, menu, 12, 'f-t')
    x += menu.length * 7.2 + 22
  }
  const clock = W - 166
  s += `<path d="M${clock + 0.5} 0V${H}" class="s-r"/>`
  s += mono(W - 16, y, [['Tue 13 · 17:25 ', 'f-s'], ['IST', 'f-u']], 12, '', { anchor: 'end' })
  const resume = clock - 96
  s += `<path d="M${resume + 0.5} 0V${H}" class="s-r"/>`
  s += mono(resume + 16, y, `${labels.resume} ↓`, 12, 'f-s')
  const status = resume - 196
  s += `<path d="M${status + 0.5} 0V${H}" class="s-r"/>`
  s += `<rect class="breathe f-a" x="${status + 16}" y="12.5" width="7" height="7"/>`
  s += mono(status + 31, y, labels.status, 12, 'f-a')
  return s
}
const BREATHE_CSS = '@keyframes breathe{50%{opacity:.25}}.breathe{animation:breathe 2.4s ease-in-out infinite}'

/** The path bar under the menu bar on inner routes. */
function pathBar(W, file) {
  let s = `<rect width="${W}" height="30" class="f-b"/><path d="M0 29.5H${W}" class="s-r"/>`
  s += mono(24, 19.5, [['~/desktop/', 'f-u'], [file, 'f-t']], 11, '')
  s += label(W - 24, 19, labels.escBack, 'f-u', { anchor: 'end' })
  return s
}

/** One of the pixel cursors from public/cursors, inline. */
const cursor = (name) =>
  readFileSync(join(ROOT, 'public/cursors', `${name}.svg`), 'utf8')
    .trim()
    .replace(/^<svg[^>]*>|<\/svg>$/g, '')

// --- hero.svg: boot, then the desktop --------------------------------------

function hero() {
  const W = 960
  const H = 540
  const BAR = 32
  const D = 12
  const MID = BAR + (H - BAR) / 2
  const G = new Doto()
  let css = BREATHE_CSS

  // The counter runs Boot.tsx's own chase (per 60fps tick) over steps that
  // finish at these times; the screen opens once it passes 99.5.
  const T0 = 0.45
  const finished = [0, 0.3, 0.65, 1.1, 1.6]
  const samples = []
  let shown = 0
  let te = 0
  for (let f = 0; ; f++) {
    const t = f / 60
    const target = (finished.filter((d) => d <= t).length / finished.length) * 100
    shown += (target - shown) * 0.12 + (shown < target ? 0.4 : 0)
    shown = Math.min(shown, target)
    const value = Math.round(shown)
    if (f % 5 === 0 && value !== samples.at(-1)?.[1]) samples.push([T0 + t, value])
    if (shown > 99.5 && T0 + t > 0.9) {
      te = T0 + t
      break
    }
  }
  if (samples.at(-1)[0] >= te) samples.pop()
  samples.push([te, 100])

  // Desktop --------------------------------------------------------------
  let desk = ''
  const img = execFileSync('magick', [
    join(ROOT, 'public', desktop.portrait.src),
    '-resize',
    '740x',
    '-quality',
    '80',
    'webp:-',
  ])
  const pw = 370
  const ph = (pw * desktop.portrait.height) / desktop.portrait.width
  const px = (W - pw) / 2
  const py = 330 - ph
  desk += `<image href="data:image/webp;base64,${img.toString('base64')}" x="${f2(px)}" y="${f2(py)}" width="${pw}" height="${f2(ph)}" mask="url(#pfade)"/>`
  const defs = `<linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="pfade" maskUnits="userSpaceOnUse" x="${f2(px)}" y="${f2(py)}" width="${pw}" height="${f2(ph)}"><rect x="${f2(px)}" y="${f2(py)}" width="${pw}" height="${f2(ph)}" fill="url(#pf)"/></mask>`

  const role = desktop.role.toUpperCase()
  const roleW = role.length * (10 * CELL + 3) + 24
  desk += `<rect x="${f2(W / 2 - roleW / 2)}" y="339" width="${f2(roleW)}" height="18" class="f-b"/>`
  desk += mono(W / 2 + 1.5, 352, role, 10, 'f-s', { anchor: 'middle', spacing: 3 })

  // The name scrambles in from random glyphs, as ScrambleText does on the site.
  const name = desktop.name.toUpperCase()
  const NAME = 62
  const scrambleAt = te + 0.3
  const STEP = 0.11
  const SCRAMBLES = 5
  const rand = random(7)
  const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  for (let k = 0; k < SCRAMBLES; k++) {
    const resolved = Math.floor((k * name.length) / SCRAMBLES)
    const text = [...name]
      .map((ch, i) => (i < resolved || ch === ' ' ? ch : pool[Math.floor(rand() * pool.length)]))
      .join('')
    desk += `<g class="sc sc${k}">${G.text(text, W / 2, 412, NAME, { anchor: 'middle' })}</g>`
    css += windows(`sc${k}`, D, [[scrambleAt + k * STEP, scrambleAt + (k + 1) * STEP]], 0.01)
  }
  css += '.sc{opacity:0}'
  desk += `<g class="nm">${G.text(name, W / 2, 412, NAME, { anchor: 'middle' })}</g>`
  css += windows('nm', D, [[scrambleAt + SCRAMBLES * STEP, D]], 0.01)

  wrap(desktop.line, 70).forEach((line, i) => {
    desk += mono(W / 2, 438 + i * 16, line, 11, 'f-s', { anchor: 'middle' })
  })

  const buttons = [
    [`${labels.downloadResume} ↓`, true],
    [`${labels.github} ↗`, false],
    [`${labels.linkedin} ↗`, false],
  ].map(([text, primary]) => ({ text, primary, w: text.length * 6.6 + 26 }))
  let bx = W / 2 - (buttons.reduce((sum, b) => sum + b.w, 0) + 12 * (buttons.length - 1)) / 2
  for (const b of buttons) {
    desk += b.primary
      ? `<rect x="${f2(bx)}" y="468" width="${f2(b.w)}" height="26" class="f-a"/>`
      : `<rect x="${f2(bx + 0.5)}" y="468.5" width="${f2(b.w - 1)}" height="25" fill="none" class="s-u"/>`
    desk += mono(bx + b.w / 2, 485, b.text, 11, b.primary ? 'f-b' : 'f-t', { anchor: 'middle' })
    bx += b.w + 12
  }
  desk += label(W / 2, 520, desktop.education, 'f-u', { anchor: 'middle' })

  // The four apps, one per corner; hover turns the title red and shows ENTER.
  const corners = [
    [24, 58, false],
    [W - 24, 58, true],
    [24, 440, false],
    [W - 24, 440, true],
  ]
  const enter = `${desktop.enter} ↵`.toUpperCase()
  const appIcon = (app, [x, y, right], cls) => {
    const anchor = right ? 'end' : 'start'
    let s = G.text(app.number, x, y + 18, 22, { anchor, cls: 'f-a' })
    s += label(x, y + 38, app.file, 'f-u', { anchor })
    s += mono(x, y + 60, app.title, 17, cls, { anchor })
    return s
  }
  const hover = (app, corner) => {
    const [x, y, right] = corner
    const w = labelWidth(enter) + 12
    const cx = right ? x - w : x
    return (
      mono(x, y + 60, app.title, 17, 'f-a', { anchor: right ? 'end' : 'start' }) +
      `<rect x="${f2(cx)}" y="${y + 68}" width="${f2(w)}" height="17" class="f-a"/>` +
      label(cx + 7, y + 80, enter, 'f-b')
    )
  }
  apps.forEach((app, i) => (desk += appIcon(app, corners[i], 'f-t')))

  const H1 = [5.75, 7.3]
  const H2 = [8.55, 10.1]
  desk += `<g class="hv hv0">${hover(apps[0], corners[0])}</g>`
  desk += `<g class="hv hv1">${hover(apps[3], corners[3])}</g>`
  css += '.hv{opacity:0}' + windows('hv0', D, [H1], 0.08) + windows('hv1', D, [H2], 0.08)

  // Boot screen -----------------------------------------------------------
  let screen = ''
  screen += mono(24, BAR + 30, boot.title, 12, 'f-t')
  screen += mono(24, BAR + 48, boot.tty, 12, 'f-u')
  Object.values(boot.steps).forEach((step, i) => {
    screen += `<g class="bs${i}">${mono(24, BAR + 78 + i * 19, [[boot.ok, 'f-a'], [` ${step}`, 'f-s']], 12, '')}</g>`
    css += windows(`bs${i}`, D, [[T0 + finished[i], D]], 0.01)
  })
  samples.forEach(([t, value], i) => {
    const next = i < samples.length - 1 ? samples[i + 1][0] : D
    screen += `<g class="ct ct${i}">${G.text(String(value).padStart(3, '0'), 18, 470, 120)}</g>`
    css += windows(`ct${i}`, D, [[t, next]], 0.01)
  })
  css += '.ct{opacity:0}'
  screen += `<rect x="24" y="486" width="${W - 48}" height="4" class="f-r"/>`
  screen += `<rect class="bar fl f-a" x="24" y="486" width="${W - 48}" height="4"/>`
  css += anim('bar', D, [
    ...samples.map(([t, value]) => [t, `transform:scaleX(${value / 100})`]),
    [D, 'transform:scaleX(1)'],
  ])
  screen += label(24, 514, boot.skip, 'f-u')

  css += anim('bc', D, [
    [0, 'opacity:0'],
    [0.25, 'opacity:0'],
    [T0, 'opacity:1'],
    [te, 'opacity:1'],
    [te + 0.15, 'opacity:0'],
    [D, 'opacity:0'],
  ])
  const open = 'cubic-bezier(.7,0,.2,1)'
  const half = MID - BAR + 1
  css += anim('bt', D, [
    [0, 'opacity:1;transform:none'],
    [te, 'opacity:1;transform:none', open],
    [te + 0.55, `opacity:1;transform:translateY(-${half}px)`],
    [D, `opacity:1;transform:translateY(-${half}px)`],
  ])
  css += anim('bb', D, [
    [0, 'opacity:1;transform:none'],
    [te, 'opacity:1;transform:none', open],
    [te + 0.55, `opacity:1;transform:translateY(${half}px)`],
    [D, `opacity:1;transform:translateY(${half}px)`],
  ])
  css += anim('pw', D, [
    [0, 'opacity:1;transform:scaleX(0)', 'cubic-bezier(.22,1,.36,1)'],
    [0.225, 'opacity:1;transform:scaleX(1)', 'cubic-bezier(.22,1,.36,1)'],
    [0.5, 'opacity:0;transform:scaleX(1) scaleY(60)'],
    [D, 'opacity:0;transform:scaleX(1) scaleY(60)'],
  ])
  css += anim('sm', D, [
    [0, 'opacity:0'],
    [te, 'opacity:0'],
    [te + 0.01, 'opacity:.9'],
    [te + 0.4, 'opacity:0'],
    [D, 'opacity:0'],
  ])
  css += anim('cu', D, [
    [0, 'opacity:0'],
    [D - 0.6, 'opacity:0'],
    [D, 'opacity:1'],
  ])
  css += '.bc,.bt,.bb,.pw,.sm,.cu{opacity:0}'

  // The pointer visits Projects, then Contact.
  const move = 'cubic-bezier(.45,0,.2,1)'
  const at = (x, y, o = 1) => `opacity:${o};transform:translate(${x}px,${y}px)`
  css += anim('pt', D, [
    [0, at(640, 300, 0)],
    [4.3, at(640, 300, 0)],
    [4.5, at(640, 300), move],
    [5.7, at(70, 108)],
    [H1[1], at(70, 108), move],
    [8.5, at(904, 490)],
    [H2[1], at(904, 490)],
    [H2[1] + 0.3, at(904, 490, 0)],
    [D, at(904, 490, 0)],
  ])
  css += '.pt{opacity:0}'

  const body = `${desk}
<g class="bt"><rect x="0" y="${BAR}" width="${W}" height="${half}" class="f-b"/></g>
<g class="bb"><rect x="0" y="${MID - 1}" width="${W}" height="${half}" class="f-b"/></g>
<g class="bc">${screen}</g>
<g class="pw fb"><rect x="0" y="${MID - 1}" width="${W}" height="2" class="f-t"/></g>
<g class="sm"><rect x="0" y="${MID - 1}" width="${W}" height="2" class="f-t"/></g>
<g class="cu"><rect x="0" y="${BAR}" width="${W}" height="${H - BAR}" class="f-b"/></g>
${menuBar(G, W)}
<g class="pt"><g transform="scale(.75)">${cursor('arrow')}</g></g>`

  return frame(W, H, G, body, {
    title: `${site.os} boots: an [ ok ] log and a counter to 100, then the screen opens on the desktop: ${desktop.name}, four apps in the corners, the menu bar on top`,
    css,
    defs,
  })
}

// --- divider.svg -----------------------------------------------------------

function divider() {
  const W = 960
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 14" width="${W}" height="14" role="img" aria-label="">
<style>@keyframes run{from{transform:translateX(-${W / 2}px)}to{transform:translateX(${W / 2}px)}}.run{animation:run 6s steps(48,end) infinite}</style>
<path d="M0 7.5H${W}" stroke="${NOIR['text-muted']}" stroke-opacity=".6" stroke-dasharray="1 3"/>
<g class="run"><rect x="${W / 2 - 3}" y="4" width="6" height="6" fill="${NOIR.accent}"/></g>
</svg>
`
}

// --- work.svg: projects.vol, the draggable canvas ---------------------------

function work() {
  const W = 960
  const H = 520
  const D = 8
  const FRAMES = 16
  const FPS = 8
  const G = new Doto()
  let css = ''

  for (let k = 0; k < FRAMES; k++) {
    const p = (v) => `${+((v / FRAMES) * 100).toFixed(3)}%`
    const kf = k
      ? `0%{opacity:0}${p(k)}{opacity:1}${p(k + 1)}{opacity:0}100%{opacity:0}`
      : `0%{opacity:1}${p(1)}{opacity:0}100%{opacity:0}`
    css += `@keyframes af${k}{${kf}}.af${k}{animation:af${k} ${FRAMES / FPS}s step-end infinite}`
  }
  css = '.af{opacity:0}.af0{opacity:1}' + css

  /** The case's artwork, as FieldRenderer draws it, one <g> per frame. */
  const ascii = (id, x, y, cols, rows, cw, ch) => {
    const aspect = (cols * cw) / (rows * ch)
    const top = RAMP.length - 1
    const run = (str, row) => {
      const start = str.search(/\S/)
      if (start < 0) return ''
      const text = str.trimEnd().slice(start)
      return `<text x="${f2(x + start * cw)}" y="${f2(y + (row + 0.78) * ch)}" textLength="${f2(text.length * cw)}" lengthAdjust="spacing">${esc(text)}</text>`
    }
    let out = `<g class="mono" font-size="9" xml:space="preserve">`
    for (let k = 0; k < FRAMES; k++) {
      const field = fields[id](STILL_TIME + k / FPS, aspect, 2 / rows)
      let text = ''
      let accent = ''
      for (let row = 0; row < rows; row++) {
        let a = ''
        let b = ''
        for (let col = 0; col < cols; col++) {
          const v = field((((col + 0.5) / cols) * 2 - 1) * aspect, ((row + 0.5) / rows) * 2 - 1)
          if (v >= 1) {
            a += ' '
            b += RAMP[Math.max(1, Math.round(Math.min(1, v - 1) * top))]
          } else {
            a += RAMP[Math.round(Math.max(0, v) * top)]
            b += ' '
          }
        }
        text += run(a, row)
        accent += run(b, row)
      }
      out += `<g class="af af${k}"><g class="f-t">${text}</g><g class="f-a">${accent}</g></g>`
    }
    return `${out}</g>`
  }

  const tile = (project, i, x, y) => {
    const w = 236
    const h = 124
    const pad = 6
    const cols = 40
    const rows = 11
    let s = `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="none" class="s-r"/>`
    s += ascii(project.art, x + pad, y + pad, cols, rows, (w - 2 * pad) / cols, (h - 2 * pad) / rows)
    s += G.text(String(i + 1).padStart(2, '0'), x, y + h + 26, 15, { cls: 'f-a' })
    s += G.text(project.title.toUpperCase(), x + 30, y + h + 26, 18)
    s += mono(x, y + h + 44, project.kind, 10.5, 'f-u')
    return s
  }

  const spots = [
    [24, 134],
    [348, 148],
    [672, 128],
    [186, 340],
    [510, 326],
  ]
  const tiles = projects.map((p, i) => tile(p, i, ...spots[i])).join('\n')

  let head = pathBar(W, getFile('work'))
  head += G.text(workLabels.title.toUpperCase(), 24, 84, 40)
  head += mono(24, 106, workLabels.intro, 11.5, 'f-s')
  const views = [workLabels.canvas, workLabels.list].map((v) => v.toUpperCase())
  let vx = W - 24
  for (const [i, view] of [...views.entries()].reverse()) {
    const w = labelWidth(view) + 18
    vx -= w
    const on = i === 0
    head += `<rect x="${f2(vx + 0.5)}" y="70.5" width="${f2(w - 1)}" height="21" fill="none" class="${on ? 's-a' : 's-r'}"/>`
    head += label(vx + 9, 84.5, view, on ? 'f-a' : 'f-u')
    vx -= 6
  }
  head += label(vx - 6, 84.5, workLabels.views, 'f-u', { anchor: 'end' })

  // Drag left, let go (inertia), drag back.
  const ease = 'cubic-bezier(.45,0,.2,1)'
  const out = 'cubic-bezier(.22,1,.36,1)'
  const tx = (x) => `transform:translateX(${x}px)`
  css += anim('pan', D, [
    [0, tx(0)],
    [1.6, tx(0), ease],
    [2.8, tx(-70), out],
    [3.4, tx(-90)],
    [4.4, tx(-90), ease],
    [5.6, tx(-10), out],
    [6.2, tx(0)],
    [D, tx(0)],
  ])
  const hand = (x, y, o = 1) => `opacity:${o};transform:translate(${x}px,${y}px)`
  css += anim('hd', D, [
    [0, hand(600, 290, 0)],
    [1.2, hand(600, 290, 0)],
    [1.4, hand(600, 290)],
    [1.6, hand(600, 290), ease],
    [2.8, hand(530, 290)],
    [3.0, hand(530, 290, 0)],
    [4.0, hand(500, 300, 0)],
    [4.2, hand(500, 300)],
    [4.4, hand(500, 300), ease],
    [5.6, hand(580, 300)],
    [5.8, hand(580, 300, 0)],
    [D, hand(580, 300, 0)],
  ])
  css += '.hd{opacity:0}'

  const body = `${head}
<g clip-path="url(#canvas)"><g class="pan">${tiles}</g></g>
<g class="hd"><g transform="scale(.75)">${cursor('hand')}</g></g>`
  return frame(W, H, G, body, {
    title: `${workLabels.title}: ${projects.map((p) => p.title).join(', ')}, each with a generative ASCII artwork, on a canvas being dragged`,
    css,
    defs: `<clipPath id="canvas"><rect x="0" y="122" width="${W}" height="${H - 122}"/></clipPath>`,
  })
}

const getFile = (id) => apps.find((a) => a.id === id).file

// --- timeline.svg: timeline.log, the git graph ------------------------------

function timeline() {
  const W = 960
  const H = 420
  const G = new Doto()
  const LEFT = 92
  const STEP = (W - LEFT - 40) / (commits.length - 1)
  const TOP = 152
  const LANE = 30
  const SIZE = 7
  const laneY = (b) => TOP + branches.findIndex((x) => x.id === b) * LANE
  const cx = (i) => LEFT + i * STEP
  const head = commits.findIndex((c) => c.title.startsWith('HEAD'))
  const last = commits.length - 1
  const mainY = laneY('main')
  const tAt = (i) => 0.5 + i * 0.95
  const D = Math.ceil(tAt(last) + 2)
  let css = ''

  // Same shapes as GitGraph.tsx: side branches fork from main and merge at HEAD.
  const lanes = branches
    .filter((b) => b.id !== 'main')
    .map((b) => {
      const first = commits.findIndex((c) => c.branch === b.id)
      const y = laneY(b.id)
      const x0 = cx(first) - STEP * 0.55
      return `<path d="M${f2(x0)} ${mainY}L${f2(x0 + STEP * 0.3)} ${y}L${f2(cx(head) - STEP * 0.35)} ${y}L${f2(cx(head))} ${mainY}"/>`
    })
  const lines = `<path d="M${cx(0)} ${mainY}H${f2(cx(head))}"/><path d="M${f2(cx(head))} ${mainY}H${f2(cx(last))}" stroke-dasharray="4 5"/>${lanes.join('')}`
  const rit = commits.findIndex((c) => c.href === '/work/rit-digital-twin')
  const designathon = commits.findIndex((c) => c.title.includes('Designathon'))

  let graph = ''
  for (const b of branches) graph += mono(24, laneY(b.id) + 4, b.label, 11, 'f-u')
  graph += `<g fill="none" stroke-width="1.5"><g class="s-r">${lines}</g><g clip-path="url(#drawn)"><g class="s-u">${lines}</g><path d="M${f2(cx(rit))} ${laneY('build')}L${f2(cx(designathon))} ${laneY('wins')}" class="s-a"/></g></g>`
  commits.forEach((c, i) => {
    const x = cx(i)
    const y = laneY(c.branch)
    const cls = i === head ? 'f-a s-a' : c.future ? 'f-b s-u' : 'f-b s-t'
    graph += `<rect x="${f2(x - SIZE / 2)}" y="${y - SIZE / 2}" width="${SIZE}" height="${SIZE}" stroke-width="1.5" class="${cls}"${c.future ? ' stroke-dasharray="2 2"' : ''}/>`
    graph += `<g class="on on${i}"><rect x="${f2(x - SIZE)}" y="${y - SIZE}" width="${SIZE * 2}" height="${SIZE * 2}" fill="none" stroke-width="1.5" class="s-a"/><rect x="${f2(x - SIZE / 2)}" y="${y - SIZE / 2}" width="${SIZE}" height="${SIZE}" stroke-width="1.5" class="f-a s-a"/></g>`
  })

  // `git show` for the active commit.
  let panel = `<path d="M24 ${H - 148.5}H${W - 24}" class="s-r"/>`
  commits.forEach((c, i) => {
    const y = H - 120
    const detail = wrap(c.detail, 128)
    if (detail.length > 3) throw new Error(`timeline detail too long for the README: ${c.hash}`)
    let s = mono(
      24,
      y,
      [
        ['commit ', 'f-u'],
        [c.hash, 'f-a'],
        [` (${c.branch})`, 'f-u'],
        [`  ${c.date}`, 'f-s'],
      ],
      11,
      '',
    )
    s += G.text(c.title.toUpperCase(), 24, y + 34, 22)
    detail.forEach((line, k) => (s += mono(24, y + 60 + k * 17, line, 11.5, 'f-s')))
    panel += `<g class="pn pn${i}">${s}</g>`
  })

  const spansFor = (i) => [[tAt(i) - 0.05, i < last ? tAt(i + 1) - 0.05 : D]]
  commits.forEach((_, i) => {
    css += windows(`on${i}`, D, spansFor(i), 0.1)
    css += windows(`pn${i}`, D, spansFor(i), 0.12)
  })
  css += `.on,.pn{opacity:0}.on${head},.pn${head}{opacity:1}`

  const reach = (i) => +((cx(i) + SIZE + 4) / W).toFixed(4)
  const draw = 'cubic-bezier(.22,1,.36,1)'
  const stops = [
    [0, 'transform:scaleX(0)', draw],
    [tAt(0), `transform:scaleX(${reach(0)})`],
  ]
  for (let i = 1; i <= last; i++) {
    stops.push([tAt(i) - 0.45, `transform:scaleX(${reach(i - 1)})`, draw], [tAt(i), `transform:scaleX(${reach(i)})`])
  }
  stops.push([D, `transform:scaleX(${reach(last)})`])
  css += anim('dr', D, stops)

  let top = pathBar(W, getFile('timeline'))
  top += G.text(timelineLabels.title.toUpperCase(), 24, 84, 40)
  top += mono(24, 108, [[timelineLabels.prompt, 'f-a'], [` ${timelineLabels.logCommand}`, 'f-t']], 11.5, '')

  return frame(W, H, G, `${top}\n${graph}\n${panel}`, {
    title: `${timelineLabels.title}: a git graph with main, build, wins and clubs branches, stepping through ${commits.length} commits from ${commits[0].date} to ${commits[last].date}`,
    css,
    defs: `<clipPath id="drawn"><rect class="dr" x="0" y="${TOP - 20}" width="${W}" height="${LANE * 3 + 40}"/></clipPath>`,
  })
}

// --- extras.svg: the terminal and Lights Out, with phosphor switches --------

function extras() {
  const W = 960
  const H = 396
  const D = 17
  const G = new Doto()
  const SIZE = 11.5
  const CW = SIZE * CELL
  let css = ''

  // The whole image changes phosphor when the terminal says so.
  const switches = [
    [0, 'noir'],
    [3.4, 'amber'],
    [11.7, 'green'],
    [13.8, 'noir'],
  ]
  let palette = ''
  for (const [k, role] of Object.entries(ROLES)) {
    for (const [cls, prop] of [
      [`f-${k}`, 'fill'],
      [`s-${k}`, 'stroke'],
    ]) {
      const stops = []
      switches.forEach(([t, id], i) => {
        if (i) stops.push([t - 0.002, `${prop}:${PHOSPHOR[switches[i - 1][1]][role]}`])
        stops.push([t, `${prop}:${PHOSPHOR[id][role]}`])
      })
      stops.push([D, `${prop}:${PHOSPHOR[switches.at(-1)[1]][role]}`])
      palette += `${anim(cls, D, stops)}.${cls}{${prop}:${NOIR[role]}}`
    }
  }

  const win = (x, y, w, h, title) =>
    `<rect x="${x + 4}" y="${y + 4}" width="${w}" height="${h}" class="f-r"/>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="f-f"/>` +
    `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" fill="none" class="s-u"/>` +
    `<path d="M${x} ${y + 28.5}H${x + w}" class="s-r"/>` +
    label(x + 12, y + 18, title, 'f-u') +
    label(x + w - 12, y + 18, terminal.close, 'f-u', { anchor: 'end' })

  // Terminal ---------------------------------------------------------------
  const TX = 24
  const TY = 22
  let term = win(TX, TY, 560, 352, terminal.title)
  const x0 = TX + 16
  let row = 0
  let n = 0
  const lineY = () => TY + 52 + row++ * 17
  const show = (at, inner) => {
    const cls = `tl${n++}`
    css += windows(cls, D, [[at, D]], 0.01)
    return `<g class="${cls}">${inner}</g>`
  }
  const out = (at, text, cls = 'f-s') => {
    term += show(at, mono(x0, lineY(), text, SIZE, cls))
  }
  const cmd = (at, command) => {
    const y = lineY()
    const from = at + 0.2
    const to = from + 0.09 * command.length
    const cx = x0 + (terminal.prompt.length + 1) * CW
    const w = command.length * CW + 2
    const cover = `tc${n}`
    css += anim(cover, D, [
      [0, 'opacity:1;transform:none'],
      [from, 'opacity:1;transform:none', `steps(${command.length},end)`],
      [to, 'opacity:1;transform:scaleX(0)'],
      [D, 'opacity:1;transform:scaleX(0)'],
    ])
    css += `.${cover}{opacity:0}`
    term += show(
      at,
      mono(x0, y, terminal.prompt, SIZE, 'f-a', { length: terminal.prompt.length * CW }) +
        mono(cx, y, command, SIZE, 'f-t', { length: command.length * CW }) +
        `<g class="${cover} fr"><rect x="${f2(cx - 1)}" y="${y - 12}" width="${f2(w)}" height="16" class="f-f"/></g>`,
    )
    return to
  }

  out(0, terminal.welcome[0].replace(/`/g, ''), 'f-u')
  let t = cmd(0.3, 'whoami') + 0.25
  out(t, `${site.name} (${site.handle})`)
  for (const line of wrap(desktop.line, 74)) out(t, line)
  out(t, `${site.status} · ${site.location}`)
  t = cmd(2.2, 'theme amber')
  out(switches[1][0], terminal.themeSet('amber'))
  t = cmd(4.4, 'lights') + 0.15
  out(t, terminal.lights)
  cmd(10.6, 'theme green')
  out(switches[2][0], terminal.themeSet('green'))
  cmd(12.7, 'theme noir')
  out(switches[3][0], terminal.themeSet('noir'))
  const y = lineY()
  term += show(
    14.6,
    mono(x0, y, terminal.prompt, SIZE, 'f-a', { length: terminal.prompt.length * CW }) +
      `<g class="blink"><rect x="${f2(x0 + (terminal.prompt.length + 1) * CW)}" y="${y - 10}" width="7" height="13" class="f-a"/></g>`,
  )
  css += '@keyframes blink{50%{opacity:0}}.blink{animation:blink 1s steps(1,end) infinite}'

  // Lights Out ---------------------------------------------------------------
  const LX = 608
  let game = win(LX, TY, 328, 352, lightsOut.file)
  const box = { x: LX + 16, y: TY + 44, w: 296, h: 105 }
  game += `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" class="f-b"/><rect x="${box.x + 0.5}" y="${box.y + 0.5}" width="${box.w - 1}" height="${box.h - 1}" fill="none" class="s-r"/>`
  const lit = [5.6, 6.15, 6.7, 7.25, 7.8]
  const OUT_AT = 8.9
  const RESULT = 9.25
  lit.forEach((on, i) => {
    const x = box.x + 13 + i * 56
    const top = box.y + 14
    game += `<rect x="${x}" y="${top}" width="46" height="77" class="f-f"/><rect x="${x + 0.5}" y="${top + 0.5}" width="45" height="76" fill="none" class="s-r"/>`
    for (const cy of [top + 21, top + 56]) {
      game += `<circle cx="${x + 23}" cy="${cy}" r="14" class="f-r"/>`
      game += `<g class="li li${i}"><circle cx="${x + 23}" cy="${cy}" r="14" class="f-a"/></g>`
    }
    css += windows(`li${i}`, D, [[on, OUT_AT]], 0.03)
  })
  game += label(box.x, box.y + box.h + 22, lightsOut.controls, 'f-u')

  // A demo run: 0.214s is under the 250ms line, so the verdict is the second one.
  const reaction = 214
  const verdict = lightsOut.verdicts.find(([ceiling]) => reaction < ceiling)[1]
  const states = [
    [lightsOut.start, 0, lit[0]],
    [lightsOut.wait, lit[0], OUT_AT],
    [lightsOut.go, OUT_AT, RESULT],
    [`${(reaction / 1000).toFixed(3)}s`, RESULT, D],
  ]
  states.forEach(([text, a, b], i) => {
    game += `<g class="st st${i}">${G.text(text, box.x, TY + 238, 32)}</g>`
    css += windows(`st${i}`, D, [[a, b]], 0.01)
  })
  game += `<g class="st st4">${mono(box.x, TY + 264, [[verdict, 'f-s'], [`  ${lightsOut.newBest}`, 'f-a']], SIZE, '')}</g>`
  css += windows('st4', D, [[RESULT, D]], 0.01)
  const bestY = TY + 330
  game += `<g class="st st5">${mono(box.x + box.w, bestY, [[`${lightsOut.best.toUpperCase()}  `, 'f-u'], [lightsOut.noBest, 'f-t']], 10.5, '', { anchor: 'end' })}</g>`
  game += `<g class="st st6">${mono(box.x + box.w, bestY, [[`${lightsOut.best.toUpperCase()}  `, 'f-u'], [`${(reaction / 1000).toFixed(3)}s`, 'f-t']], 10.5, '', { anchor: 'end' })}</g>`
  css += windows('st5', D, [[0, RESULT]], 0.01) + windows('st6', D, [[RESULT, D]], 0.01)
  css += '.st{opacity:0}.st1,.st5{opacity:1}'

  return frame(W, H, G, `${term}\n${game}`, {
    title: `Extras: the terminal answers whoami, switches the phosphor to amber, green and back to noir, and starts Lights Out, an F1 start reaction game`,
    css,
    palette,
  })
}

// --- footer.svg: the screensaver ---------------------------------------------

function footer() {
  const W = 960
  const H = 250
  const css =
    '@keyframes bc{50%{opacity:.55;transform:scale(.86)}}.br{animation:bc 4.8s ease-in-out infinite}'
  const body =
    `<g class="br fb"><circle cx="${W / 2}" cy="104" r="56" class="f-a"/></g>` +
    label(W / 2, 218, screensaver.wake, 'f-u', { anchor: 'middle' })
  return frame(W, H, null, body, {
    title: `${site.os} asleep: one breathing red circle. ${screensaver.wake}.`,
    css,
  })
}

// ---------------------------------------------------------------------------

const files = {
  'hero.svg': hero(),
  'divider.svg': divider(),
  'work.svg': work(),
  'timeline.svg': timeline(),
  'extras.svg': extras(),
  'footer.svg': footer(),
}
for (const [file, svg] of Object.entries(files)) {
  writeFileSync(join(OUT, file), svg)
  console.log(`${file.padEnd(14)} ${(Buffer.byteLength(svg) / 1024).toFixed(0).padStart(4)} KB`)
}
