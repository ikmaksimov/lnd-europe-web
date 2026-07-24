'use client';

import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import type { AnimationLevel } from './types';

/**
 * The single entry point every animated block uses to wire up motion.
 *
 * - When `level === 'none'` the setup never runs → no ScrollTriggers, no tweens
 *   are created. The block renders as pure static markup (this is exactly the
 *   mode the catalog uses for scaled previews). See docs/BLOCK-SPEC.md §8.
 * - Otherwise the setup runs inside a `useGSAP` scope, so every tween,
 *   ScrollTrigger and SplitText created within it is reverted automatically on
 *   unmount or when `level` changes.
 *
 * `setup` receives the effective level ('subtle' | 'rich') so a block can dial
 * in richer motion when asked.
 */
export function useBlockAnimation(
  level: AnimationLevel,
  scope: RefObject<HTMLElement | null>,
  setup: (level: 'subtle' | 'rich') => void
): void {
  // `dependencies: [level]` re-runs (and reverts) only when the level changes,
  // capturing that render's `setup` — fresh enough since block props are stable.
  useGSAP(
    () => {
      if (level === 'none') return;
      setup(level);
    },
    { scope, dependencies: [level] }
  );
}
