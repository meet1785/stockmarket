# Build Prompt: "PaperTrade India" — A Real-Data NSE/BSE Trading Simulator (100% Free Data)

> Copy everything below into Claude Code, Cursor, or any AI coding assistant to have it scaffold and build the app. Written as a single, self-contained instruction.

---

## 1. What to build

Build **PaperTrade India**, a full-stack web app that teaches trading on the **NSE and BSE** using **real, live Indian market data** but **100% virtual rupees** — no real brokerage account, no real funds, ever, and **no paid data subscriptions anywhere in the stack**. It should feel like a real trading terminal (think Zerodha Kite / Groww) but every account starts with virtual cash and every fill is simulated.

Non-negotiable ground rules:

- Every data source used must be free with no credit card and no paid tier required (see Section 3).
- Never connect to a real brokerage execution endpoint or move real money.
- Every screen that shows a balance or a trade confirmation must visibly say **"Simulated — no real money"**.
- Treat all price/order data as educational; do not present it as investment advice.

## 2. Recommended tech stack

Chosen to match a Python/FastAPI-first, AI-native stack:

- **Backend:** Python 3.12, FastAPI, PostgreSQL, SQLAlchemy + Alembic, Redis (caching + rate limiting — important here since the free data sources are unofficial and must not be hammered), APScheduler/Celery for scheduled jobs (market-open/close snapshots at 9:15 AM / 3:30 PM IST, end-of-day P&L), WebSockets for pushing cached quotes to the frontend.
- **Frontend:** React + TypeScript + Tailwind CSS, `lightweight-charts` (TradingView's free charting library) or Recharts, Zustand for state.
- **Auth:** JWT-based auth, optional Google OAuth.
- **Deployment:** Dockerized; deployable to Cloud Run on GCP.
- **Optional AI layer:** LangChain + an LLM API (OpenAI/Anthropic) for the "AI Trading Mentor" feature (Section 5) — this is the one piece that isn't free if enabled; keep it behind a feature flag so the core app runs at zero cost without it.

## 3. Market data — 100% free, no key, no paid tier

Both of the following are free Python libraries with **no API key, no signup, and no cost**, which makes them the right fit for "no need to pay":

- **`yfinance`** — pull any NSE/BSE ticker by suffixing `.NS` (NSE) or `.BO` (BSE), e.g. `RELIANCE.NS`, `TCS.NS`, `^NSEI` for the Nifty 50 index. Use it for quotes, intraday/historical candles, and basic fundamentals (P/E, market cap, etc.). It's unofficial (it scrapes Yahoo Finance) and near-real-time rather than tick-by-tick, which is more than adequate for a simulator.
- **`jugaad-data`** — a free Python library built specifically for NSE/RBI data: live quotes via its `NSELive` client (`n.stock_quote("RELIANCE")`, `n.live_index("NIFTY 50")`), historical daily data via `stock_df`, and official EOD **bhavcopy** downloads (NSE's own free daily settlement file — the most reliable free source for accurate end-of-day OHLC). It has built-in caching specifically to avoid hammering NSE's servers and getting blocked, which matters since this is scraping NSE's own site rather than a hosted API.

Architecture: build a thin internal "data provider" interface (`get_quote(symbol)`, `get_history(symbol, range)`, `get_index(name)`) with `jugaad-data`'s `NSELive` as the primary live-quote source and `yfinance` as the fallback/secondary (and for historical charting, since it returns clean OHLCV data instantly). **Always cache quotes in Redis for at least 3–5 seconds** and poll on a fixed interval rather than per-request — this is what keeps both free sources usable and stops your simulator from being rate-limited or IP-blocked.

Because these are community libraries against NSE's public website rather than an official real-time feed, build in a graceful "data may be a few seconds delayed" disclaimer, and a fallback to last-known price with a "stale" badge if a fetch fails — never let a data hiccup crash the order ticket.

## 4. Core features (build these first — MVP)

1. **Account & onboarding** — signup/login, choose a starting virtual balance (default ₹1,00,000, with presets up to ₹10,00,000), disclaimer acceptance.
2. **Portfolio dashboard** — cash balance, holdings table, unrealized/realized P&L, allocation pie chart, and a performance line chart benchmarked against the **Nifty 50** or **Sensex**.
3. **Order ticket** — Market, Limit, Stop, and Stop-Limit orders; Buy, Sell, and Short (toggle to disable shorting/margin for beginner mode); Day vs Good-Till-Cancelled; CNC (delivery) vs MIS (intraday) modes to mirror how Indian brokers label order types.
4. **Simulated matching engine** — orders queue and fill against the live/cached quote stream with a configurable brokerage model (many Indian discount brokers are ₹0 delivery / flat ₹20 intraday — make this configurable) rather than instant perfect fills.
5. **Watchlists & alerts** — add NSE/BSE symbols, set price alerts that fire in-app.
6. **Charting** — candlestick + line charts, volume, and common indicators (SMA, EMA, RSI, MACD, Bollinger Bands).
7. **Transaction history** — every order and fill, with FIFO-based realized-gain tracking (useful for teaching STCG/LTCG concepts educationally, without giving tax advice).
8. **Market status widget** — shows whether NSE is currently open (9:15 AM–3:30 PM IST, weekdays, respecting NSE holidays), since Indian market hours differ from US ones and this trips up beginners.

## 5. Learning & engagement layer

- **Risk analytics tab**: Sharpe ratio, max drawdown, volatility, win rate, average holding period, with a plain-English explanation next to each metric.
- **Bite-sized lessons & tooltips**: hover/tap definitions on every trading term (limit order, short squeeze, margin call, circuit limit/upper-lower band — an NSE-specific concept worth covering), unlocked as the user tries each feature.
- **Post-trade review**: after a losing trade, a short "what happened" breakdown (price move, whether a stop would've helped).
- **Challenges & leaderboards**: timed competitions (e.g., "best 30-day return"), with an **instructor mode** letting a teacher spin up a challenge with a fixed start date, symbol universe, and starting capital for a class.
- **Gamification**: XP/levels and badges (first trade, first stop-loss used, first diversified portfolio, 10 trades without breaking a risk rule you set yourself).
- **AI Trading Mentor (optional, not free)**: a LangChain-powered chat panel that explains why a stock moved using the day's news/price action, reviews a user's recent trades for risk patterns (over-concentration, no stop-losses, revenge trading after a loss), and answers "what does X mean" questions in context. Ship this behind a feature flag so the rest of the app stays entirely free to run.

## 6. Data model (minimum tables)

`users`, `portfolios` (supports multiple per user for different challenges), `holdings`, `orders`, `fills`, `watchlists`, `watchlist_items`, `price_alerts`, `challenges`, `challenge_participants`, `achievements`, `user_achievements`.

## 7. Non-functional requirements

- Responsive, mobile-first layout; dark mode.
- Aggressive caching (Redis) and a fixed polling interval for all external data calls — this is the load-bearing requirement that keeps the whole stack free.
- Graceful degradation if `jugaad-data`/`yfinance` are unreachable (show last-known price with a "delayed/stale" badge rather than crashing the order ticket).
- Clear, persistent "simulation only" messaging — no design pattern that could make this look like a live brokerage or a real Sebi-registered platform.

## 8. Suggested build order

1. Auth + portfolio scaffolding with a hardcoded starting balance.
2. Data provider integration: wire up `jugaad-data`/`yfinance` behind the internal interface, with Redis caching, and get one live quote rendering end-to-end.
3. Market order placement + simulated fill against that cached quote.
4. Limit/stop orders + matching engine against the polled quote stream.
5. Charts + watchlists.
6. Risk analytics + transaction history.
7. Gamification (XP, leaderboards, challenges).
8. AI Trading Mentor chat panel (optional/flagged).

Now scaffold the repo (backend + frontend folders, Docker Compose for local Postgres/Redis, `.env.example` with a placeholder only for the optional LLM API key — no market-data keys are needed at all), then implement step 1 first and stop for review before moving to step 2.