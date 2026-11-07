import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Flame,
  Layers,
  Printer,
  Radio,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { DISCOM_TARIFFS } from '@/lib/roiCalculations';

export default function EbookReaderPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#07110f] text-white pt-24 pb-24 selection:bg-emerald-500 selection:text-white">
      {/* Sticky Top Reader Nav */}
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#07110f]/95 px-4 py-3 backdrop-blur print:hidden">
        <div className="shell max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/roi-calculator"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-emerald-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to ROI Calculator</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-xs text-white/50 font-mono">
              Virya CleanTech Special Report • 2026 Edition
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/40"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>
      </div>

      <article ref={contentRef} className="shell max-w-4xl mx-auto px-4 mt-8 print:mt-0 print:px-0">
        {/* Cover / Hero Header */}
        <header className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 via-[#0a1f1b] to-black p-8 sm:p-12 shadow-2xl relative overflow-hidden print:border-none print:p-0 print:bg-white print:text-black">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 print:text-emerald-800 print:border-emerald-700">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>OFFICIAL SPECIAL REPORT & TECHNICAL GUIDEBOOK</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white print:text-black">
              Empowering Clean Energy <span className="text-emerald-400 print:text-emerald-800">Independence</span>
            </h1>
            <p className="mt-3 text-base sm:text-xl text-white/80 font-medium print:text-slate-700">
              The 2026 Comprehensive Guide to Rooftop Solar, Solar Paai Flexible Mats, Sodium-ion BESS, PM Surya Ghar Subsidies, Commercial 40% AD, and 25-Year Compound Financial Engineering.
            </p>

            <div className="mt-8 pt-6 border-t border-white/10 print:border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60 print:text-slate-600">
              <div>
                <span className="block font-bold text-white print:text-black">Virya Clean Tech Advisory Group</span>
                <span>Bengaluru, Karnataka, India • contact@viryacleantech.com</span>
              </div>
              <div className="text-right">
                <span className="block font-mono text-emerald-400 print:text-emerald-800 font-bold">Edition: November 2026</span>
                <span>Document Ref: VCT-SPEC-REP-2026</span>
              </div>
            </div>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 backdrop-blur print:border-slate-200 print:bg-slate-50 print:text-black">
          <h2 className="text-lg font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-800 flex items-center gap-2">
            <Award className="h-5 w-5" />
            <span>Executive Summary</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 print:text-slate-700">
            India’s renewable energy landscape in 2026 represents a historic inflection point. Grid electricity tariffs across major state DISCOMs escalate at a compound annual growth rate (CAGR) of 4.8% to 6.2%, making conventional grid dependency an escalating operational liability. This technical guide outlines how homeowners and commercial enterprises achieve energy sovereignty while compounding capital returns through central schemes (PM Surya Ghar ₹78,000 DBT), state top-ups, commercial 40% Accelerated Depreciation, and breakthrough lightweight flexible solar mats (Solar Paai).
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 print:border-slate-300 print:bg-white">
              <span className="text-[0.65rem] text-white/50 print:text-slate-500 uppercase font-bold block">3 kW Residential</span>
              <p className="text-base sm:text-xl font-black text-emerald-400 print:text-emerald-800 mt-1">₹1 Lakh+ Savings</p>
              <span className="text-[0.6rem] text-white/60 print:text-slate-600">Year 1 Cashflow</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 print:border-slate-300 print:bg-white">
              <span className="text-[0.65rem] text-white/50 print:text-slate-500 uppercase font-bold block">Commercial AD</span>
              <p className="text-base sm:text-xl font-black text-sky-400 print:text-sky-800 mt-1">40% Tax Shield</p>
              <span className="text-[0.6rem] text-white/60 print:text-slate-600">Section 32 Write-Off</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 print:border-slate-300 print:bg-white">
              <span className="text-[0.65rem] text-white/50 print:text-slate-500 uppercase font-bold block">Compounding Math</span>
              <p className="text-base sm:text-xl font-black text-emerald-400 print:text-emerald-800 mt-1">+5% Yearly</p>
              <span className="text-[0.6rem] text-white/60 print:text-slate-600">Tariff Escalation</span>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3 print:border-slate-300 print:bg-white">
              <span className="text-[0.65rem] text-white/50 print:text-slate-500 uppercase font-bold block">Solar Paai</span>
              <p className="text-base sm:text-xl font-black text-amber-400 print:text-amber-800 mt-1">2.9 kg/m²</p>
              <span className="text-[0.6rem] text-white/60 print:text-slate-600">PEB Roof Friendly</span>
            </div>
          </div>
        </section>

        {/* Chapter 1 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 01
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              Indian Utility Economics & The 5% Compounding Tariff Curve
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 print:text-slate-700">
            A common flaw in rudimentary solar calculators is assuming a flat, unchanging electricity tariff over 25 years. In reality, state electricity regulatory commissions (SERCs) revise tariffs upward annually to account for coal transport inflation, cross-subsidy deficits, and grid modernization. Over the last decade, Indian residential and commercial electricity tariffs have grown at a compound annual rate of 4.8% to 6.2%.
          </p>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 text-xs text-white/90 print:bg-slate-100 print:text-slate-800 space-y-2">
            <strong className="text-emerald-300 print:text-emerald-800 block font-bold text-sm">
              The 5% Tariff Escalation Math Formula:
            </strong>
            <p className="font-mono bg-black/30 print:bg-white p-3 rounded-lg border border-white/10">
              Tariff(Year n) = Base Tariff × (1 + 0.05)^(n - 1)
            </p>
            <p>
              For example, a base commercial tariff of ₹9.50/kWh escalates to ₹15.47/kWh by Year 11 and ₹30.58/kWh by Year 25. A solar asset locked in today produces electricity at a Levelized Cost of Energy (LCOE) of approximately <strong>₹1.80 to ₹2.20/kWh</strong>, yielding accelerating profit margins each year.
            </p>
          </div>

          {/* Per Capita Analysis Box */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90 flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Per Capita Electricity Consumption Benchmarking</span>
            </h3>
            <p className="text-xs text-white/70 print:text-slate-700">
              India’s national per capita electricity consumption stands at approximately <strong>105 kWh/month (~1,255 kWh/person/year)</strong>. A typical urban household consuming 500 kWh/month across 4 members registers 125 kWh/person/month. Each person generates roughly <strong>1,029 kg of CO₂ emissions annually</strong> from grid electricity alone. Installing a 3 kW solar array completely zeroes this per capita operational carbon footprint.
            </p>
          </div>
        </section>

        {/* Chapter 2 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 02
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              Residential Solar & PM Surya Ghar: Muft Bijli Yojana
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 print:text-slate-700">
            Under the Prime Minister’s flagship initiative launched by the Ministry of New and Renewable Energy (MNRE), domestic residential consumers receive direct cash DBT subsidies transferred directly to their Aadhaar-linked bank accounts:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <span className="text-xs font-bold text-emerald-300 block">1 kW System</span>
              <p className="text-xl font-black text-white mt-1">₹30,000 DBT</p>
              <span className="text-[0.65rem] text-white/60">Homes consuming &lt;150 units/mo</span>
            </div>
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <span className="text-xs font-bold text-emerald-300 block">2 kW System</span>
              <p className="text-xl font-black text-white mt-1">₹60,000 DBT</p>
              <span className="text-[0.65rem] text-white/60">Homes consuming 150–300 units/mo</span>
            </div>
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/20 p-4 text-center ring-1 ring-emerald-400">
              <span className="text-xs font-bold text-emerald-300 block">3 kW to 10 kW System</span>
              <p className="text-xl font-black text-emerald-300 mt-1">₹78,000 DBT</p>
              <span className="text-[0.65rem] text-white/70 font-semibold">Maximum Central Cash Credit</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-white/80 space-y-1">
            <strong className="text-emerald-400 font-bold block">
              The Famous &quot;3 kW → ₹1 Lakh+ Savings&quot; Breakdown:
            </strong>
            <p>
              A 3 kW turnkey rooftop installation costs approximately ₹1,56,000. Receiving ₹78,000 in direct government cash subsidy cuts your net capital out-of-pocket to only ₹78,000. In Year 1, the 3 kW system produces ~4,350 kWh, offsetting approximately ₹34,000 to ₹50,000 in grid bills. Together, <strong>your first year direct financial benefit exceeds ₹1,12,000 to ₹1,28,000</strong> — paying off the majority of the investment within 14 to 18 months!
            </p>
          </div>
        </section>

        {/* Chapter 3 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 03
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              Solar Mat / Solar Paai (Flexible Ultralight CIGS Panels)
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 print:text-slate-700">
            For decades, commercial factories, PEB (Pre-Engineered Building) industrial sheds, curved roofs, and cold storage warehouses struggled with rigid glass panels because typical metal roofs can only support 10–15 kg/m² of dead load. Heavy rigid solar arrays (20–25 kg/m² with mounting structures) risked roof structural failure and roof penetration leaks.
          </p>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-300 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Solar Paai Engineering Specifications:</span>
              </span>
              <span className="text-[0.65rem] text-amber-400 font-mono">Peel & Stick Innovation</span>
            </div>
            <ul className="text-xs text-white/80 space-y-1.5 list-disc list-inside">
              <li><strong>Ultra-Lightweight:</strong> Only 2.9 kg/m² — less than 15% the weight of conventional glass-framed panels.</li>
              <li><strong>Zero Roof Penetration:</strong> Bonds seamlessly to metal standing seams, corrugated sheets, and membrane roofs using industrial 3M structural adhesive film.</li>
              <li><strong>High Aerodynamic Stability:</strong> Eliminates wind uplift vectors; rated for coastal hurricane zones up to 200 km/h.</li>
              <li><strong>Curved Flexibility:</strong> Bends up to a 0.5-meter radius for domes, silo structures, and arched PEB sheds.</li>
            </ul>
          </div>
        </section>

        {/* Chapter 4 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 04
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              Commercial & Industrial Energy Economics & Section 32 Tax Shield
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 print:text-slate-700">
            Commercial and industrial enterprises pay some of the highest electricity tariffs in the world (ranging from ₹8.25/kWh to ₹12.50/kWh). Under Section 32 of the Indian Income Tax Act, solar equipment qualifies for <strong>40% Accelerated Depreciation (AD)</strong> in Year 1:
          </p>

          <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 text-xs text-white/90 space-y-2">
            <strong className="text-sky-300 block font-bold text-sm">
              Tax Shield Calculation Example (100 kW System):
            </strong>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <span className="text-white/50 block text-[0.65rem]">Gross Turnkey CapEx</span>
                <span className="text-base font-bold text-white mt-0.5 block">₹52,00,000</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <span className="text-white/50 block text-[0.65rem]">40% AD Year 1 Write-Off</span>
                <span className="text-base font-bold text-sky-300 mt-0.5 block">₹20,80,000</span>
              </div>
              <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                <span className="text-white/50 block text-[0.65rem]">Direct Cash Tax Saved (26% Tax Rate)</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block">₹5,40,800</span>
              </div>
            </div>
            <p className="pt-2 text-[0.72rem] text-white/70">
              In addition, Green Energy Open Access (GEOA) regulations now permit commercial consumers with sanctioned loads as low as <strong>100 kW</strong> to procure clean solar power directly from private developers across state grids without prohibitive cross-subsidy surcharges.
            </p>
          </div>
        </section>

        {/* Chapter 5 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 05
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              Next-Gen Sodium-Ion Battery Storage (Sodium BESS)
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/80 print:text-slate-700">
            As renewable penetration accelerates, 24/7 captive reliability mandates Battery Energy Storage Systems (BESS). While Lithium Iron Phosphate (LFP) has dominated, Sodium-ion chemistry has emerged as the superior energy storage medium for India’s harsh climatic conditions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <strong className="text-emerald-400 font-bold block text-sm">Thermal Runaway Immunity</strong>
              <p className="text-white/70">
                Sodium cells withstand ambient operating temperatures from <strong>-20°C to +60°C</strong> without risk of fire or thermal runaway, eliminating the need for expensive HVAC chiller units required by lithium packs in Indian summer climates.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <strong className="text-emerald-400 font-bold block text-sm">Supply Chain Sovereignty</strong>
              <p className="text-white/70">
                Sodium is globally abundant, non-toxic, and free from critical mineral cartels (zero lithium, cobalt, or nickel dependence). Sodium packs deliver <strong>4,000+ deep discharge cycles</strong> at over 90% Depth of Discharge (DoD).
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 6 */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 06
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              EV Fleet Depots, Green Hydrogen & Telecom Towers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Zap className="h-5 w-5 text-emerald-400 mb-1" />
              <strong className="text-white block font-bold">EV Charging Depots</strong>
              <p className="text-white/70">
                Turnkey 60 kW to 360 kW dual-gun CCS2 DC fast charging nodes with dynamic cloud load balancing (OCPP 2.0.1) under the PM E-DRIVE scheme.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Flame className="h-5 w-5 text-emerald-400 mb-1" />
              <strong className="text-white block font-bold">Green Hydrogen Electrolyzers</strong>
              <p className="text-white/70">
                Pressurized PEM and Alkaline modular skids (50–200 Nm³/hr H₂) producing 99.999% purity hydrogen for industrial process heat and decarbonization.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-1">
              <Radio className="h-5 w-5 text-emerald-400 mb-1" />
              <strong className="text-white block font-bold">Solar Telecom Towers</strong>
              <p className="text-white/70">
                Hybrid Solar-BESS packages replacing diesel generators (DG sets) on cellular towers, reducing fuel theft and achieving 100% clean telecommunication uptime.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 7: Master Regulatory Matrix */}
        <section className="mt-12 space-y-4">
          <div className="flex items-center gap-3 border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
              CHAPTER 07
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white print:text-black">
              State-by-State Regulatory & Tariff Master Matrix (15 States)
            </h2>
          </div>
          <p className="text-sm text-white/80 print:text-slate-700">
            Below is the authoritative 2026 tariff comparison, state government subsidy top-ups, and net-metering regulations across major Indian states:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left text-[0.7rem] border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/90 font-bold border-b border-white/10 print:bg-slate-100 print:text-black">
                  <th className="py-2.5 px-3">State & Utility</th>
                  <th className="py-2.5 px-3">Residential Rate</th>
                  <th className="py-2.5 px-3">Commercial Rate</th>
                  <th className="py-2.5 px-3">Central + State DBT</th>
                  <th className="py-2.5 px-3">Key State Policy Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70 print:text-slate-800">
                {Object.entries(DISCOM_TARIFFS).map(([key, item]) => (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-bold text-white print:text-black">
                      {item.state} ({item.discom.split('/')[0]})
                    </td>
                    <td className="py-2 px-3 font-mono">₹{item.residentialAvgKwh.toFixed(2)}/kWh</td>
                    <td className="py-2 px-3 font-mono font-bold text-sky-400 print:text-sky-800">₹{item.commercialAvgKwh.toFixed(2)}/kWh</td>
                    <td className="py-2 px-3 font-mono font-bold text-emerald-400 print:text-emerald-800">
                      ₹{(item.govtScheme.centralSubsidyMaxInr + item.govtScheme.stateTopUpSubsidyInr).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3 text-[0.65rem]">{item.govtScheme.schemeSummary.slice(0, 85)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="mt-16 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-transparent p-8 text-center space-y-4 print:hidden">
          <Sparkles className="mx-auto h-8 w-8 text-emerald-400" />
          <h3 className="text-2xl font-black text-white">
            Ready to Engineer Your Clean Energy Independence?
          </h3>
          <p className="text-xs text-white/70 max-w-xl mx-auto">
            Use the Virya CleanTech interactive calculator to model your exact 25-year compounding ROI, verify your PM Surya Ghar subsidy, and generate a branded proposal today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/roi-calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/50"
            >
              <span>Launch ROI Calculator</span>
            </Link>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print Guide as PDF</span>
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
}
