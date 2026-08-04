'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/effects';

/** A run of the paragraph: plain prose, or a phrase that lights up on scroll. */
export type StatementPart =
  | string
  | {
      text: string;
      icon: ReactNode;
      /** Where in the section's scroll runway this phrase starts, 0–1. */
      start: number;
    };

export interface StatementHighlightProps {
  eyebrow?: string;
  parts?: StatementPart[];
  htmlId?: string;
  /** `'none'` pins the finished state and registers no listeners. */
  animationLevel?: 'none' | 'subtle';
}

const isHighlight = (part: StatementPart): part is Exclude<StatementPart, string> =>
  typeof part !== 'string';

/**
 * statement-highlight — a large centred statement whose key phrases fill in as
 * the section scrolls: an icon chip opens on the left of each phrase, then the
 * phrase itself inverts left-to-right.
 *
 * Same runway trick as hero-blur: a tall section with a sticky inner frame. One
 * scroll listener writes `--statement-progress` on the section, and each phrase
 * derives two of its own properties from it (`--icon-progress`,
 * `--fill-progress`) using its `start` offset, so the phrases light in sequence
 * rather than together.
 *
 * Progressive enhancement: the CSS default is the finished state, so without
 * JavaScript — or under prefers-reduced-motion — the statement reads fully
 * highlighted. The paragraph is real text either way; the icons are decorative
 * and aria-hidden.
 */
export function StatementHighlight({
  eyebrow,
  parts = [],
  htmlId,
  animationLevel = 'subtle',
}: StatementHighlightProps) {
  const scope = useRef<HTMLElement>(null);
  const autoId = useId();
  const labelId = `${htmlId ?? autoId}-label`;

  useEffect(() => {
    if (animationLevel === 'none' || prefersReducedMotion()) return;
    const section = scope.current;
    if (!section) return;

    const phrases = Array.from(
      section.querySelectorAll<HTMLElement>('[data-highlight]')
    );

    const update = () => {
      const rect = section.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / runway));

      for (const phrase of phrases) {
        const start = Number(phrase.dataset.start ?? 0);
        // The chip opens quickly, then the fill sweeps just behind it.
        const icon = Math.min(1, Math.max(0, (progress - start) / 0.1));
        const fill = Math.min(1, Math.max(0, (progress - start - 0.055) / 0.2));
        phrase.style.setProperty('--icon-progress', icon.toFixed(3));
        phrase.style.setProperty('--fill-progress', fill.toFixed(3));
      }
    };
    // A frame loop rather than a scroll listener, and only while the section is
    // on screen: Lenis interpolates the scroll position between events, so
    // reading it per frame is what keeps the phrases in step with the page.
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
    observer.observe(section);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [animationLevel]);

  return (
    <section
      ref={scope}
      aria-labelledby={eyebrow ? labelId : undefined}
      aria-label={eyebrow ? undefined : 'Statement'}
      className="bg-background relative h-[190svh]"
    >
      <div className="sticky top-0 flex min-h-svh flex-col items-center justify-center px-4 py-24 sm:px-6">
        <div className="mx-auto w-full max-w-5xl text-center">
          {eyebrow ? (
            <p
              id={labelId}
              className="text-muted font-mono mb-10 text-[0.65rem] tracking-[0.14em] uppercase sm:text-xs"
            >
              {eyebrow}
            </p>
          ) : null}

          <p className="font-display text-foreground text-3xl leading-[1.15] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {parts.map((part, i) =>
              isHighlight(part) ? (
                <span
                  key={`${part.text}-${i}`}
                  data-highlight
                  data-start={part.start}
                  className="scroll-highlight"
                >
                  <span aria-hidden="true" className="scroll-highlight-icon">
                    {part.icon}
                  </span>
                  <span className="scroll-highlight-text">
                    <span aria-hidden="true" className="scroll-highlight-fill" />
                    <span className="scroll-highlight-copy">{part.text}</span>
                  </span>
                </span>
              ) : (
                <span key={`text-${i}`}>{part}</span>
              )
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
