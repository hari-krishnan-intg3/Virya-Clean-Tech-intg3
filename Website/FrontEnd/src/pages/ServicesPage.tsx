import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Wrench, Layers, Compass } from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { CardImage, Reveal, ServiceCard } from '@/components/ui';
import { services } from '@/data/services';
import { visualAssets } from '@/data/visuals';
import { SolutionsShowcaseSlider } from '@/components/solutions/SolutionsShowcaseSlider';
import { SolutionsRoiCalculators } from '@/components/solutions/SolutionsRoiCalculators';
import { EnergyAssessmentToolkits } from '@/components/solutions/EnergyAssessmentToolkits';

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
        description="Comprehensive CleanTech engineering across solar PV, EV fleet mobility, BESS storage, connected platforms, and grid interconnection. Assess economic returns and technical headroom with our interactive engineering suites."
        primary={{ label: 'Discuss Your Project', to: '/request-consultation' }}
        secondary={{ label: 'How we work', to: '/process' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Offerings & Solutions', to: '/services' }]}
      />

      {/* Solutions Section Anchor Quick-Nav */}
      <section className="bg-slate-900 text-white py-4 border-y border-slate-800 sticky top-16 z-30 shadow-md backdrop-blur-md bg-slate-900/95">
        <div className="shell flex items-center justify-between gap-4 overflow-x-auto scrollbar-none text-xs font-semibold">
          <span className="text-slate-400 uppercase tracking-widest text-[11px] font-mono shrink-0">
            Quick Navigate:
          </span>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href="#solutions-showcase"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-emerald-400" />
              <span>8-Pillar Showcase</span>
            </a>
            <a
              href="#core-offerings"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400" />
              <span>Core Services</span>
            </a>
            <a
              href="#roi-calculators"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Calculator className="h-3.5 w-3.5 text-emerald-400" />
              <span>ROI Calculators</span>
            </a>
            <a
              href="#assessment-toolkits"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Wrench className="h-3.5 w-3.5 text-emerald-400" />
              <span>Energy Assessment Toolkits</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8-Slide Solutions Showcase Slider */}
      <SolutionsShowcaseSlider />

      {/* Core Service Cards Catalog */}
      <section className="section bg-white" id="core-offerings">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Specialized Divisions
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Turnkey CleanTech <span className="text-gradient">Engineering Services</span>
            </h2>
            <p className="mt-3 text-base text-ink-muted">
              Deep technical specifications, equipment tiers, and delivery methodologies for commercial, industrial, and institutional infrastructure.
            </p>
          </Reveal>

          <div className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} as="div" className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive CleanTech ROI Calculators */}
      <SolutionsRoiCalculators />

      {/* Interactive Energy Assessment Toolkits */}
      <EnergyAssessmentToolkits />

      {/* Starting Point & Methodology Guide */}
      <section className="section bg-mist/60 border-t border-slate-200/70">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow"><span className="rule-accent" />Choosing a starting point</p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Start with the question your site needs to answer.</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">Your first review can focus on site energy use, available infrastructure, vehicle patterns, storage needs, or missing project information.</p>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/insights" className="btn-outline">Read energy insights</Link>
            <Link to="/carbon-economics" className="btn-outline">Carbon Economics & CBAM</Link>
            <Link to="/faq" className="btn-outline">Common questions</Link>
          </div>
        </div>
      </section>

      {/* Where each of these starts */}
      <section className="section bg-white">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Choosing
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              Where each clean energy initiative starts
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-4 sm:grid-cols-2">
            {[
              {
                when: 'Understand energy use & HT limits',
                then: 'Energy Audit & Headroom',
                image: visualAssets.siteAssessment,
                because:
                  'Available electricity bills, meter demand interval data, and HT transformer headroom identify sizing boundaries before capital is committed.',
                to: '/services/consulting',
                cta: 'Start with an audit',
              },
              {
                when: 'Evaluating on-site solar generation',
                then: 'Solar PV & CIGS Design',
                image: visualAssets.rooftopSolarArray,
                because:
                  'Roof dead-load capacity, shadow obstructions, and DISCOM net-metering regulations determine optimal module selection between rigid TOPCon and peel-and-stick CIGS mats.',
                to: '/services/solar',
                cta: 'Scope solar arrays',
              },
              {
                when: 'Evaluating open-access wind',
                then: 'Wind Energy Screening',
                image: visualAssets.wind,
                because:
                  'Measured wind speed, regional pooling substation evacuation capacity, and banking regulations determine commercial viability under Green Energy Open Access.',
                to: '/services/wind-energy',
                cta: 'Explore wind options',
              },
              {
                when: 'Electrifying commercial fleets',
                then: 'Fleet Depot EVSE',
                image: visualAssets.fleetCharging,
                because:
                  'Vehicle battery pack size, operational dwell schedules, depot power factor, and smart OCPP 2.0.1 load management shape total electrical infrastructure needs.',
                to: '/services/ev-charging',
                cta: 'Scope fleet chargers',
              },
            ].map((item, index) => (
              <Reveal key={item.when} delay={index * 0.08} as="div">
                <article className="card card-hover flex h-full flex-col overflow-hidden border border-slate-200">
                  <CardImage image={item.image} className="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-emerald-700">
                      {item.when}
                    </p>
                    <h3 className="mt-3 text-lg font-bold text-ink">{item.then}</h3>
                    <p className="mt-2.5 flex-1 text-xs leading-relaxed text-ink-muted">
                      {item.because}
                    </p>
                    <Link
                      to={item.to}
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      {item.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to model your CleanTech feasibility?"
        body="Share your facility type, transformer capacity, and sustainability goals. Our technical engineering team will run preliminary single-line and financial models."
        primary={{ label: 'Discuss Your Project', to: '/request-consultation' }}
        secondary={{ label: 'Explore Carbon Economics', to: '/carbon-economics' }}
      />
    </>
  );
}
