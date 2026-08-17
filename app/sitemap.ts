import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * sitemap.xml via Next file convention. Lists the home route; add an entry here
 * for each page you create (e.g. /about, /services) so search engines discover
 * them. There is no block registry in a client site — routes are your own.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // /ai is deliberately omitted, per TASK-legal-pages-resolve-markers.md:
    // the page still carries live [TO CONFIRM]/[sign-off] markers and ships
    // `robots: { index: false, follow: false }` (see app/ai/page.tsx), so
    // listing it here would contradict that noindex. Restore this entry
    // (`priority: 0.9`, same shape as the others) together with deleting the
    // robots line, in the same future change that resolves those markers.
    {
      url: `${base}/legal-notice`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/cookies`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
