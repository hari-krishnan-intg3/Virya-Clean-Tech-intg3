import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { InsightBand } from '@/components/sections/InsightBand';
import { Reveal } from '@/components/ui';
import { services } from '@/data/services';

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title={
          <>
            Explore solutions for your <span className="text-gradient">energy requirements.</span>
          </>
        }
        description="Explore Virya Cleantech's solar, EV charging, storage, connected-energy and assessment capabilities. Each project is different; site conditions, technical requirements and the agreed scope determine what is appropriate."
        primary={{ label: 'Discuss your project', to: '/request-consultation' }}
        secondary={{ label: 'How we work', to: '/process' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }]}
      />

      {/* Service cards */}
      <section className="section">
        <div className="shell">
          <div className="space-y-6">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} as="div">
                <article className="card card-hover group grid gap-8 p-7 sm:p-9 lg:grid-cols-12 lg:items-center lg:gap-12">
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-glow`}
                      >
                        <service.icon className="h-6 w-6" />
                      </span>
                    </div>

                    <h2 className="mt-6 text-2xl font-extrabold leading-tight text-ink transition-colors group-hover:text-emerald-700 sm:text-3xl">
                      <Link to={`/services/${service.slug}`}>{service.title}</Link>
                    </h2>

                    <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
                      {service.tagline}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-line bg-mist px-3 py-1 text-[0.75rem] font-medium text-ink-muted">
                        {service.scale}
                      </span>
                      <span className="rounded-full border border-line bg-mist px-3 py-1 text-[0.75rem] font-medium text-ink-muted">
                        {service.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <p className="text-[0.93rem] leading-relaxed text-ink-muted">
                      {service.cardSummary}
                    </p>

                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {service.capabilities.slice(0, 4).map((capability) => (
                        <li
                          key={capability}
                          className="flex items-start gap-2 text-[0.87rem] leading-relaxed text-ink-muted"
                        >
                          <span
                            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${service.gradient}`}
                          />
                          {capability}
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={`/services/${service.slug}`}
                      className="mt-7 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                    >
                      Explore {service.label.toLowerCase()}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InsightBand limit={3} />

      {/* How to choose */}
      <section className="section">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Choosing
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Where each of these starts
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {[
              {
                when: 'You want to understand energy use',
                then: 'Energy audit',
                because:
                  'Available bills, meter data and operating context can help frame a review of energy requirements. Operating hours and known changes can reveal what information is missing before options are compared.',
                to: '/services/consulting',
                cta: 'Start with an audit',
              },
              {
                when: 'You are exploring on-site generation or storage',
                then: 'Solar or storage design',
                because:
                  'Site area, structural conditions, energy use, electrical infrastructure and project objectives influence feasibility. Clarify ownership, roof or land access and any connection constraints before a system is sized.',
                to: '/services/solar',
                cta: 'Scope a system',
              },
              {
                when: 'Your site is planning for electric vehicles',
                then: 'EV infrastructure',
                because:
                  'Vehicle use, parking duration, charging demand and available electrical capacity help shape the discussion. Routes, dwell windows, site layout and charging operations also affect what should be assessed.',
                to: '/services/ev-charging',
                cta: 'Scope chargers',
              },
            ].map((item, index) => (
              <Reveal key={item.when} delay={index * 0.08} as="div">
                <article className="card card-hover flex h-full flex-col p-7">
                  <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-ink-faint">
                    {item.when}
                  </p>
                  <h3 className="mt-4 text-xl font-bold text-ink">{item.then}</h3>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-ink-muted">
                    {item.because}
                  </p>
                  <Link
                    to={item.to}
                    className="mt-6 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-emerald-700 hover:underline"
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Not sure where to begin?"
        body="Share your facility type, location and project question. The team can help identify which information may be useful and whether a more detailed assessment is appropriate."
        secondary={{ label: 'See how we work', to: '/process' }}
      />
    </>
  );
}