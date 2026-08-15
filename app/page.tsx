import type { Organization, WithContext } from 'schema-dts';
import Image from 'next/image';
import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/site.config';
import { Navbar03 } from '@/blocks/navbar/navbar-03/navbar-03';
// The block hero and statement are PARKED, not gone — the page now opens with
// the new treatments below. Re-enable by restoring these imports, the
// HERO_STATS const and the two JSX blocks further down (all kept in place), and
// adding Clock back to the @/lib/icons import.
// import { Hero02 } from '@/blocks/hero/hero-02/hero-02';
// import { Statement01 } from '@/blocks/statement/statement-01/statement-01';
import { HeroBlur } from '@/components/sections/hero-blur';
import { Statement06 } from '@/blocks/statement/statement-06/statement-06';
import { Features06, type Features06Props } from '@/blocks/features/features-06/features-06';
import { MarketScene } from '@/components/scenes/market-scene';
import { VerifyScene } from '@/components/scenes/verify-scene';
import { ReachScene } from '@/components/scenes/reach-scene';
import { Features08 } from '@/blocks/features/features-08/features-08';
import { Features03 } from '@/blocks/features/features-03/features-03';
import { Steps01 } from '@/blocks/steps/steps-01/steps-01';
import { Cta02 } from '@/blocks/cta/cta-02/cta-02';
import { Footer02 } from '@/blocks/footer/footer-02/footer-02';
import { Cpu, Globe, SealCheck } from '@/lib/icons';
import {
  Bank,
  Broadcast,
  Factory,
  Funnel,
  Link as LinkIcon,
  Package,
  Rocket,
  Target,
  Tent,
  TrendUp,
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
const BOOK_A_CALL = {
  label: 'Book a strategy call',
  href: 'https://www.linkedin.com/company/lnd-tech-europe',
};

/**
 * Featured card — same content in the header mega menu and the footer. Points at
 * the LinkedIn launch post; the title is a line lifted from it. The share URL's
 * tracking parameters are stripped, leaving the canonical post link.
 */
const FEATURED = {
  label: 'Featured',
  // The post's own artwork. It sits inside a link that already carries the
  // title, so the image itself is decorative.
  image: { src: '/featured-post.jpg', alt: '' },
  title: 'The data behind most B2B strategies stays frozen in time.',
  href: 'https://www.linkedin.com/posts/lnd-tech-europe_b2bgrowth-commercialintelligence-aiforbusiness-activity-7487485019423215616-FMoc',
  linkLabel: 'Read on LinkedIn',
};

const NAV_ITEMS = [
  { label: 'The engine', href: '#engine' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How we work', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  {
    label: 'Company',
    panel: {
      groups: [
        {
          links: [
            {
              label: 'About',
              description: 'The intelligence infrastructure behind European B2B growth.',
              href: '#why',
            },
            {
              label: 'How we work together',
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

// Parked with the block hero above — kept so restoring it is one uncomment.
// const HERO_STATS = [
//   { label: '10+ years in European B2B', icon: <Clock size={20} /> },
//   { label: 'In-house intelligence engine', icon: <Cpu size={20} /> },
//   { label: 'Pan-European coverage', icon: <Globe size={20} /> },
// ];

const SOLUTION_GROUPS = [
  {
    heading: 'Find the market that matters',
    items: [
      {
        icon: <Globe size={22} className="text-brand" />,
        title: 'European market entry',
        description:
          'Enter new markets with a verified, prioritized map of the companies that matter.',
      },
      {
        icon: <Target size={22} className="text-brand" />,
        title: 'ICP & account mapping',
        description:
          'Automated discovery defines your ideal customer, then maps the market against it.',
      },
      {
        icon: <Bank size={22} className="text-brand" />,
        title: 'Investment promotion',
        description:
          "Connect IPAs and regions with the investors and companies they're built to attract.",
      },
    ],
  },
  {
    heading: 'Reach the buyers who matter',
    items: [
      {
        icon: <TrendUp size={22} className="text-brand" />,
        title: 'B2B demand generation',
        description: 'Turn intelligence into qualified, multilingual demand across Europe.',
      },
      {
        icon: <Funnel size={22} className="text-brand" />,
        title: 'Buyer acquisition',
        description: 'Find and reach the right buyers, not just more contacts.',
      },
      {
        icon: <Broadcast size={22} className="text-brand" />,
        title: 'Multilingual outreach',
        description:
          'AI-driven campaigns across LinkedIn, Google and Meta reach accounts in their own language.',
      },
    ],
  },
  {
    heading: 'Turn interest into pipeline',
    items: [
      {
        icon: <Tent size={22} className="text-brand" />,
        title: 'Exhibitor recruitment',
        description:
          'Fill your floor with relevant exhibitors, backed by 10+ years in the exhibition industry.',
      },
      {
        icon: <LinkIcon size={22} className="text-brand" />,
        title: 'Strategic partnerships',
        description: 'Identify and open the partnerships that move your business forward.',
      },
      {
        icon: <SealCheck size={22} className="text-brand" />,
        title: 'Qualified pipeline & CRM',
        description:
          'Leads flow into your CRM with analytics and continuous optimization behind them.',
      },
    ],
  },
];

/** The three layers the isometric engine scene draws: map → verify → activate. */
const ENGINE_ITEMS: NonNullable<Features06Props['items']> = [
  {
    badge: 'Layer 01',
    eyebrow: 'Every company, not a sample',
    title: 'The market, mapped continuously',
    description:
      'We map every company in your target market against your ICP — industry, size, projects and market signals — and keep that map moving as the market does.',
    media: <MarketScene />,
    points: [
      {
        icon: <Globe size={20} className="text-brand" />,
        title: 'Pan-European coverage',
        description: 'Markets mapped country by country, in the local language.',
      },
      {
        icon: <Target size={20} className="text-brand" />,
        title: 'Scored against your ICP',
        description: 'Every profile ranked by how well it fits what you actually sell.',
      },
    ],
  },
  {
    badge: 'Layer 02',
    eyebrow: 'Not a database dump',
    title: 'Verified before it reaches you',
    description:
      'Every account is checked and enriched before it counts as a lead, so your team spends its time on companies that are real, reachable and relevant now.',
    media: <VerifyScene />,
    points: [
      {
        icon: <SealCheck size={20} className="text-brand" />,
        title: 'Checked, not scraped',
        description: 'Contacts and company data verified before they enter your pipeline.',
      },
      {
        icon: <Cpu size={20} className="text-brand" />,
        title: 'Continuously re-scored',
        description: 'Profiles are re-checked as signals change, so nothing goes stale.',
      },
    ],
  },
  {
    badge: 'Layer 03',
    eyebrow: 'From intelligence to pipeline',
    title: 'Reached in the language they buy in',
    description:
      'Multilingual campaigns across LinkedIn, Google and Meta reach the mapped accounts, and qualified conversations land in your CRM with the analytics behind them.',
    media: <ReachScene />,
    points: [
      {
        icon: <Broadcast size={20} className="text-brand" />,
        title: 'Cross-channel outreach',
        description: 'The same account approached coherently across every channel.',
      },
      {
        icon: <Funnel size={20} className="text-brand" />,
        title: 'Straight into your CRM',
        description: 'Qualified leads arrive where your team already works.',
      },
    ],
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

/** The seven audiences from the copy deck, condensed to six: the two
 *  public-sector entries (IPAs, governments and economic development agencies)
 *  share an entry, since the engagement is the same. */
const INDUSTRIES = [
  {
    title: 'International Exhibition Organizers',
    description:
      'Fill your floor with relevant exhibitors and buyers, backed by 10+ years in the exhibition industry.',
    icon: <Tent size={40} className="text-brand" />,
  },
  {
    title: 'IPAs & Economic Development Agencies',
    description:
      'Reach the investors and companies your region is built to attract, market by market.',
    icon: <Bank size={40} className="text-brand" />,
  },
  {
    title: 'Trade Promotion Organizations',
    description:
      'Connect national exporters with verified buyers and partners across Europe.',
    icon: <Package size={40} className="text-brand" />,
  },
  {
    title: 'B2B Technology Companies',
    description:
      'Enter new European markets with a prioritized map of the accounts that matter.',
    icon: <Cpu size={40} className="text-brand" />,
  },
  {
    title: 'Manufacturers & Exporters',
    description:
      'Find distributors, buyers and partners well beyond your home market.',
    icon: <Factory size={40} className="text-brand" />,
  },
  {
    title: 'International Scale-ups',
    description:
      'Turn intelligence into qualified, multilingual pipeline as you expand across Europe.',
    icon: <Rocket size={40} className="text-brand" />,
  },
];

const FOOTER_LINKS = [
  { label: 'About', href: '#why' },
  { label: 'The engine', href: '#engine' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How we work', href: '#how-it-works' },
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
        // The logo is a wordmark, so it replaces the text label rather than
        // sitting next to it; its alt carries the link's accessible name.
        logo={{
          label: '',
          href: '/',
          mark: (
            <Image
              src="/logo.png"
              alt={siteConfig.name}
              width={67}
              height={40}
              priority
            />
          ),
        }}
        items={NAV_ITEMS}
        secondaryLink={{ label: 'Contact', href: '#contact' }}
        cta={BOOK_A_CALL}
      />
      <main>
        <HeroBlur
          headingLevel="h1"
          eyebrow="European B2B growth intelligence"
          words={{ left: 'SEE', focus: 'EUROPE', right: 'CLEARLY.' }}
          subtitle="We continuously map, verify and prioritize the European companies that matter — then turn that intelligence into qualified demand."
          primaryCta={{ label: 'Map your market', href: BOOK_A_CALL.href }}
          secondaryCta={{ label: 'Explore the engine', href: '#engine' }}
        />

        <div id="why" className="scroll-mt-16">
          <Statement06
            eyebrow="Why LND Europe"
            text="European markets move every day. Static databases do not. Our living intelligence engine continuously maps the companies that matter, verifies and prioritizes every account, and turns live market signals into qualified pipeline."
          />
        </div>

        <div id="engine" className="scroll-mt-16">
          <Features06
            htmlId="engine"
            heading="How the engine works"
            subheading="Three layers between a market you don't know yet and a pipeline your team can work."
            items={ENGINE_ITEMS}
          />
        </div>

        <div id="solutions" className="scroll-mt-16">
          <Features08
            htmlId="solutions"
            eyebrow="What we do"
            heading="One integrated growth engine"
            groups={SOLUTION_GROUPS}
          />
        </div>

        <div id="how-it-works" className="scroll-mt-16">
          <Steps01
            heading="How we work together"
            subheading="Four steps from market intelligence to a qualified pipeline."
            steps={PROCESS}
          />
        </div>

        <div id="industries" className="scroll-mt-16">
          <Features03
            htmlId="industries"
            heading="Who we build for"
            subheading="Organizations whose growth depends on reaching the right companies across Europe."
            items={INDUSTRIES}
          />
        </div>

        <div id="contact" className="scroll-mt-16">
          <Cta02
            // The brand wordmark replaces the library's placeholder tile mark.
            // The block's badge is aria-hidden, so the image is decorative here.
            icon={<Image src="/logo.png" alt="" width={44} height={26} />}
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
        legalLinks={[
          { label: 'Legal Notice', href: '/legal-notice' },
          { label: 'Privacy', href: '/privacy' },
          { label: 'Cookies', href: '/cookies' },
          { label: 'Terms', href: '/terms' },
        ]}
        // The block always renders this slot — omitting the prop restores its
        // "Made by DigitalForms" default — so it carries the company's own link
        // instead. A truly empty slot needs `credit?: FooterLink | null` upstream.
        credit={{
          label: 'LND Tech Europe on LinkedIn',
          href: 'https://www.linkedin.com/company/lnd-tech-europe',
        }}
      />
    </>
  );
}
