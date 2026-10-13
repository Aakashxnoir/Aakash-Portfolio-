// A small TrueType reader, so the README images can set Doto as outlines.
// GitHub shows SVGs as plain images, which cannot load web fonts.

import { readFileSync } from 'node:fs'

/** Loads a .ttf (glyf outlines) and returns its glyphs as SVG path data in font units, y up. */
export function loadFont(file) {
  const b = readFileSync(file)
  const tables = {}
  for (let i = 0; i < b.readUInt16BE(4); i++) {
    const o = 12 + i * 16
    tables[b.toString('latin1', o, o + 4)] = b.readUInt32BE(o + 8)
  }
  const upm = b.readUInt16BE(tables.head + 18)
  const longLoca = b.readInt16BE(tables.head + 50) === 1
  const metrics = b.readUInt16BE(tables.hhea + 34)
  const advance = (g) => b.readUInt16BE(tables.hmtx + 4 * Math.min(g, metrics - 1))
  const loca = (g) =>
    longLoca ? b.readUInt32BE(tables.loca + 4 * g) : b.readUInt16BE(tables.loca + 2 * g) * 2
  const lookup = cmap(b, tables.cmap)

  function points(g) {
    const start = loca(g)
    if (start === loca(g + 1)) return []
    const at = tables.glyf + start
    const count = b.readInt16BE(at)
    return count < 0 ? composite(at + 10) : simple(at, count)
  }

  function simple(at, count) {
    const ends = Array.from({ length: count }, (_, i) => b.readUInt16BE(at + 10 + 2 * i))
    let p = at + 12 + 2 * count + b.readUInt16BE(at + 10 + 2 * count)
    const n = ends[count - 1] + 1
    const flags = []
    while (flags.length < n) {
      const f = b[p++]
      flags.push(f)
      if (f & 8) for (let r = b[p++]; r > 0; r--) flags.push(f)
    }
    const coords = (short, same) => {
      let v = 0
      return flags.map((f) => {
        if (f & short) {
          const d = b[p++]
          v += f & same ? d : -d
        } else if (!(f & same)) {
          v += b.readInt16BE(p)
          p += 2
        }
        return v
      })
    }
    const xs = coords(2, 16)
    const ys = coords(4, 32)
    const contours = []
    let first = 0
    for (const end of ends) {
      contours.push(
        xs.slice(first, end + 1).map((x, i) => ({ x, y: ys[first + i], on: flags[first + i] & 1 })),
      )
      first = end + 1
    }
    return contours
  }

  function composite(p) {
    const out = []
    for (;;) {
      const flags = b.readUInt16BE(p)
      const glyph = b.readUInt16BE(p + 2)
      p += 4
      let dx, dy
      if (flags & 1) {
        dx = b.readInt16BE(p)
        dy = b.readInt16BE(p + 2)
        p += 4
      } else {
        dx = b.readInt8(p)
        dy = b.readInt8(p + 1)
        p += 2
      }
      const f2 = () => {
        const v = b.readInt16BE(p) / 16384
        p += 2
        return v
      }
      let [xx, xy, yx, yy] = [1, 0, 0, 1]
      if (flags & 8) xx = yy = f2()
      else if (flags & 0x40) [xx, yy] = [f2(), f2()]
      else if (flags & 0x80) [xx, xy, yx, yy] = [f2(), f2(), f2(), f2()]
      for (const c of points(glyph)) {
        out.push(c.map((q) => ({ x: xx * q.x + yx * q.y + dx, y: xy * q.x + yy * q.y + dy, on: q.on })))
      }
      if (!(flags & 0x20)) return out
    }
  }

  const cache = new Map()
  return {
    upm,
    /** `{ d, advance }` for a character, or null when the font has no glyph for it. */
    glyph(ch) {
      if (!cache.has(ch)) {
        const g = lookup(ch.codePointAt(0))
        cache.set(ch, g ? { d: points(g).map(contourPath).join(''), advance: advance(g) } : null)
      }
      return cache.get(ch)
    },
  }
}

/** Quadratic TrueType contour to path data, with the implied on-curve midpoints. */
function contourPath(pts) {
  if (!pts.length) return ''
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: 1 })
  let start = pts.findIndex((p) => p.on)
  const ring = start < 0 ? [mid(pts.at(-1), pts[0]), ...pts] : [...pts.slice(start), ...pts.slice(0, start)]
  const n = (v) => Math.round(v)
  let d = `M${n(ring[0].x)} ${n(ring[0].y)}`
  let ctrl = null
  for (const p of [...ring.slice(1), ring[0]]) {
    if (p.on) {
      d += ctrl ? `Q${n(ctrl.x)} ${n(ctrl.y)} ${n(p.x)} ${n(p.y)}` : `L${n(p.x)} ${n(p.y)}`
      ctrl = null
    } else {
      if (ctrl) {
        const m = mid(ctrl, p)
        d += `Q${n(ctrl.x)} ${n(ctrl.y)} ${n(m.x)} ${n(m.y)}`
      }
      ctrl = p
    }
  }
  return `${d}Z`
}

/** Character code to glyph index, from the format 4 (BMP) cmap subtable. */
function cmap(b, at) {
  let sub = 0
  for (let i = 0; i < b.readUInt16BE(at + 2); i++) {
    const r = at + 4 + i * 8
    const o = at + b.readUInt32BE(r + 4)
    if (b.readUInt16BE(o) === 4) sub = o
  }
  if (!sub) throw new Error('font has no format 4 cmap')
  const segs = b.readUInt16BE(sub + 6)
  const ends = sub + 14
  const starts = ends + segs + 2
  const deltas = starts + segs
  const ranges = deltas + segs
  return (code) => {
    for (let i = 0; i < segs; i += 2) {
      if (code > b.readUInt16BE(ends + i)) continue
      const first = b.readUInt16BE(starts + i)
      if (code < first) return 0
      const delta = b.readUInt16BE(deltas + i)
      const range = b.readUInt16BE(ranges + i)
      if (!range) return (code + delta) & 0xffff
      const g = b.readUInt16BE(ranges + i + range + 2 * (code - first))
      return g ? (g + delta) & 0xffff : 0
    }
    return 0
  }
}
