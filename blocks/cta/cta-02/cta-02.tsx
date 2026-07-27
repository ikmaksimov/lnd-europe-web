'use client';

import { useId, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, textReveal } from '@/lib/animations/presets';
import { BrandMark } from '@/lib/icons';

interface Cta {
  label: string;
  href: string;
}

export interface Cta02Props extends BlockBaseProps {
  /** Badge above the title (defaults to the inline tile mark). */
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  /** Superscript reference rendered after the subtitle, e.g. terms link. */
  footnote?: { marker: string; href: string };
  primaryCta?: Cta;
  /** Hero of a client page can open as h1; h2 elsewhere. */
  headingLevel?: 'h1' | 'h2';
  /** 'gradient' = CSS mesh built from tint tokens; 'plain' = flat surface. */
  background?: 'gradient' | 'plain';
  /** Fill the viewport (min-h-svh, vertically centered) instead of using padding. */
  fullHeight?: boolean;
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match cta-02.edit.ts (icon/headingLevel are not
 *  editable content, so they keep their own inline defaults). */
export const defaults = {
  title: 'Get started with Vora Mar.',
  subtitle:
    'Tell us about your villa and how you use it — we will send a tailored care plan within a day.',
  footnote: { marker: '*', href: '#terms' },
  primaryCta: { label: 'Request a visit', href: '#contact' },
  background: 'gradient',
  fullHeight: false,
} as const;

/**
 * cta-02 — centered "spotlight" CTA: icon badge → large two-line heading →
 * subtitle with optional footnote → one pill button, on a soft mesh gradient
 * built from the theme's tint tokens. A calm way to open or close a page.
 */
export function Cta02({
  icon,
  title = defaults.title,
  subtitle = defaults.subtitle,
  footnote = defaults.footnote,
  primaryCta = defaults.primaryCta,
  headingLevel = 'h2',
  background = defaults.background,
  fullHeight = defaults.fullHeight,
  htmlId,
  animationLevel = 'subtle',
}: Cta02Props) {
  const scope = useRef<HTMLElement>(null);
  // The heading is targeted by ref, not by an id selector: instance ids come from
  // useId and are not guaranteed to be valid CSS selectors.
  const titleRef = useRef<HTMLHeadingElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;
  const Heading = headingLevel;

  useBlockAnimation(animationLevel, scope, (level) => {
    const root = scope.current;
    if (!root) return;
    fadeIn(root.querySelector('[data-cta2-icon]'));
    if (level === 'rich') {
      textReveal(titleRef.current, { type: 'lines' });
    } else {
      fadeIn(titleRef.current, { delay: 0.1 });
    }
    fadeIn(root.querySelector('[data-cta2-sub]'), { delay: 0.2 });
    fadeIn(root.querySelector('[data-cta2-cta]'), { delay: 0.3 });
  });

  return (
    <section
      ref={scope}
      aria-labelledby={titleId}
      className={background === 'gradient' ? 'bg-mesh' : 'bg-surface'}
    >
      <div
        className={[
          'mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6',
          fullHeight ? 'min-h-svh justify-center py-20' : 'py-28 lg:py-24',
        ].join(' ')}
      >
        <span
          data-cta2-icon
          aria-hidden="true"
          className="rounded-token border-border bg-background text-foreground mb-8 inline-flex h-16 w-16 items-center justify-center border shadow-sm"
        >
          {icon ?? <BrandMark size={26} className="text-foreground" />}
        </span>

        <Heading
          id={titleId}
          ref={titleRef}
          className="font-display text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {title}
        </Heading>

        {subtitle ? (
          <p data-cta2-sub className="text-muted mt-5 max-w-xl text-lg">
            {subtitle}
            {footnote ? (
              <sup>
                <Link
                  href={footnote.href}
                  aria-label="Read the footnote"
                  className="text-muted hover:text-foreground ml-0.5"
                >
                  {footnote.marker}
                </Link>
              </sup>
            ) : null}
          </p>
        ) : null}

        <div data-cta2-cta className="mt-8">
          <Link
            href={primaryCta.href}
            className="border-border bg-background text-foreground hover:bg-accent inline-flex items-center justify-center rounded-full border px-7 py-3 text-base font-medium shadow-sm transition-colors"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
