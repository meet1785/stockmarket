import type { Candle } from '../types';

/**
 * Simple Moving Average
 */
export function sma(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

/**
 * Exponential Moving Average
 */
export function ema(data: number[], period: number): (number | null)[] {
  const result: (number | null)[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      const avg = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
      result.push(avg);
    } else {
      const prev = result[i - 1]!;
      result.push((data[i] - prev) * multiplier + prev);
    }
  }
  return result;
}

/**
 * Relative Strength Index
 */
export function rsi(candles: Candle[], period = 14): (number | null)[] {
  const closes = candles.map(c => c.close);
  const result: (number | null)[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }

    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);

    if (i < period) {
      result.push(null);
    } else if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    } else {
      const prevRsi = result[i - 1];
      if (prevRsi === null) {
        result.push(null);
        continue;
      }
      // Smoothed RS
      const prevAvgGain = gains.slice(i - period, i - 1).reduce((a, b) => a + b, 0) / period;
      const prevAvgLoss = losses.slice(i - period, i - 1).reduce((a, b) => a + b, 0) / period;
      const avgGain = (prevAvgGain * (period - 1) + gains[i - 1]) / period;
      const avgLoss = (prevAvgLoss * (period - 1) + losses[i - 1]) / period;
      if (avgLoss === 0) {
        result.push(100);
      } else {
        const rs = avgGain / avgLoss;
        result.push(100 - 100 / (1 + rs));
      }
    }
  }
  return result;
}

/**
 * MACD (Moving Average Convergence Divergence)
 */
export function macd(candles: Candle[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  const closes = candles.map(c => c.close);
  const fastEma = ema(closes, fastPeriod);
  const slowEma = ema(closes, slowPeriod);

  const macdLine: (number | null)[] = fastEma.map((f, i) => {
    const s = slowEma[i];
    if (f === null || s === null) return null;
    return f - s;
  });

  const macdValues = macdLine.filter((v): v is number => v !== null);
  const signalValues = ema(macdValues, signalPeriod);

  const signal: (number | null)[] = [];
  let macdIdx = 0;
  for (let i = 0; i < macdLine.length; i++) {
    if (macdLine[i] === null) {
      signal.push(null);
    } else {
      signal.push(signalValues[macdIdx] ?? null);
      macdIdx++;
    }
  }

  const histogram: (number | null)[] = macdLine.map((m, i) => {
    const s = signal[i];
    if (m === null || s === null) return null;
    return m - s;
  });

  return { macdLine, signal, histogram };
}

/**
 * Bollinger Bands
 */
export function bollingerBands(candles: Candle[], period = 20, stdDev = 2) {
  const closes = candles.map(c => c.close);
  const middle = sma(closes, period);

  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const avg = middle[i]!;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / period;
      const sd = Math.sqrt(variance) * stdDev;
      upper.push(avg + sd);
      lower.push(avg - sd);
    }
  }

  return { upper, middle, lower };
}
