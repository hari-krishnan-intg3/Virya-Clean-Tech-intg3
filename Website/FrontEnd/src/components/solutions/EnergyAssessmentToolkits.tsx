import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Building2,
  Truck,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Reveal } from '@/components/ui';

export function EnergyAssessmentToolkits() {
  const [activeKit, setActiveKit] = useState<'transformer' | 'rooftop' | 'evse' | 'diesel'>('transformer');

  // Toolkit 1: Transformer Headroom State
  const [transformerRatingKva, setTransformerRatingKva] = useState(1000);
  const [sanctionedDemandKva, setSanctionedDemandKva] = useState(800);
  const [peakDemandKva, setPeakDemandKva] = useState(620);
  const [voltageLevel, setVoltageLevel] = useState<'lt' | '11kv' | '33kv'>('11kv');

  // Transformer Headroom Calculations (typical safe loading limit ~80% of rating)
  const safeLoadingCapacityKva = transformerRatingKva * 0.85;
  const spareHeadroomKva = Math.max(0, safeLoadingCapacityKva - peakDemandKva);
  const spareHeadroomKw = Math.round(spareHeadroomKva * 0.9); // assuming 0.9 power factor
  const headroomPercentage = Math.round((spareHeadroomKva / transformerRatingKva) * 100);
  const isHeadroomCritical = headroomPercentage < 15;

  // Toolkit 2: Rooftop Suitability State
  const [roofType, setRoofType] = useState<'rcc' | 'peb' | 'curved' | 'asbestos'>('peb');
  const [usableAreaSqm, setUsableAreaSqm] = useState(2500);
  const [shadowObstructionPercent, setShadowObstructionPercent] = useState(10);

  // Rooftop Calculations
  const effectiveAreaSqm = usableAreaSqm * (1 - shadowObstructionPercent / 100);
  // Rigid TOPCon needs ~4.5 sqm/kWp, Flexible CIGS needs ~5.2 sqm/kWp (lighter weight)
  const recommendedTech =
    roofType === 'peb' || roofType === 'curved'
      ? {
          name: 'Lightweight Flexible CIGS Solar Mats',
          spec: '2.8 kg/m² load · Peel-and-stick · Zero roof penetrations',
          areaPerKwp: 5.2,
          suitability: 'High',
          badge: 'Zero Structural Risk',
        }
      : roofType === 'asbestos'
      ? {
          name: 'Ground-Mount or Roof Structure Overhaul Required',
          spec: 'Asbestos sheets cannot safely support framed arrays or maintenance foot traffic',
          areaPerKwp: 5.5,
          suitability: 'Restricted',
          badge: 'Safety Restriction',
        }
      : {
          name: 'Rigid Monocrystalline TOPCon (Framed)',
          spec: '22.5%+ efficiency · RCC ballasted non-penetrating mounting · 25-yr warranty',
          areaPerKwp: 4.5,
          suitability: 'Optimal',
          badge: 'Maximum Energy Yield',
        };
  const estimatedKwpCapacity = Math.round(effectiveAreaSqm / recommendedTech.areaPerKwp);
  const estimatedAnnualYieldMwh = Math.round((estimatedKwpCapacity * 1450) / 1000);

  // Toolkit 3: EV Charging Infrastructure Sizer State
  const [targetEvCount, setTargetEvCount] = useState(24);
  const [avgBatteryKwh, setAvgBatteryKwh] = useState(38); // e.g. LCV or fleet pack
  const [dwellWindowHours, setDwellWindowHours] = useState(4.0); // night charging window
  const diversityFactorPercent = 75; // % charging simultaneously

  // EVSE Sizing Calculations
  const totalFleetEnergyRequiredKwh = targetEvCount * avgBatteryKwh * 0.8; // assuming 80% daily recharge
  const requiredChargingPowerKw = Math.round(
    (totalFleetEnergyRequiredKwh / dwellWindowHours) * (diversityFactorPercent / 100)
  );
  const recommendedGuns = Math.ceil(targetEvCount * 0.7); // shared charging ratio
  const recommendedChargerType =
    dwellWindowHours <= 1.5
      ? 'High-Power DC Fast Chargers (60kW–120kW Dual-Gun)'
      : dwellWindowHours <= 4
      ? 'Fast DC Charging (30kW–60kW) with Automated Load Management'
      : 'AC Type-2 Smart Charging (7.4kW–22kW) with Overnight Sequencing';

  // Toolkit 4: Diesel Displacement State
  const [dgRatingKva, setDgRatingKva] = useState(500);
  const [monthlyDieselLitres, setMonthlyDieselLitres] = useState(3200);
  const dieselPriceInr = 94; // ₹/Litre

  // Diesel Calculations
  const monthlyDieselSpendInr = monthlyDieselLitres * dieselPriceInr;
  // Standard solar-BESS hybrid can substitute 70-85% of diesel run hours during outages
  const dieselDisplacedLitresAnnual = Math.round(monthlyDieselLitres * 12 * 0.78);
  const dieselCostSavedLakhsAnnual = (dieselDisplacedLitresAnnual * dieselPriceInr) / 100000;
  // Diesel fuel combustion emits ~2.68 kg CO2 per litre of diesel
  const scope1Co2AvoidedTons = Math.round((dieselDisplacedLitresAnnual * 2.68) / 1000);

  return (
    <section className="section bg-mist border-b border-line" id="assessment-toolkits">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">
            <span className="rule-accent" />
            Engineering Feasibility Toolkits
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            CleanTech Site Energy Assessment Toolkits
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Evaluate electrical transformer headroom, structural rooftop suitability, depot EV charging capacity, and diesel generator replacement prior to capital commitment.
          </p>
        </Reveal>

        {/* Kit Navigation Tabs */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4">
          <button
            type="button"
            onClick={() => setActiveKit('transformer')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeKit === 'transformer'
                ? 'bg-[#07130f] text-emerald-400 shadow-md'
                : 'bg-white text-ink-muted border border-line hover:border-emerald-300'
            }`}
          >
            <Zap className="h-4 w-4" />
            1. Transformer & HT Headroom
          </button>

          <button
            type="button"
            onClick={() => setActiveKit('rooftop')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeKit === 'rooftop'
                ? 'bg-[#07130f] text-emerald-400 shadow-md'
                : 'bg-white text-ink-muted border border-line hover:border-emerald-300'
            }`}
          >
            <Building2 className="h-4 w-4" />
            2. Rooftop Structural Screener
          </button>

          <button
            type="button"
            onClick={() => setActiveKit('evse')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeKit === 'evse'
                ? 'bg-[#07130f] text-emerald-400 shadow-md'
                : 'bg-white text-ink-muted border border-line hover:border-emerald-300'
            }`}
          >
            <Truck className="h-4 w-4" />
            3. EV Charging Infrastructure Sizer
          </button>

          <button
            type="button"
            onClick={() => setActiveKit('diesel')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeKit === 'diesel'
                ? 'bg-[#07130f] text-emerald-400 shadow-md'
                : 'bg-white text-ink-muted border border-line hover:border-emerald-300'
            }`}
          >
            <Fuel className="h-4 w-4" />
            4. Diesel Microgrid Auditor
          </button>
        </div>

        {/* ── KIT 1: TRANSFORMER HEADROOM ───────────────────────────────────────── */}
        {activeKit === 'transformer' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Substation & Electrical Inputs</h3>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Transformer Nameplate Rating</span>
                  <span className="font-mono text-emerald-700">{transformerRatingKva} kVA</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="5000"
                  step="250"
                  value={transformerRatingKva}
                  onChange={(e) => setTransformerRatingKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Contract Sanctioned Demand</span>
                  <span className="font-mono text-emerald-700">{sanctionedDemandKva} kVA</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max={transformerRatingKva}
                  step="50"
                  value={sanctionedDemandKva}
                  onChange={(e) => setSanctionedDemandKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Highest Recorded 15-Min Peak Demand</span>
                  <span className="font-mono text-emerald-700">{peakDemandKva} kVA</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max={sanctionedDemandKva}
                  step="25"
                  value={peakDemandKva}
                  onChange={(e) => setPeakDemandKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                  Interconnection Voltage Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['lt', '11kv', '33kv'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVoltageLevel(v)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                        voltageLevel === v
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-line bg-mist/60 text-ink-muted hover:border-emerald-300'
                      }`}
                    >
                      {v === 'lt' ? '415V LT' : v === '11kv' ? '11kV HT' : '33kV HT'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
                    Engineering Verdict
                  </span>
                  <h3 className="text-xl font-bold text-ink mt-1">Transformer Headroom Analysis</h3>
                </div>
                {isHeadroomCritical ? (
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                )}
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-line bg-mist/60 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-ink">Safe Usable Headroom</p>
                    <p className="text-[0.68rem] text-ink-muted">Available capacity before 85% thermal loading limit</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-xl font-extrabold text-emerald-700">{spareHeadroomKw} kW</p>
                    <p className="text-xs text-ink-muted">~{spareHeadroomKva} kVA spare</p>
                  </div>
                </div>

                <div className="rounded-xl border border-line bg-mist/60 p-4">
                  <p className="text-xs font-bold text-ink">CleanTech Integration Feasibility</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-ink-muted">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Rooftop Solar Integration: Up to <strong>{Math.min(spareHeadroomKw, sanctionedDemandKva)} kWp</strong> feasible without substation upgrade.</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>EV Fast Charging: Up to <strong>{Math.floor(spareHeadroomKw / 60)} x 60kW DC Dual-Gun bays</strong> supported under current headroom.</span>
                    </li>
                    {isHeadroomCritical && (
                      <li className="flex items-center gap-1.5 text-amber-700 font-semibold">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Transformer load margin is below 15%. Dynamic Load Balancing (DLB) or BESS buffer recommended to avoid breaker tripping.</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to={`/request-consultation?service=engineering&transformer=${transformerRatingKva}&headroom=${spareHeadroomKw}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Single Line Diagram (SLD) Audit
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── KIT 2: ROOFTOP STRUCTURAL SCREENER ─────────────────────────────────── */}
        {activeKit === 'rooftop' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Rooftop Physical Parameters</h3>

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                  Roof Structural Construction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'peb', label: 'PEB Metal Sheet' },
                    { id: 'rcc', label: 'RCC Concrete Slab' },
                    { id: 'curved', label: 'Curved Standing Seam' },
                    { id: 'asbestos', label: 'Asbestos / Aged Shed' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRoofType(r.id as any)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all text-left ${
                        roofType === r.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-line bg-mist/60 text-ink-muted hover:border-emerald-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Gross Usable Roof Footprint</span>
                  <span className="font-mono text-emerald-700">{usableAreaSqm.toLocaleString()} m² (~{(usableAreaSqm * 10.76).toLocaleString()} sq.ft)</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={usableAreaSqm}
                  onChange={(e) => setUsableAreaSqm(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Shadow & Parapet Obstruction Factor</span>
                  <span className="font-mono text-emerald-700">{shadowObstructionPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={shadowObstructionPercent}
                  onChange={(e) => setShadowObstructionPercent(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-white shadow-lg">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
                Structural Suitability Verdict
              </span>
              <h3 className="text-xl font-bold text-ink mt-1">Recommended Solar Architecture</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block rounded bg-emerald-700 text-white px-2 py-0.5 text-[0.68rem] font-bold uppercase mb-1">
                        {recommendedTech.badge}
                      </span>
                      <h4 className="font-bold text-base text-ink">{recommendedTech.name}</h4>
                      <p className="mt-1 text-xs text-ink-muted">{recommendedTech.spec}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Net Usable Capacity</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-emerald-700">
                      {estimatedKwpCapacity} kWp
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Estimated Annual Yield</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-ink">
                      {estimatedAnnualYieldMwh} MWh / yr
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to={`/request-consultation?service=solar&roof=${roofType}&area=${usableAreaSqm}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Roof Structural Load Screening
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── KIT 3: EV CHARGING SIZER ───────────────────────────────────────────── */}
        {activeKit === 'evse' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Depot Fleet Parameters</h3>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Number of Commercial EVs in Fleet</span>
                  <span className="font-mono text-emerald-700">{targetEvCount} Vehicles</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="120"
                  step="2"
                  value={targetEvCount}
                  onChange={(e) => setTargetEvCount(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Average Vehicle Battery Capacity</span>
                  <span className="font-mono text-emerald-700">{avgBatteryKwh} kWh</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="350"
                  step="5"
                  value={avgBatteryKwh}
                  onChange={(e) => setAvgBatteryKwh(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>3W Cargo: ~12kWh</span>
                  <span>LCVs: ~40kWh</span>
                  <span>Buses: 250–350kWh</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Target Dwell / Charging Window Available</span>
                  <span className="font-mono text-emerald-700">{dwellWindowHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="8.0"
                  step="0.25"
                  value={dwellWindowHours}
                  onChange={(e) => setDwellWindowHours(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-white shadow-lg">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
                Depot Sizing Recommendation
              </span>
              <h3 className="text-xl font-bold text-ink mt-1">Charging Architecture Output</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-line bg-mist/60 p-4">
                  <p className="text-xs text-ink-muted">Recommended EVSE Architecture</p>
                  <p className="mt-1 font-bold text-base text-ink">{recommendedChargerType}</p>
                  <p className="mt-1 text-xs text-emerald-700 font-semibold">
                    Requires approximately <strong>{recommendedGuns} charging points / dual-gun bays</strong>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Peak Connected Power</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-emerald-700">
                      {requiredChargingPowerKw} kW
                    </p>
                    <p className="text-[0.68rem] text-ink-faint">At {diversityFactorPercent}% concurrency</p>
                  </div>
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Daily Fleet Energy</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-ink">
                      {Math.round(totalFleetEnergyRequiredKwh)} kWh
                    </p>
                    <p className="text-[0.68rem] text-ink-faint">Per 24h operational cycle</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to={`/request-consultation?service=ev-charging&fleet=${targetEvCount}&power=${requiredChargingPowerKw}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Depot Single Line Diagram (SLD)
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── KIT 4: DIESEL DISPLACEMENT AUDITOR ─────────────────────────────────── */}
        {activeKit === 'diesel' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Diesel Generator Baseline</h3>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>DG Set Nameplate Rating</span>
                  <span className="font-mono text-emerald-700">{dgRatingKva} kVA</span>
                </div>
                <input
                  type="range"
                  min="125"
                  max="2000"
                  step="125"
                  value={dgRatingKva}
                  onChange={(e) => setDgRatingKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Monthly Diesel Fuel Consumption</span>
                  <span className="font-mono text-emerald-700">{monthlyDieselLitres.toLocaleString()} Litres / mo</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={monthlyDieselLitres}
                  onChange={(e) => setMonthlyDieselLitres(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <p className="mt-1 text-[0.68rem] text-ink-muted">
                  Monthly Diesel Bill: ₹{((monthlyDieselSpendInr) / 100000).toFixed(2)} Lakhs (@ ₹{dieselPriceInr}/L)
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-white shadow-lg">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-700">
                Clean Microgrid Audit Result
              </span>
              <h3 className="text-xl font-bold text-ink mt-1">Solar-BESS Diesel Displacement</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-ink">Annual Diesel Expenditure Avoided</p>
                    <p className="text-[0.68rem] text-ink-muted">Displaces {dieselDisplacedLitresAnnual.toLocaleString()} litres/yr</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-2xl font-extrabold text-emerald-700">
                      ₹{dieselCostSavedLakhsAnnual.toFixed(2)} Lakhs/yr
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Scope 1 CO2 Eliminated</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-ink">
                      {scope1Co2AvoidedTons} tCO2e/yr
                    </p>
                  </div>
                  <div className="rounded-xl border border-line bg-mist/60 p-3.5">
                    <p className="text-[0.68rem] uppercase font-bold text-ink-muted">Clean Power Substitution</p>
                    <p className="mt-1 font-mono text-xl font-extrabold text-emerald-700">
                      78% Substitution
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line">
                <Link
                  to={`/request-consultation?service=storage&dg=${dgRatingKva}&diesel=${monthlyDieselLitres}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Diesel Displacement Microgrid Audit
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
