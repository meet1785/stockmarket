/**
 * Simulated Matching Engine
 * Fills virtual orders against live/cached quotes.
 * Models slippage, brokerage charges, and order matching.
 */

import type { Order, OrderRequest, OrderCharges, OrderFill, StockQuote, BrokerageModel, SimulationMode } from '../types';
import { generateId } from '../utils/formatters';
import { DEFAULT_BROKERAGE } from '../utils/constants';

/**
 * Calculate transaction charges for an order fill
 */
export function calculateCharges(
  price: number,
  quantity: number,
  side: 'BUY' | 'SELL',
  product: 'CNC' | 'MIS',
  brokerage: BrokerageModel = DEFAULT_BROKERAGE
): OrderCharges {
  const turnover = price * quantity;

  // Brokerage
  let brokerageAmt: number;
  if (product === 'CNC') {
    brokerageAmt = brokerage.deliveryBrokerage; // Usually 0 for discount brokers
  } else {
    brokerageAmt = Math.min(brokerage.intradayBrokerage, turnover * 0.0003); // ₹20 or 0.03%, whichever is lower
  }

  // STT
  let stt: number;
  if (product === 'CNC') {
    stt = side === 'BUY'
      ? turnover * brokerage.sttDeliveryBuy
      : turnover * brokerage.sttDeliverySell;
  } else {
    stt = side === 'SELL' ? turnover * brokerage.sttIntraday : 0;
  }

  // Exchange charges
  const exchangeCharges = turnover * brokerage.exchangeCharges;

  // GST (18% on brokerage + exchange charges)
  const gst = (brokerageAmt + exchangeCharges) * brokerage.gstPercent;

  // SEBI charges (₹10 per crore)
  const sebiCharges = (turnover / 10000000) * brokerage.sebiCharges;

  // Stamp duty (only on buy side)
  const stampDuty = side === 'BUY' ? turnover * brokerage.stampDutyBuy : 0;

  const total = brokerageAmt + stt + exchangeCharges + gst + sebiCharges + stampDuty;

  return {
    brokerage: Math.round(brokerageAmt * 100) / 100,
    stt: Math.round(stt * 100) / 100,
    exchangeCharges: Math.round(exchangeCharges * 100) / 100,
    gst: Math.round(gst * 100) / 100,
    sebiCharges: Math.round(sebiCharges * 100) / 100,
    stampDuty: Math.round(stampDuty * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

/**
 * Apply slippage based on simulation mode
 */
function applySlippage(price: number, side: 'BUY' | 'SELL', mode: SimulationMode): number {
  let slippagePct: number;
  switch (mode) {
    case 'beginner':
      slippagePct = 0; // No slippage for beginners
      break;
    case 'realistic':
      slippagePct = 0.0005; // 0.05%
      break;
    case 'professional':
      slippagePct = 0.001 + Math.random() * 0.001; // 0.1-0.2% random
      break;
    default:
      slippagePct = 0;
  }

  const slippage = price * slippagePct;
  return side === 'BUY' ? price + slippage : price - slippage;
}

/**
 * Try to fill a market order immediately
 */
export function tryFillMarketOrder(
  order: Order,
  quote: StockQuote,
  mode: SimulationMode,
  brokerage: BrokerageModel = DEFAULT_BROKERAGE
): Order {
  const fillPrice = applySlippage(quote.ltp, order.side, mode);
  const charges = calculateCharges(fillPrice, order.quantity, order.side, order.product, brokerage);

  const fill: OrderFill = {
    id: generateId(),
    quantity: order.quantity,
    price: Math.round(fillPrice * 100) / 100,
    timestamp: new Date().toISOString(),
  };

  return {
    ...order,
    status: 'FILLED',
    filledQuantity: order.quantity,
    avgFillPrice: fill.price,
    charges,
    fills: [fill],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Check if a limit order should fill at the current price
 */
export function shouldFillLimitOrder(order: Order, quote: StockQuote): boolean {
  if (order.type !== 'LIMIT' || !order.price) return false;

  if (order.side === 'BUY') {
    return quote.ltp <= order.price;
  } else {
    return quote.ltp >= order.price;
  }
}

/**
 * Check if a stop order should trigger
 */
export function shouldTriggerStopOrder(order: Order, quote: StockQuote): boolean {
  if ((order.type !== 'STOP' && order.type !== 'STOP_LIMIT') || !order.triggerPrice) return false;

  if (order.side === 'SELL') {
    return quote.ltp <= order.triggerPrice; // Sell stop: triggers when price drops to trigger
  } else {
    return quote.ltp >= order.triggerPrice; // Buy stop: triggers when price rises to trigger
  }
}

/**
 * Try to fill a limit order
 */
export function tryFillLimitOrder(
  order: Order,
  quote: StockQuote,
  mode: SimulationMode,
  brokerage: BrokerageModel = DEFAULT_BROKERAGE
): Order | null {
  if (!shouldFillLimitOrder(order, quote)) return null;

  // Fill at the limit price (favorable fill)
  const fillPrice = order.price!;
  const charges = calculateCharges(fillPrice, order.quantity, order.side, order.product, brokerage);

  const fill: OrderFill = {
    id: generateId(),
    quantity: order.quantity,
    price: fillPrice,
    timestamp: new Date().toISOString(),
  };

  return {
    ...order,
    status: 'FILLED',
    filledQuantity: order.quantity,
    avgFillPrice: fillPrice,
    charges,
    fills: [fill],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Create an order from an order request
 */
export function createOrder(request: OrderRequest, portfolioId: string): Order {
  return {
    id: generateId(),
    portfolioId,
    symbol: request.symbol,
    companyName: request.companyName,
    exchange: request.exchange,
    side: request.side,
    type: request.type,
    status: 'PENDING',
    quantity: request.quantity,
    filledQuantity: 0,
    price: request.price,
    triggerPrice: request.triggerPrice,
    product: request.product,
    validity: request.validity,
    stopLoss: request.stopLoss,
    target: request.target,
    charges: { brokerage: 0, stt: 0, exchangeCharges: 0, gst: 0, sebiCharges: 0, stampDuty: 0, total: 0 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fills: [],
  };
}

/**
 * Estimate required capital for an order
 */
export function estimateRequiredCapital(price: number, quantity: number, side: 'BUY' | 'SELL', product: 'CNC' | 'MIS'): number {
  if (side === 'SELL') return 0; // Selling existing holdings
  const value = price * quantity;
  // For intraday, assume 5x leverage (simplified — real brokers have different rules)
  if (product === 'MIS') return value * 0.2;
  return value;
}
