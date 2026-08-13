'use client';

import { useId, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';
import { Key, Leaf, Shield, Sparkle, Sun, Wrench } from '@/lib/icons';

interface Feature08Item {
  /** Override the compact supporting glyph. Code-level only, never PageDoc content. */
  icon?: ReactNode;
  title: string;
  description: string;
}

interface Feature08Group {
  heading: string;
  items: Feature08Item[];
}

export interface Features08Props extends BlockBaseProps {
  eyebrow?: string;
  heading?: string;
  /** @deprecated Decorative header chrome for existing code-level callers only. */
  image?: { src: string; alt: string };
  groups?: Feature08Group[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_GROUPS: Feature08Group[] = [
  {
    heading: 'Every routine, held in one clear local plan',
    items: [
      {
        icon: <Sun size={22} />,
        title: 'Season-ready',
        description: 'Open and close the house around the dates that matter to you.',
      },
      {
        icon: <Key size={22} />,
        title: 'Guest-ready',
        description: 'Linen, arrivals and final details prepared before the door opens.',
      },
      {
        icon: <Leaf size={22} />,
        title: 'Garden care',
        description: 'Terraces and planting kept calm through every season.',
      },
    ],
  },
  {
    heading: 'Small changes caught before they become a disruption',
    items: [
      {
        icon: <Shield size={22} />,
        title: 'Regular checks',
        description: 'A familiar team notices what has changed between visits.',
      },
      {
        icon: <Wrench size={22} />,
        title: 'Practical repairs',
        description: 'Small fixes are handled early, with trusted trades when needed.',
      },
      {
        icon: <Shield size={22} />,
        title: 'Trusted trades',
        description:
          'The right local specialist is coordinated before a small job grows.',
      },
    ],
  },
  {
    heading: 'A useful update, even when you are far from home',
    items: [
      {
        icon: <Sparkle size={22} />,
        title: 'Clear reports',
        description: 'Photos and notes make every check easy to follow from abroad.',
      },
      {
        icon: <Key size={22} />,
        title: 'One contact',
        description: 'Questions reach the person who already knows the house.',
      },
      {
        icon: <Sun size={22} />,
        title: 'Local response',
        description: 'A nearby team can act while a small issue is still small.',
      },
    ],
  },
];

export const defaults = {
  eyebrow: 'Built around the home',
  heading: 'Every detail, organised into care you can see',
} as const;

/**
 * features-08 — a grouped capability matrix. At `lg`, each h3 group heading
 * occupies the left column while its three compact items hold equal
 * right-hand columns; below `lg` the heading leads a normal stacked item grid.
 * Item titles are h4: these are genuine named capabilities beneath a group h3,
 * so the resulting outline is h2 section → h3 group → h4 capability. The small
 * deprecated illustration renders only for an explicit legacy caller.
 */
export function Features08({
  eyebrow = defaults.eyebrow,
  heading = defaults.heading,
  image,
  groups = DEFAULT_GROUPS,
  htmlId,
  animationLevel = 'subtle',
}: Features08Props) {
  const scope = useRef<HTMLElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, (level) => {
    const root = scope.current;
    if (!root) return;
    fadeIn(root.querySelector('[data-f8-head]'));
    root.querySelectorAll<HTMLElement>('[data-f8-items]').forEach((items) => {
      staggerChildren(items, { stagger: level === 'rich' ? 0.1 : 0.07 });
    });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div
          data-f8-head
          className={image ? 'flex items-start justify-between gap-8' : undefined}
        >
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="text-muted text-sm font-medium tracking-wide uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={titleId}
              className="font-display text-foreground mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              {heading}
            </h2>
          </div>
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              aria-hidden={image.alt === '' ? true : undefined}
              width={160}
              height={120}
              sizes="160px"
              className="hidden w-32 shrink-0 object-cover sm:block lg:w-40"
            />
          ) : null}
        </div>

        <div className="border-border mt-12 border-t">
          {groups.map((group) => (
            <div
              key={group.heading}
              className="border-border border-b py-8 last:border-b-0 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2.1fr)] lg:gap-12 lg:py-10"
            >
              <h3 className="font-display text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                {group.heading}
              </h3>
              <ul
                data-f8-items
                className="mt-7 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-3"
              >
                {group.items.map((item) => (
                  <li key={item.title} data-f8-item>
                    <span aria-hidden="true" className="text-foreground inline-flex">
                      {item.icon ?? <Sparkle size={22} />}
                    </span>
                    <h4 className="text-foreground mt-4 text-sm font-semibold">
                      {item.title}
                    </h4>
                    <p className="text-muted mt-2 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
