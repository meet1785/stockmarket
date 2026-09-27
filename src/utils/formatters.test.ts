import { describe, it, expect, vi } from 'vitest';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatChange,
  formatVolume,
  formatTime,
  formatDate,
  formatDateTime,
  getPnlColor,
  getPnlBgColor,
  displaySymbol,
  generateId,
  clamp
} from './formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('formats normal values correctly', () => {
      // The exact output might vary by Node version/Intl implementation slightly, but generally includes ₹ and commas.
      const formatted = formatCurrency(1234.56);
      expect(formatted).toContain('₹');
      expect(formatted).toContain('1,234.56');
    });

    it('formats negative values correctly', () => {
      const formatted = formatCurrency(-1234.56);
      expect(formatted).toContain('₹');
      expect(formatted).toContain('1,234.56');
      expect(formatted).toMatch(/-/); // some environments put negative before symbol
    });

    it('formats zero correctly', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toContain('₹');
      expect(formatted).toContain('0.00');
    });

    it('formats large numbers correctly in non-compact mode', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('10,00,000');
    });

    it('formats in compact mode for Cr', () => {
      expect(formatCurrency(15000000, true)).toBe('₹1.50 Cr');
    });

    it('formats in compact mode for L', () => {
      expect(formatCurrency(150000, true)).toBe('₹1.50 L');
    });

    it('formats in compact mode for K', () => {
      expect(formatCurrency(1500, true)).toBe('₹1.5K');
    });

    it('formats in compact mode for small values', () => {
      expect(formatCurrency(500, true)).toContain('500.00');
    });
  });

  describe('formatNumber', () => {
    it('formats with Indian commas and defaults to 2 decimals', () => {
      expect(formatNumber(100000)).toBe('1,00,000.00');
    });

    it('formats with specific decimals', () => {
      expect(formatNumber(100000, 0)).toBe('1,00,000');
    });
  });

  describe('formatPercent', () => {
    it('formats positive percentages with +', () => {
      expect(formatPercent(5.5)).toBe('+5.50%');
    });

    it('formats negative percentages without extra +', () => {
      expect(formatPercent(-5.5)).toBe('-5.50%');
    });

    it('formats zero with +', () => {
      expect(formatPercent(0)).toBe('+0.00%');
    });
  });

  describe('formatChange', () => {
    it('formats positive change with +', () => {
      expect(formatChange(150.5)).toBe('+150.50');
    });

    it('formats negative change', () => {
      expect(formatChange(-150.5)).toBe('-150.50');
    });

    it('formats zero change', () => {
      expect(formatChange(0)).toBe('+0.00');
    });
  });

  describe('formatVolume', () => {
    it('formats Cr', () => {
      expect(formatVolume(15000000)).toBe('1.5 Cr');
    });

    it('formats L', () => {
      expect(formatVolume(150000)).toBe('1.5 L');
    });

    it('formats K', () => {
      expect(formatVolume(1500)).toBe('1.5K');
    });

    it('formats plain number', () => {
      expect(formatVolume(500)).toBe('500');
    });
  });

  describe('formatTime', () => {
    it('formats timestamp to time string in IST', () => {
      const date = new Date('2023-01-01T10:00:00Z'); // 15:30 IST
      expect(formatTime(date.getTime())).toMatch(/0?3:30\s*(pm|PM)/i);
    });
  });

  describe('formatDate', () => {
    it('formats date string to IST', () => {
      expect(formatDate('2023-01-01T10:00:00Z')).toMatch(/0?1\s+Jan\s+2023/i);
    });
  });

  describe('formatDateTime', () => {
    it('formats date and time string to IST', () => {
      const dt = formatDateTime('2023-01-01T10:00:00Z');
      expect(dt).toMatch(/0?1\s+Jan/i);
      expect(dt).toMatch(/0?3:30\s*(pm|PM)/i);
    });
  });

  describe('getPnlColor', () => {
    it('returns green for positive', () => {
      expect(getPnlColor(100)).toBe('text-green-400');
    });

    it('returns red for negative', () => {
      expect(getPnlColor(-100)).toBe('text-red-400');
    });

    it('returns gray for zero', () => {
      expect(getPnlColor(0)).toBe('text-gray-400');
    });
  });

  describe('getPnlBgColor', () => {
    it('returns green bg for positive', () => {
      expect(getPnlBgColor(100)).toBe('bg-green-500/20 text-green-400');
    });

    it('returns red bg for negative', () => {
      expect(getPnlBgColor(-100)).toBe('bg-red-500/20 text-red-400');
    });

    it('returns gray bg for zero', () => {
      expect(getPnlBgColor(0)).toBe('bg-gray-500/20 text-gray-400');
    });
  });

  describe('displaySymbol', () => {
    it('removes .NS', () => {
      expect(displaySymbol('RELIANCE.NS')).toBe('RELIANCE');
    });

    it('removes .BO', () => {
      expect(displaySymbol('TCS.BO')).toBe('TCS');
    });

    it('keeps plain symbols as is', () => {
      expect(displaySymbol('INFY')).toBe('INFY');
    });
  });

  describe('generateId', () => {
    it('generates unique strings', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('clamp', () => {
    it('clamps to min', () => {
      expect(clamp(5, 10, 20)).toBe(10);
    });

    it('clamps to max', () => {
      expect(clamp(25, 10, 20)).toBe(20);
    });

    it('keeps value in range', () => {
      expect(clamp(15, 10, 20)).toBe(15);
    });
  });
});
