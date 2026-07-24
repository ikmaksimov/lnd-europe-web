'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, textReveal } from '@/lib/animations/presets';

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
  animationLevel = 'subtle',
}: Cta02Props) {
  const scope = useRef<HTMLElement>(null);
  const Heading = headingLevel;

  useBlockAnimation(animationLevel, scope, (level) => {
    const root = scope.current;
    if (!root) return;
    fadeIn(root.querySelector('[data-cta2-icon]'));
    if (level === 'rich') {
      textReveal(root.querySelector('#cta-02-title'), { type: 'lines' });
    } else {
      fadeIn(root.querySelector('#cta-02-title'), { delay: 0.1 });
    }
    fadeIn(root.querySelector('[data-cta2-sub]'), { delay: 0.2 });
    fadeIn(root.querySelector('[data-cta2-cta]'), { delay: 0.3 });
  });

  return (
    <section
      ref={scope}
      aria-labelledby="cta-02-title"
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
          {icon ?? <BrandMark />}
        </span>

        <Heading
          id="cta-02-title"
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
            className="border-border bg-background text-foreground hover:bg-surface inline-flex items-center justify-center rounded-full border px-7 py-3 text-base font-medium shadow-sm transition-colors"
          >
            {primaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --- Inline icon (Lucide-style tile mark, ISC) — currentColor, per BLOCK-SPEC §7 --- */

function BrandMark() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-foreground"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity="0.55"
      />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}
