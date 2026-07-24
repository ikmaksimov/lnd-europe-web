import type { Thing, WithContext } from 'schema-dts';

/**
 * Renders a JSON-LD structured-data block. Kept as a shell component so client
 * sites (and the /demo page) can drop in Organization / WebSite / LocalBusiness /
 * FAQPage graphs. See docs/SEO-BASELINE.md §2.
 */
export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // Data is authored in-repo (never user input); safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
