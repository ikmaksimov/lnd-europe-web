'use client';

import { useId, useRef, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { fadeIn, staggerChildren } from '@/lib/animations/presets';
import { ArrowUpRight } from '@/lib/icons';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterFeatured {
  /** Small overline above the card, e.g. "Featured story". */
  label?: string;
  image: { src: string; alt: string };
  title: string;
  href: string;
  linkLabel?: string;
}

export interface Footer02Props extends BlockBaseProps {
  brand?: string;
  /** Italic, lighter first half of the two-style statement. */
  statementLead?: string;
  /** Bold uppercase display second half. */
  statement?: string;
  body?: string;
  links?: FooterLink[];
  featured?: FooterFeatured;
  copyright?: string;
  legalLinks?: FooterLink[];
  /** Studio credit in the legal strip. */
  credit?: FooterLink;
  /**
   * Decorate the navigation labels without editing this block (BLOCK-SPEC §16).
   *
   * Covers exactly **the labels that come from `links`** — the large uppercase
   * nav list. That is the whole rule.
   *
   * Deliberately NOT covered: `legalLinks`, the studio `credit`, the featured
   * card's overline / title / link text, the brand line and the statement. The
   * legal strip is small print, not navigation; a decorated "Privacy" is noise.
   *
   * The **string stays the single source**: React keys and everything else keep
   * reading `label`, never the node this returns. Technical, not content — never
   * in `editSchema`/`defaults`.
   *
   * ```tsx
   * <Footer02 renderLabel={(l) => <ScrambleText text={l} trigger="hover" />} />
   * ```
   */
  renderLabel?: (label: string) => ReactNode;
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

const DEFAULT_LINKS: FooterLink[] = [
  { label: 'About', href: '/demo/story' },
  { label: 'Services', href: '/demo#services' },
  { label: 'Plans', href: '/demo#pricing' },
  { label: 'Reviews', href: '/demo#testimonials' },
  { label: 'Contact', href: '/demo#contact' },
];

const DEFAULT_LEGAL: FooterLink[] = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
];

/**
 * footer-02 — an editorial statement footer on the inverted surface: a small
 * brand line, a huge two-style statement, a short paragraph, large uppercase nav
 * links with ↗ arrows, an optional featured card (lg+ only), and a legal strip.
 *
 * The two-style statement is one display family used two ways — `statementLead`
 * italic and light, `statement` bold uppercase. A client theme whose display font
 * is a serif gets the full editorial contrast through tokens alone; the library
 * adds no new font roles.
 *
 * The visible statement is a `<p>`, not a heading — an `sr-only` h2 names the
 * landmark (same as footer-01).
 */
export function Footer02({
  brand = 'Vora Mar',
  statementLead = 'Calm,',
  statement = 'is what a coast home should feel like',
  body = 'One local team along the Costa Brava, keeping villas, pools and gardens ready all year for owners who live abroad.',
  links = DEFAULT_LINKS,
  featured = {
    label: 'Featured story',
    image: { src: '/placeholders/gallery-villa.svg', alt: 'A cared-for coastal villa' },
    title: 'How we keep villas guest-ready all season',
    href: '/demo/story',
  },
  copyright = '© 2026 Vora Mar. All rights reserved.',
  legalLinks = DEFAULT_LEGAL,
  credit = { label: 'Made by DigitalForms', href: 'https://digitalforms.es' },
  renderLabel,
  htmlId,
  animationLevel = 'subtle',
}: Footer02Props) {
  // The only place a nav label becomes a node. Absent the prop this returns the
  // string itself, so the markup is byte-identical to a block without the seam.
  const labelNode = (label: string): ReactNode =>
    renderLabel ? renderLabel(label) : label;

  const scope = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const autoId = useId();
  const titleId = `${htmlId ?? autoId}-title`;

  useBlockAnimation(animationLevel, scope, (level) => {
    fadeIn(scope.current?.querySelector('[data-f2-statement]'));
    staggerChildren(linksRef.current, { stagger: level === 'rich' ? 0.1 : 0.06 });
  });

  return (
    <footer
      ref={scope}
      aria-labelledby={titleId}
      className="bg-primary text-primary-foreground"
    >
      <h2 id={titleId} className="sr-only">
        Site footer
      </h2>

      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          {/* Statement column */}
          <div data-f2-statement>
            {brand ? <p className="text-sm">{brand}</p> : null}

            <p className="mt-6 text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="font-display font-light italic">{statementLead}</span>{' '}
              <span className="font-display font-bold uppercase">{statement}</span>
            </p>

            {body ? (
              <p className="text-primary-foreground/70 mt-8 max-w-xl leading-relaxed">
                {body}
              </p>
            ) : null}

            <nav aria-label="Footer" className="mt-12">
              <ul ref={linksRef} className="flex flex-wrap gap-x-8 gap-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group border-primary-foreground/40 hover:border-primary-foreground focus-visible:border-primary-foreground font-display inline-flex items-center gap-2 border-b pb-1 text-xl font-semibold tracking-tight uppercase transition-colors sm:text-2xl"
                    >
                      {labelNode(link.label)}
                      <ArrowUpRight
                        size={18}
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Featured card — desktop only, as in the reference */}
          {featured ? (
            <div className="hidden lg:block">
              <Link href={featured.href} className="group/feat block">
                {featured.label ? (
                  <span className="text-primary-foreground/70 block text-xs font-medium tracking-wide uppercase">
                    {featured.label}
                  </span>
                ) : null}
                <span className="rounded-token bg-primary-foreground/10 relative mt-3 block aspect-square overflow-hidden">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    fill
                    sizes="20rem"
                    className="object-cover"
                  />
                </span>
                <span className="font-display mt-4 block text-lg font-semibold">
                  {featured.title}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 group-hover/feat:no-underline">
                  {featured.linkLabel ?? 'Read more'}
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5"
                  />
                </span>
              </Link>
            </div>
          ) : null}
        </div>

        {/* Legal strip */}
        <div className="border-primary-foreground/15 mt-16 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-primary-foreground/70 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <p>{copyright}</p>
            {legalLinks.length > 0 ? (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-primary-foreground underline underline-offset-4 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {credit ? (
            <Link
              href={credit.href}
              className="text-primary-foreground/70 hover:text-primary-foreground text-sm underline underline-offset-4 transition-colors"
            >
              {credit.label}
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
