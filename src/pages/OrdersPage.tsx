import { useState } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { formatCurrency, formatDateTime, displaySymbol, getPnlColor } from '../utils/formatters';
import { XCircle } from 'lucide-react';

export default function OrdersPage() {
  const { orders, cancelOrder } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<'OPEN' | 'FILLED' | 'CANCELLED' | 'ALL'>('ALL');

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'OPEN') return o.status === 'OPEN' || o.status === 'PENDING';
    if (activeTab === 'FILLED') return o.status === 'FILLED';
    if (activeTab === 'CANCELLED') return o.status === 'CANCELLED' || o.status === 'REJECTED' || o.status === 'EXPIRED';
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Book</h1>
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-700/50">
          {(['OPEN', 'FILLED', 'CANCELLED', 'ALL'] as const).map(tab => (
            <button key={tab} className={`px-4 py-3 font-medium text-sm transition-colors ${activeTab === tab ? 'text-brand-400 border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'}`} onClick={() => setActiveTab(tab)}>
              {tab} {tab !== 'ALL' && <span className="text-xs ml-1 opacity-60">({orders.filter(o => tab === 'OPEN' ? (o.status === 'OPEN' || o.status === 'PENDING') : tab === 'FILLED' ? o.status === 'FILLED' : (o.status === 'CANCELLED' || o.status === 'REJECTED')).length})</span>}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2/50 text-gray-400 border-b border-gray-700/50">
              <tr>
                <th className="p-3 font-medium">Time</th>
                <th className="p-3 font-medium">Symbol</th>
                <th className="p-3 font-medium">Side</th>
                <th className="p-3 font-medium">Type</th>
                <th className="p-3 font-medium text-right">Qty</th>
                <th className="p-3 font-medium text-right">Price</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium text-right">Charges</th>
                <th className="p-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="p-3 text-gray-300 text-xs">{formatDateTime(order.createdAt)}</td>
                  <td className="p-3 font-semibold">{displaySymbol(order.symbol)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${order.side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{order.side}</span>
                  </td>
                  <td className="p-3 text-gray-300">{order.product} · {order.type}</td>
                  <td className="p-3 text-right">{order.filledQuantity > 0 ? `${order.filledQuantity}/${order.quantity}` : order.quantity}</td>
                  <td className="p-3 text-right">{order.avgFillPrice ? formatCurrency(order.avgFillPrice) : (order.price ? formatCurrency(order.price) : 'MKT')}</td>
                  <td className="p-3">
                    <span className={`badge ${order.status === 'FILLED' ? 'badge-profit' : order.status === 'CANCELLED' || order.status === 'REJECTED' ? 'badge-loss' : 'badge-info'}`}>{order.status}</span>
                  </td>
                  <td className="p-3 text-right text-gray-400">{order.charges.total > 0 ? formatCurrency(order.charges.total) : '-'}</td>
                  <td className="p-3 text-right">
                    {(order.status === 'OPEN' || order.status === 'PENDING') && (
                      <button className="text-gray-400 hover:text-red-400 flex items-center gap-1 ml-auto" onClick={() => cancelOrder(order.id)}>
                        <XCircle className="w-4 h-4" /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="p-8 text-center text-gray-500">No orders found. Place your first virtual trade!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
