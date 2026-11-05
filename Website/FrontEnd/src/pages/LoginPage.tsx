import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, LogIn, Sparkles, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Where to go after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/roi-calculator';

  const handleSendOtp = () => {
    if (!credential) {
      setError('Please enter your mobile number or email address.');
      return;
    }
    setError(null);
    setOtpSent(true);
    // simulated OTP code for convenience
    setOtpCode('2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(credential, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'residential' | 'commercial') => {
    setLoading(true);
    const demoUser = role === 'residential' ? 'Ramesh Kumar (Residential)' : 'Aditi Sharma (Commercial Director)';
    await login(demoUser, 'demo123');
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#07110f] pt-28 pb-16 text-white flex flex-col justify-center">
      <div className="shell max-w-md w-full mx-auto px-4">
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Digital Presence Access Portal</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
            Sign In to <span className="text-emerald-400">Virya CleanTech</span>
          </h1>
          <p className="mt-2 text-xs text-white/70">
            Access your 25-Year Compound Savings, Proposal Generator, and PM Surya Ghar Subsidies.
          </p>
        </div>

        {/* Login Box */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <div className="flex border-b border-white/10 pb-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setIsOtpMode(false);
                setError(null);
              }}
              className={`flex-1 text-center pb-2 text-xs font-bold transition border-b-2 -mb-[18px] ${
                !isOtpMode ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOtpMode(true);
                setError(null);
              }}
              className={`flex-1 text-center pb-2 text-xs font-bold transition border-b-2 -mb-[18px] ${
                isOtpMode ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              Mobile OTP Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                {isOtpMode ? 'Mobile Number or Email' : 'User ID, Email or Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                  placeholder={isOtpMode ? '+91 98860 12345 or user@domain.com' : 'User ID, phone or email'}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                />
                <User className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
              </div>
            </div>

            {!isOtpMode ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-white/80">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsOtpMode(true)}
                    className="text-[0.7rem] text-emerald-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 pl-10 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">One-Time Password (OTP)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter 4-digit code (e.g. 2026)"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-3 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition shrink-0"
                  >
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && (
                  <p className="mt-1 text-[0.7rem] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>OTP sent! Demo test code: <strong>2026</strong></span>
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50 mt-2 shadow-lg shadow-emerald-900/30"
            >
              <LogIn className="h-4 w-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <span className="text-[0.65rem] font-bold text-white/40 uppercase tracking-wider block text-center mb-3">
              One-Click Quick Sign In
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('residential')}
                className="rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-left text-[0.7rem] hover:bg-white/10 transition"
              >
                <span className="font-bold text-emerald-400 block">Residential User</span>
                <span className="text-white/60 text-[0.65rem]">PM Surya Ghar</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('commercial')}
                className="rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-left text-[0.7rem] hover:bg-white/10 transition"
              >
                <span className="font-bold text-sky-400 block">Commercial User</span>
                <span className="text-white/60 text-[0.65rem]">40% Tax Shield</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-white/60">
            Don&apos;t have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-400 hover:underline">
              Register as a New User →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
