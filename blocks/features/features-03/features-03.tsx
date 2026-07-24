'use client';

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';

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
}

const DEFAULT_ITEMS: Feature03Item[] = [
  {
    title: 'Pool maintenance',
    description:
      'Weekly water balancing, cleaning and equipment checks — never green, never guesswork.',
    href: '#services',
    icon: <DropletIcon />,
  },
  {
    title: 'Garden care',
    description:
      'Irrigation, pruning and seasonal planting that keep terraces and gardens their best.',
    href: '#services',
    icon: <LeafIcon />,
  },
  {
    title: 'Season preparation',
    description:
      'Opening and closing the house around your calendar, ready before you land.',
    href: '#services',
    icon: <SunIcon />,
  },
  {
    title: 'Storm & winter checks',
    description:
      'Regular off-season inspections with prompt reports after every heavy blow.',
    href: '#services',
    icon: <ShieldIcon />,
  },
  {
    title: 'Guest-ready service',
    description:
      'Fresh linen, a spotless home and a welcome at the door for your guests.',
    href: '#services',
    icon: <KeyIcon />,
  },
  {
    title: 'Reports after every visit',
    description: 'A short note with photos the same day, so nothing happens unseen.',
    href: '#approach',
    icon: <FileIcon />,
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
  animationLevel = 'subtle',
}: Features03Props) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useBlockAnimation(animationLevel, scope, (level) => {
    fadeIn(scope.current?.querySelector('[data-features3-head]'));
    staggerChildren(listRef.current, { stagger: level === 'rich' ? 0.1 : 0.06 });
  });

  return (
    <section ref={scope} aria-labelledby="features-03-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-features3-head className="max-w-2xl">
          <h2
            id="features-03-title"
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
                {item.icon ?? <DropletIcon />}
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

/* --- Inline icons (Lucide paths, ISC) — ~40px, stroke = currentColor, §7 --- */

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-10 w-10"
    >
      {children}
    </svg>
  );
}

function DropletIcon() {
  return (
    <IconBase>
      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7Z" />
    </IconBase>
  );
}
function LeafIcon() {
  return (
    <IconBase>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6" />
    </IconBase>
  );
}
function SunIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </IconBase>
  );
}
function ShieldIcon() {
  return (
    <IconBase>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    </IconBase>
  );
}
function KeyIcon() {
  return (
    <IconBase>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </IconBase>
  );
}
function FileIcon() {
  return (
    <IconBase>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v5h5M9 13h6M9 17h4" />
    </IconBase>
  );
}
