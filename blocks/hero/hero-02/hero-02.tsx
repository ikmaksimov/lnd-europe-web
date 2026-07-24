'use client';

import { useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeUp, fadeIn, textReveal, parallaxImage } from '@/lib/animations/presets';

interface Cta {
  label: string;
  href: string;
}

interface Reassurance {
  /** Override the default inline icon. */
  icon?: ReactNode;
  label: string;
}

export interface Hero02Props extends BlockBaseProps {
  eyebrow?: string;
  /** Small pill next to the eyebrow (e.g. "NEW"). Presentational. */
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  /** Full-bleed background photo — the page's LCP. */
  background?: { src: string; alt: string };
  /** Legibility scrim (token-only gradient). Off for an already-calm image. */
  overlay?: boolean;
  /** Bottom reassurance strip — icon + short uppercase label. */
  items?: Reassurance[];
  /** A client hero is usually the page's single h1; h2 elsewhere. */
  headingLevel?: 'h1' | 'h2';
  /** Set true when this hero holds the page's LCP image (SEO-BASELINE §5). */
  imagePriority?: boolean;
}

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match hero-02.edit.ts (`items` is an array,
 *  read-only in the editor, so it keeps its DEFAULT_ITEMS const). */
export const defaults = {
  eyebrow: 'Villa care · Costa Brava',
  badge: 'Since 2013',
  title: 'Your coast home, always ready',
  subtitle:
    'Vora Mar keeps villas and pools guest-ready all year, so owners abroad arrive to a home that feels looked after — never just unlocked.',
  primaryCta: { label: 'Request a visit', href: '#contact' },
  secondaryCta: { label: 'See our services', href: '#services' },
  background: {
    src: '/placeholders/hero-wide.svg',
    alt: 'A calm Costa Brava coastline seen from a villa terrace',
  },
  overlay: true,
  headingLevel: 'h2',
} as const;

const DEFAULT_ITEMS: Reassurance[] = [
  { label: '<24h response', icon: <ClockIcon /> },
  { label: '85+ villas cared for', icon: <HouseIcon /> },
  { label: '12 years on the coast', icon: <BadgeCheckIcon /> },
];

/**
 * hero-02 — full-bleed background hero at full viewport height (`min-h-svh`).
 * A photo fills the screen behind a token-only legibility scrim; the text column
 * sits upper-left and a reassurance strip is pinned to the bottom. The library's
 * background-image hero (hero-01 is the side-by-side split).
 */
export function Hero02({
  eyebrow = defaults.eyebrow,
  badge = defaults.badge,
  title = defaults.title,
  subtitle = defaults.subtitle,
  primaryCta = defaults.primaryCta,
  secondaryCta = defaults.secondaryCta,
  background = defaults.background,
  overlay = defaults.overlay,
  items = DEFAULT_ITEMS,
  headingLevel = defaults.headingLevel,
  imagePriority = false,
  animationLevel = 'subtle',
}: Hero02Props) {
  const scope = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useBlockAnimation(animationLevel, scope, (level) => {
    const root = scope.current;
    if (!root) return;

    if (level === 'rich') {
      textReveal(titleRef.current, { type: 'lines' });
      parallaxImage(imageRef.current, { amount: 6 });
      fadeIn(root.querySelector('[data-hero2-eyebrow]'), { delay: 0.1 });
      fadeIn(root.querySelector('[data-hero2-sub]'), { delay: 0.2 });
      fadeIn(root.querySelector('[data-hero2-actions]'), { delay: 0.3 });
    } else {
      // subtle: a fadeUp cascade down the content column.
      fadeUp(root.querySelector('[data-hero2-eyebrow]'), { y: 14 });
      fadeUp(titleRef.current, { delay: 0.08, y: 18 });
      fadeUp(root.querySelector('[data-hero2-sub]'), { delay: 0.16 });
      fadeUp(root.querySelector('[data-hero2-actions]'), { delay: 0.24 });
    }
    fadeIn(root.querySelector('[data-hero2-strip]'), { delay: 0.3 });
  });

  const Heading = headingLevel;

  return (
    <section
      ref={scope}
      aria-labelledby="hero-02-title"
      className="bg-surface relative flex min-h-svh flex-col justify-between overflow-hidden"
    >
      {/* Background image (LCP) + token-only legibility scrim. */}
      <div className="absolute inset-0">
        <Image
          ref={imageRef}
          src={background.src}
          alt={background.alt}
          fill
          priority={imagePriority}
          sizes="100vw"
          className="scale-110 object-cover"
        />
        {overlay ? (
          <>
            {/* Stronger behind the left-hand text, fading over the image. */}
            <div
              aria-hidden="true"
              className="from-background/75 via-background/25 absolute inset-0 bg-gradient-to-r to-transparent"
            />
            {/* A soft base so the bottom strip stays readable. */}
            <div
              aria-hidden="true"
              className="from-background/70 absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t to-transparent"
            />
          </>
        ) : null}
      </div>

      {/* Content column — upper-left, over the image. */}
      <div className="relative mx-auto w-full max-w-6xl px-4 pt-28 sm:px-6 lg:pt-36">
        <div className="max-w-xl">
          {eyebrow || badge ? (
            <div data-hero2-eyebrow className="mb-5 flex flex-wrap items-center gap-3">
              {badge ? (
                <span className="rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  {badge}
                </span>
              ) : null}
              {eyebrow ? (
                <p className="text-muted text-sm font-medium tracking-wide uppercase">{eyebrow}</p>
              ) : null}
            </div>
          ) : null}

          <Heading
            id="hero-02-title"
            ref={titleRef}
            className="font-display text-foreground text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {title}
          </Heading>

          {subtitle ? (
            <p data-hero2-sub className="text-foreground/80 mt-6 max-w-md text-lg leading-relaxed">
              {subtitle}
            </p>
          ) : null}

          <div data-hero2-actions className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="rounded-full border-border bg-surface text-foreground hover:bg-accent inline-flex items-center justify-center gap-1.5 border px-6 py-3 text-base font-medium transition-colors"
              >
                {secondaryCta.label}
                <ArrowRightIcon />
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Reassurance strip — pinned to the bottom. */}
      <div
        data-hero2-strip
        className="relative mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:pb-12"
      >
        <ul className="border-border/60 text-foreground flex flex-col gap-4 border-t pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-10 sm:gap-y-3">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="text-muted">
                {item.icon ?? <BadgeCheckIcon />}
              </span>
              <span className="text-sm font-medium tracking-wide uppercase">{item.label}</span>
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
      width="20"
      height="20"
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

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </IconBase>
  );
}

function HouseIcon() {
  return (
    <IconBase>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9 21v-6h6v6" />
    </IconBase>
  );
}

function BadgeCheckIcon() {
  return (
    <IconBase>
      <path d="M12 2.5l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.8 2.6.8 2.6-2.3 1.4-1 2.5-2.7-.2L12 21.5l-2.2-1.6-2.7.2-1-2.5-2.3-1.4.8-2.6-.8-2.6 2.3-1.4 1-2.5 2.7.2Z" />
      <path d="m9 12 2 2 4-4" />
    </IconBase>
  );
}
