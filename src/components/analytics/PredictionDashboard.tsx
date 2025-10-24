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
      
      // Load real predictions from API
      const response = await fetch('/api/v1/analytics/predictions');
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      
      const data = await response.json();
      const realPredictions: Prediction[] = data.predictions || [];
      
      // Also fetch model performance data
      const perfResponse = await fetch('/api/v1/analytics/model-performance');
      const perfData = await perfResponse.json();
      
      setPredictions(realPredictions);
      setModelPerformance(perfData.models || []);
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
      case 'bullish': return '↗';
      case 'bearish': return '↘';
      default: return '→';
    }
  };

  const filteredPredictions = selectedTimeHorizon === 'all' 
    ? predictions 
    : predictions.filter(p => p.timeHorizon === selectedTimeHorizon);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-terminal-green" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            ML PREDICTIONS & FORECASTS
          </h2>
        </div>
        
        <div className="text-terminal-muted font-mono text-sm">
          Advanced economic forecasting and analytics
        </div>
      </div>

      {/* Time Horizon Filter */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
        <div className="flex items-center gap-4">
          <span className="font-mono text-terminal-text text-sm">TIME HORIZON:</span>
          <div className="flex gap-2">
            {['all', '1m', '3m', '6m', '1y'].map((horizon) => (
              <button
                key={horizon}
                onClick={() => setSelectedTimeHorizon(horizon)}
                className={`px-3 py-1 font-mono text-sm rounded transition-colors ${
                  selectedTimeHorizon === horizon
                    ? 'bg-terminal-green text-terminal-bg'
                    : 'bg-terminal-bg text-terminal-text hover:bg-terminal-green/20'
                }`}
              >
                {horizon.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPredictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-terminal-surface border border-terminal-border p-6 rounded"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-mono font-semibold text-terminal-text mb-1">
                  {prediction.name}
                </h3>
                <span className={`text-xs font-mono uppercase ${getTypeColor(prediction.type)}`}>
                  {prediction.type}
                </span>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-terminal-text">
                  {prediction.prediction.toFixed(1)}
                </div>
                <div className="text-xs font-mono text-terminal-muted">
                  vs {prediction.currentValue.toFixed(1)} current
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-mono font-bold text-terminal-green">
                  {(prediction.confidence * 100).toFixed(0)}%
                </div>
                <div className="text-xs font-mono text-terminal-muted">
                  CONFIDENCE
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-mono font-bold text-terminal-text">
                  {prediction.accuracy.toFixed(1)}%
                </div>
                <div className="text-xs font-mono text-terminal-muted">
                  ACCURACY
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-lg font-mono font-bold ${
                  prediction.trend === 'bullish' ? 'text-green-400' :
                  prediction.trend === 'bearish' ? 'text-red-400' : 'text-terminal-muted'
                }`}>
                  {getTrendIcon(prediction.trend)} {prediction.trend.toUpperCase()}
                </div>
                <div className="text-xs font-mono text-terminal-muted">
                  TREND
                </div>
              </div>
            </div>
            
            <p className="text-sm font-mono text-terminal-text mb-4 leading-relaxed">
              {prediction.description}
            </p>
            
            <div className="mb-4">
              <div className="text-xs font-mono text-terminal-muted mb-2">
                KEY FACTORS:
              </div>
              <div className="flex flex-wrap gap-2">
                {prediction.factors.map((factor, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-terminal-bg text-terminal-text font-mono text-xs rounded"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-3 border-t border-terminal-border">
              <span className="text-xs font-mono text-terminal-muted">
                Updated: {new Date(prediction.lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Model Performance */}
      {modelPerformance.length > 0 && (
        <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
          <h3 className="font-mono font-semibold text-terminal-text mb-4">
            MODEL PERFORMANCE METRICS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modelPerformance.map((model, index) => (
              <div
                key={index}
                className="bg-terminal-bg border border-terminal-border p-4 rounded"
              >
                <h4 className="font-mono font-semibold text-terminal-text text-sm mb-3">
                  {model.modelName.toUpperCase()}
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-terminal-muted">Accuracy:</span>
                    <span className="text-xs font-mono text-terminal-green font-bold">
                      {model.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-terminal-muted">Precision:</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {model.precision.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-terminal-muted">Recall:</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {model.recall.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs font-mono text-terminal-muted">F1-Score:</span>
                    <span className="text-xs font-mono text-terminal-text">
                      {model.f1Score.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-terminal-border">
                  <span className="text-xs font-mono text-terminal-muted">
                    Last Trained: {new Date(model.lastTrained).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
