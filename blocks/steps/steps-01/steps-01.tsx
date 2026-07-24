'use client';

import { useRef } from 'react';
import Image from 'next/image';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';

interface Step {
  title: string;
  description: string;
  image?: { src: string; alt: string; width?: number; height?: number };
}

export interface Steps01Props extends BlockBaseProps {
  heading?: string;
  subheading?: string;
  steps?: Step[];
}

const DEFAULT_STEPS: Step[] = [
  {
    title: 'Intro visit & walkthrough',
    description:
      'We meet at your villa, walk through it with you and learn how you actually use the house.',
    image: {
      src: '/placeholders/gallery-villa.svg',
      alt: 'A cared-for coastal villa',
      width: 800,
      height: 600,
    },
  },
  {
    title: 'A tailored care plan',
    description:
      'You get a simple plan and schedule built around your calendar — no long contracts.',
    image: {
      src: '/placeholders/gallery-garden.svg',
      alt: 'A tended Mediterranean garden',
      width: 600,
      height: 800,
    },
  },
  {
    title: 'Regular visits with reports',
    description:
      'We keep the pool, garden and house in shape, and send a short photo report after every visit.',
    image: {
      src: '/placeholders/gallery-pool.svg',
      alt: 'A clean villa pool',
      width: 960,
      height: 540,
    },
  },
  {
    title: 'Season preparation',
    description:
      'We open and close the house around your stays, so it is always guest-ready when you land.',
    image: {
      src: '/placeholders/gallery-terrace.svg',
      alt: 'A villa terrace set for guests',
      width: 700,
      height: 700,
    },
  },
];

/**
 * steps-01 — a "how it works" process rendered as an ordered list: a number
 * badge, title, description and an optional image per step. The order is
 * meaningful, so the markup is an <ol> (machine-readable); the visible number is
 * presentational and aria-hidden. Cards cascade in left-to-right to underline
 * the sequence.
 */
export function Steps01({
  heading = 'How it works',
  subheading = 'Four calm steps from first visit to a home that looks after itself.',
  steps = DEFAULT_STEPS,
  animationLevel = 'subtle',
}: Steps01Props) {
  const scope = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useBlockAnimation(animationLevel, scope, (level) => {
    fadeIn(scope.current?.querySelector('[data-steps-head]'));
    staggerChildren(listRef.current, { stagger: level === 'rich' ? 0.14 : 0.09 });
  });

  return (
    <section ref={scope} aria-labelledby="steps-01-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-steps-head className="max-w-2xl">
          <h2
            id="steps-01-title"
            className="font-display text-foreground text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {heading}
          </h2>
          {subheading ? <p className="text-muted mt-4 text-lg">{subheading}</p> : null}
        </div>

        <ol
          ref={listRef}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <li key={step.title} className="bg-surface rounded-token flex flex-col p-6">
              <span
                aria-hidden="true"
                className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold"
              >
                {i + 1}
              </span>
              <h3 className="font-display text-foreground mt-5 text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {step.description}
              </p>
              {step.image ? (
                <div className="rounded-token mt-auto overflow-hidden pt-6">
                  <Image
                    src={step.image.src}
                    alt={step.image.alt}
                    width={step.image.width ?? 900}
                    height={step.image.height ?? 600}
                    sizes="(min-width: 1024px) 20rem, (min-width: 768px) 40vw, 90vw"
                    className="rounded-token h-32 w-full object-cover"
                  />
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
