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
            Five capabilities. <span className="text-gradient">Most sites need two.</span>
          </>
        }
        description="The order you do these in matters more than which ones you pick. An audit first routinely saves money on everything that follows it — and it is the only way to get a payback figure worth quoting to a board."
        primary={{ label: 'Start with an audit', to: '/services/consulting' }}
        secondary={{ label: 'Request a consultation', to: '/request-consultation' }}
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
                      <span className="font-mono text-[0.8rem] font-bold text-ink-faint">
                        {String(index + 1).padStart(2, '0')}
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
                      {service.summary.split(/(?<=\.)\s/)[0]}
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
                when: 'Your bill is rising and nobody can say why',
                then: 'Energy audit',
                because:
                  'Twelve months of interval data answers most of it before anything is bought.',
                to: '/services/consulting',
                cta: 'Start with an audit',
              },
              {
                when: 'You already know you need capacity',
                then: 'Solar or storage design',
                because:
                  'An audit can be short — we only need the load profile and the tariff, then we design.',
                to: '/services/solar',
                cta: 'Scope a system',
              },
              {
                when: 'The vehicles are arriving before the chargers',
                then: 'EV infrastructure',
                because:
                  'Load study first, then charger mix sized to your dwell time rather than fleet size.',
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
        title="Not sure which two you need?"
        body="Tell us what is driving this — a rising bill, a new site, a fleet to electrify — and we will tell you which two services apply, in which order, and roughly what the first step costs."
        secondary={{ label: 'See how we work', to: '/process' }}
      />
    </>
  );
}