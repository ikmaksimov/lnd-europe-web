import type { Metadata } from 'next';
import { EngineScene } from '@/components/scenes/engine-scene';

/**
 * TEMPORARY preview page for scenes under review. Not linked from anywhere and
 * kept out of the index; delete it once engine-scene moves into a real section.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return (
    <main>
      <header className="mx-auto flex min-h-[60svh] max-w-3xl flex-col justify-center px-6 py-24">
        <p className="text-muted font-mono mb-6 text-[0.65rem] tracking-[0.14em] uppercase sm:text-xs">
          Scene lab — not indexed
        </p>
        <h1 className="font-display text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl">
          A living engine, not a static database.
        </h1>
        <p className="text-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
          The market below is undifferentiated. Verification draws the network that
          matters out of it, and prioritisation leaves the handful of accounts worth
          your quarter. Scroll to assemble the diagram.
        </p>
      </header>

      <EngineScene htmlId="engine-scene" />

      <section className="mx-auto max-w-3xl px-6 py-32">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Runway ends here.
        </h2>
        <p className="text-muted mt-4 text-base leading-relaxed">
          Everything above this point is the scene&rsquo;s scroll runway. This band exists
          so the section can be scrolled fully past and the frame loop can be watched
          shutting down as it leaves the viewport.
        </p>
      </section>
    </main>
  );
}
