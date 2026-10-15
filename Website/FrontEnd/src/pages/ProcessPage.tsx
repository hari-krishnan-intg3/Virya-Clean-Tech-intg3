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
      duration: 'Initial discussion',
      what:
        'Share the business context, site location, project objective and any information already available. Explain current operations, the change being considered and who is involved in the decision. The team can then identify useful follow-up questions without treating the conversation as a technical approval.',
      surprise:
        'An initial conversation is not a technical approval or a commitment to a particular solution.',
      outputs: ['A shared understanding of the enquiry', 'Relevant follow-up questions', 'A suggested next step, if appropriate'],
    },
    {
      duration: 'Assessment scope',
      what:
        'If a detailed review is agreed, its scope may cover energy-use information, site conditions, operating patterns, existing infrastructure and relevant technical constraints. The agreed work should state what will be assessed, what information is missing and which conclusions remain provisional.',
      surprise:
        'The information available can affect both the depth of review and the conclusions that can reasonably be drawn.',
      outputs: [
        'Findings within the agreed assessment scope',
        'Assumptions, open questions and relevant constraints',
        'Potential options for further technical review',
      ],
    },
    {
      duration: 'Implementation, if agreed',
      what:
        'Design, procurement, approvals, installation and commissioning may follow where those services are available and explicitly included in the project agreement.',
      surprise:
        'Responsibilities, approvals, equipment, site access and programme timing need to be agreed before implementation begins.',
      outputs: [
        'Project-specific deliverables set out in the agreed scope',
        'Applicable approvals and test records, where included',
        'Handover arrangements defined for the project',
      ],
    },
    {
      duration: 'Follow-up, if in scope',
      what:
        'Monitoring, maintenance, reporting or other follow-up can be discussed as part of the project scope where those services are offered.',
      surprise:
        'Ongoing access, response arrangements, data ownership and support responsibilities should be clearly agreed.',
      outputs: [
        'Agreed monitoring or maintenance arrangements',
        'Reporting and access details, if applicable',
        'Defined support contacts and responsibilities',
      ],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="How we work"
        title={
          <>
            A clear path from enquiry to <span className="text-gradient">next steps.</span>
          </>
        }
        description="Project needs vary. This overview shows the questions to work through, while technical scope, deliverables, timing and responsibilities are confirmed for each engagement."
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
                          {extra.duration}
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
        title="Start with your requirement"
        body="Tell us what you are trying to understand or change. The next step depends on the site information available and the scope your project needs."
        secondary={{ label: 'Read the FAQ first', to: '/faq' }}
      />
    </>
  );
}