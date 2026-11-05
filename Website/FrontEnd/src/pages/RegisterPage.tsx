import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Building,
  CheckCircle2,
  Home,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { EbookDownloadModal } from '@/components/calculator/EbookDownloadModal';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<'residential' | 'commercial'>('residential');
  const [stateDiscom, setStateDiscom] = useState('Karnataka - BESCOM');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEbookModal, setShowEbookModal] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await register({
        fullName,
        email,
        phone,
        category,
        state: stateDiscom,
        password,
      });

      if (result.success) {
        setRegisteredSuccess(true);
        setShowEbookModal(true);
      } else {
        setError(result.error || 'Failed to complete registration. Please check your entries.');
      }
    } catch {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEbookModalClose = () => {
    setShowEbookModal(false);
    navigate('/roi-calculator', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#07110f] pt-28 pb-16 text-white flex flex-col justify-center">
      <div className="shell max-w-lg w-full mx-auto px-4">
        {/* Registration Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1 text-xs font-bold text-emerald-300">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>New User CleanTech Energy Registration</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Unlock Your <span className="text-emerald-400">25-Year Clean Energy Returns</span>
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/70">
            Register to model your savings with 5% annual inflation, claim PM Surya Ghar subsidies (₹78,000 DBT), and receive your CleanTech E-Book automatically.
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          {registeredSuccess ? (
            <div className="text-center py-6">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">Registration Successful!</h2>
              <p className="mt-2 text-xs text-white/70">
                Welcome to Virya Clean Tech, <strong>{fullName}</strong>. Your account is active and you have access to the dynamic <strong>ROI Calculators</strong> dashboard.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowEbookModal(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Download Free E-Book</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/roi-calculator', { replace: true })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/20"
                >
                  <span>Go to ROI Calculator</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1.5">
                  Consumer Category
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory('residential')}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      category === 'residential'
                        ? 'border-emerald-400 bg-emerald-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Home className="h-4 w-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-white">Residential</span>
                      <span className="block text-[0.65rem] text-white/50">PM Surya Ghar (Up to ₹78k DBT)</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategory('commercial')}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      category === 'commercial'
                        ? 'border-sky-400 bg-sky-500/20 text-white'
                        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Building className="h-4 w-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-white">Commercial / C&I</span>
                      <span className="block text-[0.65rem] text-white/50">40% Accelerated Depreciation</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar or Priya Industrial Works"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                </div>
              </div>

              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Mobile Number (OTP)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98860 12345"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                    <Phone className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  </div>
                </div>
              </div>

              {/* State & DISCOM */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  State & DISCOM (Utility Provider)
                </label>
                <select
                  value={stateDiscom}
                  onChange={(e) => setStateDiscom(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#0a1b18] px-4 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="Karnataka - BESCOM">Karnataka (BESCOM / HESCOM)</option>
                  <option value="Tamil Nadu - TANGEDCO">Tamil Nadu (TANGEDCO)</option>
                  <option value="Maharashtra - MSEDCL">Maharashtra (MSEDCL / Adani)</option>
                  <option value="Gujarat - GUVNL">Gujarat (UGVCL / DGVCL / Torrent)</option>
                  <option value="Delhi - BSES">Delhi NCR (BSES / TPDDL)</option>
                  <option value="Telangana - TSSPDCL">Telangana (TSSPDCL)</option>
                  <option value="Rajasthan - JVVNL">Rajasthan (JVVNL / AVVNL)</option>
                  <option value="Kerala - KSEB">Kerala (KSEB)</option>
                </select>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure account password"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-[0.7rem] text-white/70">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>New User Advantage:</strong> You will immediately receive the official 2026 CleanTech Energy Independence E-Book and unlocked access to the interactive 25-year ROI proposal generator.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 shadow-lg shadow-emerald-900/30"
              >
                <Zap className="h-4 w-4" />
                <span>{loading ? 'Creating Account & Generating Dossier...' : 'Complete Registration & Access ROI Calculator'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-white/60">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-emerald-400 hover:underline">
              Sign In to your account →
            </Link>
          </div>
        </div>
      </div>

      <EbookDownloadModal
        isOpen={showEbookModal}
        onClose={handleEbookModalClose}
        defaultEmail={email}
        defaultName={fullName}
      />
    </div>
  );
}

