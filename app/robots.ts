import type { MetadataRoute } from 'next';
import { siteConfig } from '@/site.config';

/**
 * robots.txt via Next file convention. A client site is meant to be crawled and
 * indexed, so it allows everything and points at the sitemap. (The Trencadís
 * showcase does the opposite — it disallows all, being an internal tool.)
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
