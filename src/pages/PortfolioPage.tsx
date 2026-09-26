import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useMarketDataStore } from '../stores/marketDataStore';
import { formatCurrency, formatPercent, getPnlColor, displaySymbol } from '../utils/formatters';
import { TrendingUp, TrendingDown, Briefcase, IndianRupee } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#6366f1'];

export default function PortfolioPage() {
  const { portfolio } = usePortfolioStore();
  const { quotes, fetchQuote } = useMarketDataStore();

  useEffect(() => {
    portfolio.holdings.forEach((h) => { fetchQuote(h.symbol); });
  }, [portfolio.holdings, fetchQuote]);

  const stats = useMemo(() => {
    let investedValue = 0;
    let currentValue = 0;
    portfolio.holdings.forEach((h) => {
      const price = quotes.get(h.symbol)?.ltp || h.currentPrice;
      investedValue += h.avgBuyPrice * h.quantity;
      currentValue += price * h.quantity;
    });
    const totalPnL = currentValue - investedValue;
    const totalPnLPercent = investedValue > 0 ? (totalPnL / investedValue) * 100 : 0;
    const totalValue = portfolio.cash + currentValue;
    return { investedValue, currentValue, totalPnL, totalPnLPercent, totalValue };
  }, [portfolio, quotes]);

  const allocationData = useMemo(() => {
    return portfolio.holdings.map((h) => {
      const price = quotes.get(h.symbol)?.ltp || h.currentPrice;
      return { name: displaySymbol(h.symbol), value: price * h.quantity };
    }).sort((a, b) => b.value - a.value);
  }, [portfolio.holdings, quotes]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Portfolio</h1>
        <p className="text-gray-400 text-sm">Manage your holdings and track performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card"><div className="flex items-center gap-2 text-gray-400 text-sm mb-2"><Briefcase className="h-4 w-4" /> Total Value</div><div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div><div className="text-xs text-gray-500 mt-1">Cash: {formatCurrency(portfolio.cash)}</div></div>
        <div className="card"><div className="text-gray-400 text-sm mb-2">Invested</div><div className="text-2xl font-bold">{formatCurrency(stats.investedValue)}</div><div className="text-xs text-gray-500 mt-1">Current: {formatCurrency(stats.currentValue)}</div></div>
        <div className="card"><div className="text-gray-400 text-sm mb-2">Total P&L</div><div className={`text-2xl font-bold flex items-center gap-2 ${getPnlColor(stats.totalPnL)}`}>{stats.totalPnL >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}{stats.totalPnL > 0 ? '+' : ''}{formatCurrency(stats.totalPnL)}</div><div className={`text-xs mt-1 ${getPnlColor(stats.totalPnLPercent)}`}>{formatPercent(stats.totalPnLPercent)}</div></div>
        <div className="card"><div className="text-gray-400 text-sm mb-2">Cash Available</div><div className="text-2xl font-bold">{formatCurrency(portfolio.cash)}</div><div className="text-xs text-gray-500 mt-1">Initial: {formatCurrency(portfolio.initialCash)}</div></div>
      </div>

      {portfolio.holdings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Holdings</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-700/50">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-2/50 text-gray-400 border-b border-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Symbol</th>
                    <th className="px-4 py-3 font-medium text-right">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Avg Price</th>
                    <th className="px-4 py-3 font-medium text-right">LTP</th>
                    <th className="px-4 py-3 font-medium text-right">Value</th>
                    <th className="px-4 py-3 font-medium text-right">P&L</th>
                    <th className="px-4 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {portfolio.holdings.map(h => {
                    const price = quotes.get(h.symbol)?.ltp || h.currentPrice;
                    const value = price * h.quantity;
                    const invested = h.avgBuyPrice * h.quantity;
                    const pnl = value - invested;
                    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
                    return (
                      <tr key={h.symbol} className="hover:bg-surface-2/30 transition-colors">
                        <td className="px-4 py-3"><Link to={`/stock/${h.symbol}`} className="font-semibold hover:text-brand-400">{displaySymbol(h.symbol)}</Link><div className="text-xs text-gray-500">{h.companyName}</div></td>
                        <td className="px-4 py-3 text-right">{h.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(h.avgBuyPrice)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(price)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(value)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${getPnlColor(pnl)}`}><div>{pnl > 0 ? '+' : ''}{formatCurrency(pnl)}</div><div className="text-xs">{formatPercent(pnlPct)}</div></td>
                        <td className="px-4 py-3 text-center"><Link to={`/trade/${h.symbol}`} className="btn-danger py-1 px-3 text-xs">Sell</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Allocation</h2>
            <div className="card h-[300px] flex items-center justify-center">
              {allocationData.length > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                      {allocationData.map((_entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="card p-12 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-surface-2 rounded-full flex items-center justify-center mb-4"><IndianRupee className="h-8 w-8 text-gray-500" /></div>
          <h3 className="text-lg font-medium mb-2">No holdings yet</h3>
          <p className="text-gray-400 max-w-sm mb-6">Start by buying stocks from the markets page.</p>
          <Link to="/markets" className="btn-primary">Explore Markets</Link>
        </div>
      )}
    </div>
  );
}
