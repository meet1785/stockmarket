import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useMarketDataStore } from '../stores/marketDataStore';
import { useWatchlistStore } from '../stores/watchlistStore';
import StockChart from '../components/chart/StockChart';
import { formatCurrency, formatPercent, formatChange, getPnlColor, displaySymbol, formatNumber, formatVolume } from '../utils/formatters';
import type { StockQuote } from '../types';

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const { fetchQuote, quotes } = useMarketDataStore();
  const { activeWatchlistId, addItem } = useWatchlistStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (symbol) { fetchQuote(symbol); }
  }, [symbol, fetchQuote]);

  if (!symbol) return <div className="p-8 text-center text-gray-400">No symbol selected</div>;

  const quote = quotes.get(symbol);

  const handleAddToWatchlist = () => {
    if (activeWatchlistId && quote) {
      addItem(activeWatchlistId, { symbol, exchange: quote.exchange });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link to="/markets" className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft className="h-4 w-4" /> Markets</Link>
          {quote ? (
            <div>
              <h1 className="text-3xl font-bold">{displaySymbol(symbol)}</h1>
              <p className="text-gray-400">{quote.companyName} · <span className="badge-info">{quote.exchange}</span></p>
              {quote.isStale && <div className="mt-1 flex items-center gap-1 text-yellow-400 text-xs"><AlertTriangle className="h-3 w-3" /> Data may be delayed</div>}
            </div>
          ) : (
            <div className="animate-pulse"><div className="h-8 w-48 bg-surface-2 rounded mb-2" /><div className="h-4 w-32 bg-surface-2 rounded" /></div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddToWatchlist} className="btn-ghost text-sm">{added ? '✓ Added' : <><Plus className="h-4 w-4 inline" /> Watchlist</>}</button>
          <Link to={`/trade/${symbol}`} className="btn-success text-sm">Buy</Link>
          <Link to={`/trade/${symbol}`} className="btn-danger text-sm">Sell</Link>
        </div>
      </div>

      {/* Price */}
      {quote && (
        <div className="flex items-end gap-4">
          <span className="text-4xl font-bold">{formatCurrency(quote.ltp)}</span>
          <div className={`text-lg font-medium flex items-center gap-1 ${getPnlColor(quote.change)}`}>
            {quote.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
          </div>
        </div>
      )}

      {/* Chart */}
      <StockChart symbol={symbol} />

      {/* Stats Grid */}
      {quote && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[
            { label: 'Open', value: formatCurrency(quote.open) },
            { label: 'Day High', value: formatCurrency(quote.dayHigh) },
            { label: 'Day Low', value: formatCurrency(quote.dayLow) },
            { label: 'Prev Close', value: formatCurrency(quote.previousClose) },
            { label: 'Volume', value: formatVolume(quote.volume) },
            ...(quote.week52High ? [{ label: '52W High', value: formatCurrency(quote.week52High) }] : []),
            ...(quote.week52Low ? [{ label: '52W Low', value: formatCurrency(quote.week52Low) }] : []),
            ...(quote.marketCap ? [{ label: 'Market Cap', value: formatCurrency(quote.marketCap, true) }] : []),
            ...(quote.pe ? [{ label: 'P/E', value: formatNumber(quote.pe) }] : []),
            ...(quote.dividendYield ? [{ label: 'Div Yield', value: formatPercent(quote.dividendYield) }] : []),
          ].map(stat => (
            <div key={stat.label} className="card p-3">
              <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
              <div className="font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
