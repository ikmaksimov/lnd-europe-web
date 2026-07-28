/**
 * Single source of truth for shell-level config: brand, domain, locale and
 * feature flags. This is the one file you edit to make the site yours — set the
 * brand, the production URL, and the organization, then compose the home page
 * from Trencadís blocks. See docs/SEO-BASELINE.md in the Trencadís repo.
 *
 * The OG image is generated as a PNG from these values by app/opengraph-image.tsx
 * (social scrapers don't render SVG), so there is no static og-image path here.
 */
export const siteConfig = {
  /** Brand name used in the <title> template and JSON-LD. */
  name: 'LND Tech Europe',
  /** Short tagline for metadata descriptions and Organization JSON-LD. */
  tagline: 'The intelligence infrastructure behind European B2B growth',
  description:
    'We find the European companies that matter for your business — and help you reach them, powered by a living intelligence engine, not a static database.',
  /** Absolute base URL. Used for metadataBase, canonical URLs, sitemap, OG. */
  url: 'https://lndeurope.com',
  /** BCP-47 locale for <html lang> and og:locale. */
  locale: 'en',
  ogLocale: 'en_US',
  /** Site owner — surfaced in Organization JSON-LD. */
  organization: {
    name: 'LND Tech Europe',
    url: 'https://lndeurope.com',
  },
  /**
   * Smooth scrolling (Lenis). Toggling this flag mounts/unmounts the provider
   * in the root layout — blocks never know about Lenis. See lenis-provider.tsx.
   */
  smoothScroll: true,
} as const;

export type SiteConfig = typeof siteConfig;
