import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import { fetchCandles } from '../../services/marketData';
import { TIMEFRAME_OPTIONS } from '../../utils/constants';

interface StockChartProps {
  symbol: string;
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({ symbol, height = 450 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  
  const [timeframe, setTimeframe] = useState(TIMEFRAME_OPTIONS[2]); // 1M by default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0e17' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: true,
      },
      height: height,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // set as an overlay
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // highest point of the series will be at 80% of the chart height
        bottom: 0,
      },
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    
    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [height]);

  const loadData = async () => {
    if (!seriesRef.current || !volumeSeriesRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const candles = await fetchCandles(symbol, timeframe.range, timeframe.interval);
      
      const chartData = candles.map(c => ({
        time: c.time as any,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));
      
      const volumeData = candles.map(c => ({
        time: c.time as any,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
      }));

      seriesRef.current.setData(chartData);
      volumeSeriesRef.current.setData(volumeData);
      chartRef.current?.timeScale().fitContent();
    } catch (err) {
      console.error('Failed to fetch chart data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [symbol, timeframe]);

  return (
    <div className="w-full flex flex-col h-full relative">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {TIMEFRAME_OPTIONS.map((tf) => (
          <button
            key={tf.label}
            className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
              timeframe.label === tf.label 
                ? 'bg-brand-600 text-white' 
                : 'bg-surface-2 text-gray-400 hover:text-white'
            }`}
            onClick={() => setTimeframe(tf)}
          >
            {tf.label}
          </button>
        ))}
      </div>
      
      <div className="flex-grow w-full relative" ref={chartContainerRef}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface-1/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {error && !loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-1/80">
            <p className="text-red-400 mb-2">{error}</p>
            <button className="btn-primary text-xs" onClick={loadData}>Retry</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChart;
