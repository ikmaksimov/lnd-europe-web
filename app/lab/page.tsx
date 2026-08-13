import type { Metadata } from 'next';
import { EngineScene } from '@/components/scenes/engine-scene';
import { MarketScene } from '@/components/scenes/market-scene';
import { VerifyScene } from '@/components/scenes/verify-scene';
import { ReachScene } from '@/components/scenes/reach-scene';

/**
 * TEMPORARY preview page for scenes under review. Not linked from anywhere and
 * kept out of the index; delete it once these scenes move into real sections.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const CARDS = [
  {
    title: 'The market, mapped continuously',
    body: 'We map every company in your target market against your ICP — industry, size, projects and market signals — and keep that map moving as the market does.',
    Scene: MarketScene,
  },
  {
    title: 'Verified before it reaches you',
    body: 'Every account is checked and enriched before it counts as a lead, so your team spends its time on companies that are real, reachable and relevant now.',
    Scene: VerifyScene,
  },
  {
    title: 'Reached in the language they buy in',
    body: 'Multilingual campaigns across LinkedIn, Google and Meta reach the mapped accounts, and qualified conversations land in your CRM with the analytics behind them.',
    Scene: ReachScene,
  },
] as const;

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

      {/* The three card scenes for the #engine section's features-06 cards.
          features-06's own media frame is ~552×529–551px with object-fit: cover
          (measured live at 1280px) and a light frame background — reproduced
          here with bg-surface, since that token is literally rgb(250, 250, 249)
          in the light theme, the same value that was measured. The features-06
          slot only takes an <Image src>, not yet a component, so these are
          previewed standalone until the library opens `media?: ReactNode`. */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          The engine trio — card scenes
        </h2>
        <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed">
          Square, card-sized, same family as the scene above: same projection, same
          stroke weights, same token vocabulary. Each drives its own{' '}
          <code>--scene-progress</code> off its own position in the viewport — there
          is no scroll runway on a card.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CARDS.map(({ title, body, Scene }) => (
            <div key={title} className="bg-surface rounded-token overflow-hidden">
              {/* relative + aspect-square is the PREVIEW harness standing in for
                  features-06's real `data-f6-media` div (relative, grid-stretched
                  to ~529–551px tall at this width) — the scene itself just fills
                  it via absolute inset-0, same as the <Image fill> it replaces. */}
              <div className="relative mx-auto aspect-square w-full max-w-[552px]">
                <Scene />
              </div>
              <div className="p-5">
                <h3 className="text-foreground text-sm font-semibold">{title}</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* A second, shorter frame per card — object-fit: cover crops harder
            the further the container drifts from square. features-06 measured
            529–551px tall at a 552px width (a ~4% drift); this is deliberately
            more aggressive, to see the safe margin rather than assume it. */}
        <h3 className="text-foreground mt-16 text-sm font-semibold">
          Crop-safety stress test — 552×460 (not the measured ratio, a harder one)
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          {CARDS.map(({ title, Scene }) => (
            <div key={title} className="bg-surface rounded-token relative mx-auto h-[460px] w-full max-w-[552px] overflow-hidden">
              <Scene />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
