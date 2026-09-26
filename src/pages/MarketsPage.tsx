import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useMarketDataStore } from '../stores/marketDataStore';
import { POPULAR_STOCKS } from '../utils/constants';
import { formatCurrency, formatPercent, formatVolume, getPnlColor, displaySymbol } from '../utils/formatters';

export default function MarketsPage() {
  const { fetchQuote, quotes, indices, refreshIndices } = useMarketDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      refreshIndices();
      const initial = POPULAR_STOCKS.slice(0, 10).map(s => s.symbol);
      await Promise.all(initial.map(s => fetchQuote(s)));
      setLoading(false);
    };
    fetch();
  }, [fetchQuote, refreshIndices]);

  const filteredStocks = POPULAR_STOCKS.filter(stock =>
    stock.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Markets</h1>
        <p className="text-gray-400 text-sm">Explore Indian stock market</p>
      </div>

      {/* Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map(idx => (
          <div key={idx.name} className="card p-4 flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-400">{idx.name}</div>
              <div className="text-xl font-bold">{formatCurrency(idx.value)}</div>
            </div>
            <div className={`text-right ${getPnlColor(idx.change)}`}>
              <div className="flex items-center gap-1">{idx.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}{formatPercent(idx.changePercent)}</div>
            </div>
          </div>
        ))}
        {indices.length === 0 && !loading && (
          <div className="col-span-3 card p-4 text-center text-gray-500">Index data loading...</div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input className="input pl-10 max-w-md" placeholder="Search stocks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {/* Stocks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-4 animate-pulse"><div className="h-5 w-24 bg-surface-2 rounded mb-2" /><div className="h-4 w-32 bg-surface-2 rounded mb-3" /><div className="h-6 w-20 bg-surface-2 rounded" /></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStocks.map(stock => {
            const quote = quotes.get(stock.symbol);
            return (
              <Link key={stock.symbol} to={`/stock/${stock.symbol}`} className="card p-4 hover:bg-surface-2/50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold group-hover:text-brand-400 transition-colors">{displaySymbol(stock.symbol)}</div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{stock.companyName}</div>
                  </div>
                  <span className="badge-info text-[10px]">{stock.exchange}</span>
                </div>
                {quote ? (
                  <div className="flex justify-between items-end">
                    <div className="text-lg font-bold">{formatCurrency(quote.ltp)}</div>
                    <div className={`text-sm font-medium ${getPnlColor(quote.change)}`}>
                      {formatPercent(quote.changePercent)}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Loading...</div>
                )}
                {quote && <div className="text-xs text-gray-500 mt-1">Vol: {formatVolume(quote.volume)}</div>}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
