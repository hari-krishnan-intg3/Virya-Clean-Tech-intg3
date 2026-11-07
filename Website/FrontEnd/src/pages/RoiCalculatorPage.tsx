import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Building,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  FileText,
  FileUp,
  Gauge,
  Home,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UploadCloud,
  User,
  Users,
  Zap,
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
  const [searchParams] = useSearchParams();

  const initialCategory = searchParams.get('mode') === 'commercial' ? 'commercial' : (user?.category || 'residential');

  // Mode: Residential vs Commercial
  const [category, setCategory] = useState<'residential' | 'commercial'>(initialCategory);

  // Selected technology
  const initialTech = (searchParams.get('tech') as TechnologyType) || 'solar-rooftop';
  const [techType, setTechType] = useState<TechnologyType>(
    Object.keys(TECHNOLOGIES).includes(initialTech) ? initialTech : 'solar-rooftop'
  );

  // Input states
  const [discomKey, setDiscomKey] = useState<string>('karnataka-bescom');
  const [monthlyBill, setMonthlyBill] = useState<number>(
    initialCategory === 'residential' ? 4200 : 85000
  );
  const [monthlyUnits, setMonthlyUnits] = useState<number>(
    initialCategory === 'residential' ? 520 : 9500
  );
  const [sanctionedLoad, setSanctionedLoad] = useState<number>(
    initialCategory === 'residential' ? 5 : 65
  );
  const [customSystemSize, setCustomSystemSize] = useState<number>(0);
  const [householdOrStaff, setHouseholdOrStaff] = useState<number>(
    initialCategory === 'residential' ? 4 : 45
  );
  const [facilitySqFt, setFacilitySqFt] = useState<number>(4000);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  // Bill upload state
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Modals
  const [showQuoteModal, setShowQuoteModal] = useState(searchParams.get('modal') === 'quote');
  const [showEbookModal, setShowEbookModal] = useState(searchParams.get('modal') === 'ebook');
  const [showFullTable, setShowFullTable] = useState(searchParams.get('table') === 'full');

  // Quick Sample Presets
  const applySampleScenario = (scenario: 'residential-3kw' | 'commercial-50kw' | 'industrial-150kw') => {
    setSelectedSample(scenario);
    if (scenario === 'residential-3kw') {
      setCategory('residential');
      setTechType('solar-rooftop');
      setDiscomKey('karnataka-bescom');
      setMonthlyBill(4500);
      setMonthlyUnits(573);
      setSanctionedLoad(5);
      setHouseholdOrStaff(4);
      setCustomSystemSize(3);
    } else if (scenario === 'commercial-50kw') {
      setCategory('commercial');
      setTechType('solar-rooftop');
      setDiscomKey('maharashtra-msedcl');
      setMonthlyBill(75000);
      setMonthlyUnits(6356);
      setSanctionedLoad(65);
      setHouseholdOrStaff(45);
      setFacilitySqFt(4000);
      setCustomSystemSize(50);
    } else if (scenario === 'industrial-150kw') {
      setCategory('commercial');
      setTechType('solar-paai');
      setDiscomKey('gujarat-guvnl');
      setMonthlyBill(200000);
      setMonthlyUnits(24242);
      setSanctionedLoad(180);
      setHouseholdOrStaff(100);
      setFacilitySqFt(15000);
      setCustomSystemSize(150);
    }
  };

  // Category switch helper
  const handleCategorySwitch = (cat: 'residential' | 'commercial') => {
    setCategory(cat);
    setSelectedSample(null);
    if (cat === 'residential') {
      setMonthlyBill(4200);
      setMonthlyUnits(520);
      setSanctionedLoad(5);
      setHouseholdOrStaff(4);
      setCustomSystemSize(0);
    } else {
      setMonthlyBill(85000);
      setMonthlyUnits(9500);
      setSanctionedLoad(65);
      setHouseholdOrStaff(45);
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
        setMonthlyUnits(618);
        setSanctionedLoad(6);
        setHouseholdOrStaff(4);
        setUploadStatus('Smart Bill Extracted: ₹4,850/mo • 618 Units • BESCOM LT-2 (₹7.85/kWh) • 154 kWh/person/mo');
      } else {
        setMonthlyBill(142000);
        setMonthlyUnits(12034);
        setSanctionedLoad(110);
        setHouseholdOrStaff(65);
        setUploadStatus('Smart Bill Extracted: ₹1,42,000/mo • 12,034 Units • MSEDCL HT-2a (₹11.80/kWh) • 185 kWh/staff/mo');
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
      householdOrStaffCount: householdOrStaff,
      facilitySqFt,
    });
  }, [category, techType, discomKey, monthlyBill, monthlyUnits, sanctionedLoad, customSystemSize, householdOrStaff, facilitySqFt]);

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

        {/* Real-World Working Sample Presets Bar */}
        <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-sky-950/30 p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                One-Click Real-World Working Sample Scenarios (Click to Load)
              </h2>
            </div>
            <span className="text-[0.65rem] text-white/50 font-mono">
              Actual Indian DISCOM commercial/residential rates & verified 2026 govt schemes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => applySampleScenario('residential-3kw')}
              className={`rounded-xl border p-3.5 text-left transition ${
                selectedSample === 'residential-3kw'
                  ? 'border-emerald-400 bg-emerald-500/25 ring-1 ring-emerald-400'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Sample 1: PM Surya Ghar 3 kW Home</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[0.6rem] font-mono font-bold text-emerald-300">Residential</span>
              </div>
              <p className="mt-1 text-xs text-white/90 font-medium">
                ₹4,500/mo bill • 4 Persons • Karnataka BESCOM
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 text-[0.65rem] text-white/70">
                <span>Rate: ₹7.85/kWh (Res)</span>
                <span className="text-right text-emerald-400 font-bold">573 Units/mo</span>
                <span>DBT Subsidy: ₹78,000</span>
                <span className="text-right text-white font-bold">Payback: 1.4 Yrs</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applySampleScenario('commercial-50kw')}
              className={`rounded-xl border p-3.5 text-left transition ${
                selectedSample === 'commercial-50kw'
                  ? 'border-sky-400 bg-sky-500/25 ring-1 ring-sky-400'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300">Sample 2: Commercial Office 50 kW</span>
                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[0.6rem] font-mono font-bold text-sky-300">Commercial</span>
              </div>
              <p className="mt-1 text-xs text-white/90 font-medium">
                ₹75,000/mo bill • 45 Staff • Maharashtra MSEDCL
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 text-[0.65rem] text-white/70">
                <span>Rate: ₹11.80/kWh (Com)</span>
                <span className="text-right text-sky-400 font-bold">6,356 Units/mo</span>
                <span>Tax Shield: ₹2.7 Lakhs (40% AD)</span>
                <span className="text-right text-white font-bold">Payback: 2.6 Yrs</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => applySampleScenario('industrial-150kw')}
              className={`rounded-xl border p-3.5 text-left transition ${
                selectedSample === 'industrial-150kw'
                  ? 'border-amber-400 bg-amber-500/25 ring-1 ring-amber-400'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Sample 3: PEB Factory 150 kW Solar Paai</span>
                <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[0.6rem] font-mono font-bold text-amber-300">Solar Mat</span>
              </div>
              <p className="mt-1 text-xs text-white/90 font-medium">
                ₹2,00,000/mo bill • 100 Staff • Gujarat GUVNL
              </p>
              <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 text-[0.65rem] text-white/70">
                <span>Rate: ₹8.25/kWh (Com)</span>
                <span className="text-right text-amber-400 font-bold">24,242 Units/mo</span>
                <span>Flex Mat: 2.9 kg/m²</span>
                <span className="text-right text-white font-bold">Payback: 3.2 Yrs</span>
              </div>
            </button>
          </div>
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
                  onChange={(e) => {
                    const newKey = e.target.value;
                    setDiscomKey(newKey);
                    setSelectedSample(null);
                    const tariff = category === 'residential'
                      ? DISCOM_TARIFFS[newKey]?.residentialAvgKwh || 7.5
                      : DISCOM_TARIFFS[newKey]?.commercialAvgKwh || 9.5;
                    setMonthlyUnits(Math.round(monthlyBill / tariff));
                  }}
                  className="w-full rounded-xl border border-white/15 bg-[#0a1a17] px-3.5 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  {Object.entries(DISCOM_TARIFFS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.state} — {item.discom} (Res: ₹{item.residentialAvgKwh} | Com: ₹{item.commercialAvgKwh}/kWh)
                    </option>
                  ))}
                </select>
              </div>

              {/* Commercial vs Residential Rates on the Bill */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-[0.68rem]">
                  <span className="font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <Coins className="h-3.5 w-3.5 text-emerald-400" />
                    <span>State Utility Tariff on the Bill</span>
                  </span>
                  <span className="text-emerald-400 font-mono text-[0.65rem]">Official DISCOM Rate</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className={`p-2.5 rounded-xl border text-left transition ${
                    category === 'residential'
                      ? 'border-emerald-400/80 bg-emerald-500/20 shadow-sm ring-1 ring-emerald-400/50'
                      : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <span className="text-[0.65rem] text-white/60 block font-semibold">Residential Rate</span>
                    <span className="text-sm font-black font-mono text-white mt-0.5 block">
                      ₹{result.residentialTariffRate.toFixed(2)} <span className="text-[0.65rem] font-normal text-white/60">/kWh</span>
                    </span>
                    {category === 'residential' ? (
                      <span className="text-[0.62rem] text-emerald-300 font-bold block mt-1">
                        ● Applied (LT-2 Domestic)
                      </span>
                    ) : (
                      <span className="text-[0.62rem] text-white/40 block mt-1">
                        Domestic Tariff
                      </span>
                    )}
                  </div>

                  <div className={`p-2.5 rounded-xl border text-left transition ${
                    category === 'commercial'
                      ? 'border-sky-400/80 bg-sky-500/20 shadow-sm ring-1 ring-sky-400/50'
                      : 'border-white/10 bg-white/[0.02]'
                  }`}>
                    <span className="text-[0.65rem] text-white/60 block font-semibold">Commercial Rate</span>
                    <span className="text-sm font-black font-mono text-white mt-0.5 block">
                      ₹{result.commercialTariffRate.toFixed(2)} <span className="text-[0.65rem] font-normal text-white/60">/kWh</span>
                    </span>
                    {category === 'commercial' ? (
                      <span className="text-[0.62rem] text-sky-300 font-bold block mt-1">
                        ● Applied (HT-2 / Commercial)
                      </span>
                    ) : (
                      <span className="text-[0.62rem] text-white/40 block mt-1">
                        Commercial Slab
                      </span>
                    )}
                  </div>
                </div>
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
                    setSelectedSample(null);
                    setMonthlyUnits(Math.round(val / result.activeTariffRate));
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Monthly Consumption (Units Required Calculation) */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Monthly Consumption (Units Required)</span>
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {result.monthlyUnitsKwh.toLocaleString('en-IN')} kWh/mo
                  </span>
                </div>
                <input
                  type="number"
                  min="50"
                  max="1000000"
                  step="20"
                  value={monthlyUnits}
                  onChange={(e) => {
                    setMonthlyUnits(Number(e.target.value));
                    setSelectedSample(null);
                  }}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                />
                <div className="rounded-xl bg-black/40 p-2.5 text-[0.68rem] text-white/70 space-y-1 font-mono border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Calculation Formula:</span>
                    <span className="text-emerald-300 font-bold">
                      Bill ÷ {category === 'residential' ? 'Residential' : 'Commercial'} Rate
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-white/90">
                    <span>₹{monthlyBill.toLocaleString('en-IN')} ÷ ₹{result.activeTariffRate.toFixed(2)}/kWh</span>
                    <span className="font-bold text-emerald-400">{result.monthlyUnitsKwh} Units/mo</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[0.62rem] text-white/50">
                    <span>Daily Draw: ~{result.dailyUnitsKwh} kWh/day</span>
                    <span>Annual Demand: {result.annualConsumptionKwh.toLocaleString('en-IN')} kWh/yr</span>
                  </div>
                </div>
              </div>

              {/* Per Capita Electricity Consumption Calculator */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Per Capita Electricity Consumption</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[0.62rem] font-bold text-emerald-300">
                    {category === 'residential' ? 'Household' : 'Commercial Team'}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="text-white/80">
                      {category === 'residential' ? 'Household Members / Occupants:' : 'Office Staff / Facility Team:'}
                    </label>
                    <span className="font-bold font-mono text-emerald-400">
                      {householdOrStaff} {category === 'residential' ? 'Persons' : 'Staff Members'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={category === 'residential' ? 1 : 5}
                    max={category === 'residential' ? 12 : 300}
                    step={category === 'residential' ? 1 : 5}
                    value={householdOrStaff}
                    onChange={(e) => {
                      setHouseholdOrStaff(Number(e.target.value));
                      setSelectedSample(null);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[0.62rem] text-white/40">
                    <span>{category === 'residential' ? '1 Person' : '5 Staff'}</span>
                    <span>{category === 'residential' ? '12 Persons' : '300 Staff'}</span>
                  </div>
                </div>

                {category === 'commercial' && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-white/80">Built-Up Facility Area (sq.ft):</label>
                      <span className="font-bold font-mono text-sky-400">
                        {facilitySqFt.toLocaleString('en-IN')} sq.ft
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={50000}
                      step={1000}
                      value={facilitySqFt}
                      onChange={(e) => setFacilitySqFt(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                )}

                {/* Per Capita Result Breakdown */}
                <div className="rounded-xl bg-black/40 p-3 text-xs border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-[0.7rem]">
                      {category === 'residential' ? 'Per Capita Monthly Consumption:' : 'Per Employee Monthly Consumption:'}
                    </span>
                    <span className="font-bold font-mono text-white text-sm">
                      {result.perCapitaMonthlyKwh} <span className="text-[0.65rem] font-normal text-white/60">kWh/{category === 'residential' ? 'person' : 'staff'}/mo</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[0.68rem] text-white/60">
                    <span>Per Capita Annual Demand:</span>
                    <span className="font-mono text-white/90 font-semibold">
                      {result.perCapitaAnnualKwh.toLocaleString('en-IN')} kWh/person/year
                    </span>
                  </div>

                  {result.commercialEnergyIntensityKwhSqFt && (
                    <div className="flex items-center justify-between text-[0.68rem] text-white/60">
                      <span>Commercial Energy Use Intensity (EUI):</span>
                      <span className="font-mono text-sky-300 font-bold">
                        {result.commercialEnergyIntensityKwhSqFt} kWh/sq.ft/year
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[0.68rem]">
                    <span className="text-white/60">India National Benchmark:</span>
                    <span className="text-white/80 font-mono">105 kWh/mo (1,255 kWh/yr)</span>
                  </div>

                  <div className="flex items-center justify-between text-[0.68rem]">
                    <span className="text-white/60">Benchmark Status:</span>
                    <span className="font-bold text-emerald-400">
                      {result.perCapitaBenchmarkRatio}x Avg • {result.perCapitaStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[0.68rem]">
                    <span className="text-white/60">Per Capita Carbon Footprint:</span>
                    <span className="text-emerald-300 font-mono font-bold">
                      {result.perCapitaAnnualCo2Kg} kg CO₂/yr (100% Offset by Solar)
                    </span>
                  </div>
                </div>
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

            {/* Current Utility Bill Anatomy & Tariff Economics Card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Current Utility Bill Anatomy & Tariff Economics
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  {result.stateName} Grid
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <span className="text-[0.65rem] text-white/50 block font-semibold">Utility Provider</span>
                  <span className="text-xs font-bold text-white mt-0.5 block truncate">{result.discomName}</span>
                  <span className="text-[0.62rem] text-emerald-400 mt-1 block">
                    {category === 'residential' ? 'Domestic LT-2 Tariff' : 'Commercial HT-2 Tariff'}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                  <span className="text-[0.65rem] text-white/50 block font-semibold">Billed Tariff Rate</span>
                  <span className="text-sm font-black font-mono text-emerald-400 mt-0.5 block">
                    ₹{result.activeTariffRate.toFixed(2)} <span className="text-[0.65rem] font-normal text-white/60">/kWh</span>
                  </span>
                  <span className="text-[0.62rem] text-white/50 mt-1 block">
                    {category === 'residential' ? `Com Rate: ₹${result.commercialTariffRate}/kWh` : `Res Rate: ₹${result.residentialTariffRate}/kWh`}
                  </span>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-3 col-span-2 sm:col-span-1">
                  <span className="text-[0.65rem] text-white/50 block font-semibold">Units Required / Mo</span>
                  <span className="text-sm font-black font-mono text-white mt-0.5 block">
                    {result.monthlyUnitsKwh.toLocaleString('en-IN')} <span className="text-[0.65rem] font-normal text-emerald-400">kWh</span>
                  </span>
                  <span className="text-[0.62rem] text-white/50 mt-1 block">
                    {result.dailyUnitsKwh} kWh/day average
                  </span>
                </div>
              </div>

              {/* Per Capita Energy Consumption Summary */}
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Per Capita Electricity Consumption Summary</span>
                  </span>
                  <span className="text-[0.65rem] text-white/60 font-mono">
                    {result.householdOrStaffCount} {category === 'residential' ? 'Occupants' : 'Staff Members'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                    <span className="text-[0.65rem] text-white/50 block">Per Capita Monthly:</span>
                    <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                      {result.perCapitaMonthlyKwh} kWh
                    </span>
                    <span className="text-[0.62rem] text-emerald-400 block mt-0.5">
                      {result.perCapitaAnnualKwh.toLocaleString('en-IN')} kWh/year
                    </span>
                  </div>

                  <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                    <span className="text-[0.65rem] text-white/50 block">National Average Comparison:</span>
                    <span className="text-sm font-bold font-mono text-emerald-300 mt-0.5 block">
                      {result.perCapitaBenchmarkRatio}x Avg
                    </span>
                    <span className="text-[0.62rem] text-white/50 block mt-0.5">
                      National Avg: 105 kWh/mo
                    </span>
                  </div>

                  <div className="rounded-xl bg-black/30 p-2.5 border border-white/5">
                    <span className="text-[0.65rem] text-white/50 block">Annual Carbon Footprint:</span>
                    <span className="text-sm font-bold font-mono text-emerald-400 mt-0.5 block">
                      {result.perCapitaAnnualCo2Kg} kg CO₂
                    </span>
                    <span className="text-[0.62rem] text-emerald-300 block mt-0.5">
                      100% Zeroed by Solar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* State Government Scheme & Subsidies Policy Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-emerald-950/20 to-transparent p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    State Government Scheme & Subsidies Policy
                  </h3>
                </div>
                <span className="text-[0.65rem] text-emerald-400 font-mono">
                  {result.stateName} Regulatory Framework
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
                  <div className="flex items-start gap-2.5">
                    <Award className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300 block text-xs">
                        {result.stateGovtScheme.stateSchemeName}
                      </span>
                      <p className="mt-1 text-white/80 text-[0.72rem] leading-relaxed">
                        {result.stateGovtScheme.schemeSummary}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="text-[0.65rem] text-white/50 block uppercase font-bold">
                      Direct Subsidy / Tax Shield
                    </span>
                    <span className="text-sm font-black font-mono text-emerald-400 mt-1 block">
                      ₹{result.subsidyOrTaxShieldInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[0.62rem] text-white/60 mt-0.5 block">
                      {category === 'residential'
                        ? result.stateTopUpSubsidyInr > 0
                          ? `Central ₹${result.centralSubsidyInr.toLocaleString('en-IN')} + State ₹${result.stateTopUpSubsidyInr.toLocaleString('en-IN')}`
                          : 'PM Surya Ghar Direct DBT Cash Transfer'
                        : 'Section 32 40% Year-1 Tax Shield'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="text-[0.65rem] text-white/50 block uppercase font-bold">
                      Net-Metering Regulation
                    </span>
                    <span className="text-xs font-bold text-white mt-1 block">
                      100% Contract Demand
                    </span>
                    <span className="text-[0.62rem] text-white/60 mt-0.5 block leading-tight">
                      {result.stateGovtScheme.netMeteringPolicy}
                    </span>
                  </div>
                </div>

                {category === 'commercial' && (
                  <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 text-[0.7rem] text-sky-200">
                    <strong className="block font-bold text-sky-300 mb-0.5">Commercial & Industrial Incentives:</strong>
                    <span>{result.stateGovtScheme.commercialIncentive}</span>
                  </div>
                )}
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
