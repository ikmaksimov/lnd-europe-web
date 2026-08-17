'use client';

import { useId, useRef } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';
import { CaretDown } from '@/lib/icons';

interface FaqLink {
  label: string;
  href: string;
}

interface Faq02Item {
  title: string;
  description: string;
  link?: FaqLink;
}

export interface Faq02Props extends BlockBaseProps {
  /** Muted first half of the two-tone display title. */
  titleLead?: string;
  /** Foreground second half of the two-tone display title. */
  title?: string;
  items?: Faq02Item[];
  footerLink?: FaqLink;
  /** Indices rendered already expanded (SSR `open`). Default: all collapsed. */
  defaultOpen?: number[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_ITEMS: Faq02Item[] = [
  {
    title: 'How we start',
    description:
      'We visit your villa, walk through it with you and agree a plan around how you actually use the house. The schedule is set before we touch anything.',
    link: { label: 'Talk to us', href: '#contact' },
  },
  {
    title: 'What a visit includes',
    description:
      'Water balancing and pool cleaning, irrigation and pruning, and a walk of the whole property to catch small problems while they are still small.',
    link: { label: 'See our services', href: '#services' },
  },
  {
    title: 'Reports after every visit',
    description:
      'You get a short report with photos and any notes the same day. Nothing happens on your property without you seeing it.',
    link: { label: 'How we work', href: '#approach' },
  },
  {
    title: 'Preparing for guests',
    description:
      'Fresh linen, a spotless home and a welcome at the door. Your guests arrive to a house that feels looked after, not just unlocked.',
    link: { label: 'See our services', href: '#services' },
  },
  {
    title: 'Storms and the off-season',
    description:
      'We inspect through the quiet months and report promptly after every tramontana or heavy rain, so winter never turns into a surprise in spring.',
    link: { label: 'Compare plans', href: '#pricing' },
  },
];

/**
 * Smooth open/close with no JavaScript: `interpolate-size: allow-keywords` lets
 * the height of `::details-content` interpolate between 0 and auto, so the row's
 * bottom border glides down as the panel grows. `content-visibility` needs
 * `allow-discrete` to participate in the transition.
 *
 * The `motion-reduce:` guard is deliberate: the global reduced-motion rule in
 * globals.css targets `*, *::before, *::after`, and the universal selector does
 * not match the `::details-content` pseudo-element — so the height transition
 * would otherwise keep animating. See TASK-004's Questions section.
 *
 * Browsers without `interpolate-size`/`::details-content` simply open instantly —
 * the native <details> behaviour, which is the intended fallback.
 */
const DETAILS_CLASS = [
  'group border-border border-b',
  '[interpolate-size:allow-keywords]',
  '[&::details-content]:h-0 [&::details-content]:overflow-hidden',
  '[&::details-content]:transition-[height,content-visibility]',
  '[&::details-content]:duration-500 [&::details-content]:ease-in-out',
  '[&::details-content]:[transition-behavior:allow-discrete]',
  '[&[open]::details-content]:h-auto',
  'motion-reduce:[&::details-content]:transition-none',
].join(' ');

/**
 * faq-02 — an expandable list: two-tone display title over spacious
 * <details> rows separated by hairlines (no cards). Each row carries a
 * description and an optional link, with an optional link below the list.
 * Expansion is pure CSS; GSAP only fades the section in.
 */
export function Faq02({
  titleLead = 'Questions.',
  title = 'Answered before you ask.',
  items = DEFAULT_ITEMS,
  footerLink = { label: 'Talk to our team', href: '#contact' },
  defaultOpen = [],
  htmlId,
  animationLevel = 'subtle',
}: Faq02Props) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, (level) => {
    fadeIn(scope.current?.querySelector('[data-faq2-head]'));
    staggerChildren(listRef.current, {
      stagger: level === 'rich' ? 0.12 : 0.07,
      y: 14,
    });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
        <h2
          id={titleId}
          data-faq2-head
          className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          <span className="text-muted">{titleLead}</span>{' '}
          <span className="text-foreground">{title}</span>
        </h2>

        <div ref={listRef} className="border-border mt-12 border-t">
          {items.map((item, i) => (
            <details
              key={item.title}
              open={defaultOpen.includes(i)}
              className={DETAILS_CLASS}
            >
              <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-medium sm:text-xl [&::-webkit-details-marker]:hidden">
                <span>{item.title}</span>
                <CaretDown
                  size={22}
                  className="text-muted shrink-0 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              {/* Fades/rises in as the panel grows; tied to the CSS `open` state,
                  so it is fully readable without JS once the row is expanded. */}
              <div className="-translate-y-1 pb-6 opacity-0 transition-[opacity,translate] duration-500 ease-in-out group-open:translate-y-0 group-open:opacity-100 sm:pr-10">
                <p className="text-muted max-w-2xl leading-relaxed">{item.description}</p>
                {item.link ? (
                  <Link
                    href={item.link.href}
                    className="text-foreground mt-4 inline-flex text-sm font-medium hover:underline"
                  >
                    {item.link.label} →
                  </Link>
                ) : null}
              </div>
            </details>
          ))}
        </div>

        {footerLink ? (
          <Link
            href={footerLink.href}
            className="text-foreground mt-10 inline-flex text-base font-medium hover:underline"
          >
            {footerLink.label} →
          </Link>
        ) : null}
      </div>
    </section>
  );
}
