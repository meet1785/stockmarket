import React, { useState } from 'react';
import { Settings, User, Sliders, AlertTriangle, Download, Upload, Monitor, Shield, Trash2, Info } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usePortfolioStore } from '../stores/portfolioStore';
import { clearAllStorage } from '../services/storage';
import { formatCurrency, formatDate } from '../utils/formatters';

const SettingsPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const resetPortfolio = usePortfolioStore(state => state.resetPortfolio);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showNukeConfirm, setShowNukeConfirm] = useState(false);

  const handleExport = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `papertrade_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetPortfolio = () => {
    resetPortfolio();
    setShowResetConfirm(false);
    alert('Portfolio has been reset to starting balance.');
  };

  const handleNukeData = () => {
    clearAllStorage();
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-4 flex items-center gap-2 mb-1">
          <Settings className="w-6 h-6 text-brand-600" />
          Settings
        </h1>
        <p className="text-surface-3 text-sm">Manage your account and simulation preferences</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card p-5 bg-surface-1">
            <h2 className="text-lg font-semibold text-surface-4 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-surface-3" /> Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-surface-3 mb-1">Username</label>
                <div className="input bg-surface-2 border-surface-2 text-surface-4 py-2 px-3 opacity-70 cursor-not-allowed">
                  {user.username}
                </div>
              </div>
              <div>
                <label className="block text-sm text-surface-3 mb-1">Account Created</label>
                <div className="text-surface-4">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5 bg-surface-1">
            <h2 className="text-lg font-semibold text-surface-4 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-surface-3" /> Simulation Mode
            </h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-surface-2 bg-surface-2/50 cursor-pointer hover:bg-surface-2 transition-colors">
                <input type="radio" name="sim_mode" className="mt-1 accent-brand-600" defaultChecked />
                <div>
                  <div className="font-semibold text-surface-4">Beginner</div>
                  <div className="text-sm text-surface-3">No slippage, simplified execution. Best for learning basics.</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-surface-2 opacity-50 cursor-not-allowed">
                <input type="radio" name="sim_mode" className="mt-1" disabled />
                <div>
                  <div className="font-semibold text-surface-4 flex items-center gap-2">Realistic <span className="badge badge-warning text-[10px]">Coming Soon</span></div>
                  <div className="text-sm text-surface-3">Spread + slippage + brokerage charges.</div>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 rounded-lg border border-surface-2 opacity-50 cursor-not-allowed">
                <input type="radio" name="sim_mode" className="mt-1" disabled />
                <div>
                  <div className="font-semibold text-surface-4 flex items-center gap-2">Professional <span className="badge badge-warning text-[10px]">Coming Soon</span></div>
                  <div className="text-sm text-surface-3">Full execution model with partial fills and queue position.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-5 bg-surface-1">
            <h2 className="text-lg font-semibold text-surface-4 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-surface-3" /> Data Management
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-surface-3 mb-2">Export your data to backup or transfer devices.</div>
                <button onClick={handleExport} className="btn-ghost w-full flex items-center justify-center gap-2 border border-surface-2">
                  <Download className="w-4 h-4" /> Export Data
                </button>
              </div>
              
              <div className="pt-4 border-t border-surface-2">
                <div className="text-sm text-surface-3 mb-2">Reset your virtual balance to ₹1,00,000 and clear trades.</div>
                {showResetConfirm ? (
                  <div className="bg-yellow-400/10 border border-yellow-400/20 p-3 rounded-lg text-sm">
                    <p className="text-yellow-400 mb-2">Are you sure? This will delete all trade history.</p>
                    <div className="flex gap-2">
                      <button onClick={handleResetPortfolio} className="btn-primary py-1 px-3 flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">Confirm</button>
                      <button onClick={() => setShowResetConfirm(false)} className="btn-ghost py-1 px-3 flex-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowResetConfirm(true)} className="btn-ghost w-full flex items-center justify-center gap-2 border border-surface-2 hover:text-yellow-400 hover:bg-yellow-400/10">
                    <AlertTriangle className="w-4 h-4" /> Reset Portfolio
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-surface-2">
                <div className="text-sm text-surface-3 mb-2">Completely wipe all app data, settings, and progress.</div>
                {showNukeConfirm ? (
                  <div className="bg-red-400/10 border border-red-400/20 p-3 rounded-lg text-sm">
                    <p className="text-red-400 mb-2">WARNING: This cannot be undone!</p>
                    <div className="flex gap-2">
                      <button onClick={handleNukeData} className="btn-danger py-1 px-3 flex-1">Nuke Data</button>
                      <button onClick={() => setShowNukeConfirm(false)} className="btn-ghost py-1 px-3 flex-1">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowNukeConfirm(true)} className="btn-ghost w-full flex items-center justify-center gap-2 border border-red-500/20 text-red-400 hover:bg-red-400/10 hover:border-red-400/30">
                    <Trash2 className="w-4 h-4" /> Delete All Data
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5 bg-surface-1">
            <h2 className="text-lg font-semibold text-surface-4 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-surface-3" /> About
            </h2>
            <div className="text-sm text-surface-3 space-y-3">
              <p><strong>PaperTrade India</strong> v1.0.0</p>
              <div className="bg-surface-2 p-3 rounded-lg border border-surface-2/50 text-xs">
                <p className="mb-2"><strong className="text-surface-4">Disclaimer:</strong> This application is for educational purposes only.</p>
                <p>No real money is involved. Market data may be delayed or simulated. Do not use this application for making real financial decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
