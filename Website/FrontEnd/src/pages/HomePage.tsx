import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Factory, HeartPulse, Truck, Warehouse } from 'lucide-react';
import { HeroSliderContainer } from '@/components/sections/HeroSliderContainer';
import { InsightBand } from '@/components/sections/InsightBand';
import { EnergyEcosystemContainer } from '@/components/sections/EnergyEcosystemContainer';
import { ProcessContainer } from '@/components/sections/ProcessContainer';
import { Reveal } from '@/components/ui';
import { services, industries } from '@/data/services';
import { whyWeStart } from '@/data/homeContent';

const SPOTLIGHT = [
  { slug: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { slug: 'warehousing', label: 'Warehousing', icon: Warehouse },
  { slug: 'fleet-logistics', label: 'Logistics fleets', icon: Truck },
  { slug: 'hospitals', label: 'Hospitals', icon: HeartPulse },
  { slug: 'real-estate', label: 'Real estate', icon: Building2 },
] as const;

export default function HomePage() {
  return (
    <>
      <HeroSliderContainer />

      {/* Positioning strip — the one-line answer to "who is this for" */}
      <section className="border-b border-line bg-white">
        <div className="shell py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  What we do
                </p>
                <h2 className="mt-5 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                  Energy systems designed around how your site actually
                  behaves.
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.08}>
                <p className="text-base leading-relaxed text-ink-muted">
                  Not a rate card applied to a square foot count. We read your
                  interval data, model it against your tariff, and size the
                  system to the load you really have — including the part where
                  most proposals quietly assume you have more grid headroom than
                  you do.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-3">
                  {whyWeStart.map((item) => (
                    <div key={item.title}>
                      <p className="text-[0.95rem] font-bold text-ink">{item.title}</p>
                      <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-muted">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">
                <span className="rule-accent" />
                Services
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl lg:text-[2.9rem]">
                Comprehensive energy solutions, <span className="text-gradient">in the right order</span>
              </h2>
            </div>

            <Link to="/services" className="btn-outline">
              All services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.06} as="div">
                <Link
                  to={`/services/${service.slug}`}
                  className="card card-hover group flex h-full flex-col p-7"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-glow`}
                    >
                      <service.icon className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[0.8rem] font-bold text-ink-faint">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold leading-snug text-ink transition-colors group-hover:text-emerald-700">
                    {service.title}
                  </h3>

                  <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-ink-muted">
                    {service.tagline}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full border border-line bg-mist px-3 py-1 text-[0.72rem] font-medium text-ink-muted">
                      {service.scale}
                    </span>
                    <span className="rounded-full border border-line bg-mist px-3 py-1 text-[0.72rem] font-medium text-ink-muted">
                      {service.timeline}
                    </span>
                  </div>

                  <span className="mt-6 inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-emerald-700">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}

            {/* Conversion tile closes the grid deliberately. */}
            <Reveal delay={0.3} as="div">
              <div className="flex h-full flex-col justify-between rounded-[1.6rem] bg-ink p-7 text-white">
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/45">
                    Not sure where to start?
                  </p>
                  <p className="mt-4 text-xl font-bold leading-snug">
                    Tell us what is driving this and we will tell you which two
                    services apply.
                  </p>
                </div>

                <Link
                  to="/request-consultation"
                  className="btn-primary-lg mt-8 w-full justify-center"
                >
                  Request a consultation
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <InsightBand />

      {/* Ecosystem */}
      <EnergyEcosystemContainer />

      {/* Industry spotlight */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">
                <span className="rule-accent" />
                Industries
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                Built for sites where downtime has a price
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                {industries.length} segments we work in repeatedly. Each one
                arrives with the same underlying pressure — load that peaks when
                it should not, and a tariff that charges for it.
              </p>
            </div>

            <Link to="/industries" className="btn-outline">
              All industries
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SPOTLIGHT.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.05} as="li">
                <Link
                  to={`/industries#${item.slug}`}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[0.98rem] font-bold text-ink transition-colors group-hover:text-emerald-700">
                    {item.label}
                  </p>
                  <p className="mt-2 text-[0.83rem] leading-relaxed text-ink-muted">
                    {industries.find((i) => i.slug === item.slug)?.signals[0]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProcessContainer />
    </>
  );
}