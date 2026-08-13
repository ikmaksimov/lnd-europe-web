'use client';

import { useId, useRef, type CSSProperties } from 'react';
import type { BlockBaseProps } from '@/lib/animations/types';
import { useBlockAnimation } from '@/lib/animations/use-block-animation';
import { classOnScroll, progressVar } from '@/lib/animations/presets';

export interface Statement06Props extends BlockBaseProps {
  eyebrow?: string;
  text?: string;
  /** Flip from the active light scope to theme-dark halfway through the scene. */
  flipTheme?: boolean;
  /** Root for this instance's DOM ids (BLOCK-SPEC §10). */
  htmlId?: string;
}

/** Default editable content — single source of truth for scalar props and the
 * Page Editor (BLOCK-SPEC §9). Keys match statement-06.edit.ts. */
export const defaults = {
  eyebrow: 'A considered return',
  text: 'Every return should feel considered because the details that carry a home forward are already in hand from the first light in the garden to the quiet confidence of coming home.',
  flipTheme: true,
} as const;

/**
 * statement-06 — a two-viewport CSS-derived reading wave, adapted from the LND
 * client project contribution. Motion writes only `--play`; indexed words derive
 * their complete states in CSS. The static CSS default is finished, so no-JS,
 * reduced motion and animationLevel="none" stay legible.
 */
export function Statement06({
  eyebrow = defaults.eyebrow,
  text = defaults.text,
  flipTheme = defaults.flipTheme,
  htmlId,
  animationLevel = 'rich',
}: Statement06Props) {
  const scope = useRef<HTMLElement>(null);
  const autoId = useId();
  const eyebrowId = `${htmlId ?? autoId}-eyebrow`;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  const staticDarkTheme = animationLevel === 'none' && flipTheme;

  useBlockAnimation(animationLevel, scope, () => {
    const scene = scope.current;
    if (!scene) return;

    progressVar(scene, { start: 'top top', end: 'bottom bottom' });
    if (flipTheme) {
      classOnScroll(scene, {
        className: 'theme-dark',
        trigger: scene,
        start: 'center center',
        reducedMotion: 'final',
      });
    }
  });

  return (
    <section
      ref={scope}
      aria-label={eyebrow ? undefined : 'Statement'}
      aria-labelledby={eyebrow ? eyebrowId : undefined}
      data-statement-06-scene
      className={[
        'statement-wave bg-background text-foreground min-h-[200svh] transition-[background-color,color] duration-300',
        staticDarkTheme ? 'theme-dark' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="sticky top-0 flex min-h-svh items-center">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:py-24">
          {eyebrow ? (
            <p
              id={eyebrowId}
              className="text-muted mb-6 text-sm font-medium tracking-wide uppercase"
            >
              {eyebrow}
            </p>
          ) : null}
          <p className="font-display text-3xl leading-tight font-medium tracking-tight sm:text-4xl lg:text-6xl">
            {words.map((word, index) => {
              const start = totalWords > 1 ? (index / (totalWords - 1)) * 0.9 : 0;
              return (
                <span
                  key={`${word}-${index}`}
                  className="statement-wave-word"
                  style={{ '--i': index, '--start': start } as CSSProperties}
                >
                  {word}
                  {index < words.length - 1 ? ' ' : null}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
