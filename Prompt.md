You are a senior fintech product architect, quantitative developer, UI/UX designer, full-stack engineer, market-microstructure specialist, and trading educator.

Build a production-quality EDUCATIONAL STOCK MARKET SIMULATOR for the Indian market.

The application must use ZERO REAL MONEY and must NEVER place real trades.

The objective is to create an interactive trading school + realistic paper-trading terminal where a beginner can start from absolute zero and progressively learn:

• Indian stock markets
• NSE/BSE
• investing
• swing trading
• intraday trading
• technical analysis
• fundamental analysis
• risk management
• order types
• market microstructure
• derivatives
• options
• futures
• trading psychology
• portfolio management
• strategy testing
• backtesting
• journaling
• performance analysis

The application should feel like a professional trading terminal combined with Duolingo-style progressive learning.

==================================================
1. CORE PRINCIPLE
==================================================

This is an EDUCATIONAL SIMULATOR.

There must be:

NO real-money deposits
NO withdrawals
NO broker execution
NO live order placement
NO ability to accidentally connect and execute a real trade

Every order is virtual.

Every portfolio is simulated.

Clearly display:

"EDUCATIONAL PAPER TRADING"
"NO REAL MONEY"
"NO REAL ORDERS ARE PLACED"

Do not present simulated profits as actual profits.

Do not provide personalized investment advice.

The AI assistant must explain concepts and analyze simulated trades rather than tell users what they should buy or sell with real money.

==================================================
2. MARKET
==================================================

Primary market:

INDIA

Support:

NSE
BSE

Primary instruments:

• NSE equities
• BSE equities
• ETFs
• Indexes
• Futures
• Options

Initial implementation may prioritize NSE equities and indexes, then progressively add derivatives.

Indexes should include at minimum:

NIFTY 50
BANK NIFTY
FINNIFTY
NIFTY MIDCAP
NIFTY NEXT 50
SENSEX

Create an extensible instrument architecture so additional securities can be added without redesigning the application.

==================================================
3. REAL MARKET DATA ARCHITECTURE
==================================================

Use legitimate market-data sources.

Do NOT scrape websites in a way that violates their terms.

Build a MARKET DATA ABSTRACTION LAYER.

Architecture:

MarketDataProvider
    |
    +-- LiveProvider
    +-- DelayedProvider
    +-- HistoricalProvider
    +-- ReplayProvider
    +-- MockProvider

The application should work even if a live API is unavailable.

Example:

interface MarketDataProvider {
    getQuote(symbol)
    getQuotes(symbols[])
    getHistoricalCandles(symbol, timeframe, from, to)
    subscribeQuotes(symbols[])
    getMarketStatus()
    getInstrumentMaster()
}

The UI must clearly indicate:

LIVE
DELAYED
HISTORICAL
REPLAY

Never pretend delayed data is real-time.

If real-time exchange data requires a licensed provider, design the application so the provider can be plugged in through environment variables.

Potential provider adapters may include broker APIs such as Zerodha Kite Connect or Upstox where legally and technically appropriate.

Do not hard-code credentials.

Use:

MARKET_DATA_API_KEY
MARKET_DATA_API_SECRET
MARKET_DATA_PROVIDER

in environment variables.

==================================================
4. DATABASE
==================================================

Use PostgreSQL.

Recommended architecture:

Frontend:
Next.js + TypeScript

Backend:
Node.js + TypeScript

API:
REST + WebSocket

Database:
PostgreSQL

ORM:
Prisma

Caching:
Redis

Charts:
TradingView Lightweight Charts or equivalent open-source charting library

Authentication:
NextAuth/Auth.js or secure JWT/session architecture

Validation:
Zod

State management:
Zustand or equivalent

Styling:
Tailwind CSS

UI:
shadcn/ui or equivalent professional component library

Deployment-ready architecture.

==================================================
5. USER ACCOUNT
==================================================

Create:

Register
Login
Logout
Forgot password
Profile
Preferences
Learning level
Risk preferences for simulation only
Trading experience

Do not collect unnecessary personal financial information.

==================================================
6. INITIAL VIRTUAL ACCOUNT
==================================================

Every new user receives:

₹10,00,000 virtual capital

This is completely fictional.

Allow users to restart their account.

Allow multiple simulation accounts.

Example:

Account 1:
"Beginner Account"

Account 2:
"Intraday Strategy"

Account 3:
"Swing Strategy"

Account 4:
"Options Practice"

Account 5:
"Backtest Challenge"

Each account must maintain independent:

cash
positions
orders
trades
P&L
fees
statistics
journal
performance

==================================================
7. PROFESSIONAL DASHBOARD
==================================================

Create a modern trading terminal.

Main dashboard:

------------------------------------------------
TOP BAR
------------------------------------------------

Market status:

NSE
OPEN / CLOSED / PRE-OPEN / POST-MARKET

Current time:
IST

NIFTY 50
BANK NIFTY
SENSEX

Market breadth:

Advancing
Declining
Unchanged

------------------------------------------------
LEFT SIDEBAR
------------------------------------------------

Dashboard

Markets

Watchlist

Stocks

Charts

Paper Trade

Orders

Positions

Portfolio

Options

Futures

Strategies

Backtesting

Market Scanner

Trade Journal

Performance

Leaderboard

Learning Academy

Challenges

Settings

------------------------------------------------
MAIN AREA
------------------------------------------------

Portfolio value

Available cash

Invested value

Today's P&L

Total P&L

Unrealized P&L

Realized P&L

Win rate

Risk exposure

Largest position

Drawdown

------------------------------------------------
8. STOCK SEARCH
------------------------------------------------

Create extremely fast symbol search.

Search:

RELIANCE
TCS
INFY
HDFCBANK
ICICIBANK
SBIN
ITC
BHARTIARTL

Search by:

symbol
company name
ISIN
exchange

Show:

LTP
change
change %
volume
market cap
52-week high
52-week low

==================================================
9. STOCK DETAIL PAGE
==================================================

Every stock should have:

Header:

Company name
Symbol
Exchange
LTP
₹ change
% change

Chart

Timeframes:

1m
3m
5m
15m
30m
1h
4h
1D
1W
1M
1Y
5Y
MAX

Chart types:

Candlestick
Line
Area

Volume

VWAP

Indicators.

==================================================
10. TECHNICAL INDICATORS
==================================================

Implement at least:

SMA

EMA

WMA

VWAP

RSI

MACD

Bollinger Bands

ATR

ADX

Stochastic

CCI

OBV

Supertrend

Pivot Points

Fibonacci retracement

Ichimoku

Parabolic SAR

Donchian Channels

Volume Profile if technically feasible.

Allow:

Add indicator
Remove indicator
Edit parameters
Save templates

Example:

"My Swing Setup"

EMA 20
EMA 50
RSI 14
Volume

==================================================
11. DRAWING TOOLS
==================================================

Implement:

Trend line
Horizontal line
Vertical line
Rectangle
Fibonacci retracement
Fibonacci extension
Support zone
Resistance zone
Text annotation

Allow users to save chart layouts.

==================================================
12. PAPER ORDER SYSTEM
==================================================

Implement realistic virtual order placement.

Order types:

MARKET
LIMIT
STOP LOSS
STOP LOSS MARKET

Order validity:

DAY
IOC

Where relevant, support:

AMO simulation

Do not invent order types unsupported by the selected market/provider.

==================================================
13. ORDER TICKET
==================================================

Create professional order panel.

Fields:

BUY / SELL

Exchange

Symbol

Quantity

Order type

Price

Trigger price

Product:

DELIVERY
INTRADAY

Validity

Stop loss

Target

Risk amount

Estimated charges

Estimated required capital

Maximum possible loss

Risk/reward ratio

Preview Order

Place Virtual Order

Cancel

Modify

==================================================
14. REALISTIC EXECUTION ENGINE
==================================================

THIS IS CRITICAL.

Do not simply execute every market order at the displayed LTP.

Build a simulation engine.

Market order:

simulate execution around available bid/ask.

Limit order:

execute only when market conditions cross the limit.

Stop order:

activate when trigger is reached.

Stop-loss order:

simulate trigger + execution.

Partial fills:

support where market liquidity is insufficient.

Slippage:

simulate configurable slippage.

Spread:

use bid/ask when available.

Market depth:

if available, use Level 1 / Level 2 data.

If depth is unavailable:

use configurable liquidity model.

Allow simulation profiles:

BEGINNER
REALISTIC
PROFESSIONAL

BEGINNER:

minimal slippage

REALISTIC:

spread + slippage + charges

PROFESSIONAL:

liquidity + partial fills + latency + spread + slippage

==================================================
15. TRANSACTION COST ENGINE
==================================================

Make the simulator teach users that gross P&L is NOT net P&L.

Simulate configurable Indian-market charges.

Depending on product and current applicable rules, model:

Brokerage

STT

Exchange transaction charges

GST

SEBI charges

Stamp duty

DP charges where applicable

Other applicable fees

Do NOT hard-code outdated values.

Create:

ChargeConfig

with effective dates.

Example:

charge configuration:

{
  segment: "EQUITY_DELIVERY",
  effectiveFrom: "...",
  brokerage: "...",
  stt: "...",
  gst: "...",
  exchangeCharges: "...",
  sebiCharges: "...",
  stampDuty: "..."
}

Make charges configurable from admin settings.

Show:

Gross P&L
Charges
Net P&L

==================================================
16. PORTFOLIO
==================================================

Portfolio screen:

Total portfolio value

Cash

Invested value

Day P&L

Overall P&L

Realized P&L

Unrealized P&L

Positions

Average buy price

Quantity

Current price

Market value

P&L

P&L %

Weight %

==================================================
17. POSITION MANAGEMENT
==================================================

Each position should show:

Entry price

Average price

Quantity

Current price

Stop loss

Target

Unrealized P&L

Maximum loss

Risk/reward

Holding period

Trade thesis

Journal notes

==================================================
18. ORDER BOOK
==================================================

Show:

Open orders
Completed orders
Cancelled orders
Rejected orders
Triggered orders

Columns:

Time
Symbol
Side
Quantity
Order type
Price
Trigger
Status
Average fill
Charges

Order states:

PENDING
PARTIALLY_FILLED
FILLED
CANCELLED
REJECTED
TRIGGERED
EXPIRED

==================================================
19. TRADE HISTORY
==================================================

Every completed trade must be recorded.

Store:

entry
exit
quantity
entry price
exit price
gross P&L
charges
net P&L
holding time
strategy
reason
stop loss
target
risk
R-multiple

==================================================
20. WATCHLIST
==================================================

Users can create unlimited watchlists.

Example:

My Stocks

Swing Candidates

Breakout

Dividend Stocks

Nifty 50

Intraday

Learning

Each watchlist should display:

LTP
change
%
volume
relative volume
52-week position

==================================================
21. MARKET SCANNER
==================================================

Create powerful screeners.

Filters:

Price

Market cap

Volume

Relative volume

% change

RSI

MACD

EMA crossover

SMA crossover

52-week high

52-week low

ATR

Gap up

Gap down

Breakout

Breakdown

Volume spike

VWAP relationship

Price above/below moving average

Bullish/Bearish candle patterns

==================================================
22. PRE-BUILT SCANNERS
==================================================

Examples:

Top Gainers

Top Losers

Volume Shockers

52 Week High

52 Week Low

Gap Up

Gap Down

Near VWAP

RSI Oversold

RSI Overbought

EMA 20/50 crossover

Golden Cross

Death Cross

High Relative Volume

Breakout Candidates

Breakdown Candidates

==================================================
23. FUNDAMENTAL ANALYSIS
==================================================

Stock fundamentals page.

Display where data is available:

Revenue

Revenue growth

EBITDA

EBITDA margin

Net profit

EPS

ROE

ROCE

Debt

Debt/equity

Operating cash flow

Free cash flow

PE

PB

PEG if available

Dividend yield

Market cap

Enterprise value

Promoter holding

Institutional ownership

52-week high/low

Quarterly results

Annual results

Balance sheet

Cash flow

Income statement

Do not fabricate missing data.

Display:

"Data unavailable"

instead of hallucinating.

==================================================
24. CORPORATE ACTIONS
==================================================

Simulate educational impact of:

Dividend

Bonus

Stock split

Rights issue

Buyback

Merger

Demerger

Corporate action adjustments must correctly affect historical prices and simulated portfolios.

==================================================
25. DIVIDEND SIMULATION
==================================================

If user holds shares on the relevant record-date logic:

calculate simulated dividend income.

Show:

Dividend per share

Quantity held

Gross dividend

Tax treatment as an educational estimate where appropriate

Net simulated cash impact

Dividend history

Dividend yield

==================================================
26. FUTURES MODULE
==================================================

Educational futures simulator.

Show:

Underlying

Contract

Expiry

Lot size

LTP

Entry

Exit

Margin requirement

Notional value

Mark-to-market

Realized P&L

Unrealized P&L

Expiry

Roll-over

Basis

Contango

Backwardation

Use current contract specifications from authoritative data sources.

Never hard-code permanently changing lot sizes.

==================================================
27. OPTIONS MODULE
==================================================

Create a full options learning environment.

Support:

Call

Put

Strike

Expiry

Premium

Quantity

Lot size

Open interest

Volume

IV

Delta

Gamma

Theta

Vega

Rho

Bid

Ask

Intrinsic value

Time value

Breakeven

Payoff

Max profit

Max loss

Risk graph

==================================================
28. OPTIONS STRATEGY BUILDER
==================================================

Users can construct:

Long Call

Long Put

Short Call

Short Put

Covered Call

Protective Put

Bull Call Spread

Bear Put Spread

Bull Put Spread

Bear Call Spread

Straddle

Strangle

Iron Condor

Iron Butterfly

Calendar Spread

Diagonal Spread

Collar

Allow unlimited legs.

Show:

Payoff graph

Profit zone

Loss zone

Breakeven

Maximum profit

Maximum loss

Net premium

Greeks

Probability metrics where legitimately calculated.

==================================================
29. OPTIONS GREEKS LEARNING
==================================================

Add an interactive Greeks classroom.

When user changes:

spot price
volatility
time to expiry
interest rate
strike

show how:

Delta

Gamma

Theta

Vega

change.

Explain each concept in simple language.

==================================================
30. TRADING STRATEGY LAB
==================================================

Create strategy builder.

Users can define rules.

Example:

IF

EMA20 > EMA50

AND

RSI > 50

AND

Volume > 1.5 × average volume

THEN

BUY

Stop loss:
2 ATR

Target:
4 ATR

Allow:

AND
OR
NOT

nested conditions.

==================================================
31. BACKTESTING ENGINE
==================================================

Users should be able to backtest strategies using historical data.

Inputs:

Instrument

Date range

Timeframe

Starting capital

Position size

Entry rules

Exit rules

Stop loss

Take profit

Trailing stop

Maximum positions

Brokerage

Slippage

Taxes/charges

Results:

Net return

CAGR

Win rate

Profit factor

Sharpe ratio

Sortino ratio

Maximum drawdown

Average win

Average loss

Expectancy

Number of trades

Best trade

Worst trade

Average holding period

Exposure

Equity curve

Drawdown curve

Monthly returns

Yearly returns

==================================================
32. AVOID LOOK-AHEAD BIAS
==================================================

This is an expert-level requirement.

The backtesting engine must never use future information.

Examples:

Indicators must only use data available at that candle.

Corporate actions must respect historical availability.

Fundamental data must respect publication date.

Signals must execute after the signal becomes known.

Prevent survivorship bias where possible.

Clearly explain these concepts to learners.

==================================================
33. WALK-FORWARD TESTING
==================================================

Add:

Train period

Validation period

Test period

Walk-forward analysis

This teaches users that a strategy working historically does not guarantee future performance.

==================================================
34. MARKET REPLAY
==================================================

Create a MARKET REPLAY mode.

This is one of the most important features.

Allow the user to select:

Date

Stock

Timeframe

Starting capital

Then replay historical market movement without revealing future candles.

Example:

Start:
January 15, 2025
09:15 IST

The user sees only information available at that moment.

They place virtual trades.

Advance:

1 minute

5 minutes

15 minutes

30 minutes

1 hour

custom

At the end reveal:

What actually happened.

This creates a realistic trading simulator.

==================================================
35. TRADING CHALLENGES
==================================================

Create challenges.

BEGINNER:

Make your first trade

Place a limit order

Use stop loss

Calculate position size

Read candlesticks

Find support/resistance

INTERMEDIATE:

Complete 10 trades

Maintain 1:2 risk/reward

Build a watchlist

Backtest a strategy

Achieve positive expectancy

ADVANCED:

Survive a drawdown

Trade a volatile session

Build an options spread

Complete a market replay

Create a profitable strategy after costs

Do not reward reckless risk-taking.

==================================================
36. TRADING JOURNAL
==================================================

Every trade can have a journal.

Fields:

Why did I enter?

What was my setup?

What was my expected outcome?

Where was my stop loss?

Where was my target?

What was my risk?

What happened?

What did I learn?

Emotional state:

Calm
Confident
Fearful
FOMO
Revenge
Greedy
Uncertain

The system should detect behavioral patterns.

Example:

"You moved your stop loss 5 times."

"You increased position size after a loss."

"You took 7 trades after 2 consecutive losses."

Explain the behavioral risk without judging the user.

==================================================
37. PERFORMANCE ANALYTICS
==================================================

Create professional analytics.

Metrics:

Win rate

Loss rate

Profit factor

Expectancy

Average R

Average win

Average loss

Largest win

Largest loss

Maximum drawdown

Recovery factor

Sharpe ratio

Sortino ratio

Calmar ratio

Average holding period

Trades per day

Overtrading score

Risk consistency

Stop-loss discipline

Target discipline

Strategy performance

Time-of-day performance

Day-of-week performance

Sector performance

Long vs short performance

==================================================
38. EQUITY CURVE
==================================================

Display:

Portfolio equity curve

Benchmark comparison

Drawdown curve

Daily returns

Monthly returns

Cumulative returns

Compare against:

NIFTY 50

for educational benchmarking.

==================================================
39. RISK MANAGEMENT ENGINE
==================================================

Create a dedicated risk calculator.

Inputs:

Account size

Risk %

Entry price

Stop loss

Target

Calculate:

Risk per trade

Quantity

Position value

Potential loss

Potential profit

Risk/reward

Position size

Example:

Capital:
₹10,00,000

Risk:
1%

Entry:
₹1,000

Stop:
₹950

Risk per share:
₹50

Maximum risk:
₹10,000

Quantity:
200

This should be explained visually.

==================================================
40. RISK RULES
==================================================

Create optional simulated rules:

Maximum risk per trade

Maximum daily loss

Maximum open positions

Maximum sector exposure

Maximum leverage

Maximum consecutive losses

Trading cooldown

If violated:

show warning.

Do NOT automatically block unless the user enables "strict risk mode".

==================================================
41. TRADING PSYCHOLOGY MODULE
==================================================

Create interactive lessons on:

FOMO

Revenge trading

Overtrading

Loss aversion

Recency bias

Confirmation bias

Anchoring

Gambler's fallacy

Position-size addiction

Moving stop losses

Cutting winners early

Holding losers too long

Create simulated scenarios.

==================================================
42. LEARNING ACADEMY
==================================================

Create structured curriculum.

LEVEL 1:

What is a stock?

What is NSE?

What is BSE?

What is an index?

What is a demat account?

What is a trading account?

Bid vs ask

LTP

Volume

Market capitalization

LEVEL 2:

Candlesticks

Support

Resistance

Trend

Volume

Market orders

Limit orders

Stop loss

Position sizing

LEVEL 3:

Technical analysis

Indicators

Price action

Risk management

Swing trading

Intraday trading

LEVEL 4:

Fundamental analysis

Financial statements

Valuation

Corporate actions

LEVEL 5:

Futures

Options

Greeks

Options strategies

LEVEL 6:

Backtesting

Quantitative trading

Market microstructure

Biases

Execution

Portfolio construction

==================================================
43. INTERACTIVE LESSONS
==================================================

Never make the academy only text.

Create quizzes.

Example:

"What happens to your limit buy order if the market never trades at or below your limit?"

Options:

A
It automatically executes

B
It remains pending

C
It becomes a market order

D
It gets converted to delivery

Then explain the answer.

==================================================
44. AI TRADING TUTOR
==================================================

Create an AI educational assistant.

Name:

Market Mentor

The assistant can answer:

"What is RSI?"

"Why wasn't my limit order filled?"

"Why did my stop loss execute?"

"Explain this candlestick."

"Review my trade."

"Why is my drawdown increasing?"

"Explain this option strategy."

"Teach me futures."

"Explain slippage."

"Explain this chart."

The assistant can access:

user's simulated trades
portfolio
journal
charts
learning progress
backtest results

But it must NOT say:

"Buy Reliance."

"Sell TCS."

"Buy this option."

"Short Nifty now."

Instead:

Explain the mechanics.

Explain possible interpretations.

Show educational calculations.

Highlight uncertainty.

==================================================
45. TRADE REVIEW AI
==================================================

After every completed trade, generate:

Trade summary

Entry quality

Exit quality

Risk management

Position sizing

R multiple

Execution quality

Potential behavioral issue

Lesson

Do not claim certainty about whether the trade "should" have been taken.

==================================================
46. NEWS & MARKET CONTEXT
==================================================

Create a market-news panel.

Display:

Company announcements

Corporate actions

Results

Major economic events

RBI announcements

Union Budget

Inflation

GDP

Interest-rate decisions

Global market events

The simulator should allow users to understand how news can affect prices.

Clearly distinguish:

FACT

NEWS REPORT

ANALYSIS

SIMULATION

==================================================
47. MARKET CALENDAR
==================================================

Create:

Trading holidays

Results calendar

Corporate actions

Economic events

Option expiry calendar

Futures expiry calendar

IPO calendar

==================================================
48. IPO SIMULATOR
==================================================

Educational IPO module.

Show:

Issue price

Price band

Lot size

Issue size

Subscription

GMP if available from a legitimate source, clearly labeled as unofficial

Listing price

Listing gain/loss

Allow simulated IPO application.

Never submit a real IPO application.

==================================================
49. SIP / INVESTING SIMULATOR
==================================================

Separate INVESTING mode from TRADING mode.

Allow simulated:

Monthly SIP

Weekly SIP

Lump sum

Index investing

ETF investing

Dividend reinvestment

Show:

CAGR

XIRR

Total invested

Current value

Absolute return

Benchmark

Drawdown

==================================================
50. TRADING VS INVESTING
==================================================

Create a visual comparison.

Trading:

Shorter horizon

Execution dependent

Higher activity

Costs matter heavily

Risk management critical

Investing:

Longer horizon

Business fundamentals

Compounding

Asset allocation

Valuation

Dividend/corporate actions

==================================================
51. MARKET MICROSTRUCTURE LAB
==================================================

Create an advanced learning simulator.

Explain:

Bid

Ask

Spread

Liquidity

Depth

Market impact

Slippage

Order book

Limit order book

Market order

Limit order

Stop order

Partial fills

Queue priority

Latency

Volume

VWAP

TWAP

Create an order-book visualization.

Allow users to see how a large virtual market order could move through available liquidity.

==================================================
52. ORDER BOOK
==================================================

Display:

Bid quantity
Bid price

Ask price
Ask quantity

Multiple levels where legitimate data is available.

Example:

BUY
₹999.90
1,200

₹999.80
2,500

₹999.70
3,200

SELL

₹1000.10
800

₹1000.20
1,700

₹1000.30
2,400

Use this to teach spread and liquidity.

==================================================
53. MARKET REPLAY SCENARIOS
==================================================

Create pre-built scenarios:

Gap up

Gap down

Flash crash

High volatility

Low liquidity

Earnings announcement

Breakout

False breakout

Trend day

Range-bound day

News shock

Stop-loss cascade

Option volatility expansion

Option volatility crush

==================================================
54. SIMULATION MODES
==================================================

MODE 1:

Beginner

Simplified execution.

MODE 2:

Realistic

Charges + slippage + spread.

MODE 3:

Professional

Full execution model.

MODE 4:

Historical Replay

Trade through past sessions.

MODE 5:

Backtest

Automated historical strategy testing.

==================================================
55. PAPER TRADING COMPETITION
==================================================

Optional private leaderboard.

Metrics should NOT simply reward maximum return.

Show multiple dimensions:

Return

Risk-adjusted return

Maximum drawdown

Consistency

Risk discipline

Expectancy

This prevents the simulator from encouraging reckless leverage.

==================================================
56. ACHIEVEMENT SYSTEM
==================================================

Achievements:

First Trade

First Winning Trade

First Stop Loss

10 Trades

50 Trades

100 Trades

First Backtest

First Market Replay

Risk Management Master

Options Beginner

Strategy Builder

Journal Streak

No Revenge Trading

Consistent Position Sizing

==================================================
57. DATABASE SCHEMA
==================================================

Create robust schemas for:

User

SimulationAccount

Instrument

Quote

Candle

Watchlist

WatchlistItem

Order

OrderFill

Position

Trade

PortfolioSnapshot

Transaction

Charge

CorporateAction

Dividend

FutureContract

OptionContract

OptionPosition

Strategy

StrategyRule

Backtest

BacktestTrade

JournalEntry

LearningModule

Quiz

QuizAttempt

Achievement

Challenge

MarketEvent

NewsItem

UserSetting

MarketSession

ReplaySession

==================================================
58. DATA QUALITY
==================================================

Every market-data record should contain:

source

timestamp

exchange timestamp

received timestamp

data status

adjusted/unadjusted flag where relevant

Do not silently mix:

live
delayed
historical
adjusted
unadjusted

data.

==================================================
59. MARKET HOURS
==================================================

Implement Indian market sessions correctly using timezone:

Asia/Kolkata

Do not assume the server timezone is IST.

Create a MarketCalendar service.

Handle:

trading days

weekends

exchange holidays

pre-open

regular session

post-market

special sessions where data is available

==================================================
60. TIME-SERIES DATA
==================================================

Store timestamps in UTC internally.

Convert to IST in UI.

Never use browser local timezone for market calculations.

==================================================
61. MOBILE RESPONSIVENESS
==================================================

Desktop:

Professional trading terminal.

Tablet:

Responsive dashboard.

Mobile:

Simplified:

Watchlist

Chart

Order

Positions

Portfolio

Learning

Do not attempt to cram the desktop terminal onto a mobile screen.

==================================================
62. DARK MODE
==================================================

Default:

Professional dark trading terminal.

Provide light mode.

Do not overuse neon colors.

Use colors only where semantically useful:

profit
loss
warning
neutral
information

==================================================
63. UX
==================================================

A beginner must never feel lost.

Provide:

Tooltips

Definitions

"Why?"

buttons

Explain icons

Explain order types

Explain every important financial metric.

Example:

When displaying:

P&L

tooltip:

"Profit or loss on your simulated position."

When displaying:

Drawdown

tooltip:

"Percentage decline from your previous portfolio peak."

==================================================
64. BEGINNER MODE
==================================================

Provide a toggle:

BEGINNER MODE

When enabled:

hide advanced fields

show explanations

show risk warnings

simplify charts

show educational tips

Advanced mode exposes:

Greeks

order book

advanced indicators

backtesting

market microstructure

==================================================
65. PROFESSIONAL MODE
==================================================

Professional mode should resemble a serious trading workstation.

Allow:

Multiple charts

Multiple watchlists

Depth

Time & sales

Indicators

Order panel

Positions

Orders

News

Market breadth

Scanner

==================================================
66. TIME & SALES
==================================================

If legitimate tick data is available, display:

Timestamp

Price

Quantity

Buy/sell side where reliably inferable

Trade classification

Use this to teach market activity.

==================================================
67. ALERT SYSTEM
==================================================

Users can create simulated alerts.

Price alert

Percentage alert

Indicator alert

Volume alert

Crossing alert

Support/resistance alert

Example:

"Alert me when RELIANCE crosses ₹3,000."

Alerts must NOT execute orders automatically unless the user explicitly creates a simulation strategy.

==================================================
68. STRATEGY AUTOMATION
==================================================

Allow paper-only automated strategies.

Example:

IF

price crosses EMA20

AND RSI > 50

THEN

simulate BUY

The system must clearly display:

"AUTOMATED SIMULATION"

Never connect these strategies to real brokerage execution.

==================================================
69. EXPERIMENT MODE
==================================================

Users can create experiments.

Example:

Hypothesis:

"Buying stocks after a 20-day high breakout works better when volume is above average."

Define:

Hypothesis

Entry

Exit

Risk

Time period

Universe

Benchmark

Results

Conclusion

This teaches scientific thinking instead of random indicator hunting.

==================================================
70. STRATEGY OVERFITTING PROTECTION
==================================================

Warn users when:

too many parameters

tiny sample size

extreme historical performance

large difference between training and test performance

strategy only works in one period

strategy collapses after transaction costs

This is an expert-level feature.

==================================================
71. PERFORMANCE REPORT
==================================================

Generate a professional report.

Example:

TRADING PERFORMANCE REPORT

Period:
01 Jan 2026 - 31 Mar 2026

Starting Capital:
₹10,00,000

Ending Capital:
₹10,87,000

Net Return:
8.70%

Trades:
74

Win Rate:
56.8%

Profit Factor:
1.42

Maximum Drawdown:
4.8%

Average R:
0.31R

Then explain what each metric means.

==================================================
72. TRADE STATISTICS
==================================================

Analyze:

Best setup

Worst setup

Best time

Worst time

Best sector

Worst sector

Average hold

Winning hold

Losing hold

Largest loss

Largest gain

Risk violations

Behavioral patterns

==================================================
73. EDUCATIONAL SAFETY
==================================================

Every advanced trading section should contain educational risk context.

Especially:

Futures

Options

Leverage

Short selling

Intraday

Margin

Stop losses

Derivatives

Explain that simulated performance does not guarantee real-world performance.

Do not encourage excessive leverage.

==================================================
74. SEBI EDUCATIONAL CONTENT
==================================================

Where possible, link users to authoritative investor-education resources.

Include lessons covering:

securities market basics

derivatives

corporate actions

investor protection

fraud awareness

risk management

Use official sources rather than random blogs for regulatory concepts.

==================================================
75. ADMIN PANEL
==================================================

Admin can configure:

Market data providers

Market hours

Trading holidays

Charges

Supported instruments

Options contracts

Futures contracts

Learning content

Challenges

Announcements

Feature flags

Simulation parameters

Slippage

Latency

Execution rules

==================================================
76. LOGGING
==================================================

Log every simulated order event.

Example:

ORDER_CREATED

ORDER_VALIDATED

ORDER_ACCEPTED

ORDER_TRIGGERED

ORDER_PARTIALLY_FILLED

ORDER_FILLED

ORDER_CANCELLED

ORDER_REJECTED

ORDER_EXPIRED

This makes the simulator debuggable and educational.

==================================================
77. AUDIT TRAIL
==================================================

Every portfolio-changing event should have an immutable audit record.

Example:

Timestamp

Account

Action

Before state

After state

Reason

==================================================
78. ERROR HANDLING
==================================================

Never silently fail.

If market data is unavailable:

show:

"Market data temporarily unavailable."

Do NOT display stale data as current.

If data is delayed:

show:

"15-minute delayed data."

==================================================
79. OFFLINE DEMO MODE
==================================================

The application must still work without external APIs.

Include demo dataset.

Use synthetic/historical data.

Demo mode should simulate:

NIFTY

RELIANCE

TCS

INFY

HDFCBANK

ICICIBANK

SBIN

TATAMOTORS

==================================================
80. TESTING
==================================================

Create:

Unit tests

Integration tests

Execution engine tests

Order matching tests

Portfolio tests

P&L tests

Charge calculation tests

Options payoff tests

Backtesting tests

Timezone tests

Market session tests

Corporate action tests

Regression tests

==================================================
81. CRITICAL FINANCIAL CALCULATIONS
==================================================

Use decimal-safe arithmetic.

Do NOT rely blindly on JavaScript floating point for money.

Use Decimal.js or database NUMERIC/DECIMAL.

Validate:

P&L

average price

position quantity

charges

margin

option payoff

portfolio NAV

returns

drawdown

CAGR

XIRR

Sharpe

Sortino

==================================================
82. SECURITY
==================================================

Implement:

Input validation

Rate limiting

Authentication

Authorization

Secure sessions

CSRF protection where applicable

XSS protection

SQL injection protection

API key protection

Secrets never exposed to frontend

==================================================
83. API DESIGN
==================================================

Create documented APIs.

Example:

GET /api/market/quote/:symbol

GET /api/market/candles/:symbol

GET /api/instruments

GET /api/watchlists

POST /api/orders/simulate

GET /api/orders

DELETE /api/orders/:id

GET /api/positions

GET /api/portfolio

GET /api/trades

POST /api/backtests

GET /api/backtests/:id

POST /api/replay

GET /api/learning/modules

POST /api/learning/quiz

==================================================
84. WEBSOCKET
==================================================

Use WebSocket for:

quotes

watchlists

portfolio updates

order status

alerts

market status

charts

Do not continuously poll if WebSocket streaming is available.

==================================================
85. PERFORMANCE
==================================================

The dashboard should feel instant.

Use:

Redis

database indexing

WebSocket streams

virtualized tables

lazy loading

server-side pagination

caching

efficient candle aggregation

Do not send thousands of unnecessary records to the browser.

==================================================
86. DESIGN SYSTEM
==================================================

Create reusable components:

MarketHeader

StockSearch

Watchlist

CandlestickChart

IndicatorPanel

OrderTicket

PositionCard

PortfolioSummary

OrderBook

TradeHistory

PnlCard

RiskCalculator

BacktestPanel

StrategyBuilder

LearningCard

QuizCard

TradeReview

MarketScanner

OptionsChain

PayoffChart

PerformanceChart

JournalEntry

==================================================
87. HOME PAGE
==================================================

Hero:

"Learn Trading Without Losing Money."

Subtitle:

"Practice Indian stock-market trading with virtual capital, real market data where legally available, realistic execution, historical replay, backtesting and interactive lessons."

Buttons:

START SIMULATION

LEARN FROM ZERO

REPLAY THE MARKET

BACKTEST A STRATEGY

==================================================
88. FIRST-TIME USER EXPERIENCE
==================================================

On first login:

Ask:

Have you traded before?

Options:

Never

A little

Some experience

Advanced

Then:

"What do you want to learn?"

Investing

Swing Trading

Intraday

Options

Futures

Technical Analysis

Fundamental Analysis

Quantitative Trading

Then automatically create a learning path.

==================================================
89. DAILY LEARNING SYSTEM
==================================================

Give users:

Daily lesson

Daily market observation task

One simulated trade challenge

One quiz

One reflection

Example:

DAY 1

Understand bid/ask.

Observe 5 stocks.

Place one limit order.

Explain why it filled or didn't fill.

==================================================
90. LEARNING PROGRESSION
==================================================

Do NOT unlock everything immediately.

Progression:

Beginner

Trader

Intermediate

Advanced

Quant

Unlock advanced tools through education.

However, provide an "Explore Everything" mode for experienced users.

==================================================
91. MARKET OBSERVATION MODE
==================================================

Allow users to watch the market without trading.

Ask:

What do you think will happen?

Bullish

Bearish

Range

Then after a chosen period:

show what actually happened.

This teaches forecasting without financial consequences.

==================================================
92. PREDICTION JOURNAL
==================================================

User writes:

"I expect RELIANCE to break resistance."

The system records:

timestamp

price

prediction

reason

Then later evaluates:

Prediction direction

Actual movement

Maximum favorable excursion

Maximum adverse excursion

This teaches accountability.

==================================================
93. NO HINDSIGHT MODE
==================================================

Historical replay must hide:

future candles

future news

future fundamentals

future corporate actions

unless those events would already have been publicly available at that timestamp.

==================================================
94. DATA SOURCE LABELING
==================================================

Every data page should show:

Data source

Timestamp

Live/delayed/historical

Last update

Example:

"NSE market data | Updated 18:42:03 IST | LIVE"

or

"Historical data | 15 Jan 2026"

Never fake this label.

==================================================
95. FINANCIAL EDUCATION MODE
==================================================

Create visual explanations.

Example:

If user clicks "Market Order":

Show:

"You're telling the market:

Execute this trade at the best available price."

Then show:

Bid

Ask

Spread

Potential slippage

==================================================
96. BEGINNER TRADING COURSE
==================================================

Create at least 12 modules:

1. Stock Market Basics
2. NSE & BSE
3. Candlesticks
4. Charts
5. Orders
6. Risk Management
7. Technical Analysis
8. Fundamental Analysis
9. Swing Trading
10. Intraday
11. Futures
12. Options

Each module:

Lesson

Visual example

Interactive exercise

Quiz

Simulation task

Final assessment

==================================================
97. ADVANCED COURSE
==================================================

Modules:

Market Microstructure

Quantitative Trading

Backtesting

Statistics

Probability

Expectancy

Risk of Ruin

Portfolio Theory

Factor Investing

Pairs Trading

Momentum

Mean Reversion

Volatility

Options Greeks

Volatility Surface

Execution

Slippage

Transaction Costs

Overfitting

Walk-forward analysis

==================================================
98. RISK OF RUIN CALCULATOR
==================================================

Create an educational calculator showing how:

win rate

average win

average loss

risk per trade

number of trades

affect probability of large drawdowns.

Explain that historical assumptions are not guarantees.

==================================================
99. PORTFOLIO MODE
==================================================

Allow simulated asset allocation.

Example:

NIFTY ETF
BANK ETF
Gold ETF
Stocks
Cash

Show:

allocation

concentration

sector exposure

correlation

drawdown

volatility

==================================================
100. CORRELATION LAB
==================================================

Select multiple instruments.

Display:

Correlation matrix

Rolling correlation

Relationship chart

Explain:

Correlation is not causation.

==================================================
101. FACTOR LAB
==================================================

Where data is available, allow educational exploration of:

Momentum

Value

Quality

Low volatility

Size

Dividend

Create simulated factor portfolios.

==================================================
102. EXPORT
==================================================

Allow export:

CSV

Excel-compatible CSV

PDF report

Trade journal

Orders

Portfolio

Backtest results

Performance report

==================================================
103. RESET SIMULATION
==================================================

Allow:

Reset account

Reset portfolio

Reset all trades

Start new challenge

Start from historical date

Require confirmation.

==================================================
104. DATA PRIVACY
==================================================

User simulation data belongs to the user.

Do not sell or share user trading journals.

Do not expose private portfolios publicly.

Leaderboard should be opt-in.

==================================================
105. FINANCIAL DISCLAIMER
==================================================

Display clearly:

"This platform is an educational paper-trading simulator. Trades are simulated and do not involve real money or real securities. Market data may be live, delayed, historical, or simulated depending on the selected mode and data provider. Simulated performance does not predict real-world results."

==================================================
106. IMPLEMENTATION PRIORITY
==================================================

Build in phases.

PHASE 1:

Authentication

Virtual account

Market data

Watchlist

Charts

Stock search

Paper trading

Orders

Positions

P&L

Portfolio

Trade history

PHASE 2:

Technical indicators

Scanner

Risk calculator

Journal

Performance analytics

Learning academy

PHASE 3:

Backtesting

Strategy builder

Market replay

Advanced execution engine

PHASE 4:

Options

Options chain

Greeks

Payoff graphs

Futures

PHASE 5:

AI tutor

AI trade review

Psychology

Experiments

Advanced quantitative tools

==================================================
107. MVP MUST BE ACTUALLY FUNCTIONAL
==================================================

Do not generate fake UI screenshots.

Do not create buttons that do nothing.

Every major button should perform a real action.

If a feature cannot be implemented because an external market-data provider requires credentials, create the provider abstraction and working mock/demo provider.

==================================================
108. DEMO DATA
==================================================

Provide realistic historical/demo data.

The app must launch successfully without requiring paid APIs.

Use clearly labeled demo/historical data.

Never represent demo data as live.

==================================================
109. DEVELOPMENT EXPERIENCE
==================================================

Create:

README.md

.env.example

Database migrations

Seed script

Demo account

API documentation

Architecture documentation

Testing instructions

Deployment instructions

Data-provider setup instructions

==================================================
110. FINAL UI QUALITY
==================================================

The finished product should feel like a combination of:

professional trading terminal
+
TradingView-style charting
+
paper trading simulator
+
interactive trading academy
+
quant strategy lab
+
trading journal
+
market replay game

But do NOT copy proprietary UI designs.

Create an original interface.

==================================================
111. MOST IMPORTANT DESIGN PHILOSOPHY
==================================================

The goal is NOT:

"Make the user feel profitable."

The goal is:

"Make the user understand why a trade made or lost money."

The simulator should teach:

execution

risk

probability

discipline

statistics

market mechanics

costs

psychology

uncertainty

==================================================
112. FINAL ACCEPTANCE TEST
==================================================

A new user must be able to:

1. Create an account.
2. Receive ₹10 lakh virtual capital.
3. Search RELIANCE.
4. Open its chart.
5. Add RSI and EMA.
6. Add it to a watchlist.
7. Place a simulated limit buy order.
8. See the order remain pending if price doesn't reach the limit.
9. See it execute when appropriate.
10. See the position appear.
11. Set a simulated stop loss.
12. See P&L update with market data.
13. Close the position.
14. See realized P&L.
15. See transaction costs.
16. Read the trade analytics.
17. Journal the trade.
18. Review the trade with AI.
19. Replay a historical session.
20. Backtest a strategy.
21. Build an options strategy.
22. Calculate risk.
23. Complete a learning module.
24. Take a quiz.
25. View overall performance.

==================================================
113. IMPORTANT ENGINEERING RULE
==================================================

Never sacrifice correctness for visual polish.

Correct:

market session handling

P&L

order execution

position accounting

charges

timestamps

historical replay

backtesting

options payoff

risk calculations

are more important than animations.

==================================================
114. DELIVERABLE
==================================================

Produce the complete working application.

First create the architecture.

Then implement the database.

Then backend.

Then market-data abstraction.

Then simulation engine.

Then frontend.

Then learning system.

Then analytics.

Then backtesting.

Then options.

Then AI layer.

Then testing.

Then documentation.

After implementation, run the test suite and fix all errors.

Do not stop at a prototype.

The final application should be usable as a complete educational stock-market simulator.

==================================================
115. FINAL PRODUCT NAME
==================================================

Use the working name:

"TradeLab India"

Tagline:

"Learn the market. Risk nothing."

Make the branding professional, modern and credible.