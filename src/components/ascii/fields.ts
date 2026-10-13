/**
 * Generative artworks for the case files. Each is a field: for a time `t`, the
 * area's aspect ratio and the height of one cell, it returns a function from a
 * point to a brightness. Points run y -1 (top) to 1 (bottom) and x -aspect to
 * aspect, so circles stay round. Values of 1 and over are drawn in the accent
 * colour (see drawValues). Abstract on purpose: none of them depicts the product.
 */
export type FieldFrame = (x: number, y: number) => number;
export type Field = (t: number, aspect: number, cell: number) => FieldFrame;
export type FieldId = "voice" | "field" | "campus" | "city" | "infinity";

const TAU = Math.PI * 2;

function frac(v: number) {
  return v - Math.floor(v);
}

/** Distance from a point to the nearest line of a grid with spacing 1/k. */
function gridDistance(v: number, k: number) {
  return Math.abs(frac(v * k + 0.5) - 0.5) / k;
}

function segmentDistance(px: number, py: number, s: number[]) {
  const [ax, ay, bx, by] = s;
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy || 1;
  const h = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len));
  return Math.hypot(px - ax - dx * h, py - ay - dy * h);
}

/** CHENG: one circle that breathes, a voice line inside, a point running the ring. */
const voice: Field = (t, aspect, cell) => {
  const breath = 0.5 + 0.5 * Math.sin(t * 2.4);
  const R = 0.66 + 0.035 * breath;
  const inner = R - 0.1;
  const width = Math.max(0.03, cell * 0.5);
  const spin = t * 0.9;
  return (x, y) => {
    const r = Math.hypot(x, y);
    const ring = Math.exp(-(((r - R) / width) ** 2));
    const halo = Math.exp(-(((r - R) / 0.24) ** 2)) * (0.14 + 0.14 * breath);
    let ang = Math.atan2(y, x) - spin;
    ang = Math.atan2(Math.sin(ang), Math.cos(ang));
    const runner = Math.exp(-(ang * ang) / 0.03) * ring;
    if (runner > 0.45) return 1 + runner;
    let wave = 0;
    if (r < inner && Math.abs(x) < inner) {
      const env = Math.cos(((x / inner) * Math.PI) / 2) ** 2;
      const wy = env * 0.24 * Math.sin(x * 9 - t * 5) * (0.55 + 0.45 * Math.sin(x * 3 + t * 1.7));
      wave = Math.exp(-(((y - wy) / width) ** 2)) * 0.85;
    }
    return Math.max(ring * 0.95, halo, wave);
  };
};

/** FarmSync: furrows running to a horizon, seasons rolling in, twelve qubits overhead. */
const field: Field = (t, aspect, cell) => {
  const horizon = -0.05;
  const active = Math.floor(t * 1.6) % 12;
  const spread = Math.min(aspect * 0.78, 1.5);
  const qubits = Array.from({ length: 12 }, (_, i) => {
    const th = Math.PI * (0.08 + (0.84 * i) / 11);
    return [Math.cos(th) * spread, horizon - 0.16 - Math.sin(th) * 0.62];
  });
  const dot = Math.max(0.055, cell * 0.65);
  return (x, y) => {
    let v = 0;
    if (y > horizon) {
      const depth = y - horizon;
      if (depth < cell * 0.5) return 0.45;
      const z = 1 / (depth + 0.05);
      const furrow = Math.pow(0.5 + 0.5 * Math.cos(x * z * 0.9 * TAU * 0.25), 6);
      const season = 0.5 + 0.5 * Math.sin(z * 1.4 - t * 1.6);
      v = furrow * (0.35 + 0.6 * season) * Math.min(1, depth * 4);
    }
    for (let i = 0; i < 12; i++) {
      const d = Math.hypot(x - qubits[i][0], y - qubits[i][1]);
      if (d < dot) return i === active ? 2 : 0.9;
      if (d < dot * 1.9) v = Math.max(v, 0.2);
    }
    return v;
  };
};

/** RIT Digital Twin: three wireframe blocks turning on a ground grid. */
const campus: Field = (t, aspect, cell) => {
  const theta = t * 0.28;
  const phi = 0.5;
  const scale = Math.min(0.62, aspect * 0.42);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const project = (X: number, Y: number, Z: number) => {
    const x1 = X * cosT - Z * sinT;
    const z1 = X * sinT + Z * cosT;
    const y1 = Y * cosP - z1 * sinP;
    return [x1 * scale * 1.25, -y1 * scale * 1.25 + 0.42];
  };
  const blocks = [
    [-0.55, -0.15, 0.32, 0.32, 1.25],
    [0.15, 0.2, 0.42, 0.3, 0.7],
    [0.62, -0.35, 0.28, 0.36, 0.45],
  ];
  const segments: number[][] = [];
  const roof: number[][] = [];
  for (const [cx, cz, w, d, h] of blocks) {
    const corners = [
      [cx - w, cz - d],
      [cx + w, cz - d],
      [cx + w, cz + d],
      [cx - w, cz + d],
    ];
    for (let i = 0; i < 4; i++) {
      const [ax, az] = corners[i];
      const [bx, bz] = corners[(i + 1) % 4];
      segments.push([...project(ax, 0, az), ...project(bx, 0, bz)]);
      (h > 1 ? roof : segments).push([...project(ax, h, az), ...project(bx, h, bz)]);
      segments.push([...project(ax, 0, az), ...project(ax, h, az)]);
    }
  }
  const grid: number[][] = [];
  for (let i = -3; i <= 3; i++) {
    const g = i * 0.36;
    grid.push([...project(g, 0, -1.1), ...project(g, 0, 1.1)]);
    grid.push([...project(-1.1, 0, g), ...project(1.1, 0, g)]);
  }
  const width = Math.max(0.022, cell * 0.42);
  return (x, y) => {
    let best = Infinity;
    for (const s of roof) best = Math.min(best, segmentDistance(x, y, s));
    if (best < width * 1.2) return 1 + Math.exp(-((best / width) ** 2));
    for (const s of segments) best = Math.min(best, segmentDistance(x, y, s));
    let v = Math.exp(-((best / width) ** 2)) * 0.95;
    if (v < 0.3) {
      let g = Infinity;
      for (const s of grid) g = Math.min(g, segmentDistance(x, y, s));
      v = Math.max(v, Math.exp(-((g / width) ** 2)) * 0.3);
    }
    return v;
  };
};

/** Sevagan: a street grid with reports landing as pins and rippling out. */
const city: Field = (t, aspect, cell) => {
  const spread = Math.min(aspect, 1.7);
  const pins = [
    [-0.62, -0.32],
    [-0.2, 0.42],
    [0.3, -0.5],
    [0.72, 0.22],
    [0.08, 0.02],
  ].map(([px, py]) => [px * spread, py]);
  const angle = 0.32;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const head = Math.max(0.05, cell * 0.6);
  const width = Math.max(0.02, cell * 0.4);
  return (x, y) => {
    const rx = x * cosA - y * sinA;
    const ry = x * sinA + y * cosA;
    const street = Math.min(gridDistance(rx, 1.5), gridDistance(ry, 1.5));
    let v = street < width * 0.8 ? 0.2 : 0;
    for (let i = 0; i < pins.length; i++) {
      const d = Math.hypot(x - pins[i][0], y - pins[i][1]);
      if (d < head) return i === 0 ? 2 : 1;
      const phase = frac(t * 0.32 + i * 0.23);
      const ripple = Math.exp(-(((d - phase * 0.55) / width) ** 2)) * (1 - phase);
      if (i === 0 && ripple > 0.4) return 1 + ripple;
      v = Math.max(v, ripple * 0.9);
    }
    return v;
  };
};

/** Infinitus: a lemniscate with a point tracing it, on a faint plus grid. */
const infinity: Field = (t, aspect, cell) => {
  const A = Math.min(aspect * 0.82, 1.65);
  const A2 = A * A;
  const trail = Array.from({ length: 8 }, (_, k) => {
    const s = t * 0.85 - k * 0.11;
    const den = 1 + Math.sin(s) ** 2;
    return [(A * Math.cos(s)) / den, (A * Math.sin(s) * Math.cos(s)) / den];
  });
  const width = Math.max(0.022, cell * 0.45);
  const dot = Math.max(0.05, cell * 0.7);
  return (x, y) => {
    for (let k = 0; k < trail.length; k++) {
      const d = Math.hypot(x - trail[k][0], y - trail[k][1]);
      if (d < dot * (1 - k * 0.08)) return 1 + (1 - k / trail.length);
    }
    const r2 = x * x + y * y;
    const f = r2 * r2 - A2 * (x * x - y * y);
    const gx = 4 * x * r2 - 2 * A2 * x;
    const gy = 4 * y * r2 + 2 * A2 * y;
    const d = Math.abs(f) / (Math.hypot(gx, gy) + 1e-4);
    let v = Math.exp(-((d / width) ** 2)) * 0.9;
    const px = gridDistance(x, 2.5);
    const py = gridDistance(y, 2.5);
    if ((px < width * 0.6 && py < cell * 0.9) || (py < width * 0.6 && px < cell * 1.4)) {
      v = Math.max(v, 0.22);
    }
    return v;
  };
};

export const fields: Record<FieldId, Field> = { voice, field, campus, city, infinity };
