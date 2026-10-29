import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  Building2,
  Factory,
  Truck,
  Warehouse,
  Zap,
  Sun,
  BatteryCharging,
  Cpu,
  LineChart,
  ShieldCheck,
  Wrench,
  Server,
  ShoppingBag,
  Landmark,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { HeroSliderContainer } from '@/components/sections/HeroSliderContainer';
import { EnergyEcosystemContainer } from '@/components/sections/EnergyEcosystemContainer';
import { ProcessContainer } from '@/components/sections/ProcessContainer';
import { UseCasesContainer } from '@/components/sections/UseCasesContainer';
import { CtaBand } from '@/components/sections/PageHero';
import { CardImage, Reveal } from '@/components/ui';
import { RegionalLocator } from '@/components/RegionalLocator';
import { visualAssets } from '@/data/visuals';
import { HUBS_ACROSS_INDIA } from '@/data/offeringsArchitecture';

export default function HomePage() {
  const [selectedHub, setSelectedHub] = useState('Bengaluru');

  const hubLocations = HUBS_ACROSS_INDIA.map((h) => ({
    name: h.city,
    latitude: h.coordinates[0],
    longitude: h.coordinates[1],
  }));

  return (
    <>
      <HeroSliderContainer />

      {/* Positioning & Consulting Architecture Strip */}
      <section className="border-b border-line bg-white">
        <div className="shell py-12 sm:py-16">
          <div className="max-w-3xl text-left">
            <p className="eyebrow">
              <span className="rule-accent" />
              Consulting-Led CleanTech Architecture
            </p>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink sm:text-3xl lg:text-4xl">
              Clear energy decisions start with the way your facility actually operates.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              Assess solar PV, high-power EV charging, industrial BESS storage, and cloud telemetry against real interval loads, discom tariffs, and transformer headroom before procuring hardware.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Interval Demand Baseline',
                body: 'Analyze 15-minute smart meter demand, operating shifts, power factor, and harmonic distortion to establish real baseline capacity.',
                icon: LineChart,
              },
              {
                step: '02',
                title: 'Multi-Asset Synchronization',
                body: 'Directly couple rooftop solar, containerized LFP storage, and dynamic EVSE charging throttles to avoid utility breaker trips.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Tariff & ROI Optimization',
                body: 'Model Time-of-Day (ToD) peak demand arbitrage, green energy open access, and captive generation ROI with verified discom tariffs.',
                icon: Sun,
              },
              {
                step: '04',
                title: 'Audit-Ready Carbon Telemetry',
                body: 'Track Scope 1 & Scope 2 carbon abatement in real time, delivering audit-grade documentation for BRSR and CBAM export compliance.',
                icon: ShieldCheck,
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} as="div">
                <div className="card h-full p-6 border border-line bg-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xl font-extrabold text-emerald-400">{item.step}</span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[0.72rem] font-bold uppercase tracking-wider text-emerald-400">
                    Engineered Precision
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings: All 8 CleanTech Pillars */}
      <section className="section bg-[#07130f] text-white">
        <div className="shell">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 text-left">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Full Lifecycle Capabilities
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl lg:text-[2.6rem]">
                8 Core CleanTech Pillars, <span className="text-emerald-400">Synchronized for Scale</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                From high-power fleet charging and flexible solar mats to utility-scale BESS and cloud SCADA, explore our full technology suite.
              </p>
            </div>

            <Link to="/services" className="btn-primary-lg text-xs">
              Explore All 8 Pillars
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Electric Mobility Infrastructure',
                detail: 'Depot EVSE, public highway corridors, and workplace charging from 3.3 kW AC to 350 kW DC & MCS.',
                spec: 'ISO 15118-20 · Dynamic Load Balancing',
                image: visualAssets.evBusDepot,
                to: '/services/ev-charging',
                icon: Zap,
              },
              {
                title: 'Solar Photovoltaic Systems',
                detail: 'Rigid monocrystalline panels, ultra-lightweight flexible CIGS mats, and industrial rooftop arrays.',
                spec: '22.5%+ Efficiency · 4.5 m²/kWp · Zero-Export',
                image: visualAssets.solarCommercialRooftop,
                to: '/services/solar',
                icon: Sun,
              },
              {
                title: 'Wind Energy Systems',
                detail: 'Kayathar wind corridor generation with low-speed direct drive (9–18 RPM) and geared 690V/11kV turbines.',
                spec: '690V / 11kV · Hourly kWh · Funnel Physics',
                image: visualAssets.windEnergy,
                to: '/services/wind-energy',
                icon: WindIcon,
              },
              {
                title: 'Battery & Energy Storage (BESS)',
                detail: 'Containerized utility & industrial LFP storage for peak demand shaving, UPS failover, and microgrids.',
                spec: 'Sub-4ms Transfer · Peak ToD Arbitrage',
                image: visualAssets.batteryStorage,
                to: '/services/battery',
                icon: BatteryCharging,
              },
              {
                title: 'Smart Energy & SCADA Platforms',
                detail: 'Real-time multi-facility telemetry, single-line diagram tracking, day-ahead forecasting, and certified OCPP 2.0.1.',
                spec: 'Sub-Second Telemetry · Automated Billing',
                image: visualAssets.energyControl,
                to: '/energy-platforms',
                icon: Cpu,
              },
              {
                title: 'Grid Modernization & Substations',
                detail: 'Substation capacity studies, harmonic filter banks, reactive power compensation, and Virtual Power Plants.',
                spec: 'CEA Grid Code · Active Harmonic Mitigation',
                image: visualAssets.gridModernizationSubstation,
                to: '/services/consulting',
                icon: LineChart,
              },
              {
                title: 'Decarbonization & ESG Services',
                detail: 'Scope 1 & 2 carbon audits, marginal abatement cost curves, and audit-ready BRSR and CBAM compliance.',
                spec: 'BRSR / CSRD / CBAM Compliance',
                image: visualAssets.siteAssessment,
                to: '/services/consulting',
                icon: ShieldCheck,
              },
              {
                title: 'Engineering & Turnkey EPC',
                detail: 'Detailed electrical SLDs, transformer headroom engineering, civil foundations, and discom grid NOC approvals.',
                spec: 'Guaranteed 98%+ SLA · Turnkey Delivery',
                image: visualAssets.engineeringBlueprints,
                to: '/services/consulting',
                icon: Wrench,
              },
            ].map((offering, index) => (
              <Reveal key={offering.title} delay={index * 0.04} as="div">
                <Link
                  to={offering.to}
                  className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#091b15]/90 hover:border-emerald-500/40 hover:bg-[#0b221a] transition-all duration-300 shadow-lg"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <CardImage
                        image={offering.image}
                        className="aspect-[16/10] group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#091b15] via-transparent to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 grid h-8 w-8 place-items-center rounded-lg bg-[#07130f]/80 text-emerald-400 border border-white/20 backdrop-blur-sm">
                        <offering.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {offering.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                        {offering.detail}
                      </p>
                      <div className="mt-3 rounded-lg bg-white/[0.04] p-2 border border-white/5">
                        <p className="text-[0.68rem] font-bold text-emerald-400 uppercase tracking-wider">
                          {offering.spec}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 pt-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                      Explore Architecture <ArrowRight className="h-3 w-3" />
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
        <div className="shell text-left">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Segment Hardware & Duty Cycles
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl lg:text-4xl">
                Real Vehicles, Concrete Charge Times & Generation Specs.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                Explore certified electric vehicles operating across India, their verified charging speeds, and modular solar and wind technologies.
              </p>
            </div>
            <Link to="/services/ev-charging" className="btn-primary-lg text-xs">
              Open EV Knowledge Repository <ArrowRight className="h-3.5 w-3.5" />
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
                      <CardImage
                        image={card.image}
                        className="aspect-[16/10] group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/20 bg-[#07110f]/80 px-2.5 py-0.5 text-[0.68rem] font-bold text-white backdrop-blur-sm">
                        {card.tag}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-sm font-bold text-ink group-hover:text-emerald-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">{card.model}</p>
                      <div className="mt-3 rounded-lg bg-mist/80 p-2.5 border border-line">
                        <p className="text-xs font-bold text-emerald-700">{card.spec}</p>
                        <p className="mt-0.5 font-mono text-[0.68rem] text-ink-faint">{card.connector}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 pt-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                      View details & specs <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Market Segments Architecture: 8 Consulting-Led Segments */}
      <section className="section bg-white">
        <div className="shell text-left">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Industry-Specific Operating Contexts
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                Consulting-Led Market Segments Architecture
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Every operating environment has unique duty cycles, grid connection headroom, and tariff penalties. Discover how our clean technology architectures map directly to your sector’s business outcomes.
              </p>
            </div>

            <Link to="/industries" className="btn-outline">
              Explore All 8 Market Segments
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                slug: 'transportation',
                title: 'Transportation & Mobility',
                icon: Truck,
                apps: ['Depot DC Fast Charging', 'Bus Transit Pantographs', 'Route Energy Optimization'],
                outcome: '40–60% lower fueling cost/km vs diesel',
                to: '/industries#transportation',
              },
              {
                slug: 'manufacturing',
                title: 'Manufacturing & Industrial',
                icon: Factory,
                apps: ['Industrial Solar Arrays', 'Containerized Peak BESS', 'CBAM Decarbonization'],
                outcome: 'Up to 35% peak tariff charge reduction',
                to: '/industries#manufacturing',
              },
              {
                slug: 'logistics',
                title: 'Logistics & Warehousing',
                icon: Warehouse,
                apps: ['Warehouse EV Fleets', 'Cold Chain Microgrids', 'Expansive Rooftop PV'],
                outcome: 'Zero spoilage during grid outages',
                to: '/industries#logistics',
              },
              {
                slug: 'real-estate',
                title: 'Real Estate & Smart Buildings',
                icon: Building2,
                apps: ['Tenant EVSE Billing', 'Architectural Carports', 'LEED/IGBC Compliance'],
                outcome: 'Higher asset valuation & green premiums',
                to: '/industries#real-estate',
              },
              {
                slug: 'utilities',
                title: 'Utilities & Energy Providers',
                icon: LineChart,
                apps: ['Distributed Energy (DERs)', 'Virtual Power Plants (VPP)', 'Harmonic Mitigation'],
                outcome: 'Hosting capacity unlocked without line upgrades',
                to: '/industries#utilities',
              },
              {
                slug: 'government',
                title: 'Government & Smart Cities',
                icon: Landmark,
                apps: ['Public EV Hubs', 'Transit Electrification', 'Municipal Solar Net-Zero'],
                outcome: 'PM E-DRIVE compliance & civic leadership',
                to: '/industries#government',
              },
              {
                slug: 'retail',
                title: 'Retail & Hospitality',
                icon: ShoppingBag,
                apps: ['Destination Fast Chargers', 'Solar Shaded Parking', 'Brand Carbon Telemetry'],
                outcome: '45+ min average dwell time increase',
                to: '/industries#retail',
              },
              {
                slug: 'data-centers',
                title: 'Data Centers & Digital Hubs',
                icon: Server,
                apps: ['24/7 Carbon-Free PPA', 'High-C-Rate UPS BESS', 'Sub-1.25 PUE Cooling'],
                outcome: 'Zero diesel backup emissions with millisecond failover',
                to: '/industries#data-centers',
              },
            ].map((segment, index) => (
              <Reveal key={segment.slug} delay={index * 0.04} as="div">
                <Link
                  to={segment.to}
                  className="card card-hover group flex h-full flex-col justify-between p-5 border border-line bg-card hover:border-emerald-500/40"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-line pb-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <segment.icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-ink-faint uppercase">Sector</span>
                    </div>

                    <h3 className="mt-3.5 text-base font-bold text-ink group-hover:text-emerald-700 transition-colors">
                      {segment.title}
                    </h3>

                    <ul className="mt-3 space-y-1.5">
                      {segment.apps.map((app) => (
                        <li key={app} className="flex items-center gap-1.5 text-xs text-ink-muted">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-line">
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
                      Outcome
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-ink">{segment.outcome}</p>
                    <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform">
                      View Segment Blueprint <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Infrastructure & Hubs Across India */}
      <section className="section bg-mist border-t border-line">
        <div className="shell text-left">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                Engineering Presence & Operational Footprint
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
                10 Regional Hubs Across India
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Headquartered in Bengaluru with regional field engineering hubs spanning Karnataka, Telangana, Tamil Nadu, Kerala, Andhra Pradesh, and Goa.
              </p>
            </div>

            <Link to="/contact" className="btn-outline">
              Contact Regional Offices <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Quick Hub Selector Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {HUBS_ACROSS_INDIA.map((hub) => (
              <button
                key={hub.city}
                type="button"
                onClick={() => setSelectedHub(hub.city)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedHub.toLowerCase() === hub.city.toLowerCase()
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white border border-line text-ink hover:bg-emerald-50'
                }`}
              >
                <MapPin className="h-3 w-3" />
                {hub.city}
                {hub.isHeadquarters && <span className="ml-1 text-[0.65rem] opacity-80">(HQ)</span>}
              </button>
            ))}
          </div>

          {/* Dual Map Embed & Office Details */}
          <div className="mt-6">
            <RegionalLocator locations={hubLocations} activeLocation={selectedHub} />
          </div>
        </div>
      </section>

      <UseCasesContainer />

      {/* About Section */}
      <section id="about" className="section bg-[#07130f] text-white">
        <div className="shell text-left">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
            <Reveal className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-400">
                About Virya Cleantech
              </span>
              <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] text-white sm:text-4xl">
                Practical energy decisions start with the way a site works.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/70">
                Virya helps commercial enterprises assess clean-energy options around the facility, its operating schedules, and the business decision ahead. Suitability depends on site conditions, interval data, and agreed scope.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link to="/about" className="btn-primary-lg text-xs">
                  About Virya <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/process"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Our Engineering Process
                </Link>
              </div>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
              {[
                {
                  title: 'Start with Context',
                  body: 'Operating shifts, interval electricity bills, and existing transformers frame the questions to review first.',
                  image: visualAssets.siteAssessment,
                },
                {
                  title: 'Model Connected Options',
                  body: 'Synchronize solar PV, BESS storage, EV charging, and telemetry against load profiles and tariff bands.',
                  image: visualAssets.energyControl,
                },
                {
                  title: 'Transparent Scope',
                  body: 'Confirm single-line electrical diagrams, statutory NOCs, and equipment guarantees before breaking ground.',
                  image: visualAssets.engineeringBlueprints,
                },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 0.06} as="div">
                  <article className="h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04]">
                    <CardImage image={item.image} className="aspect-[16/9]" />
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-white/70">{item.body}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EnergyEcosystemContainer />

      <ProcessContainer />

      {/* Prepare for First Discussion */}
      <section className="section bg-mist">
        <div className="shell text-left">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Prepare for a First Discussion
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] text-ink sm:text-4xl">
              The details that help shape an initial engineering review.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              A first consultation can start with the information you already have on hand. These inputs allow our technical team to assess feasibility rapidly.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Site Context',
                body: 'Share facility type, geographical location, roof construction (RCC, PEB, metal sheet), and property access.',
                image: visualAssets.hospital,
              },
              {
                title: 'Energy Use Profile',
                body: 'Recent utility electricity bills, 15-minute interval demand data, and operating shift hours.',
                image: visualAssets.hotel,
              },
              {
                title: 'Electrical Infrastructure',
                body: 'Transformer ratings, sanctioned load (kVA), LT/HT panel room headroom, and existing diesel generator capacity.',
                image: visualAssets.retail,
              },
              {
                title: 'Project Goals & Fleet',
                body: 'Target EV vehicle counts, duty cycles, expected solar capacity, and decarbonization budget timelines.',
                image: visualAssets.education,
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05} as="div">
                <article className="card h-full overflow-hidden border border-line">
                  <CardImage image={item.image} className="aspect-[16/9]" />
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base font-bold text-ink">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink-muted">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 text-xs leading-relaxed text-ink-faint">
            Initial reviews are strictly confidential. Proprietary load profiles and utility bills are handled under engineering NDA.
          </p>
        </div>
      </section>

      <CtaBand
        title="Ready to engineer your facility's clean energy transition?"
        body="Share your facility loads, location, and target CleanTech applications. Our engineering team in Bengaluru will prepare a site-specific feasibility review."
        primary={{ label: 'Request a Consultation', to: '/request-consultation' }}
        secondary={{ label: 'Contact Regional Hubs', to: '/contact' }}
      />
    </>
  );
}

// Inline WindIcon fallback if lucide doesn't have Wind exported directly
function WindIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}
