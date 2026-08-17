'use client';

import { useId, useRef } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeUp, staggerChildren } from '@/lib/animations/presets';
import { CaretDown } from '@/lib/icons';
import { DEFAULT_FAQ_ITEMS, type FaqItem } from './faq-data';

export type { FaqItem };

export interface Faq01Props extends BlockBaseProps {
  eyebrow?: string;
  heading?: string;
  items?: FaqItem[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match faq-01.edit.ts (`items` is an array,
 *  read-only in the editor, so it keeps its DEFAULT_FAQ_ITEMS const). */
export const defaults = {
  eyebrow: 'Questions',
  heading: 'Good to know before you start',
} as const;

/**
 * faq-01 — accordion built on native <details>/<summary>. Fully open/closeable
 * without JavaScript; GSAP only adds a soft entrance. The chevron rotates via
 * the CSS `open` state, not scripting.
 */
export function Faq01({
  eyebrow = defaults.eyebrow,
  heading = defaults.heading,
  items = DEFAULT_FAQ_ITEMS,
  htmlId,
  animationLevel = 'subtle',
}: Faq01Props) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, () => {
    fadeUp(scope.current?.querySelector('[data-faq-head]'));
    staggerChildren(listRef.current, { stagger: 0.07, y: 14 });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-faq-head className="text-center">
          {eyebrow ? (
            <p className="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={titleId}
            className="font-display text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {heading}
          </h2>
        </div>

        <div ref={listRef} className="mt-12 space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-token border-border bg-surface border"
            >
              <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <CaretDown
                  size={20}
                  className="text-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="text-muted px-5 pb-5 text-sm leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
