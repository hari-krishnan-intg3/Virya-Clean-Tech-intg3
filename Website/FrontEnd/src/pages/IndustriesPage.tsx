import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { getService, industries } from '@/data/services';
import { personas, qualificationSignals } from '@/data/qualification';

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we work with"
        title={
          <>
            We build for sites that <span className="text-gradient">cannot afford to be wrong</span> about energy.
          </>
        }
        description="Our ideal customer has real load, real operating hours and a real cost line — not a residential household or a hobby project. If your site falls into one of these segments, the first call will be useful."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'See all services', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Industries', to: '/industries' }]}
      />

      {/* Industry cards */}
      <section className="section">
        <div className="shell">
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((industry, index) => {
              const service = getService(industry.entryService);

              return (
                <Reveal key={industry.slug} delay={index * 0.05} as="div">
                  <article
                    id={industry.slug}
                    className="card card-hover h-full scroll-mt-28 p-7 sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                        <industry.icon className="h-5 w-5" />
                      </span>
                      <h2 className="text-xl font-bold leading-snug text-ink">{industry.label}</h2>
                    </div>

                    <p className="mt-5 text-[0.93rem] leading-relaxed text-ink-muted">
                      {industry.pressure}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2">
                      {industry.signals.map((signal) => (
                        <li
                          key={signal}
                          className="rounded-full border border-line bg-mist px-3 py-1 text-[0.75rem] font-medium text-ink-muted"
                        >
                          {signal}
                        </li>
                      ))}
                    </ul>

                    {service && (
                      <Link
                        to={`/services/${service.slug}`}
                        className="mt-7 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-emerald-700 hover:underline"
                      >
                        Usually starts with {service.label.toLowerCase()}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ICP */}
      <section className="section bg-mist">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  Fit
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  Whether this is worth your time
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink-muted">
                  You are a good fit if most of these are true. If none of them
                  are, we will say so on the first call and point you somewhere
                  better.
                </p>

                <ul className="mt-8 space-y-4">
                  {qualificationSignals.map((signal) => (
                    <li key={signal} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-[0.95rem] leading-relaxed text-ink-muted">{signal}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="lg:col-span-6">
              <Reveal delay={0.1}>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  Who you will be talking to
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  The roles that decide this
                </h2>

                <div className="mt-8 space-y-4">
                  {personas.map((persona) => (
                    <div key={persona.role} className="card p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-[1.05rem] font-bold text-ink">{persona.role}</h3>
                        <Link
                          to={`/services/${persona.goesTo}`}
                          className="text-[0.8rem] font-semibold text-emerald-700 hover:underline"
                        >
                          Typical starting point →
                        </Link>
                      </div>

                      <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-muted">
                        {persona.mandate}
                      </p>

                      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.85rem]">
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-ink-faint">Objection</dt>
                          <dd className="text-ink-muted">{persona.objection}</dd>
                        </div>
                        <div className="flex gap-2">
                          <dt className="shrink-0 font-semibold text-ink-faint">What works</dt>
                          <dd className="text-ink-muted">{persona.proof}</dd>
                        </div>
                      </dl>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Recognise your site on this page?"
        body="Send us your monthly consumption and a rough idea of the site. That is enough for us to tell you which of the five capabilities applies and what the first step looks like."
        secondary={{ label: 'How we work', to: '/process' }}
      />
    </>
  );
}