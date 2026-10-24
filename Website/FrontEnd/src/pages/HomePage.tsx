import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Factory, HeartPulse, Truck, Warehouse } from 'lucide-react';
import { HeroSliderContainer } from '@/components/sections/HeroSliderContainer';
import { InsightBand } from '@/components/sections/InsightBand';
import { EnergyEcosystemContainer } from '@/components/sections/EnergyEcosystemContainer';
import { ProcessContainer } from '@/components/sections/ProcessContainer';
import { UseCasesContainer } from '@/components/sections/UseCasesContainer';
import { CtaBand } from '@/components/sections/PageHero';
import { CardImage, Reveal, ServiceCard } from '@/components/ui';
import { services, industries } from '@/data/services';
import { whyWeStart } from '@/data/homeContent';
import { visualAssets } from '@/data/visuals';

const SPOTLIGHT = [
  { slug: 'manufacturing', label: 'Manufacturing', icon: Factory },
  { slug: 'warehousing', label: 'Warehousing', icon: Warehouse },
  { slug: 'fleet-logistics', label: 'Logistics fleets', icon: Truck },
  { slug: 'hospitals', label: 'Hospitals', icon: HeartPulse },
  { slug: 'real-estate', label: 'Real estate', icon: Building2 },
] as const;

const DECISION_METRICS = [
  {
    value: '01',
    label: 'Baseline first',
    detail: 'Start with interval data, operating hours and site constraints before forecasting an outcome.',
  },
  {
    value: '03',
    label: 'Questions answered',
    detail: 'Connect each recommendation to a problem, an intended benefit and a defined measurement period.',
  },
  {
    value: '100%',
    label: 'Scope visible',
    detail: 'Make dependencies, preconditions, approvals and responsibilities explicit before work begins.',
  },
] as const;

export default function HomePage() {
  return (
    <>
      <HeroSliderContainer />

      {/* Positioning strip — the one-line answer to "who is this for" */}
      <section className="border-b border-line bg-white">
        <div className="shell py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <p className="eyebrow">
                  <span className="rule-accent" />
                  What we do
                </p>
                <h2 className="mt-5 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                  Clear energy decisions start with your site.
                </h2>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={0.08}>
                <p className="text-base leading-relaxed text-ink-muted">
                  Assess solar, EV charging, storage and connected-energy options against
                  real operations, existing infrastructure and project goals.
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

      {/* Metrics strip — makes the decision framework tangible without making unsupported savings claims. */}
      <section className="border-b border-line bg-mist" aria-labelledby="metrics-title">
        <div className="shell py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr] lg:items-center lg:gap-14">
            <Reveal>
              <p className="eyebrow">
                <span className="rule-accent" />
                How we make progress visible
              </p>
              <h2 id="metrics-title" className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
                Better decisions need better measures.
              </h2>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-3">
              {DECISION_METRICS.map((metric, index) => (
                <Reveal key={metric.label} delay={index * 0.06}>
                  <div className="border-l-2 border-emerald-400/60 pl-4">
                    <p className="font-heading text-2xl font-extrabold text-emerald-300">{metric.value}</p>
                    <p className="mt-1 text-sm font-bold text-ink">{metric.label}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{metric.detail}</p>
                  </div>
                </Reveal>
              ))}
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
                Offerings
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
                <ServiceCard service={service} />
              </Reveal>
            ))}

            {/* Conversion tile closes the grid deliberately. */}
            <Reveal delay={0.3} as="div">
              <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-ink p-7 text-white">
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-white/45">
                    Not sure where to start?
                  </p>
                  <p className="mt-4 text-xl font-bold leading-snug">
                    Share your facility and project objective to identify what
                    information may be useful to explore next.
                  </p>
                </div>

                <Link
                  to="/request-consultation"
                  className="btn-primary-lg mt-8 w-full justify-center"
                >
                  Discuss Your Project
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <UseCasesContainer />

      <section id="about" className="section bg-ink">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.16em] text-emerald-300">
                About Virya Cleantech
              </p>
              <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl">
                Practical energy decisions start with the way a site works.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                Virya helps businesses assess clean-energy options around the facility,
                its operating needs and the project decision ahead. Suitability depends
                on site conditions and agreed scope.
              </p>
              <Link to="/about" className="btn-outline mt-7 border-white/25 text-white hover:bg-white/10">
                About Virya
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {[
                {
                  title: 'Start with context',
                  body: 'Operating hours, energy use and existing infrastructure frame the questions to review first.',
                  image: visualAssets.siteAssessment,
                },
                {
                  title: 'Explore connected options',
                  body: 'Compare generation, storage, charging and monitoring against capacity, schedules and site constraints.',
                  image: visualAssets.energyControl,
                },
                {
                  title: 'Make scope clear',
                  body: 'Confirm deliverables, approvals and responsibilities before committing to further work.',
                  image: visualAssets.engineeringBlueprints,
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06} as="div">
                  <article className="h-full overflow-hidden border border-white/15 bg-white/[0.04]">
                    <CardImage image={item.image} className="aspect-[16/9]" />
                    <div className="p-5 sm:p-6">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <p className="mt-3 text-[0.9rem] leading-relaxed text-white/70">
                        {item.body}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
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
                Different sites. Different energy questions.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted">
                Explore common operating constraints by site type, then focus on what
                matters at your location.
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
                  className="card card-hover group flex h-full flex-col p-5"
                >
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[0.98rem] font-bold text-ink transition-colors group-hover:text-emerald-700">
                      {item.label}
                    </p>
                    <p className="mt-2 text-[0.83rem] leading-relaxed text-ink-muted">
                      {industries.find((i) => i.slug === item.slug)?.cardSummary}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <ProcessContainer />

      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Prepare for a first discussion
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              The details that help shape an initial assessment.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              A first discussion can start with the information you already have.
              These details help identify what a closer review may need.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Site context',
                body: 'Share the facility type, location, operating status and any access or ownership constraints.',
                image: visualAssets.hospital,
              },
              {
                title: 'Energy use',
                body: 'Bills or meter data, operating hours and demand peaks help show when the site uses power.',
                image: visualAssets.hotel,
              },
              {
                title: 'Existing infrastructure',
                body: 'Note available roof or land, the electrical connection, existing generation and backup systems.',
                image: visualAssets.retail,
              },
              {
                title: 'Project objective',
                body: 'Describe the decision, solution areas, stakeholders and timeline you are working toward.',
                image: visualAssets.education,
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06} as="div">
                <article className="card h-full overflow-hidden">
                  <CardImage image={item.image} className="aspect-[16/9]" />
                  <div className="p-6 sm:p-7">
                    <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-sm leading-relaxed text-ink-faint">
            Share sensitive documents only when needed and through an approved,
            secure channel. Initial suitability is not a substitute for a site
            survey or engineering assessment.
          </p>
        </div>
      </section>

      <CtaBand
        title="Have an energy project in mind?"
        body="Tell us about your facility, operating requirements or project question. The team can help identify the information and next step relevant to your enquiry."
        primary={{ label: 'Request a consultation', to: '/request-consultation' }}
        secondary={{ label: 'Contact Us', to: '/contact' }}
      />
    </>
  );
}