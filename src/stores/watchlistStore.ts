import { create } from 'zustand';
import type { Watchlist, WatchlistItem, PriceAlert } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { generateId } from '../utils/formatters';

interface WatchlistState {
  watchlists: Watchlist[];
  alerts: PriceAlert[];
  activeWatchlistId: string | null;

  createWatchlist: (name: string) => void;
  deleteWatchlist: (id: string) => void;
  renameWatchlist: (id: string, name: string) => void;
  setActiveWatchlist: (id: string) => void;

  addItem: (watchlistId: string, item: Omit<WatchlistItem, 'addedAt'>) => void;
  removeItem: (watchlistId: string, symbol: string) => void;

  addAlert: (alert: Omit<PriceAlert, 'id' | 'triggered' | 'createdAt'>) => void;
  removeAlert: (id: string) => void;
  triggerAlert: (id: string) => void;
}

const defaultWatchlists: Watchlist[] = [
  {
    id: 'default',
    name: 'My Watchlist',
    items: [
      { symbol: 'RELIANCE.NS', exchange: 'NSE', addedAt: new Date().toISOString() },
      { symbol: 'TCS.NS', exchange: 'NSE', addedAt: new Date().toISOString() },
      { symbol: 'HDFCBANK.NS', exchange: 'NSE', addedAt: new Date().toISOString() },
      { symbol: 'INFY.NS', exchange: 'NSE', addedAt: new Date().toISOString() },
      { symbol: 'ICICIBANK.NS', exchange: 'NSE', addedAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlists: loadFromStorage<Watchlist[]>('watchlists', defaultWatchlists),
  alerts: loadFromStorage<PriceAlert[]>('alerts', []),
  activeWatchlistId: loadFromStorage<string | null>('activeWatchlist', 'default'),

  createWatchlist: (name: string) => {
    const { watchlists } = get();
    const newWl: Watchlist = {
      id: generateId(),
      name,
      items: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...watchlists, newWl];
    saveToStorage('watchlists', updated);
    set({ watchlists: updated, activeWatchlistId: newWl.id });
  },

  deleteWatchlist: (id: string) => {
    const { watchlists, activeWatchlistId } = get();
    const updated = watchlists.filter(w => w.id !== id);
    const newActive = activeWatchlistId === id ? (updated[0]?.id ?? null) : activeWatchlistId;
    saveToStorage('watchlists', updated);
    set({ watchlists: updated, activeWatchlistId: newActive });
  },

  renameWatchlist: (id: string, name: string) => {
    const { watchlists } = get();
    const updated = watchlists.map(w => w.id === id ? { ...w, name } : w);
    saveToStorage('watchlists', updated);
    set({ watchlists: updated });
  },

  setActiveWatchlist: (id: string) => {
    saveToStorage('activeWatchlist', id);
    set({ activeWatchlistId: id });
  },

  addItem: (watchlistId: string, item) => {
    const { watchlists } = get();
    const updated = watchlists.map(w => {
      if (w.id !== watchlistId) return w;
      if (w.items.some(i => i.symbol === item.symbol)) return w;
      return { ...w, items: [...w.items, { ...item, addedAt: new Date().toISOString() }] };
    });
    saveToStorage('watchlists', updated);
    set({ watchlists: updated });
  },

  removeItem: (watchlistId: string, symbol: string) => {
    const { watchlists } = get();
    const updated = watchlists.map(w => {
      if (w.id !== watchlistId) return w;
      return { ...w, items: w.items.filter(i => i.symbol !== symbol) };
    });
    saveToStorage('watchlists', updated);
    set({ watchlists: updated });
  },

  addAlert: (alert) => {
    const { alerts } = get();
    const newAlert: PriceAlert = {
      ...alert,
      id: generateId(),
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...alerts, newAlert];
    saveToStorage('alerts', updated);
    set({ alerts: updated });
  },

  removeAlert: (id: string) => {
    const { alerts } = get();
    const updated = alerts.filter(a => a.id !== id);
    saveToStorage('alerts', updated);
    set({ alerts: updated });
  },

  triggerAlert: (id: string) => {
    const { alerts } = get();
    const updated = alerts.map(a => a.id === id ? { ...a, triggered: true } : a);
    saveToStorage('alerts', updated);
    set({ alerts: updated });
  },
}));
