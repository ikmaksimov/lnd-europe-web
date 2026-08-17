import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/site.config';
import { Navbar03 } from '@/blocks/navbar/navbar-03/navbar-03';
import { Cta03 } from '@/blocks/cta/cta-03/cta-03';
import { Faq02 } from '@/blocks/faq/faq-02/faq-02';
import { Features12 } from '@/blocks/features/features-12/features-12';
import { Features05 } from '@/blocks/features/features-05/features-05';
import { Faq01 } from '@/blocks/faq/faq-01/faq-01';
import { Cta02 } from '@/blocks/cta/cta-02/cta-02';
import { Footer02 } from '@/blocks/footer/footer-02/footer-02';
import { ArrowUpRight, Cpu, FileText, Key, SealCheck, Star } from '@/lib/icons';
import {
  BOOK_A_CALL,
  FEATURED,
  FOOTER_LINKS,
  NAV_ITEMS,
  SECONDARY_LINK,
} from '@/components/nav-config';

const SLOGAN = 'Light the path. Land the deal.';

export const metadata: Metadata = {
  title: 'AI engineering',
  description:
    'Embedded AI engineers, training, delivery and transformation — built on the practice behind LND Tech Europe’s own intelligence engine.',
  alternates: { canonical: '/ai' },
  // Temporary, per TASK-legal-pages-resolve-markers.md: this page still
  // carries live [TO CONFIRM]/[sign-off] markers naming commercial
  // commitments and a price, so it must stay out of Google's index while it
  // remains publicly linkable for client review. Delete this `robots` line
  // (and restore the /ai entry in app/sitemap.ts) together, in the same
  // future change that resolves those markers — neither edit is permanent.
  robots: { index: false, follow: false },
};

/**
 * S2 offerings (faq-02). No dedicated caption/price slot on this block — each
 * offering's trailing marker(s) ride as the last sentence(s) of its
 * description, exactly as TASKS/CONTENT-ai-page.md writes them. Do not invent
 * a slot or edit the block.
 */
const OFFERINGS = [
  {
    title: '01 · Embedded AI engineer',
    description:
      'A senior engineer from the practice behind our engine works as part of your team, week to week — and the measure of their month is software running in production, not a report about it. Fixed monthly fee, monthly notice. [depends on principle 6 sign-off and the pricing decision] [TO CONFIRM — append "From EUR X/month." or leave unpriced]',
  },
  {
    title: '02 · Training',
    description:
      'A short, dense programme for your leadership and your engineers: where AI actually pays off in your operation, hands-on work on your own cases, and a playbook your team keeps.',
  },
  {
    title: '03 · Delivery',
    description:
      'The workflows and internal products your roadmap keeps postponing — scoped, built and shipped to production with your team, in your stack.',
  },
  {
    title: '04 · Transformation',
    description:
      'For organisations moving whole functions onto AI: an audit of systems and data, an integration architecture, and an adoption programme that reaches every team it touches.',
  },
];

/** S3 — the two titled points features-12 is built for. */
const WHY_US_POINTS = [
  {
    title: 'We run what we build',
    description:
      'The engine that maps and verifies European companies is our own system, built and operated in-house. The people who run it are the people you get.',
  },
  {
    title: 'Built for European operations',
    description:
      'Multilingual by default, GDPR as a baseline [TO CONFIRM], and ten-plus years of B2B work across European markets — the constraints your AI has to live with are the ones we live with.',
  },
];

/**
 * S4 — the six working principles. features-05's 48px icon tile renders
 * unconditionally and falls back to a water drop when an icon is absent, so
 * each principle gets a fitting glyph rather than a repeated placeholder:
 * Star (seniority), SealCheck (production/shipped), Key (the client's own
 * systems), FileText (a human review step — the pen), Cpu (a system that runs
 * on its own) and ArrowUpRight (the exit — no lock-in).
 */
const PRINCIPLES = [
  {
    title: 'Senior people only',
    description:
      'The person in the kickoff is the person doing the work. We do not staff juniors on client accounts. [sign-off]',
    icon: <Star size={22} />,
  },
  {
    title: 'Production is the finish line',
    description:
      'A demo is not a result. An engagement ends when the thing runs with real users and real data. [sign-off]',
    icon: <SealCheck size={22} />,
  },
  {
    title: 'Your systems, your keys',
    description:
      'Work happens in your repositories and your cloud, inside your data boundaries. Nothing we build makes you dependent on us. [sign-off]',
    icon: <Key size={22} />,
  },
  {
    title: 'Humans keep the pen',
    description:
      'Anything that touches money, contracts or customers keeps a human review step until autonomy is earned, process by process. [sign-off]',
    icon: <FileText size={22} />,
  },
  {
    title: 'Built to run without us',
    description:
      'An engagement is not finished until your team can run and extend the work on their own: documentation, an internal owner, no return ticket needed. [sign-off]',
    icon: <Cpu size={22} />,
  },
  {
    title: 'Leave when it stops paying',
    description:
      'Monthly notice, no lock-in, no success fees. If the work is not worth the fee, stopping should be easy. [sign-off — the hardest commercial commitment on the page]',
    icon: <ArrowUpRight size={22} />,
  },
];

/** S5 — FAQ. Kept as a plain array here (not the shared faq-01 data module)
 *  since this content is specific to /ai; faq-01 keeps its own data in a
 *  module ready for FAQPage JSON-LD, which this page must NOT emit yet — see
 *  the note above the block below. */
const FAQ_ITEMS = [
  {
    question: 'Who owns what you build?',
    answer:
      'You do. Code, prompts, pipelines and documentation are delivered into your repositories and remain yours when we leave. [TO CONFIRM — must match the client’s actual contract terms]',
  },
  {
    question: 'Which stack do you work in?',
    answer:
      'Yours. We integrate with the systems you already run — CRM, data warehouse, advertising platforms — rather than introducing our own. [TO CONFIRM — any named systems worth listing]',
  },
  {
    question: 'Where does the work happen?',
    answer: 'Remotely, across European time zones, from Spain. On-site by agreement. [TO CONFIRM]',
  },
  {
    question: 'How fast can an engagement start?',
    answer: '[TO CONFIRM — honest lead time]',
  },
  {
    question: 'How is this different from hiring?',
    answer:
      'No recruiting risk and no long commitment: an engagement starts on the lead time we confirm in scoping (see the previous answer) and ends on monthly notice — after the work is handed over. [depends on principle 6 sign-off]',
  },
  {
    question: 'What does it cost?',
    answer: '[TO CONFIRM — publish a from-price, or answer with the scoping call]',
  },
];

/**
 * /ai — "AI engineering" page. Copy carried verbatim from
 * TASKS/CONTENT-ai-page.md §S1–S6 (the only sections that render — see that
 * task's table). Every `[TO CONFIRM]` / `[sign-off]` / `[depends …]` marker
 * stays visible in the rendered copy; the page does not deploy until the
 * client resolves them.
 *
 * One <h1> (S1's title, cta-03 `headingLevel="h1"`); every other block below
 * it renders a fixed h2, so heading levels never skip. Section anchors live on
 * wrapper divs, exactly as app/page.tsx does — none of these blocks emit
 * `htmlId` as a real DOM id, only as a root for derived ids.
 */
export default function AiEngineeringPage() {
  return (
    <>
      <Navbar03
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
        secondaryLink={SECONDARY_LINK}
        cta={BOOK_A_CALL}
      />
      <main>
        <div id="top" className="scroll-mt-16">
          <Cta03
            htmlId="top"
            headingLevel="h1"
            fullHeight
            title="The team behind our engine, inside yours."
            primaryCta={{ label: 'Book a call', href: BOOK_A_CALL.href }}
            secondaryCta={{ label: 'See the engagements', href: '#ways' }}
          />
        </div>

        <div id="ways" className="scroll-mt-16">
          <Faq02
            htmlId="ways"
            titleLead="Engagements."
            title="From one engineer to the whole function."
            items={OFFERINGS}
            defaultOpen={[0, 1, 2, 3]}
            footerLink={{
              label: 'Not sure which fits? Tell us what you are trying to move.',
              href: '#talk',
            }}
          />
        </div>

        <div id="why" className="scroll-mt-16">
          <Features12
            htmlId="why"
            heading="The engine is the credential."
            lead="Everything on this page is the practice behind our own product: the intelligence engine that maps, verifies and reaches European markets — in production, every day. [sign-off — staffing claim: this section and the page headline stand only if decision 5 is a yes]"
            points={WHY_US_POINTS}
          />
        </div>

        <div id="principles" className="scroll-mt-16">
          <Features05
            htmlId="principles"
            eyebrow="How we engage"
            heading="Six working principles."
            // The content spec has no subheading for this section; the block
            // falls back to unrelated showcase copy if the prop is simply
            // omitted, so it is suppressed explicitly with an empty string
            // (falsy — the block only renders the paragraph when truthy).
            subheading=""
            items={PRINCIPLES}
          />
        </div>

        <div id="faq" className="scroll-mt-16">
          <Faq01
            htmlId="faq"
            eyebrow="FAQ"
            heading="The questions procurement asks."
            items={FAQ_ITEMS}
          />
        </div>

        <div id="talk" className="scroll-mt-16">
          <Cta02
            htmlId="talk"
            // The brand wordmark, as on the home page's closing section.
            icon={<Image src="/logo.png" alt="" width={44} height={26} />}
            title="Tell us what you are trying to move."
            subtitle="One conversation to scope it: which process, which systems, and what a first shipped result would look like."
            primaryCta={{ label: 'Email the team', href: 'mailto:contact@lndeurope.tech' }}
            // See app/page.tsx — the always-rendered footnote slot now has a
            // real `null` option; neither page has a footnote.
            footnote={null}
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
        credit={{
          label: 'LND Tech Europe on LinkedIn',
          href: 'https://www.linkedin.com/company/lnd-tech-europe',
        }}
      />
    </>
  );
}
