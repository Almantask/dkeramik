// Procedural shapes for the hand-painted poppy scene.
// Everything is seeded, so the static export renders identical paths every build.

export type Pt = [number, number];

/** Small deterministic PRNG (mulberry32) returning floats in [0, 1). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through the points, as cubic Bézier path data. */
export function smoothPath(pts: Pt[], closed = true): string {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])},${r1(pts[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r1(c1[0])},${r1(c1[1])} ${r1(c2[0])},${r1(c2[1])} ${r1(p2[0])},${r1(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

const polar = (r: number, deg: number): Pt => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};

/**
 * A poppy petal's silhouette: a broad ruffled fan opening from the origin towards
 * `angle`. `squash` flattens it vertically to fake the cup seen at three-quarter view.
 */
export function petalPath(
  angle: number,
  spread: number,
  length: number,
  rnd: () => number,
  squash = 1,
): string {
  const arc: Pt[] = [];
  const steps = 9;
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const r = length * (0.86 + 0.14 * Math.sin(u * Math.PI)) * (1 + 0.07 * (rnd() * 2 - 1));
    arc.push(polar(r, angle - spread + 2 * spread * u));
  }
  const pts: Pt[] = [
    [0, 0],
    polar(length * 0.42, angle - spread * 0.7),
    ...arc,
    polar(length * 0.42, angle + spread * 0.7),
  ];
  return smoothPath(pts.map(([x, y]) => [x, y * squash]));
}

/** Point on the bent midrib of a leaf, plus the unit normal there. */
function midrib(base: Pt, tip: Pt, bend: number, t: number) {
  const [dx, dy] = [tip[0] - base[0], tip[1] - base[1]];
  const len = Math.hypot(dx, dy);
  const [ux, uy] = [dx / len, dy / len];
  const [nx, ny] = [-uy, ux];
  const off = bend * 4 * t * (1 - t);
  return { p: [base[0] + dx * t + nx * off, base[1] + dy * t + ny * off] as Pt, n: [nx, ny] as Pt };
}

/** A toothed, lobed poppy leaf from `base` to `tip`. */
export function leafPath(
  base: Pt,
  tip: Pt,
  width: number,
  lobes: number,
  bend: number,
  rnd: () => number,
): string {
  const steps = lobes * 4 + 4;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const { p, n } = midrib(base, tip, bend, t);
    const envelope = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 0.85);
    const wl = width * envelope * (0.66 + 0.34 * Math.abs(Math.sin(lobes * Math.PI * t))) * (0.88 + 0.24 * rnd());
    const wr = width * envelope * (0.66 + 0.34 * Math.abs(Math.sin(lobes * Math.PI * t + 1.1))) * (0.88 + 0.24 * rnd());
    left.push([p[0] + n[0] * wl, p[1] + n[1] * wl]);
    right.push([p[0] - n[0] * wr, p[1] - n[1] * wr]);
  }
  return smoothPath([base, ...left, tip, ...right.reverse()]);
}

/** The leaf's midrib as an open path (for the ink vein). */
export function midribPath(base: Pt, tip: Pt, bend: number, reach = 0.85): string {
  const pts: Pt[] = [0, 0.3, 0.6, reach].map((t) => midrib(base, tip, bend, t).p);
  return smoothPath(pts, false);
}

/** A loose hand-drawn line through the points, jittered a little. */
export function brushLine(pts: Pt[], rnd: () => number, jitter = 2): string {
  return smoothPath(
    pts.map(([x, y]) => [x + (rnd() * 2 - 1) * jitter, y + (rnd() * 2 - 1) * jitter]),
    false,
  );
}

/** A stroke along `spine` whose width at each point is `widthAt(t)`, t running 0 → 1. */
export function strokePath(spine: Pt[], widthAt: (t: number) => number): string {
  const n = spine.length;
  const left: Pt[] = [];
  const right: Pt[] = [];
  spine.forEach(([x, y], i) => {
    const a = spine[Math.max(0, i - 1)];
    const b = spine[Math.min(n - 1, i + 1)];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    const [nx, ny] = [-(b[1] - a[1]) / len, (b[0] - a[0]) / len];
    const half = widthAt(i / (n - 1)) / 2;
    left.push([x + nx * half, y + ny * half]);
    right.push([x - nx * half, y - ny * half]);
  });
  return smoothPath([...left, ...right.reverse()]);
}

/** A stem painted as one stroke that thins from `w0` at the first point to `w1` at the last. */
export function taperPath(spine: Pt[], w0: number, w1: number): string {
  return strokePath(spine, (t) => w0 + (w1 - w0) * t);
}

/** Brush pressure along a stroke: lands thin, swells, lifts off round. */
export const fanProfile = (t: number) => Math.pow(t, 0.7) * Math.sqrt(Math.max(0, 1 - Math.pow(t, 5)));
/** Thin at both ends, full in the middle — a pod segment or a calligraphic flick. */
export const lensProfile = (t: number) => Math.pow(Math.sin(Math.PI * t), 0.8);

/** One loose brush ribbon from `base` to `tip`, bowed sideways by `bend`. */
export function ribbonPath(
  base: Pt,
  tip: Pt,
  width: number,
  bend: number,
  rnd: () => number,
  profile: (t: number) => number = fanProfile,
): string {
  const steps = 10;
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const { p, n } = midrib(base, tip, bend, t);
    const wl = (width / 2) * profile(t) * (0.82 + 0.36 * rnd());
    const wr = (width / 2) * profile(t) * (0.82 + 0.36 * rnd());
    left.push([p[0] + n[0] * wl, p[1] + n[1] * wl]);
    right.push([p[0] - n[0] * wr, p[1] - n[1] * wr]);
  }
  return smoothPath([base, ...left, tip, ...right.reverse()]);
}

/**
 * A petal painted as several overlapping ribbons fanning out of the base,
 * so the overlaps streak darker and a little paper shows between strokes.
 */
export function petalStrokes(
  angle: number,
  spread: number,
  length: number,
  count: number,
  rnd: () => number,
  squash = 1,
): string[] {
  const segment = (2 * length * Math.sin((spread * Math.PI) / 180)) / count;
  return Array.from({ length: count }, (_, j) => {
    const u = count === 1 ? 0 : (j / (count - 1)) * 2 - 1;
    const len = length * (0.88 + 0.12 * Math.cos((u * Math.PI) / 2)) * (0.94 + 0.08 * rnd());
    const [tx, ty] = polar(len, angle + spread * u * 0.72);
    return ribbonPath([0, 0], [tx, ty * squash], segment * (1.6 + 0.4 * rnd()), (rnd() * 2 - 1) * length * 0.07, rnd);
  });
}

/** A seed-leaf (cotyledon) pointing along +x from the origin. */
export function cotyledonPath(length: number, width: number): string {
  return smoothPath([
    [0, 0],
    [length * 0.28, -width * 0.95],
    [length * 0.72, -width * 0.8],
    [length, -width * 0.05],
    [length * 0.68, width * 0.55],
    [length * 0.28, width * 0.5],
  ]);
}
