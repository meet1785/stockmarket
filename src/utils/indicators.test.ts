import { describe, it, expect } from 'vitest';
import { sma, ema, rsi, macd, bollingerBands } from './indicators';
import type { Candle } from '../types';

const mockCandle = (close: number): Candle => ({
  time: Date.now(),
  open: close,
  high: close,
  low: close,
  close,
  volume: 1000
});

describe('indicators', () => {
  describe('sma', () => {
    it('calculates SMA and verifies length', () => {
      const data = [10, 20, 30, 40, 50];
      const period = 3;
      const result = sma(data, period);
      
      expect(result.length).toBe(data.length);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBe(20); // (10+20+30)/3
      expect(result[3]).toBe(30); // (20+30+40)/3
      expect(result[4]).toBe(40); // (30+40+50)/3
    });
  });

  describe('ema', () => {
    it('calculates EMA and verifies length', () => {
      const data = [10, 20, 30, 40, 50];
      const period = 3;
      const result = ema(data, period);
      
      expect(result.length).toBe(data.length);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBe(20); // SMA for first val
      // Multiplier = 2/4 = 0.5
      // i=3: (40 - 20) * 0.5 + 20 = 30
      expect(result[3]).toBe(30);
      // i=4: (50 - 30) * 0.5 + 30 = 40
      expect(result[4]).toBe(40);
    });
  });

  describe('rsi', () => {
    it('calculates RSI close to 100 for all gains', () => {
      const candles = [10, 20, 30, 40, 50, 60].map(mockCandle);
      const period = 3;
      const result = rsi(candles, period);
      
      expect(result.length).toBe(candles.length);
      // After period, avgLoss is 0, so RSI is 100
      expect(result[3]).toBe(100);
      expect(result[4]).toBe(100);
    });

    it('calculates RSI close to 0 for all losses', () => {
      const candles = [60, 50, 40, 30, 20, 10].map(mockCandle);
      const period = 3;
      const result = rsi(candles, period);
      
      expect(result[3]).toBe(0);
      expect(result[4]).toBe(0);
    });

    it('calculates RSI between 0-100 for mixed data', () => {
      const candles = [10, 20, 15, 25, 20, 30].map(mockCandle);
      const period = 3;
      const result = rsi(candles, period);
      
      const val = result[4];
      expect(val).not.toBeNull();
      expect(val).toBeGreaterThan(0);
      expect(val).toBeLessThan(100);
    });

    it('handles constant data', () => {
      const candles = [10, 10, 10, 10, 10].map(mockCandle);
      const period = 3;
      const result = rsi(candles, period);
      // Gains and losses both 0, avgLoss = 0 -> returns 100 based on implementation
      expect(result[3]).toBe(100);
    });
  });

  describe('macd', () => {
    it('returns macd, signal, and histogram arrays correctly', () => {
      const candles = [10, 12, 11, 14, 15, 13, 16, 18, 17, 20, 21, 23, 22, 25].map(mockCandle);
      const result = macd(candles, 3, 6, 3);
      
      expect(result.macdLine.length).toBe(candles.length);
      expect(result.signal.length).toBe(candles.length);
      expect(result.histogram.length).toBe(candles.length);
      
      // Find first non-null index
      const firstValid = result.histogram.findIndex(v => v !== null);
      if (firstValid !== -1) {
        expect(result.histogram[firstValid]).toBeCloseTo(result.macdLine[firstValid]! - result.signal[firstValid]!);
      }
    });
  });

  describe('bollingerBands', () => {
    it('returns upper, middle, lower arrays and validates relations', () => {
      const candles = [10, 12, 11, 14, 15, 13].map(mockCandle);
      const period = 3;
      const result = bollingerBands(candles, period, 2);
      
      expect(result.upper.length).toBe(candles.length);
      expect(result.middle.length).toBe(candles.length);
      expect(result.lower.length).toBe(candles.length);
      
      const i = 3; // First valid index for period 3
      expect(result.middle[i]).not.toBeNull();
      
      expect(result.upper[i]!).toBeGreaterThan(result.middle[i]!);
      expect(result.lower[i]!).toBeLessThan(result.middle[i]!);
    });
    
    it('band width changes with stdDev parameter', () => {
      const candles = [10, 12, 11, 14, 15, 13].map(mockCandle);
      const period = 3;
      const result1 = bollingerBands(candles, period, 1);
      const result2 = bollingerBands(candles, period, 2);
      
      const width1 = result1.upper[3]! - result1.lower[3]!;
      const width2 = result2.upper[3]! - result2.lower[3]!;
      
      expect(width2).toBeGreaterThan(width1);
    });
  });
});
