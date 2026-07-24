'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { BlockBaseProps } from '@/lib/animations/types';

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
}

/** Panel entries render as buttons; plain entries as links. */
function hasPanel(
  entry: NavEntry
): entry is { label: string; panel: { groups: MegaGroup[]; featured?: MegaFeatured } } {
  return 'panel' in entry;
}

/** Deterministic id from the entry label (SSR-safe). */
function panelId(label: string): string {
  return `navbar-03-panel-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
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
 */
export function Navbar03({
  logo = { label: 'Vora Mar', href: '/demo' },
  items = DEFAULT_ITEMS,
  secondaryLink = { label: 'Owner login', href: '#' },
  cta = { label: 'Request a visit', href: '/demo#contact' },
}: Navbar03Props) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

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
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          href={logo.href}
          className="text-foreground flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight"
        >
          {logo.mark ?? <BrandMark />}
          <span className="font-display">{logo.label}</span>
        </Link>

        {/* Desktop entries */}
        <ul className="hidden items-center gap-1 lg:flex">
          {items.map((entry) =>
            hasPanel(entry) ? (
              <li key={entry.label}>
                <button
                  type="button"
                  ref={(node) => {
                    triggerRefs.current[entry.label] = node;
                  }}
                  aria-expanded={openPanel === entry.label}
                  aria-controls={panelId(entry.label)}
                  onClick={() =>
                    setOpenPanel((current) =>
                      current === entry.label ? null : entry.label
                    )
                  }
                  className="text-muted hover:text-foreground rounded-token inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors"
                >
                  {entry.label}
                  <PlusIcon open={openPanel === entry.label} />
                </button>
              </li>
            ) : (
              <li key={entry.label}>
                <Link
                  href={entry.href}
                  className="text-muted hover:text-foreground rounded-token inline-flex px-3 py-2 text-sm transition-colors"
                >
                  {entry.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Right cluster */}
        <div className="flex shrink-0 items-center gap-2">
          {secondaryLink ? (
            <Link
              href={secondaryLink.href}
              className="text-muted hover:text-foreground hidden px-3 py-2 text-sm transition-colors lg:inline-flex"
            >
              {secondaryLink.label}
            </Link>
          ) : null}
          <Link
            href={cta.href}
            className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
          >
            {cta.label}
          </Link>
          <button
            ref={burgerRef}
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="navbar-03-overlay"
            onClick={() => setMobileOpen((v) => !v)}
            className="text-foreground rounded-token inline-flex items-center justify-center p-2 lg:hidden"
          >
            <BurgerIcon />
          </button>
        </div>
      </nav>

      {/* Desktop panels — kept mounted so opening and closing both animate;
          the closed ones are inert, so they stay out of the tab order. */}
      {items.filter(hasPanel).map((entry) => {
        const isOpen = openPanel === entry.label;
        return (
          <div
            key={entry.label}
            id={panelId(entry.label)}
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
                            className="rounded-token hover:bg-surface group/link -mx-2 flex items-start gap-3 px-2 py-2 transition-colors"
                          >
                            <span className="min-w-0">
                              <span className="text-foreground block text-sm font-medium">
                                {link.label}
                              </span>
                              {link.description ? (
                                <span className="text-muted mt-0.5 block text-sm">
                                  {link.description}
                                </span>
                              ) : null}
                            </span>
                            <span className="text-muted group-hover/link:text-foreground mt-0.5 transition-colors">
                              <ArrowCircleIcon />
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
                      <ArrowCircleIcon />
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
          id="navbar-03-overlay"
          className="bg-background fixed inset-0 z-50 flex flex-col overflow-y-auto lg:hidden"
        >
          <div className="border-border flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
            <Link
              href={logo.href}
              onClick={closeOverlay}
              className="text-foreground flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              {logo.mark ?? <BrandMark />}
              <span className="font-display">{logo.label}</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href={cta.href}
                onClick={closeOverlay}
                className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium"
              >
                {cta.label}
              </Link>
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={() => {
                  closeOverlay();
                  burgerRef.current?.focus();
                }}
                className="text-foreground rounded-token inline-flex items-center justify-center p-2"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-4 sm:px-6">
            <ul className="divide-border divide-y">
              {items.map((entry) =>
                hasPanel(entry) ? (
                  <li key={entry.label}>
                    <button
                      type="button"
                      aria-expanded={openSection === entry.label}
                      aria-controls={`${panelId(entry.label)}-mobile`}
                      onClick={() =>
                        setOpenSection((current) =>
                          current === entry.label ? null : entry.label
                        )
                      }
                      className="text-foreground flex w-full items-center justify-between gap-4 py-4 text-left text-lg font-medium"
                    >
                      {entry.label}
                      <PlusIcon open={openSection === entry.label} />
                    </button>
                    <div
                      id={`${panelId(entry.label)}-mobile`}
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
                                  className="rounded-token hover:bg-surface -mx-2 block px-2 py-2"
                                >
                                  <span className="text-foreground block text-base">
                                    {link.label}
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
                      {entry.label}
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

/* --- Inline icons (Lucide paths, ISC) — per BLOCK-SPEC §7 --- */

function BrandMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-primary"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity="0.55"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1.5"
        fill="currentColor"
        opacity="0.55"
      />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}

/** Lucide "plus" — rotates 45° into a cross when the panel is open (CSS only). */
function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}
    >
      <path d="M5 12h14M12 5v14" />
    </svg>
  );
}

function ArrowCircleIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M12 8l4 4-4 4" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
