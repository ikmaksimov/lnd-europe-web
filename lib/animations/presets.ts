/**
 * Trencadís Motion — the shared GSAP preset vocabulary.
 * --------------------------------------------------------------------------
 * Blocks NEVER write bespoke GSAP; they call these presets from inside a
 * `useBlockAnimation` scope. One place to tune easing/durations for the whole
 * library, one consistent motion signature across every client site.
 *
 * Contract every preset upholds (docs/BLOCK-SPEC.md § Animations):
 *  - Progressive enhancement: markup is fully visible with no JS. The hidden
 *    start state is applied here via `gsap.set`, never in the block's classes.
 *  - `prefers-reduced-motion: reduce` → the preset makes NO motion and leaves
 *    content in its final, visible state.
 *  - Scroll presets fire once, when the element enters the viewport.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/** True when the visitor asked the OS to minimise motion. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type Target = Element | null | undefined;

const DEFAULT_START = 'top 85%';
const EASE = 'power2.out';

interface EnterOptions {
  /** ScrollTrigger start position. */
  start?: string;
  /** Seconds. */
  duration?: number;
  /** Seconds of delay before the tween. */
  delay?: number;
  /** Vertical travel in px (for translate-based presets). */
  y?: number;
}

/** Fade + rise into place as the element scrolls in. */
export function fadeUp(target: Target, options: EnterOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const { start = DEFAULT_START, duration = 0.7, delay = 0, y = 24 } = options;
  gsap.set(target, { autoAlpha: 0, y });
  gsap.to(target, {
    autoAlpha: 1,
    y: 0,
    duration,
    delay,
    ease: EASE,
    scrollTrigger: { trigger: target, start, once: true },
  });
}

/** Plain fade-in, no movement. */
export function fadeIn(target: Target, options: EnterOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const { start = DEFAULT_START, duration = 0.8, delay = 0 } = options;
  gsap.set(target, { autoAlpha: 0 });
  gsap.to(target, {
    autoAlpha: 1,
    duration,
    delay,
    ease: EASE,
    scrollTrigger: { trigger: target, start, once: true },
  });
}

interface StaggerOptions extends EnterOptions {
  /** Seconds between each child. */
  stagger?: number;
  /** Optional selector for descendants to animate (defaults to direct children). */
  selector?: string;
}

/**
 * Fade + rise a container's children with a stagger. Perfect for card grids.
 * The container itself stays put; only its children animate.
 */
export function staggerChildren(container: Target, options: StaggerOptions = {}): void {
  if (!container) return;
  const {
    start = DEFAULT_START,
    duration = 0.6,
    y = 20,
    stagger = 0.1,
    selector,
  } = options;
  const children = selector
    ? Array.from(container.querySelectorAll(selector))
    : Array.from(container.children);
  if (children.length === 0) return;
  if (prefersReducedMotion()) return;

  gsap.set(children, { autoAlpha: 0, y });
  gsap.to(children, {
    autoAlpha: 1,
    y: 0,
    duration,
    ease: EASE,
    stagger,
    scrollTrigger: { trigger: container, start, once: true },
  });
}

interface TextRevealOptions extends EnterOptions {
  /** Split granularity. Lines read best for headings. */
  type?: 'lines' | 'words';
  stagger?: number;
}

/**
 * Reveal a heading line-by-line (or word-by-word) using SplitText — bundled
 * free with GSAP 3.13+. The SplitText instance is created inside the caller's
 * useGSAP scope, so it is reverted automatically on cleanup.
 */
export function textReveal(target: Target, options: TextRevealOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const {
    start = DEFAULT_START,
    duration = 0.8,
    type = 'lines',
    stagger = 0.12,
  } = options;

  const split = new SplitText(target as HTMLElement, {
    type,
    linesClass: 'split-line',
  });
  const parts = type === 'lines' ? split.lines : split.words;

  gsap.set(parts, { yPercent: 110, autoAlpha: 0 });
  gsap.to(parts, {
    yPercent: 0,
    autoAlpha: 1,
    duration,
    ease: EASE,
    stagger,
    scrollTrigger: { trigger: target, start, once: true },
  });
}

interface TextScrubOptions {
  /** ScrollTrigger start position. */
  start?: string;
  /** ScrollTrigger end position — paint completes here. */
  end?: string;
  /** Element whose geometry drives the paint (defaults to `target`). */
  trigger?: Element | null;
  /** Dimmed starting opacity of each paint unit (word or character, 0–1). */
  from?: number;
  /** Offset between paint units within the scrubbed timeline (higher = more sequential). */
  stagger?: number;
  /** Split by character and add a short token-driven sheen at the paint edge. */
  gradientFrontier?: boolean;
  /** Number of characters carrying the transient sheen. */
  frontierWidth?: number;
}

/**
 * Scroll-tinted text with two compatible modes. The default path splits into
 * words, each dimmed at first and "painted in" (opacity `from` → 1) as the
 * section scrolls through the viewport. The opt-in `gradientFrontier` path
 * splits into characters instead, adding a short CSS gradient class only at the
 * active paint edge. Progress is bound to scroll position (`scrub`), so
 * scrolling back dims and restores the matching words or characters.
 *
 * The default path animates only opacity. The frontier path still lets GSAP own
 * only progress and opacity: its CSS gradient reads live theme variables, so no
 * colours are parsed or cached in JavaScript. With reduced motion the preset
 * does nothing and the text is fully readable; without JS the text is fully
 * visible (the dim start state is applied here via `gsap.set`, never in markup).
 */
export function textScrub(target: Target, options: TextScrubOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const {
    start = 'top 80%',
    end = 'bottom 65%',
    trigger,
    from = 0.2,
    stagger = 0.4,
    gradientFrontier = false,
    frontierWidth = 2,
  } = options;

  // Preserve statement-01's word-level scrub and all of its defaults exactly.
  if (!gradientFrontier) {
    const split = new SplitText(target as HTMLElement, {
      type: 'words',
      wordsClass: 'scrub-word',
    });

    gsap.set(split.words, { opacity: from });
    gsap.to(split.words, {
      opacity: 1,
      ease: 'none',
      stagger,
      scrollTrigger: { trigger: trigger ?? target, start, end, scrub: true },
    });
    return;
  }

  const split = new SplitText(target as HTMLElement, {
    type: 'chars',
    charsClass: 'scrub-char',
  });
  const chars = split.chars as HTMLElement[];
  if (chars.length === 0) return;

  gsap.set(chars, { opacity: from });
  let tween: gsap.core.Tween | undefined;
  const updateFrontier = () => {
    if (!tween) return;
    const progress = tween.progress();
    chars.forEach((char) => char.classList.remove('scrub-frontier'));

    // At either resting endpoint there is no sheen: completed text is plain
    // foreground and upcoming text is only opacity-muted.
    if (progress <= 0 || progress >= 1) return;

    const startIndex = Math.min(chars.length - 1, Math.floor(progress * chars.length));
    const endIndex = Math.min(chars.length, startIndex + frontierWidth);
    for (let index = startIndex; index < endIndex; index += 1) {
      chars[index]?.classList.add('scrub-frontier');
    }
  };

  tween = gsap.to(chars, {
    opacity: 1,
    ease: 'none',
    stagger,
    onUpdate: updateFrontier,
    scrollTrigger: { trigger: trigger ?? target, start, end, scrub: true },
  });
  updateFrontier();
}

interface InlineExpandOptions {
  /** Target natural width to expand to. Defaults to the element's CSS width
   *  (usually an em-based value set by the block, so it scales with font size). */
  width?: string;
  start?: string;
  end?: string;
}

/**
 * Scroll-scrubbed width expansion for inline media inside text: the element
 * grows from `width: 0` to its natural (em-based) width as its line scrolls in,
 * and collapses back on scroll-up (`scrub`). Pair with `overflow: hidden` and a
 * fixed-size, centered inner image so the reveal reads as an aperture opening,
 * not a squash.
 *
 * The collapsed start is applied here via `gsap.set` (never `width-0` in markup):
 * without JS the media renders at full width. Reduced-motion → no motion, full
 * width. The natural width is read before collapsing, so the block just sizes the
 * element with a class.
 */
export function inlineExpand(target: Target, options: InlineExpandOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const el = target as HTMLElement;
  const {
    width = getComputedStyle(el).width,
    start = 'top 80%',
    end = 'top 45%',
  } = options;

  gsap.set(el, { width: 0 });
  gsap.to(el, {
    width,
    ease: 'none',
    scrollTrigger: { trigger: el, start, end, scrub: true },
  });
}

interface ClassOnScrollOptions {
  /** Class(es) to toggle. */
  className: string;
  /** Element whose position drives the toggle (defaults to `target`). */
  trigger?: Element | null;
  start?: string;
  /** Keep threshold state (default) or apply the completed state under reduced motion. */
  reducedMotion?: 'threshold' | 'final';
}

/**
 * Toggle a class when a trigger crosses a scroll threshold (added on enter,
 * removed on leave-back). No tweens — state only; the block eases the visual
 * change with a CSS `transition` on token-driven properties. This is the
 * sanctioned pattern for scroll-linked theme/colour changes: colours never
 * animate in JS, only via CSS transitions between token values.
 *
 * Reduced motion preserves the threshold state by default, creating the same
 * state-only ScrollTrigger with the CSS transition collapsed globally. Opt in
 * to `reducedMotion: 'final'` for a static completed state with no trigger.
 */
export function classOnScroll(target: Target, options: ClassOnScrollOptions): void {
  if (!target) return;
  const el = target as HTMLElement;
  const {
    className,
    trigger = el,
    start = 'top 60%',
    reducedMotion = 'threshold',
  } = options;
  const classes = className.split(' ').filter(Boolean);

  if (prefersReducedMotion() && reducedMotion === 'final') {
    el.classList.add(...classes);
    return;
  }

  ScrollTrigger.create({
    trigger: trigger ?? el,
    start,
    onEnter: () => el.classList.add(...classes),
    onLeaveBack: () => el.classList.remove(...classes),
  });
}

interface ProgressVarOptions {
  /** CSS custom property receiving the 0–1 scrub progress. */
  property?: string;
  /** Element whose geometry drives the scrub (defaults to `target`). */
  trigger?: Element | null;
  /** ScrollTrigger start position. */
  start?: string;
  /** ScrollTrigger end position. */
  end?: string;
}

/**
 * Scrub 0–1 scroll progress into one CSS custom property. CSS can then derive
 * a large choreography from that single value, keeping the per-frame work
 * independent of the number of rendered elements. The stylesheet must default
 * the property to its finished value so no-JS and reduced-motion stay complete.
 */
export function progressVar(target: Target, options: ProgressVarOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const el = target as HTMLElement;
  const {
    property = '--play',
    trigger = el,
    start = 'top top',
    end = 'bottom bottom',
  } = options;

  gsap.set(el, { [property]: 0 });
  gsap.to(el, {
    [property]: 1,
    ease: 'none',
    scrollTrigger: { trigger: trigger ?? el, start, end, scrub: true },
  });
}

interface CounterOptions {
  /** Final numeric value to count up to. */
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  start?: string;
}

/**
 * Count a number from 0 up to `end` when it scrolls into view.
 * The block should render the FINAL value in markup (visible without JS);
 * this preset momentarily resets to 0 and animates up. With reduced motion it
 * simply writes the final value and does nothing else.
 */
export function counter(target: Target, options: CounterOptions): void {
  if (!target) return;
  const {
    end,
    duration = 1.6,
    decimals = 0,
    prefix = '',
    suffix = '',
    start = DEFAULT_START,
  } = options;
  const el = target as HTMLElement;
  const format = (value: number) => `${prefix}${value.toFixed(decimals)}${suffix}`;

  if (prefersReducedMotion()) {
    el.textContent = format(end);
    return;
  }

  const state = { value: 0 };
  el.textContent = format(0);
  gsap.to(state, {
    value: end,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      el.textContent = format(state.value);
    },
    scrollTrigger: { trigger: el, start, once: true },
  });
}

interface ParallaxOptions {
  /** Peak vertical offset in percent of the element height. */
  amount?: number;
}

/**
 * Subtle scrubbed vertical parallax. Wrap the image in an overflow-hidden box
 * and give the image a little extra height (e.g. scale-110) so edges never show.
 */
export function parallaxImage(target: Target, options: ParallaxOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const { amount = 8 } = options;
  gsap.fromTo(
    target,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );
}

interface CollageExpandOptions {
  /** Element whose scroll passage controls the reversible choreography. */
  trigger?: Element | null;
  /** The left and right media groups, in that order. */
  sideGroups: Array<Element | null | undefined>;
  /** ScrollTrigger start position. */
  start?: string;
  /** ScrollTrigger end position. */
  end?: string;
  /** Final multiplier for the centre media's layout width. */
  expansion?: number;
  /** Outward horizontal travel of each side group, in its own width percent. */
  sideOffset?: number;
}

/**
 * Reversible scroll collage choreography: centre media widens as the left/right
 * groups move outward and soften. Its 100% → percentage width target stays
 * responsive across ScrollTrigger refreshes, and the block centres the wrapper
 * in its grid area so the reveal grows symmetrically. The inner image keeps an
 * isotropic rendered aspect; the block supplies an overflow-hidden frame.
 * Static markup remains the full five-part collage, and reduced-motion leaves
 * that complete state untouched.
 */
export function collageExpand(target: Target, options: CollageExpandOptions): void {
  if (!target || prefersReducedMotion()) return;
  const {
    trigger = target,
    sideGroups,
    start = 'top bottom',
    end = 'bottom top',
    expansion = 1.8,
    sideOffset = 88,
  } = options;
  const centre = target as HTMLElement;
  const sides = sideGroups.filter((group): group is Element => Boolean(group));
  if (!trigger || sides.length === 0) return;

  const timeline = gsap.timeline({
    scrollTrigger: { trigger, start, end, scrub: true },
  });
  timeline.fromTo(
    centre,
    { width: '100%' },
    { width: `${expansion * 100}%`, ease: 'none' },
    0
  );
  sides.forEach((side, index) => {
    timeline.to(
      side,
      { xPercent: index === 0 ? -sideOffset : sideOffset, opacity: 0.18, ease: 'none' },
      0
    );
  });
}
