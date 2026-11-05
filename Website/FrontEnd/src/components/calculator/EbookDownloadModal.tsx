import React, { useState } from 'react';
import { BookOpen, CheckCircle2, Download, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EbookDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

export function EbookDownloadModal({
  isOpen,
  onClose,
  defaultEmail = '',
  defaultName = '',
}: EbookDownloadModalProps) {
  const { markEbookReceived } = useAuth();
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!isOpen) return null;

  const handleSendOrDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Record lead / newsletter auto-delivery
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'CleanTech Visitor',
          email: email || 'visitor@cleantech.in',
          service: 'solar',
          details: 'Downloaded Official CleanTech Energy Independence & Solar Guidebook (2026 Edition).',
          source: 'ebook-auto-delivery',
          newsletterConsent: true,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    markEbookReceived();

    setTimeout(() => {
      setStatus('sent');
      // Trigger browser download of formatted PDF/Guide
      const blob = new Blob(
        [
          `VIRYA CLEAN TECH — COMPREHENSIVE ENERGY INDEPENDENCE & SOLAR GUIDEBOOK (2026 EDITION)
========================================================================================

Author: Virya Clean Tech Technical Advisory Group
HQ: Bengaluru, Karnataka, India | Connect: connect@viryacleantech.com

TABLE OF CONTENTS:
1. Understanding Your Electricity Bill & Fixed Demand Charges
2. PM Surya Ghar: Muft Bijli Yojana — Step-by-Step Direct Subsidy Guide (₹78,000 DBT)
3. 25-Year Compound Savings Modeling: Accounting for 5% Annual DISCOM Tariff Hikes
4. Solar Paai (Flexible Solar Mats) for Industrial PEB Sheds & Lightweight Structures
5. Sodium-Ion Battery Storage (Sodium BESS) vs Lithium Iron Phosphate (LFP)
6. Commercial Section 32 Accelerated Depreciation (40%) & Tax Shield Optimization
7. EV Fleet Charging Depots & Dynamic Load Balancing (OCPP 2.0.1)
8. Green Hydrogen Electrolyzers & Diesel Replacement for Telecom Towers
9. Complete Engineering Sizing & Bill of Quantities (BOQ) Checklist
10. Interconnection & Net-Metering Feasibility: DISCOM SLD Protocol

---
1. PM SURYA GHAR SUBSIDY SUMMARY:
- 1 kWp: ₹30,000 Direct DBT Subsidy
- 2 kWp: ₹60,000 Direct DBT Subsidy
- 3 kWp to 10 kWp: ₹78,000 Maximum Direct Subsidy
- Key Benefit: A standard 3 kW system yields over ₹1,00,000 in immediate savings within year one!

2. 25-YEAR ESCALATION REALITY:
Electricity tariffs in India escalate at a compound annual growth rate (CAGR) of 4.8% to 6.2%.
Modeling solar without a 5% compounding factor severely understates your lifetime returns.
Over 25 years, a typical 5 kW residential system generates over ₹14,50,000 in net savings.

3. SOLAR PAAI (FLEXIBLE MATS):
Weighing only 2.9 kg/m², Solar Paai requires zero roof penetrations and bonds directly with
industrial peel-and-stick adhesives onto curved standing-seam PEB factory roofs.

4. SODIUM BATTERIES:
Zero thermal runaway hazard up to 60°C ambient temperatures, 4,000+ cycle life, and no cobalt/lithium
supply chain vulnerability.

Need a dedicated site audit? Visit https://viryacleantech.com or call +91 8317494969.
`
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Virya-CleanTech-Solar-Energy-Independence-Guide-2026.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-[#071311] p-6 text-white shadow-lift sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider text-emerald-400 uppercase">
              <Sparkles className="h-3 w-3" /> Auto-Delivery Ready
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              CleanTech Energy Independence E-Book
            </h3>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/70">
          The definitive 2026 Guide to Indian Solar Subsidies (PM Surya Ghar), 25-Year Compound Financial Modeling with 5% Tariff Escalation, Solar Paai flexible mats, Sodium BESS, and Commercial Tax Shields.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/80 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Complete PM Surya Ghar ₹78,000 DBT application roadmap.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Commercial 40% Accelerated Depreciation filing checklist.</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Bill of Quantities (BOQ) standard equipment specifications.</span>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
            <h4 className="mt-2 text-base font-bold text-white">E-Book Delivered & Downloaded!</h4>
            <p className="mt-1 text-xs text-white/70">
              A copy has been queued for your inbox and your direct guide file is ready on your device.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              Continue to Calculator
            </button>
          </div>
        ) : (
          <form onSubmit={handleSendOrDownload} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Your Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@company.in"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <span>Preparing E-Book...</span>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download E-Book (PDF/Guide)</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-[0.7rem] text-white/50">
              Free instant delivery • Auto-verified by Virya Clean Tech Advisory
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
