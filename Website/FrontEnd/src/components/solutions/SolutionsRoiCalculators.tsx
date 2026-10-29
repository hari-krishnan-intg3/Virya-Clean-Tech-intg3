import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  Truck,
  BatteryCharging,
  ArrowRight,
} from 'lucide-react';
import { Reveal } from '@/components/ui';

export function SolutionsRoiCalculators() {
  const [activeTab, setActiveTab] = useState<'solar' | 'ev' | 'bess'>('solar');

  // Solar ROI State
  const [solarCapacityKwp, setSolarCapacityKwp] = useState(250); // kWp
  const [gridTariffInr, setGridTariffInr] = useState(8.5); // ₹/kWh
  const [solarCapexPerKwp, setSolarCapexPerKwp] = useState(38000); // ₹/kWp
  const [hasAccDepreciation, setHasAccDepreciation] = useState(true);

  // Solar Calculations
  const totalSolarCapexLakhs = (solarCapacityKwp * solarCapexPerKwp) / 100000;
  const annualSolarGenerationKwh = solarCapacityKwp * 1450;
  const annualSolarSavingsLakhs = (annualSolarGenerationKwh * gridTariffInr) / 100000;
  // Year 1 Tax Shield with 40% AD @ 25% corporate tax rate = 10% capex refund in Year 1
  const taxShieldLakhs = hasAccDepreciation ? totalSolarCapexLakhs * 0.40 * 0.25 : 0;
  const netSolarInvestmentLakhs = totalSolarCapexLakhs - taxShieldLakhs;
  const solarPaybackYears = annualSolarSavingsLakhs > 0 ? (netSolarInvestmentLakhs / annualSolarSavingsLakhs).toFixed(1) : '0';
  const cumulative25YrSavingsCrores = ((annualSolarSavingsLakhs * 25 * 0.95 - totalSolarCapexLakhs) / 100).toFixed(2);
  const solarIrrPercent = (100 / Number(solarPaybackYears) + 2.5).toFixed(1);

  // EV Fleet ROI State
  const [fleetSize, setFleetSize] = useState(30);
  const [fleetClass, setFleetClass] = useState<'lcv' | '3w' | 'bus' | 'truck'>('lcv');
  const [dailyKmPerVehicle, setDailyKmPerVehicle] = useState(120);
  const [dieselPricePerKm, setDieselPricePerKm] = useState(11.5); // ₹/km for LCV
  const [evPricePerKm, setEvPricePerKm] = useState(2.8); // ₹/km for LCV

  const handleFleetClassChange = (fClass: 'lcv' | '3w' | 'bus' | 'truck') => {
    setFleetClass(fClass);
    if (fClass === '3w') {
      setDieselPricePerKm(4.2);
      setEvPricePerKm(0.85);
      setDailyKmPerVehicle(90);
    } else if (fClass === 'lcv') {
      setDieselPricePerKm(11.5);
      setEvPricePerKm(2.8);
      setDailyKmPerVehicle(120);
    } else if (fClass === 'bus') {
      setDieselPricePerKm(26.0);
      setEvPricePerKm(7.5);
      setDailyKmPerVehicle(180);
    } else if (fClass === 'truck') {
      setDieselPricePerKm(32.0);
      setEvPricePerKm(9.2);
      setDailyKmPerVehicle(250);
    }
  };

  // EV Calculations
  const dailyFuelDelta = (dieselPricePerKm - evPricePerKm) * dailyKmPerVehicle * fleetSize;
  const monthlyFuelSavingsInr = dailyFuelDelta * 26; // 26 operating days/month
  const annualFuelSavingsLakhs = (monthlyFuelSavingsInr * 12) / 100000;
  const annualMaintenanceSavingsLakhs = ((dailyKmPerVehicle * 312 * fleetSize * 1.8) / 100000); // ~₹1.8/km maintenance delta
  const totalAnnualEvSavingsLakhs = annualFuelSavingsLakhs + annualMaintenanceSavingsLakhs;
  // Estimated EVSE depot capex: ₹60,000 to ₹1,80,000 per vehicle bay depending on class
  const evseCapexPerVehicle = fleetClass === '3w' ? 25000 : fleetClass === 'lcv' ? 85000 : 350000;
  const totalEvseCapexLakhs = (fleetSize * evseCapexPerVehicle) / 100000;
  const evsePaybackMonths = totalAnnualEvSavingsLakhs > 0 ? Math.max(1, Math.round((totalEvseCapexLakhs / totalAnnualEvSavingsLakhs) * 12)) : 0;
  const annualCo2AbatedTons = Math.round((fleetSize * dailyKmPerVehicle * 312 * 0.22) / 1000);

  // BESS Arbitrage & Peak Shaving State
  const [bessCapacityKwh, setBessCapacityKwh] = useState(500); // kWh
  const [peakTariffInr, setPeakTariffInr] = useState(11.8); // ₹/kWh peak ToD
  const [offPeakTariffInr, setOffPeakTariffInr] = useState(4.5); // ₹/kWh off-peak
  const [contractDemandShavedKva, setContractDemandShavedKva] = useState(150); // kVA
  const [discomDemandChargePerKva, setDiscomDemandChargePerKva] = useState(480); // ₹/kVA/month

  // BESS Calculations
  const dailyArbitrageGain = bessCapacityKwh * 0.85 * (peakTariffInr - offPeakTariffInr); // 85% depth of discharge
  const monthlyArbitrageLakhs = (dailyArbitrageGain * 30) / 100000;
  const monthlyDemandSavingsLakhs = (contractDemandShavedKva * discomDemandChargePerKva) / 100000;
  const totalMonthlyBessBenefitLakhs = monthlyArbitrageLakhs + monthlyDemandSavingsLakhs;
  const annualBessBenefitLakhs = totalMonthlyBessBenefitLakhs * 12;
  const bessCapexLakhs = (bessCapacityKwh * 24000) / 100000; // ~₹24,000/kWh turnkey LFP BESS
  const bessPaybackYears = annualBessBenefitLakhs > 0 ? (bessCapexLakhs / annualBessBenefitLakhs).toFixed(1) : '0';

  return (
    <section className="section bg-white border-b border-line" id="roi-calculators">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">
            <span className="rule-accent" />
            Financial Engineering & Business Outcomes
          </p>
          <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
            Interactive CleanTech ROI & Payback Calculators
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Model capital payback periods, utility bill savings, demand charge arbitrage, and equity internal rate of return (IRR) across solar, fleet EV charging, and battery storage.
          </p>
        </Reveal>

        {/* Tab Switcher */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('solar')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'solar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-mist text-ink-muted hover:bg-mist/80'
            }`}
          >
            <Sun className="h-4 w-4" />
            Commercial Solar PV ROI
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ev')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'ev'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-mist text-ink-muted hover:bg-mist/80'
            }`}
          >
            <Truck className="h-4 w-4" />
            Fleet EV Electrification TCO
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bess')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'bess'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-mist text-ink-muted hover:bg-mist/80'
            }`}
          >
            <BatteryCharging className="h-4 w-4" />
            BESS Peak Shaving & Arbitrage
          </button>
        </div>

        {/* ── TAB 1: SOLAR PV CALCULATOR ────────────────────────────────────────── */}
        {activeTab === 'solar' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Commercial Solar Inputs</h3>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Target Solar System Capacity</span>
                  <span className="font-mono text-emerald-700">{solarCapacityKwp} kWp (~{(solarCapacityKwp * 4.5).toLocaleString()} m² roof)</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="25"
                  value={solarCapacityKwp}
                  onChange={(e) => setSolarCapacityKwp(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>50 kWp</span>
                  <span>2,000 kWp (2 MWp)</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Average Discom Electricity Tariff</span>
                  <span className="font-mono text-emerald-700">₹{gridTariffInr.toFixed(1)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="13.0"
                  step="0.1"
                  value={gridTariffInr}
                  onChange={(e) => setGridTariffInr(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>₹6.0/kWh (Subsidized HT)</span>
                  <span>₹13.0/kWh (Peak Commercial LT)</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Turnkey Capex Estimate</span>
                  <span className="font-mono text-emerald-700">₹{solarCapexPerKwp.toLocaleString()} / kWp</span>
                </div>
                <input
                  type="range"
                  min="32000"
                  max="48000"
                  step="1000"
                  value={solarCapexPerKwp}
                  onChange={(e) => setSolarCapexPerKwp(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[0.68rem] text-ink-faint">
                  <span>₹32k (High Scale Utility)</span>
                  <span>₹48k (Premium TOPCon / CIGS Mat)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-ink">Accelerated Depreciation (40%)</span>
                  <p className="text-[0.68rem] text-ink-muted">Apply Section 32 IT Act 40% Year 1 tax write-off</p>
                </div>
                <input
                  type="checkbox"
                  checked={hasAccDepreciation}
                  onChange={(e) => setHasAccDepreciation(e.target.checked)}
                  className="h-4 w-4 accent-emerald-600 rounded"
                />
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-emerald-500/20 bg-gradient-to-br from-[#07130f] to-[#040e0b] text-white shadow-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                Calculated Solar ROI & Yield
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Solar Financial Return Summary</h3>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-ink-muted">Annual Clean Generation</p>
                  <p className="mt-1 font-mono text-lg font-bold text-white">
                    {Math.round(annualSolarGenerationKwh).toLocaleString()} kWh
                  </p>
                  <p className="text-[0.68rem] text-emerald-400 mt-0.5">~{(annualSolarGenerationKwh / 100000).toFixed(1)} Lakh Units/yr</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-ink-muted">Annual Discom Bill Savings</p>
                  <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                    ₹{annualSolarSavingsLakhs.toFixed(2)} Lakhs/yr
                  </p>
                  <p className="text-[0.68rem] text-ink-faint mt-0.5">@ ₹{gridTariffInr}/kWh tariff</p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4">
                  <p className="text-xs text-emerald-300 font-bold">Simple Payback Period</p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-white">
                    {solarPaybackYears} Years
                  </p>
                  <p className="text-[0.68rem] text-emerald-400 mt-0.5">
                    {hasAccDepreciation ? 'With 40% Tax Shield' : 'Unsubsidized'}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-ink-muted">Equity IRR</p>
                  <p className="mt-1 font-mono text-2xl font-extrabold text-emerald-400">
                    {solarIrrPercent}%
                  </p>
                  <p className="text-[0.68rem] text-ink-faint mt-0.5">25-Year Cumulative: ₹{cumulative25YrSavingsCrores} Cr</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-ink-muted">
                <span>Total Net Investment: <strong className="text-white">₹{netSolarInvestmentLakhs.toFixed(2)} Lakhs</strong></span>
                <Link
                  to={`/request-consultation?service=solar&kwp=${solarCapacityKwp}`}
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Request Single Line Diagram →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: FLEET EV CALCULATOR ────────────────────────────────────────── */}
        {activeTab === 'ev' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Fleet Electrification Parameters</h3>

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-ink-muted block mb-2">
                  Select Fleet Vehicle Segment
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['3w', 'lcv', 'bus', 'truck'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => handleFleetClassChange(cls)}
                      className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                        fleetClass === cls
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-line bg-mist/60 text-ink-muted hover:border-emerald-300'
                      }`}
                    >
                      {cls === '3w' ? '3-Wheelers' : cls === 'lcv' ? 'LCVs' : cls === 'bus' ? 'Electric Buses' : 'Heavy Trucks'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Fleet Size (Vehicles)</span>
                  <span className="font-mono text-emerald-700">{fleetSize} Units</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Daily Distance Run per Vehicle</span>
                  <span className="font-mono text-emerald-700">{dailyKmPerVehicle} km / day</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="10"
                  value={dailyKmPerVehicle}
                  onChange={(e) => setDailyKmPerVehicle(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-line text-xs">
                <div>
                  <span className="text-ink-muted block">ICE Fuel Cost</span>
                  <span className="font-mono font-bold text-ink">₹{dieselPricePerKm}/km</span>
                </div>
                <div>
                  <span className="text-ink-muted block">EV Power Cost</span>
                  <span className="font-mono font-bold text-emerald-700">₹{evPricePerKm}/km</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-emerald-500/20 bg-gradient-to-br from-[#07130f] to-[#040e0b] text-white shadow-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                Fleet TCO & Operating Cost Delta
              </span>
              <h3 className="text-xl font-bold text-white mt-1">Fleet Electrification Economics</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-ink-muted">Monthly Operating Savings</p>
                    <p className="text-[0.68rem] text-ink-faint">Fuel delta + 38% reduced maintenance</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-lg font-bold text-emerald-400">
                      ₹{((monthlyFuelSavingsInr + (annualMaintenanceSavingsLakhs * 100000) / 12) / 100000).toFixed(2)} Lakhs/mo
                    </p>
                    <p className="text-[0.68rem] text-ink-muted">₹{(totalAnnualEvSavingsLakhs).toFixed(2)} Lakhs/yr</p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-emerald-300">Depot Charger Hardware Payback</p>
                    <p className="text-[0.68rem] text-emerald-400/80">Total EVSE Capex: ₹{totalEvseCapexLakhs.toFixed(2)} Lakhs</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-2xl font-extrabold text-white">{evsePaybackMonths} Months</p>
                    <p className="text-[0.68rem] text-emerald-400">Rapid Capex Recovery</p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-ink-muted">Scope 1 Tailpipe Carbon Avoided</p>
                    <p className="text-[0.68rem] text-ink-faint">Direct diesel combustion displaced</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-lg font-bold text-white">{annualCo2AbatedTons.toLocaleString()} tCO2e/yr</p>
                    <p className="text-[0.68rem] text-emerald-400">Audit-ready for BRSR</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to={`/request-consultation?service=ev-charging&fleet=${fleetSize}&type=${fleetClass}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request Depot Charging Electrical Design
                  <ArrowRight className="h-4 w-4 ml-1 inline" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: BESS PEAK SHAVING CALCULATOR ───────────────────────────────── */}
        {activeTab === 'bess' && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-6 card p-6 sm:p-8 border border-line bg-card">
              <h3 className="text-lg font-bold text-ink">Industrial BESS Inputs</h3>

              <div className="mt-5">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Battery Storage Capacity</span>
                  <span className="font-mono text-emerald-700">{bessCapacityKwh} kWh / {(bessCapacityKwh / 1000).toFixed(2)} MWh</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={bessCapacityKwh}
                  onChange={(e) => setBessCapacityKwh(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Peak Discom Time-of-Day Tariff</span>
                  <span className="font-mono text-emerald-700">₹{peakTariffInr.toFixed(1)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="8.0"
                  max="16.0"
                  step="0.2"
                  value={peakTariffInr}
                  onChange={(e) => setPeakTariffInr(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Off-Peak / Solar Charge Tariff</span>
                  <span className="font-mono text-emerald-700">₹{offPeakTariffInr.toFixed(1)} / kWh</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="6.0"
                  step="0.1"
                  value={offPeakTariffInr}
                  onChange={(e) => setOffPeakTariffInr(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>Peak Demand Contract Shaved</span>
                  <span className="font-mono text-emerald-700">{contractDemandShavedKva} kVA</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={contractDemandShavedKva}
                  onChange={(e) => setContractDemandShavedKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              <div className="mt-6">
                <div className="flex justify-between text-xs font-bold text-ink">
                  <span>DISCOM Demand Tariff Rate</span>
                  <span className="font-mono text-emerald-700">₹{discomDemandChargePerKva} / kVA / month</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="850"
                  step="10"
                  value={discomDemandChargePerKva}
                  onChange={(e) => setDiscomDemandChargePerKva(Number(e.target.value))}
                  className="mt-2 w-full accent-emerald-600"
                />
              </div>
              </div>
            </div>

            <div className="lg:col-span-6 card p-6 sm:p-8 border border-emerald-500/20 bg-gradient-to-br from-[#07130f] to-[#040e0b] text-white shadow-2xl">
              <span className="text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                Peak Shaving & Tariff Arbitrage Output
              </span>
              <h3 className="text-xl font-bold text-white mt-1">BESS Financial Value Model</h3>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-ink-muted">Monthly Demand Charge Savings</p>
                    <p className="text-[0.68rem] text-ink-faint">Peak shaving {contractDemandShavedKva} kVA off billing meter</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-lg font-bold text-emerald-400">₹{monthlyDemandSavingsLakhs.toFixed(2)} Lakhs/mo</p>
                    <p className="text-[0.68rem] text-ink-muted">₹{(monthlyDemandSavingsLakhs * 12).toFixed(2)} Lakhs/yr</p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-ink-muted">Daily Energy Arbitrage Gain</p>
                    <p className="text-[0.68rem] text-ink-faint">ToD spread: ₹{(peakTariffInr - offPeakTariffInr).toFixed(1)}/kWh delta</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-lg font-bold text-white">₹{Math.round(dailyArbitrageGain).toLocaleString()} / day</p>
                    <p className="text-[0.68rem] text-emerald-400">₹{(monthlyArbitrageLakhs * 12).toFixed(2)} Lakhs/yr</p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-emerald-300">BESS Simple Capital Payback</p>
                    <p className="text-[0.68rem] text-emerald-400/80">Turnkey Capex: ₹{bessCapexLakhs.toFixed(2)} Lakhs</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-2xl font-extrabold text-white">{bessPaybackYears} Years</p>
                    <p className="text-[0.68rem] text-emerald-400">6000 Cycle LFP Life (~15 Years)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  to={`/request-consultation?service=storage&capacity=${bessCapacityKwh}`}
                  className="btn-primary w-full text-center text-sm py-3"
                >
                  Request BESS Sizing & Protection Review
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
