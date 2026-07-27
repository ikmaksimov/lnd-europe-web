'use client';

import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { isCoarsePointer, prefersReducedMotion } from './reduced-motion';

export interface MagneticProps {
  children: ReactNode;
  /** How far the child leans, as a fraction of the pointer's offset from centre. */
  strength?: number;
  /** Maximum travel in px, so a wide element cannot slide absurdly far. */
  max?: number;
  className?: string;
}

/**
 * Magnetic — leans its child toward the pointer and springs back on leave.
 *
 * Wrapper only: it never touches the child's own markup, so the child keeps its
 * focus ring, hover styles and click target. The wrapper adds no `tabIndex` and
 * no pointer-event overrides — it just transforms.
 *
 * Opted out entirely on **coarse pointers** (touch/pen): there is no hovering
 * cursor to follow, so the handlers return immediately and nothing is scheduled.
 * Same under reduced motion.
 *
 * Cleanup: the spring-back runs on rAF whose id lives in a ref and is cancelled
 * on unmount. Pointer handlers are React props, so React removes them.
 */
export function Magnetic({
  children,
  strength = 0.3,
  max = 12,
  className,
}: MagneticProps) {
  const hostRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const apply = useCallback((x: number, y: number) => {
    offsetRef.current = { x, y };
    const el = hostRef.current;
    // Written straight to the node: following a pointer through React state
    // would re-render on every mousemove for no benefit.
    if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  const disabled = useCallback(() => prefersReducedMotion() || isCoarsePointer(), []);

  const handleMove = useCallback(
    (event: PointerEvent<HTMLSpanElement>) => {
      if (disabled()) return;
      const el = hostRef.current;
      if (!el) return;
      cancelFrame();
      const rect = el.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const clamp = (value: number) => Math.max(-max, Math.min(max, value * strength));
      apply(clamp(dx), clamp(dy));
    },
    [apply, cancelFrame, disabled, max, strength]
  );

  const handleLeave = useCallback(() => {
    if (disabled()) return;
    cancelFrame();
    // Ease back to rest — a short exponential decay, no spring library needed.
    const step = () => {
      const { x, y } = offsetRef.current;
      const nextX = x * 0.82;
      const nextY = y * 0.82;
      if (Math.abs(nextX) < 0.3 && Math.abs(nextY) < 0.3) {
        apply(0, 0);
        frameRef.current = null;
        return;
      }
      apply(nextX, nextY);
      frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }, [apply, cancelFrame, disabled]);

  useEffect(() => cancelFrame, [cancelFrame]);

  return (
    <span
      ref={hostRef}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform' }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </span>
  );
}
