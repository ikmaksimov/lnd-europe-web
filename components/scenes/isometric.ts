/**
 * Isometric projection — the geometry behind `components/scenes`.
 * --------------------------------------------------------------------------
 * Pure functions over numbers: no React, no DOM, no colour, no markup. A scene
 * declares its shape in GRID space (integers, one unit per lattice step) and
 * this module turns it into SCREEN space, so a scene can be retuned by editing
 * a handful of numbers rather than by editing paths.
 *
 * The projection is the standard 2:1-ish isometric pair:
 *
 *     sx = (x - y) * cos(30°)
 *     sy = (x + y) * sin(30°) - z
 *
 * `z` is in the same grid units as `x` and `y`, and lifts the point up the
 * screen (SVG's y axis points down, so a positive z lowers `sy`). Every helper
 * takes the same `unit` — grid units per user unit — and returns user-space
 * coordinates ready for a viewBox.
 *
 * Everything composes from `project`; the rest is convenience so a scene never
 * has to spell out corner order or measure a stroke by hand.
 */

/** A point in grid space. `z` defaults to the ground plane. */
export interface Point3 {
  x: number;
  y: number;
  z?: number;
}

/** A point in screen (SVG user) space. */
export interface Point2 {
  x: number;
  y: number;
}

/** A projected lattice point, carrying both its grid coordinate and its index. */
export interface GridPoint extends Point2 {
  /** Grid coordinate — what the projection was fed. */
  gx: number;
  gy: number;
  /** Column/row index within the generated grid, 0-based. */
  ix: number;
  iy: number;
}

export const ISO_COS = Math.cos(Math.PI / 6);
export const ISO_SIN = Math.sin(Math.PI / 6);

/** Grid space → screen space. The one primitive; everything below composes it. */
export function project({ x, y, z = 0 }: Point3, unit = 1): Point2 {
  return {
    x: (x - y) * ISO_COS * unit,
    y: ((x + y) * ISO_SIN - z) * unit,
  };
}

export interface GridOptions {
  /** Steps along each axis. A `cols` of 10 yields 11 lattice points. */
  cols: number;
  rows: number;
  /** Grid coordinate of the near corner. */
  originX?: number;
  originY?: number;
  /** Grid units per step. */
  step?: number;
  z?: number;
  unit?: number;
}

/**
 * The lattice points of a rectangular patch of grid, row-major. Returns indices
 * alongside coordinates so a scene can thin the lattice (every other point, say)
 * without recomputing which point is which.
 */
export function projectGrid({
  cols,
  rows,
  originX = 0,
  originY = 0,
  step = 1,
  z = 0,
  unit = 1,
}: GridOptions): GridPoint[] {
  const points: GridPoint[] = [];
  for (let iy = 0; iy <= rows; iy += 1) {
    for (let ix = 0; ix <= cols; ix += 1) {
      const gx = originX + ix * step;
      const gy = originY + iy * step;
      points.push({ gx, gy, ix, iy, ...project({ x: gx, y: gy, z }, unit) });
    }
  }
  return points;
}

/**
 * The four corners of an axis-aligned rectangle of grid, in draw order
 * (near → right → far → left). Used for plane outlines and cell fills alike.
 */
export function quadPolygon(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  z = 0,
  unit = 1
): Point2[] {
  return [
    project({ x: x0, y: y0, z }, unit),
    project({ x: x1, y: y0, z }, unit),
    project({ x: x1, y: y1, z }, unit),
    project({ x: x0, y: y1, z }, unit),
  ];
}

/** The polygon of a single lattice cell whose near corner is (gx, gy). */
export function cellPolygon(gx: number, gy: number, size = 1, z = 0, unit = 1): Point2[] {
  return quadPolygon(gx, gy, gx + size, gy + size, z, unit);
}

/** Grid-space size of a box. */
export interface Size3 {
  x: number;
  y: number;
  z: number;
}

/**
 * The eight corners of a box, bottom face first (near → right → far → left),
 * then the top face in the same order. Indices 4–7 are therefore the top face,
 * which is the one a scene usually wants to fill.
 */
export function boxCorners(origin: Point3, size: Size3, unit = 1): Point2[] {
  const { x, y, z = 0 } = origin;
  const face = (level: number) => quadPolygon(x, y, x + size.x, y + size.y, level, unit);
  return [...face(z), ...face(z + size.z)];
}

/**
 * The twelve edges of a box as point pairs: four along the bottom face, four
 * along the top, then the four verticals. A wireframe box is this list drawn as
 * lines; a solid-looking one adds `boxCorners(...).slice(4)` as a filled face.
 */
export function boxEdges(origin: Point3, size: Size3, unit = 1): Array<[Point2, Point2]> {
  const c = boxCorners(origin, size, unit);
  const ring = (o: number): Array<[Point2, Point2]> => [
    [c[o], c[o + 1]],
    [c[o + 1], c[o + 2]],
    [c[o + 2], c[o + 3]],
    [c[o + 3], c[o]],
  ];
  const verticals: Array<[Point2, Point2]> = [
    [c[0], c[4]],
    [c[1], c[5]],
    [c[2], c[6]],
    [c[3], c[7]],
  ];
  return [...ring(0), ...ring(4), ...verticals];
}

/** Screen-space distance — the length a stroke actually draws. */
export function distance(a: Point2, b: Point2): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * Screen-space length of a polyline, closed by default. This is what a
 * dash-based draw-in needs for its `stroke-dasharray`; measuring it here keeps
 * `getTotalLength()` (a layout read) out of the render path.
 */
export function pathLength(points: Point2[], closed = true): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1], points[i]);
  if (closed && points.length > 1) total += distance(points[points.length - 1], points[0]);
  return total;
}

/** Round to `places` decimals — enough precision for user space, small markup. */
const round = (n: number, places = 2): number => Number(n.toFixed(places));

/** Points formatted for a `<polygon>` / `<polyline>` `points` attribute. */
export function polygonPoints(points: Point2[]): string {
  return points.map((p) => `${round(p.x)},${round(p.y)}`).join(' ');
}

/** The axis-aligned bounds of a set of screen-space points. */
export function bounds(points: Point2[]): { x: number; y: number; width: number; height: number } {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, width: Math.max(...xs) - minX, height: Math.max(...ys) - minY };
}

/**
 * A `viewBox` string sized to the geometry it is given, with even padding. The
 * frame is therefore derived from the scene rather than guessed, so changing the
 * grid or the plane heights reframes it automatically.
 */
export function viewBoxOf(points: Point2[], padding = 0): string {
  const b = bounds(points);
  return [
    round(b.x - padding),
    round(b.y - padding),
    round(b.width + padding * 2),
    round(b.height + padding * 2),
  ].join(' ');
}
