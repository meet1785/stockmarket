import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Briefcase, BarChart2, BookOpen } from 'lucide-react';

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Link to="/trade" className="card p-4 hover:bg-surface-2 transition-colors border border-green-500/20 hover:border-green-500/40 group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
            <ShoppingCart className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Buy Stock</h3>
            <p className="text-xs text-surface-400">Trade real market data</p>
          </div>
        </div>
      </Link>

      <Link to="/portfolio" className="card p-4 hover:bg-surface-2 transition-colors group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
            <Briefcase className="w-6 h-6 text-brand-500" />
          </div>
          <div>
            <h3 className="font-bold mb-1">View Portfolio</h3>
            <p className="text-xs text-surface-400">Track your holdings</p>
          </div>
        </div>
      </Link>

      <Link to="/markets" className="card p-4 hover:bg-surface-2 transition-colors group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
            <BarChart2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Market Screener</h3>
            <p className="text-xs text-surface-400">Find opportunities</p>
          </div>
        </div>
      </Link>

      <Link to="/learn" className="card p-4 hover:bg-surface-2 transition-colors group">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
            <BookOpen className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Start Learning</h3>
            <p className="text-xs text-surface-400">Master the markets</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
