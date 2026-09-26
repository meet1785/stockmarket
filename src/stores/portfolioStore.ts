import { create } from 'zustand';
import type { Portfolio, Holding, Order, Trade } from '../types';
import { loadFromStorage, saveToStorage } from '../services/storage';
import { generateId } from '../utils/formatters';
import { DEFAULT_BALANCE } from '../utils/constants';

interface PortfolioState {
  portfolio: Portfolio;
  orders: Order[];
  trades: Trade[];

  // Portfolio actions
  resetPortfolio: (startingBalance?: number) => void;
  updateCash: (amount: number) => void;

  // Holdings actions
  addHolding: (holding: Omit<Holding, 'currentPrice'> & { currentPrice: number }) => void;
  updateHolding: (symbol: string, updates: Partial<Holding>) => void;
  removeHolding: (symbol: string) => void;
  updateHoldingPrices: (prices: Map<string, number>) => void;

  // Order actions
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  cancelOrder: (orderId: string) => void;

  // Trade actions
  recordTrade: (trade: Trade) => void;

  // Process a filled buy order
  processBuyFill: (order: Order) => void;
  // Process a filled sell order
  processSellFill: (order: Order) => void;
}

const createDefaultPortfolio = (): Portfolio => ({
  id: generateId(),
  name: 'Main Portfolio',
  cash: DEFAULT_BALANCE,
  initialCash: DEFAULT_BALANCE,
  holdings: [],
  createdAt: new Date().toISOString(),
});

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: loadFromStorage<Portfolio>('portfolio', createDefaultPortfolio()),
  orders: loadFromStorage<Order[]>('orders', []),
  trades: loadFromStorage<Trade[]>('trades', []),

  resetPortfolio: (startingBalance = DEFAULT_BALANCE) => {
    const portfolio = {
      ...createDefaultPortfolio(),
      cash: startingBalance,
      initialCash: startingBalance,
    };
    saveToStorage('portfolio', portfolio);
    saveToStorage('orders', []);
    saveToStorage('trades', []);
    set({ portfolio, orders: [], trades: [] });
  },

  updateCash: (amount: number) => {
    const { portfolio } = get();
    const updated = { ...portfolio, cash: portfolio.cash + amount };
    saveToStorage('portfolio', updated);
    set({ portfolio: updated });
  },

  addHolding: (holding) => {
    const { portfolio } = get();
    const existing = portfolio.holdings.find(h => h.symbol === holding.symbol && h.product === holding.product);

    let updatedHoldings: Holding[];
    if (existing) {
      // Average up/down
      const totalQty = existing.quantity + holding.quantity;
      const totalCost = existing.avgBuyPrice * existing.quantity + holding.avgBuyPrice * holding.quantity;
      updatedHoldings = portfolio.holdings.map(h =>
        h.symbol === holding.symbol && h.product === holding.product
          ? { ...h, quantity: totalQty, avgBuyPrice: totalCost / totalQty, currentPrice: holding.currentPrice }
          : h
      );
    } else {
      updatedHoldings = [...portfolio.holdings, holding];
    }

    const updated = { ...portfolio, holdings: updatedHoldings };
    saveToStorage('portfolio', updated);
    set({ portfolio: updated });
  },

  updateHolding: (symbol: string, updates: Partial<Holding>) => {
    const { portfolio } = get();
    const updatedHoldings = portfolio.holdings.map(h =>
      h.symbol === symbol ? { ...h, ...updates } : h
    );
    const updated = { ...portfolio, holdings: updatedHoldings };
    saveToStorage('portfolio', updated);
    set({ portfolio: updated });
  },

  removeHolding: (symbol: string) => {
    const { portfolio } = get();
    const updatedHoldings = portfolio.holdings.filter(h => h.symbol !== symbol);
    const updated = { ...portfolio, holdings: updatedHoldings };
    saveToStorage('portfolio', updated);
    set({ portfolio: updated });
  },

  updateHoldingPrices: (prices: Map<string, number>) => {
    const { portfolio } = get();
    const updatedHoldings = portfolio.holdings.map(h => {
      const price = prices.get(h.symbol);
      return price ? { ...h, currentPrice: price } : h;
    });
    const updated = { ...portfolio, holdings: updatedHoldings };
    saveToStorage('portfolio', updated);
    set({ portfolio: updated });
  },

  addOrder: (order: Order) => {
    const { orders } = get();
    const updated = [order, ...orders];
    saveToStorage('orders', updated);
    set({ orders: updated });
  },

  updateOrder: (orderId: string, updates: Partial<Order>) => {
    const { orders } = get();
    const updated = orders.map(o => o.id === orderId ? { ...o, ...updates } : o);
    saveToStorage('orders', updated);
    set({ orders: updated });
  },

  cancelOrder: (orderId: string) => {
    const { orders } = get();
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: 'CANCELLED' as const, updatedAt: new Date().toISOString() } : o
    );
    saveToStorage('orders', updated);
    set({ orders: updated });
  },

  recordTrade: (trade: Trade) => {
    const { trades } = get();
    const updated = [trade, ...trades];
    saveToStorage('trades', updated);
    set({ trades: updated });
  },

  processBuyFill: (order: Order) => {
    if (!order.avgFillPrice) return;
    const { updateCash, addHolding } = get();

    // Deduct cash (price * quantity + charges)
    const cost = order.avgFillPrice * order.filledQuantity + order.charges.total;
    updateCash(-cost);

    // Add holding
    addHolding({
      symbol: order.symbol,
      companyName: order.companyName,
      exchange: order.exchange,
      quantity: order.filledQuantity,
      avgBuyPrice: order.avgFillPrice,
      currentPrice: order.avgFillPrice,
      product: order.product,
    });
  },

  processSellFill: (order: Order) => {
    if (!order.avgFillPrice) return;
    const { portfolio, updateCash, removeHolding, updateHolding, recordTrade } = get();

    const holding = portfolio.holdings.find(h => h.symbol === order.symbol);
    if (!holding) return;

    // Add cash (price * quantity - charges)
    const revenue = order.avgFillPrice * order.filledQuantity - order.charges.total;
    updateCash(revenue);

    // Update/remove holding
    const remainingQty = holding.quantity - order.filledQuantity;
    if (remainingQty <= 0) {
      removeHolding(order.symbol);
    } else {
      updateHolding(order.symbol, { quantity: remainingQty });
    }

    // Record trade
    const grossPnL = (order.avgFillPrice - holding.avgBuyPrice) * order.filledQuantity;
    const netPnL = grossPnL - order.charges.total;

    recordTrade({
      id: generateId(),
      portfolioId: portfolio.id,
      symbol: order.symbol,
      companyName: order.companyName,
      exchange: order.exchange,
      side: 'SELL',
      entryPrice: holding.avgBuyPrice,
      exitPrice: order.avgFillPrice,
      quantity: order.filledQuantity,
      entryDate: order.createdAt, // Simplified
      exitDate: new Date().toISOString(),
      grossPnL,
      charges: order.charges.total,
      netPnL,
      pnlPercent: holding.avgBuyPrice !== 0 ? (netPnL / (holding.avgBuyPrice * order.filledQuantity)) * 100 : 0,
      holdingDays: 0,
    });
  },
}));
