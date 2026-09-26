import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, PieChart, TrendingUp, TrendingDown, Target, Clock, BarChart2 } from 'lucide-react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { formatCurrency, formatNumber, formatPercent, getPnlColor } from '../utils/formatters';

const AnalyticsPage: React.FC = () => {
  const trades = usePortfolioStore(state => state.trades);

  const metrics = useMemo(() => {
    const closedTrades = trades;
    const totalTrades = closedTrades.length;
    
    if (totalTrades === 0) return null;

    const winningTrades = closedTrades.filter(t => (t.netPnL || 0) > 0);
    const losingTrades = closedTrades.filter(t => (t.netPnL || 0) <= 0);
    
    const winRate = winningTrades.length / totalTrades;
    const grossProfit = winningTrades.reduce((sum, t) => sum + (t.netPnL || 0), 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + (t.netPnL || 0), 0));
    
    const avgWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
    const avgLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;
    
    const profitFactor = grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss;
    const expectancy = (winRate * avgWin) - ((1 - winRate) * avgLoss);

    // Prepare data for charts
    let cumPnL = 0;
    const equityCurve = closedTrades.map(t => {
      cumPnL += (t.netPnL || 0);
      return {
        id: t.id,
        symbol: t.symbol,
        pnl: t.netPnL || 0,
        cumPnL
      };
    });

    return {
      totalTrades,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      expectancy,
      equityCurve,
      distribution: closedTrades.map(t => ({ id: t.id.substring(0,6), pnl: t.netPnL || 0 }))
    };
  }, [trades]);

  if (!metrics) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mb-6">
          <Activity className="w-10 h-10 text-surface-3" />
        </div>
        <h2 className="text-2xl font-bold text-surface-4 mb-2">No Data Available</h2>
        <p className="text-surface-3 max-w-md">Complete some simulated trades to see your performance analytics, win rate, and profit factor.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-4 flex items-center gap-2 mb-1">
          <PieChart className="w-6 h-6 text-brand-600" />
          Performance Analytics
        </h1>
        <p className="text-surface-3 text-sm">Detailed breakdown of your trading statistics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <BarChart2 className="w-4 h-4" /> Total Trades
          </div>
          <div className="text-xl font-bold text-surface-4">{metrics.totalTrades}</div>
        </div>
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <Target className="w-4 h-4" /> Win Rate
          </div>
          <div className="text-xl font-bold text-surface-4">{formatPercent(metrics.winRate * 100)}</div>
        </div>
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" /> Avg Win
          </div>
          <div className="text-xl font-bold text-green-400">{formatCurrency(metrics.avgWin)}</div>
        </div>
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-4 h-4 text-red-400" /> Avg Loss
          </div>
          <div className="text-xl font-bold text-red-400">{formatCurrency(metrics.avgLoss)}</div>
        </div>
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <Activity className="w-4 h-4" /> Profit Factor
          </div>
          <div className="text-xl font-bold text-surface-4">{metrics.profitFactor === Infinity ? '∞' : formatNumber(metrics.profitFactor, 2)}</div>
        </div>
        <div className="card p-4 bg-surface-1">
          <div className="text-surface-3 text-sm flex items-center gap-1.5 mb-1">
            <Clock className="w-4 h-4" /> Expectancy
          </div>
          <div className={`text-xl font-bold ${getPnlColor(metrics.expectancy)}`}>{formatCurrency(metrics.expectancy)}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-4 md:p-6 bg-surface-1">
          <h3 className="font-semibold text-surface-4 mb-4">Cumulative Net P&L</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.equityCurve} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                <XAxis dataKey="id" hide />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(val) => formatNumber(val, 0)}
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value: number) => [formatCurrency(value), 'Cum. P&L']}
                  labelFormatter={() => ''}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="cumPnL" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#3b82f6', stroke: '#1f1f1f', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-4 md:p-6 bg-surface-1">
          <h3 className="font-semibold text-surface-4 mb-4">Trade Distribution (P&L per trade)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.distribution} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                <XAxis dataKey="id" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12} 
                  tickFormatter={(val) => formatNumber(val, 0)}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#2d2d2d' }}
                  contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                  formatter={(value: number) => [formatCurrency(value), 'Net P&L']}
                />
                <Bar dataKey="pnl" radius={[2, 2, 0, 0]}>
                  {metrics.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#4ade80' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
