'use client';

import { useId, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeUp, fadeIn, textReveal, parallaxImage } from '@/lib/animations/presets';
import { ArrowRight, Clock, House, SealCheck } from '@/lib/icons';

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
  /** `'dark'` renders the whole section on the scoped dark token set, so the
   *  scrim and the type invert together — the readable choice over a dark photo.
   *  Pure sugar for `<div className="theme-dark">…</div>` (BLOCK-SPEC §12).
   *
   *  Match the tone to the PHOTO, not to taste: `tone` decides whether the type
   *  is light or dark, so `'dark'` over a light photo is as unreadable as the
   *  default was over a dark one (measured ~2.4:1). Dark photo → `'dark'`,
   *  light photo → leave the default. */
  tone?: 'light' | 'dark';
  /** Bottom reassurance strip — icon + short uppercase label. */
  items?: Reassurance[];
  /** A client hero is usually the page's single h1; h2 elsewhere. */
  headingLevel?: 'h1' | 'h2';
  /** Set true when this hero holds the page's LCP image (SEO-BASELINE §5). */
  imagePriority?: boolean;
  /** Set true when a STICKY header sits above this hero. A sticky header stays in
   *  the flow, so a `min-h-svh` section after it starts below the header and
   *  overflows the first screen by exactly the header's height. This pulls the
   *  section up under the header (the image then starts at the viewport top and
   *  the header floats over it) and pads the content back down. The offset comes
   *  from `--header-height` (fallback `4rem`) — set that variable once per site. */
  underHeader?: boolean;
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
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
  tone: 'light',
  headingLevel: 'h2',
} as const;

const DEFAULT_ITEMS: Reassurance[] = [
  { label: '<24h response', icon: <Clock size={20} /> },
  { label: '85+ villas cared for', icon: <House size={20} /> },
  { label: '12 years on the coast', icon: <SealCheck size={20} /> },
];

/**
 * hero-02 — full-bleed background hero at full viewport height (`min-h-svh`).
 * A photo fills the screen behind a token-only legibility scrim; the text column
 * sits upper-left and a reassurance strip is pinned to the bottom. The library's
 * background-image hero (hero-01 is the side-by-side split).
 *
 * Under a STICKY header (navbar-01/02/03) pass `underHeader` — a sticky header
 * stays in the flow, so without it this section starts below the header and the
 * first screen overflows by the header's height. The offset is read from
 * `--header-height` (fallback `4rem`); set that variable once per site to your
 * header's real height (BLOCK-SPEC §11).
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
  tone = defaults.tone,
  items = DEFAULT_ITEMS,
  headingLevel = defaults.headingLevel,
  imagePriority = false,
  underHeader = false,
  htmlId,
  animationLevel = 'subtle',
}: Hero02Props) {
  const scope = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

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
      aria-labelledby={titleId}
      // `underHeader`: pull the section up by the header's height and pad the same
      // amount back in. Because `box-sizing: border-box` applies, `min-h-svh` still
      // resolves to exactly one viewport — the first screen fits — while the
      // absolutely-positioned image (which fills the PADDING box) still starts at
      // the very top, behind the sticky header.
      // The fallback is `4rem + 1px`: every navbar in this library is a bar plus a
      // 1px bottom border (navbar-01/03 = 65px), so a bare copy of this block is
      // pixel-exact without the token layer. Sites set `--header-height` to their
      // own header's height (navbar-02 is 57px).
      style={
        underHeader
          ? {
              marginTop: 'calc(var(--header-height, calc(4rem + 1px)) * -1)',
              paddingTop: 'var(--header-height, calc(4rem + 1px))',
            }
          : undefined
      }
      className={[
        'bg-surface relative flex min-h-svh flex-col justify-between overflow-hidden',
        // `tone="dark"` just applies the library's scoped dark token set: the scrim
        // still builds from --background and the type still uses --foreground —
        // both simply resolve to inverted values.
        tone === 'dark' ? 'theme-dark' : '',
      ]
        .filter(Boolean)
        .join(' ')}
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
                <span className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                  {badge}
                </span>
              ) : null}
              {eyebrow ? (
                <p className="text-muted text-sm font-medium tracking-wide uppercase">
                  {eyebrow}
                </p>
              ) : null}
            </div>
          ) : null}

          <Heading
            id={titleId}
            ref={titleRef}
            className="font-display text-foreground text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {title}
          </Heading>

          {subtitle ? (
            <p
              data-hero2-sub
              className="text-foreground/80 mt-6 max-w-md text-lg leading-relaxed"
            >
              {subtitle}
            </p>
          ) : null}

          <div data-hero2-actions className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
            >
              {primaryCta.label}
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="border-border bg-surface text-foreground hover:bg-accent inline-flex items-center justify-center gap-1.5 rounded-full border px-6 py-3 text-base font-medium transition-colors"
              >
                {secondaryCta.label}
                <ArrowRight size={18} className="shrink-0" />
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
                {item.icon ?? <SealCheck size={20} />}
              </span>
              <span className="text-sm font-medium tracking-wide uppercase">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
