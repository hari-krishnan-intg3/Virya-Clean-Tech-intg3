import { Compass, DraftingCompass, HardHat, LineChart } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { processSteps } from '@/data/process';

const ICONS = [Compass, DraftingCompass, HardHat, LineChart];

/**
 * Process page.
 *
 * The four published stages, rewritten with what actually happens inside each
 * one — including the parts clients are usually surprised by.
 */
export default function ProcessPage() {
  const detail = [
    {
      duration: 'Week 0–1',
      what:
        'A conversation about the problem, then a request for twelve months of half-hourly meter data and electricity bills. We sign an NDA before you send anything.',
      surprise:
        'If the data shows the project does not work, that is the end of the engagement, and it costs you nothing.',
      outputs: ['NDA', 'Data request', 'Preliminary feasibility view'],
    },
    {
      duration: 'Week 1–4',
      what:
        'Load analysis, site survey, shadow study and structural check where relevant. We model generation, storage or charger demand against your real interval data — not against a rule of thumb.',
      surprise:
        'Twelve months of data usually changes the answer. This is the stage where scope moves, and it moves in both directions.',
      outputs: [
        'Feasibility report with modelled payback and sensitivity',
        'Concept design',
        'Indicative BOQ and vendor comparison',
      ],
    },
    {
      duration: 'Week 4–16',
      what:
        'Detailed design, procurement, civil and electrical installation, commissioning. DISCOM applications and net-metering are started during design, not after installation.',
      surprise:
        'Grid approval is the single most common cause of slippage. We start it early precisely because it is outside our control.',
      outputs: [
        'As-built drawings and test certificates',
        'Grid interconnection approval',
        'Monitoring handover and training',
      ],
    },
    {
      duration: 'Ongoing',
      what:
        'Preventive maintenance on an agreed schedule, remote monitoring with alerting configured for your plant, and performance review against the model we signed.',
      surprise:
        'Monitoring is handed over, not rented back to you. You keep the data and the alerting whether or not you engage us again.',
      outputs: [
        'Performance report against model',
        'Maintenance schedule and spares list',
        'Exportable energy and emissions reporting',
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="How we work"
        title={
          <>
            Four stages. <span className="text-gradient">Nothing hidden in between.</span>
          </>
        }
        description="This is the published Virya process with the parts filled in — what happens in each stage, what you get at the end of it, and the thing clients are most often surprised by."
        primary={{ label: 'Start at stage one', to: '/request-consultation' }}
        secondary={{ label: 'See the services', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Approach', to: '/process' }]}
      />

      {/* Stages */}
      <section className="section">
        <div className="shell">
          <div className="relative">
            {/* Spine */}
            <div
              className="absolute left-[1.4rem] top-2 hidden h-[calc(100%-4rem)] w-px bg-line lg:left-1/2 lg:block"
              aria-hidden="true"
            />

            <div className="space-y-16 lg:space-y-24">
              {processSteps.map((step, index) => {
                const Icon = ICONS[index] ?? Compass;
                const extra = detail[index];
                const onLeft = index % 2 === 0;

                return (
                  <Reveal key={step.number} delay={0.05} as="div">
                    <div
                      className={`relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16 ${
                        onLeft ? '' : 'lg:[&>*:first-child]:order-2'
                      }`}
                    >
                      {/* Stage */}
                      <div className="lg:px-10">
                        <div className="flex items-center gap-4">
                          <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500 text-white shadow-glow">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="font-mono text-[0.85rem] font-bold text-ink-faint">
                            {step.number}
                          </span>
                        </div>

                        <h2 className="mt-6 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                          {step.title}
                        </h2>
                        <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
                          {step.description}
                        </p>
                      </div>

                      {/* Detail */}
                      <div className="card p-7">
                        <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-emerald-600">
                          Typical window · {extra.duration}
                        </p>

                        <p className="mt-4 text-[0.93rem] leading-relaxed text-ink-muted">
                          {extra.what}
                        </p>

                        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-amber-700">
                            Worth knowing
                          </p>
                          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-amber-900/85">
                            {extra.surprise}
                          </p>
                        </div>

                        <p className="mt-6 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-ink-faint">
                          You receive
                        </p>
                        <ul className="mt-3 space-y-2">
                          {extra.outputs.map((output) => (
                            <li key={output} className="flex gap-2.5 text-[0.88rem] text-ink-muted">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                              {output}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Stage one costs nothing and is the one that matters"
        body="A conversation and a data request. If the numbers do not work, that is a useful answer and we will tell you so rather than selling a system you do not need."
        secondary={{ label: 'Read the FAQ first', to: '/faq' }}
      />
    </>
  );
}