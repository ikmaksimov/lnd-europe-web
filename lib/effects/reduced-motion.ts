/**
 * Trencadís Effects — the reduced-motion guard every effect calls first.
 *
 * Read synchronously inside the effect that would start the animation, so that
 * under `prefers-reduced-motion: reduce` we return BEFORE creating any timer,
 * rAF or observer — not merely "start it and skip the frames". The element is
 * already rendering its final state (effects always render the finished value on
 * the server), so bailing out is the whole implementation of reduced motion.
 *
 * Deliberately no `matchMedia` change listener: a listener would itself be a
 * subscription started under reduced motion, and the setting virtually never
 * changes mid-visit. See docs/EFFECTS.md.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * True on touch/pen-first devices. A pointer-following effect is nonsense there
 * (there is no hovering cursor to follow), so `Magnetic` opts out entirely.
 */
export function isCoarsePointer(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches
  );
}
