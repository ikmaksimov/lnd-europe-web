'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';
import { ArrowCircleRight, BrandMark, List, Plus, X } from '@/lib/icons';

interface MegaLink {
  label: string;
  description?: string;
  href: string;
}

interface MegaGroup {
  title?: string;
  links: MegaLink[];
}

interface MegaFeatured {
  /** Small overline above the title, e.g. "Featured story". */
  label?: string;
  image: { src: string; alt: string };
  title: string;
  href: string;
  linkLabel?: string;
}

type NavEntry =
  | { label: string; href: string }
  | { label: string; panel: { groups: MegaGroup[]; featured?: MegaFeatured } };

export interface Navbar03Props extends BlockBaseProps {
  logo?: { label: string; href: string; mark?: ReactNode };
  items?: NavEntry[];
  secondaryLink?: { label: string; href: string };
  cta?: { label: string; href: string };
  /**
   * Decorate the menu labels without editing this block (BLOCK-SPEC §16).
   *
   * Covers exactly **the labels that come from `items`**: the top-level entries
   * — link entries and mega-panel triggers alike — and the links inside a mega
   * panel, in both the desktop bar and the mobile overlay. That is the whole
   * rule; there is no second condition to remember.
   *
   * Deliberately NOT covered: the logo, the CTA, the secondary link, the
   * featured card's overline / title / link text, mega-group titles and link
   * descriptions. Those are chrome around the menu, not the menu, and a page
   * that scrambles its own brand name or its "Request a visit" button is
   * almost certainly not what was asked for.
   *
   * The **string stays the single source**: React keys, the open-panel state,
   * trigger refs and every `aria-*` value keep reading `label`, never the node
   * this returns. Technical, not content — never in `editSchema`/`defaults`.
   *
   * ```tsx
   * <Navbar03 renderLabel={(l) => <ScrambleText text={l} trigger="hover" />} />
   * ```
   */
  renderLabel?: (label: string) => ReactNode;
  /** Root for this instance's DOM ids. Defaults to a per-instance React id, so
   *  the block can be used twice on a page. Technical, not content (BLOCK-SPEC §10). */
  htmlId?: string;
}

/** Panel entries render as buttons; plain entries as links. */
function hasPanel(
  entry: NavEntry
): entry is { label: string; panel: { groups: MegaGroup[]; featured?: MegaFeatured } } {
  return 'panel' in entry;
}

const DEFAULT_ITEMS: NavEntry[] = [
  {
    label: 'Services',
    panel: {
      groups: [
        {
          title: 'Care',
          links: [
            {
              label: 'Pool & water',
              description: 'Weekly balancing, cleaning and equipment checks.',
              href: '/demo#services',
            },
            {
              label: 'Garden & grounds',
              description: 'Irrigation, pruning and seasonal planting.',
              href: '/demo#services',
            },
            {
              label: 'Guest-ready',
              description: 'Fresh linen, a spotless home, a welcome at the door.',
              href: '/demo#services',
            },
            {
              label: 'Storm checks',
              description: 'Off-season inspections with prompt reports.',
              href: '/demo#services',
            },
          ],
        },
        {
          title: 'Company',
          links: [
            {
              label: 'About',
              description: 'Who looks after your home.',
              href: '/demo/story',
            },
            {
              label: 'How we work',
              description: 'From first visit to a plan.',
              href: '/demo/story#how',
            },
          ],
        },
      ],
      featured: {
        label: 'Featured story',
        image: {
          src: '/placeholders/gallery-villa.svg',
          alt: 'A cared-for coastal villa',
        },
        title: 'How we keep villas guest-ready all season',
        href: '/demo/story',
      },
    },
  },
  { label: 'Plans', href: '/demo#pricing' },
  { label: 'Reviews', href: '/demo#testimonials' },
];

/**
 * navbar-03 — a mega-menu header. On `lg+` panel entries open rich dropdowns
 * (link groups with descriptions plus an optional featured card); below `lg` the
 * burger opens a fullscreen overlay with the same content as an accordion and a
 * sticky bottom CTA.
 *
 * Interaction is React state + CSS only — no GSAP (`animation.level: "none"`).
 * Panels open on click (not hover) so the menu works on touch and from the
 * keyboard: one panel at a time, Escape closes and returns focus to its trigger,
 * an outside click closes, and the plus icon rotates 45° into a cross in CSS.
 *
 * Progressive enhancement: the panels and the overlay need JS (the same accepted
 * trade-off as navbar-01's mobile menu). Without JS the plain entries, the
 * secondary link and the CTA are still real anchors and fully usable.
 *
 * Label lengths: unlike navbar-01/02 the CTA stays visible on mobile, so the bar
 * shares a narrow row with the logo. A short CTA label (≤ ~14 chars) reads best
 * there; the logo label and the CTA both truncate on overflow (the burger and
 * the overlay's close button never shrink), so longer labels degrade to an
 * ellipsis instead of forcing the page to scroll horizontally.
 */
export function Navbar03({
  logo = { label: 'Vora Mar', href: '/demo' },
  items = DEFAULT_ITEMS,
  secondaryLink = { label: 'Owner login', href: '#' },
  cta = { label: 'Request a visit', href: '/demo#contact' },
  renderLabel,
  htmlId,
}: Navbar03Props) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  // The only place a menu label becomes a node. Absent the prop this returns the
  // string itself, so the markup is byte-identical to a block without the seam.
  const labelNode = (label: string): ReactNode =>
    renderLabel ? renderLabel(label) : label;

  // Ids are instance-scoped (two navbars can share a page) and derived from the
  // entry's index, not its label — two entries may legitimately share a label.
  const autoId = useId();
  const baseId = htmlId ?? autoId;
  const overlayId = `${baseId}-overlay`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Desktop panel: Escape closes and restores focus; an outside click closes.
  useEffect(() => {
    if (!openPanel) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const label = openPanel as string;
      setOpenPanel(null);
      triggerRefs.current[label]?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setOpenPanel(null);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [openPanel]);

  // Overlay: lock body scroll. The cleanup runs both when the overlay closes and
  // on unmount / route change, so the page can never be left unscrollable.
  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Overlay: move focus to the close button; Escape closes and returns to burger.
  useEffect(() => {
    if (!mobileOpen) return;
    closeRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setMobileOpen(false);
      burgerRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const closeOverlay = () => {
    setMobileOpen(false);
    setOpenSection(null);
  };

  return (
    <>
      <header
        ref={headerRef}
        className="border-border bg-background/85 sticky top-0 z-50 border-b backdrop-blur"
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6"
        >
          {/* min-w-0 + a truncating label: the logo yields space first, so long
            brand names can never widen the header past the viewport. */}
          <Link
            href={logo.href}
            className="text-foreground flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <span className="inline-flex shrink-0">
              {logo.mark ?? <BrandMark size={22} className="text-primary" />}
            </span>
            <span className="font-display truncate">{logo.label}</span>
          </Link>

          {/* Desktop entries */}
          <ul className="hidden items-center gap-1 lg:flex">
            {items.map((entry, index) =>
              hasPanel(entry) ? (
                <li key={entry.label}>
                  <button
                    type="button"
                    ref={(node) => {
                      triggerRefs.current[entry.label] = node;
                    }}
                    aria-expanded={openPanel === entry.label}
                    aria-controls={panelId(index)}
                    onClick={() =>
                      setOpenPanel((current) =>
                        current === entry.label ? null : entry.label
                      )
                    }
                    className="text-muted hover:text-foreground rounded-token inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors"
                  >
                    {labelNode(entry.label)}
                    <Plus
                      size={16}
                      className={`shrink-0 transition-transform duration-200 ${
                        openPanel === entry.label ? 'rotate-45' : ''
                      }`}
                    />
                  </button>
                </li>
              ) : (
                <li key={entry.label}>
                  <Link
                    href={entry.href}
                    className="text-muted hover:text-foreground rounded-token inline-flex px-3 py-2 text-sm transition-colors"
                  >
                    {labelNode(entry.label)}
                  </Link>
                </li>
              )
            )}
          </ul>

          {/* Right cluster — shrinkable (min-w-0), so a long CTA label can never
            push the burger out of the viewport; the burger itself never shrinks. */}
          <div className="flex min-w-0 items-center gap-2">
            {secondaryLink ? (
              <Link
                href={secondaryLink.href}
                className="text-muted hover:text-foreground hidden px-3 py-2 text-sm whitespace-nowrap transition-colors lg:inline-flex"
              >
                {secondaryLink.label}
              </Link>
            ) : null}
            <Link
              href={cta.href}
              className="bg-primary text-primary-foreground inline-flex max-w-[42vw] min-w-0 items-center justify-center rounded-full px-3 py-2 text-sm font-medium transition-opacity hover:opacity-90 sm:max-w-none sm:px-4"
            >
              <span className="truncate">{cta.label}</span>
            </Link>
            <button
              ref={burgerRef}
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls={overlayId}
              onClick={() => setMobileOpen((v) => !v)}
              className="text-foreground rounded-token inline-flex shrink-0 items-center justify-center p-2 lg:hidden"
            >
              <List size={24} />
            </button>
          </div>
        </nav>

        {/* Desktop panels — kept mounted so opening and closing both animate;
          the closed ones are inert, so they stay out of the tab order. */}
        {items.map((entry, index) => {
          if (!hasPanel(entry)) return null;
          const isOpen = openPanel === entry.label;
          return (
            <div
              key={entry.label}
              id={panelId(index)}
              inert={!isOpen}
              className={[
                'absolute inset-x-0 top-full hidden px-4 pt-2 transition duration-200 lg:block',
                isOpen
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-1 opacity-0',
              ].join(' ')}
            >
              <div className="rounded-token border-border bg-background mx-auto grid max-w-6xl gap-8 border p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:p-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  {entry.panel.groups.map((group) => (
                    <div key={group.title ?? group.links[0]?.label}>
                      {group.title ? (
                        <p className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
                          {group.title}
                        </p>
                      ) : null}
                      <ul className="space-y-1">
                        {group.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setOpenPanel(null)}
                              className="rounded-token hover:bg-accent group/link -mx-2 flex items-start gap-3 px-2 py-2 transition-colors"
                            >
                              <span className="min-w-0">
                                <span className="text-foreground block text-sm font-medium">
                                  {labelNode(link.label)}
                                </span>
                                {link.description ? (
                                  <span className="text-muted mt-0.5 block text-sm">
                                    {link.description}
                                  </span>
                                ) : null}
                              </span>
                              <span className="text-muted group-hover/link:text-foreground mt-0.5 transition-colors">
                                <ArrowCircleRight size={18} className="shrink-0" />
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {entry.panel.featured ? (
                  <div className="lg:w-64">
                    <Link
                      href={entry.panel.featured.href}
                      onClick={() => setOpenPanel(null)}
                      className="group/feat block"
                    >
                      <span className="rounded-token bg-surface relative block aspect-[4/3] overflow-hidden">
                        <Image
                          src={entry.panel.featured.image.src}
                          alt={entry.panel.featured.image.alt}
                          fill
                          sizes="16rem"
                          className="object-cover"
                        />
                      </span>
                      {entry.panel.featured.label ? (
                        <span className="text-muted mt-3 block text-xs font-medium tracking-wide uppercase">
                          {entry.panel.featured.label}
                        </span>
                      ) : null}
                      <span className="font-display text-foreground mt-1 block text-base font-semibold">
                        {entry.panel.featured.title}
                      </span>
                      <span className="text-foreground mt-2 inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 group-hover/feat:no-underline">
                        {entry.panel.featured.linkLabel ?? 'Read more'}
                        <ArrowCircleRight size={18} className="shrink-0" />
                      </span>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </header>

      {/* Mobile / tablet fullscreen overlay — a SIBLING of the header, not a
          child: the header's backdrop-blur (a backdrop-filter) makes the header
          the containing block for fixed descendants, which would squeeze the
          fixed inset-0 overlay into the 64px bar. As a sibling it is positioned
          by the real viewport. */}
      {mobileOpen ? (
        <div
          id={overlayId}
          className="bg-background fixed inset-0 z-50 flex flex-col overflow-y-auto lg:hidden"
        >
          <div className="border-border flex h-16 shrink-0 items-center justify-between gap-3 border-b px-4 sm:gap-4 sm:px-6">
            <Link
              href={logo.href}
              onClick={closeOverlay}
              className="text-foreground flex min-w-0 items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <span className="inline-flex shrink-0">
                {logo.mark ?? <BrandMark size={22} className="text-primary" />}
              </span>
              <span className="font-display truncate">{logo.label}</span>
            </Link>
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href={cta.href}
                onClick={closeOverlay}
                className="bg-primary text-primary-foreground inline-flex max-w-[42vw] min-w-0 items-center justify-center rounded-full px-3 py-2 text-sm font-medium sm:max-w-none sm:px-4"
              >
                <span className="truncate">{cta.label}</span>
              </Link>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  closeOverlay();
                  burgerRef.current?.focus();
                }}
                className="text-foreground rounded-token inline-flex shrink-0 items-center justify-center p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 sm:px-6">
            <ul className="divide-border divide-y">
              {items.map((entry, index) =>
                hasPanel(entry) ? (
                  <li key={entry.label}>
                    <button
                      type="button"
                      aria-expanded={openSection === entry.label}
                      aria-controls={`${panelId(index)}-mobile`}
                      onClick={() =>
                        setOpenSection((current) =>
                          current === entry.label ? null : entry.label
                        )
                      }
                      className="text-foreground flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-medium"
                    >
                      {labelNode(entry.label)}
                      <Plus
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${
                          openSection === entry.label ? 'rotate-45' : ''
                        }`}
                      />
                    </button>
                    <div
                      id={`${panelId(index)}-mobile`}
                      hidden={openSection !== entry.label}
                      className="pb-4"
                    >
                      {entry.panel.groups.map((group) => (
                        <div key={group.title ?? group.links[0]?.label} className="mb-4">
                          {group.title ? (
                            <p className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
                              {group.title}
                            </p>
                          ) : null}
                          <ul className="space-y-1">
                            {group.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={closeOverlay}
                                  className="rounded-token hover:bg-accent -mx-2 block px-2 py-2"
                                >
                                  <span className="text-foreground block text-base">
                                    {labelNode(link.label)}
                                  </span>
                                  {link.description ? (
                                    <span className="text-muted mt-0.5 block text-sm">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={entry.label}>
                    <Link
                      href={entry.href}
                      onClick={closeOverlay}
                      className="text-foreground block py-4 text-lg font-medium"
                    >
                      {labelNode(entry.label)}
                    </Link>
                  </li>
                )
              )}
              {secondaryLink ? (
                <li>
                  <Link
                    href={secondaryLink.href}
                    onClick={closeOverlay}
                    className="text-muted block py-4 text-lg"
                  >
                    {secondaryLink.label}
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="border-border bg-background sticky bottom-0 border-t px-4 py-4 sm:px-6">
            <Link
              href={cta.href}
              onClick={closeOverlay}
              className="bg-primary text-primary-foreground block rounded-full px-5 py-3 text-center text-base font-medium"
            >
              {cta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
