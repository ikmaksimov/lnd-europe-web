'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/effects';
import {
  boxCorners,
  boxEdges,
  distance,
  polygonPoints,
  project,
  quadPolygon,
  squareViewBoxOf,
  type Point2,
} from './isometric';
import { CARD_UNIT, confirmedNodes } from './market-grid';

const round = (n: number) => Number(n.toFixed(1));

/** Three levels, low to high, echoing the same vertical funnel `engine-scene`
 *  reads top to bottom: confirmed accounts → the channels that reach them →
 *  the one point everything lands in. */
const MID_Z = 3.4;
// Was 6.6 — lowered to close some of the vertical gap the CRM box needs above
// the anchors (see VIEW_BOX below): still a clear 14+ unit gap above the
// anchor layer at MID_Z, box doesn't touch or visually merge with it.
const CRM_Z = 5.4;
const CRM_ORIGIN = { x: -0.55, y: -0.55, z: CRM_Z };
const CRM_SIZE = { x: 1.1, y: 1.1, z: 1.1 };

/** Three or four channel anchors, spread around the confirmed cluster. */
const ANCHORS: ReadonlyArray<{ gx: number; gy: number }> = [
  { gx: -1.7, gy: -1.7 },
  { gx: 1.7, gy: -1.7 },
  { gx: -1.7, gy: 1.7 },
  { gx: 1.7, gy: 1.7 },
];

const confirmedPoints = confirmedNodes.map((n) => ({ x: n.x, y: n.y }));

const anchorProjected = ANCHORS.map((a) => project({ x: a.gx, y: a.gy, z: MID_Z }, CARD_UNIT));
const anchorSquares = ANCHORS.map((a) =>
  quadPolygon(a.gx - 0.42, a.gy - 0.42, a.gx + 0.42, a.gy + 0.42, MID_Z, CARD_UNIT)
);

/** Each confirmed account reaches out to its nearest channel anchor. */
const outboundEdges = confirmedNodes.map((node, i) => {
  let best = 0;
  let bestD = Infinity;
  ANCHORS.forEach((a, ai) => {
    const d = Math.hypot(node.gx - a.gx, node.gy - a.gy);
    if (d < bestD) {
      bestD = d;
      best = ai;
    }
  });
  const to = anchorProjected[best];
  return {
    from: { x: node.x, y: node.y },
    to,
    len: distance({ x: node.x, y: node.y }, to),
    d: confirmedNodes.length > 1 ? i / (confirmedNodes.length - 1) : 0,
  };
});

/** Every anchor's path converges on the same point: the CRM box's base centre. */
const crmLanding = project({ x: 0, y: 0, z: CRM_Z }, CARD_UNIT);
const inboundEdges = anchorProjected.map((pt, i) => ({
  from: pt,
  to: crmLanding,
  len: distance(pt, crmLanding),
  d: anchorProjected.length > 1 ? i / (anchorProjected.length - 1) : 0,
}));

const crmCorners = boxCorners(CRM_ORIGIN, CRM_SIZE, CARD_UNIT);
const crmTop = crmCorners.slice(4);
const crmEdges = boxEdges(CRM_ORIGIN, CRM_SIZE, CARD_UNIT);

const framePoints: Point2[] = [...confirmedPoints, ...anchorSquares.flat(), ...crmTop];
// This scene is taller than it is wide before squaring (the CRM box sits well
// above the confirmed accounts), so squareViewBoxOf pads the sides generously
// but the TOP and BOTTOM padding is only this value. Was 42 (up from an
// earlier 26), which left ~9.7% vertical content margin — fine on the square
// desktop slot (552×529) but at the real mobile card ratio (343×288,
// landscape, `xMidYMid slice`) the crop is ~8% of the viewBox off top AND
// bottom, leaving only ~0.7% headroom before the CRM box or the lowest
// confirmed node actually clips. Paired with lowering CRM_Z above (which
// shortens the frame's content height from ~348 to ~308 units), 100 gives
// ~19% vertical content margin measured on the point geometry alone; measured
// against actual rendered bounds (getBBox, which includes stroke widths —
// circles, box edges) it lands at ~11–12% headroom after the mobile crop, a
// real buffer above the 10% floor rather than sitting right on it — see
// TASK-reach-scene-mobile-margin.md. Splitting the fix across both levers
// (rather than padding alone) keeps the horizontal margin's growth smaller
// too (~21% → ~25% instead of ~21% → ~27%), so the desktop diagram doesn't
// shrink as much inside its genuinely-square slot.
const VIEW_BOX = squareViewBoxOf(framePoints, 100);

/**
 * reach-scene — card 03 of the engine trio: "reached in the language they buy
 * in". The confirmed accounts (the same subset `verify-scene` resolves — see
 * `market-grid.ts`) are already established, so this card is only about the
 * paths: edges draw out to the channel anchors around them, then every
 * anchor's path converges downward into one collection point, the CRM.
 *
 * Two stages rather than `engine-scene`'s four — "distribution, then
 * convergence" is a two-part beat — but the same contract: one
 * `--scene-progress`, `prefersReducedMotion()` before any observer or frame,
 * IntersectionObserver-gated rAF, full teardown, CSS default = finished. The
 * CRM box reuses the same wireframe-cube vocabulary as `engine-scene`'s crown
 * boxes, and ground is an in-SVG `<rect>` so the card carries its own
 * background wherever it lands.
 */
export function ReachScene() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = scope.current;
    if (!root) return;

    const update = () => {
      const rect = root.getBoundingClientRect();
      const start = window.innerHeight * 0.88;
      const end = window.innerHeight * 0.32;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
      root.style.setProperty('--scene-progress', progress.toFixed(4));
    };

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
    observer.observe(root);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    // absolute inset-0, not aspect-square — see market-scene.tsx for why: this
    // has to fill whatever box a `relative` ancestor gives it, matching
    // next/image's `fill`, not impose its own ratio.
    <div ref={scope} className="reach-scene scene-ground-deep absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox={VIEW_BOX.viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg h-full w-full"
      >
        <rect x={VIEW_BOX.x} y={VIEW_BOX.y} width={VIEW_BOX.width} height={VIEW_BOX.height} fill="var(--background)" />

        {/* The confirmed accounts: already established by the previous card,
            so they are static here — only the paths out of them are new. */}
        {confirmedPoints.map((p, i) => (
          <circle key={`c-${i}`} className="reach-confirmed" cx={round(p.x)} cy={round(p.y)} r={4.2} />
        ))}

        {outboundEdges.map((edge, i) => (
          <line
            key={`out-${i}`}
            className="reach-edge-out"
            x1={round(edge.from.x)}
            y1={round(edge.from.y)}
            x2={round(edge.to.x)}
            y2={round(edge.to.y)}
            style={{ '--len': round(edge.len), '--d': Number(edge.d.toFixed(3)) } as CSSProperties}
          />
        ))}

        {ANCHORS.map((_a, i) => (
          <g key={`anchor-${i}`} className="reach-anchor" style={{ '--d': anchorProjected.length > 1 ? Number((i / (anchorProjected.length - 1)).toFixed(3)) : 0 } as CSSProperties}>
            <polygon className="reach-anchor-quiet" points={polygonPoints(anchorSquares[i])} />
            <polygon className="reach-anchor-lit" points={polygonPoints(anchorSquares[i])} />
          </g>
        ))}

        {inboundEdges.map((edge, i) => (
          <line
            key={`in-${i}`}
            className="reach-edge-in"
            x1={round(edge.from.x)}
            y1={round(edge.from.y)}
            x2={round(edge.to.x)}
            y2={round(edge.to.y)}
            style={{ '--len': round(edge.len), '--d': Number(edge.d.toFixed(3)) } as CSSProperties}
          />
        ))}

        <g className="reach-crm">
          <polygon className="reach-crm-face" points={polygonPoints(crmTop)} />
          {crmEdges.map((edge, i) => (
            <line key={i} x1={round(edge[0].x)} y1={round(edge[0].y)} x2={round(edge[1].x)} y2={round(edge[1].y)} />
          ))}
        </g>
      </svg>
    </div>
  );
}
