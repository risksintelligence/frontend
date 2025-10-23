'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Prediction {
  id: string;
  name: string;
  type: 'economic' | 'market' | 'risk' | 'geopolitical';
  prediction: number;
  confidence: number;
  timeHorizon: '1m' | '3m' | '6m' | '1y';
  currentValue: number;
  accuracy: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  lastUpdated: string;
  description: string;
  factors: string[];
}

interface ModelPerformance {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
}

export default function PredictionDashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('all');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch('/api/v1/analytics/predictions');
      // const data = await response.json();
      
      // Sample predictions for demonstration
      const samplePredictions: Prediction[] = [
        {
          id: 'gdp-forecast',
          name: 'GDP Growth Forecast',
          type: 'economic',
          prediction: 1.8,
          confidence: 0.82,
          timeHorizon: '3m',
          currentValue: 2.1,
          accuracy: 94.2,
          trend: 'bearish',
          lastUpdated: new Date().toISOString(),
          description: 'Quarterly GDP growth expected to decline due to monetary tightening',
          factors: ['Federal Reserve Policy', 'Consumer Spending', 'Business Investment']
        },
        {
          id: 'inflation-forecast',
          name: 'Inflation Rate Forecast',
          type: 'economic',
          prediction: 2.8,
          confidence: 0.76,
          timeHorizon: '6m',
          currentValue: 3.2,
          accuracy: 87.5,
          trend: 'bearish',
          lastUpdated: new Date().toISOString(),
          description: 'CPI expected to moderate as supply chain pressures ease',
          factors: ['Energy Prices', 'Supply Chain', 'Labor Market']
        },
        {
          id: 'unemployment-forecast',
          name: 'Unemployment Forecast',
          type: 'economic',
          prediction: 4.1,
          confidence: 0.89,
          timeHorizon: '3m',
          currentValue: 3.7,
          accuracy: 91.8,
          trend: 'bearish',
          lastUpdated: new Date().toISOString(),
          description: 'Labor market expected to soften with economic slowdown',
          factors: ['Job Openings', 'Layoff Announcements', 'Economic Growth']
        },
        {
          id: 'market-volatility',
          name: 'Market Volatility Index',
          type: 'market',
          prediction: 22.5,
          confidence: 0.71,
          timeHorizon: '1m',
          currentValue: 18.3,
          accuracy: 83.4,
          trend: 'bullish',
          lastUpdated: new Date().toISOString(),
          description: 'VIX expected to rise due to geopolitical tensions',
          factors: ['Geopolitical Events', 'Earnings Season', 'Fed Communications']
        },
        {
          id: 'credit-spreads',
          name: 'Corporate Credit Spreads',
          type: 'market',
          prediction: 125,
          confidence: 0.68,
          timeHorizon: '6m',
          currentValue: 98,
          accuracy: 79.2,
          trend: 'bullish',
          lastUpdated: new Date().toISOString(),
          description: 'Credit spreads likely to widen with economic uncertainty',
          factors: ['Credit Quality', 'Economic Outlook', 'Liquidity Conditions']
        },
        {
          id: 'recession-probability',
          name: 'Recession Probability',
          type: 'risk',
          prediction: 35.2,
          confidence: 0.74,
          timeHorizon: '1y',
          currentValue: 28.7,
          accuracy: 86.1,
          trend: 'bullish',
          lastUpdated: new Date().toISOString(),
          description: 'Elevated recession risk due to multiple economic headwinds',
          factors: ['Yield Curve', 'Leading Indicators', 'Policy Uncertainty']
        }
      ];

      const sampleModelPerformance: ModelPerformance[] = [
        {
          modelName: 'Economic Growth Predictor',
          accuracy: 94.2,
          precision: 92.1,
          recall: 89.3,
          f1Score: 90.7,
          lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          modelName: 'Market Volatility Model',
          accuracy: 83.4,
          precision: 81.2,
          recall: 85.6,
          f1Score: 83.4,
          lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          modelName: 'Risk Assessment Engine',
          accuracy: 86.1,
          precision: 84.8,
          recall: 87.2,
          f1Score: 86.0,
          lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setPredictions(samplePredictions);
      setModelPerformance(sampleModelPerformance);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'economic': return 'text-terminal-green';
      case 'market': return 'text-terminal-blue';
      case 'risk': return 'text-terminal-red';
      case 'geopolitical': return 'text-terminal-orange';
      default: return 'text-terminal-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'bearish': return <TrendingUp className="w-4 h-4 text-terminal-red rotate-180" />;
      default: return <Target className="w-4 h-4 text-terminal-muted" />;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return { level: 'HIGH', color: 'text-terminal-green' };
    if (confidence >= 0.6) return { level: 'MEDIUM', color: 'text-terminal-orange' };
    return { level: 'LOW', color: 'text-terminal-red' };
  };

  const filteredPredictions = selectedTimeHorizon === 'all' 
    ? predictions 
    : predictions.filter(prediction => prediction.timeHorizon === selectedTimeHorizon);

  const timeHorizons = [
    { key: 'all', label: 'All Horizons' },
    { key: '1m', label: '1 Month' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' },
    { key: '1y', label: '1 Year' }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-terminal-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            ML PREDICTIONS & FORECASTS
          </h2>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          AI-powered economic forecasting
        </div>
      </div>

      {/* Time Horizon Filter */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center gap-4">
          <Clock className="w-4 h-4 text-terminal-muted" />
          <span className="font-mono text-sm text-terminal-muted">TIME HORIZON:</span>
          <div className="flex gap-2">
            {timeHorizons.map((horizon) => (
              <button
                key={horizon.key}
                onClick={() => setSelectedTimeHorizon(horizon.key)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  selectedTimeHorizon === horizon.key
                    ? 'bg-terminal-green/20 text-terminal-green border border-terminal-green/30'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
                }`}
              >
                {horizon.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPredictions.map((prediction) => {
          const typeColor = getTypeColor(prediction.type);
          const confidenceLevel = getConfidenceLevel(prediction.confidence);
          const change = prediction.prediction - prediction.currentValue;
          const changePercent = ((change / prediction.currentValue) * 100);
          
          return (
            <div
              key={prediction.id}
              className="bg-terminal-surface border border-terminal-border p-6 rounded hover:bg-terminal-surface/80 transition-colors"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-mono ${typeColor} bg-terminal-bg border border-terminal-border`}>
                      {prediction.type.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-mono text-terminal-muted bg-terminal-bg border border-terminal-border">
                      {prediction.timeHorizon.toUpperCase()}
                    </span>
                  </div>
                  {getTrendIcon(prediction.trend)}
                </div>

                {/* Name */}
                <h3 className="font-mono font-semibold text-terminal-text">
                  {prediction.name.toUpperCase()}
                </h3>

                {/* Prediction vs Current */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">CURRENT</div>
                    <div className="text-xl font-mono font-bold text-terminal-text">
                      {prediction.currentValue.toFixed(1)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">FORECAST</div>
                    <div className="text-xl font-mono font-bold text-terminal-text">
                      {prediction.prediction.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Change */}
                <div className="flex items-center justify-between">
                  <span className="text-terminal-muted font-mono text-xs">EXPECTED CHANGE</span>
                  <div className={`font-mono text-sm ${
                    change > 0 ? 'text-terminal-green' : 
                    change < 0 ? 'text-terminal-red' : 
                    'text-terminal-muted'
                  }`}>
                    {change > 0 ? '+' : ''}{change.toFixed(1)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
                  </div>
                </div>

                {/* Confidence and Accuracy */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">CONFIDENCE</div>
                    <div className={`font-mono text-sm font-semibold ${confidenceLevel.color}`}>
                      {(prediction.confidence * 100).toFixed(1)}% ({confidenceLevel.level})
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-terminal-muted font-mono text-xs mb-1">MODEL ACCURACY</div>
                    <div className="font-mono text-sm font-semibold text-terminal-text">
                      {prediction.accuracy.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-terminal-muted font-mono text-xs leading-relaxed">
                  {prediction.description}
                </p>

                {/* Key Factors */}
                <div>
                  <div className="text-terminal-muted font-mono text-xs mb-2">KEY FACTORS:</div>
                  <div className="flex flex-wrap gap-1">
                    {prediction.factors.map((factor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-terminal-bg border border-terminal-border rounded text-xs font-mono text-terminal-text"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Last Updated */}
                <div className="text-terminal-muted font-mono text-xs">
                  Updated: {new Date(prediction.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Model Performance */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          MODEL PERFORMANCE METRICS
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modelPerformance.map((model, index) => (
            <div key={index} className="bg-terminal-bg border border-terminal-border p-4 rounded">
              <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
                {model.modelName.toUpperCase()}
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-terminal-muted font-mono text-xs">Accuracy</span>
                  <span className="text-terminal-text font-mono text-xs">{model.accuracy.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-terminal-muted font-mono text-xs">Precision</span>
                  <span className="text-terminal-text font-mono text-xs">{model.precision.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-terminal-muted font-mono text-xs">Recall</span>
                  <span className="text-terminal-text font-mono text-xs">{model.recall.toFixed(1)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-terminal-muted font-mono text-xs">F1-Score</span>
                  <span className="text-terminal-text font-mono text-xs">{model.f1Score.toFixed(1)}%</span>
                </div>
                
                <div className="pt-2 border-t border-terminal-border">
                  <div className="text-terminal-muted font-mono text-xs">
                    Last Trained: {new Date(model.lastTrained).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}