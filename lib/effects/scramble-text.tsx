'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './reduced-motion';

const GLYPHS = '!<>-_\\/[]{}=+*^?#';

export interface ScrambleTextProps {
  /** The real string. This is what renders on the server and what AT reads. */
  text: string;
  /** What starts the run. `inView` suits a landing page; `hover` re-runs. */
  trigger?: 'mount' | 'inView' | 'hover';
  /** Milliseconds between frames. */
  speed?: number;
  /** Frames each character scrambles before it settles. */
  framesPerChar?: number;
  className?: string;
}

/** One frame: the first `revealed` characters are final, the rest are noise. */
function frameFor(text: string, revealed: number): string {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    // Whitespace is never scrambled — it keeps the word shape (and the line
    // length) stable while the rest decodes.
    if (i < revealed || char === ' ') out += char;
    else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }
  return out;
}

/**
 * ScrambleText — decodes left-to-right out of random glyphs into the real
 * string.
 *
 * The three contracts that matter (docs/EFFECTS.md):
 *  - **Accessibility.** The animating glyphs are `aria-hidden`; a visually
 *    hidden copy of the real string is what assistive tech reads, from the first
 *    paint to the last. AT never sees `!<>-_/[]`.
 *  - **Reduced motion.** The guard runs before any timer exists, so nothing is
 *    scheduled at all and the final text simply stands.
 *  - **Cleanup.** The interval id lives in a ref and is cleared on unmount and
 *    before every re-run, so a hover-retriggered or unmounted component can
 *    never leave a timer calling `setState`.
 *
 * Progressive enhancement: `useState(text)` means the server renders the final
 * string, so with JS disabled the element is simply correct.
 */
export function ScrambleText({
  text,
  trigger = 'inView',
  speed = 30,
  framesPerChar = 3,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(text);
  const [running, setRunning] = useState(false);
  const hostRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRunning(false);
  }, []);

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    stop();
    setRunning(true);
    let frame = 0;
    timerRef.current = window.setInterval(() => {
      const revealed = Math.floor(frame / Math.max(1, framesPerChar));
      if (revealed >= text.length) {
        setDisplay(text);
        stop();
        return;
      }
      setDisplay(frameFor(text, revealed));
      frame += 1;
    }, speed);
  }, [text, speed, framesPerChar, stop]);

  // `mount` / `inView`: nothing is created under reduced motion — no interval
  // and no observer.
  useEffect(() => {
    if (trigger === 'hover' || prefersReducedMotion()) return;

    if (trigger === 'mount' || typeof IntersectionObserver === 'undefined') {
      // Deferred a frame so the first paint shows the finished string before it
      // scrambles (and so the effect body never sets state synchronously).
      const frame = requestAnimationFrame(run);
      return () => {
        cancelAnimationFrame(frame);
        stop();
      };
    }

    const el = hostRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [trigger, run, stop]);

  // `hover`: bind to the closest INTERACTIVE ANCESTOR, not to this span.
  //
  // The typical composition is `<button><ScrambleText trigger="hover" /></button>`,
  // and handlers on the inner span are wrong for it twice over: `focus` fires on
  // the button and propagates upward, never down into its children, so Tab never
  // reaches the effect; and the span is smaller than its padded control, leaving a
  // dead border where the pointer is over the button but not over the glyphs.
  // Resolving the ancestor fixes the keyboard path and the hit area together.
  //
  // Under reduced motion no listener is attached at all — the guard runs first.
  useEffect(() => {
    if (trigger !== 'hover' || prefersReducedMotion()) return;
    const host = hostRef.current;
    if (!host) return;

    // `a[href]` (a bare anchor is not focusable) and `:not([tabindex="-1"])`
    // (a `-1` target is programmatic-focus only — typically `<main tabindex="-1">`
    // for a skip link, which would otherwise capture the whole page body).
    const target: Element =
      host.closest('a[href], button, [tabindex]:not([tabindex="-1"])') ?? host;
    const start = () => run();
    target.addEventListener('pointerenter', start);
    target.addEventListener('focus', start);
    return () => {
      target.removeEventListener('pointerenter', start);
      target.removeEventListener('focus', start);
      stop();
    };
  }, [trigger, run, stop]);

  // Unmount safety for hover runs, which start outside the effects above.
  useEffect(() => stop, [stop]);

  // At rest — the server render, the no-JS case, reduced motion, and every moment
  // after the run finishes — this is ONE text node holding the real string. The
  // `sr-only` + `aria-hidden` pair exists only while a run is actually in flight,
  // so the string is never duplicated in the document (or in a crawler's view of
  // it) outside that ~1s window, where the visible layer is noise anyway.
  return (
    <span ref={hostRef} className={className}>
      {running ? (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">{display}</span>
        </>
      ) : (
        text
      )}
    </span>
  );
}
