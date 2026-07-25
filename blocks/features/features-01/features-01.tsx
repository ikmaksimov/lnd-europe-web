'use client';

import { useRef, type ReactNode } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeUp, staggerChildren } from '@/lib/animations/presets';

interface Feature {
  title: string;
  description: string;
  /** Override the default inline icon. */
  icon?: ReactNode;
}

export interface Features01Props extends BlockBaseProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  items?: Feature[];
}

const DEFAULT_ITEMS: Feature[] = [
  {
    title: 'Pool maintenance',
    description:
      'Weekly water balancing, cleaning and equipment checks so the pool is always ready — never green, never guesswork.',
    icon: <DropletIcon />,
  },
  {
    title: 'Garden care',
    description:
      'Irrigation, pruning and seasonal planting that keep terraces and Mediterranean gardens looking their best.',
    icon: <LeafIcon />,
  },
  {
    title: 'Season preparation',
    description:
      'Opening and closing the house around your calendar — furniture, systems and comforts set before you land.',
    icon: <SunIcon />,
  },
  {
    title: 'Storm & winter checks',
    description:
      'Regular inspections through the off-season, with prompt reports after every tramontana or heavy rain.',
    icon: <ShieldIcon />,
  },
  {
    title: 'Guest-ready service',
    description:
      'Welcoming your guests, fresh linen and a spotless home — arrivals feel effortless and looked after.',
    icon: <KeyIcon />,
  },
  {
    title: 'Minor repairs',
    description:
      'Small fixes handled on the spot and larger works coordinated with trusted local trades on your behalf.',
    icon: <WrenchIcon />,
  },
];

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match features-01.edit.ts (`items` is an array,
 *  read-only in the editor, so it keeps its DEFAULT_ITEMS const). */
export const defaults = {
  eyebrow: 'What we do',
  heading: 'Everything your coast home needs',
  subheading:
    'One local team looking after the details, so ownership from abroad stays calm and simple.',
} as const;

/**
 * features-01 — a 3×2 grid of icon cards that stagger in on scroll.
 * The go-to "what we do" section.
 */
export function Features01({
  eyebrow = defaults.eyebrow,
  heading = defaults.heading,
  subheading = defaults.subheading,
  items = DEFAULT_ITEMS,
  animationLevel = 'subtle',
}: Features01Props) {
  const scope = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);

  useBlockAnimation(animationLevel, scope, () => {
    fadeUp(scope.current?.querySelector('[data-features-head]'));
    staggerChildren(gridRef.current, { stagger: 0.09 });
  });

  return (
    <section ref={scope} aria-labelledby="features-01-title" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div data-features-head className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="text-muted mb-3 text-sm font-medium tracking-wide uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id="features-01-title"
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
              className="rounded-token border-border bg-surface border p-6"
            >
              <span
                aria-hidden="true"
                className="rounded-token bg-accent text-accent-foreground mb-4 inline-flex h-11 w-11 items-center justify-center"
              >
                {item.icon ?? <DropletIcon />}
              </span>
              <h3 className="font-display text-foreground text-lg font-semibold">
                {item.title}
              </h3>
              <p className="text-muted mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --- Inline icons (Lucide paths, ISC) — stroke = currentColor, per BLOCK-SPEC §7 --- */

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
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
function WrenchIcon() {
  return (
    <IconBase>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </IconBase>
  );
}
