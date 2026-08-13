'use client';

import { useId, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, fadeUp } from '@/lib/animations/presets';
import { Key, Shield, Sparkle, Wrench } from '@/lib/icons';

interface Point {
  /** Override the quiet sub-feature tile glyph. Code-level only, never PageDoc content. */
  icon?: ReactNode;
  title: string;
  description: string;
}

interface Feature06Item {
  badge?: string;
  /** Quiet first line of the card heading lockup. */
  eyebrow?: string;
  title: string;
  description: string;
  image: { src: string; alt: string; width?: number; height?: number };
  points: [Point, Point];
}

export interface Features06Props extends BlockBaseProps {
  heading?: string;
  subheading?: string;
  items?: Feature06Item[];
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_ITEMS: Feature06Item[] = [
  {
    badge: 'Care plan',
    eyebrow: 'A home that stays',
    title: 'Ready for every arrival',
    description:
      'One local plan keeps the details moving while you are away, so opening the door feels simple again.',
    image: {
      src: '/placeholders/gallery-terrace.svg',
      alt: 'A villa terrace prepared for an arrival',
      width: 960,
      height: 720,
    },
    points: [
      {
        icon: <Key size={20} />,
        title: 'Guest-ready',
        description:
          'Linen, welcome details and a final walk-through before anyone arrives.',
      },
      {
        icon: <Shield size={20} />,
        title: 'Protected between visits',
        description: 'Regular checks catch small problems before they become a surprise.',
      },
    ],
  },
  {
    badge: 'Local response',
    eyebrow: 'A team that knows',
    title: 'What the house needs',
    description:
      'The same people see the pool, garden and systems week after week, with a clear report after every visit.',
    image: {
      src: '/placeholders/gallery-pool.svg',
      alt: 'A clear villa pool under coastal light',
      width: 960,
      height: 720,
    },
    points: [
      {
        icon: <Wrench size={20} />,
        title: 'Small fixes first',
        description:
          'Practical repairs are handled early, before a visit turns into a project.',
      },
      {
        icon: <Sparkle size={20} />,
        title: 'Clear reporting',
        description: 'A concise update makes each visit useful even when you are abroad.',
      },
    ],
  },
];

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match features-06.edit.ts (`items` is an array,
 *  read-only in the editor, so its tuple points and ReactNode icons stay in
 *  DEFAULT_ITEMS as code-level content). */
export const defaults = {
  heading: 'Care in the details that matter',
  subheading:
    'Two showcase cards pair the main promise with the smaller reasons owners feel the difference.',
} as const;

/**
 * features-06 — alternating showcase cards with a nested sub-feature pair.
 * The eyebrow and title share one h3 so assistive technology hears the usable
 * phrase, for example “A home that stays Ready for every arrival”, not a
 * detached fragment. Media alternates by item index; the card itself clips the
 * edge-to-edge panel, so the bleed cannot widen the page on mobile. Sub-feature
 * tiles intentionally use quiet accent tokens: the dense second content level
 * should support, not compete with, the primary card promise.
 */
export function Features06({
  heading = defaults.heading,
  subheading = defaults.subheading,
  items = DEFAULT_ITEMS,
  htmlId,
  animationLevel = 'subtle',
}: Features06Props) {
  const scope = useRef<HTMLElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, () => {
    const root = scope.current;
    if (!root) return;
    fadeIn(root.querySelector('[data-f6-head]'));
    root.querySelectorAll<HTMLElement>('[data-f6-card]').forEach((card) => fadeUp(card));
  });

  return (
    <section ref={scope} aria-labelledby={titleId} className="bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-f6-head className="mx-auto max-w-2xl text-center">
          <h2
            id={titleId}
            className="font-display text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {heading}
          </h2>
          {subheading ? <p className="text-muted mt-4 text-lg">{subheading}</p> : null}
        </div>

        <ul className="mt-14 flex flex-col gap-8">
          {items.map((item, index) => {
            const mediaFirst = index % 2 === 1;
            return (
              <li
                key={item.title}
                data-f6-card
                className="rounded-token bg-background overflow-hidden"
              >
                <div className="grid lg:grid-cols-2">
                  <div className={`p-6 sm:p-8 lg:p-10 ${mediaFirst ? 'lg:order-2' : ''}`}>
                    {item.badge ? (
                      <span className="rounded-token bg-accent text-accent-foreground inline-flex px-3 py-1 text-xs font-medium tracking-wide uppercase">
                        {item.badge}
                      </span>
                    ) : null}
                    <h3 className="font-display text-foreground mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                      {item.eyebrow ? (
                        <span className="text-muted mb-1 block text-base font-medium tracking-normal sm:text-lg">
                          {item.eyebrow}
                        </span>
                      ) : null}
                      {item.title}
                    </h3>
                    <p className="text-muted mt-4 max-w-lg leading-relaxed">
                      {item.description}
                    </p>

                    <div className="mt-8 grid sm:grid-cols-2">
                      {item.points.map((point, pointIndex) => (
                        <div
                          key={point.title}
                          className={`border-border py-5 ${pointIndex === 1 ? 'border-t sm:border-t-0 sm:border-l sm:pl-6' : 'sm:pr-6'}`}
                        >
                          <span
                            aria-hidden="true"
                            className="rounded-token bg-accent text-accent-foreground inline-flex h-10 w-10 items-center justify-center"
                          >
                            {point.icon ?? <Sparkle size={20} />}
                          </span>
                          <h4 className="text-foreground mt-4 text-sm font-semibold">
                            {point.title}
                          </h4>
                          <p className="text-muted mt-1 text-sm leading-relaxed">
                            {point.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    data-f6-media
                    className={`bg-surface relative min-h-72 overflow-hidden ${mediaFirst ? 'lg:order-1' : ''}`}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 32rem, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
