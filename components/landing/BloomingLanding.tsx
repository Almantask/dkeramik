import type { CSSProperties } from 'react';
import Logo from '@/components/ui/Logo';
import { brandPalette as C } from '@/lib/brand-palette';
import {
  brushLine,
  cotyledonPath,
  lensProfile,
  leafPath,
  midribPath,
  ribbonPath,
  seeded,
  smoothPath,
  taperPath,
  type Pt,
} from './brushwork';
import styles from './BloomingLanding.module.css';

// ═══════════════════════════════════════════════════════════════════════════════
// "Laukiam kol pražys" — the landing page shown while the rest of the site is
// hidden (see lib/site-config.ts).
//
// The scene is painted in one 1000×640 coordinate system, framed from y = TOP
// down so the empty sky above the seed pod is cropped away. Each moving part
// (plant, seed pod, bud, every sprout) is its own absolutely positioned layer,
// so the watercolour SVG filters are rasterised once and the browser only has
// to rotate finished bitmaps while things sway.
// ═══════════════════════════════════════════════════════════════════════════════

const W = 1000;
const H = 640;
const GROUND = 562;
const TOP = 160;
const VIEW_H = H - TOP; // keep .scene's aspect-ratio in the CSS module in step
const VIEWBOX = `0 ${TOP} ${W} ${VIEW_H}`;

const PLANT_BASE: Pt = [330, GROUND];
const POD: Pt = [490, 290];
const POD_TILT = 58;
const BUD: Pt = [295, 342];

// Seeds leave through the pores just under the pod's crown.
const PORE: Pt = (() => {
  const [x, y] = [17, -84];
  const a = (POD_TILT * Math.PI) / 180;
  return [POD[0] + x * Math.cos(a) - y * Math.sin(a), POD[1] + x * Math.sin(a) + y * Math.cos(a)];
})();

const SEED_PERIOD = 8; // seconds per seed: fall, rest on the soil, sink
const SEED_START = 1.4;
const SEED_GAP = SEED_PERIOD / 12;
const SEED_LANDS_AT = 0.44; // fraction of the period, must match @keyframes seedFall

// Landing spots; the first six seeds each start a sprout.
const SEED_LANDINGS = [592, 540, 692, 642, 776, 734, 566, 618, 666, 712, 756, 604];

type SproutKind = 'tiny' | 'small' | 'medium';
const SPROUTS: { seed: number; kind: SproutKind; scale: number; lean: number; husk?: boolean }[] = [
  { seed: 1, kind: 'small', scale: 1, lean: -3 },
  { seed: 0, kind: 'tiny', scale: 1.05, lean: 2, husk: true },
  { seed: 3, kind: 'medium', scale: 1, lean: 4 },
  { seed: 2, kind: 'tiny', scale: 0.92, lean: -2 },
  { seed: 5, kind: 'small', scale: 0.9, lean: 3 },
  { seed: 4, kind: 'tiny', scale: 0.85, lean: -1, husk: true },
];

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const origin = ([x, y]: Pt) => `${(x / W) * 100}% ${((y - TOP) / VIEW_H) * 100}%`;
const sway = (pivot: Pt, amp: number, dur: number, delay = 0): Vars => ({
  transformOrigin: origin(pivot),
  '--amp': `${amp}deg`,
  '--dur': `${dur}s`,
  '--delay': `${delay}s`,
});

export default function BloomingLanding() {
  return (
    <div className={styles.page}>
      <Paper />
      <PaintFilters />

      <header className={styles.intro}>
        <Logo className={`${styles.logo} text-brand-terracotta`} />
        <h1 className="mt-4 font-playfair italic font-normal text-brand-navy text-[clamp(2.6rem,7vw,5.25rem)] leading-[1.05]">
          Laukiam kol pražys
        </h1>
        <svg className={styles.underline} viewBox="0 0 320 24" aria-hidden="true">
          <path
            className={styles.underlineStroke}
            d="M8,15 C70,6 140,18 200,11 C250,6 290,12 312,9"
            pathLength={1}
            fill="none"
            stroke={C.ochre}
            strokeWidth={5}
            strokeLinecap="round"
            filter="url(#pp-ink)"
          />
        </svg>
      </header>

      <div className={styles.stage}>
        <div
          className={styles.scene}
          role="img"
          aria-label="Aguona barsto sėklas, iš kurių dygsta maži daigeliai"
        >
          <div className={`${styles.layer} ${styles.fadeIn}`}>
            <Ground />
          </div>

          <div className={`${styles.layer} ${styles.sway}`} style={sway(PLANT_BASE, 0.7, 9)}>
            <div className={`${styles.layer} ${styles.bloomIn}`}>
              <Stems />
            </div>
            <div className={`${styles.layer} ${styles.sway}`} style={sway(BUD, 3.2, 6.1, 0.6)}>
              <div className={`${styles.layer} ${styles.bloomIn}`}>
                <Bud />
              </div>
            </div>
            <div className={`${styles.layer} ${styles.sway}`} style={sway(POD, 3.5, SEED_PERIOD / 3)}>
              <div className={`${styles.layer} ${styles.bloomIn}`}>
                <SeedPod />
              </div>
            </div>
          </div>

          {SPROUTS.map((s, i) => (
            <Sprout key={i} {...s} index={i} />
          ))}

          <div className={styles.layer}>
            <Seeds />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Paint ───────────────────────────────────────────────────────────────────

/** Watercolour filters shared by every layer (ids are document-global). */
function PaintFilters() {
  return (
    <svg className={styles.defs} aria-hidden="true" focusable="false">
      <defs>
        {/* Wet wash: wobbly edges, pigment pooling at the rim, paper granulation. */}
        <filter id="pp-wash" x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={4} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={9} xChannelSelector="R" yChannelSelector="G" result="wobbly" />
          <feTurbulence type="fractalNoise" baseFrequency="0.16" numOctaves={2} seed={6} result="fray" />
          <feDisplacementMap in="wobbly" in2="fray" scale={3.5} xChannelSelector="G" yChannelSelector="B" result="shape" />
          <feMorphology in="shape" operator="erode" radius={1.8} result="core" />
          <feComposite in="shape" in2="core" operator="out" result="rim" />
          <feGaussianBlur in="rim" stdDeviation={0.9} result="rimSoft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={2} seed={11} result="grain" />
          <feColorMatrix in="grain" type="luminanceToAlpha" result="grainLum" />
          <feComponentTransfer in="grainLum" result="grainMask">
            <feFuncA type="linear" slope={1.3} intercept={0.22} />
          </feComponentTransfer>
          <feComposite in="shape" in2="grainMask" operator="in" result="grainy" />
          <feComponentTransfer in="grainy" result="body">
            <feFuncA type="linear" slope={0.82} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="body" />
            <feMergeNode in="rimSoft" />
          </feMerge>
        </filter>

        {/* The same wash, tuned for small shapes (sprouts, the bud, the pod's crown). */}
        <filter id="pp-wash-sm" x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves={2} seed={8} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="shape" />
          <feMorphology in="shape" operator="erode" radius={0.9} result="core" />
          <feComposite in="shape" in2="core" operator="out" result="rim" />
          <feGaussianBlur in="rim" stdDeviation={0.5} result="rimSoft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={13} result="grain" />
          <feColorMatrix in="grain" type="luminanceToAlpha" result="grainLum" />
          <feComponentTransfer in="grainLum" result="grainMask">
            <feFuncA type="linear" slope={1.2} intercept={0.3} />
          </feComponentTransfer>
          <feComposite in="shape" in2="grainMask" operator="in" result="grainy" />
          <feComponentTransfer in="grainy" result="body">
            <feFuncA type="linear" slope={0.85} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="body" />
            <feMergeNode in="rimSoft" />
          </feMerge>
        </filter>

        {/* Dry brush / ink line: a little wobble and broken, scratchy coverage. */}
        <filter id="pp-ink" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves={2} seed={2} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={3.5} xChannelSelector="R" yChannelSelector="G" result="line" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={5} result="dry" />
          <feColorMatrix in="dry" type="luminanceToAlpha" result="dryLum" />
          <feComponentTransfer in="dryLum" result="dryMask">
            <feFuncA type="linear" slope={1.8} intercept={0.05} />
          </feComponentTransfer>
          <feComposite in="line" in2="dryMask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

/** Cream paper with fine fibres and soft, uneven warmth. */
function Paper() {
  return (
    <svg className={styles.paper} aria-hidden="true" focusable="false">
      <defs>
        <filter id="pp-paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={3} />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.39  0 0 0 0 0.33  0 0 0 0 0.24  3 0 0 0 -1.62"
          />
        </filter>
        <filter id="pp-paper-mottle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={2} seed={21} />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.79  0 0 0 0 0.56  0 0 0 0 0.31  0 1.4 0 0 -0.55"
          />
        </filter>
        <radialGradient id="pp-paper-vignette" cx="50%" cy="45%" r="75%">
          <stop offset="60%" stopColor={C.ochre} stopOpacity={0} />
          <stop offset="100%" stopColor={C.ochre} stopOpacity={0.16} />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" filter="url(#pp-paper-mottle)" opacity={0.22} />
      <rect width="100%" height="100%" filter="url(#pp-paper-grain)" opacity={0.3} />
      <rect width="100%" height="100%" fill="url(#pp-paper-vignette)" />
    </svg>
  );
}

// ─── Scene layers ────────────────────────────────────────────────────────────

function Ground() {
  const rnd = seeded(31);
  const specks = Array.from({ length: 54 }, () => ({
    x: 60 + rnd() * 880,
    y: GROUND + 6 + rnd() * 58,
    r: 0.7 + rnd() * 1.7,
    fill: rnd() < 0.55 ? C.terracotta : C.navy,
    o: 0.12 + rnd() * 0.3,
  }));
  const groundLines: Pt[][] = [
    [[70, 568], [150, 561], [230, 566], [290, 562]],
    [[310, 564], [380, 558], [450, 566], [520, 561]],
    [[548, 561], [640, 555], [740, 566], [850, 557]],
    [[880, 558], [925, 554], [968, 559]],
  ];
  const ink = seeded(5);

  return (
    <svg viewBox={VIEWBOX} className={styles.svg} aria-hidden="true">
      <defs>
        <linearGradient id="pp-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.ochre} stopOpacity={0.34} />
          <stop offset="55%" stopColor={C.ochre} stopOpacity={0.16} />
          <stop offset="100%" stopColor={C.ochre} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="pp-subsoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.terracotta} stopOpacity={0.09} />
          <stop offset="70%" stopColor={C.terracotta} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="pp-ground-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity={0} />
          <stop offset="14%" stopColor="#fff" stopOpacity={1} />
          <stop offset="86%" stopColor="#fff" stopOpacity={1} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="pp-ground-mask">
          <rect x={0} y={0} width={W} height={H} fill="url(#pp-ground-fade)" />
        </mask>
      </defs>
      <g mask="url(#pp-ground-mask)">
        <g filter="url(#pp-wash)">
          <path
            d="M-20,566 C120,553 260,571 400,561 C560,549 700,570 860,557 C930,552 980,560 1020,556 L1020,660 L-20,660 Z"
            fill="url(#pp-soil)"
          />
          <path
            d="M-20,598 C200,588 420,606 640,594 C800,586 920,598 1020,590 L1020,660 L-20,660 Z"
            fill="url(#pp-subsoil)"
          />
        </g>
        <g filter="url(#pp-ink)" fill="none" stroke={C.navy} strokeOpacity={0.3} strokeWidth={1.6} strokeLinecap="round">
          {groundLines.map((pts, i) => (
            <path key={i} d={brushLine(pts, ink, 1.5)} />
          ))}
        </g>
        {specks.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} fillOpacity={s.o} />
        ))}
      </g>
    </svg>
  );
}

const LEAVES: { base: Pt; tip: Pt; width: number; lobes: number; bend: number }[] = [
  { base: [328, 552], tip: [224, 524], width: 24, lobes: 4, bend: -16 },
  { base: [333, 548], tip: [438, 521], width: 22, lobes: 4, bend: 14 },
  { base: [337, 486], tip: [392, 452], width: 15, lobes: 3, bend: 8 },
];

function Stems() {
  const rnd = seeded(7);
  const leaves = LEAVES.map((l) => ({ ...l, d: leafPath(l.base, l.tip, l.width, l.lobes, l.bend, rnd) }));
  // One stem, bowed over by the weight of the seed pod.
  const mainStem: Pt[] = [
    [330, 566], [328, 520], [333, 470], [342, 440], [358, 416], [378, 396], [410, 369], [440, 343], [466, 315], [490, 292],
  ];
  const budStem: Pt[] = [
    [329, 508], [316, 480], [297, 450], [276, 418], [260, 386], [252, 356],
    [256, 330], [268, 316], [283, 316], [292, 328], [295, 340],
  ];
  const hairs = seeded(12);
  const stemHairs = mainStem.slice(1, -1).map(([x, y]) => {
    const side = hairs() < 0.5 ? -1 : 1;
    return `M${x + side * 3},${y} l${side * (3 + hairs() * 3)},${-2 - hairs() * 3}`;
  });

  return (
    <svg viewBox={VIEWBOX} className={styles.svg} aria-hidden="true">
      <g filter="url(#pp-wash)">
        {leaves.map((l, i) => (
          <path key={i} d={l.d} fill={C.olive} fillOpacity={0.55} stroke={C.olive} strokeOpacity={0.4} strokeWidth={1.4} />
        ))}
        {leaves.map((l, i) => (
          <path key={`g${i}`} d={l.d} transform="translate(3 -3) scale(1)" fill={C.ochre} fillOpacity={0.14} />
        ))}
      </g>
      <g filter="url(#pp-wash-sm)" fill={C.olive}>
        <path d={taperPath(mainStem, 8, 3.6)} fillOpacity={0.88} />
        <path d={taperPath(budStem, 4.4, 2.8)} fillOpacity={0.82} />
      </g>
      <g filter="url(#pp-ink)" fill="none" strokeLinecap="round">
        {leaves.map((l, i) => (
          <path key={i} d={midribPath(l.base, l.tip, l.bend)} stroke={C.olive} strokeOpacity={0.9} strokeWidth={1.4} />
        ))}
        <path d={smoothPath(mainStem.map(([x, y]) => [x + 2.4, y]), false)} stroke={C.ochre} strokeOpacity={0.35} strokeWidth={1.4} />
        <g stroke={C.navy} strokeOpacity={0.28} strokeWidth={0.9}>
          {stemHairs.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

function SeedPod() {
  const rnd = seeded(23);
  const capsule = smoothPath([
    [0, 2], [-25, -14], [-33, -48], [-25, -80], [-12, -91], [12, -91], [25, -80], [33, -48], [25, -14],
  ]);
  // Lengthwise ribbons with paper showing between them, like the ochre pod sketch.
  const segments = [-27, -13.5, 0, 13.5, 27].map((b) =>
    ribbonPath([b * 0.1, -1], [b * 0.4, -90], 11, b, rnd, lensProfile),
  );
  // The flat, scalloped crown (stigmatic disc) with its rays.
  const rim = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return [Math.cos(a) * 29, -93 + Math.sin(a) * 6.5] as Pt;
  });

  return (
    <svg viewBox={VIEWBOX} className={styles.svg} aria-hidden="true">
      <g transform={`translate(${POD[0]} ${POD[1]}) rotate(${POD_TILT})`}>
        <g filter="url(#pp-wash)">
          <path d={capsule} fill={C.ochre} fillOpacity={0.14} />
          {segments.map((d, i) => (
            <path
              key={i}
              d={d}
              fill={i === 3 ? C.terracotta : C.ochre}
              fillOpacity={i === 3 ? 0.4 : 0.62}
              stroke={C.ochre}
              strokeOpacity={0.5}
              strokeWidth={1.2}
            />
          ))}
        </g>
        <g filter="url(#pp-wash-sm)">
          <ellipse cx={0} cy={2} rx={9} ry={5} fill={C.olive} fillOpacity={0.9} />
          <ellipse cx={0} cy={-93} rx={28} ry={6.5} fill={C.ochre} fillOpacity={0.85} />
          {rim.map(([x, y], i) => (
            <ellipse key={i} cx={x * 1.05} cy={y - 1} rx={4.5} ry={3} fill={C.ochre} fillOpacity={0.8} />
          ))}
          <g stroke={C.terracotta} strokeOpacity={0.5} strokeWidth={1.3} strokeLinecap="round">
            {rim.map(([x, y], i) => (
              <line key={i} x1={0} y1={-94} x2={x * 0.92} y2={y} />
            ))}
          </g>
          {[[-14, -84], [3, -82], [19, -83]].map(([x, y]) => (
            <ellipse key={x} cx={x} cy={y} rx={2.2} ry={1.6} fill={C.navy} fillOpacity={0.75} />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** A nodding bud on its crook — the next flower, still waiting. */
function Bud() {
  const rnd = seeded(41);
  const body: Pt[] = [[0, 0], [-11, 10], [-15, 28], [-10, 44], [0, 52], [10, 44], [15, 28], [11, 10]];
  const hairs = body.slice(1).map(([x, y]) => {
    const len = 3 + rnd() * 3;
    const n = Math.hypot(x, y - 26) || 1;
    return `M${x},${y} l${(x / n) * len},${((y - 26) / n) * len}`;
  });

  return (
    <svg viewBox={VIEWBOX} className={styles.svg} aria-hidden="true">
      <g transform={`translate(${BUD[0]} ${BUD[1]}) rotate(8)`}>
        <g filter="url(#pp-wash-sm)">
          <path d={smoothPath(body)} fill={C.olive} fillOpacity={0.72} />
          <path d={smoothPath([[2, 14], [8, 26], [7, 40], [1, 49], [3, 36], [3, 24]])} fill={C.terracotta} fillOpacity={0.85} />
        </g>
        <g filter="url(#pp-ink)" stroke={C.navy} strokeOpacity={0.35} strokeWidth={0.9} strokeLinecap="round">
          {hairs.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </g>
    </svg>
  );
}

const seedLandsAt = (i: number) => SEED_START + i * SEED_GAP + SEED_LANDS_AT * SEED_PERIOD;

function Seeds() {
  const rnd = seeded(77);
  const seeds = SEED_LANDINGS.map((x, i) => ({
    dx: Math.round(x + (rnd() * 2 - 1) * 3 - PORE[0]),
    dy: Math.round(GROUND + 1 + rnd() * 3 - PORE[1]),
    rx: 3.4 + rnd() * 1.2,
    tilt: Math.round(rnd() * 180),
    delay: SEED_START + i * SEED_GAP,
  }));

  return (
    <svg viewBox={VIEWBOX} className={styles.svg} aria-hidden="true">
      <g transform={`translate(${PORE[0]} ${PORE[1]})`}>
        {seeds.map((s, i) => (
          <g
            key={i}
            className={styles.seed}
            style={{ '--dx': s.dx, '--dy': s.dy, '--period': `${SEED_PERIOD}s`, animationDelay: `${s.delay}s` } as Vars}
          >
            <g transform={`rotate(${s.tilt})`}>
              <ellipse className={styles.seedSpin} rx={s.rx} ry={s.rx * 0.74} fill={C.navy} fillOpacity={0.9} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}

// Each sprout is a small SVG of its own (local origin = where it meets the soil).
const SPROUT_BOX = { left: -50, top: -100, width: 100, height: 110 };

function Sprout({
  seed,
  kind,
  scale,
  lean,
  husk,
  index,
}: (typeof SPROUTS)[number] & { index: number }) {
  const x = SEED_LANDINGS[seed];
  const t0 = seedLandsAt(seed);
  const h = kind === 'tiny' ? 15 : kind === 'small' ? 27 : 46;
  const stem = `M0,4 C1,${-h * 0.35} ${-lean * 0.5},${-h * 0.72} ${lean},${-h}`;
  const cotyledonY = kind === 'medium' ? -h * 0.52 : -h;
  const cotyledonX = kind === 'medium' ? lean * 0.1 : lean;
  const rnd = seeded(100 + index);

  const box: Vars = {
    left: `${((x + SPROUT_BOX.left) / W) * 100}%`,
    top: `${((GROUND + SPROUT_BOX.top - TOP) / VIEW_H) * 100}%`,
    width: `${(SPROUT_BOX.width / W) * 100}%`,
    height: `${(SPROUT_BOX.height / VIEW_H) * 100}%`,
    transformOrigin: `50% ${(-SPROUT_BOX.top / SPROUT_BOX.height) * 100}%`,
    '--t0': `${t0}s`,
    '--amp': `${(index % 2 ? -1 : 1) * (2.4 + (index % 3))}deg`,
    '--dur': `${4.6 + index * 0.55}s`,
  };

  return (
    <div className={styles.sprout} style={box}>
      <svg
        viewBox={`${SPROUT_BOX.left} ${SPROUT_BOX.top} ${SPROUT_BOX.width} ${SPROUT_BOX.height}`}
        className={styles.svg}
        aria-hidden="true"
      >
        <g transform={`scale(${scale})`} filter="url(#pp-wash-sm)">
          <path
            className={styles.sproutStem}
            d={stem}
            pathLength={1}
            fill="none"
            stroke={C.olive}
            strokeWidth={kind === 'medium' ? 3.4 : 2.8}
            strokeLinecap="round"
          />
          <g transform={`translate(${cotyledonX} ${cotyledonY}) rotate(-154)`}>
            <path className={styles.leaf} style={{ '--fold': '62deg' } as Vars} d={cotyledonPath(17, 6.4)} fill={C.olive} fillOpacity={0.82} />
          </g>
          <g transform={`translate(${cotyledonX} ${cotyledonY}) rotate(-26)`}>
            <g className={styles.leaf} style={{ '--fold': '-62deg' } as Vars}>
              <path d={cotyledonPath(18, 6.8)} fill={C.olive} fillOpacity={0.78} />
              <path d={cotyledonPath(11, 3.2)} transform="translate(3 0)" fill={C.ochre} fillOpacity={0.35} />
              {husk && <ellipse cx={18.5} cy={-0.5} rx={3.6} ry={2.7} fill={C.navy} fillOpacity={0.88} />}
            </g>
          </g>

          {kind === 'small' && (
            <g transform={`translate(${lean} ${-h}) rotate(-92)`}>
              <path className={styles.leafLate} d={cotyledonPath(10, 3.6)} fill={C.terracotta} fillOpacity={0.8} />
            </g>
          )}

          {kind === 'medium' && (
            <>
              <g transform={`translate(${lean} ${-h})`}>
                <path
                  className={styles.leafLate}
                  style={{ '--fold': '40deg' } as Vars}
                  d={leafPath([0, 0], [-20, -12], 6, 2, -3, rnd)}
                  fill={C.olive}
                  fillOpacity={0.8}
                />
                <path
                  className={styles.leafLate}
                  style={{ '--fold': '-40deg' } as Vars}
                  d={leafPath([0, 0], [21, -14], 6.5, 2, 3, rnd)}
                  fill={C.olive}
                  fillOpacity={0.72}
                />
              </g>
              <g transform={`translate(${lean} ${-h}) rotate(4)`}>
                <g className={styles.budLate}>
                  <path d={`M0,0 C1,-6 -1,-11 1,-15`} stroke={C.olive} strokeWidth={1.8} fill="none" strokeLinecap="round" />
                  <path
                    d={smoothPath([[1, -14], [-4, -19], [-3, -27], [2, -30], [6, -25], [5, -18]])}
                    fill={C.olive}
                    fillOpacity={0.85}
                  />
                  <path d={smoothPath([[2, -29], [4, -25], [3, -20], [1, -24]])} fill={C.terracotta} fillOpacity={0.9} />
                </g>
              </g>
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
