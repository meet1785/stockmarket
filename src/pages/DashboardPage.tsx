import React from 'react';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import QuickActions from '../components/dashboard/QuickActions';
import RecentTrades from '../components/dashboard/RecentTrades';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="simulation-banner bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
        <AlertCircle className="w-4 h-4" />
        Simulated trading environment — no real money is involved.
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <PortfolioSummary />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTrades />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">Learning Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Beginner Modules</span>
                  <span className="text-brand-500">60%</span>
                </div>
                <div className="w-full bg-surface-2 rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-sm text-surface-400">
                Continue your learning journey to unlock advanced trading features and improve your market knowledge.
              </p>
              <button className="btn-primary w-full text-sm py-2">
                Continue Module
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
