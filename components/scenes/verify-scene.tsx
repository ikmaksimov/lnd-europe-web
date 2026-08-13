'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/effects';
import { ISO_SIN, polygonPoints, squareViewBoxOf } from './isometric';
import {
  CARD_UNIT,
  isConfirmed,
  marketDepth,
  marketDepthOf,
  marketGridLines,
  marketNodes,
  marketOutline,
} from './market-grid';

const round = (n: number) => Number(n.toFixed(1));

const VIEW_BOX = squareViewBoxOf(marketOutline, 24);

/**
 * The sweep contour for a given depth (gx + gy) is a straight, PERFECTLY
 * horizontal line: the projection's screen-y is `(x + y) * sin(30°) - z`, which
 * depends only on x + y, not on x - y. So "everything at this depth" is exactly
 * "everything at this screen-y" — the sweep line is computed analytically, not
 * approximated, and needs no per-frame geometry.
 */
const SWEEP_Y_MIN = round(marketDepth.min * ISO_SIN * CARD_UNIT);
const SWEEP_Y_MAX = round(marketDepth.max * ISO_SIN * CARD_UNIT);
const SWEEP_SPAN = { x1: round(VIEW_BOX.x - 10), x2: round(VIEW_BOX.x + VIEW_BOX.width + 10) };

/**
 * verify-scene — card 02 of the engine trio: "verified before it reaches you".
 * Picks up the SAME field `market-scene` finishes on (`market-grid.ts`) and
 * passes a single verification sweep across it: a horizontal band travels the
 * plane once, and each node resolves as the sweep reaches it — confirmed
 * (crisp, on `--brand`) or dropped (dimmed, shrinking). Confirmed accounts are
 * a deliberate minority: the point of the card is that most of the field does
 * not survive verification.
 *
 * One continuous beat rather than several stages, so `--scene-progress` drives
 * the sweep and every node's resolution directly — no intermediate `--stage-*`
 * windows the way `engine-scene`'s four-part assembly needs them.
 *
 * Same contract as every scene in this family: `prefersReducedMotion()` before
 * any observer or frame, IntersectionObserver-gated rAF, full teardown, CSS
 * default = finished (fully resolved, sweep off-screen). Ground is painted as
 * an in-SVG `<rect>` so the card is self-contained wherever it is dropped.
 */
export function VerifyScene() {
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
    <div ref={scope} className="verify-scene scene-ground-deep absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox={VIEW_BOX.viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg h-full w-full"
      >
        <rect x={VIEW_BOX.x} y={VIEW_BOX.y} width={VIEW_BOX.width} height={VIEW_BOX.height} fill="var(--background)" />

        {/* Already established by market-scene, so this plane starts fully
            drawn — no draw-in animation on the outline or the grid here. */}
        <polygon className="verify-outline" points={polygonPoints(marketOutline)} />

        <g className="verify-grid">
          {marketGridLines.map((line, index) => (
            <line key={index} x1={round(line.a.x)} y1={round(line.a.y)} x2={round(line.b.x)} y2={round(line.b.y)} />
          ))}
        </g>

        {marketNodes.map((node, i) => {
          const confirmed = isConfirmed(node);
          const d = marketDepthOf(node);
          return (
            <g key={i} className="verify-node" style={{ '--d': d } as CSSProperties}>
              <circle
                className={confirmed ? 'verify-dot verify-dot-confirmed' : 'verify-dot verify-dot-dropped'}
                cx={round(node.x)}
                cy={round(node.y)}
                r={3}
              />
              {confirmed ? (
                <circle className="verify-glow" cx={round(node.x)} cy={round(node.y)} r={4.6} />
              ) : null}
            </g>
          );
        })}

        <line
          className="verify-sweep"
          x1={SWEEP_SPAN.x1}
          y1={0}
          x2={SWEEP_SPAN.x2}
          y2={0}
          style={{ '--sweep-min': SWEEP_Y_MIN, '--sweep-range': SWEEP_Y_MAX - SWEEP_Y_MIN } as CSSProperties}
        />
      </svg>
    </div>
  );
}
