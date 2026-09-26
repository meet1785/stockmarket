import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMarketDataStore } from '../stores/marketDataStore';
import OrderTicket from '../components/trading/OrderTicket';
import StockSearch from '../components/trading/StockSearch';
import StockChart from '../components/chart/StockChart';
import { displaySymbol, formatCurrency, formatPercent, formatChange, getPnlColor } from '../utils/formatters';
import type { StockQuote } from '../types';

export default function TradePage() {
  const { symbol } = useParams<{ symbol?: string }>();
  const [searchParams] = useSearchParams();
  const querySymbol = searchParams.get('symbol');
  const activeSymbol = symbol || querySymbol;

  const { fetchQuote } = useMarketDataStore();
  const [quote, setQuote] = useState<StockQuote | null>(null);

  useEffect(() => {
    if (activeSymbol) {
      fetchQuote(activeSymbol).then(q => { if (q) setQuote(q); });
      const interval = setInterval(() => {
        fetchQuote(activeSymbol).then(q => { if (q) setQuote(q); });
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [activeSymbol, fetchQuote]);

  if (!activeSymbol) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Start Trading</h1>
        <StockSearch />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{displaySymbol(activeSymbol)}</h1>
            <p className="text-gray-400">{quote?.companyName || activeSymbol}</p>
          </div>
          {quote ? (
            <div className="text-right">
              <div className="text-3xl font-bold">{formatCurrency(quote.ltp)}</div>
              <div className={`text-lg ${getPnlColor(quote.change)}`}>
                {formatChange(quote.change)} ({formatPercent(quote.changePercent)})
              </div>
            </div>
          ) : (
            <div className="animate-pulse bg-surface-2 h-12 w-32 rounded" />
          )}
        </div>
        <StockChart symbol={activeSymbol} />
      </div>
      <div className="w-full md:w-[380px]">
        <OrderTicket
          symbol={activeSymbol}
          companyName={quote?.companyName || displaySymbol(activeSymbol)}
          exchange={activeSymbol.endsWith('.BO') ? 'BSE' : 'NSE'}
          currentPrice={quote?.ltp || 0}
        />
      </div>
    </div>
  );
}
