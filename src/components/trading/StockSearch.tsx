import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { POPULAR_STOCKS } from '../../utils/constants';

export default function StockSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query) return POPULAR_STOCKS.slice(0, 5);
    const lowerQuery = query.toLowerCase();
    return POPULAR_STOCKS.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(lowerQuery) ||
        stock.companyName.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
  }, [query]);

  const handleSelect = (symbol: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/trade/${symbol}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="input w-full pl-10 pr-3 py-2"
          placeholder="Search stocks to trade..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-surface-1 border border-surface-2 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.length > 0 ? (
            <ul className="py-1 text-base sm:text-sm">
              {results.map((stock) => (
                <li
                  key={stock.symbol}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-surface-2 text-white"
                  onClick={() => handleSelect(stock.symbol)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="block font-medium truncate">{stock.symbol}</span>
                      <span className="block text-xs text-gray-400 truncate">{stock.companyName}</span>
                    </div>
                    <span className="badge badge-info text-xs">{stock.exchange}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-3 px-4 text-sm text-gray-400 text-center">
              No stocks found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
