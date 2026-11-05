import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Mail,
  Printer,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { RoiCalculationResult } from '@/lib/roiCalculations';

interface AutomatedQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: RoiCalculationResult;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function AutomatedQuoteModal({
  isOpen,
  onClose,
  result,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
}: AutomatedQuoteModalProps) {
  const { user, saveQuote } = useAuth();
  const [name] = useState(customerName || user?.fullName || 'Esteemed Client');
  const [email, setEmail] = useState(customerEmail || user?.email || '');
  const [phone] = useState(customerPhone || user?.phone || '');
  const [emailSent, setEmailSent] = useState(false);
  const [savedQuoteRef, setSavedQuoteRef] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const quoteId = savedQuoteRef || `VCT-PROP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handlePrintOrPdf = () => {
    // If not saved yet, record to user dashboard
    if (!savedQuoteRef) {
      const q = saveQuote({
        calculationId: `calc_${Date.now()}`,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        category: result.category,
        systemSizeKw: result.recommendedSystemSizeKw,
        systemType: result.techType,
        netInvestment: result.netInvestmentInr,
        lifetimeSavings: result.lifetime25YrSavingsInr,
        paybackPeriod: result.paybackPeriodDisplay,
        terms: [
          '25-Year Linear Power Performance Warranty for Solar Modules (>80% @ Year 25)',
          '5-Year Comprehensive EPC & Balance of System (BOS) On-Site Warranty',
          'DISCOM Liaisoning for Bidirectional Net Metering and CEIG Safety Approvals',
          'PM Surya Ghar DBT Subsidy or Commercial 40% Accelerated Depreciation Assured Assistance',
        ],
      });
      setSavedQuoteRef(q.quoteNumber);
    }

    window.print();
  };

  const handleEmailQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const q = saveQuote({
      calculationId: `calc_${Date.now()}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      category: result.category,
      systemSizeKw: result.recommendedSystemSizeKw,
      systemType: result.techType,
      netInvestment: result.netInvestmentInr,
      lifetimeSavings: result.lifetime25YrSavingsInr,
      paybackPeriod: result.paybackPeriodDisplay,
      terms: [
        '25-Year Linear Power Performance Warranty for Solar Modules (>80% @ Year 25)',
        '5-Year Comprehensive EPC & Balance of System (BOS) On-Site Warranty',
        'DISCOM Liaisoning for Bidirectional Net Metering and CEIG Safety Approvals',
      ],
    });
    setSavedQuoteRef(q.quoteNumber);
    setEmailSent(true);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-white/20 bg-slate-900 text-white shadow-2xl my-8">
        {/* Sticky action bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-slate-900/95 px-6 py-4 backdrop-blur rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Automated Proposal & Quote Generator</h2>
              <p className="text-[0.7rem] text-emerald-400 font-mono">Ref: {quoteId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrintOrPdf}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close quote modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Document Body */}
        <div ref={printRef} className="p-6 sm:p-8 space-y-6 printable-quote text-slate-900 bg-white m-4 rounded-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-emerald-800">VIRYA CLEAN TECH</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-800 uppercase">
                  Official Proposal
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Cleaner tomorrow, engineered today. (Powered by Algobiz Innovations LLP)</p>
              <p className="text-xs text-slate-500">No 2, 1st Floor, No 113, Yogjam Sai Charan Layout, Bengaluru, KA 560036</p>
              <p className="text-xs font-mono text-slate-500">connect@viryacleantech.com | +91 8317494969</p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                {quoteId}
              </span>
              <p className="text-xs text-slate-500 mt-1">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-emerald-700 font-semibold">Validity: 30 Days</p>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[0.65rem]">Prepared For</span>
              <p className="font-bold text-sm text-slate-900 mt-0.5">{name}</p>
              <p className="text-slate-600">{email || 'Verified Client'} • {phone || '+91'}</p>
              <p className="text-slate-600">Site Location: {result.selectedDiscom}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[0.65rem]">System Classification</span>
              <p className="font-bold text-sm text-slate-900 mt-0.5">
                {result.recommendedSystemSizeKw} kW {result.techType.replace('-', ' ').toUpperCase()}
              </p>
              <p className="text-slate-600">Category: <span className="capitalize font-semibold text-emerald-800">{result.category}</span></p>
              <p className="text-slate-600">Monthly Baseline: ₹{result.monthlyBillInr.toLocaleString('en-IN')} (~{result.monthlyUnitsKwh} kWh)</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">1. Financial Investment & Subsidies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[0.65rem] text-slate-500 font-semibold uppercase">Gross Turnkey EPC</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">₹{result.estimatedGrossCapexInr.toLocaleString('en-IN')}</p>
                <span className="text-[0.6rem] text-slate-400">Standard Tier-1 CapEx</span>
              </div>
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3">
                <span className="text-[0.65rem] text-emerald-700 font-bold uppercase">{result.category === 'residential' ? 'Govt Subsidy (DBT)' : 'Year-1 Tax Shield'}</span>
                <p className="text-base font-extrabold text-emerald-700 mt-1">-₹{result.subsidyOrTaxShieldInr.toLocaleString('en-IN')}</p>
                <span className="text-[0.6rem] text-emerald-800 font-medium">{result.subsidySchemeName}</span>
              </div>
              <div className="rounded-xl border border-slate-300 bg-slate-900 p-3 text-white">
                <span className="text-[0.65rem] text-emerald-400 font-bold uppercase">Net Capital Outlay</span>
                <p className="text-base font-extrabold text-white mt-1">₹{result.netInvestmentInr.toLocaleString('en-IN')}</p>
                <span className="text-[0.6rem] text-slate-400">After DBT / Tax Benefit</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <span className="text-[0.65rem] text-slate-500 font-semibold uppercase">Estimated Payback</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">{result.paybackPeriodDisplay}</p>
                <span className="text-[0.6rem] text-slate-400">Equity Breakeven</span>
              </div>
            </div>

            {/* User Highlight Note */}
            <div className="mt-2 rounded-lg bg-emerald-100/60 border border-emerald-300 p-2.5 text-xs text-emerald-950 font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>{result.subsidyDetailNote}</span>
            </div>
          </div>

          {/* 25-Year Compound Financial Projection with 5% Escalation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. 25-Year Savings Projection (With 5% Annual Grid Tariff Escalation)
              </h3>
              <span className="text-[0.65rem] font-bold text-slate-500">
                Lifetime Net Savings: <span className="text-emerald-700 font-extrabold text-sm">₹{result.lifetime25YrSavingsInr.toLocaleString('en-IN')}</span>
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-[0.7rem] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2 px-2.5">Year</th>
                    <th className="py-2 px-2.5">Grid Tariff (+5%/yr)</th>
                    <th className="py-2 px-2.5">Gen (kWh)</th>
                    <th className="py-2 px-2.5">Bill Without CleanTech</th>
                    <th className="py-2 px-2.5">Bill With CleanTech</th>
                    <th className="py-2 px-2.5 text-emerald-800">Net Annual Savings</th>
                    <th className="py-2 px-2.5 text-slate-900">Cumulative Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {result.twentyFiveYearProjections.slice(0, 7).map((row) => (
                    <tr key={row.year} className={row.year % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">Year 0{row.year}</td>
                      <td className="py-1.5 px-2.5 font-mono">₹{row.tariffPerKwh.toFixed(2)}/kWh</td>
                      <td className="py-1.5 px-2.5 font-mono">{row.solarGenerationKwh.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2.5 font-mono">₹{row.billWithoutSolarInr.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2.5 font-mono">₹{row.billWithSolarInr.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2.5 font-bold font-mono text-emerald-700">+₹{row.annualSavingsInr.toLocaleString('en-IN')}</td>
                      <td className="py-1.5 px-2.5 font-bold font-mono text-slate-900">₹{row.cumulativeSavingsInr.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  <tr className="bg-emerald-50/60 font-bold text-emerald-950">
                    <td className="py-2 px-2.5" colSpan={5}>
                      Years 08 through 25 Compounding (+5% Escalation annually)...
                    </td>
                    <td className="py-2 px-2.5 font-mono text-emerald-800">25-Yr Total:</td>
                    <td className="py-2 px-2.5 font-mono font-extrabold text-emerald-800 text-xs">
                      ₹{result.lifetime25YrSavingsInr.toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[0.65rem] text-slate-500 mt-1.5">
              * Compounding methodology: Tariffs increase at an annual rate of 5.0% to reflect realistic utility rate growth in India. Degradation applied at 0.7%/year.
            </p>
          </div>

          {/* Bill of Quantities (BOQ) */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">3. Engineered Bill of Quantities (BOQ)</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-[0.7rem] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2 px-2.5">Item Name</th>
                    <th className="py-2 px-2.5">Engineering Specifications</th>
                    <th className="py-2 px-2.5">Sized Quantity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {result.boq.map((b, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                      <td className="py-1.5 px-2.5 font-bold text-slate-900">{b.item}</td>
                      <td className="py-1.5 px-2.5">{b.specification}</td>
                      <td className="py-1.5 px-2.5 font-mono font-semibold text-emerald-800">{b.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Environmental & Warranties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 pt-4 text-xs">
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[0.65rem]">Environmental Contribution</span>
              <p className="mt-1 text-slate-600">
                Offsets <strong className="text-emerald-800">{result.annualCo2AbatedTonnes} Tonnes</strong> of CO₂ annually, equivalent to planting <strong className="text-emerald-800">{result.treesPlantedEquivalent} trees</strong>.
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[0.65rem]">Guaranteed Warranties</span>
              <ul className="mt-1 space-y-1 text-slate-600 list-disc list-inside">
                <li>25-Year Linear Power Performance Warranty for Solar Modules</li>
                <li>5-Year Comprehensive Workmanship & Inverter Replacement SLA</li>
                <li>End-to-End DISCOM Net-Metering & CEIG Safety Approval</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-3 text-[0.65rem] text-slate-400 flex items-center justify-between">
            <span>Virya Clean Tech Engineering Pvt Ltd • Clean Technology Division</span>
            <span>Generated via Virya Digital Energy Platform</span>
          </div>
        </div>

        {/* Email delivery bar at bottom */}
        <div className="border-t border-white/10 bg-slate-900/90 p-6 rounded-b-3xl">
          {emailSent ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-400" />
              <p className="mt-1 text-sm font-bold text-white">Proposal Sent & Saved to Your Dashboard!</p>
              <p className="text-xs text-white/70">A branded copy has been sent to {email}. Ref: {quoteId}</p>
            </div>
          ) : (
            <form onSubmit={handleEmailQuote} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to receive this official proposal PDF"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm shrink-0"
              >
                <Mail className="h-4 w-4" />
                <span>Auto-Email Official Proposal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
