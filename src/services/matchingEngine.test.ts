import { describe, it, expect } from 'vitest';
import {
  calculateCharges,
  tryFillMarketOrder,
  shouldFillLimitOrder,
  shouldTriggerStopOrder,
  tryFillLimitOrder,
  createOrder,
  estimateRequiredCapital
} from './matchingEngine';
import type { Order, OrderRequest, StockQuote } from '../types';
import { DEFAULT_BROKERAGE } from '../utils/constants';

const mockQuote = (ltp: number): StockQuote => ({
  symbol: 'RELIANCE.NS', companyName: 'Reliance Industries', exchange: 'NSE',
  ltp, change: 0, changePercent: 0, open: ltp, high: ltp, low: ltp,
  previousClose: ltp, volume: 1000000, dayHigh: ltp, dayLow: ltp,
  timestamp: Date.now(), isStale: false,
});

const mockOrder = (overrides: Partial<Order> = {}): Order => ({
  id: 'test-order-1', portfolioId: 'test-portfolio',
  symbol: 'RELIANCE.NS', companyName: 'Reliance Industries', exchange: 'NSE',
  side: 'BUY', type: 'MARKET', status: 'PENDING', quantity: 10,
  filledQuantity: 0, product: 'CNC', validity: 'DAY',
  charges: { brokerage: 0, stt: 0, exchangeCharges: 0, gst: 0, sebiCharges: 0, stampDuty: 0, total: 0 },
  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), fills: [],
  ...overrides,
});

describe('matchingEngine', () => {
  describe('calculateCharges', () => {
    it('calculates CNC BUY charges correctly', () => {
      const price = 1000;
      const quantity = 10;
      const charges = calculateCharges(price, quantity, 'BUY', 'CNC', DEFAULT_BROKERAGE);
      expect(charges.brokerage).toBe(0);
      expect(charges.stt).toBe(10); // 10000 * 0.001
      expect(charges.stampDuty).toBe(1.5); // 10000 * 0.00015
      
      const total = charges.brokerage + charges.stt + charges.exchangeCharges + charges.gst + charges.sebiCharges + charges.stampDuty;
      expect(charges.total).toBeCloseTo(total, 2);
    });

    it('calculates CNC SELL charges correctly', () => {
      const charges = calculateCharges(1000, 10, 'SELL', 'CNC', DEFAULT_BROKERAGE);
      expect(charges.brokerage).toBe(0);
      expect(charges.stt).toBe(10); 
      expect(charges.stampDuty).toBe(0); 
    });

    it('calculates MIS BUY charges correctly', () => {
      const charges = calculateCharges(1000, 10, 'BUY', 'MIS', DEFAULT_BROKERAGE);
      expect(charges.brokerage).toBe(3); // 10000 * 0.0003
      expect(charges.stt).toBe(0); 
      expect(charges.stampDuty).toBe(1.5); 
    });

    it('calculates MIS SELL charges correctly', () => {
      const charges = calculateCharges(1000, 10, 'SELL', 'MIS', DEFAULT_BROKERAGE);
      expect(charges.brokerage).toBe(3);
      expect(charges.stt).toBe(2.5); // 10000 * 0.00025
      expect(charges.stampDuty).toBe(0); 
    });

    it('handles zero quantity or zero price', () => {
      const charges = calculateCharges(0, 10, 'BUY', 'CNC', DEFAULT_BROKERAGE);
      expect(charges.total).toBe(0);
      
      const charges2 = calculateCharges(1000, 0, 'BUY', 'CNC', DEFAULT_BROKERAGE);
      expect(charges2.total).toBe(0);
    });
  });

  describe('tryFillMarketOrder', () => {
    it('fills order and calculates correctly for beginner mode (no slippage)', () => {
      const order = mockOrder();
      const quote = mockQuote(1000);
      const filled = tryFillMarketOrder(order, quote, 'beginner');
      
      expect(filled.status).toBe('FILLED');
      expect(filled.filledQuantity).toBe(10);
      expect(filled.avgFillPrice).toBe(1000);
      expect(filled.fills.length).toBe(1);
      expect(filled.charges.total).toBeGreaterThan(0);
    });
  });

  describe('shouldFillLimitOrder', () => {
    it('BUY LIMIT: fills when LTP <= limit price', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'BUY' });
      expect(shouldFillLimitOrder(order, mockQuote(990))).toBe(true);
      expect(shouldFillLimitOrder(order, mockQuote(1000))).toBe(true);
    });

    it('BUY LIMIT: does not fill when LTP > limit price', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'BUY' });
      expect(shouldFillLimitOrder(order, mockQuote(1010))).toBe(false);
    });

    it('SELL LIMIT: fills when LTP >= limit price', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'SELL' });
      expect(shouldFillLimitOrder(order, mockQuote(1010))).toBe(true);
      expect(shouldFillLimitOrder(order, mockQuote(1000))).toBe(true);
    });

    it('SELL LIMIT: does not fill when LTP < limit price', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'SELL' });
      expect(shouldFillLimitOrder(order, mockQuote(990))).toBe(false);
    });

    it('Non-LIMIT orders return false', () => {
      const order = mockOrder({ type: 'MARKET' });
      expect(shouldFillLimitOrder(order, mockQuote(1000))).toBe(false);
    });
  });

  describe('shouldTriggerStopOrder', () => {
    it('SELL STOP: triggers when LTP <= trigger price', () => {
      const order = mockOrder({ type: 'STOP', triggerPrice: 950, side: 'SELL' });
      expect(shouldTriggerStopOrder(order, mockQuote(940))).toBe(true);
      expect(shouldTriggerStopOrder(order, mockQuote(950))).toBe(true);
      expect(shouldTriggerStopOrder(order, mockQuote(960))).toBe(false);
    });

    it('BUY STOP: triggers when LTP >= trigger price', () => {
      const order = mockOrder({ type: 'STOP', triggerPrice: 1050, side: 'BUY' });
      expect(shouldTriggerStopOrder(order, mockQuote(1060))).toBe(true);
      expect(shouldTriggerStopOrder(order, mockQuote(1050))).toBe(true);
      expect(shouldTriggerStopOrder(order, mockQuote(1040))).toBe(false);
    });

    it('Non-STOP orders return false', () => {
      const order = mockOrder({ type: 'MARKET' });
      expect(shouldTriggerStopOrder(order, mockQuote(1000))).toBe(false);
    });
  });

  describe('tryFillLimitOrder', () => {
    it('returns filled order when conditions met', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'BUY' });
      const filled = tryFillLimitOrder(order, mockQuote(990), 'beginner');
      expect(filled).not.toBeNull();
      expect(filled!.status).toBe('FILLED');
      expect(filled!.avgFillPrice).toBe(1000);
      expect(filled!.fills[0].price).toBe(1000);
    });

    it('returns null when conditions not met', () => {
      const order = mockOrder({ type: 'LIMIT', price: 1000, side: 'BUY' });
      const filled = tryFillLimitOrder(order, mockQuote(1010), 'beginner');
      expect(filled).toBeNull();
    });
  });

  describe('createOrder', () => {
    it('creates order with all fields populated', () => {
      const request: OrderRequest = {
        symbol: 'RELIANCE.NS',
        companyName: 'Reliance',
        exchange: 'NSE',
        side: 'BUY',
        type: 'MARKET',
        quantity: 10,
        product: 'CNC',
        validity: 'DAY'
      };
      const order = createOrder(request, 'portfolio-1');
      
      expect(order.portfolioId).toBe('portfolio-1');
      expect(order.status).toBe('PENDING');
      expect(order.filledQuantity).toBe(0);
      expect(order.id).toBeDefined();
      expect(order.charges.total).toBe(0);
    });
  });

  describe('estimateRequiredCapital', () => {
    it('SELL returns 0', () => {
      expect(estimateRequiredCapital(1000, 10, 'SELL', 'CNC')).toBe(0);
    });

    it('CNC BUY returns full value', () => {
      expect(estimateRequiredCapital(1000, 10, 'BUY', 'CNC')).toBe(10000);
    });

    it('MIS BUY returns 20% of value', () => {
      expect(estimateRequiredCapital(1000, 10, 'BUY', 'MIS')).toBe(2000);
    });
  });
});
