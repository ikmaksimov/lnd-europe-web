import type { Metadata } from 'next';
import Link from 'next/link';
import { Legal01 } from '@/blocks/legal/legal-01/legal-01';
import { siteConfig } from '@/site.config';

/**
 * Aviso Legal — legally required in Spain under LSSI-CE (Ley 34/2002) Art. 10.
 * Content sourced verbatim from TASKS/legal/01-legal-notice.md — do not edit
 * the wording here; it is pending review by the client's lawyer.
 *
 * The Commercial Registry item is omitted outright (see the comment at that
 * item below) rather than resolved with a marker — per
 * TASK-legal-pages-resolve-markers.md §1, that data is not available until
 * the client's escritura arrives.
 *
 * No section here places a paragraph after a list/table/definitions block in
 * the source draft, so legal-01's fixed `paragraphs → items → definitions →
 * tables` render order never reorders anything on this page — audited per
 * TASK-legal-pages-followup.md §1, no wording changes were needed.
 */
const EFFECTIVE_DATE = '2026-08-17';

export const metadata: Metadata = {
  title: 'Legal Notice',
  description:
    "Aviso Legal for lndeurope.com — LND Tech Europe S.L.'s legally required site-owner identification under Spanish LSSI-CE Art. 10.",
  alternates: { canonical: '/legal-notice' },
};

export default function LegalNoticePage() {
  return (
    <main>
      <Legal01
        title="Legal Notice"
        effectiveDate={EFFECTIVE_DATE}
        intro="Aviso Legal — required under Article 10 of Spanish Law 34/2002 (LSSI-CE)."
        sections={[
          {
            id: 'site-owner',
            title: 'Site owner',
            paragraphs: [
              `This website, ${new URL(siteConfig.url).host}, is owned and operated by:`,
              <strong key="owner">LND Tech Europe S.L.</strong>,
            ],
            items: [
              <>
                Tax identification number (CIF): <strong>ESB24965386</strong>
              </>,
              'Registered office: Gran Via del Marqués del Túria, 78, Planta 2, Puerta 4, 46005 Valencia, Spain',
              <>
                Email:{' '}
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@lndeurope.tech
                </a>
              </>,
              // Commercial Registry (Registro Mercantil de Valencia — volume,
              // folio, sheet, entry) is intentionally omitted, not forgotten:
              // it is pending the client's escritura. Add it as a one-line
              // item here the moment that data arrives.
            ],
          },
          {
            id: 'purpose',
            title: 'Purpose of this website',
            paragraphs: [
              "This site presents LND Tech Europe's services in B2B market intelligence and demand generation across Europe. It is informational: it does not sell products or services online, does not host user accounts, and does not process payments.",
              "Enquiries are made by email or through the company's LinkedIn page. The site does not operate a contact form.",
            ],
          },
          {
            id: 'terms-of-access',
            title: 'Terms of access',
            paragraphs: [
              <>
                Access to this site is free and does not require registration. By
                accessing it you accept this Legal Notice, the{' '}
                <Link href="/privacy" className="underline underline-offset-4">
                  Privacy Policy
                </Link>
                , the{' '}
                <Link href="/cookies" className="underline underline-offset-4">
                  Cookie Policy
                </Link>{' '}
                and the{' '}
                <Link href="/terms" className="underline underline-offset-4">
                  Terms of Use
                </Link>
                .
              </>,
            ],
          },
          {
            id: 'intellectual-property',
            title: 'Intellectual property',
            paragraphs: [
              'The content of this site — texts, graphics, diagrams, logos, page structure and source code — belongs to LND Tech Europe S.L. or is used under licence, and is protected by Spanish and international intellectual property law.',
              'Reproduction, distribution, public communication or transformation of this content without prior written authorisation is not permitted, except where allowed by law. Quoting with attribution and linking to the site are permitted.',
              'Third-party trade marks appearing on this site belong to their respective owners; their appearance does not imply any association or endorsement.',
            ],
          },
          {
            id: 'liability',
            title: 'Liability',
            paragraphs: [
              'LND Tech Europe S.L. takes reasonable care that the information published here is accurate and current, but makes no warranty that it is complete or free of error, and it may be changed without notice.',
              'The company is not liable for damage arising from the use of this site or from the information it contains, nor for the availability or content of third-party sites reached through links published here. Such links are provided for convenience and do not imply endorsement.',
            ],
          },
          {
            id: 'applicable-law',
            title: 'Applicable law and jurisdiction',
            paragraphs: [
              "This Legal Notice is governed by Spanish law. Any dispute arising from access to or use of this website is subject to the courts of Valencia, Spain, save where mandatory law provides otherwise — in particular where the user is a consumer, in which case the courts of the user's domicile may apply.",
            ],
          },
          {
            id: 'contact',
            title: 'Contact',
            paragraphs: [
              <>
                Questions about this Legal Notice:{' '}
                <a
                  href="mailto:contact@lndeurope.tech"
                  className="text-foreground underline underline-offset-4"
                >
                  contact@lndeurope.tech
                </a>
              </>,
            ],
          },
        ]}
      />
    </main>
  );
}
