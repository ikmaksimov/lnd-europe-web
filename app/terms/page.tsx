import type { Metadata } from 'next';
import Link from 'next/link';
import { Legal01 } from '@/blocks/legal/legal-01/legal-01';

/**
 * Terms of Use. Content sourced verbatim from TASKS/legal/04-terms-of-use.md —
 * do not edit the wording here; it is pending review by the client's lawyer.
 *
 * No section here places a paragraph after a list/table/definitions block in
 * the source draft, so legal-01's fixed `paragraphs → items → definitions →
 * tables` render order never reorders anything on this page — audited per
 * TASK-legal-pages-followup.md §1, no wording changes were needed.
 *
 * `effectiveDate` is NOT the real publication date — see below.
 */
const PROVISIONAL_EFFECTIVE_DATE_NOT_FOR_LAUNCH = '2026-08-15';
// ^ Placeholder only. These pages still carry `[TO CONFIRM]` markers pending
// the client's gestoría (Registro Mercantil entry, DPO, retention periods,
// processor list) — they are not ready to publish. Set this to the actual
// publication date as the LAST step before deploy, not now.

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms governing your use of lndeurope.com, operated by LND Tech Europe S.L.',
  alternates: { canonical: '/terms' },
};

export default function TermsOfUsePage() {
  return (
    <main>
      <Legal01
        title="Terms of Use"
        effectiveDate={PROVISIONAL_EFFECTIVE_DATE_NOT_FOR_LAUNCH}
        intro={
          <>
            <p>
              These terms govern your use of lndeurope.com, operated by{' '}
              <strong>LND Tech Europe S.L.</strong> (CIF ESB24965386), Gran Via
              del Marqués del Túria, 78, Planta 2, Puerta 4, 46005 Valencia,
              Spain.
            </p>
            <p className="mt-4">
              By using this site you accept these terms. If you do not accept
              them, please do not use the site.
            </p>
          </>
        }
        sections={[
          {
            id: 'what-this-site-is',
            title: '1. What this site is',
            paragraphs: [
              'An informational website presenting our services in B2B market intelligence and demand generation. It does not offer products or services for sale online, does not host user accounts, and does not process payments.',
              'Nothing here is a binding offer. A commercial relationship arises only from a separate written agreement between you and LND Tech Europe S.L.',
            ],
          },
          {
            id: 'acceptable-use',
            title: '2. Acceptable use',
            paragraphs: [
              "You may view, read and share this site's content for lawful purposes. You may not:",
            ],
            items: [
              "Use it in a way that breaks the law or infringes anyone's rights",
              'Attempt to gain unauthorised access to the site, its servers or connected systems',
              'Interfere with its operation, including by introducing malicious code or by placing disproportionate load on it',
              'Extract content systematically — scraping, mining or bulk copying — for reuse without our written permission',
              'Present our content as your own, or use our name, logo or materials in a way that suggests an association that does not exist',
            ],
          },
          {
            id: 'intellectual-property',
            title: '3. Intellectual property',
            paragraphs: [
              'All content on this site — texts, graphics, diagrams, logos, page structure and source code — belongs to LND Tech Europe S.L. or is used under licence.',
              'You may quote short extracts with attribution and a link. Any other reproduction, distribution, public communication or transformation requires our prior written consent.',
              'Third-party trade marks appearing here belong to their owners.',
            ],
          },
          {
            id: 'accuracy-availability',
            title: '4. Accuracy and availability',
            paragraphs: [
              'We take reasonable care that the information published is accurate and current, but we do not warrant that it is complete, error-free, or suitable for any particular purpose. Content may change without notice.',
              'We aim to keep the site available but do not guarantee uninterrupted access. Availability may be affected by maintenance, by third-party providers, or by events outside our control.',
              <>
                <strong>Nothing on this site is professional advice.</strong>{' '}
                Descriptions of our methods and results are illustrative and do
                not guarantee any particular outcome for your business.
              </>,
            ],
          },
          {
            id: 'links-to-other-sites',
            title: '5. Links to other sites',
            paragraphs: [
              'We link to third-party sites — including LinkedIn — for convenience. We do not control them, are not responsible for their content or their privacy practices, and linking does not imply endorsement. Their terms apply when you visit them.',
            ],
          },
          {
            id: 'liability',
            title: '6. Liability',
            paragraphs: [
              'To the fullest extent permitted by law, LND Tech Europe S.L. is not liable for indirect or consequential loss, loss of profit, business or data arising from your use of, or inability to use, this site.',
              'Nothing in these terms excludes liability that cannot be excluded by law, including liability for fraud, or for death or personal injury caused by negligence. If you are a consumer, your statutory rights are unaffected.',
            ],
          },
          {
            id: 'privacy',
            title: '7. Privacy',
            paragraphs: [
              <>
                Your use of this site is also governed by our{' '}
                <Link href="/privacy" className="underline underline-offset-4">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/cookies" className="underline underline-offset-4">
                  Cookie Policy
                </Link>
                .
              </>,
            ],
          },
          {
            id: 'changes',
            title: '8. Changes',
            paragraphs: [
              'We may update these terms. The current version is always published here with its date at the top; continued use after a change means you accept the updated terms.',
            ],
          },
          {
            id: 'governing-law',
            title: '9. Governing law and jurisdiction',
            paragraphs: [
              'These terms are governed by Spanish law. Disputes are subject to the courts of Valencia, Spain, except where mandatory law provides otherwise — in particular where you are a consumer, in which case the courts of your domicile may apply.',
            ],
          },
          {
            id: 'contact',
            title: '10. Contact',
            paragraphs: [
              <>
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  <strong>contact@lndeurope.tech</strong>
                </a>
                <br />
                LND Tech Europe S.L., Gran Via del Marqués del Túria, 78, Planta
                2, Puerta 4, 46005 Valencia, Spain
              </>,
            ],
          },
        ]}
      />
    </main>
  );
}
