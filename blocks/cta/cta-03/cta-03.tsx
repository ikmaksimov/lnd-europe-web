'use client';

import { useId, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, textReveal } from '@/lib/animations/presets';

interface Cta {
  label: string;
  href: string;
  /** Decorative leading icon; code-level only, never PageDoc content. */
  icon?: ReactNode;
}

type ActionCorners = 'default' | 'sharp';

export interface Cta03Props extends BlockBaseProps {
  title?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Applies the same corner treatment to the primary and secondary CTAs. */
  actionCorners?: ActionCorners;
  /** Hero of a client page can open as h1; h2 elsewhere. */
  headingLevel?: 'h1' | 'h2';
  /** Fill the viewport (min-h-svh, vertically centered) instead of using padding. */
  fullHeight?: boolean;
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

/**
 * cta-03 — inverted duo CTA: a centered two-line heading over a dark band with
 * two pill buttons side by side (stacked on mobile). Minimal by design — no icon,
 * no subtitle. A confident, high-contrast decision point.
 */
export function Cta03({
  title = 'Your coast home, always in good hands.',
  primaryCta = { label: 'Request a visit', href: '#contact' },
  secondaryCta = { label: 'See the plans', href: '#pricing' },
  actionCorners = 'default',
  headingLevel = 'h2',
  fullHeight = false,
  htmlId,
  animationLevel = 'subtle',
}: Cta03Props) {
  const scope = useRef<HTMLElement>(null);
  // The heading is targeted by ref, not by an id selector: instance ids come from
  // useId and are not guaranteed to be valid CSS selectors.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;
  const Heading = headingLevel;
  const actionContent = (action: Cta) =>
    action.icon ? (
      <>
        <span aria-hidden="true" className="shrink-0">
          {action.icon}
        </span>
        <span>{action.label}</span>
      </>
    ) : (
      action.label
    );

  useBlockAnimation(animationLevel, scope, (level) => {
    const root = scope.current;
    if (!root) return;
    if (level === 'rich') {
      textReveal(titleRef.current, { type: 'lines' });
    } else {
      fadeIn(titleRef.current);
    }
    fadeIn(root.querySelector('[data-cta3-actions]'), { delay: 0.15 });
  });

  return (
    <section
      ref={scope}
      aria-labelledby={titleId}
      className="bg-primary text-primary-foreground"
    >
      <div
        className={[
          'mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6',
          fullHeight ? 'min-h-svh justify-center py-20' : 'py-24 lg:py-28',
        ].join(' ')}
      >
        <Heading
          id={titleId}
          ref={titleRef}
          className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl"
        >
          {title}
        </Heading>

        <div
          data-cta3-actions
          className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            href={primaryCta.href}
            className={[
              'bg-primary-foreground text-primary inline-flex items-center justify-center',
              actionCorners === 'sharp' ? 'rounded-none' : 'rounded-full',
              primaryCta.icon ? 'gap-2' : null,
              'px-7 py-3 text-base font-medium transition-opacity hover:opacity-90',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {actionContent(primaryCta)}
          </Link>
          {secondaryCta ? (
            <Link
              href={secondaryCta.href}
              className={[
                'border-primary-foreground/25 text-primary-foreground hover:bg-primary-foreground/10 inline-flex items-center justify-center',
                actionCorners === 'sharp' ? 'rounded-none' : 'rounded-full',
                secondaryCta.icon ? 'gap-2' : null,
                'border px-7 py-3 text-base font-medium transition-colors',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {actionContent(secondaryCta)}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
