import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  ArrowLeftRight, 
  ClipboardList, 
  Briefcase, 
  Eye, 
  GraduationCap, 
  Trophy, 
  BarChart3, 
  Settings,
  X
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { formatNumber } from '../../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/markets', label: 'Markets', icon: Globe },
  { path: '/trade', label: 'Trade', icon: ArrowLeftRight },
  { path: '/orders', label: 'Orders', icon: ClipboardList },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/watchlists', label: 'Watchlists', icon: Eye },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/challenges', label: 'Challenges', icon: Trophy },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 bg-surface-1 border-r border-surface-2
        flex flex-col transition-transform duration-300 ease-in-out
        w-64 md:w-64 lg:w-64 md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex items-center justify-between p-4 md:hidden border-b border-surface-2 h-16">
        <span className="font-bold text-lg text-white">Menu</span>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg bg-surface-2">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onClose();
                }
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors
                ${isActive 
                  ? 'bg-brand-600/10 text-brand-400' 
                  : 'text-gray-400 hover:text-white hover:bg-surface-2'
                }
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {user && (
        <div className="p-4 border-t border-surface-2 bg-surface-1/50 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold shrink-0">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold truncate text-white">{user.username}</div>
              <div className="text-xs text-brand-400">Level {user.level || 1} Trader</div>
            </div>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">XP Progress</span>
              <span className="text-gray-300">{formatNumber(user.xp || 0)} / {formatNumber((user.level || 1) * 1000)}</span>
            </div>
            <div className="h-1.5 w-full bg-surface-3 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${Math.min(100, ((user.xp || 0) / ((user.level || 1) * 1000)) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
