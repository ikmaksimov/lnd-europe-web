'use client';

import { useId, useRef, type ReactNode } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';

export interface Feature12Point {
  /** Optional decorative mark, code-level only and never PageDoc content. */
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface Features12Props extends BlockBaseProps {
  heading?: string;
  lead?: string;
  points?: readonly Feature12Point[];
  /** Root for this instance's DOM ids (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_POINTS: readonly Feature12Point[] = [
  {
    title: 'A calm local rhythm',
    description: 'Regular care follows the seasons and the way you use your home.',
  },
  {
    title: 'Useful details, close at hand',
    description: 'Clear updates make the next decision feel informed, never urgent.',
  },
];

export const defaults = {
  heading: 'Care that makes distance feel lighter.',
  lead: 'A familiar local team keeps the practical details moving, so every return begins with confidence.',
} as const;

/**
 * features-12 — an editorial 1:2 text split with a lead paragraph and two
 * titled points. Optional code-level icons add a compact mark without reserving
 * space in the default icon-free composition.
 */
export function Features12({
  heading = defaults.heading,
  lead = defaults.lead,
  points = DEFAULT_POINTS,
  htmlId,
  animationLevel = 'subtle',
}: Features12Props) {
  const scope = useRef<HTMLElement>(null);
  const pointsRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, () => {
    fadeIn(scope.current?.querySelector('[data-f12-heading]'));
    staggerChildren(pointsRef.current, { stagger: 0.1 });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <h2
            id={titleId}
            data-f12-heading
            className="font-display text-foreground max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {heading}
          </h2>
          <div className="mt-10 max-w-3xl lg:mt-0">
            {lead ? <p className="text-muted text-lg leading-relaxed">{lead}</p> : null}
            <ul ref={pointsRef} className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-10">
              {points.map((point) => (
                <li key={point.title}>
                  {point.icon ? (
                    <span aria-hidden="true" className="text-foreground mb-4 inline-flex">
                      {point.icon}
                    </span>
                  ) : null}
                  <h3 className="font-display text-foreground text-lg font-semibold">
                    {point.title}
                  </h3>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
