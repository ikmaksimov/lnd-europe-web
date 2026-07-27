/**
 * Trencadís Effects — micro-interactions on individual elements.
 * --------------------------------------------------------------------------
 * The system's third class of motion, and deliberately NOT part of Trencadís
 * Motion (`lib/animations`):
 *
 *   Motion   — a section ARRIVING on scroll   → ScrollTrigger, `animationLevel`
 *   Effects  — an element BEHAVING            → hover, focus, mount, state
 *
 * So `counter` (fires on scroll) stays in Motion, while an odometer that reacts
 * to a value change would be an Effect. Effects use React + native APIs only —
 * **no GSAP**, so this sidecar has no cross-dependency on Motion — and no npm
 * packages at all.
 *
 * Applied by COMPOSITION: a page wraps the text or button it wants animated. No
 * block imports these, which is why adding effects carries zero regression risk
 * for the 26 blocks.
 *
 * Every effect upholds four rules (docs/EFFECTS.md):
 *   1. Assistive tech always reads the FINAL text — animating glyphs are
 *      `aria-hidden` behind an `sr-only` copy of the real string.
 *   2. `prefers-reduced-motion` returns before any timer/rAF/observer exists;
 *      the element simply shows its final state.
 *   3. Every timer, frame and observer is torn down on unmount and re-trigger.
 *   4. Progressive enhancement: the server renders the finished value, so the
 *      element is correct with no JS.
 *
 * A CSS-only effect does NOT belong here — it goes next to `bg-mesh` in
 * `globals.css` (see the `underline-draw` utility).
 */
export { ScrambleText, type ScrambleTextProps } from './scramble-text';
export { Typewriter, type TypewriterProps } from './typewriter';
export { Magnetic, type MagneticProps } from './magnetic';
export { prefersReducedMotion, isCoarsePointer } from './reduced-motion';
