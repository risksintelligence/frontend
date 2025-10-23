import { useState, useEffect, useCallback } from 'react';

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

interface UsePredictionsResult {
  predictions: Prediction[];
  modelPerformance: ModelPerformance[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: string;
}

export function usePredictions(timeHorizon: string = '3m'): UsePredictionsResult {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/predictions?horizon=${timeHorizon}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch predictions');
      // }
      // const data = await response.json();
      
      // Sample predictions
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
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching predictions:', err);
    } finally {
      setLoading(false);
    }
  }, [timeHorizon]);

  useEffect(() => {
    fetchPredictions();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchPredictions, 300000);
    
    return () => clearInterval(interval);
  }, [fetchPredictions]);

  return {
    predictions,
    modelPerformance,
    loading,
    error,
    refetch: fetchPredictions,
    lastUpdated
  };
}