import { create } from 'zustand';
import type { StockQuote, IndexQuote, MarketStatus } from '../types';
import { fetchQuote, fetchQuotes, fetchIndices, getMarketStatus } from '../services/marketData';

interface MarketDataState {
  quotes: Map<string, StockQuote>;
  indices: IndexQuote[];
  marketStatus: MarketStatus;
  isLoading: boolean;
  lastUpdated: number | null;

  fetchQuote: (symbol: string) => Promise<StockQuote | null>;
  fetchMultipleQuotes: (symbols: string[]) => Promise<void>;
  refreshIndices: () => Promise<void>;
  refreshMarketStatus: () => void;
}

export const useMarketDataStore = create<MarketDataState>((set, get) => ({
  quotes: new Map(),
  indices: [],
  marketStatus: getMarketStatus(),
  isLoading: false,
  lastUpdated: null,

  fetchQuote: async (symbol: string) => {
    const quote = await fetchQuote(symbol);
    if (quote) {
      set(state => {
        const newQuotes = new Map(state.quotes);
        newQuotes.set(symbol, quote);
        return { quotes: newQuotes, lastUpdated: Date.now() };
      });
    }
    return quote;
  },

  fetchMultipleQuotes: async (symbols: string[]) => {
    set({ isLoading: true });
    const results = await fetchQuotes(symbols);
    set(state => {
      const newQuotes = new Map(state.quotes);
      results.forEach((quote, symbol) => newQuotes.set(symbol, quote));
      return { quotes: newQuotes, isLoading: false, lastUpdated: Date.now() };
    });
  },

  refreshIndices: async () => {
    const indices = await fetchIndices();
    if (indices.length > 0) {
      set({ indices });
    }
  },

  refreshMarketStatus: () => {
    set({ marketStatus: getMarketStatus() });
  },
}));
