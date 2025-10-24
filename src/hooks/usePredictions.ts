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
      
      // Fetch from real API
      const response = await fetch(`/api/v1/analytics/predictions?horizon=${timeHorizon}`);
      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }
      const data = await response.json();
      
      setPredictions(data.predictions || []);
      setModelPerformance(data.model_performance || []);
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