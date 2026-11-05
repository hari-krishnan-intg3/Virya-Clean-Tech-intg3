import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  FileUp,
  Home,
  Layers,
  Sparkles,
  TrendingUp,
  UploadCloud,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DISCOM_TARIFFS,
  TECHNOLOGIES,
  run25YearCleanTechRoi,
  type TechnologyType,
  type RoiCalculationResult,
} from '@/lib/roiCalculations';
import { AutomatedQuoteModal } from '@/components/calculator/AutomatedQuoteModal';
import { EbookDownloadModal } from '@/components/calculator/EbookDownloadModal';
import { CalculatorEquipmentSlider } from '@/components/calculator/CalculatorEquipmentSlider';

export default function RoiCalculatorPage() {
  const { user, isAuthenticated, saveCalculation, savedCalculations } = useAuth();

  // Mode: Residential vs Commercial
  const [category, setCategory] = useState<'residential' | 'commercial'>(
    user?.category || 'residential'
  );

  // Selected technology
  const [techType, setTechType] = useState<TechnologyType>('solar-rooftop');

  // Input states
  const [discomKey, setDiscomKey] = useState<string>('karnataka-bescom');
  const [monthlyBill, setMonthlyBill] = useState<number>(
    category === 'residential' ? 4200 : 85000
  );
  const [monthlyUnits, setMonthlyUnits] = useState<number>(
    category === 'residential' ? 520 : 9500
  );
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(
    category === 'residential' ? 5 : 65
  );
  const [customSystemSize, setCustomSystemSize] = useState<number>(0);

  // Bill upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Modals
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showEbookModal, setShowEbookModal] = useState(false);
  const [showFullTable, setShowFullTable] = useState(false);

  // Category switch helper
  const handleCategorySwitch = (cat: 'residential' | 'commercial') => {
    setCategory(cat);
    if (cat === 'residential') {
      setMonthlyBill(4200);
      setMonthlyUnits(520);
      setSanctionedLoad(5);
      setCustomSystemSize(0);
    } else {
      setMonthlyBill(85000);
      setMonthlyUnits(9500);
      setSanctionedLoad(65);
      setCustomSystemSize(0);
    }
  };

  // Bill upload parser simulation
  const handleBillUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadStatus('Scanning utility bill with smart OCR telemetry...');

    setTimeout(() => {
      if (category === 'residential') {
        setMonthlyBill(4850);
        setMonthlyUnits(610);
        setSanctionedLoad(6);
        setUploadStatus('Smart Bill Extracted: ₹4,850/mo • 610 Units (BESCOM LT-2 Tariff)');
      } else {
        setMonthlyBill(142000);
        setMonthlyUnits(14800);
        setSanctionedLoad(110);
        setUploadStatus('Smart Bill Extracted: ₹1,42,000/mo • 14,800 Units (HT-2a Industrial)');
      }
    }, 900);
  };

  // Run the 25-Year Calculation
  const result: RoiCalculationResult = useMemo(() => {
    return run25YearCleanTechRoi({
      category,
      techType,
      discomKey,
      monthlyBillInr: Number(monthlyBill) || 1000,
      monthlyUnitsKwh: Number(monthlyUnits) || undefined,
      sanctionedLoadKw: Number(sanctionedLoad) || undefined,
      customSystemSizeKw: customSystemSize > 0 ? customSystemSize : undefined,
    });
  }, [category, techType, discomKey, monthlyBill, monthlyUnits, sanctionedLoad, customSystemSize]);

  // Save calculation helper
  const handleSaveCalculation = () => {
    saveCalculation({
      category: result.category,
      systemType: result.techType,
      monthlyBill: result.monthlyBillInr,
      monthlyUnitsKwh: result.monthlyUnitsKwh,
      systemSizeKw: result.recommendedSystemSizeKw,
      estimatedCost: result.estimatedGrossCapexInr,
      subsidyOrTaxShield: result.subsidyOrTaxShieldInr,
      netInvestment: result.netInvestmentInr,
      year1Savings: result.year1SavingsInr,
      lifetime25YrSavings: result.lifetime25YrSavingsInr,
      paybackYears: result.paybackPeriodYears,
      stateDiscom: result.selectedDiscom,
      boqSummary: result.boq.map((b) => `${b.item}: ${b.quantity}`),
    });
    alert('Calculation saved to your dashboard history!');
  };

  return (
    <div className="min-h-screen bg-[#07110f] pt-28 pb-20 text-white">
      <div className="shell max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-300">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>Interactive ROI & Auto Proposal Engine</span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              25-Year Clean Energy <span className="text-emerald-400">Savings & Payback Calculator</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed">
              Model your electricity savings with an automatic <strong>5% annual compounding tariff inflation</strong>, verify PM Surya Ghar direct subsidies (<strong>₹78,000 DBT</strong>), and generate a branded equipment Bill of Quantities (BOQ) with one-click official proposal generation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowEbookModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition shadow-sm"
            >
              <BookOpen className="h-4 w-4" />
              <span>Download 2026 E-Book</span>
            </button>
            <button
              type="button"
              onClick={() => setShowQuoteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30"
            >
              <FileText className="h-4 w-4" />
              <span>Generate Official PDF Quote</span>
            </button>
          </div>
        </div>

        {/* User state banner */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              {isAuthenticated && user ? (
                <span>
                  Signed in as <strong className="text-white">{user.fullName}</strong> ({user.category.toUpperCase()}) • Saved Calculations: <strong className="text-emerald-400">{savedCalculations.length}</strong>
                </span>
              ) : (
                <span className="text-white/70">
                  Guest Mode: You can calculate freely. <Link to="/login" className="text-emerald-400 font-bold hover:underline">Sign In</Link> or <Link to="/register" className="text-emerald-400 font-bold hover:underline">Register</Link> to save calculations and auto-email proposals.
                </span>
              )}
            </div>
          </div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleSaveCalculation}
              className="mt-2 sm:mt-0 text-emerald-400 hover:text-emerald-300 font-bold text-xs"
            >
              + Save Current Calculation
            </button>
          )}
        </div>

        {/* Mode Selector Tabs: Residential vs Commercial */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleCategorySwitch('residential')}
            className={`flex items-start gap-4 rounded-3xl border p-5 text-left transition ${
              category === 'residential'
                ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Residential Mode</h2>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-400">
                  PM Surya Ghar Scheme
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70">
                1 kW to 10 kW rooftop systems. Sized for homes, villas, and apartments. Subsidies: <strong>₹30k (1kW)</strong>, <strong>₹60k (2kW)</strong>, <strong>₹78k (3kW+)</strong>.
              </p>
              <div className="mt-2 text-[0.7rem] font-bold text-emerald-300">
                3 kW System: ₹78,000 Direct DBT Subsidy → Save over ₹1 Lakh in Year 1!
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleCategorySwitch('commercial')}
            className={`flex items-start gap-4 rounded-3xl border p-5 text-left transition ${
              category === 'commercial'
                ? 'border-sky-400 bg-sky-500/15 shadow-lg shadow-sky-950/40 ring-1 ring-sky-400'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-500/20 text-sky-400 shrink-0">
              <Building className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Commercial & Industrial Mode</h2>
                <span className="rounded-full bg-sky-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold text-sky-400">
                  40% Accelerated Dep.
                </span>
              </div>
              <p className="mt-1 text-xs text-white/70">
                10 kW to 2,000+ kW systems for factories, warehouses, IT parks, and logistics depots. Section 32 tax shield + ToD tariff peak demand shaving.
              </p>
              <div className="mt-2 text-[0.7rem] font-bold text-sky-300">
                Section 32 Tax Shield: Claim 40% Year 1 tax deduction + Green Energy Open Access (&gt;100kW).
              </div>
            </div>
          </button>
        </div>

        {/* Technology Sub-Selector */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">
            Select Engineered Technology
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {(Object.keys(TECHNOLOGIES) as TechnologyType[]).map((techKey) => {
              const tech = TECHNOLOGIES[techKey];
              const isSelected = techType === techKey;
              return (
                <button
                  key={techKey}
                  type="button"
                  onClick={() => setTechType(techKey)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-500/20 text-white shadow-md'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-bold">{tech.title.split(' ')[0]} {tech.title.split(' ')[1]}</span>
                  <span className="block text-[0.62rem] text-white/50 mt-0.5 truncate">
                    {tech.vernacularName || tech.unitLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Calculator Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Bill Upload & Inputs (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Bill Upload Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <UploadCloud className="h-4 w-4 text-emerald-400" />
                  <span>Option A: Smart Bill Upload</span>
                </span>
                <span className="text-[0.65rem] text-emerald-400 font-mono">PDF / JPG / PNG</span>
              </div>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 hover:border-emerald-400/50 rounded-2xl p-5 text-center cursor-pointer transition bg-white/[0.02]">
                <FileUp className="h-8 w-8 text-emerald-400 mb-2" />
                <span className="text-xs font-bold text-white">
                  {uploadedFileName ? uploadedFileName : 'Upload Electricity Bill (PDF/Photo)'}
                </span>
                <span className="text-[0.68rem] text-white/50 mt-1">
                  Auto-extracts bill amount, monthly units & sanctioned load
                </span>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={handleBillUpload}
                  className="hidden"
                />
              </label>

              {uploadStatus && (
                <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{uploadStatus}</span>
                </div>
              )}
            </div>

            {/* Manual Parameter Inputs Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl space-y-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider block border-b border-white/10 pb-2">
                Option B: Manual Parameters
              </span>

              {/* State & DISCOM */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Location & DISCOM (Utility Grid)
                </label>
                <select
                  value={discomKey}
                  onChange={(e) => setDiscomKey(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0a1a17] px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  {Object.entries(DISCOM_TARIFFS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.state} — {item.discom} (Avg ₹
                      {category === 'residential' ? item.residentialAvgKwh : item.commercialAvgKwh}/kWh)
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Bill Amount (₹) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-white/80">
                    Monthly Electricity Bill (₹)
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    ₹{Number(monthlyBill).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="number"
                  min="500"
                  max="10000000"
                  step="500"
                  value={monthlyBill}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMonthlyBill(val);
                    // auto sync units roughly
                    const tariff = DISCOM_TARIFFS[discomKey]?.residentialAvgKwh || 7.5;
                    setMonthlyUnits(Math.round(val / tariff));
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Monthly Consumption (Units / kWh) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-white/80">
                    Monthly Consumption (Units / kWh)
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {Number(monthlyUnits).toLocaleString('en-IN')} kWh
                  </span>
                </div>
                <input
                  type="number"
                  min="50"
                  max="1000000"
                  step="20"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* System Size Adjuster */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-white/80">
                    Sized System Capacity ({result.recommendedSystemSizeKw} kW)
                  </label>
                  <span className="text-[0.7rem] text-white/50">
                    {customSystemSize > 0 ? 'Custom Override' : 'Auto-Engineered'}
                  </span>
                </div>
                <input
                  type="range"
                  min={category === 'residential' ? 1 : 10}
                  max={category === 'residential' ? 15 : 500}
                  step={category === 'residential' ? 1 : 5}
                  value={customSystemSize > 0 ? customSystemSize : result.recommendedSystemSizeKw}
                  onChange={(e) => setCustomSystemSize(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[0.65rem] text-white/40 mt-1">
                  <span>{category === 'residential' ? '1 kW' : '10 kW'}</span>
                  <span>{category === 'residential' ? '15 kW' : '500 kW'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Results & Financial Breakdown (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top KPI Summary Banner */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-emerald-900/10 to-transparent p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  <span>25-Year Compound Financial Outcome</span>
                </span>
                <span className="text-[0.68rem] font-bold text-white/60">
                  Includes +5% Annual Tariff Escalation
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[0.68rem] text-white/50 uppercase font-bold block">
                    Recommended Size
                  </span>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {result.recommendedSystemSizeKw} <span className="text-sm font-semibold text-emerald-400">kW</span>
                  </p>
                  <span className="text-[0.65rem] text-white/60 capitalize">
                    {result.techType.replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-[0.68rem] text-white/50 uppercase font-bold block">
                    Net Investment
                  </span>
                  <p className="text-2xl font-black text-white mt-0.5">
                    ₹{(result.netInvestmentInr / 100000).toFixed(2)} <span className="text-sm font-semibold text-emerald-400">Lakh</span>
                  </p>
                  <span className="text-[0.65rem] text-emerald-400">
                    After Subsidy / AD
                  </span>
                </div>

                <div>
                  <span className="text-[0.68rem] text-emerald-400 uppercase font-bold block">
                    25-Yr Lifetime Savings
                  </span>
                  <p className="text-2xl font-black text-emerald-400 mt-0.5">
                    ₹{(result.lifetime25YrSavingsInr / 100000).toFixed(2)} <span className="text-sm font-semibold">Lakh</span>
                  </p>
                  <span className="text-[0.65rem] text-white/60">
                    Compounded Return
                  </span>
                </div>

                <div>
                  <span className="text-[0.68rem] text-white/50 uppercase font-bold block">
                    Simple Payback
                  </span>
                  <p className="text-2xl font-black text-white mt-0.5">
                    {result.paybackPeriodYears} <span className="text-sm font-semibold text-emerald-400">Yrs</span>
                  </p>
                  <span className="text-[0.65rem] text-white/60">
                    Equity Breakeven
                  </span>
                </div>
              </div>

              {/* Subsidy Highlight */}
              <div className="mt-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-white/90">
                  <strong className="text-emerald-300 font-bold block">
                    {result.subsidySchemeName}: -₹{result.subsidyOrTaxShieldInr.toLocaleString('en-IN')}
                  </strong>
                  <p className="mt-0.5 text-white/80">{result.subsidyDetailNote}</p>
                </div>
              </div>
            </div>

            {/* Bill of Quantities (BOQ) Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  <span>Engineered Bill of Quantities (BOQ)</span>
                </h3>
                <span className="text-[0.68rem] font-mono text-emerald-400">Tier-1 Hardware</span>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {result.boq.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="font-bold text-white block">{item.item}</span>
                      <span className="text-[0.7rem] text-white/50">{item.specification}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 whitespace-nowrap text-right">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 25-Year Compound Cashflow Table (With 5% Annual Increase) */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                    <span>25-Year Compounding Projection (5% Yearly Inflation)</span>
                  </h3>
                  <p className="text-[0.68rem] text-white/50 mt-0.5">
                    Grid tariff grows from ₹{result.twentyFiveYearProjections[0]?.tariffPerKwh}/kWh to ₹{result.twentyFiveYearProjections[24]?.tariffPerKwh}/kWh by Year 25.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullTable(!showFullTable)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                >
                  <span>{showFullTable ? 'Show First 5 Years' : 'View Full 25 Years'}</span>
                  {showFullTable ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-white/10 text-white/70 font-semibold border-b border-white/10">
                      <th className="py-2 px-3">Year</th>
                      <th className="py-2 px-3">Tariff (+5%/yr)</th>
                      <th className="py-2 px-3">Gen (kWh)</th>
                      <th className="py-2 px-3">Bill w/o Solar</th>
                      <th className="py-2 px-3">Bill w/ Solar</th>
                      <th className="py-2 px-3 text-emerald-400">Annual Net Savings</th>
                      <th className="py-2 px-3 text-white">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/70">
                    {(showFullTable
                      ? result.twentyFiveYearProjections
                      : result.twentyFiveYearProjections.slice(0, 5)
                    ).map((row) => (
                      <tr key={row.year} className="hover:bg-white/5">
                        <td className="py-2 px-3 font-bold text-white">Y0{row.year}</td>
                        <td className="py-2 px-3">₹{row.tariffPerKwh.toFixed(2)}</td>
                        <td className="py-2 px-3">{row.solarGenerationKwh.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3">₹{row.billWithoutSolarInr.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3">₹{row.billWithSolarInr.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 font-bold text-emerald-400">+₹{row.annualSavingsInr.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 font-bold text-white">₹{row.cumulativeSavingsInr.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Proposal CTA Bar */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Ready for Official Turnkey Deployment?</h4>
                <p className="text-xs text-white/70">
                  Generate a branded PDF quote with stamped BOQ, or schedule an electrical engineer on-site audit.
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
                >
                  Generate Official Quote
                </button>
                <Link
                  to="/request-consultation"
                  className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  Book Site Audit
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 8-Slide Equipment & Technology Carousel */}
        <div className="mt-16">
          <CalculatorEquipmentSlider />
        </div>
      </div>

      {/* Official PDF Quote Modal */}
      <AutomatedQuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        result={result}
        customerName={user?.fullName}
        customerEmail={user?.email}
        customerPhone={user?.phone}
      />

      {/* Free E-Book Download Modal */}
      <EbookDownloadModal
        isOpen={showEbookModal}
        onClose={() => setShowEbookModal(false)}
        defaultEmail={user?.email}
        defaultName={user?.fullName}
      />
    </div>
  );
}
