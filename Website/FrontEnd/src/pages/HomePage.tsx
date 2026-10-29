import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Building2, Factory, HeartPulse, Truck, Warehouse } from 'lucide-react';
import { HeroSliderContainer } from '@/components/sections/HeroSliderContainer';
import { InsightBand } from '@/components/sections/InsightBand';
import { EnergyEcosystemContainer } from '@/components/sections/EnergyEcosystemContainer';
import { ProcessContainer } from '@/components/sections/ProcessContainer';
import { UseCasesContainer } from '@/components/sections/UseCasesContainer';
import { CtaBand } from '@/components/sections/PageHero';
import { CardImage, Reveal } from '@/components/ui';
import { industries } from '@/data/services';
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

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'EV Charging Infrastructure',
                detail: 'High-power depot, corridor, and workplace charging from 3.3 kW AC to 350 kW DC & MCS.',
                spec: 'Real vehicle charge times · ISO 15118-20 · Fleet TCO ROI',
                image: visualAssets.ev,
                to: '/services/ev-charging',
              },
              {
                title: 'Solar Photovoltaic Systems',
                detail: 'Rigid monocrystalline panels, lightweight flexible mats, and commercial rooftop arrays.',
                spec: '22%+ cell efficiency · 4.5 m²/kWp · Zero export controls',
                image: visualAssets.solarFlatRigid,
                to: '/services/solar',
              },
              {
                title: 'Wind Energy Systems',
                detail: 'Kayathar and South Tamil Nadu wind corridors with low-speed direct drive and geared turbines.',
                spec: '690V / 11kV generation · Hourly kWh metrics · Capacity factor',
                image: visualAssets.windEnergy,
                to: '/services/wind-energy',
              },
              {
                title: 'Battery & Energy Storage (BESS)',
                detail: 'Containerized utility & industrial LFP storage for peak demand shaving and UPS microgrids.',
                spec: 'Sub-4ms transfer · Peak tariff arbitrage · Thermal AI',
                image: visualAssets.batteryStorage,
                to: '/services/battery',
              },
              {
                title: 'Smart Energy & IoT Platforms',
                detail: 'Real-time telemetry, SCADA monitoring, day-ahead solar forecasting, and OCPP charge management.',
                spec: 'Sub-second telemetry · Automated billing · AI load shift',
                image: visualAssets.energyControl,
                to: '/services/software-iot',
              },
              {
                title: 'Engineering & Turnkey EPC',
                detail: 'End-to-end electrical single line design, transformer headroom studies, and discom approvals.',
                spec: 'Statutory approvals · HT yards · Guaranteed 98%+ SLA',
                image: visualAssets.engineering,
                to: '/services/consulting',
              },
            ].map((offering, index) => (
              <Reveal key={offering.title} delay={index * 0.05} as="div">
                <Link to={offering.to} className="card card-hover group block h-full overflow-hidden border border-line">
                  <CardImage image={offering.image} className="aspect-[16/9]" />
                  <div className="p-6">
                    <p className="text-lg font-bold text-ink group-hover:text-emerald-300 transition-colors">{offering.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{offering.detail}</p>
                    <p className="mt-3 text-[0.72rem] font-bold uppercase tracking-wider text-emerald-400">{offering.spec}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 group-hover:translate-x-1 transition-transform">
                      Explore architecture <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Concrete Vehicle & CleanTech Showcase Strip */}
      <section className="section bg-mist border-y border-line">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Segment Hardware & Duty Cycles
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                Real Vehicles, Concrete Charge Times & Clean Generation.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Explore certified electric vehicles operating across India, their verified charging speeds, and modular solar and wind technologies.
              </p>
            </div>
            <Link to="/services/ev-charging" className="btn-primary-lg text-xs">
              Open EV charging knowledge repository <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              {
                title: 'Electric Passenger Cars',
                model: 'Tata Nexon (45 kWh) & Ioniq 5 (72.6 kWh)',
                spec: '18 mins HPC · 56 mins DC · 6.0h AC',
                connector: 'CCS2 / Type 2 AC',
                image: visualAssets.ev,
                to: '/services/ev-charging/passenger',
                tag: 'Cars (BEV/PHEV)',
              },
              {
                title: 'Electric Two-Wheelers',
                model: 'Ather 450X (3.7 kWh) & Ola S1 Pro (4 kWh)',
                spec: '50 mins fast · 15 min 50km top-up · Swap Kiosks',
                connector: 'Standard 15A & Fast Ports',
                image: visualAssets.evTwoWheeler,
                to: '/services/ev-charging/two-wheelers',
                tag: '2-Wheelers',
              },
              {
                title: 'Electric Auto-Rickshaws',
                model: 'Mahindra Treo & Euler HiLoad (12.4 kWh)',
                spec: '3.8h AC · 15 mins for 50km · 2 min Swapping',
                connector: '16A Industrial & DC Fast',
                image: visualAssets.evAutoRickshaw,
                to: '/services/ev-charging/three-wheelers',
                tag: '3-Wheelers',
              },
              {
                title: 'Electric Transit Buses',
                model: 'Olectra K9 (360 kWh) & Tata Starbus EV',
                spec: '110 mins 150kW Dual-Gun · 12 min Pantograph',
                connector: 'Dual CCS2 & SAE J3105',
                image: visualAssets.evBusDepot,
                to: '/services/ev-charging/buses',
                tag: 'Electric Buses',
              },
              {
                title: 'Commercial Trucks & Fleets',
                model: 'Tata Ace EV & Heavy 40-55T Haulers',
                spec: '105 mins DC Fast · 35 mins Megawatt MCS',
                connector: 'Dual CCS2 & MCS Standard',
                image: visualAssets.industrial,
                to: '/services/ev-charging/fleets',
                tag: 'Commercial Fleets',
              },
              {
                title: 'Rigid Monocrystalline Solar',
                model: 'TOPCon & Mono PERC Framed Modules',
                spec: '22.5%+ efficiency · 4.5 m²/kWp · 25-yr warranty',
                connector: 'Framed RCC & Ground Arrays',
                image: visualAssets.solarFlatRigid,
                to: '/services/solar/rigid',
                tag: 'Rigid Solar',
              },
              {
                title: 'Flexible Thin-Film Solar Mats',
                model: 'Ultra-Lightweight CIGS Solar Mats',
                spec: '2.8 kg/m² · 30° bend radius · Peel-and-stick',
                connector: 'Curved Roofs & Metal PEBs',
                image: visualAssets.solarFlexibleMat,
                to: '/services/solar/flexible',
                tag: 'Flexible Solar',
              },
              {
                title: 'Kayathar Wind Corridors',
                model: 'Direct-Drive & Geared Turbines (100kW–3.5MW)',
                spec: '690V / 11kV AC · 9–18 RPM · High-wind funnel',
                connector: 'South Tamil Nadu Pooling',
                image: visualAssets.windEnergy,
                to: '/services/wind-energy/utility',
                tag: 'Wind Turbines',
              },
            ].map((card, index) => (
              <Reveal key={card.title} delay={index * 0.04} as="div">
                <Link
                  to={card.to}
                  className="group card card-hover flex h-full flex-col justify-between overflow-hidden border border-line bg-card"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <CardImage image={card.image} className="aspect-[16/10] group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/20 bg-[#07110f]/80 px-2.5 py-0.5 text-[0.68rem] font-bold text-white backdrop-blur-sm">
                        {card.tag}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm font-bold text-ink group-hover:text-emerald-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        {card.model}
                      </p>
                      <div className="mt-3 rounded-lg bg-mist/80 p-2.5 border border-line">
                        <p className="text-xs font-bold text-emerald-400">{card.spec}</p>
                        <p className="mt-0.5 font-mono text-[0.68rem] text-ink-faint">{card.connector}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 pt-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                      View details & specs <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
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