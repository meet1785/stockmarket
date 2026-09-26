import { useState, useMemo } from 'react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useAuthStore } from '../../stores/authStore';
import { calculateCharges, estimateRequiredCapital, createOrder, tryFillMarketOrder } from '../../services/matchingEngine';
import type { Exchange, OrderType, OrderSide, ProductType, OrderValidity, StockQuote } from '../../types';
import { formatCurrency, generateId } from '../../utils/formatters';
import { AlertTriangle } from 'lucide-react';

interface OrderTicketProps {
  symbol: string;
  companyName: string;
  exchange: Exchange;
  currentPrice: number;
}

export default function OrderTicket({ symbol, companyName, exchange, currentPrice }: OrderTicketProps) {
  const { user } = useAuthStore();
  const { portfolio, addOrder, processBuyFill, processSellFill } = usePortfolioStore();

  const [side, setSide] = useState<OrderSide>('BUY');
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [productType, setProductType] = useState<ProductType>('CNC');
  const [validity, setValidity] = useState<OrderValidity>('DAY');
  const [quantity, setQuantity] = useState<string>('1');
  const [price, setPrice] = useState<string>('');
  const [triggerPrice, setTriggerPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [target, setTarget] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const numQuantity = parseInt(quantity) || 0;
  const numPrice = orderType === 'MARKET' ? currentPrice : (parseFloat(price) || currentPrice);
  const orderValue = numQuantity * numPrice;

  const charges = useMemo(() =>
    calculateCharges(numPrice, numQuantity, side, productType),
    [numPrice, numQuantity, side, productType]
  );

  const requiredCapital = useMemo(() =>
    estimateRequiredCapital(numPrice, numQuantity, side, productType),
    [numPrice, numQuantity, side, productType]
  );

  const existingHolding = portfolio.holdings.find(h => h.symbol === symbol);

  const validate = (): boolean => {
    setError(null);
    if (numQuantity <= 0) { setError('Quantity must be greater than 0'); return false; }
    if (currentPrice <= 0) { setError('Cannot trade — no price available'); return false; }
    if ((orderType === 'LIMIT' || orderType === 'STOP_LIMIT') && (!parseFloat(price) || parseFloat(price) <= 0)) {
      setError('Enter a valid limit price'); return false;
    }
    if ((orderType === 'STOP' || orderType === 'STOP_LIMIT') && (!parseFloat(triggerPrice) || parseFloat(triggerPrice) <= 0)) {
      setError('Enter a valid trigger price'); return false;
    }
    if (side === 'BUY' && requiredCapital + charges.total > portfolio.cash) {
      setError(`Insufficient cash. Need: ${formatCurrency(requiredCapital + charges.total)}, Have: ${formatCurrency(portfolio.cash)}`);
      return false;
    }
    if (side === 'SELL' && productType === 'CNC') {
      const availQty = existingHolding?.quantity || 0;
      if (numQuantity > availQty) {
        setError(`Insufficient holdings. Have: ${availQty}, Selling: ${numQuantity}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate() || !user) return;

    const order = createOrder({
      symbol, companyName, exchange, side,
      type: orderType,
      quantity: numQuantity,
      price: orderType === 'MARKET' ? undefined : numPrice,
      triggerPrice: (orderType === 'STOP' || orderType === 'STOP_LIMIT') ? parseFloat(triggerPrice) : undefined,
      product: productType,
      validity,
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      target: target ? parseFloat(target) : undefined,
    }, portfolio.id);

    if (orderType === 'MARKET' && currentPrice > 0) {
      // Simulate immediate fill
      const mockQuote: StockQuote = {
        symbol, companyName, exchange, ltp: currentPrice,
        change: 0, changePercent: 0, open: currentPrice, high: currentPrice,
        low: currentPrice, previousClose: currentPrice, volume: 0,
        dayHigh: currentPrice, dayLow: currentPrice, timestamp: Date.now(), isStale: false,
      };
      const mode = user.settings.simulationMode;
      const filledOrder = tryFillMarketOrder(order, mockQuote, mode, user.settings.brokerageModel);
      addOrder(filledOrder);
      if (side === 'BUY') processBuyFill(filledOrder);
      else processSellFill(filledOrder);
      setSuccess(`${side} order filled: ${numQuantity} × ${symbol} @ ₹${filledOrder.avgFillPrice?.toFixed(2)}`);
    } else {
      addOrder({ ...order, status: 'OPEN' });
      setSuccess(`${orderType} order placed for ${numQuantity} × ${symbol}`);
    }

    setShowPreview(false);
    setTimeout(() => setSuccess(null), 4000);
  };

  const riskReward = useMemo(() => {
    const sl = parseFloat(stopLoss); const tgt = parseFloat(target);
    if (!sl || !tgt || !numPrice) return null;
    const risk = side === 'BUY' ? numPrice - sl : sl - numPrice;
    const reward = side === 'BUY' ? tgt - numPrice : numPrice - tgt;
    if (risk <= 0 || reward <= 0) return null;
    return (reward / risk).toFixed(2);
  }, [stopLoss, target, numPrice, side]);

  return (
    <div className="card p-4">
      <div className="simulation-banner mb-4 rounded flex items-center gap-2 justify-center">
        <AlertTriangle className="h-3 w-3" />
        SIMULATED ORDER — NO REAL MONEY
      </div>

      {success && <div className="bg-green-500/20 text-green-400 text-sm p-2 rounded mb-3">{success}</div>}

      {/* BUY / SELL toggle */}
      <div className="flex rounded-lg overflow-hidden mb-4">
        <button className={`flex-1 py-2 font-bold transition-colors ${side === 'BUY' ? 'bg-green-600 text-white' : 'bg-surface-2 text-gray-400 hover:bg-surface-3'}`} onClick={() => setSide('BUY')}>BUY</button>
        <button className={`flex-1 py-2 font-bold transition-colors ${side === 'SELL' ? 'bg-red-600 text-white' : 'bg-surface-2 text-gray-400 hover:bg-surface-3'}`} onClick={() => setSide('SELL')}>SELL</button>
      </div>

      <div className="space-y-4">
        {/* Product & Validity */}
        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Product:</span>
            <button className={`px-2 py-1 rounded ${productType === 'CNC' ? 'bg-brand-600 text-white' : 'bg-surface-2'}`} onClick={() => setProductType('CNC')}>CNC</button>
            <button className={`px-2 py-1 rounded ${productType === 'MIS' ? 'bg-brand-600 text-white' : 'bg-surface-2'}`} onClick={() => setProductType('MIS')}>MIS</button>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">Validity:</span>
            <button className={`px-2 py-1 rounded ${validity === 'DAY' ? 'bg-brand-600 text-white' : 'bg-surface-2'}`} onClick={() => setValidity('DAY')}>DAY</button>
            <button className={`px-2 py-1 rounded ${validity === 'GTC' ? 'bg-brand-600 text-white' : 'bg-surface-2'}`} onClick={() => setValidity('GTC')}>GTC</button>
          </div>
        </div>

        {/* Order Type */}
        <div className="flex gap-2">
          {(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'] as OrderType[]).map(t => (
            <button key={t} className={`flex-1 text-xs py-1.5 rounded border ${orderType === t ? 'border-brand-500 text-brand-400 bg-brand-500/10' : 'border-gray-600 text-gray-400'}`} onClick={() => setOrderType(t)}>
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Quantity</label>
            <input type="number" min="1" className="input" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Price</label>
            <input type="number" className="input disabled:opacity-50" value={orderType === 'MARKET' ? currentPrice.toFixed(2) : price} onChange={e => setPrice(e.target.value)} disabled={orderType === 'MARKET' || orderType === 'STOP'} placeholder={currentPrice.toFixed(2)} />
          </div>
          {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
            <div className="col-span-2">
              <label className="block text-xs text-gray-400 mb-1">Trigger Price</label>
              <input type="number" className="input" value={triggerPrice} onChange={e => setTriggerPrice(e.target.value)} />
            </div>
          )}
        </div>

        {/* SL / Target */}
        <div className="border-t border-gray-700/50 pt-3">
          <p className="text-xs text-gray-500 mb-2">Optional: Stop Loss & Target</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Stop Loss</label>
              <input type="number" className="input" placeholder="₹" value={stopLoss} onChange={e => setStopLoss(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Target</label>
              <input type="number" className="input" placeholder="₹" value={target} onChange={e => setTarget(e.target.value)} />
            </div>
          </div>
          {riskReward && <p className="mt-1 text-xs text-blue-400">Risk/Reward: 1:{riskReward}</p>}
        </div>

        {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 p-2 rounded">{error}</div>}

        {/* Summary */}
        <div className="bg-surface-2 p-3 rounded flex justify-between text-sm">
          <div><p className="text-gray-500 text-xs">Required</p><p className="font-semibold">{formatCurrency(requiredCapital)}</p></div>
          <div><p className="text-gray-500 text-xs">Charges</p><p className="font-semibold">{formatCurrency(charges.total)}</p></div>
          <div><p className="text-gray-500 text-xs">Total</p><p className="font-semibold">{formatCurrency(requiredCapital + charges.total)}</p></div>
        </div>

        {!showPreview ? (
          <button className={`w-full py-3 rounded-lg font-bold text-white ${side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={() => { if (validate()) setShowPreview(true); }}>
            Preview {side} Order
          </button>
        ) : (
          <div className="border border-gray-600 p-4 rounded-lg bg-surface-2 space-y-3">
            <h3 className="font-bold border-b border-gray-700 pb-2">Confirm Virtual {side} Order</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-400">Symbol</span><span>{symbol}</span>
              <span className="text-gray-400">Qty</span><span>{numQuantity}</span>
              <span className="text-gray-400">Type</span><span>{orderType}</span>
              <span className="text-gray-400">Product</span><span>{productType}</span>
              <span className="text-gray-400">Est. Cost</span><span>{formatCurrency(requiredCapital + charges.total)}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-surface-3 hover:bg-surface-4 rounded font-bold" onClick={() => setShowPreview(false)}>Cancel</button>
              <button className={`flex-1 py-2 font-bold rounded text-white ${side === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} onClick={handleSubmit}>Place Virtual Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
