import type { Organization, WithContext } from 'schema-dts';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/site.config';
import { Navbar03 } from '@/blocks/navbar/navbar-03/navbar-03';
import { Hero02 } from '@/blocks/hero/hero-02/hero-02';
import { Statement01 } from '@/blocks/statement/statement-01/statement-01';
import { Features03 } from '@/blocks/features/features-03/features-03';
import { Steps01 } from '@/blocks/steps/steps-01/steps-01';
import { Cta02 } from '@/blocks/cta/cta-02/cta-02';
import { Footer02 } from '@/blocks/footer/footer-02/footer-02';

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
 * Home page — composed from Trencadís blocks on their default content. Real copy,
 * brand colours and client photos are applied later; for now every section runs
 * on its shipped defaults. One <h1> (the hero); h2/h3 below it without gaps.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <Navbar03 />
      <main>
        <Hero02 headingLevel="h1" imagePriority />
        <Statement01 />
        <Features03 />
        <Steps01 />
        <Cta02 />
      </main>
      <Footer02 />
    </>
  );
}
