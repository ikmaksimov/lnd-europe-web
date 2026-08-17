'use client';

import { useId, useRef, type ReactNode } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeUp, staggerChildren } from '@/lib/animations/presets';
import { Drop, Key, Leaf, Shield, Sun, Wrench } from '@/lib/icons';

interface Feature {
  title: string;
  description: string;
  /** Override the default icon tile glyph. Code-level only, never PageDoc content. */
  icon?: ReactNode;
}

export interface Features05Props extends BlockBaseProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items?: Feature[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_ITEMS: Feature[] = [
  {
    title: 'Pool maintenance',
    description: 'Weekly checks keep the pool ready.',
    icon: <Drop size={22} />,
  },
  {
    title: 'Garden care',
    description:
      'Irrigation, pruning and seasonal planting keep terraces and Mediterranean gardens at their best.',
    icon: <Leaf size={22} />,
  },
  {
    title: 'Season preparation',
    description:
      'We open and close the house around your calendar, with systems and comforts ready before you land.',
    icon: <Sun size={22} />,
  },
  {
    title: 'Storm checks',
    description:
      'Off-season inspections and prompt reports after heavy rain or tramontana winds.',
    icon: <Shield size={22} />,
  },
  {
    title: 'Guest-ready service',
    description:
      'Fresh linen, a spotless home and a welcome that makes every arrival feel cared for.',
    icon: <Key size={22} />,
  },
  {
    title: 'Minor repairs',
    description:
      'Small fixes handled quickly, with trusted local trades coordinated when work grows larger.',
    icon: <Wrench size={22} />,
  },
];

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match features-05.edit.ts (`items` is an array,
 *  read-only in the editor, so it keeps its DEFAULT_ITEMS const and ReactNode
 *  icons remain code-level only). */
export const defaults = {
  eyebrow: 'Built around the house',
  heading: 'Care that stays one step ahead',
  subheading:
    'Six practical capabilities, each handled by the same local team that knows your home.',
} as const;

/**
 * features-05 — a left-aligned 3×2 capability grid with strong icon tiles and
 * a fixed top rhythm. At `sm+`, a minimum card height makes each row reconcile
 * uneven descriptions; at one column cards return to natural height, because a
 * forced empty gap has no neighbouring card to balance on a phone.
 */
export function Features05({
  eyebrow = defaults.eyebrow,
  heading = defaults.heading,
  subheading = defaults.subheading,
  items = DEFAULT_ITEMS,
  htmlId,
  animationLevel = 'subtle',
}: Features05Props) {
  const scope = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, () => {
    fadeUp(scope.current?.querySelector('[data-f5-head]'));
    staggerChildren(gridRef.current, { stagger: 0.09 });
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-f5-head className="max-w-2xl">
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
          {subheading ? <p className="text-muted mt-4 text-lg">{subheading}</p> : null}
        </div>

        <ul
          ref={gridRef}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <li
              key={item.title}
              data-f5-card
              className="rounded-token border-border bg-surface flex flex-col border p-6 sm:min-h-[22rem] sm:p-8"
            >
              <span
                aria-hidden="true"
                className="rounded-token bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center"
              >
                {item.icon ?? <Drop size={22} />}
              </span>
              <div className="mt-6 sm:mt-10">
                <h3 className="font-display text-foreground text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">
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
