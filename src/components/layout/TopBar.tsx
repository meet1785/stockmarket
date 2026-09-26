import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Search, Menu } from 'lucide-react';
import { useMarketDataStore } from '../../stores/marketDataStore';
import { formatNumber, formatPercent } from '../../utils/formatters';

interface TopBarProps {
  onMenuToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle }) => {
  const { indices, marketStatus, refreshIndices, refreshMarketStatus } = useMarketDataStore();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Initial fetch
    refreshIndices();
    refreshMarketStatus();

    // Fetch every 30s
    const dataInterval = setInterval(() => {
      refreshIndices();
      refreshMarketStatus();
    }, 30000);

    return () => clearInterval(dataInterval);
  }, [refreshIndices, refreshMarketStatus]);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'PRE_OPEN': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CLOSED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-surface-2 text-gray-400';
    }
  };

  return (
    <header className="h-16 border-b border-surface-2 bg-surface-1 px-4 flex items-center justify-between shrink-0 z-40 relative">
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <Link to="/" className="flex items-center gap-2 text-brand-500 font-bold text-xl">
          <TrendingUp className="h-6 w-6 text-brand-400" />
          <span className="hidden sm:inline text-white">PaperTrade <span className="text-brand-400">India</span></span>
        </Link>
      </div>

      {/* Market Indices - Hidden on small screens */}
      <div className="hidden lg:flex items-center gap-6 overflow-hidden">
        {indices && indices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div key={index.name} className="flex flex-col text-sm">
              <span className="text-gray-400 text-xs">{index.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{formatNumber(index.value)}</span>
                <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
                  {formatPercent(index.changePercent)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {/* Market Status & Time */}
        <div className="hidden md:flex flex-col items-end text-xs">
          <span className="text-gray-400 font-mono">{currentTime} IST</span>
          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold mt-0.5 ${getStatusColor(marketStatus.status)}`}>
            {marketStatus.status.replace('_', ' ')}
          </span>
        </div>
        
        <Link to="/markets" className="p-2 bg-surface-2 hover:bg-surface-3 rounded-full text-gray-300 transition-colors">
          <Search className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
};

export default TopBar;
