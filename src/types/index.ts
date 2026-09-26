// ==========================================
// PaperTrade India — Core Type Definitions
// ==========================================

// --- Enums & Literal Types ---

export type Exchange = 'NSE' | 'BSE';
export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
export type OrderStatus = 'PENDING' | 'OPEN' | 'FILLED' | 'CANCELLED' | 'REJECTED' | 'EXPIRED';
export type OrderValidity = 'DAY' | 'GTC';
export type ProductType = 'CNC' | 'MIS'; // CNC = delivery, MIS = intraday
export type SimulationMode = 'beginner' | 'realistic' | 'professional';
export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '1d' | '1w' | '1M';

// --- Market Data ---

export interface StockQuote {
  symbol: string;
  companyName: string;
  exchange: Exchange;
  ltp: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  marketCap?: number;
  week52High?: number;
  week52Low?: number;
  pe?: number;
  pb?: number;
  dividendYield?: number;
  dayHigh: number;
  dayLow: number;
  timestamp: number;
  isStale: boolean;
}

export interface IndexQuote {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface Candle {
  time: number; // unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketStatus {
  isOpen: boolean;
  status: 'PRE_OPEN' | 'OPEN' | 'CLOSED' | 'POST_MARKET';
  nextOpenTime?: string;
  nextCloseTime?: string;
}

// --- User & Portfolio ---

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  settings: UserSettings;
  xp: number;
  level: number;
  achievements: string[];
}

export interface UserSettings {
  defaultBalance: number;
  simulationMode: SimulationMode;
  darkMode: boolean;
  brokerageModel: BrokerageModel;
}

export interface BrokerageModel {
  deliveryBrokerage: number;   // e.g., 0 for discount brokers
  intradayBrokerage: number;   // e.g., 20 flat
  sttDeliveryBuy: number;      // 0.1% of buy value
  sttDeliverySell: number;     // 0.1% of sell value
  sttIntraday: number;         // 0.025% of sell value
  exchangeCharges: number;     // ~0.00345%
  gstPercent: number;          // 18% on brokerage + exchange charges
  sebiCharges: number;         // ₹10 per crore
  stampDutyBuy: number;        // 0.015% on buy
}

export interface Portfolio {
  id: string;
  name: string;
  cash: number;
  initialCash: number;
  holdings: Holding[];
  createdAt: string;
}

export interface Holding {
  symbol: string;
  companyName: string;
  exchange: Exchange;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  product: ProductType;
}

// --- Computed portfolio metrics (not stored) ---

export interface PortfolioMetrics {
  totalValue: number;
  investedValue: number;
  cash: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayPnL: number;
  dayPnLPercent: number;
  realizedPnL: number;
  unrealizedPnL: number;
}

export interface HoldingWithMetrics extends Holding {
  marketValue: number;
  pnl: number;
  pnlPercent: number;
  dayChange: number;
  dayChangePercent: number;
  weight: number;
}

// --- Orders ---

export interface Order {
  id: string;
  portfolioId: string;
  symbol: string;
  companyName: string;
  exchange: Exchange;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  filledQuantity: number;
  price?: number;        // limit price
  triggerPrice?: number;  // stop trigger
  avgFillPrice?: number;
  product: ProductType;
  validity: OrderValidity;
  stopLoss?: number;
  target?: number;
  charges: OrderCharges;
  createdAt: string;
  updatedAt: string;
  fills: OrderFill[];
}

export interface OrderFill {
  id: string;
  quantity: number;
  price: number;
  timestamp: string;
}

export interface OrderCharges {
  brokerage: number;
  stt: number;
  exchangeCharges: number;
  gst: number;
  sebiCharges: number;
  stampDuty: number;
  total: number;
}

export interface OrderRequest {
  symbol: string;
  companyName: string;
  exchange: Exchange;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  triggerPrice?: number;
  product: ProductType;
  validity: OrderValidity;
  stopLoss?: number;
  target?: number;
}

// --- Trades (completed round-trips) ---

export interface Trade {
  id: string;
  portfolioId: string;
  symbol: string;
  companyName: string;
  exchange: Exchange;
  side: OrderSide;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  entryDate: string;
  exitDate: string;
  grossPnL: number;
  charges: number;
  netPnL: number;
  pnlPercent: number;
  holdingDays: number;
}

// --- Watchlist ---

export interface Watchlist {
  id: string;
  name: string;
  items: WatchlistItem[];
  createdAt: string;
}

export interface WatchlistItem {
  symbol: string;
  exchange: Exchange;
  addedAt: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  exchange: Exchange;
  type: 'ABOVE' | 'BELOW';
  price: number;
  triggered: boolean;
  createdAt: string;
}

// --- Learning & Gamification ---

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'TRADING' | 'LEARNING' | 'RISK' | 'SOCIAL';
  unlockedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  level: number;
  description: string;
  content: string;
  quiz?: QuizQuestion[];
  completed: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  target: string;
  progress: number;
  completed: boolean;
  reward: number; // XP
}

// --- Risk Analytics ---

export interface RiskMetrics {
  sharpeRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  volatility: number;
  winRate: number;
  lossRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  avgHoldingDays: number;
  expectancy: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

// --- Stock Search ---

export interface StockSearchResult {
  symbol: string;
  companyName: string;
  exchange: Exchange;
  type: 'EQUITY' | 'ETF' | 'INDEX';
}

// --- Chart Indicator ---

export interface ChartIndicator {
  id: string;
  type: 'SMA' | 'EMA' | 'RSI' | 'MACD' | 'BOLLINGER';
  params: Record<string, number>;
  color: string;
  visible: boolean;
}
