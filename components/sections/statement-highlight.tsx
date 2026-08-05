'use client';

import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/effects';

/** A run of the statement: plain prose, or a phrase that earns an icon chip. */
export type StatementPart =
  | string
  | {
      text: string;
      icon: ReactNode;
      /** Where in the section's scroll runway the chip opens, 0–1. */
      start: number;
    };

export interface StatementHighlightProps {
  eyebrow?: string;
  parts?: StatementPart[];
  htmlId?: string;
  /** `'none'` pins the finished state and registers no listeners. */
  animationLevel?: 'none' | 'subtle';
}

const isChip = (part: StatementPart): part is Exclude<StatementPart, string> =>
  typeof part !== 'string';

/**
 * statement-highlight — a large centred statement that reads itself as the
 * section scrolls: words light in reading order behind a travelling band of the
 * brand blue, key phrases open an icon chip when the reading head reaches them,
 * and the whole section inverts from light to dark at the halfway mark.
 *
 * The section is taller than the viewport with a sticky inner frame; that extra
 * height is the runway. A rAF loop, gated by an IntersectionObserver so it costs
 * nothing off screen, writes just two properties on the section — `--play` and
 * `--flip` — plus one per chip. Every word then derives its own colour from its
 * index in CSS, so a forty-word paragraph still costs three style writes a frame
 * rather than forty.
 *
 * The inversion works by redefining `--background` and `--foreground` on the
 * section, so it reaches the ground, the type and the dim colour at once; no
 * element names a colour of its own.
 *
 * Progressive enhancement: the CSS defaults are the finished state, so with no
 * JavaScript — or under prefers-reduced-motion — the statement reads fully lit
 * on the light ground. The paragraph is real text throughout; chips are
 * decorative and aria-hidden.
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

  // Flatten the parts into words carrying a running index, so the reveal runs
  // across the whole paragraph rather than restarting at each phrase.
  const nodes: ReactNode[] = [];
  let wordIndex = 0;
  parts.forEach((part, partIndex) => {
    if (isChip(part)) {
      nodes.push(
        <span
          key={`chip-${partIndex}`}
          data-chip
          data-start={part.start}
          aria-hidden="true"
          className="statement-chip"
        >
          {part.icon}
        </span>
      );
    }
    const text = isChip(part) ? part.text : part;
    text.split(/(\s+)/).forEach((token, tokenIndex) => {
      if (!token) return;
      if (!token.trim()) {
        nodes.push(token);
        return;
      }
      nodes.push(
        <span
          key={`w-${partIndex}-${tokenIndex}`}
          className="statement-word"
          style={{ '--i': wordIndex } as CSSProperties}
        >
          {token}
        </span>
      );
      wordIndex += 1;
    });
  });
  const wordCount = wordIndex;

  useEffect(() => {
    if (animationLevel === 'none' || prefersReducedMotion()) return;
    const section = scope.current;
    if (!section) return;

    const chips = Array.from(section.querySelectorAll<HTMLElement>('[data-chip]'));

    const update = () => {
      const rect = section.getBoundingClientRect();
      const runway = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / runway));

      section.style.setProperty('--play', progress.toFixed(4));
      // The ground turns over the middle fifth of the runway.
      const flip = Math.min(1, Math.max(0, (progress - 0.42) / 0.16));
      section.style.setProperty('--flip', flip.toFixed(4));

      for (const chip of chips) {
        const start = Number(chip.dataset.start ?? 0);
        const open = Math.min(1, Math.max(0, (progress - start) / 0.08));
        chip.style.setProperty('--icon-progress', open.toFixed(3));
      }
    };

    // A frame loop rather than a scroll listener: this page runs Lenis, which
    // interpolates the scroll position between events, so per-frame reads are
    // what keep the reveal in step with the page.
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
      className="statement-scroll relative h-[190svh]"
      style={{ '--count': wordCount } as CSSProperties}
    >
      <div className="bg-background sticky top-0 flex min-h-svh flex-col items-center justify-center px-4 py-24 transition-none sm:px-6">
        <div className="mx-auto w-full max-w-5xl text-center">
          {eyebrow ? (
            <p
              id={labelId}
              className="font-mono mb-10 text-[0.65rem] tracking-[0.14em] uppercase sm:text-xs"
              style={{ color: 'var(--dim)' }}
            >
              {eyebrow}
            </p>
          ) : null}

          <p className="font-display text-3xl leading-[1.2] font-medium tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {nodes}
          </p>
        </div>
      </div>
    </section>
  );
}
