'use client';

import { useId, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';
import { Drop, Leaf, Sun, Shield, Key, FileText } from '@/lib/icons';

interface Feature03Item {
  icon?: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export interface Features03Props extends BlockBaseProps {
  heading?: string;
  subheading?: string;
  items?: Feature03Item[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_ITEMS: Feature03Item[] = [
  {
    title: 'Pool maintenance',
    description:
      'Weekly water balancing, cleaning and equipment checks — never green, never guesswork.',
    href: '#services',
    icon: <Drop size={40} />,
  },
  {
    title: 'Garden care',
    description:
      'Irrigation, pruning and seasonal planting that keep terraces and gardens their best.',
    href: '#services',
    icon: <Leaf size={40} />,
  },
  {
    title: 'Season preparation',
    description:
      'Opening and closing the house around your calendar, ready before you land.',
    href: '#services',
    icon: <Sun size={40} />,
  },
  {
    title: 'Storm & winter checks',
    description:
      'Regular off-season inspections with prompt reports after every heavy blow.',
    href: '#services',
    icon: <Shield size={40} />,
  },
  {
    title: 'Guest-ready service',
    description:
      'Fresh linen, a spotless home and a welcome at the door for your guests.',
    href: '#services',
    icon: <Key size={40} />,
  },
  {
    title: 'Reports after every visit',
    description: 'A short note with photos the same day, so nothing happens unseen.',
    href: '#approach',
    icon: <FileText size={40} />,
  },
];

/**
 * features-03 — a lean, borderless icon list: a large icon on the left, title and
 * description on the right. No cards, no dividers. Item titles become links when a
 * href is provided (title only — the list stays calm).
 */
export function Features03({
  heading = 'Everything we look after',
  subheading = 'One local team, one clear standard, across the whole property.',
  items = DEFAULT_ITEMS,
  htmlId,
  animationLevel = 'subtle',
}: Features03Props) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, (level) => {
    fadeIn(scope.current?.querySelector('[data-features3-head]'));
    staggerChildren(listRef.current, { stagger: level === 'rich' ? 0.1 : 0.06 });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-features3-head className="max-w-2xl">
          <h2
            id={titleId}
            className="font-display text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {heading}
          </h2>
          {subheading ? <p className="text-muted mt-4 text-lg">{subheading}</p> : null}
        </div>

        <ul
          ref={listRef}
          className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span aria-hidden="true" className="text-foreground shrink-0">
                {item.icon ?? <Drop size={40} />}
              </span>
              <div>
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {item.href ? (
                    <Link href={item.href} className="hover:underline">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
