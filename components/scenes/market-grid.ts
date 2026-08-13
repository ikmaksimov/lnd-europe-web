/**
 * Shared data behind `market-scene` and `verify-scene` — one field of accounts,
 * so scene 02 can literally pick up the plane scene 01 finishes on rather than
 * drawing a second one. Pure data, computed once at module load: no React, no
 * DOM, no colour.
 */
import { project, projectGrid, projectGridLines, quadPolygon, type GridPoint } from './isometric';

/** User units per grid step, shared by every card scene for one family scale. */
export const CARD_UNIT = 34;

/** A 6×6 lattice of accounts, centred on the origin. Far fewer than the full
 *  section scene's 121 — legibility at card width, not density, is the point. */
const COLS = 5;
const ROWS = 5;
const ORIGIN = -2.5;

export const marketOutline = quadPolygon(ORIGIN, ORIGIN, ORIGIN + COLS, ORIGIN + ROWS, 0, CARD_UNIT);

export const marketGridLines = projectGridLines({
  cols: COLS,
  rows: ROWS,
  originX: ORIGIN,
  originY: ORIGIN,
  unit: CARD_UNIT,
});

export const marketNodes: GridPoint[] = projectGrid({
  cols: COLS,
  rows: ROWS,
  originX: ORIGIN,
  originY: ORIGIN,
  unit: CARD_UNIT,
});

export const marketDepth = {
  min: Math.min(...marketNodes.map((n) => n.gx + n.gy)),
  max: Math.max(...marketNodes.map((n) => n.gx + n.gy)),
};

/** Deterministic pseudo-random in [0, 1) — a stable scatter, not `Math.random`,
 *  so server and client render the identical "unorganised" starting offsets. */
function hash(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

const JITTER = 0.85;

/**
 * Each node's SCREEN-space delta between its scattered starting position and
 * its final grid position — what scene 01 animates from, via a CSS transform,
 * rather than a JS-computed per-frame position. Keyed by node index, same order
 * as `marketNodes`.
 */
export const marketScatter = marketNodes.map((node, i) => {
  const jx = (hash(i * 2 + 1) - 0.5) * JITTER;
  const jy = (hash(i * 2 + 2) - 0.5) * JITTER;
  const scattered = project({ x: node.gx + jx, y: node.gy + jy }, CARD_UNIT);
  return { dx: scattered.x - node.x, dy: scattered.y - node.y };
});

const keyOf = (ix: number, iy: number) => `${ix},${iy}`;

/** The handful of accounts scene 01 brightens near the end, hinting at scoring
 *  without explaining it yet. Spread deliberately, not clustered. */
const HIGHLIGHT_COORDS: ReadonlyArray<readonly [number, number]> = [
  [1, 1],
  [4, 1],
  [0, 3],
  [3, 2],
  [5, 4],
  [2, 5],
];
export const highlightSet = new Set(HIGHLIGHT_COORDS.map(([ix, iy]) => keyOf(ix, iy)));

/** Scene 02's confirmed subset — the scene 01 highlights, plus two more, so the
 *  two cards read as one continuous story. Kept deliberately a minority of the
 *  36: the point of scene 02 is that most of the field does not survive it. */
const CONFIRMED_COORDS: ReadonlyArray<readonly [number, number]> = [
  ...HIGHLIGHT_COORDS,
  [4, 4],
  [1, 4],
];
export const confirmedSet = new Set(CONFIRMED_COORDS.map(([ix, iy]) => keyOf(ix, iy)));

export function isHighlighted(node: GridPoint): boolean {
  return highlightSet.has(keyOf(node.ix, node.iy));
}
export function isConfirmed(node: GridPoint): boolean {
  return confirmedSet.has(keyOf(node.ix, node.iy));
}

/** The confirmed nodes alone, in the same order as `CONFIRMED_COORDS` — what
 *  scene 03 starts from. */
export const confirmedNodes: GridPoint[] = marketNodes.filter(isConfirmed);

/** Normalises a value against the field's own gx+gy depth range — the same
 *  "how far into the plane" measure used to stagger scene 01's settle and scene
 *  02's sweep. */
export function marketDepthOf(node: Pick<GridPoint, 'gx' | 'gy'>): number {
  const { min, max } = marketDepth;
  return max === min ? 0 : Number((((node.gx + node.gy) - min) / (max - min)).toFixed(3));
}
