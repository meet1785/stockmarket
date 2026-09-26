import type { StockSearchResult, BrokerageModel, Achievement, Lesson, Challenge } from '../types';

// --- NSE Popular Stocks ---
export const POPULAR_STOCKS: StockSearchResult[] = [
  { symbol: 'RELIANCE.NS', companyName: 'Reliance Industries Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'TCS.NS', companyName: 'Tata Consultancy Services Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'HDFCBANK.NS', companyName: 'HDFC Bank Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'INFY.NS', companyName: 'Infosys Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ICICIBANK.NS', companyName: 'ICICI Bank Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'HINDUNILVR.NS', companyName: 'Hindustan Unilever Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'SBIN.NS', companyName: 'State Bank of India', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'BHARTIARTL.NS', companyName: 'Bharti Airtel Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ITC.NS', companyName: 'ITC Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'KOTAKBANK.NS', companyName: 'Kotak Mahindra Bank Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'LT.NS', companyName: 'Larsen & Toubro Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'AXISBANK.NS', companyName: 'Axis Bank Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'WIPRO.NS', companyName: 'Wipro Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ASIANPAINT.NS', companyName: 'Asian Paints Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'MARUTI.NS', companyName: 'Maruti Suzuki India Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'TATAMOTORS.NS', companyName: 'Tata Motors Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'SUNPHARMA.NS', companyName: 'Sun Pharmaceutical Industries', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'BAJFINANCE.NS', companyName: 'Bajaj Finance Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'TITAN.NS', companyName: 'Titan Company Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ULTRACEMCO.NS', companyName: 'UltraTech Cement Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'HCLTECH.NS', companyName: 'HCL Technologies Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'TATASTEEL.NS', companyName: 'Tata Steel Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'POWERGRID.NS', companyName: 'Power Grid Corporation', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'NTPC.NS', companyName: 'NTPC Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ADANIENT.NS', companyName: 'Adani Enterprises Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'ONGC.NS', companyName: 'Oil & Natural Gas Corp', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'COALINDIA.NS', companyName: 'Coal India Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'JSWSTEEL.NS', companyName: 'JSW Steel Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'TECHM.NS', companyName: 'Tech Mahindra Ltd', exchange: 'NSE', type: 'EQUITY' },
  { symbol: 'HDFCLIFE.NS', companyName: 'HDFC Life Insurance', exchange: 'NSE', type: 'EQUITY' },
];

// --- Indices ---
export const INDICES = [
  { symbol: '^NSEI', name: 'NIFTY 50' },
  { symbol: '^BSESN', name: 'SENSEX' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY' },
];

// --- Default Settings ---
export const DEFAULT_BALANCE = 1000000; // ₹10,00,000
export const BALANCE_PRESETS = [100000, 500000, 1000000, 5000000, 10000000];

export const DEFAULT_BROKERAGE: BrokerageModel = {
  deliveryBrokerage: 0,
  intradayBrokerage: 20,
  sttDeliveryBuy: 0.001,
  sttDeliverySell: 0.001,
  sttIntraday: 0.00025,
  exchangeCharges: 0.0000345,
  gstPercent: 0.18,
  sebiCharges: 10, // per crore
  stampDutyBuy: 0.00015,
};

// --- NSE Market Hours (IST) ---
export const MARKET_OPEN_HOUR = 9;
export const MARKET_OPEN_MINUTE = 15;
export const MARKET_CLOSE_HOUR = 15;
export const MARKET_CLOSE_MINUTE = 30;

// --- CORS Proxy for Yahoo Finance ---
export const CORS_PROXY = 'https://corsproxy.io/?';
export const YAHOO_CHART_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/';
export const YAHOO_SEARCH_BASE = 'https://query1.finance.yahoo.com/v1/finance/search';

// --- Cache TTL ---
export const QUOTE_CACHE_TTL = 5000; // 5 seconds
export const HISTORY_CACHE_TTL = 60000; // 1 minute

// --- Achievements ---
export const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_trade', title: 'First Trade', description: 'Place your first virtual trade', icon: '🎯', category: 'TRADING' },
  { id: 'first_win', title: 'First Win', description: 'Close your first profitable trade', icon: '🏆', category: 'TRADING' },
  { id: 'stop_loss_pro', title: 'Stop Loss Pro', description: 'Use a stop loss on 5 trades', icon: '🛡️', category: 'RISK' },
  { id: 'diversified', title: 'Diversified', description: 'Hold 5+ different stocks', icon: '🌐', category: 'TRADING' },
  { id: 'ten_trades', title: 'Active Trader', description: 'Complete 10 trades', icon: '📊', category: 'TRADING' },
  { id: 'watchlist_builder', title: 'Watchlist Builder', description: 'Add 10 stocks to your watchlist', icon: '👀', category: 'TRADING' },
  { id: 'lesson_learner', title: 'Lesson Learner', description: 'Complete your first lesson', icon: '📚', category: 'LEARNING' },
  { id: 'quiz_master', title: 'Quiz Master', description: 'Score 100% on a quiz', icon: '🧠', category: 'LEARNING' },
  { id: 'consistent', title: 'Consistent Trader', description: 'Maintain positive P&L for 7 days', icon: '📈', category: 'RISK' },
  { id: 'risk_manager', title: 'Risk Manager', description: 'Never risk more than 2% per trade for 10 trades', icon: '⚖️', category: 'RISK' },
];

// --- Lessons ---
export const LESSONS: Lesson[] = [
  {
    id: 'what-is-stock',
    title: 'What is a Stock?',
    category: 'Basics',
    level: 1,
    description: 'Learn what stocks represent and why companies issue them.',
    content: `# What is a Stock?\n\nA **stock** (also called a **share** or **equity**) represents a small piece of ownership in a company.\n\nWhen you buy a stock of Reliance Industries, you become a part-owner of that company — even if it's a tiny fraction.\n\n## Why do companies issue stocks?\n\nCompanies need money to grow — build factories, hire employees, develop products. They can:\n1. **Borrow money** (take loans/issue bonds)\n2. **Sell ownership** (issue stocks)\n\nWhen a company "goes public" through an **IPO (Initial Public Offering)**, it lists its shares on stock exchanges like **NSE** and **BSE**, and anyone can buy or sell them.\n\n## How do you make money?\n\n1. **Capital Appreciation**: Buy at ₹100, sell at ₹150 → you earn ₹50 per share\n2. **Dividends**: Some companies share profits with shareholders periodically\n\n> ⚠️ Stock prices can also go DOWN. You can lose money. This simulator helps you learn without real risk.`,
    quiz: [
      { id: 'q1', question: 'What does owning a stock represent?', options: ['A loan to the company', 'Partial ownership of the company', 'A fixed deposit', 'A government bond'], correctIndex: 1, explanation: 'A stock represents partial ownership (equity) in a company.' },
      { id: 'q2', question: 'What is an IPO?', options: ['International Payment Order', 'Initial Public Offering', 'Indian Portfolio Option', 'Internal Profit Operation'], correctIndex: 1, explanation: 'IPO stands for Initial Public Offering — when a company first sells its shares to the public.' },
    ],
    completed: false,
  },
  {
    id: 'nse-bse',
    title: 'NSE and BSE Explained',
    category: 'Basics',
    level: 1,
    description: 'Understand India\'s two major stock exchanges.',
    content: `# NSE and BSE\n\nIndia has two major stock exchanges:\n\n## NSE (National Stock Exchange)\n- Founded: 1992\n- Location: Mumbai\n- Key Index: **NIFTY 50** (top 50 companies)\n- Most traded exchange in India by volume\n\n## BSE (Bombay Stock Exchange)\n- Founded: 1875 (oldest in Asia!)\n- Location: Mumbai\n- Key Index: **SENSEX** (top 30 companies)\n\n## Trading Hours\nBoth exchanges operate:\n- **Pre-open session**: 9:00 AM – 9:15 AM IST\n- **Regular trading**: 9:15 AM – 3:30 PM IST\n- **Post-close session**: 3:30 PM – 4:00 PM IST\n- **Closed**: Weekends and listed holidays\n\nMost stocks are listed on BOTH exchanges. You can buy on one and sell on the other (though clearing happens per-exchange).`,
    quiz: [
      { id: 'q1', question: 'What is NIFTY 50?', options: ['Top 50 companies on BSE', 'Top 50 companies on NSE', 'A mutual fund', 'A government index'], correctIndex: 1, explanation: 'NIFTY 50 is the benchmark index of the National Stock Exchange, comprising 50 large-cap companies.' },
      { id: 'q2', question: 'When does regular trading start on NSE?', options: ['9:00 AM', '9:15 AM', '10:00 AM', '9:30 AM'], correctIndex: 1, explanation: 'Regular trading on NSE starts at 9:15 AM IST, after the pre-open session.' },
    ],
    completed: false,
  },
  {
    id: 'order-types',
    title: 'Order Types: Market, Limit & Stop',
    category: 'Trading',
    level: 2,
    description: 'Learn the different ways to place a trade.',
    content: `# Order Types\n\n## Market Order\nBuys/sells **immediately** at the current best available price.\n- ✅ Guaranteed execution\n- ❌ Price may differ from what you see (slippage)\n\n## Limit Order\nBuys/sells **only at your specified price or better**.\n- Buy Limit: Executes at your price or lower\n- Sell Limit: Executes at your price or higher\n- ✅ Price control\n- ❌ May not execute if price never reaches your limit\n\n## Stop Order (Stop Loss)\nBecomes a market order when a **trigger price** is hit.\n- Used to limit losses or protect profits\n- Example: Buy at ₹100, place stop at ₹95 → auto-sells if price drops to ₹95\n\n## Stop-Limit Order\nBecomes a **limit order** when the trigger price is hit.\n- More control than a plain stop, but riskier if price gaps past your limit\n\n## CNC vs MIS\n- **CNC (Cash and Carry)**: Delivery — you take ownership, no time limit\n- **MIS (Margin Intraday Square-off)**: Must close by 3:20 PM same day`,
    quiz: [
      { id: 'q1', question: 'What happens to an unfilled limit buy order if the stock never drops to your limit price?', options: ['It auto-executes at market', 'It remains pending until cancelled/expired', 'It converts to a stop order', 'It gets partially filled'], correctIndex: 1, explanation: 'A limit order stays pending until the price reaches your limit, or until it expires/you cancel it.' },
    ],
    completed: false,
  },
  {
    id: 'risk-management',
    title: 'Risk Management Basics',
    category: 'Risk',
    level: 2,
    description: 'The most important skill in trading — managing risk.',
    content: `# Risk Management\n\nThe #1 rule of trading: **don't lose your capital**.\n\n## Position Sizing\nNever risk more than **1-2%** of your capital on a single trade.\n\n### Example\n- Capital: ₹10,00,000\n- Risk per trade (1%): ₹10,000\n- Entry: ₹500, Stop Loss: ₹480\n- Risk per share: ₹20\n- Max shares: 10,000 ÷ 20 = **500 shares**\n\n## Risk/Reward Ratio\nAim for at least 1:2 — risk ₹1 to make ₹2.\n\n## Stop Losses\n- Always use them\n- Set BEFORE entering the trade\n- Never move them further away\n\n## Diversification\n- Don't put all your money in one stock\n- Spread across sectors\n\n> 💡 Professional traders focus on risk management first, profits second.`,
    quiz: [
      { id: 'q1', question: 'If you have ₹5,00,000 and risk 1% per trade, what is your max loss per trade?', options: ['₹500', '₹5,000', '₹50,000', '₹1,000'], correctIndex: 1, explanation: '1% of ₹5,00,000 = ₹5,000. This is your maximum acceptable loss on any single trade.' },
    ],
    completed: false,
  },
  {
    id: 'candlestick-basics',
    title: 'Reading Candlestick Charts',
    category: 'Technical Analysis',
    level: 2,
    description: 'Understand the most common chart type used in trading.',
    content: `# Candlestick Charts\n\nEach candle shows 4 prices for a time period:\n\n- **Open**: Price at the start\n- **High**: Highest price reached\n- **Low**: Lowest price reached\n- **Close**: Price at the end\n\n## Green (Bullish) Candle\nClose > Open → Price went UP\n\n## Red (Bearish) Candle\nClose < Open → Price went DOWN\n\n## Parts of a Candle\n- **Body**: The thick part (Open to Close)\n- **Upper Wick/Shadow**: High above the body\n- **Lower Wick/Shadow**: Low below the body\n\n## What wicks tell you\n- Long upper wick: Sellers pushed price down from the high\n- Long lower wick: Buyers pushed price up from the low\n- No wick: Strong conviction in that direction\n\n## Common Patterns\n- **Doji**: Open ≈ Close (indecision)\n- **Hammer**: Small body, long lower wick (potential reversal)\n- **Engulfing**: Current candle completely covers previous one`,
    quiz: [
      { id: 'q1', question: 'In a green (bullish) candle, which price is higher?', options: ['Open', 'Close', 'They are equal', 'Low'], correctIndex: 1, explanation: 'In a bullish/green candle, the close price is higher than the open, indicating the price went up during that period.' },
    ],
    completed: false,
  },
];

// --- Challenges ---
export const CHALLENGES: Challenge[] = [
  { id: 'first-trade', title: 'Make Your First Trade', description: 'Place and fill your first virtual order', type: 'BEGINNER', target: 'Place 1 trade', progress: 0, completed: false, reward: 50 },
  { id: 'use-limit', title: 'Patience is Key', description: 'Place a limit order', type: 'BEGINNER', target: 'Place 1 limit order', progress: 0, completed: false, reward: 50 },
  { id: 'use-stoploss', title: 'Safety First', description: 'Place a trade with a stop loss', type: 'BEGINNER', target: 'Use stop loss once', progress: 0, completed: false, reward: 75 },
  { id: 'build-watchlist', title: 'Market Watcher', description: 'Add 5 stocks to a watchlist', type: 'BEGINNER', target: 'Add 5 to watchlist', progress: 0, completed: false, reward: 50 },
  { id: 'ten-trades', title: 'Getting Serious', description: 'Complete 10 trades', type: 'INTERMEDIATE', target: '10 trades', progress: 0, completed: false, reward: 200 },
  { id: 'positive-pnl', title: 'In The Green', description: 'Achieve a positive total P&L', type: 'INTERMEDIATE', target: 'Positive P&L', progress: 0, completed: false, reward: 300 },
  { id: 'risk-reward', title: 'Risk Manager', description: 'Maintain 1:2 risk/reward on 5 trades', type: 'ADVANCED', target: '5 trades with 1:2 R/R', progress: 0, completed: false, reward: 500 },
  { id: 'diversified', title: 'Diversified Portfolio', description: 'Hold 5 different stocks simultaneously', type: 'INTERMEDIATE', target: 'Hold 5 stocks', progress: 0, completed: false, reward: 250 },
];

// --- Time Frame Options ---
export const TIMEFRAME_OPTIONS: { value: string; label: string; range: string; interval: string }[] = [
  { value: '1d', label: '1D', range: '1d', interval: '5m' },
  { value: '5d', label: '5D', range: '5d', interval: '15m' },
  { value: '1mo', label: '1M', range: '1mo', interval: '1d' },
  { value: '3mo', label: '3M', range: '3mo', interval: '1d' },
  { value: '6mo', label: '6M', range: '6mo', interval: '1d' },
  { value: '1y', label: '1Y', range: '1y', interval: '1wk' },
  { value: '5y', label: '5Y', range: '5y', interval: '1mo' },
  { value: 'max', label: 'MAX', range: 'max', interval: '1mo' },
];
