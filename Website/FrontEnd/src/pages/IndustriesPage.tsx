import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal } from '@/components/ui';
import { getService, industries } from '@/data/services';
import { personas, qualificationSignals } from '@/data/qualification';
import { SmartImage } from '@/components/ui';

const INDUSTRY_VISUALS: Record<string, { src: string; alt: string }> = {
  manufacturing: {
    src: '/images/virya-engineering.webp',
    alt: 'Engineer reviewing equipment in an industrial test facility.',
  },
  warehousing: {
    src: '/images/virya-solar.webp',
    alt: 'Rows of solar panels viewed across an open energy site.',
  },
  'fleet-logistics': {
    src: '/images/virya-ev-charging.webp',
    alt: 'Electric vehicle connected to charging infrastructure.',
  },
  'real-estate': {
    src: '/images/virya-solar.webp',
    alt: 'Solar panels generating electricity at a commercial site.',
  },
  hospitals: {
    src: '/images/virya-energy.webp',
    alt: 'Industrial battery units being checked by a technician.',
  },
  hotels: {
    src: '/images/virya-ev-charging.webp',
    alt: 'Electric vehicle charging beside a facility.',
  },
  retail: {
    src: '/images/virya-solar.webp',
    alt: 'Solar generation panels at a commercial location.',
  },
  education: {
    src: '/images/virya-wind.webp',
    alt: 'Wind turbines supplying renewable electricity across a landscape.',
  },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Who we work with"
        title={
          <>
            Energy considerations for <span className="text-gradient">different operating environments.</span>
          </>
        }
        description="Facilities have different energy profiles, operating patterns, physical constraints and investment priorities. Use these audience groups to explore relevant questions; project suitability depends on the site and the services confirmed for it."
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
                    className="card card-hover h-full scroll-mt-28 overflow-hidden"
                  >
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <SmartImage
                        src={INDUSTRY_VISUALS[industry.slug].src}
                        alt={INDUSTRY_VISUALS[industry.slug].alt}
                        width={1200}
                        height={525}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#07110f]/75 to-transparent" />
                      <h2 className="absolute bottom-5 left-6 right-6 flex items-center gap-3 text-xl font-bold leading-snug text-white sm:left-7 sm:text-2xl">
                        <industry.icon className="h-5 w-5 shrink-0 text-emerald-300" aria-hidden="true" />
                        {industry.label}
                      </h2>
                    </div>

                    <div className="p-6 sm:p-7">
                      <p className="text-[0.93rem] leading-relaxed text-ink-muted">
                        {industry.pressure}
                      </p>

                      <p className="mt-3 line-clamp-4 text-[0.9rem] leading-relaxed text-ink-muted">
                        {industry.cardSummary}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2">
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
                          className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-[0.92rem] font-semibold text-emerald-300 hover:underline"
                        >
                          Explore {service.label.toLowerCase()}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
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
                  Questions to consider for your site
                </h2>
                <p className="mt-5 text-base leading-relaxed text-ink-muted">
                  These are useful starting points for a project discussion,
                  not eligibility rules or a technical recommendation.
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
                  Roles commonly involved in decisions
                </p>
                <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                  Different priorities, one project discussion
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
        title="Recognise your operating environment?"
        body="Share your facility type, location and project objective. The team can help identify which information may be useful for an initial review."
        secondary={{ label: 'How we work', to: '/process' }}
      />
    </>
  );
}