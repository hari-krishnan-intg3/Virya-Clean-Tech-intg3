import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sun,
  BatteryCharging,
  Wind,
  Activity,
  Layers,
  Coins,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { SmartImage, Reveal } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export interface ShowcaseSlide {
  id: string;
  pill: string;
  category: string;
  title: string;
  headline: string;
  description: string;
  image: { src: string; alt: string };
  metrics: { label: string; value: string }[];
  keySpecs: string[];
  ctaText: string;
  ctaLink: string;
  icon: typeof Zap;
}

export const SOLUTIONS_SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'ev-mobility',
    pill: 'Electric Mobility',
    category: 'Commercial EV Fleet Infrastructure',
    title: 'High-Power Depot Charging & Fleet Electrification',
    headline: 'Turnkey DC Fast Charging for Heavy-Duty Commercial Transit',
    description:
      'Engineered for logistics fleets, electric buses, and corporate parks. Featuring 60kW to 360kW dynamic dual-gun chargers with automated OCPP 2.0.1 load management, peak demand shaving, and 99.4% mission-critical uptime.',
    image: visualAssets.evBusDepot,
    metrics: [
      { label: 'Depot Uptime SLA', value: '99.4%' },
      { label: 'Max Gun Output', value: '360 kW' },
      { label: 'Operating Protocol', value: 'OCPP 2.0.1' },
      { label: 'Grid Demand Reduction', value: 'Up to 38%' },
    ],
    keySpecs: [
      'Dual-gun CCS2 & Megawatt Charging ready architecture',
      'Dynamic power balancing across 50+ charging bays',
      'Integrated ToD scheduled charging during low-tariff hours',
      'CE & ARAI certified high-voltage isolation safety',
    ],
    ctaText: 'Explore Fleet Charging',
    ctaLink: '/services/ev-charging',
    icon: Zap,
  },
  {
    id: 'solar-pv',
    pill: 'Solar Energy',
    category: 'Commercial & Industrial Solar Solutions',
    title: 'Precision Rooftop & Ground-Mount Captive Solar',
    headline: 'Maximized Energy Yield with Rigid TOPCon & Flexible CIGS Mats',
    description:
      'High-performance commercial solar arrays tailored to facility structural ratings. Choose between bifacial TOPCon monocrystalline modules and ultra-lightweight flexible CIGS mats engineered for non-penetrating Pre-Engineered Sheds (PEB).',
    image: visualAssets.solarCommercialRooftop,
    metrics: [
      { label: 'Levelized Cost (LCOE)', value: '₹3.40/kWh' },
      { label: 'Performance Warranty', value: '25 Years' },
      { label: 'Year 1 Tax Shield', value: '40% AD' },
      { label: 'Payback Timeline', value: '3.1 – 4.2 Yrs' },
    ],
    keySpecs: [
      'N-Type TOPCon bifacial cells (up to 22.8% module efficiency)',
      'Ultra-lightweight 2.9 kg/m² peel-and-stick CIGS mats for PEB roofs',
      'IP68 string inverters with multi-MPPT tracking',
      'Full DISCOM net-metering & captive approval engineering',
    ],
    ctaText: 'Explore Solar Solutions',
    ctaLink: '/services/solar',
    icon: Sun,
  },
  {
    id: 'battery-bess',
    pill: 'Battery Storage',
    category: 'Utility-Grade BESS & Microgrids',
    title: 'Containerized LFP Energy Storage Systems',
    headline: 'Sub-20ms Diesel Genset Replacement & ToD Tariff Arbitrage',
    description:
      'Safeguard operations against voltage sags and capitalize on Time-of-Day pricing spreads. Our modular containerized BESS combines automotive-grade Lithium Iron Phosphate (LFP) chemistry with active liquid thermal management.',
    image: visualAssets.storage,
    metrics: [
      { label: 'Cycle Life (80% EOL)', value: '6,000+ Cycles' },
      { label: 'Transfer Switching', value: '<20 ms' },
      { label: 'C-Rate Options', value: '0.5C to 2C' },
      { label: 'Round-Trip Efficiency', value: '>91%' },
    ],
    keySpecs: [
      'Aerosol fire suppression with multi-tier battery management (BMS)',
      'Arbitrage charge at off-peak ₹4.5/kWh; discharge during peak ₹11.5/kWh',
      'Seamless microgrid islanding for zero-downtime manufacturing',
      'Containerized plug-and-play architecture (250kWh to 4MWh)',
    ],
    ctaText: 'Explore Battery Storage',
    ctaLink: '/services/battery',
    icon: BatteryCharging,
  },
  {
    id: 'wind-energy',
    pill: 'Wind Energy',
    category: 'Utility & Distributed Wind Corridors',
    title: 'High-Efficiency Industrial Wind Generation',
    headline: 'Corridor-Specific Wind Turbines for C&I Open Access Consumers',
    description:
      'Harness high-wind corridors across Tamil Nadu, Karnataka, and Gujarat. High hub-height turbines (120m–140m) optimized for Class II and Class III low-to-medium wind profiles deliver consistent round-the-clock green electrons.',
    image: visualAssets.wind,
    metrics: [
      { label: 'Average Capacity Factor', value: '32 – 36%' },
      { label: 'Turbine Unit Class', value: '2.7 – 3.6 MW' },
      { label: 'PPA Tariff Longevity', value: '20 – 25 Yrs' },
      { label: 'Green Energy Offset', value: '100% Scope 2' },
    ],
    keySpecs: [
      'Comprehensive wind resource assessment with LIDAR & anemometry',
      'Group Captive and Third-Party Open Access PPA structuring',
      'Hybrid Wind-Solar colocation for flat 24-hour generation curves',
      'Turnkey evacuation line & pooling substation engineering',
    ],
    ctaText: 'Explore Wind Energy',
    ctaLink: '/services/wind-energy',
    icon: Wind,
  },
  {
    id: 'energy-platforms',
    pill: 'Smart Platforms',
    category: 'Cloud EMS & Real-Time Telemetry',
    title: 'Enterprise CleanTech Operations Platform',
    headline: 'Unified Telemetry, Automated Billing & Inverter-Level SCADA',
    description:
      'Gain real-time operational intelligence across multi-site generation, battery storage, and EV charging assets. Sub-second IoT ingestion, predictive failure alerts, and automated energy accounting in a unified cloud glass.',
    image: visualAssets.energyControl,
    metrics: [
      { label: 'Telemetry Ingestion', value: '<50 ms' },
      { label: 'Protocols Supported', value: '150+' },
      { label: 'Telemetry SLA', value: '99.9%' },
      { label: 'Billing Accuracy', value: '100% Audited' },
    ],
    keySpecs: [
      'Native support for Modbus TCP/RTU, BACnet, and IEC 61850',
      'Automated DISCOM bill reconciliation and penalty alerts',
      'Predictive thermal and inverter degradation anomaly models',
      'Granular API webhooks for enterprise SAP and ERP integration',
    ],
    ctaText: 'Explore Energy Platforms',
    ctaLink: '/services/software-iot',
    icon: Activity,
  },
  {
    id: 'grid-modernization',
    pill: 'Grid Modernization',
    category: 'Substation EPC & HT Grid Interconnection',
    title: 'High-Voltage Switchyard & Substation Modernization',
    headline: 'CEA-Compliant 11kV, 33kV & 66kV Interconnection Infrastructure',
    description:
      'Navigate DISCOM technical interconnection hurdles with turnkey HT electrical engineering. From transformer headroom upgrades and vacuum circuit breakers (VCB) to harmonic filtering and protection relay coordination.',
    image: visualAssets.gridModernizationSubstation,
    metrics: [
      { label: 'Voltage Compliance', value: '11 / 33 / 66 kV' },
      { label: 'CEA Grid Standard', value: '100% Met' },
      { label: 'Harmonic Distortion', value: '<3% THD' },
      { label: 'Turnkey Execution', value: 'Design to COD' },
    ],
    keySpecs: [
      'Protection study (ETAP simulation) & differential relay settings',
      'Dynamic capacitor banks & Active Harmonic Filters (AHF)',
      'Statutory CEIG and DISCOM bay allocation approvals',
      'Dual-source automatic changeover systems (AMF/ATS)',
    ],
    ctaText: 'Explore Grid Modernization',
    ctaLink: '/services/consulting',
    icon: Layers,
  },
  {
    id: 'carbon-economics',
    pill: 'Carbon Economics',
    category: 'Decarbonization & Global ESG Compliance',
    title: 'EU CBAM, BRSR Core & Carbon Abatement Economics',
    headline: 'Turn Decarbonization Mandates into Measurable Net Economic Value',
    description:
      'Shield your export margins against the EU Carbon Border Adjustment Mechanism (CBAM) and participate in India’s Carbon Credit Trading Scheme (CCTS). We combine carbon footprint auditing with Marginal Abatement Cost Curve modeling.',
    image: visualAssets.dataCenterGreenPower,
    metrics: [
      { label: 'CBAM Exposure Shield', value: 'Up to 92%' },
      { label: 'EU ETS Benchmark', value: '€70–€95/t' },
      { label: 'SEBI BRSR Core', value: 'Assurance Ready' },
      { label: 'MACC Optimization', value: 'Lowest Net Cost' },
    ],
    keySpecs: [
      'Production-level embedded emissions accounting for steel, aluminum, cement',
      'SEBI BRSR Core Scope 1, Scope 2, and Scope 3 telemetry verification',
      'Indian CCTS domestic carbon credit generation structuring',
      'Marginal Abatement Cost Curve (MACC) prioritized project ranking',
    ],
    ctaText: 'Explore Carbon Economics',
    ctaLink: '/carbon-economics',
    icon: Coins,
  },
  {
    id: 'managed-services',
    pill: 'Managed Services',
    category: '24/7 Operations & Performance Ratio Guarantees',
    title: 'Full Lifecycle Asset Management & Preventive O&M',
    headline: 'Protecting Long-Term CleanTech Yield with Guaranteed Performance',
    description:
      'Clean energy assets demand ongoing engineering rigor to sustain design yield. Our Operations & Maintenance teams provide continuous remote surveillance, thermographic drone inspections, and rapid field dispatch.',
    image: visualAssets.engineering,
    metrics: [
      { label: 'Guaranteed PR', value: '>81.5%' },
      { label: 'Field Response (MTTR)', value: '<4 Hours' },
      { label: 'Asset Life Extension', value: '+7 to 10 Yrs' },
      { label: 'Remote Center', value: '24/7/365 ROC' },
    ],
    keySpecs: [
      'High-resolution infrared thermal imaging to identify module hot spots',
      'Robotic dry module cleaning solutions for water-scarce industrial zones',
      'Transformer oil DGA testing and relay recalibration routines',
      'Contractually backed Performance Ratio (PR) & energy yield guarantees',
    ],
    ctaText: 'Explore Managed Services',
    ctaLink: '/services',
    icon: ShieldCheck,
  },
];

export function SolutionsShowcaseSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  return (
    <section className="section bg-gradient-to-b from-white via-mist to-mist/40 overflow-hidden" id="solutions-showcase">
      <div className="shell">
        {/* Header */}
        <Reveal className="max-w-3xl">
          <p className="eyebrow">
            <span className="rule-accent" />
            Comprehensive Capabilities
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            CleanTech Solutions <span className="text-gradient">Portfolio Showcase</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            Explore Virya CleanTech’s end-to-end engineering capabilities across 8 core infrastructure domains.
            Slide through each specialized pillar to examine technical specifications, operating metrics, and deployment blueprints.
          </p>
        </Reveal>

        {/* 8-Pill Navigation Selector */}
        <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SOLUTIONS_SHOWCASE_SLIDES.map((slide, idx) => {
            const Icon = slide.icon;
            const isActive = activeSlide === idx;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  swiperInstance?.slideTo(idx);
                  setActiveSlide(idx);
                }}
                className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'border-emerald-600 bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                    : 'border-slate-200 bg-white text-ink-muted hover:border-slate-300 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <span>{slide.pill}</span>
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  0{idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        {/* Swiper Slider with 8 Slides */}
        <div className="mt-8 relative">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={1}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            className="rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            {SOLUTIONS_SHOWCASE_SLIDES.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <SwiperSlide key={slide.id}>
                  <div className="grid lg:grid-cols-12 min-h-[580px]">
                    {/* Left Column: Technical Narrative & Metrics (7 cols) */}
                    <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                      <div>
                        {/* Top Category Badge */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                            <Icon className="h-3.5 w-3.5 text-emerald-600" />
                            {slide.category}
                          </span>
                          <span className="text-xs font-mono font-medium text-slate-400">
                            Pillar {index + 1} of {SOLUTIONS_SHOWCASE_SLIDES.length}
                          </span>
                        </div>

                        {/* Title & Headline */}
                        <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
                          {slide.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base font-semibold text-emerald-700">
                          {slide.headline}
                        </p>
                        <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink-muted">
                          {slide.description}
                        </p>

                        {/* 4 Performance Metrics Grid */}
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {slide.metrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center transition-colors hover:bg-emerald-50/50 hover:border-emerald-200"
                            >
                              <div className="text-lg sm:text-xl font-black text-ink">{metric.value}</div>
                              <div className="mt-1 text-[11px] font-medium leading-tight text-slate-500">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Technical Specifications Checklist */}
                        <div className="mt-6 space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Core Engineering Specifications
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-2 text-xs text-ink-muted">
                            {slide.keySpecs.map((spec) => (
                              <div key={spec} className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                                <span>{spec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <Link
                          to={slide.ctaLink}
                          className="btn-primary inline-flex items-center gap-2 group"
                        >
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                          to="/request-consultation"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
                        >
                          Request Technical Feasibility
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Visual Asset & Overlay (5 cols) */}
                    <div className="lg:col-span-5 relative bg-slate-900 min-h-[300px] lg:min-h-full overflow-hidden flex flex-col justify-end">
                      <SmartImage
                        src={slide.image.src}
                        alt={slide.image.alt}
                        width={1200}
                        height={800}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                      
                      <div className="relative p-6 sm:p-8 z-10 text-white">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                          Deployment Profile
                        </span>
                        <h4 className="mt-1 text-lg font-bold text-white">
                          {slide.title}
                        </h4>
                        <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                          Field-proven engineering designed for Indian commercial operating conditions and DISCOM compliance.
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Slider Controls */}
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink">
                0{activeSlide + 1}
              </span>
              <span className="text-xs text-slate-400">/</span>
              <span className="text-xs text-slate-500 font-medium">
                0{SOLUTIONS_SHOWCASE_SLIDES.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiperInstance?.slidePrev()}
                aria-label="Previous solution"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-muted transition-all hover:bg-slate-50 hover:text-ink active:scale-95 shadow-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => swiperInstance?.slideNext()}
                aria-label="Next solution"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-ink-muted transition-all hover:bg-slate-50 hover:text-ink active:scale-95 shadow-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
