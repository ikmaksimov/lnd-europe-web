/**
 * Shared navbar/footer config for `Navbar03` + `Footer02`, used identically by
 * `/` and `/ai` (and any future page that mounts the navbar). Cross-section
 * hrefs are root-relative (`/#engine`) rather than bare hashes — a bare hash on
 * `/ai` would resolve to `/ai#engine`, which is nothing, since the target
 * sections live on the home page. Root-relative hrefs behave identically on
 * the home page itself, so nothing changes there.
 */

/** The single booking action, shared by the header, the hero and the closing CTA. */
export const BOOK_A_CALL = {
  label: 'Book a strategy call',
  href: 'https://www.linkedin.com/company/lnd-tech-europe',
};

/**
 * Featured card — same content in the header mega menu and the footer. Points at
 * the LinkedIn launch post; the title is a line lifted from it. The share URL's
 * tracking parameters are stripped, leaving the canonical post link.
 */
export const FEATURED = {
  label: 'Featured',
  // The post's own artwork. It sits inside a link that already carries the
  // title, so the image itself is decorative.
  image: { src: '/featured-post.jpg', alt: '' },
  title: 'The data behind most B2B strategies stays frozen in time.',
  href: 'https://www.linkedin.com/posts/lnd-tech-europe_b2bgrowth-commercialintelligence-aiforbusiness-activity-7487485019423215616-FMoc',
  linkLabel: 'Read on LinkedIn',
};

/** The navbar's secondary (non-CTA) link, next to the primary CTA button. */
export const SECONDARY_LINK = { label: 'Contact', href: '/#contact' };

export const NAV_ITEMS = [
  { label: 'The engine', href: '/#engine' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'AI engineering', href: '/ai' },
  { label: 'How we work', href: '/#how-it-works' },
  { label: 'Industries', href: '/#industries' },
  {
    label: 'Company',
    panel: {
      groups: [
        {
          links: [
            {
              label: 'About',
              description: 'The intelligence infrastructure behind European B2B growth.',
              href: '/#why',
            },
            {
              label: 'How we work together',
              description: 'From market intelligence to qualified pipeline.',
              href: '/#how-it-works',
            },
          ],
        },
      ],
      featured: FEATURED,
    },
  },
];

export const FOOTER_LINKS = [
  { label: 'About', href: '/#why' },
  { label: 'The engine', href: '/#engine' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'AI engineering', href: '/ai' },
  { label: 'How we work', href: '/#how-it-works' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Contact', href: '/#contact' },
];
