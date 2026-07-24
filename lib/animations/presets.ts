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
  /** Dimmed starting opacity of each word (0–1). */
  from?: number;
  /** Per-word offset within the scrubbed timeline (higher = more sequential). */
  stagger?: number;
}

/**
 * Scroll-tinted text: split into words, each dimmed at first and "painted in"
 * (opacity `from` → 1) as the section scrolls through the viewport. Progress is
 * bound to scroll position (`scrub`), so scrolling back dims the words again.
 *
 * Only opacity animates — never colour — so the theme's `text-foreground` stays
 * authoritative and no tokens are parsed. With reduced motion the preset does
 * nothing and the text is fully readable; without JS the text is fully visible
 * (the dim start state is applied here via `gsap.set`, never in markup).
 */
export function textScrub(target: Target, options: TextScrubOptions = {}): void {
  if (!target || prefersReducedMotion()) return;
  const { start = 'top 80%', end = 'bottom 65%', from = 0.2, stagger = 0.4 } = options;

  const split = new SplitText(target as HTMLElement, {
    type: 'words',
    wordsClass: 'scrub-word',
  });

  gsap.set(split.words, { opacity: from });
  gsap.to(split.words, {
    opacity: 1,
    ease: 'none',
    stagger,
    scrollTrigger: { trigger: target, start, end, scrub: true },
  });
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
}

/**
 * Toggle a class when a trigger crosses a scroll threshold (added on enter,
 * removed on leave-back). No tweens — state only; the block eases the visual
 * change with a CSS `transition` on token-driven properties. This is the
 * sanctioned pattern for scroll-linked theme/colour changes: colours never
 * animate in JS, only via CSS transitions between token values.
 *
 * Not guarded by reduced-motion — it flips state, not motion; the global
 * reduced-motion rule collapses the block's CSS transition to an instant change.
 */
export function classOnScroll(target: Target, options: ClassOnScrollOptions): void {
  if (!target) return;
  const el = target as HTMLElement;
  const { className, trigger = el, start = 'top 60%' } = options;
  const classes = className.split(' ').filter(Boolean);

  ScrollTrigger.create({
    trigger: trigger ?? el,
    start,
    onEnter: () => el.classList.add(...classes),
    onLeaveBack: () => el.classList.remove(...classes),
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
