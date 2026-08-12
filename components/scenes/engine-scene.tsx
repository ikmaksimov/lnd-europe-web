'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/effects';
import {
  boxCorners,
  boxEdges,
  distance,
  pathLength,
  polygonPoints,
  project,
  projectGrid,
  quadPolygon,
  viewBoxOf,
  type Point2,
} from './isometric';

/* --------------------------------------------------------------------------
   GEOMETRY — every number that shapes the scene lives in this block.
   Grid space: one unit per lattice step, `z` lifting a plane up the screen.
   Nothing below reads a colour or a pixel; UNIT is the only bridge to user
   space, and the viewBox is measured from the result rather than guessed.
   -------------------------------------------------------------------------- */

/** User units per grid step. Scales the whole diagram; the frame follows. */
const UNIT = 30;

/**
 * The three planes, bottom to top — raw market, verification, prioritisation.
 * Each is narrower than the one below it: that shrinking footprint is what makes
 * the stack read as a distillation rather than as three unrelated diagrams. The
 * z steps are even and generous enough that no plane's contents cross into the
 * plane above — at 3.4 apart the crown boxes hung down into the network.
 */
const GROUND = { from: 0, to: 10, z: 0 };
const MIDDLE = { from: 2, to: 8, z: 4.2 };
const CROWN = { from: 2.8, to: 7.4, z: 8.8 };

/** How many diagonal bands the ground lattice appears in. Fewer = coarser wave,
 *  and — because a band is what actually animates — cheaper per frame. */
const BANDS = 7;

/**
 * The verified subset: coordinates on the middle plane that light up.
 *
 * Laid out in five staggered rows of constant depth (gx + gy), each row offset
 * half a step from the one before. Two properties of the projection drive that
 * choice, and both were visible failures before it:
 *
 *   - two nodes with the same gx - gy project to a VERTICAL screen line, which
 *     in an isometric reads as height, not as a link across a plane;
 *   - nodes left on whole grid steps line up, and a chain of axis-aligned links
 *     then closes into what looks like a box outline rather than a network.
 *
 * The stagger guarantees every link that survives LINK_REACH is either clearly
 * slanted or clearly horizontal, and the fractional offsets keep the mesh off
 * the lattice below it.
 */
const MIDDLE_NODES: ReadonlyArray<readonly [number, number]> = [
  [2.4, 3.6],
  [3.7, 2.4],
  [2.8, 5.3],
  [4.1, 4.0],
  [5.4, 2.7],
  [3.0, 7.0],
  [4.4, 5.6],
  [5.7, 4.3],
  [7.0, 3.1],
  [4.8, 7.2],
  [6.1, 5.9],
  [7.3, 4.7],
  [6.4, 7.6],
  [7.6, 6.4],
];

/** How far apart two verified nodes may be to be linked, and how many links one
 *  node may carry. Raising either thickens the network; the reach is the one
 *  that decides whether it reads as links or as enclosed shapes. */
const LINK_REACH = 2;
const LINK_DEGREE = 3;

/**
 * The prioritised accounts: a box each, plus the score it carries. Spaced a
 * clear 1.8 grid units apart — at the 0.8 they started on, the four boxes
 * projected into one overlapping mass instead of four accounts.
 */
const CROWN_NODES: ReadonlyArray<{ gx: number; gy: number; score: number }> = [
  { gx: 3, gy: 3, score: 96 },
  { gx: 6, gy: 3, score: 91 },
  { gx: 3, gy: 6, score: 88 },
  { gx: 6, gy: 6, score: 84 },
];
const CUBE = { x: 1.2, y: 1.2, z: 1.2 };

const round = (n: number) => Number(n.toFixed(1));

/** Map a value in [min, max] onto [0, 1]; used to turn a grid position into the
 *  `--d` a staggered element reads. A zero-width range collapses to 0. */
function normalise(value: number, min: number, max: number): number {
  return max === min ? 0 : Number(((value - min) / (max - min)).toFixed(3));
}

/* --- Ground plane: the undifferentiated market ---------------------------- */

const groundOutline = quadPolygon(GROUND.from, GROUND.from, GROUND.to, GROUND.to, GROUND.z, UNIT);

const groundCells = GROUND.to - GROUND.from;

const groundLines = (() => {
  const lines: Array<{ a: Point2; b: Point2; i: number }> = [];
  for (let i = 0; i <= groundCells; i += 1) {
    const g = GROUND.from + i;
    lines.push({
      i,
      a: project({ x: GROUND.from, y: g, z: GROUND.z }, UNIT),
      b: project({ x: GROUND.to, y: g, z: GROUND.z }, UNIT),
    });
    lines.push({
      i,
      a: project({ x: g, y: GROUND.from, z: GROUND.z }, UNIT),
      b: project({ x: g, y: GROUND.to, z: GROUND.z }, UNIT),
    });
  }
  return lines;
})();

const groundGrid = projectGrid({
  cols: groundCells,
  rows: groundCells,
  originX: GROUND.from,
  originY: GROUND.from,
  z: GROUND.z,
  unit: UNIT,
});

/** The lattice split into diagonal bands, so the reveal is seven animated
 *  groups rather than a hundred and twenty-one animated circles. */
const groundBands = (() => {
  const bands: Array<(typeof groundGrid)[number][]> = Array.from({ length: BANDS }, () => []);
  for (const point of groundGrid) {
    const band = Math.min(BANDS - 1, Math.floor(((point.ix + point.iy) / (groundCells * 2 + 1)) * BANDS));
    bands[band].push(point);
  }
  return bands;
})();

/* --- Middle plane: the verified network ----------------------------------- */

const middleOutline = quadPolygon(MIDDLE.from, MIDDLE.from, MIDDLE.to, MIDDLE.to, MIDDLE.z, UNIT);

const middleNodes = MIDDLE_NODES.map(([gx, gy]) => ({
  gx,
  gy,
  ...project({ x: gx, y: gy, z: MIDDLE.z }, UNIT),
}));

const middleDepth = {
  min: Math.min(...middleNodes.map((n) => n.gx + n.gy)),
  max: Math.max(...middleNodes.map((n) => n.gx + n.gy)),
};

/**
 * Links the verified nodes to their nearest neighbours, shortest first, capping
 * each node's degree. Deterministic — same input, same graph on server and
 * client — and derived, so moving a node re-wires its links for free.
 */
const middleEdges = (() => {
  const candidates: Array<{ a: number; b: number; d: number }> = [];
  for (let i = 0; i < middleNodes.length; i += 1) {
    for (let j = i + 1; j < middleNodes.length; j += 1) {
      const d = Math.hypot(
        middleNodes[i].gx - middleNodes[j].gx,
        middleNodes[i].gy - middleNodes[j].gy
      );
      if (d <= LINK_REACH) candidates.push({ a: i, b: j, d });
    }
  }
  candidates.sort((p, q) => p.d - q.d);

  const degree = middleNodes.map(() => 0);
  return candidates.flatMap(({ a, b }) => {
    if (degree[a] >= LINK_DEGREE || degree[b] >= LINK_DEGREE) return [];
    degree[a] += 1;
    degree[b] += 1;
    const from = middleNodes[a];
    const to = middleNodes[b];
    return [
      {
        from,
        to,
        len: distance(from, to),
        depth: (from.gx + from.gy + to.gx + to.gy) / 2,
      },
    ];
  });
})();

/* --- Crown plane: the prioritised accounts -------------------------------- */

const crownOutline = quadPolygon(CROWN.from, CROWN.from, CROWN.to, CROWN.to, CROWN.z, UNIT);

const crownDepth = {
  min: Math.min(...CROWN_NODES.map((n) => n.gx + n.gy)),
  max: Math.max(...CROWN_NODES.map((n) => n.gx + n.gy)),
};

const crownBoxes = CROWN_NODES.map(({ gx, gy, score }) => {
  const origin = { x: gx, y: gy, z: CROWN.z };
  const corners = boxCorners(origin, CUBE, UNIT);
  return {
    score,
    depth: normalise(gx + gy, crownDepth.min, crownDepth.max),
    edges: boxEdges(origin, CUBE, UNIT),
    /** Indices 4–7 are the top face — the one that catches the fill. */
    top: corners.slice(4),
    /** The score sits on the top face, not beside the box: a free-floating
     *  label lands on whichever neighbour happens to project underneath it,
     *  and which neighbour that is changes every time a box moves. */
    label: project(
      { x: gx + CUBE.x / 2, y: gy + CUBE.y / 2, z: CROWN.z + CUBE.z },
      UNIT
    ),
    /** Dashed plumb line down to the ground plane, at the box's centre. */
    guide: {
      a: project({ x: gx + CUBE.x / 2, y: gy + CUBE.y / 2, z: GROUND.z }, UNIT),
      b: project({ x: gx + CUBE.x / 2, y: gy + CUBE.y / 2, z: CROWN.z }, UNIT),
    },
  };
});

/* --- The frame, measured from the geometry -------------------------------- */

const VIEW_BOX = viewBoxOf(
  [
    ...groundOutline,
    ...crownBoxes.flatMap((box) => [...box.top, box.label]),
  ],
  26
);

/** Reported in the acceptance notes; also the knob to turn if a frame gets tight. */
export const NODE_COUNT = groundGrid.length + middleNodes.length + CROWN_NODES.length;

/* -------------------------------------------------------------------------- */

export interface EngineSceneProps {
  /** Root for this instance's DOM ids, so the scene can appear twice. */
  htmlId?: string;
  /** `'none'` pins the finished state and registers no listeners. */
  animationLevel?: 'none' | 'subtle';
  /**
   * `'deep'` puts the scene on the hero's scoped blue palette, where the brand
   * blue clears 5:1 against the ground — thin strokes need that headroom.
   * `'inherit'` drops the scope so the scene takes the ambient theme, which is
   * how it inverts inside `theme-dark`.
   */
  ground?: 'deep' | 'inherit';
}

/**
 * engine-scene — three stacked isometric planes that assemble as the section
 * scrolls: a dense unmarked market, a verified network drawing itself across a
 * subset of it, and four prioritised accounts resolving above, each carrying a
 * score. Read bottom to top it is the claim the page makes in words — a living
 * intelligence engine distilling a market into pipeline.
 *
 * The section is deliberately taller than the viewport with a sticky inner
 * frame: that extra height is the runway. A rAF loop, gated by an
 * IntersectionObserver so it costs nothing off screen, writes exactly ONE custom
 * property — `--scene-progress` — and CSS derives every stage from it (see
 * globals.css). Same machinery as `hero-blur` and `statement-highlight`.
 *
 * Geometry is computed once at module load from the constants above, never
 * per frame: the only properties that move are `opacity`, `transform` and
 * `stroke-dashoffset`.
 *
 * Progressive enhancement: the CSS default is the FINISHED state, so with no
 * JavaScript the diagram renders fully assembled. `prefersReducedMotion()` and
 * `animationLevel="none"` both return before any observer or frame exists.
 *
 * The diagram is decorative — the surrounding heading and copy carry the
 * meaning — so the SVG is `aria-hidden`.
 */
export function EngineScene({
  htmlId,
  animationLevel = 'subtle',
  ground = 'deep',
}: EngineSceneProps) {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    if (animationLevel === 'none' || prefersReducedMotion()) return;
    const section = scope.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / runway));
      section.style.setProperty('--scene-progress', progress.toFixed(4));
    };

    // A frame loop rather than a scroll listener: this page runs Lenis, so the
    // scroll position is interpolated between events. Reading it every frame —
    // and only while the section is on screen — keeps the assembly in step with
    // the page whoever is driving it.
    let frame = 0;
    let running = false;
    const tick = () => {
      update();
      if (running) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === running) return;
      running = entry.isIntersecting;
      if (running) frame = requestAnimationFrame(tick);
      else cancelAnimationFrame(frame);
    });

    update();
    observer.observe(section);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [animationLevel]);

  return (
    <section
      ref={scope}
      id={htmlId}
      // The runway: 220svh of section for 100svh of sticky frame. Shorten it to
      // make the assembly read faster against the same scroll.
      className={`engine-scene bg-background text-foreground relative h-[220svh] ${
        ground === 'deep' ? 'scene-ground-deep' : ''
      }`}
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
        <svg
          aria-hidden="true"
          viewBox={VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          className="scene-svg h-full w-full"
        >
          {/* 1 — the raw market: a lattice that settles, then fills with nodes. */}
          <g className="scene-plane scene-plane-ground">
            <polygon
              className="scene-outline scene-outline-ground"
              points={polygonPoints(groundOutline)}
              style={{ '--len': round(pathLength(groundOutline)) } as CSSProperties}
            />
            <g className="scene-grid">
              {groundLines.map((line, index) => (
                <line
                  key={`gl-${index}`}
                  className={line.i % 2 === 1 ? 'scene-fine' : undefined}
                  x1={round(line.a.x)}
                  y1={round(line.a.y)}
                  x2={round(line.b.x)}
                  y2={round(line.b.y)}
                />
              ))}
            </g>
            {groundBands.map((band, index) => (
              <g
                key={`band-${index}`}
                className="scene-band"
                style={{ '--d': normalise(index, 0, BANDS - 1) } as CSSProperties}
              >
                {band.map((point) => (
                  <circle
                    key={`n-${point.ix}-${point.iy}`}
                    className={`scene-node-ground${
                      point.ix % 2 === 1 || point.iy % 2 === 1 ? ' scene-fine' : ''
                    }`}
                    cx={round(point.x)}
                    cy={round(point.y)}
                    r={2.4}
                  />
                ))}
              </g>
            ))}
          </g>

          {/* 2 — plumb lines tying the three planes into one funnel. */}
          <g className="scene-guides">
            {crownBoxes.map((box, index) => (
              <line
                key={`guide-${index}`}
                className="scene-guide"
                x1={round(box.guide.a.x)}
                y1={round(box.guide.a.y)}
                x2={round(box.guide.b.x)}
                y2={round(box.guide.b.y)}
              />
            ))}
          </g>

          {/* 3 — verification: links draw across the subset, then its nodes light. */}
          <g className="scene-plane scene-plane-middle">
            <polygon
              className="scene-outline scene-outline-middle"
              points={polygonPoints(middleOutline)}
              style={{ '--len': round(pathLength(middleOutline)) } as CSSProperties}
            />
            {middleEdges.map((edge, index) => (
              <line
                key={`edge-${index}`}
                className="scene-edge"
                x1={round(edge.from.x)}
                y1={round(edge.from.y)}
                x2={round(edge.to.x)}
                y2={round(edge.to.y)}
                style={
                  {
                    '--len': round(edge.len),
                    '--d': normalise(edge.depth, middleDepth.min, middleDepth.max),
                  } as CSSProperties
                }
              />
            ))}
            {middleNodes.map((node, index) => (
              <circle
                key={`mid-${index}`}
                className="scene-node-mid"
                cx={round(node.x)}
                cy={round(node.y)}
                r={5}
                style={
                  {
                    '--d': normalise(node.gx + node.gy, middleDepth.min, middleDepth.max),
                  } as CSSProperties
                }
              />
            ))}
          </g>

          {/* 4 — prioritisation: four accounts resolve, then their scores arrive. */}
          <g className="scene-plane scene-plane-crown">
            <polygon
              className="scene-outline scene-outline-crown"
              points={polygonPoints(crownOutline)}
              style={{ '--len': round(pathLength(crownOutline)) } as CSSProperties}
            />
            {crownBoxes.map((box, index) => (
              <g
                key={`box-${index}`}
                className="scene-cube"
                style={{ '--d': box.depth } as CSSProperties}
              >
                <polygon className="scene-cube-face" points={polygonPoints(box.top)} />
                {box.edges.map((edge, edgeIndex) => (
                  <line
                    key={`ce-${edgeIndex}`}
                    x1={round(edge[0].x)}
                    y1={round(edge[0].y)}
                    x2={round(edge[1].x)}
                    y2={round(edge[1].y)}
                  />
                ))}
              </g>
            ))}
            {crownBoxes.map((box, index) => (
              <text
                key={`score-${index}`}
                className="scene-score font-mono"
                x={round(box.label.x)}
                y={round(box.label.y)}
                style={{ '--d': box.depth } as CSSProperties}
              >
                {box.score}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}

