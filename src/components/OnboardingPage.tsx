import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { AlertTriangle, Check, User } from 'lucide-react';
import { BALANCE_PRESETS } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';

const OnboardingPage: React.FC = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(100000); // 1 Lakh default
  const [mode, setMode] = useState<'beginner' | 'realistic' | 'professional'>('beginner');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!agreed) {
      setError('You must agree to the disclaimer');
      return;
    }

    login(username);
  };

  const modes = [
    { id: 'beginner', title: 'Beginner', desc: 'No brokerage fees. Unlimited day trading.' },
    { id: 'realistic', title: 'Realistic', desc: 'Standard SEBI charges apply. T+1 settlement.' },
    { id: 'professional', title: 'Professional', desc: 'Real-world liquidity constraints and impact costs.' },
  ] as const;

  const presets = BALANCE_PRESETS || [10000, 100000, 500000, 1000000];

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl card bg-surface-1 p-6 md:p-8 rounded-2xl shadow-2xl border border-surface-2 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome to <span className="text-brand-400">PaperTrade</span> India
            </h1>
            <p className="text-gray-400">
              The premier educational Indian stock market simulator.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trader Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  className="input w-full pl-10 bg-surface-2 border border-surface-3 rounded-lg py-2.5 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="Enter your alias"
                  maxLength={15}
                />
              </div>
            </div>

            {/* Starting Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Starting Virtual Capital</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBalance(amt)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                      balance === amt
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-surface-2 border-surface-3 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Simulation Mode</label>
              <div className="space-y-2">
                {modes.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMode(m.id as 'beginner' | 'realistic' | 'professional')}
                    className={`cursor-pointer p-3 rounded-lg border transition-all flex items-start gap-3 ${
                      mode === m.id
                        ? 'bg-brand-600/10 border-brand-500/50'
                        : 'bg-surface-2 border-surface-3 hover:border-gray-600'
                    }`}
                  >
                    <div className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border ${
                      mode === m.id ? 'border-brand-500 bg-brand-500' : 'border-gray-500'
                    }`}>
                      {mode === m.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${mode === m.id ? 'text-brand-300' : 'text-gray-300'}`}>
                        {m.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div 
              className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 cursor-pointer"
              onClick={() => {
                setAgreed(!agreed);
                setError('');
              }}
            >
              <div className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded border shrink-0 transition-colors ${
                agreed ? 'bg-yellow-500 border-yellow-500' : 'border-yellow-500/50'
              }`}>
                {agreed && <Check className="w-4 h-4 text-surface-0" />}
              </div>
              <p className="text-sm text-yellow-300/80 leading-relaxed">
                I understand that PaperTrade India is an <span className="font-semibold text-yellow-300">educational simulator</span>. All funds are virtual and no real money is involved or required.
              </p>
            </div>

            {/* Submit */}
            <button
              onClick={handleStart}
              className="btn-primary w-full py-3.5 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              Start Trading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
