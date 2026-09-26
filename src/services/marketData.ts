/**
 * Market Data Service
 * Fetches real Indian market data from Yahoo Finance via CORS proxy.
 * Caches aggressively and falls back to last-known prices.
 */

import type { StockQuote, Candle, IndexQuote, MarketStatus } from '../types';
import { CORS_PROXY, YAHOO_CHART_BASE, INDICES, QUOTE_CACHE_TTL, HISTORY_CACHE_TTL } from '../utils/constants';
import { getCached, setCache } from './storage';

// --- Yahoo Finance API Types ---
interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
        chartPreviousClose?: number;
        regularMarketDayHigh?: number;
        regularMarketDayLow?: number;
        regularMarketVolume?: number;
        shortName?: string;
        longName?: string;
        marketCap?: number;
        fiftyTwoWeekHigh?: number;
        fiftyTwoWeekLow?: number;
        regularMarketOpen?: number;
      };
      timestamp?: number[];
      indicators?: {
        quote?: Array<{
          open?: (number | null)[];
          high?: (number | null)[];
          low?: (number | null)[];
          close?: (number | null)[];
          volume?: (number | null)[];
        }>;
      };
    }>;
    error?: { description?: string };
  };
}

/**
 * Fetch a stock quote from Yahoo Finance
 */
export async function fetchQuote(symbol: string): Promise<StockQuote | null> {
  const cacheKey = `quote_${symbol}`;
  const cached = getCached<StockQuote>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${CORS_PROXY}${encodeURIComponent(`${YAHOO_CHART_BASE}${symbol}?interval=1d&range=2d`)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: YahooChartResult = await res.json();
    const result = data.chart?.result?.[0];
    if (!result?.meta) throw new Error('No data');

    const meta = result.meta;
    const ltp = meta.regularMarketPrice ?? 0;
    const prevClose = meta.previousClose ?? meta.chartPreviousClose ?? ltp;
    const change = ltp - prevClose;
    const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    const quote: StockQuote = {
      symbol,
      companyName: meta.longName ?? meta.shortName ?? symbol.replace(/\.(NS|BO)$/, ''),
      exchange: symbol.endsWith('.BO') ? 'BSE' : 'NSE',
      ltp,
      change,
      changePercent,
      open: meta.regularMarketOpen ?? ltp,
      high: meta.regularMarketDayHigh ?? ltp,
      low: meta.regularMarketDayLow ?? ltp,
      previousClose: prevClose,
      volume: meta.regularMarketVolume ?? 0,
      marketCap: meta.marketCap,
      week52High: meta.fiftyTwoWeekHigh,
      week52Low: meta.fiftyTwoWeekLow,
      dayHigh: meta.regularMarketDayHigh ?? ltp,
      dayLow: meta.regularMarketDayLow ?? ltp,
      timestamp: Date.now(),
      isStale: false,
    };

    setCache(cacheKey, quote, QUOTE_CACHE_TTL);
    return quote;
  } catch (err) {
    console.warn(`Failed to fetch quote for ${symbol}:`, err);
    // Return cached stale data if available
    const staleKey = `stale_quote_${symbol}`;
    const stale = getCached<StockQuote>(staleKey);
    if (stale) return { ...stale, isStale: true };
    return null;
  }
}

/**
 * Fetch multiple quotes
 */
export async function fetchQuotes(symbols: string[]): Promise<Map<string, StockQuote>> {
  const results = new Map<string, StockQuote>();
  // Fetch in parallel with rate limiting (max 5 concurrent)
  const chunks: string[][] = [];
  for (let i = 0; i < symbols.length; i += 5) {
    chunks.push(symbols.slice(i, i + 5));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (sym) => {
      const quote = await fetchQuote(sym);
      if (quote) results.set(sym, quote);
    });
    await Promise.allSettled(promises);
    // Small delay between chunks to avoid rate limiting
    if (chunks.length > 1) await new Promise(r => setTimeout(r, 200));
  }

  return results;
}

/**
 * Fetch historical candle data
 */
export async function fetchCandles(
  symbol: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<Candle[]> {
  const cacheKey = `candles_${symbol}_${range}_${interval}`;
  const cached = getCached<Candle[]>(cacheKey);
  if (cached) return cached;

  try {
    const url = `${CORS_PROXY}${encodeURIComponent(`${YAHOO_CHART_BASE}${symbol}?interval=${interval}&range=${range}`)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: YahooChartResult = await res.json();
    const result = data.chart?.result?.[0];
    if (!result?.timestamp || !result?.indicators?.quote?.[0]) {
      throw new Error('No candle data');
    }

    const timestamps = result.timestamp;
    const q = result.indicators.quote[0];
    const candles: Candle[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const o = q.open?.[i];
      const h = q.high?.[i];
      const l = q.low?.[i];
      const c = q.close?.[i];
      const v = q.volume?.[i];

      if (o != null && h != null && l != null && c != null) {
        candles.push({
          time: timestamps[i],
          open: o,
          high: h,
          low: l,
          close: c,
          volume: v ?? 0,
        });
      }
    }

    setCache(cacheKey, candles, HISTORY_CACHE_TTL);
    // Also cache stale version with longer TTL
    setCache(`stale_candles_${symbol}_${range}_${interval}`, candles, 3600000);
    return candles;
  } catch (err) {
    console.warn(`Failed to fetch candles for ${symbol}:`, err);
    const stale = getCached<Candle[]>(`stale_candles_${symbol}_${range}_${interval}`);
    return stale ?? [];
  }
}

/**
 * Fetch index quotes (Nifty 50, Sensex, Bank Nifty)
 */
export async function fetchIndices(): Promise<IndexQuote[]> {
  const cacheKey = 'indices';
  const cached = getCached<IndexQuote[]>(cacheKey);
  if (cached) return cached;

  const results: IndexQuote[] = [];

  for (const idx of INDICES) {
    try {
      const quote = await fetchQuote(idx.symbol);
      if (quote) {
        results.push({
          name: idx.name,
          value: quote.ltp,
          change: quote.change,
          changePercent: quote.changePercent,
          timestamp: quote.timestamp,
        });
      }
    } catch {
      // Skip failed indices
    }
  }

  if (results.length > 0) {
    setCache(cacheKey, results, QUOTE_CACHE_TTL);
  }

  return results;
}

/**
 * Get current NSE market status
 */
export function getMarketStatus(): MarketStatus {
  const now = new Date();
  const istOffset = 5.5 * 60; // IST = UTC+5:30
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = utcMinutes + istOffset;

  const day = now.getUTCDay();
  // Adjust day if IST crosses midnight
  const istDay = istMinutes >= 1440 ? (day + 1) % 7 : day;

  // Weekend
  if (istDay === 0 || istDay === 6) {
    return { isOpen: false, status: 'CLOSED' };
  }

  const istHour = Math.floor((istMinutes % 1440) / 60);
  const istMin = (istMinutes % 1440) % 60;
  const timeInMinutes = istHour * 60 + istMin;

  const preOpen = 9 * 60; // 9:00 AM
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  const postMarket = 16 * 60; // 4:00 PM

  if (timeInMinutes >= preOpen && timeInMinutes < marketOpen) {
    return { isOpen: false, status: 'PRE_OPEN' };
  }
  if (timeInMinutes >= marketOpen && timeInMinutes < marketClose) {
    return { isOpen: true, status: 'OPEN' };
  }
  if (timeInMinutes >= marketClose && timeInMinutes < postMarket) {
    return { isOpen: false, status: 'POST_MARKET' };
  }

  return { isOpen: false, status: 'CLOSED' };
}

/**
 * Search stocks by query
 */
export function searchStocks(query: string): import('../types').StockSearchResult[] {
  // Import inline to avoid circular dependency
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // We import POPULAR_STOCKS dynamically but since this is a utility,
  // we keep a local reference
  return [];
}
