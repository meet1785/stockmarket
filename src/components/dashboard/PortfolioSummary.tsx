import React from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency, getPnlColor, formatChange } from '../../utils/formatters';
import { Wallet, PieChart, TrendingUp, DollarSign, Activity, BarChart2 } from 'lucide-react';

export default function PortfolioSummary() {
  const { portfolio, trades } = usePortfolioStore();
  const { cash, holdings } = portfolio;

  const investedValue = holdings.reduce((sum: number, h: { avgBuyPrice: number; quantity: number }) => sum + (h.avgBuyPrice * h.quantity), 0);
  const currentHoldingsValue = holdings.reduce((sum: number, h: { currentPrice: number; quantity: number }) => sum + (h.currentPrice * h.quantity), 0);
  
  const totalValue = cash + currentHoldingsValue;
  const unrealizedPnL = holdings.reduce((sum: number, h: { currentPrice: number; avgBuyPrice: number; quantity: number }) => sum + ((h.currentPrice - h.avgBuyPrice) * h.quantity), 0);
  
  const realizedPnL = trades.reduce((sum, t) => sum + (t.netPnL || 0), 0);
  const totalPnL = realizedPnL + unrealizedPnL;
  
  // Using unrealized P&L as a proxy for day P&L if real data isn't available
  const dayPnL = unrealizedPnL;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <PieChart className="w-4 h-4" />
          <span>Total Value</span>
        </div>
        <div className="text-xl font-bold">{formatCurrency(totalValue)}</div>
      </div>
      
      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <Wallet className="w-4 h-4" />
          <span>Cash Available</span>
        </div>
        <div className="text-xl font-bold">{formatCurrency(cash)}</div>
      </div>

      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <DollarSign className="w-4 h-4" />
          <span>Invested Value</span>
        </div>
        <div className="text-xl font-bold">{formatCurrency(investedValue)}</div>
      </div>

      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <Activity className="w-4 h-4" />
          <span>Day P&L</span>
        </div>
        <div className="text-xl font-bold">
          <span className={getPnlColor(dayPnL)}>{formatChange(dayPnL)}</span>
        </div>
      </div>

      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Total P&L</span>
        </div>
        <div className="text-xl font-bold">
          <span className={getPnlColor(totalPnL)}>{formatChange(totalPnL)}</span>
        </div>
      </div>

      <div className="card p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-center gap-2 mb-2 text-surface-400 text-sm">
          <BarChart2 className="w-4 h-4" />
          <span>Unrealized P&L</span>
        </div>
        <div className="text-xl font-bold">
          <span className={getPnlColor(unrealizedPnL)}>{formatChange(unrealizedPnL)}</span>
        </div>
      </div>
    </div>
  );
}
