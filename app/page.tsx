import type { Organization, WithContext } from 'schema-dts';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/site.config';
import { Navbar03 } from '@/blocks/navbar/navbar-03/navbar-03';
import { Hero02 } from '@/blocks/hero/hero-02/hero-02';
import { Statement01 } from '@/blocks/statement/statement-01/statement-01';
import { Features03 } from '@/blocks/features/features-03/features-03';
import { Features01 } from '@/blocks/features/features-01/features-01';
import { Steps01 } from '@/blocks/steps/steps-01/steps-01';
import { Cta02 } from '@/blocks/cta/cta-02/cta-02';
import { Footer02 } from '@/blocks/footer/footer-02/footer-02';
import {
  ClockIcon,
  CpuIcon,
  FactoryIcon,
  GlobeIcon,
  LandmarkIcon,
  LinkIcon,
  PackageIcon,
  RocketIcon,
  TargetIcon,
  TentIcon,
  TrendingUpIcon,
} from '@/components/icons';

const SLOGAN = 'Light the path. Land the deal.';

// Organization structured data from site.config (SEO-BASELINE §2). Add WebSite /
// LocalBusiness / FAQPage graphs on the pages that need them.
const organizationLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.organization.name,
  url: siteConfig.url,
  description: siteConfig.description,
  slogan: SLOGAN,
};

/** The single booking action, shared by the header, the hero and the closing CTA. */
const BOOK_A_CALL = { label: 'Book a strategy call', href: '#contact' };

/** Featured card — same content in the header mega menu and the footer. */
const FEATURED = {
  label: 'Featured',
  // Placeholder art: swap for a client visual and give it a describing alt.
  image: { src: '/placeholders/featured.svg', alt: '' },
  title: "The future of European B2B growth isn't more data. It's better intelligence.",
  href: '#why',
  linkLabel: 'Read more',
};

const NAV_ITEMS = [
  { label: 'Solutions', href: '#solutions' },
  { label: 'Technology', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  {
    label: 'Company',
    panel: {
      groups: [
        {
          links: [
            {
              label: 'About',
              description: 'The AI infrastructure behind European B2B growth.',
              href: '#why',
            },
            {
              label: 'How we work',
              description: 'From market intelligence to qualified pipeline.',
              href: '#how-it-works',
            },
          ],
        },
      ],
      featured: FEATURED,
    },
  },
];

const HERO_STATS = [
  { label: '10+ years in European B2B', icon: <ClockIcon size={20} /> },
  { label: 'In-house AI engine', icon: <CpuIcon size={20} /> },
  { label: 'Pan-European company intelligence', icon: <GlobeIcon size={20} /> },
];

const SOLUTIONS = [
  {
    title: 'European Market Entry',
    description:
      'Enter new markets with a verified, prioritized map of the companies that matter.',
    icon: <GlobeIcon size={40} className="h-10 w-10" />,
  },
  {
    title: 'B2B Demand Generation',
    description: 'Turn intelligence into qualified, multilingual demand across Europe.',
    icon: <TrendingUpIcon size={40} className="h-10 w-10" />,
  },
  {
    title: 'Buyer Acquisition',
    description: 'Find and reach the right buyers, not just more contacts.',
    icon: <TargetIcon size={40} className="h-10 w-10" />,
  },
  {
    title: 'Exhibitor Recruitment',
    description:
      'Fill your floor with relevant exhibitors, backed by 10+ years in the exhibition industry.',
    icon: <TentIcon size={40} className="h-10 w-10" />,
  },
  {
    title: 'Investment Promotion',
    description:
      "Connect IPAs and regions with the investors and companies they're built to attract.",
    icon: <LandmarkIcon size={40} className="h-10 w-10" />,
  },
  {
    title: 'Strategic Partnerships',
    description: 'Identify and open the partnerships that move your business forward.',
    icon: <LinkIcon size={40} className="h-10 w-10" />,
  },
];

const PROCESS = [
  {
    title: 'ICP & market strategy',
    description:
      'We define your ideal customer and target market, then map it with automated ICP discovery.',
  },
  {
    title: 'Intelligence & account mapping',
    description:
      'Our engine researches, enriches and scores companies by industry, project relevance and market signals.',
  },
  {
    title: 'Cross-channel acquisition',
    description:
      'AI-driven multilingual outreach across LinkedIn, Google and Meta reaches the right accounts.',
  },
  {
    title: 'Qualified pipeline & optimization',
    description:
      'Leads flow into your CRM with analytics and continuous optimization behind them.',
  },
];

/** The seven audiences from the copy deck, condensed to a 3×2 grid: the two
 *  public-sector entries (IPAs, governments and economic development agencies)
 *  share a card, since the engagement is the same. */
const INDUSTRIES = [
  {
    title: 'International Exhibition Organizers',
    description:
      'Fill your floor with relevant exhibitors and buyers, backed by 10+ years in the exhibition industry.',
    icon: <TentIcon size={22} />,
  },
  {
    title: 'IPAs & Economic Development Agencies',
    description:
      'Reach the investors and companies your region is built to attract, market by market.',
    icon: <LandmarkIcon size={22} />,
  },
  {
    title: 'Trade Promotion Organizations',
    description:
      'Connect national exporters with verified buyers and partners across Europe.',
    icon: <PackageIcon size={22} />,
  },
  {
    title: 'B2B Technology Companies',
    description:
      'Enter new European markets with a prioritized map of the accounts that matter.',
    icon: <CpuIcon size={22} />,
  },
  {
    title: 'Manufacturers & Exporters',
    description:
      'Find distributors, buyers and partners well beyond your home market.',
    icon: <FactoryIcon size={22} />,
  },
  {
    title: 'International Scale-ups',
    description:
      'Turn intelligence into qualified, multilingual pipeline as you expand across Europe.',
    icon: <RocketIcon size={22} />,
  },
];

const FOOTER_LINKS = [
  { label: 'About', href: '#why' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Technology', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Home page — Trencadís blocks carrying the client's copy. One <h1> (the hero);
 * h2/h3 below it without gaps. Section anchors live on wrapper divs so the blocks
 * stay untouched; `scroll-mt-16` clears the 4rem sticky header.
 */
export default function Home() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <Navbar03
        logo={{ label: siteConfig.name, href: '/' }}
        items={NAV_ITEMS}
        secondaryLink={{ label: 'Contact', href: '#contact' }}
        cta={BOOK_A_CALL}
      />
      <main>
        <Hero02
          headingLevel="h1"
          imagePriority
          badge="10+ years in European B2B"
          eyebrow="AI growth intelligence · Europe"
          title="The AI infrastructure behind European B2B growth."
          subtitle="LND Tech Europe builds proprietary AI powered by a living European Business Intelligence Engine — so you reach the companies that actually matter, in markets that change every day."
          primaryCta={BOOK_A_CALL}
          secondaryCta={{ label: 'See what we build', href: '#solutions' }}
          // Placeholder art: swap for the client's hero photo and describe it in alt.
          background={{ src: '/placeholders/hero-wide.svg', alt: '' }}
          items={HERO_STATS}
        />

        <div id="why" className="scroll-mt-16">
          <Statement01
            eyebrow="Why LND Tech Europe"
            text="Most organizations still make strategic decisions on static data — in markets that move every day. We built a living intelligence network instead of a database: every company profile is continuously mapped, verified, enriched and scored, so your growth always runs on what's true now."
          />
        </div>

        <div id="solutions" className="scroll-mt-16">
          <Features03
            heading="One integrated growth engine"
            subheading="AI, intelligence and data working as one system — from first signal to qualified pipeline."
            items={SOLUTIONS}
          />
        </div>

        <div id="how-it-works" className="scroll-mt-16">
          <Steps01
            heading="How it works"
            subheading="Four steps from market intelligence to a qualified pipeline."
            steps={PROCESS}
          />
        </div>

        <div id="industries" className="scroll-mt-16">
          <Features01
            eyebrow="Industries we serve"
            heading="Who we build for"
            subheading="Organizations whose growth depends on reaching the right companies across Europe."
            items={INDUSTRIES}
          />
        </div>

        <div id="contact" className="scroll-mt-16">
          <Cta02
            title="Get started with LND Tech Europe."
            subtitle="Tell us your market and your goals — we'll show you the European companies that matter most and how we will reach them."
            primaryCta={BOOK_A_CALL}
          />
        </div>
      </main>
      <Footer02
        brand={`${siteConfig.name} · ${SLOGAN}`}
        statementLead="Intelligence,"
        statement="is what European growth is built on"
        body="One integrated growth engine — AI, intelligence, data, LinkedIn, Google, Meta and CRM — for organizations expanding across Europe."
        links={FOOTER_LINKS}
        featured={FEATURED}
        copyright={`© 2026 ${siteConfig.name}. All rights reserved.`}
      />
    </>
  );
}
