'use client';

import { Navbar03, type Navbar03Props } from '@/blocks/navbar/navbar-03/navbar-03';
import { ScrambleText } from '@/lib/effects';

/**
 * navbar-03 with the scramble effect on its menu labels.
 *
 * `renderLabel` is a function, and functions do not cross the server/client
 * boundary, so the prop is applied here rather than in the server page. This
 * costs nothing: navbar-03 is a client component already, so the boundary was
 * always here — only the prop moved.
 *
 * The effect covers the labels that come from `items` (top-level entries, panel
 * triggers and the links inside a panel, desktop and mobile alike). The logo,
 * the CTA and the secondary link keep their plain strings on purpose.
 */
export function SiteNavbar(props: Navbar03Props) {
  return (
    <Navbar03
      {...props}
      renderLabel={(label) => <ScrambleText text={label} trigger="hover" />}
    />
  );
}
