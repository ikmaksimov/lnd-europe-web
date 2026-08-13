'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/effects';
import { pathLength, polygonPoints, squareViewBoxOf, type Point2 } from './isometric';
import {
  isHighlighted,
  marketDepthOf,
  marketGridLines,
  marketNodes,
  marketOutline,
  marketScatter,
} from './market-grid';

const round = (n: number) => Number(n.toFixed(1));

/**
 * Every node in both its scattered starting position AND its final grid
 * position, so the viewBox is measured from whichever is wider — the scatter
 * reaches slightly outside the settled plane at the fringe.
 */
const framePoints: Point2[] = marketNodes.flatMap((node, i) => [
  { x: node.x, y: node.y },
  { x: node.x + marketScatter[i].dx, y: node.y + marketScatter[i].dy },
]);
const VIEW_BOX = squareViewBoxOf([...marketOutline, ...framePoints], 24);
const OUTLINE_LEN = round(pathLength(marketOutline));

/**
 * market-scene — card 01 of the engine trio: "the market, mapped continuously".
 * A dense, uniform field of quiet accounts starts scattered — the
 * undifferentiated market — then settles onto a lattice as the card scrolls
 * into view, and a handful brighten to `--brand` at the very end, hinting at
 * scoring without explaining it yet.
 *
 * Shares its field with `verify-scene` (`market-grid.ts`): scene 02 picks up
 * the SAME 36 accounts already organised, rather than drawing its own.
 *
 * Card-sized, not section-sized: no sticky runway. Progress is read from where
 * the card itself sits in the viewport — see the effect below — but the
 * contract is identical to every other scene: one `--scene-progress` written by
 * an IntersectionObserver-gated rAF loop, CSS default = finished,
 * `prefersReducedMotion()` returns before any observer or frame exists, full
 * teardown on unmount.
 *
 * The dark ground is painted as a `<rect>` INSIDE the SVG, not inherited from a
 * page scope: this is meant to drop into a `media: ReactNode` card slot on
 * whatever surface, so the scene has to carry its own background with it.
 */
export function MarketScene() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = scope.current;
    if (!root) return;

    const update = () => {
      const rect = root.getBoundingClientRect();
      // No dedicated scroll runway here — the card is normal page flow, not a
      // pinned section — so progress reads off the card's own position: it
      // starts as the card enters the lower part of the viewport and finishes
      // once the card has scrolled into the upper half, the usual "reveal on
      // the way up the screen" window.
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
    // absolute inset-0, not aspect-square: this is meant as a drop-in for
    // next/image's `fill` (features-06's current <Image fill object-cover />),
    // so it must fill whatever box its `relative` ancestor gives it — including
    // a not-quite-square one — rather than impose its own ratio. The 1:1
    // authoring lives in the viewBox; preserveAspectRatio="slice" below does
    // the actual cropping to match.
    <div ref={scope} className="market-scene scene-ground-deep absolute inset-0 overflow-hidden">
      <svg
        aria-hidden="true"
        viewBox={VIEW_BOX.viewBox}
        preserveAspectRatio="xMidYMid slice"
        className="scene-svg h-full w-full"
      >
        <rect x={VIEW_BOX.x} y={VIEW_BOX.y} width={VIEW_BOX.width} height={VIEW_BOX.height} fill="var(--background)" />

        <polygon
          className="market-outline"
          points={polygonPoints(marketOutline)}
          style={{ '--len': OUTLINE_LEN } as CSSProperties}
        />

        <g className="market-grid">
          {marketGridLines.map((line, index) => (
            <line
              key={index}
              x1={round(line.a.x)}
              y1={round(line.a.y)}
              x2={round(line.b.x)}
              y2={round(line.b.y)}
            />
          ))}
        </g>

        {marketNodes.map((node, i) => {
          const highlighted = isHighlighted(node);
          const d = marketDepthOf(node);
          return (
            <g
              key={i}
              className="market-node"
              style={{ '--dx': round(marketScatter[i].dx), '--dy': round(marketScatter[i].dy), '--d': d } as CSSProperties}
            >
              <circle className="market-node-dot" cx={round(node.x)} cy={round(node.y)} r={3} />
              {highlighted ? (
                <circle className="market-node-glow" cx={round(node.x)} cy={round(node.y)} r={4.4} />
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
