import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Network,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal, SmartImage } from '@/components/ui';
import { visualAssets } from '@/data/visuals';

const PLATFORM_PILLARS = [
  {
    id: 'operations',
    title: 'Energy Operations & SCADA',
    tagline: 'Sub-second multi-facility telemetry and asset health',
    icon: Activity,
    description:
      'Consolidate solar generation, BESS storage, diesel generators, and factory machinery loads into a unified real-time dashboard. Detect power quality anomalies, phase imbalances, and transformer headroom in milliseconds.',
    features: [
      'Sub-second electrical telemetry via Modbus TCP, RTU, and MQTT industrial gateways',
      'Continuous power factor (PF), total harmonic distortion (THD), and voltage sag alerts',
      'Dynamic single-line diagram (SLD) interactive state representation',
      'Automated multi-tenant sub-metering and reconciliation reports',
    ],
    metric: '99.95% Data Ingestion SLA',
  },
  {
    id: 'ev-charging',
    title: 'EV CSMS & Fleet Charging Cloud',
    tagline: 'Certified OCPP 1.6J & 2.0.1 Charge Station Management',
    icon: Zap,
    description:
      'Manage public charging corridors and private depot hubs at scale. Features real-time charger telemetry, automated billing via UPI and credit cards, and dynamic current throttling that prevents breaker trips without expensive transformer upgrades.',
    features: [
      'Native OCPP 1.6J and OCPP 2.0.1 compliant cloud management server',
      'Dynamic Load Balancing (DLM) sharing capacity across active charging guns',
      'Integrated payment gateways supporting UPI, corporate RFID, and automated tariffs',
      'Over-the-Air (OTA) remote firmware dispatch, diagnostics, and reboot controls',
    ],
    metric: '99.8% Charger Uptime',
  },
  {
    id: 'ai-analytics',
    title: 'AI & Predictive Intelligence',
    tagline: 'Machine learning for forecasting and tariff arbitrage',
    icon: Cpu,
    description:
      'Harness advanced neural network models trained on high-resolution weather, satellite irradiance, and historical facility load data. Automatically shift battery dispatch and fleet charging blocks into lowest-cost utility tariff hours.',
    features: [
      'Day-ahead solar irradiance and wind farm output prediction (96%+ accuracy)',
      'Automated time-of-day (ToD) peak-tariff arbitrage and demand-charge shaving',
      'Battery State-of-Health (SoH) and thermal runaway degradation forecasting',
      'Machine load disaggregation identifying hidden energy wastage per production line',
    ],
    metric: '30–45% Peak Cost Reduction',
  },
  {
    id: 'grid-vpp',
    title: 'Grid & Microgrid Orchestration',
    tagline: 'Virtual Power Plants & bidirectional utility interconnects',
    icon: Network,
    description:
      'Aggregate distributed solar, BESS, and bidirectional EV fleets into Virtual Power Plants (VPP). Participate in utility demand response programs, state power exchange trading, and automated frequency regulation.',
    features: [
      'Virtual Power Plant (VPP) aggregation with automated market dispatch signals',
      'Automated Demand Response (ADR) shedding non-critical loads during peak alerts',
      'DG-PV-BESS reverse-power protection ensuring zero back-feed into diesel generators',
      'ISO 15118-20 bidirectional V2G power export orchestration',
    ],
    metric: '< 4ms Microgrid Transition',
  },
];

export default function EnergyPlatformsPage() {
  const [activePillarId, setActivePillarId] = useState(PLATFORM_PILLARS[0].id);

  // Simulated live telemetry state for interactive widget
  const [activeTab, setActiveTab] = useState<'overview' | 'solar' | 'ev' | 'bess'>('overview');

  const selectedPillar =
    PLATFORM_PILLARS.find((p) => p.id === activePillarId) ?? PLATFORM_PILLARS[0];

  return (
    <>
      <PageHero
        eyebrow="Smart CleanTech Software"
        title={
          <>
            Energy Platforms & <span className="text-gradient">Intelligent Cloud Orchestration.</span>
          </>
        }
        description="Connect solar PV systems, wind turbines, commercial BESS, and multi-megawatt EV charging hubs into a single mission-critical operating system. Turn raw kilowatt-hours into predictable margins and verified decarbonization."
        primary={{ label: 'Schedule a software demo', to: '/request-consultation?service=software-iot' }}
        secondary={{ label: 'Explore CleanTech offerings', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Energy Platforms', to: '/energy-platforms' }]}
      />

      {/* Interactive Platform Simulation Widget */}
      <section className="border-b border-line bg-mist py-10">
        <div className="shell">
          <div className="rounded-2xl border border-line bg-card p-6 sm:p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  <Activity className="h-3 w-3 animate-pulse" />
                  Live Facility SCADA Simulator
                </span>
                <h2 className="mt-2 text-xl font-bold text-ink sm:text-2xl">
                  Unified Industrial Microgrid Telemetry
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {(['overview', 'solar', 'ev', 'bess'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? 'bg-emerald-400 text-[#07110f]'
                        : 'border border-line bg-mist text-ink-muted hover:text-ink'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-line bg-mist p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                  Active Solar Generation
                </span>
                <p className="mt-2 text-2xl font-extrabold text-emerald-400">1,480 kWp</p>
                <p className="mt-1 text-xs text-ink-muted">82.4% Performance Ratio · 42.1°C Cell Temp</p>
              </div>

              <div className="rounded-xl border border-line bg-mist p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                  EV Fleet Charging Draw
                </span>
                <p className="mt-2 text-2xl font-extrabold text-sky-400">640 kW</p>
                <p className="mt-1 text-xs text-ink-muted">14 Active Guns · DLM Active (Headroom: 160 kW)</p>
              </div>

              <div className="rounded-xl border border-line bg-mist p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                  BESS Storage State
                </span>
                <p className="mt-2 text-2xl font-extrabold text-amber-400">76% SoC</p>
                <p className="mt-1 text-xs text-ink-muted">Discharging 200 kW · Off-Peak Arbitrage Ready</p>
              </div>

              <div className="rounded-xl border border-line bg-mist p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-faint">
                  Net Grid Import / Export
                </span>
                <p className="mt-2 text-2xl font-extrabold text-white">40 kW Import</p>
                <p className="mt-1 text-xs text-emerald-400 font-semibold">97.2% Self-Consumption Rate</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#091510] p-4 text-xs text-ink-muted border border-white/10">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                TLS 1.3 encrypted Modbus & OCPP stream · ISO 27001 certified data residency
              </span>
              <Link
                to="/request-consultation?service=software-iot"
                className="font-bold text-emerald-300 hover:underline inline-flex items-center gap-1"
              >
                Connect your facility hardware <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars Deep Dive */}
      <section className="section">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Platform Architecture
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Four Interoperable Layers of Energy Intelligence.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Select a software layer to explore protocols, architecture specifications, and measurable operational outcomes.
            </p>
          </Reveal>

          {/* Pillar Selector Tabs */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PLATFORM_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              const isActive = activePillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                    isActive
                      ? 'border-emerald-400 bg-emerald-400/10 text-white shadow-soft'
                      : 'border-line bg-card text-ink-muted hover:border-emerald-400/40 hover:text-ink'
                  }`}
                >
                  <div>
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-3 text-base font-bold text-ink">{pillar.title}</h3>
                    <p className="mt-1 text-xs text-ink-muted line-clamp-2">{pillar.tagline}</p>
                  </div>
                  <span className="mt-4 text-[0.7rem] font-bold uppercase tracking-wider text-emerald-400">
                    {pillar.metric}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Showcase */}
          <div className="mt-10 rounded-2xl border border-line bg-card p-6 sm:p-10 shadow-soft">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Detailed Capability Profile
                </span>
                <h3 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
                  {selectedPillar.title}
                </h3>
                <p className="mt-2 text-sm font-semibold text-emerald-400 sm:text-base">
                  {selectedPillar.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {selectedPillar.description}
                </p>

                <div className="mt-6 space-y-3">
                  {selectedPillar.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 text-xs sm:text-sm text-ink leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/request-consultation?service=software-iot"
                    className="btn-primary-lg text-xs"
                  >
                    Request deployment consultation <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/services" className="btn-outline text-xs">
                    Explore CleanTech hardware
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line lg:col-span-5 shadow-lift">
                <SmartImage
                  src={visualAssets.energyControl.src}
                  alt={selectedPillar.title}
                  width={800}
                  height={500}
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07110f]/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#07110f]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <selectedPillar.icon className="h-3.5 w-3.5 text-emerald-300" />
                  {selectedPillar.metric}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standards & Interoperability Matrix */}
      <section className="section bg-mist">
        <div className="shell">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Protocol Interoperability
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              Zero Vendor Lock-In. Certified Open Standards.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              Virya Energy Platforms interface with all major inverter brands, battery management systems, and EV charger manufacturers via open, certified industrial protocols.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                protocol: 'OCPP 1.6J & 2.0.1',
                use: 'EVSE Charge Station Management',
                detail: 'Full smart charging profiles, remote firmware dispatch, automated transaction billing, and diagnostics.',
              },
              {
                protocol: 'Modbus TCP / RTU',
                use: 'Inverters & Energy Meters',
                detail: 'Direct hardware register polling across Solar string inverters, BESS PCS, and power quality analyzers.',
              },
              {
                protocol: 'MQTT & REST APIs',
                use: 'Enterprise Cloud Integrations',
                detail: 'Lightweight JSON telemetry streaming into ERP, SAP, building BMS, and third-party ESG accounting clouds.',
              },
              {
                protocol: 'IEC 61850 & DNP3',
                use: 'Substation & Utility SCADA',
                detail: 'High-voltage grid synchronization, breaker trip teleprotection, and automated discom telemetry feeds.',
              },
            ].map((p) => (
              <div key={p.protocol} className="rounded-xl border border-line bg-card p-5">
                <span className="font-mono text-xs font-bold text-emerald-400">{p.protocol}</span>
                <h4 className="mt-2 text-sm font-bold text-ink">{p.use}</h4>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to connect your facility to intelligent clean energy software?"
        body="Schedule a demonstration with our software engineers. We will connect sample telemetry, demonstrate dynamic load management, and model tariff arbitrage savings."
        primary={{ label: 'Schedule a platform demo', to: '/request-consultation?service=software-iot' }}
        secondary={{ label: 'Explore EV charging infrastructure', to: '/services/ev-charging' }}
      />
    </>
  );
}
