import type { Metadata } from 'next';
import Link from 'next/link';
import { Legal01 } from '@/blocks/legal/legal-01/legal-01';

/**
 * Cookie Policy. Content sourced from TASKS/legal/03-cookie-policy.md — do not
 * edit the wording here beyond what is documented below; it is pending review
 * by the client's lawyer. Where the draft carries a `[TO CONFIRM — …]` marker,
 * it is reproduced as-is below.
 *
 * DELIBERATELY INCOMPLETE relative to the draft, per TASK-legal-pages.md §4:
 * this site does not run Google Analytics or the Meta Pixel yet (no consent
 * gate would otherwise exist to gate them, and there are no measurement IDs).
 * The draft's "### Analytics" and "### Marketing" cookie-inventory tables
 * describe cookies that do not exist on this site today, so both are held back
 * here, along with the Google/Meta halves of "## Transfers outside the EEA"
 * and the "Opting out at the source" bullets under "Managing your choice"
 * (Google/Meta opt-out links). Only "Strictly necessary" is published. These
 * go back in together with the tags themselves, in the same future change —
 * see TASKS/legal/00-README-first.md.
 *
 * Per TASK-legal-pages-followup.md §2: Cloudflare is the one exception. It
 * stays in the Strictly necessary table, is a real US company, and its data
 * genuinely leaves the EEA today — so a `transfers` section covering
 * Cloudflare only (no Google/Meta) is published below, linking to
 * `/privacy#transfers`.
 *
 * Wording fix (TASK-legal-pages-followup.md §1 — reworded only to restore a
 * self-contained reference, nothing else touched): "Our approach"'s intro
 * "We use two categories, and they are treated differently:" used to be
 * followed immediately by the two-item list; the fixed `paragraphs → items`
 * slot order now inserts another paragraph between the colon and the list, so
 * it was reworded to "…and they are treated differently, as set out below:".
 *
 * `effectiveDate` is NOT the real publication date — see below.
 */
const PROVISIONAL_EFFECTIVE_DATE_NOT_FOR_LAUNCH = '2026-08-15';
// ^ Placeholder only. These pages still carry `[TO CONFIRM]` markers pending
// the client's gestoría (Registro Mercantil entry, DPO, retention periods,
// processor list) — they are not ready to publish. Set this to the actual
// publication date as the LAST step before deploy, not now.

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'What cookies lndeurope.com uses and how to control them. Currently strictly-necessary cookies only.',
  alternates: { canonical: '/cookies' },
};

export default function CookiePolicyPage() {
  return (
    <main>
      <Legal01
        title="Cookie Policy"
        effectiveDate={PROVISIONAL_EFFECTIVE_DATE_NOT_FOR_LAUNCH}
        intro={
          <>
            This policy explains what cookies lndeurope.com uses, what each one
            does, and how you control them. It complements our{' '}
            <Link href="/privacy" className="underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </>
        }
        sections={[
          {
            id: 'what-cookies-are',
            title: 'What cookies are',
            paragraphs: [
              'Cookies are small files a website stores on your device. Some are needed for the site to work; others help the owner understand how the site is used or measure advertising. Similar technologies — local storage, pixels, tracking scripts — do comparable things, and everything in this policy applies to them too.',
            ],
          },
          {
            id: 'our-approach',
            title: 'Our approach',
            paragraphs: [
              'We use two categories, and they are treated differently, as set out below:',
              'Declining costs you nothing: every part of this site works identically either way.',
            ],
            items: [
              <>
                <strong>Strictly necessary</strong> — required to deliver the
                site and remember your own cookie choice. These do not need your
                consent, and cannot be switched off, because without them the
                site does not function.
              </>,
              <>
                <strong>Analytics and marketing</strong> — everything else.{' '}
                <strong>
                  These do not load until you accept them.
                </strong>{' '}
                If you decline or ignore the banner, the scripts are never added
                to the page.
              </>,
            ],
          },
          {
            id: 'strictly-necessary',
            title: 'Cookies used — strictly necessary',
            tables: [
              {
                caption: 'Strictly necessary',
                columns: ['Name', 'Provider', 'Purpose', 'Duration'],
                rows: [
                  [
                    'trencadis:consent',
                    'LND Tech Europe (this site)',
                    'Stores your cookie choice so you are not asked on every visit',
                    '[TO CONFIRM — 6 or 12 months]',
                  ],
                  [
                    'Cloudflare security cookies',
                    'Cloudflare, Inc.',
                    'Distinguishes legitimate visitors from automated traffic; protects against attacks',
                    'Session to 30 days',
                  ],
                ],
              },
            ],
          },
          {
            id: 'transfers',
            title: 'Transfers outside the EEA',
            paragraphs: [
              <>
                Cookies in the Strictly necessary table may be processed
                outside the EEA by Cloudflare, under the safeguards described
                in{' '}
                <Link
                  href="/privacy#transfers"
                  className="underline underline-offset-4"
                >
                  section 4 of the Privacy Policy
                </Link>
                .
              </>,
            ],
          },
          {
            id: 'managing-your-choice',
            title: 'Managing your choice',
            paragraphs: [
              <>
                <strong>On this site:</strong> the banner on your first visit
                lets you accept or decline. You can change the decision at any
                time using the cookie settings link in the footer. Withdrawing
                consent stops future loading of those scripts; cookies already
                set can be cleared in your browser.
              </>,
              <>
                <strong>In your browser:</strong> every major browser lets you
                block or delete cookies — usually under Settings → Privacy.
                Blocking strictly necessary cookies may stop parts of the site
                from working.
              </>,
            ],
          },
          {
            id: 'contact',
            title: 'Contact',
            paragraphs: [
              <>
                <strong>LND Tech Europe S.L.</strong> —{' '}
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@lndeurope.tech
                </a>
                <br />
                Gran Via del Marqués del Túria, 78, Planta 2, Puerta 4, 46005
                Valencia, Spain
              </>,
            ],
          },
        ]}
      />
    </main>
  );
}
