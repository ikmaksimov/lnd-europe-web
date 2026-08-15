'use client';

import { Cookies01 } from '@/blocks/cookies/cookies-01/cookies-01';

/**
 * Per TASK-legal-pages.md §4. "Essential" is required (always active, not
 * togglable); analytics and marketing are separate, optional purposes a
 * visitor accepts or declines independently.
 */
const CONSENT_CATEGORIES = [
  {
    id: 'essential',
    label: 'Essential',
    required: true,
    description: 'Needed to deliver the site and remember your choice. Always active.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Helps us understand how the site is used. Loaded only if you accept.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Measures our advertising. Loaded only if you accept.',
  },
] as const;

/**
 * Global consent banner, mounted from app/layout.tsx (a server component) —
 * cookies-01 needs callbacks, so this piece of the tree lives in its own
 * client boundary rather than making the whole layout client-side.
 *
 * No `onChange` is wired here on purpose: this site does not run Google
 * Analytics or the Meta Pixel yet (no measurement IDs, and the docs in
 * TASKS/legal/ describe a site where nothing non-essential loads before
 * consent), so there is nothing to gate a decision on. When a tag is added,
 * gate it exactly the way cookies-01's own docstring shows —
 * `{consent?.categories.analytics ? <AnalyticsTag /> : null}` — the tag
 * absent from the page until consent, never present-and-silenced.
 */
export function ConsentBanner() {
  return (
    <Cookies01
      categories={CONSENT_CATEGORIES}
      consentVersion="1"
      policy={{ label: 'Cookie Policy', href: '/cookies' }}
    />
  );
}
