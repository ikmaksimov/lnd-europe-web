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

  return [{ url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 }];
}
