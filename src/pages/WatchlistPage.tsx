import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, Play, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useWatchlistStore } from '../stores/watchlistStore';
import { useMarketDataStore } from '../stores/marketDataStore';
import { formatCurrency, formatPercent, formatChange, formatVolume, getPnlColor, displaySymbol } from '../utils/formatters';
import { POPULAR_STOCKS } from '../utils/constants';
import type { StockSearchResult } from '../types';

export default function WatchlistPage() {
  const { watchlists, activeWatchlistId, setActiveWatchlist, createWatchlist, deleteWatchlist, renameWatchlist, addItem, removeItem } = useWatchlistStore();
  const { quotes, fetchQuote } = useMarketDataStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);

  const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);

  useEffect(() => {
    if (activeWatchlist) {
      activeWatchlist.items.forEach(item => { fetchQuote(item.symbol); });
    }
  }, [activeWatchlistId, activeWatchlist, fetchQuote]);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setSearchResults(POPULAR_STOCKS.filter(s => s.symbol.toLowerCase().includes(q) || s.companyName.toLowerCase().includes(q)).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) { createWatchlist(newName.trim()); setNewName(''); setIsCreating(false); }
  };

  const handleAddSymbol = (stock: StockSearchResult) => {
    if (activeWatchlistId) {
      addItem(activeWatchlistId, { symbol: stock.symbol, exchange: stock.exchange });
      fetchQuote(stock.symbol);
      setSearch('');
      setSearchResults([]);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-bold mb-1">Watchlists</h1><p className="text-gray-400 text-sm">Track your favorite stocks</p></div>

      {/* Watchlist tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-700/50">
        {watchlists.map(w => (
          <button key={w.id} onClick={() => setActiveWatchlist(w.id)} className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors ${activeWatchlistId === w.id ? 'bg-surface-2 text-white border-b-2 border-brand-500' : 'text-gray-400 hover:text-white'}`}>
            {w.name} <span className="text-xs ml-1 opacity-60">({w.items.length})</span>
          </button>
        ))}
        {isCreating ? (
          <form onSubmit={handleCreateWatchlist} className="flex items-center gap-2 px-2"><input autoFocus className="input py-1 text-sm w-32" placeholder="Name..." value={newName} onChange={e => setNewName(e.target.value)} onBlur={() => { if (!newName.trim()) setIsCreating(false); }} /></form>
        ) : (
          <button onClick={() => setIsCreating(true)} className="px-4 py-2 text-brand-400 hover:text-brand-300 rounded-t-lg flex items-center gap-1 text-sm"><Plus className="h-4 w-4" /> New</button>
        )}
      </div>

      {activeWatchlist && (
        <div className="space-y-4">
          {/* Search + actions */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input className="input pl-10" placeholder="Search stocks to add..." value={search} onChange={e => setSearch(e.target.value)} />
              {searchResults.length > 0 && (
                <div className="absolute z-20 top-full mt-1 w-full bg-surface-2 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {searchResults.map(s => (
                    <button key={s.symbol} className="w-full text-left px-4 py-2 hover:bg-surface-3 flex justify-between items-center" onClick={() => handleAddSymbol(s)}>
                      <div><div className="font-medium">{displaySymbol(s.symbol)}</div><div className="text-xs text-gray-400">{s.companyName}</div></div>
                      <Plus className="h-4 w-4 text-brand-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { const n = prompt('New name:', activeWatchlist.name); if (n?.trim()) renameWatchlist(activeWatchlist.id, n.trim()); }} className="btn-ghost px-3 text-gray-400 hover:text-white"><Edit2 className="h-4 w-4" /></button>
              {watchlists.length > 1 && <button onClick={() => { if (confirm(`Delete "${activeWatchlist.name}"?`)) deleteWatchlist(activeWatchlist.id); }} className="btn-ghost px-3 text-red-400 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>}
            </div>
          </div>

          {/* Watchlist table */}
          {activeWatchlist.items.length === 0 ? (
            <div className="card p-12 flex flex-col items-center text-center">
              <Search className="h-10 w-10 text-gray-600 mb-4" />
              <h3 className="text-lg font-medium mb-2">Watchlist is empty</h3>
              <p className="text-gray-400 max-w-sm">Search and add stocks above to track them.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-700/50">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-2/50 text-gray-400 border-b border-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Symbol</th>
                    <th className="px-4 py-3 font-medium text-right">LTP</th>
                    <th className="px-4 py-3 font-medium text-right">Change</th>
                    <th className="px-4 py-3 font-medium text-right">%</th>
                    <th className="px-4 py-3 font-medium text-right">Volume</th>
                    <th className="px-4 py-3 font-medium text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {activeWatchlist.items.map(item => {
                    const quote = quotes.get(item.symbol);
                    return (
                      <tr key={item.symbol} className="hover:bg-surface-2/30 transition-colors">
                        <td className="px-4 py-3"><Link to={`/stock/${item.symbol}`} className="font-semibold hover:text-brand-400">{displaySymbol(item.symbol)}</Link></td>
                        {quote ? (<>
                          <td className="px-4 py-3 text-right font-medium">{formatCurrency(quote.ltp)}</td>
                          <td className={`px-4 py-3 text-right ${getPnlColor(quote.change)}`}><div className="flex items-center justify-end gap-1">{quote.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{formatChange(quote.change)}</div></td>
                          <td className={`px-4 py-3 text-right ${getPnlColor(quote.changePercent)}`}>{formatPercent(quote.changePercent)}</td>
                          <td className="px-4 py-3 text-right text-gray-400">{formatVolume(quote.volume)}</td>
                        </>) : (<td colSpan={4} className="px-4 py-3 text-center text-gray-500">Loading...</td>)}
                        <td className="px-4 py-3"><div className="flex items-center justify-center gap-2">
                          <Link to={`/trade/${item.symbol}`} className="p-1.5 text-brand-400 hover:bg-brand-500/10 rounded" title="Trade"><Play className="h-4 w-4" /></Link>
                          <button onClick={() => removeItem(activeWatchlist.id, item.symbol)} className="p-1.5 text-gray-500 hover:text-red-400 rounded" title="Remove"><Trash2 className="h-4 w-4" /></button>
                        </div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
