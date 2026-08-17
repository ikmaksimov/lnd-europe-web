import type { Metadata } from 'next';
import Link from 'next/link';
import { Legal01 } from '@/blocks/legal/legal-01/legal-01';

/**
 * Privacy Policy — GDPR Art. 13/14 notice. Content sourced from
 * TASKS/legal/02-privacy-policy.md — do not edit the wording here beyond what
 * is documented below; it is pending review by the client's lawyer. The DPO,
 * server-log retention, enquiry retention and processor-list markers were
 * resolved per TASK-legal-pages-resolve-markers.md §2 — see that file for the
 * exact wording decisions.
 *
 * Structural note: legal-01 renders each section's `paragraphs`, then
 * `items`, then `definitions`, then `tables`, in that fixed order. The source
 * draft sometimes places a sentence *after* a table/list that this fixed
 * order now renders *before* it — e.g. §2.1's "This happens for every
 * visitor…", which depended on the reader having already seen the table. Per
 * TASK-legal-pages-followup.md §1, those specific sentences were reworded
 * (only enough to restore a self-contained reference — nothing else in the
 * legal text was touched):
 *
 * - §2.1 "This happens for every visitor…" → "The processing described below
 *   happens for every visitor…"
 * - §3 "…and only as needed to run the site:" → "…with the providers listed
 *   in the table below, who process it on our behalf, under contract, and
 *   only as needed to run the site." (was a colon promising an immediately
 *   following table; two more sentences now sit between it and the table)
 * - §5 "Under the GDPR you have the right to:" → "…the rights listed below:"
 *   (same colon-adjacency problem, before the items list)
 * - §5 "To exercise any of these, write to…" → "To exercise any of the
 *   rights listed below, write to…" ("these" had no antecedent left before
 *   it — the rights list now renders after this sentence, not before)
 */
const EFFECTIVE_DATE = '2026-08-17';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    "How LND Tech Europe S.L. processes personal data on lndeurope.com, under GDPR Art. 13/14 and Spanish LOPDGDD — what we collect, why, and your rights.",
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Legal01
        title="Privacy Policy"
        effectiveDate={EFFECTIVE_DATE}
        showTableOfContents
        intro={
          <>
            LND Tech Europe S.L. respects your privacy. This policy explains what
            personal data this website processes, why, on what legal basis, and
            what rights you have. It is written to meet Articles 13 and 14 of the
            General Data Protection Regulation (EU) 2016/679 (&quot;GDPR&quot;)
            and Spanish Organic Law 3/2018 (LOPDGDD).
          </>
        }
        sections={[
          {
            id: 'controller',
            title: '1. Who is responsible for your data',
            definitions: [
              { term: 'Data controller', description: 'LND Tech Europe S.L.' },
              { term: 'CIF', description: 'ESB24965386' },
              {
                term: 'Registered office',
                description:
                  'Gran Via del Marqués del Túria, 78, Planta 2, Puerta 4, 46005 Valencia, Spain',
              },
              {
                term: 'Contact for data protection matters',
                description: (
                  <a
                    href="mailto:contact@lndeurope.tech"
                    className="text-foreground underline underline-offset-4"
                  >
                    contact@lndeurope.tech
                  </a>
                ),
              },
              {
                term: 'Data Protection Officer',
                description:
                  'We have not appointed a Data Protection Officer, as our processing does not meet the criteria in Article 37 GDPR.',
              },
            ],
          },
          {
            id: 'what-we-collect',
            title: '2. What we collect, and why',
            paragraphs: [
              <>
                This site has <strong>no contact form, no user accounts and no
                payments</strong>. There are three ways data reaches us.
              </>,
            ],
          },
          {
            id: 'technical-data',
            title: '2.1 Technical data needed to serve the site',
            paragraphs: [
              'The processing described below happens for every visitor and cannot be switched off, because without it the site cannot be delivered to you.',
            ],
            definitions: [
              {
                term: 'What',
                description:
                  'IP address, browser and device type, requested page, timestamp, referring page',
              },
              {
                term: 'Why',
                description:
                  'To deliver the site, keep it secure, and detect abuse or attacks',
              },
              {
                term: 'Legal basis',
                description:
                  'Legitimate interest (GDPR Art. 6(1)(f)) — operating and securing our own website',
              },
              {
                term: 'Retention',
                description:
                  "Server and CDN logs, retained for up to 30 days in line with our hosting providers' policies",
              },
            ],
          },
          {
            id: 'analytics-marketing',
            title: '2.2 Analytics and marketing measurement — only with your consent',
            paragraphs: [
              <>
                <strong>Nothing in this category loads until you accept it.</strong>{' '}
                If you decline, or simply ignore the banner, Google Analytics and
                the Meta Pixel are not placed on the page at all — they are not
                loaded and then silenced; they are not loaded.
              </>,
              'You can change your mind at any time; see section 6.',
            ],
            definitions: [
              {
                term: 'What',
                description:
                  'Pseudonymous identifiers stored in cookies, pages viewed, approximate location by country/region, interaction events',
              },
              {
                term: 'Why',
                description:
                  'To understand how the site is used and to measure the effectiveness of our advertising',
              },
              {
                term: 'Legal basis',
                description: (
                  <>
                    <strong>Your consent</strong> (GDPR Art. 6(1)(a)); consent is
                    also the basis for storing the cookies themselves
                  </>
                ),
              },
              {
                term: 'Retention',
                description: (
                  <>
                    As set out in the{' '}
                    <Link href="/cookies" className="underline underline-offset-4">
                      Cookie Policy
                    </Link>
                    , per cookie
                  </>
                ),
              },
            ],
          },
          {
            id: 'contact-enquiries',
            title: '2.3 When you contact us',
            paragraphs: [
              'If you email us, or write to us on LinkedIn, we process what you send: your name, your email address or LinkedIn profile, your company, and the content of your message.',
              'We do not use enquiry data for marketing unless you separately agree to it.',
            ],
            definitions: [
              {
                term: 'Why',
                description:
                  'To answer you and, where relevant, to discuss and deliver our services',
              },
              {
                term: 'Legal basis',
                description:
                  'Steps taken at your request prior to entering a contract (GDPR Art. 6(1)(b)), and our legitimate interest in responding to business enquiries (Art. 6(1)(f))',
              },
              {
                term: 'Retention',
                description:
                  'For the duration of the exchange and for two years after the last contact, unless a contract follows, in which case commercial and tax law retention periods apply',
              },
            ],
          },
          {
            id: 'data-sharing',
            title: '3. Who your data is shared with',
            paragraphs: [
              'We do not sell personal data. We share it only with the providers listed in the table below, who process it on our behalf, under contract, and only as needed to run the site.',
              'We may also disclose data where we are legally required to, for example to a public authority acting within its powers.',
            ],
            tables: [
              {
                columns: ['Provider', 'Role', 'Where'],
                rows: [
                  ['Vercel Inc.', 'Website hosting and delivery', 'EU / United States'],
                  [
                    'Cloudflare, Inc.',
                    'DNS and network protection',
                    'EU / United States',
                  ],
                  [
                    'Google Ireland Ltd.',
                    'Google Analytics — only with consent',
                    'EU / United States',
                  ],
                  [
                    'Meta Platforms Ireland Ltd.',
                    'Meta Pixel — only with consent',
                    'EU / United States',
                  ],
                ],
              },
            ],
          },
          {
            id: 'transfers',
            title: '4. Transfers outside the European Economic Area',
            paragraphs: [
              "Some of the providers above are US companies or use US infrastructure, so your data may be processed outside the EEA. Those transfers rely on the European Commission's adequacy decision for the EU–US Data Privacy Framework where the provider is certified under it, and otherwise on Standard Contractual Clauses approved by the Commission, together with additional safeguards where needed.",
              <>
                You may request a copy of the safeguards applied by writing to{' '}
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@lndeurope.tech
                </a>
                .
              </>,
            ],
          },
          {
            id: 'your-rights',
            title: '5. Your rights',
            paragraphs: [
              'Under the GDPR you have the rights listed below:',
              <>
                To exercise any of the rights listed below, write to{' '}
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@lndeurope.tech
                </a>
                . We will respond within one month, extendable by two further
                months for complex requests, and we will tell you if we need that
                extension. We may ask you to confirm your identity before acting.
              </>,
              <>
                If you believe your data has been handled improperly, you may
                complain to the Spanish Data Protection Agency (
                <strong>Agencia Española de Protección de Datos</strong>,{' '}
                <a
                  href="https://www.aepd.es"
                  className="text-foreground underline underline-offset-4"
                >
                  www.aepd.es
                </a>
                , C/ Jorge Juan 6, 28001 Madrid), or to the supervisory authority
                where you live.
              </>,
            ],
            items: [
              <>
                <strong>Access</strong> the personal data we hold about you
              </>,
              <>
                <strong>Rectify</strong> it if it is inaccurate or incomplete
              </>,
              <>
                <strong>Erase</strong>{' '}
                it (&quot;right to be forgotten&quot;) where the conditions
                apply
              </>,
              <>
                <strong>Restrict</strong> processing in certain circumstances
              </>,
              <>
                <strong>Object</strong> to processing based on legitimate interest
              </>,
              <>
                <strong>Portability</strong> — receive data you provided in a
                structured, machine-readable format
              </>,
              <>
                <strong>Withdraw consent</strong> at any time, without affecting
                processing that already took place on that basis
              </>,
            ],
          },
          {
            id: 'cookies-consent',
            title: '6. Cookies and consent',
            paragraphs: [
              <>
                The cookies this site uses, what each is for and how long it
                lasts, are listed in the{' '}
                <Link href="/cookies" className="underline underline-offset-4">
                  Cookie Policy
                </Link>
                .
              </>,
              'You can accept or decline non-essential cookies when you first visit, and change that decision at any time from the cookie settings link in the site footer. Declining does not limit your access to any part of the site.',
            ],
          },
          {
            id: 'security',
            title: '7. Security',
            paragraphs: [
              'We apply appropriate technical and organisational measures to protect personal data — encrypted connections (HTTPS), access control on our systems, and providers selected for their own security standards. No system is perfectly secure, and we cannot guarantee absolute security, but we treat breaches seriously and will notify you and the AEPD where the law requires it.',
            ],
          },
          {
            id: 'children',
            title: '8. Children',
            paragraphs: [
              'This site is aimed at businesses and is not directed at children. We do not knowingly process data of anyone under 14 (the age of digital consent in Spain).',
            ],
          },
          {
            id: 'changes',
            title: '9. Changes to this policy',
            paragraphs: [
              'We may update this policy when our processing or the law changes. The current version is always published here with its date at the top. Where a change materially affects your rights, we will make that clear rather than relying on a silent update.',
            ],
          },
          {
            id: 'contact',
            title: '10. Contact',
            paragraphs: [
              'Any question about this policy, or about how we handle your data:',
              <>
                <strong>LND Tech Europe S.L.</strong>
                <br />
                Gran Via del Marqués del Túria, 78, Planta 2, Puerta 4, 46005
                Valencia, Spain
                <br />
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  <strong>contact@lndeurope.tech</strong>
                </a>
              </>,
            ],
          },
        ]}
      />
    </main>
  );
}
