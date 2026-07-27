'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './reduced-motion';

export interface TypewriterProps {
  /** The real string. Rendered on the server and read by AT. */
  text: string;
  trigger?: 'mount' | 'inView' | 'hover';
  /** Milliseconds per character. */
  speed?: number;
  /** Show a blinking caret while typing. Decorative. */
  caret?: boolean;
  className?: string;
}

/**
 * Typewriter — types the string out one character at a time.
 *
 * Same contracts as `ScrambleText`: the typing layer is `aria-hidden` with a
 * visually hidden copy of the full string for assistive tech, reduced motion
 * returns before any timer is created, the interval is cleared on unmount and
 * before each re-run, and the server renders the finished string so the element
 * is correct with no JS.
 *
 * The caret is `aria-hidden` decoration and disappears once typing completes.
 */
export function Typewriter({
  text,
  trigger = 'inView',
  speed = 45,
  caret = true,
  className,
}: TypewriterProps) {
  const [display, setDisplay] = useState(text);
  const [typing, setTyping] = useState(false);
  const hostRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTyping(false);
  }, []);

  const run = useCallback(() => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    stop();
    let index = 0;
    setDisplay('');
    setTyping(true);
    timerRef.current = window.setInterval(() => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) stop();
    }, speed);
  }, [text, speed, stop]);

  useEffect(() => {
    if (trigger === 'hover' || prefersReducedMotion()) return;

    if (trigger === 'mount' || typeof IntersectionObserver === 'undefined') {
      // Deferred a frame so the first paint shows the finished string (and so the
      // effect body never sets state synchronously).
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

  // `hover`: bind to the closest interactive ancestor rather than to this span,
  // so Tab reaches the effect and the whole control is the hover target — see
  // ScrambleText for the full reasoning. No listener is attached under reduced
  // motion.
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

  useEffect(() => stop, [stop]);

  // At rest this is ONE text node with the real string; the `sr-only` +
  // `aria-hidden` pair exists only while typing, so the string is never
  // duplicated in the document outside the run (see ScrambleText for the why).
  //
  // The zero-width space keeps a character box in the animating layer at all
  // times, so the line reserves its height from the very first tick even when
  // `display` is still empty. Without it `caret={false}` would collapse the line
  // to nothing for a tick and shift everything below — the height contract must
  // not depend on a decorative prop. A ZWSP (rather than `min-height`) keeps the
  // layer inline, so a long string still wraps naturally.
  return (
    <span ref={hostRef} className={className}>
      {typing ? (
        <>
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">
            {'​'}
            {display}
            {caret ? <span className="animate-caret">|</span> : null}
          </span>
        </>
      ) : (
        text
      )}
    </span>
  );
}
