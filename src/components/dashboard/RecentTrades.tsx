import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { formatCurrency, formatNumber, formatDateTime, getPnlColor } from '../../utils/formatters';

export default function RecentTrades() {
  const { trades } = usePortfolioStore();
  const recentTrades = trades.slice(0, 10);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Recent Trades</h2>
        <Link to="/orders" className="text-brand-600 hover:text-brand-500 text-sm">View All</Link>
      </div>

      {recentTrades.length === 0 ? (
        <div className="text-center py-8 text-surface-400">
          No trades yet. Start your trading journey!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-surface-400 border-b border-surface-2 pb-2">
              <tr>
                <th className="font-medium pb-2">Date</th>
                <th className="font-medium pb-2">Symbol</th>
                <th className="font-medium pb-2">Side</th>
                <th className="font-medium pb-2 text-right">Qty</th>
                <th className="font-medium pb-2 text-right">Entry</th>
                <th className="font-medium pb-2 text-right">Exit</th>
                <th className="font-medium pb-2 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-surface-2/50 transition-colors">
                  <td className="py-3">{formatDateTime(trade.exitDate)}</td>
                  <td className="py-3 font-medium">{trade.symbol}</td>
                  <td className="py-3">
                    <span className={trade.side === 'BUY' ? 'badge-profit' : 'badge-loss'}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="py-3 text-right">{formatNumber(trade.quantity)}</td>
                  <td className="py-3 text-right">{formatCurrency(trade.entryPrice)}</td>
                  <td className="py-3 text-right">{trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}</td>
                  <td className={`py-3 text-right ${trade.netPnL ? getPnlColor(trade.netPnL) : ''}`}>
                    {trade.netPnL ? formatCurrency(trade.netPnL) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
