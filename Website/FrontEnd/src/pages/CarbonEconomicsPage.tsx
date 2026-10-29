import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scale,
  Coins,
  FileCheck,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { PageHero, CtaBand } from '@/components/sections/PageHero';
import { Reveal, SmartImage } from '@/components/ui';
import { CARBON_SLIDES, MACC_RANKING } from '@/data/carbonEconomics';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function CarbonEconomicsPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);

  // CBAM & Carbon Exposure Calculator State
  const [exportSector, setExportSector] = useState<'steel' | 'aluminum' | 'cement' | 'fertilizer'>('steel');
  const [annualExportTons, setAnnualExportTons] = useState(15000);
  const [emissionIntensity, setEmissionIntensity] = useState(1.85); // tCO2e / ton
  const [euEtsPrice, setEuEtsPrice] = useState(72); // EUR per tCO2e
  const [solarOffsetMwp, setSolarOffsetMwp] = useState(3.0); // MWp planned

  // Benchmarks by sector
  const SECTOR_BENCHMARKS = {
    steel: { name: 'Iron & Steel', euBenchmark: 1.35, defaultIntensity: 1.95, defaultTons: 15000 },
    aluminum: { name: 'Aluminum & Alloys', euBenchmark: 4.80, defaultIntensity: 7.20, defaultTons: 6000 },
    cement: { name: 'Cement & Clinker', euBenchmark: 0.65, defaultIntensity: 0.88, defaultTons: 40000 },
    fertilizer: { name: 'Fertilizers & Ammonia', euBenchmark: 1.60, defaultIntensity: 2.15, defaultTons: 12000 },
  };

  const handleSectorChange = (sector: 'steel' | 'aluminum' | 'cement' | 'fertilizer') => {
    setExportSector(sector);
    setEmissionIntensity(SECTOR_BENCHMARKS[sector].defaultIntensity);
    setAnnualExportTons(SECTOR_BENCHMARKS[sector].defaultTons);
  };

  // CBAM Calculation formulas
  // EUR to INR conversion rate approx ₹90
  const EUR_TO_INR = 90.5;
  const benchmark = SECTOR_BENCHMARKS[exportSector].euBenchmark;
  const excessEmissionsPerTon = Math.max(0, emissionIntensity - benchmark);
  const totalTaxableEmissions = annualExportTons * excessEmissionsPerTon;
  const grossCbamEuros = totalTaxableEmissions * euEtsPrice;
  const grossCbamInrCrores = (grossCbamEuros * EUR_TO_INR) / 10000000;

  // Solar offset potential: ~1,400 MWh per MWp/yr -> grid emission factor ~0.78 tCO2/MWh in India
  const annualSolarMwh = solarOffsetMwp * 1450;
  const annualCarbonAbated = annualSolarMwh * 0.78; // tCO2e / yr
  const mitigatedEmissions = Math.min(totalTaxableEmissions, annualCarbonAbated);
  const netCbamSavingsEuros = mitigatedEmissions * euEtsPrice;
  const netCbamSavingsInrCrores = (netCbamSavingsEuros * EUR_TO_INR) / 10000000;
  const residualCbamLiabilityCrores = Math.max(0, grossCbamInrCrores - netCbamSavingsInrCrores);

  return (
    <>
      <PageHero
        eyebrow="Carbon Economics & Decarbonization Finance"
        title={
          <>
            Turn carbon compliance into <span className="text-gradient">competitive advantage.</span>
          </>
        }
        description="Mitigate European CBAM import tariffs, participate in the Indian Carbon Market (CCTS), deliver audit-grade SEBI BRSR Core disclosures, and deploy capital-efficient clean energy architectures."
        primary={{ label: 'Request Carbon Audit', to: '/request-consultation?service=carbon-economics' }}
        secondary={{ label: 'Explore 8 Pillars', to: '/services' }}
        trail={[{ label: 'Home', to: '/' }, { label: 'Carbon Economics', to: '/carbon-economics' }]}
      />

      {/* ── Section 1: 8-Slide Interactive Carbon Economics Blueprint Carousel ─────────────────── */}
      <section className="section bg-[#07130f] text-white">
        <div className="shell">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
            <div className="max-w-2xl">
              <span className="eyebrow text-emerald-400">
                <span className="rule-accent bg-emerald-400" />
                Strategic Blueprint Slider
              </span>
              <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
                8 Pillars of Industrial Carbon Economics
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Explore the regulatory mechanisms, market trading schemes, and techno-economic frameworks shaping corporate decarbonization.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-xs text-ink-muted">
                Pillar {activeSlide + 1} of {CARBON_SLIDES.length}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous Slide"
                  onClick={() => swiperInstance?.slidePrev()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next Slide"
                  onClick={() => swiperInstance?.slideNext()}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={24}
              loop
              autoplay={{ delay: 7500, disableOnInteraction: false }}
              onSwiper={setSwiperInstance}
              onSlideChange={(s) => setActiveSlide(s.realIndex)}
              className="rounded-3xl"
            >
              {CARBON_SLIDES.map((slide, index) => (
                <SwiperSlide key={slide.id}>
                  <div className="grid lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-md">
                    <div className="lg:col-span-7">
                      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/60 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-300">
                        {slide.tag}
                      </div>

                      <h3 className="mt-4 text-2xl font-bold sm:text-3xl text-white">
                        {slide.title}
                      </h3>
                      <p className="mt-2 text-base font-semibold text-emerald-400">
                        {slide.headline}
                      </p>
                      <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink-muted">
                        {slide.description}
                      </p>

                      <div className="mt-8 grid grid-cols-3 gap-3">
                        {slide.metrics.map((m) => (
                          <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                            <p className="text-[0.68rem] uppercase font-bold text-ink-faint">{m.label}</p>
                            <p className="mt-1 text-sm sm:text-base font-extrabold text-white">{m.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                        <span className="text-ink-muted">
                          Governing Standard: <strong className="text-white">{slide.framework}</strong>
                        </span>
                        <Link
                          to="/request-consultation?service=carbon-economics"
                          className="inline-flex items-center gap-1.5 font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Request Advisory Review <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 shadow-2xl">
                        <SmartImage
                          src={slide.image}
                          alt={slide.title}
                          width={800}
                          height={600}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07130f]/80 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 rounded-md bg-[#07130f]/85 px-2.5 py-1 text-[0.68rem] font-mono text-emerald-300 border border-white/10">
                          {slide.tag} · Module 0{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ── Section 2: Interactive EU CBAM & Carbon Exposure Calculator ─────────────────────── */}
      <section className="section bg-white border-b border-line" id="cbam-calculator">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Financial Risk Assessment
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              EU CBAM Exposure & Decarbonization Savings Model
            </h2>
            <p className="mt-3 text-base text-ink-muted">
              Model your facility's financial exposure under the European Carbon Border Adjustment Mechanism (CBAM) and calculate the tariff savings achieved through captive solar PV and BESS deployment.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 items-start">
            {/* Input Controls */}
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">1. Export & Emissions Parameters</h3>

              {/* Sector selector */}
              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                  Select Export Sector
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['steel', 'aluminum', 'cement', 'fertilizer'] as const).map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleSectorChange(sec)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                        exportSector === sec
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-line bg-mist/60 text-ink-muted hover:border-emerald-300'
                      }`}
                    >
                      {SECTOR_BENCHMARKS[sec].name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Export Slider */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Annual Exports to EU</span>
                  <span className="font-mono text-emerald-700">{annualExportTons.toLocaleString()} Metric Tons</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={annualExportTons}
                  onChange={(e) => setAnnualExportTons(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>2,000 MT</span>
                  <span>100,000 MT</span>
                </div>
              </div>

              {/* Facility Emissions Intensity */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Facility Specific Emissions Intensity</span>
                  <span className="font-mono text-emerald-700">{emissionIntensity.toFixed(2)} tCO2e / MT</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.05"
                  value={emissionIntensity}
                  onChange={(e) => setEmissionIntensity(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>EU Default Benchmark: {benchmark} tCO2e/MT</span>
                  <span>High Blast Furnace: 2.4+</span>
                </div>
              </div>

              {/* EU ETS Carbon Price */}
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Forecasted EU ETS Carbon Price</span>
                  <span className="font-mono text-emerald-700">€{euEtsPrice} / tCO2e</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="120"
                  step="1"
                  value={euEtsPrice}
                  onChange={(e) => setEuEtsPrice(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>Current Floor: €50</span>
                  <span>2028-30 Projection: €120</span>
                </div>
              </div>

              {/* Planned Solar / RE Offset */}
              <div className="mt-6 pt-5 border-t border-line">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Captive Solar PV / Renewable Offset</span>
                  <span className="font-mono text-emerald-700">{solarOffsetMwp.toFixed(1)} MWp Capacity</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20.0"
                  step="0.5"
                  value={solarOffsetMwp}
                  onChange={(e) => setSolarOffsetMwp(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <p className="mt-1 text-[0.68rem] text-ink-muted">
                  Generates ~{(solarOffsetMwp * 1.45).toFixed(1)} million kWh/yr · Abates ~{Math.round(annualCarbonAbated).toLocaleString()} tCO2e/yr
                </p>
              </div>
            </div>

            {/* Financial Results Card */}
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-emerald-500/20 bg-gradient-to-br from-[#07130f] to-[#040e0b] text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                    Calculated Financial Impact
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">CBAM Liability & Offset Balance</h3>
                </div>
                <Scale className="h-6 w-6 text-emerald-400" />
              </div>

              <div className="mt-6 space-y-4">
                {/* Gross CBAM without Solar */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-ink-muted">Gross Annual CBAM Exposure (Baseline)</p>
                      <p className="text-[0.68rem] text-ink-faint">
                        {Math.round(totalTaxableEmissions).toLocaleString()} tCO2e above EU benchmark @ €{euEtsPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-red-400">
                        ₹{grossCbamInrCrores.toFixed(2)} Cr
                      </p>
                      <p className="font-mono text-xs text-ink-muted">
                        €{Math.round(grossCbamEuros).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tariff Savings via CleanTech Offset */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-emerald-300">Annual CBAM Tariff Savings via Solar Offset</p>
                      <p className="text-[0.68rem] text-emerald-400/80">
                        {Math.round(mitigatedEmissions).toLocaleString()} tCO2e verified abatement
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-extrabold text-emerald-400">
                        -₹{netCbamSavingsInrCrores.toFixed(2)} Cr/yr
                      </p>
                      <p className="font-mono text-xs text-emerald-300/80">
                        -€{Math.round(netCbamSavingsEuros).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Residual Liability */}
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-ink-muted">Residual Net CBAM Liability</p>
                      <p className="text-[0.68rem] text-ink-faint">Post on-site renewable reduction</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-lg font-bold text-amber-300">
                        ₹{residualCbamLiabilityCrores.toFixed(2)} Cr
                      </p>
                      <p className="text-[0.68rem] text-ink-muted">
                        {totalTaxableEmissions > 0
                          ? `${Math.round((mitigatedEmissions / totalTaxableEmissions) * 100)}% Tariff Reduction`
                          : 'Zero Exposure'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Executive Summary Takeaways */}
              <div className="mt-6 pt-5 border-t border-white/10 text-xs text-ink-muted space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Deploying {solarOffsetMwp} MWp captive solar recovers approximately <strong>₹{(netCbamSavingsInrCrores * 5).toFixed(1)} Crores</strong> in avoided European carbon levies over 5 years.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Avoids punitive EU default values by establishing verified 15-minute smart meter generation data.
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to={`/request-consultation?service=carbon-economics&sector=${exportSector}&offset=${solarOffsetMwp}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Plant-Specific CBAM Audit
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Marginal Abatement Cost Curve (MACC) Comparative Table ───────────────── */}
      <section className="section bg-mist">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Capital Prioritization
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Marginal Abatement Cost Curve (MACC) Ranking
            </h2>
            <p className="mt-3 text-base text-ink-muted">
              Negative abatement costs indicate that the clean technology generates higher lifetime electricity savings and diesel avoidance than its initial capital expenditure, paying for itself while reducing emissions.
            </p>
          </Reveal>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-card shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-line bg-mist/90 text-ink uppercase tracking-wider text-[0.68rem] font-bold">
                <tr>
                  <th className="p-4 sm:p-5">Clean Technology</th>
                  <th className="p-4 sm:p-5">Category</th>
                  <th className="p-4 sm:p-5">Abatement Cost (₹/tCO2e)</th>
                  <th className="p-4 sm:p-5">Abatement Potential</th>
                  <th className="p-4 sm:p-5">Capital Payback</th>
                  <th className="p-4 sm:p-5">Target Facility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink">
                {MACC_RANKING.map((item) => (
                  <tr key={item.technology} className="hover:bg-mist/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-ink">
                      {item.technology}
                    </td>
                    <td className="p-4 sm:p-5 text-ink-muted">
                      {item.category}
                    </td>
                    <td className="p-4 sm:p-5 font-mono font-bold">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs ${
                          item.abatementCost < 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {item.abatementCost < 0
                          ? `-₹${Math.abs(item.abatementCost).toLocaleString()}`
                          : `+₹${item.abatementCost.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 font-mono text-emerald-700 font-semibold">
                      {item.abatementPotential}
                    </td>
                    <td className="p-4 sm:p-5 text-ink-muted font-medium">
                      {item.payback}
                    </td>
                    <td className="p-4 sm:p-5 text-ink-faint text-xs">
                      {item.suitability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              Negative values indicate net economic profit per ton of carbon mitigated.
            </span>
            <Link to="/services" className="font-bold text-emerald-700 hover:underline">
              Explore Virya Engineering Offerings →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 4: 4 Compliance & Financing Pillars ───────────────────────────────────── */}
      <section className="section bg-white">
        <div className="shell">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">
              <span className="rule-accent" />
              Corporate Governance
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              From Compliance Mandates to Balance Sheet Value
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Indian Carbon Market (CCTS)',
                desc: 'BEE and CERC framework establishing emission intensity caps across 13 obligated sectors with tradable Carbon Credit Certificates (CCCs).',
                icon: ShieldCheck,
                badge: 'MoP / BEE',
              },
              {
                title: 'SEBI BRSR Core Assurance',
                desc: 'Mandatory reasonable assurance on Scope 1 and Scope 2 GHG footprints for India’s top 1000 listed entities backed by telemetry intervals.',
                icon: FileCheck,
                badge: 'SEBI ESG',
              },
              {
                title: 'Green Energy Open Access',
                desc: '100 kW minimum threshold allowing industrial consumers to contract captive solar and wind with 100% cross-subsidy surcharge waivers.',
                icon: Zap,
                badge: '100 kW Threshold',
              },
              {
                title: 'Zero-Capex RESCO / EaaS',
                desc: 'Off-balance-sheet energy service contracts with guaranteed generation SLAs, eliminating upfront capital risk for manufacturing facilities.',
                icon: Coins,
                badge: 'Off-Balance Sheet',
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.05} as="div">
                <div className="card h-full p-6 border border-line bg-card flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <card.icon className="h-6 w-6 text-emerald-600" />
                      <span className="rounded-full bg-mist px-2.5 py-0.5 text-[0.68rem] font-bold text-ink-muted border border-line">
                        {card.badge}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-ink">{card.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-line">
                    <Link
                      to="/request-consultation?service=carbon-economics"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Scope Requirements <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to model your facility’s carbon economics?"
        body="Schedule a technical working session with our carbon finance engineers to review your electrical single-line diagrams, discom tariffs, export volumes, and Scope 1 & 2 abatement potential."
        primary={{ label: 'Schedule Carbon Audit', to: '/request-consultation?service=carbon-economics' }}
        secondary={{ label: 'Explore Solutions', to: '/services' }}
      />
    </>
  );
}
