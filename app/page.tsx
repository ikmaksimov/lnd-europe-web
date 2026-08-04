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
import { StatementHighlight } from '@/components/sections/statement-highlight';
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
              description: 'The intelligence infrastructure behind European B2B growth.',
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

// Parked with the block hero above — kept so restoring it is one uncomment.
// const HERO_STATS = [
//   { label: '10+ years in European B2B', icon: <Clock size={20} /> },
//   { label: 'In-house intelligence engine', icon: <Cpu size={20} /> },
//   { label: 'Pan-European coverage', icon: <Globe size={20} /> },
// ];

/**
 * The "why" statement, split into prose and the three phrases that light up.
 * `start` is where each phrase begins in the section's scroll runway (0–1); the
 * icons trace the actual sequence of the work: scan → verify → convert.
 */
const WHY_STATEMENT = [
  'European markets move every day. Static databases do not. Our living intelligence engine continuously ',
  {
    text: 'maps the companies that matter',
    icon: <Broadcast />,
    start: 0.08,
  },
  ', ',
  {
    text: 'verifies and prioritizes every account',
    icon: <SealCheck />,
    start: 0.32,
  },
  ', and ',
  {
    text: 'turns live market signals into qualified pipeline',
    icon: <Funnel />,
    start: 0.58,
  },
  '.',
];

const SOLUTIONS = [
  {
    title: 'European Market Entry',
    description:
      'Enter new markets with a verified, prioritized map of the companies that matter.',
    icon: <Globe size={40} className="text-brand" />,
  },
  {
    title: 'B2B Demand Generation',
    description: 'Turn intelligence into qualified, multilingual demand across Europe.',
    icon: <TrendUp size={40} className="text-brand" />,
  },
  {
    title: 'Buyer Acquisition',
    description: 'Find and reach the right buyers, not just more contacts.',
    icon: <Target size={40} className="text-brand" />,
  },
  {
    title: 'Exhibitor Recruitment',
    description:
      'Fill your floor with relevant exhibitors, backed by 10+ years in the exhibition industry.',
    icon: <Tent size={40} className="text-brand" />,
  },
  {
    title: 'Investment Promotion',
    description:
      "Connect IPAs and regions with the investors and companies they're built to attract.",
    icon: <Bank size={40} className="text-brand" />,
  },
  {
    title: 'Strategic Partnerships',
    description: 'Identify and open the partnerships that move your business forward.',
    icon: <LinkIcon size={40} className="text-brand" />,
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
          secondaryCta={{ label: 'Explore the engine', href: '#how-it-works' }}
        />

        <div id="why" className="scroll-mt-16">
          <StatementHighlight eyebrow="Why LND Europe" parts={WHY_STATEMENT} />
        </div>

        <div id="solutions" className="scroll-mt-16">
          <Features03
            htmlId="solutions"
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
