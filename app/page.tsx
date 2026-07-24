import type { Organization, WithContext } from 'schema-dts';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/site.config';

// Organization structured data from site.config (SEO-BASELINE §2). Add WebSite /
// LocalBusiness / FAQPage graphs on the pages that need them.
const organizationLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.organization.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

/**
 * Placeholder home. Replace this composition with your real page — hand-written,
 * or the `page.tsx` exported from the Trencadís Page Editor. Run
 * `npx trencadis add <block>` to copy sections into blocks/, then import and
 * arrange them here (one <h1> per page).
 */
export default function Home() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <main className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span
          aria-hidden="true"
          className="rounded-token border-border bg-surface text-foreground mb-8 inline-flex h-14 w-14 items-center justify-center border"
        >
          <BrandMark />
        </span>
        <h1 className="font-display text-foreground text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="text-muted mt-4 max-w-md text-lg">
          This site is built with Trencadís. Run{' '}
          <code className="text-foreground rounded-token bg-surface px-1.5 py-0.5 text-base">
            npx trencadis add &lt;block&gt;
          </code>{' '}
          to place sections, then compose them in <code>app/page.tsx</code>.
        </p>
        <p className="text-muted mt-6 text-sm">
          Edit brand and metadata in <code>site.config.ts</code>.
        </p>
      </main>
    </>
  );
}

/* Inline tile mark (Lucide-style, currentColor). Replace with your own logo. */
function BrandMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
    </svg>
  );
}
