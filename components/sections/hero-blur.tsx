'use client';

import { useEffect, useId, useRef } from 'react';
import Link from 'next/link';
import { prefersReducedMotion } from '@/lib/effects';

interface Cta {
  label: string;
  href: string;
}

export interface HeroBlurProps {
  eyebrow?: string;
  /** The headline as three parts: the two outer ones soften, the middle stays sharp. */
  words?: { left: string; focus: string; right: string };
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** A client hero is usually the page's single h1; h2 elsewhere. */
  headingLevel?: 'h1' | 'h2';
  /** Root for this instance's DOM ids, so the section can appear twice. */
  htmlId?: string;
  /** `'none'` pins the finished state and registers no listeners. */
  animationLevel?: 'none' | 'subtle';
}

/** Default editable content — single source of truth for props and a future
 *  Page Editor schema. Serializable scalars and object props only. */
export const defaults = {
  eyebrow: 'European B2B growth intelligence',
  words: { left: 'SEE', focus: 'EUROPE', right: 'CLEARLY.' },
  subtitle:
    'We continuously map, verify and prioritize the European companies that matter — then turn that intelligence into qualified demand.',
  primaryCta: { label: 'Map your market', href: '#contact' },
  secondaryCta: { label: 'Explore the engine', href: '#how-it-works' },
} as const;

/**
 * hero-blur — a full-viewport hero whose outer headline words sit softly out of
 * focus and pull apart as the section scrolls, leaving the middle word sharp.
 *
 * The section is deliberately taller than the viewport with a sticky inner
 * frame: that extra height is the scroll runway the effect reads. A rAF-batched
 * scroll listener writes one custom property, `--hero-progress`, and CSS does
 * the rest (see globals.css) — no layout is read or written per frame beyond a
 * single getBoundingClientRect.
 *
 * Progressive enhancement: the CSS default is the FINISHED state, so with no
 * JavaScript the headline renders spread and legible. `prefersReducedMotion`
 * and `animationLevel="none"` both simply skip the listener, leaving it there.
 *
 * The heading carries the full sentence as its accessible name and its three
 * spans are aria-hidden, so assistive tech reads one clean line.
 */
export function HeroBlur({
  eyebrow = defaults.eyebrow,
  words = defaults.words,
  subtitle = defaults.subtitle,
  primaryCta = defaults.primaryCta,
  secondaryCta = defaults.secondaryCta,
  headingLevel = 'h1',
  htmlId,
  animationLevel = 'subtle',
}: HeroBlurProps) {
  const scope = useRef<HTMLElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;
  const Heading = headingLevel;
  const headline = `${words.left} ${words.focus} ${words.right}`;

  useEffect(() => {
    if (animationLevel === 'none' || prefersReducedMotion()) return;
    const section = scope.current;
    if (!section) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / runway));
      section.style.setProperty('--hero-progress', progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [animationLevel]);

  return (
    <section
      ref={scope}
      aria-labelledby={titleId}
      // The runway: 160vh of section for 100vh of sticky frame.
      className="hero-blur theme-dark bg-background relative h-[160svh]"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        {/* Token-driven glow, the calm ground the type sits on. */}
        <div aria-hidden="true" className="bg-mesh absolute inset-0 opacity-40" />

        <div className="relative z-10 flex w-full flex-col items-center text-center">
          {eyebrow ? (
            <p className="text-muted font-mono mb-10 text-[0.65rem] tracking-[0.14em] uppercase sm:text-xs">
              {eyebrow}
            </p>
          ) : null}

          <Heading
            id={titleId}
            aria-label={headline}
            className="font-display m-0 flex flex-col items-center text-[19vw] leading-[0.85] font-medium tracking-[-0.06em] sm:flex-row sm:justify-center sm:text-[clamp(3.5rem,10vw,9rem)]"
          >
            <span aria-hidden="true" className="hero-blur-word hero-blur-word-left block">
              {words.left}
            </span>
            <span aria-hidden="true" className="relative z-10 block sm:mx-[0.08em]">
              {words.focus}
            </span>
            <span aria-hidden="true" className="hero-blur-word hero-blur-word-right block">
              {words.right}
            </span>
          </Heading>

          {subtitle ? (
            <p className="text-foreground/80 mt-12 max-w-lg text-base leading-relaxed sm:text-lg">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-10 flex w-full max-w-md flex-col gap-2 sm:w-auto sm:flex-row">
            <Link
              href={primaryCta.href}
              className="bg-brand text-primary-foreground inline-flex min-w-[11rem] items-center justify-between gap-6 px-5 py-4 text-sm font-medium transition-opacity hover:opacity-90"
            >
              {primaryCta.label}
              <span aria-hidden="true">↗</span>
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="bg-foreground text-background inline-flex min-w-[11rem] items-center justify-between gap-6 px-5 py-4 text-sm font-medium transition-opacity hover:opacity-90"
              >
                {secondaryCta.label}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
