/**
 * Order Execution Service
 * Background engine that periodically checks OPEN/PENDING orders
 * against live market prices and fills them when conditions are met.
 *
 * - Limit orders fill when LTP crosses the limit price
 * - Stop orders trigger when LTP crosses the trigger price
 * - Stop-Limit orders trigger first, then fill at limit
 * - DAY orders expire at 3:30 PM IST
 */

import { usePortfolioStore } from '../stores/portfolioStore';
import { useMarketDataStore } from '../stores/marketDataStore';
import { useAuthStore } from '../stores/authStore';
import {
  shouldFillLimitOrder,
  shouldTriggerStopOrder,
  tryFillLimitOrder,
  tryFillMarketOrder,
} from './matchingEngine';
import type { Order } from '../types';

const POLL_INTERVAL_MS = 15_000; // Check every 15 seconds
let intervalId: ReturnType<typeof setInterval> | null = null;
let isRunning = false;

/**
 * Evaluate and fill a single pending order against a live quote
 */
function evaluateOrder(order: Order): void {
  const { quotes } = useMarketDataStore.getState();
  const { updateOrder, processBuyFill, processSellFill } = usePortfolioStore.getState();
  const { user } = useAuthStore.getState();

  const quote = quotes.get(order.symbol);
  if (!quote || quote.isStale) return; // Skip if no fresh data
  if (!user) return;

  const mode = user.settings.simulationMode;
  const brokerage = user.settings.brokerageModel;

  // --- LIMIT orders ---
  if (order.type === 'LIMIT' && order.status === 'OPEN') {
    const filledOrder = tryFillLimitOrder(order, quote, mode, brokerage);
    if (filledOrder) {
      updateOrder(order.id, {
        status: filledOrder.status,
        filledQuantity: filledOrder.filledQuantity,
        avgFillPrice: filledOrder.avgFillPrice,
        charges: filledOrder.charges,
        fills: filledOrder.fills,
        updatedAt: filledOrder.updatedAt,
      });
      if (order.side === 'BUY') processBuyFill(filledOrder);
      else processSellFill(filledOrder);
      console.log(`[OrderEngine] Filled LIMIT ${order.side} ${order.symbol} @ ₹${filledOrder.avgFillPrice}`);
    }
    return;
  }

  // --- STOP orders (become market on trigger) ---
  if (order.type === 'STOP' && order.status === 'OPEN') {
    if (shouldTriggerStopOrder(order, quote)) {
      // Convert to market fill
      const filledOrder = tryFillMarketOrder(order, quote, mode, brokerage);
      updateOrder(order.id, {
        status: filledOrder.status,
        filledQuantity: filledOrder.filledQuantity,
        avgFillPrice: filledOrder.avgFillPrice,
        charges: filledOrder.charges,
        fills: filledOrder.fills,
        updatedAt: filledOrder.updatedAt,
      });
      if (order.side === 'BUY') processBuyFill(filledOrder);
      else processSellFill(filledOrder);
      console.log(`[OrderEngine] Triggered STOP ${order.side} ${order.symbol} @ ₹${filledOrder.avgFillPrice}`);
    }
    return;
  }

  // --- STOP_LIMIT orders (trigger → then limit check) ---
  if (order.type === 'STOP_LIMIT' && order.status === 'OPEN') {
    if (shouldTriggerStopOrder(order, quote)) {
      // Triggered — now treat as limit order
      if (shouldFillLimitOrder(order, quote)) {
        const filledOrder = tryFillLimitOrder(order, quote, mode, brokerage);
        if (filledOrder) {
          updateOrder(order.id, {
            status: filledOrder.status,
            filledQuantity: filledOrder.filledQuantity,
            avgFillPrice: filledOrder.avgFillPrice,
            charges: filledOrder.charges,
            fills: filledOrder.fills,
            updatedAt: filledOrder.updatedAt,
          });
          if (order.side === 'BUY') processBuyFill(filledOrder);
          else processSellFill(filledOrder);
          console.log(`[OrderEngine] Filled STOP_LIMIT ${order.side} ${order.symbol} @ ₹${filledOrder.avgFillPrice}`);
        }
      }
      // If triggered but limit not met yet, mark as PENDING (waiting for limit)
      else {
        updateOrder(order.id, { status: 'PENDING', updatedAt: new Date().toISOString() });
      }
    }
    return;
  }

  // --- STOP_LIMIT orders that are already PENDING (triggered, waiting for limit fill) ---
  if (order.type === 'STOP_LIMIT' && order.status === 'PENDING') {
    const filledOrder = tryFillLimitOrder(order, quote, mode, brokerage);
    if (filledOrder) {
      updateOrder(order.id, {
        status: filledOrder.status,
        filledQuantity: filledOrder.filledQuantity,
        avgFillPrice: filledOrder.avgFillPrice,
        charges: filledOrder.charges,
        fills: filledOrder.fills,
        updatedAt: filledOrder.updatedAt,
      });
      if (order.side === 'BUY') processBuyFill(filledOrder);
      else processSellFill(filledOrder);
      console.log(`[OrderEngine] Filled triggered STOP_LIMIT ${order.side} ${order.symbol} @ ₹${filledOrder.avgFillPrice}`);
    }
  }
}

/**
 * Expire DAY orders after market close (3:30 PM IST)
 */
function expireDayOrders(): void {
  const now = new Date();
  const istHour = parseInt(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false }));
  const istMinute = parseInt(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', minute: 'numeric' }));

  // After 3:30 PM IST
  if (istHour > 15 || (istHour === 15 && istMinute >= 30)) {
    const { orders, cancelOrder } = usePortfolioStore.getState();
    orders
      .filter(o => (o.status === 'OPEN' || o.status === 'PENDING') && o.validity === 'DAY')
      .forEach(o => {
        cancelOrder(o.id);
        console.log(`[OrderEngine] Expired DAY order ${o.symbol} ${o.side} ${o.type}`);
      });
  }
}

/**
 * Main polling loop — check all pending orders
 */
function tick(): void {
  const { orders } = usePortfolioStore.getState();
  const pendingOrders = orders.filter(o => o.status === 'OPEN' || o.status === 'PENDING');

  if (pendingOrders.length === 0) return;

  // Fetch fresh quotes for all pending order symbols
  const symbols = [...new Set(pendingOrders.map(o => o.symbol))];
  const { fetchQuote } = useMarketDataStore.getState();

  // Fetch quotes first, then evaluate
  Promise.all(symbols.map(s => fetchQuote(s))).then(() => {
    pendingOrders.forEach(evaluateOrder);
  });

  // Check for DAY order expiry
  expireDayOrders();
}

/**
 * Start the background order execution engine
 */
export function startOrderEngine(): void {
  if (isRunning) return;
  isRunning = true;
  console.log('[OrderEngine] Started — polling every 15s');

  // Run immediately once
  tick();

  intervalId = setInterval(tick, POLL_INTERVAL_MS);
}

/**
 * Stop the background order execution engine
 */
export function stopOrderEngine(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  isRunning = false;
  console.log('[OrderEngine] Stopped');
}

/**
 * Get the count of pending orders being monitored
 */
export function getPendingOrderCount(): number {
  const { orders } = usePortfolioStore.getState();
  return orders.filter(o => o.status === 'OPEN' || o.status === 'PENDING').length;
}
