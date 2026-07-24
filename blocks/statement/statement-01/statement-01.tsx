'use client';

import { useRef } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { textScrub } from '@/lib/animations/presets';

export interface Statement01Props extends BlockBaseProps {
  eyebrow?: string;
  text?: string;
}

/** Default editable content — single source of truth for props and the Page
 *  Editor (BLOCK-SPEC §9). Keys match statement-01.edit.ts. */
export const defaults = {
  eyebrow: 'Why Vora Mar',
  text: 'We look after coast homes the way their owners would if they lived here all year. From Begur to Calella de Palafrugell, we keep pools clear, gardens alive and houses guest-ready — quietly, reliably, and without a single detail slipping while you are away.',
} as const;

/**
 * statement-01 — a large, centered manifesto paragraph whose words are "painted
 * in" as the section scrolls through the viewport (textScrub). It is a statement,
 * not a page heading, so it renders as a <p> inside an aria-labelled section.
 */
export function Statement01({
  eyebrow = defaults.eyebrow,
  text = defaults.text,
  animationLevel = 'subtle',
}: Statement01Props) {
  const scope = useRef<HTMLElement>(null);

  useBlockAnimation(animationLevel, scope, (level) => {
    // rich packs the words a touch more sequentially; both use the same preset.
    textScrub(scope.current?.querySelector('[data-statement]'), {
      stagger: level === 'rich' ? 0.6 : 0.35,
    });
  });

  return (
    <section ref={scope} aria-label={eyebrow ?? 'Statement'} className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:py-32">
        {eyebrow ? (
          <p className="text-muted mb-6 text-sm font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <p
          data-statement
          className="font-display text-foreground text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-5xl"
        >
          {text}
        </p>
      </div>
    </section>
  );
}
