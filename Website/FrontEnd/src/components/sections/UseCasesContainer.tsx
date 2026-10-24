import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCases } from '@/data/homeContent';
import { Reveal, SmartImage } from '@/components/ui';

export function UseCasesContainer() {
  return (
    <section id="use-cases" aria-labelledby="use-cases-title" className="section bg-mist">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">
            <span className="rule-accent" />
            From operating challenge to measurable question
          </p>
          <h2
            id="use-cases-title"
            className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl lg:text-[2.9rem]"
          >
            Start with the <span className="text-gradient">problem your site needs to solve.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
            A useful energy plan connects an operating need to a site-specific review,
            an expected benefit and evidence the team can measure. Use these scenarios
            to frame the first conversation—not as a promise of project outcomes.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Reveal key={useCase.id} delay={index * 0.06} as="div">
              <article className="card h-full overflow-hidden">
                <div className="relative aspect-[16/7] overflow-hidden">
                  <SmartImage
                    src={useCase.image}
                    alt={useCase.imageAlt}
                    width={1200}
                    height={525}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#07110f]/75 via-transparent to-transparent"
                  />
                  <span className="absolute bottom-5 left-6 rounded-full border border-white/20 bg-[#07110f]/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200 backdrop-blur-sm">
                    {useCase.sector}
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-bold leading-snug text-ink sm:text-2xl">
                    {useCase.title}
                  </h3>

                  <dl className="mt-6 space-y-5">
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        The problem
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {useCase.problem}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        A practical approach
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {useCase.approach}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">
                        The intended benefit
                      </dt>
                      <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                        {useCase.benefit}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
                    <TrendingUp
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-ink-muted">
                      <span className="font-semibold text-ink">What to measure: </span>
                      {useCase.metric}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-5 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="max-w-3xl text-sm leading-relaxed text-ink-faint">
            These are illustrative use cases, not published Virya client case studies.
            Targets and benefits must be established from a site baseline, agreed scope,
            operating data and a documented measurement period.
          </p>
          <Link to="/request-consultation" className="btn-outline shrink-0">
            Discuss your site
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
