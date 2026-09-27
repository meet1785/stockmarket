import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchStocks, getMarketStatus } from './marketData';
import { POPULAR_STOCKS } from '../utils/constants';

describe('marketData', () => {
  describe('searchStocks', () => {
    it('returns results matching symbol', () => {
      const results = searchStocks('RELIANCE');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].symbol).toBe('RELIANCE.NS');
    });

    it('returns results matching company name', () => {
      const results = searchStocks('Reliance Industries');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].companyName).toContain('Reliance');
    });

    it('is case insensitive', () => {
      const results = searchStocks('reliance');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].symbol).toBe('RELIANCE.NS');
    });

    it('returns empty array for empty query', () => {
      expect(searchStocks('')).toEqual([]);
      expect(searchStocks('   ')).toEqual([]);
    });

    it('returns max 10 results', () => {
      // Find a query that matches many items, like "a" or "i"
      const results = searchStocks('a');
      expect(results.length).toBeLessThanOrEqual(10);
    });

    it('strips .NS suffix when matching via displaySymbol', () => {
      // 'RELIANCE' without .NS should still match because of displaySymbol logic
      const results = searchStocks('RELIANCE');
      expect(results.some(r => r.symbol === 'RELIANCE.NS')).toBe(true);
    });
  });

  describe('getMarketStatus', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns closed on weekends', () => {
      // Set to a Sunday (Jan 1, 2023 was a Sunday)
      vi.setSystemTime(new Date('2023-01-01T12:00:00Z'));
      const status = getMarketStatus();
      expect(status.isOpen).toBe(false);
      expect(status.status).toBe('CLOSED');
    });

    it('returns PRE_OPEN during pre-market hours (e.g. 9:05 AM IST)', () => {
      // Monday Jan 2, 2023, 9:05 AM IST -> 3:35 AM UTC
      vi.setSystemTime(new Date('2023-01-02T03:35:00Z'));
      const status = getMarketStatus();
      expect(status.isOpen).toBe(false);
      expect(status.status).toBe('PRE_OPEN');
    });

    it('returns OPEN during market hours (e.g. 10:00 AM IST)', () => {
      // Monday Jan 2, 2023, 10:00 AM IST -> 4:30 AM UTC
      vi.setSystemTime(new Date('2023-01-02T04:30:00Z'));
      const status = getMarketStatus();
      expect(status.isOpen).toBe(true);
      expect(status.status).toBe('OPEN');
    });

    it('returns POST_MARKET after market closes (e.g. 3:45 PM IST)', () => {
      // Monday Jan 2, 2023, 3:45 PM IST -> 10:15 AM UTC
      vi.setSystemTime(new Date('2023-01-02T10:15:00Z'));
      const status = getMarketStatus();
      expect(status.isOpen).toBe(false);
      expect(status.status).toBe('POST_MARKET');
    });

    it('returns CLOSED at night (e.g. 8:00 PM IST)', () => {
      // Monday Jan 2, 2023, 8:00 PM IST -> 2:30 PM UTC
      vi.setSystemTime(new Date('2023-01-02T14:30:00Z'));
      const status = getMarketStatus();
      expect(status.isOpen).toBe(false);
      expect(status.status).toBe('CLOSED');
    });
  });
});
