/**
 * FAQ content kept in a plain (non-'use client') module so it can be imported
 * by both the client block and by server components (e.g. to generate FAQPage
 * JSON-LD on the /demo page). Importing data from a 'use client' file into a
 * Server Component turns it into a client reference, not the actual value.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Which areas do you cover?',
    answer:
      'We look after villas along the central Costa Brava — Begur, Llafranc, Calella de Palafrugell and the surrounding coves. If you are just outside, get in touch and we will let you know honestly.',
  },
  {
    question: 'How do I know what was done while I was away?',
    answer:
      'After every visit you receive a short report with photos and any notes. Nothing happens on your property without you seeing it.',
  },
  {
    question: 'Is there a long contract?',
    answer:
      'No. Plans are monthly and you can change, pause or cancel as your season changes. Most owners stay simply because it works.',
  },
  {
    question: 'How do you handle keys and access?',
    answer:
      'Keys are held securely and access is logged for every visit. We can also coordinate smart locks or a key safe if you prefer.',
  },
  {
    question: 'Can you prepare the house for our guests?',
    answer:
      'Yes — on the Signature plan we welcome guests, change linen and make sure the home is spotless before every arrival.',
  },
];
