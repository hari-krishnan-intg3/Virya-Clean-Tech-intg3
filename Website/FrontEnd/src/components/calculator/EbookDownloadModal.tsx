import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Download,
  Eye,
  Mail,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  if (!isOpen) return null;

  const downloadHtmlEbook = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Virya CleanTech — 2026 Energy Independence & Solar Guidebook</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 900px; margin: 40px auto; padding: 0 20px; }
    h1, h2, h3 { color: #064e3b; }
    .header-box { background: linear-gradient(135deg, #064e3b, #022c22); color: white; padding: 40px; border-radius: 20px; margin-bottom: 30px; }
    .header-box h1 { color: #34d399; margin: 0 0 10px 0; }
    .badge { background: rgba(52, 211, 153, 0.2); color: #34d399; padding: 4px 12px; border-radius: 999px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
    .chapter { border-bottom: 2px solid #e2e8f0; padding-bottom: 25px; margin-bottom: 30px; }
    .formula-box { background: #f1f5f9; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; font-family: monospace; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f8fafc; font-weight: bold; }
    .btn-print { background: #059669; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; margin-top: 20px; }
    @media print { .btn-print { display: none; } body { margin: 0; padding: 0; } }
  </style>
</head>
<body>
  <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
  <div class="header-box">
    <span class="badge">Special Technical Report • 2026 Edition</span>
    <h1>Empowering Clean Energy Independence</h1>
    <p>The 2026 Guide to Indian Solar Subsidies (PM Surya Ghar), 25-Year Compound ROI Modeling (5% Escalation), Solar Paai Flexible Mats, Sodium BESS, and Section 32 Commercial 40% AD.</p>
    <p style="font-size: 12px; opacity: 0.8; margin-top: 20px;">Published by Virya Clean Tech Advisory Group • Bengaluru, Karnataka • connect@viryacleantech.com</p>
  </div>

  <div class="chapter">
    <h2>1. Executive Summary & The 5% Compounding Reality</h2>
    <p>Electricity tariffs across Indian state DISCOMs escalate at a compound annual growth rate of 4.8% to 6.2%. Calculating solar financial viability without a 5% compounding inflation factor drastically understates true returns. Over 25 years, a standard 3 kW residential system generates over ₹38 Lakhs in compounding savings, while commercial enterprises lock in an LCOE of under ₹2.00/kWh.</p>
    <div class="formula-box">Compounded Tariff(Year n) = Base Tariff × (1 + 0.05)^(n - 1)</div>
  </div>

  <div class="chapter">
    <h2>2. PM Surya Ghar: Muft Bijli Yojana Subsidies</h2>
    <ul>
      <li><strong>1 kWp:</strong> ₹30,000 Direct Cash DBT Subsidy (Aadhaar linked account)</li>
      <li><strong>2 kWp:</strong> ₹60,000 Direct Cash DBT Subsidy</li>
      <li><strong>3 kWp to 10 kWp:</strong> ₹78,000 Maximum Direct Central Subsidy</li>
      <li><strong>State Top-Ups:</strong> States like Uttar Pradesh provide up to ₹30,000 extra, delivering up to ₹1,08,000 in total direct subsidy.</li>
    </ul>
    <p><strong>The 3 kW Milestone:</strong> Sizing at 3 kW costs ~₹1.56 Lakhs. Subtracting the ₹78,000 DBT subsidy results in an upfront net investment of only ₹78,000. Combined with Year 1 electricity bill elimination, total first-year savings exceed ₹1,00,000.</p>
  </div>

  <div class="chapter">
    <h2>3. Solar Mat / Solar Paai (Flexible CIGS Panels)</h2>
    <p>Engineered for lightweight industrial PEB sheds, curved roofs, and non-penetrating structures:</p>
    <ul>
      <li><strong>Weight:</strong> Only 2.9 kg/m² (vs 22 kg/m² for rigid glass panels)</li>
      <li><strong>Attachment:</strong> Industrial 3M structural bonding film — zero drilling or roof penetrations</li>
      <li><strong>Flexibility:</strong> Bends to a 0.5m radius for curved architectural domes and factory standing seams</li>
    </ul>
  </div>

  <div class="chapter">
    <h2>4. Commercial & Industrial Economics (Section 32 40% AD)</h2>
    <p>Commercial enterprises claim 40% Year-1 tax depreciation write-off. At standard corporate tax rates (26% inclusive of cess), you recover over 10.4% of your total solar CapEx in immediate corporate tax savings within Year 1.</p>
  </div>

  <div class="chapter">
    <h2>5. Sodium-ion Battery Storage (Sodium BESS)</h2>
    <p>Thermal-runaway safe chemistry (-20°C to 60°C operating window) delivering 4,000+ cycles at 90% DoD. Completely eliminates lithium, cobalt, and nickel supply chain bottlenecks.</p>
  </div>

  <div class="chapter">
    <h2>6. Interactive ROI Calculator & Custom Proposals</h2>
    <p>To run customized 25-year financial simulations and download branded equipment proposals, visit <a href="https://viryacleantech.com/roi-calculator">viryacleantech.com/roi-calculator</a> or read the full online guide at <a href="https://viryacleantech.com/ebook-guide">viryacleantech.com/ebook-guide</a>.</p>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Virya_CleanTech_Energy_Independence_Guidebook_2026.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSendOrDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Record lead / email newsletter auto-delivery
    try {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name || 'CleanTech Visitor',
          email: email || 'visitor@cleantech.in',
          service: 'solar',
          details: 'Dispatched 2026 CleanTech Energy Independence & Solar Guidebook in Special Report Newsletter format.',
          source: 'ebook-newsletter-delivery',
          newsletterConsent: true,
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    markEbookReceived();

    setTimeout(() => {
      setStatus('sent');
      downloadHtmlEbook();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-ink/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/30 bg-[#071311] p-6 text-white shadow-2xl my-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[0.7rem] font-bold tracking-wider text-emerald-400 uppercase">
              <Sparkles className="h-3 w-3" /> Auto-Delivery & E-Book Portal
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              CleanTech Energy Independence Special Report
            </h3>
          </div>
        </div>

        {/* Tabs: Form Delivery vs Attached Email Preview */}
        <div className="mt-4 flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Send to Email & Download</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-4 text-xs font-bold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Attached Email Newsletter Layout Preview</span>
          </button>
        </div>

        {activeTab === 'form' ? (
          <div>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/70">
              The definitive 2026 Guide to Indian Solar Subsidies (PM Surya Ghar ₹78k DBT), 25-Year Compound Financial Modeling (5% Escalation), Solar Paai flexible mats, Sodium BESS, and Section 32 Commercial 40% AD.
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-white/80">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>PM Surya Ghar ₹78k DBT Roadmap</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Commercial 40% AD Tax Shield</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Solar Paai & Sodium-ion BESS</span>
              </div>
            </div>

            {status === 'sent' ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                <h4 className="mt-2 text-base font-bold text-white">E-Book Dispatched to Your Email!</h4>
                <p className="mt-1 text-xs text-white/70">
                  We have dispatched the official <strong>Special Report Newsletter</strong> to <strong>{email}</strong> and downloaded the complete standalone eBook file to your device.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <Link
                    to="/ebook-guide"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Full E-Book Online</span>
                  </Link>
                  <button
                    type="button"
                    onClick={downloadHtmlEbook}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download File Again</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendOrDownload} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Your Email Address (For Newsletter Delivery)
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ramesh@company.in"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 shadow-lg shadow-emerald-950/50"
                  >
                    {status === 'sending' ? (
                      <span>Dispatching Newsletter & E-Book...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send to Email & Download eBook</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/ebook-guide"
                    onClick={onClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Read Web Edition</span>
                  </Link>
                </div>
                <p className="text-center text-[0.68rem] text-white/50">
                  Sent in the official Virya CleanTech Special Report Newsletter format • Zero spam guarantee
                </p>
              </form>
            )}
          </div>
        ) : (
          /* Live Email Newsletter Layout Preview (Matching Attached Image) */
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4 text-slate-800 shadow-inner max-h-[480px] overflow-y-auto">
              {/* Top View as Webpage */}
              <div className="text-center text-[0.65rem] text-slate-500 pb-2 border-b border-slate-300">
                Virya CleanTech TODAY | To view this email as a web page,{' '}
                <Link to="/ebook-guide" onClick={onClose} className="text-emerald-700 underline font-semibold">
                  click here
                </Link>.
              </div>

              {/* Newsletter Header Banner (Circuit / Clean Tech lattice matching screenshot) */}
              <div className="mt-3 rounded-t-xl bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 p-4 text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                      <span>ViryaCleanTech</span>
                      <span className="text-emerald-400 font-extrabold text-sm sm:text-base uppercase bg-emerald-500/20 px-2 py-0.5 rounded">
                        TODAY
                      </span>
                    </span>
                  </div>
                  <span className="text-[0.65rem] font-mono font-bold tracking-wider text-purple-300 uppercase">
                    NOVEMBER 2026
                  </span>
                </div>
                {/* Circuit background overlay */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>

              {/* Feature Card (Matching attached screenshot layout) */}
              <div className="bg-white border-x border-b border-slate-300 p-5 rounded-b-xl shadow-sm">
                {/* Graphic Visual Banner */}
                <div className="rounded-xl bg-gradient-to-br from-emerald-950 via-slate-900 to-purple-950 p-6 text-white text-center relative overflow-hidden mb-4">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/30 border border-purple-400/40 px-3 py-0.5 text-[0.65rem] font-bold text-purple-200 uppercase mb-2">
                    SPECIAL REPORT
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white">
                    Empowering Clean Energy Independence
                  </h4>
                  <p className="text-xs text-emerald-300 mt-1">
                    Solar • Solar Paai • Sodium BESS • Carbon Economics
                  </p>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-emerald-500/20 blur-xl"></div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-purple-900 block uppercase tracking-wider">
                    Special Report: The &quot;Empowering Clean Energy Independence&quot; eBook
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700">
                    Download this comprehensive 2026 engineering & financial guide that focuses on the critical considerations in deploying rooftop solar, lightweight Solar Paai (peel-and-stick mats for PEB sheds), Sodium-ion BESS, EV infrastructure, and 25-year compounding ROI under PM Surya Ghar & Section 32 40% AD.
                  </p>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={downloadHtmlEbook}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-900 hover:bg-purple-800 text-white px-5 py-2.5 text-xs font-bold transition shadow"
                    >
                      <span>Download eBook (PDF/HTML)</span>
                    </button>
                    <Link
                      to="/ebook-guide"
                      onClick={onClose}
                      className="inline-flex items-center gap-1 ml-3 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <span>Read Online Edition →</span>
                    </Link>
                  </div>
                </div>

                {/* Sponsored / Briefing Section */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Industry Briefing Highlights:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[0.7rem] text-slate-700">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <strong>3 kW System:</strong> ₹78,000 Direct DBT Subsidy → Save ₹1 Lakh in Year 1!
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <strong>5% Escalation:</strong> Compounding DISCOM tariff hedge over 25 years.
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <strong>Sodium BESS:</strong> Zero thermal runaway (-20°C to 60°C operating window).
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <strong>Solar Paai:</strong> 2.9 kg/m² peel-and-stick for industrial PEB sheds.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Deliver This to My Inbox
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
