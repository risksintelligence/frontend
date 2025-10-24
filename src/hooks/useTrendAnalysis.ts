import { useState, useEffect, useCallback } from 'react';

interface TrendData {
  date: string;
  value: number;
}

interface TrendResult {
  id: string;
  name: string;
  data: TrendData[];
  algorithm: 'linear' | 'polynomial' | 'exponential';
  r2: number;
  slope: number;
  intercept: number;
  pValue: number;
  standardError: number;
  confidence: number;
  trend: 'upward' | 'downward' | 'stable';
  strength: 'strong' | 'moderate' | 'weak';
  timeRange: string;
  lastCalculated: string;
}

interface UseTrendAnalysisResult {
  trends: TrendResult[];
  loading: boolean;
  error: string | null;
  calculateTrend: (seriesId: string, algorithm: 'linear' | 'polynomial' | 'exponential') => Promise<void>;
  refreshTrends: () => Promise<void>;
  lastUpdated: string;
}

export function useTrendAnalysis(timeRange: string = '6m'): UseTrendAnalysisResult {
  const [trends, setTrends] = useState<TrendResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');


  const calculateLinearRegression = (data: TrendData[]) => {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data.map(d => d.value);
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R²
    const yMean = sumY / n;
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    
    const r2 = 1 - (ssResidual / ssTotal);
    
    // Calculate standard error
    const standardError = Math.sqrt(ssResidual / (n - 2));
    
    // Simple p-value approximation (in reality, would use t-distribution)
    const tStat = Math.abs(slope) / (standardError / Math.sqrt(sumXX - sumX * sumX / n));
    const pValue = tStat > 2 ? 0.05 : tStat > 1.5 ? 0.1 : 0.2;
    
    return { slope, intercept, r2, standardError, pValue };
  };

  const calculateTrend = useCallback(async (seriesId: string, algorithm: 'linear' | 'polynomial' | 'exponential') => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real trend data from API
      const response = await fetch(`/api/v1/analytics/trends/${seriesId}?algorithm=${algorithm}&range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trend data');
      }
      
      const responseData = await response.json();
      const data: TrendData[] = responseData.data || [];
      
      // Calculate trend statistics
      const stats = calculateLinearRegression(data);
      
      // Determine trend direction and strength
      const trend = stats.slope > 0.01 ? 'upward' : stats.slope < -0.01 ? 'downward' : 'stable';
      const strength = stats.r2 > 0.8 ? 'strong' : stats.r2 > 0.5 ? 'moderate' : 'weak';
      const confidence = stats.r2;
      
      const newTrend: TrendResult = {
        id: `${seriesId}-${algorithm}`,
        name: seriesId.replace('-', ' ').toUpperCase(),
        data,
        algorithm,
        r2: Math.round(stats.r2 * 1000) / 1000,
        slope: Math.round(stats.slope * 1000) / 1000,
        intercept: Math.round(stats.intercept * 100) / 100,
        pValue: Math.round(stats.pValue * 1000) / 1000,
        standardError: Math.round(stats.standardError * 100) / 100,
        confidence: Math.round(confidence * 1000) / 1000,
        trend,
        strength,
        timeRange,
        lastCalculated: new Date().toISOString()
      };
      
      setTrends(prev => {
        const filtered = prev.filter(t => t.id !== newTrend.id);
        return [...filtered, newTrend];
      });
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate trend');
      console.error('Error calculating trend:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refreshTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Recalculate all existing trends
      for (const trend of trends) {
        const seriesId = trend.id.split('-')[0] + '-' + trend.id.split('-')[1];
        await calculateTrend(seriesId, trend.algorithm);
      }
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh trends');
    } finally {
      setLoading(false);
    }
  }, [trends, calculateTrend]);

  useEffect(() => {
    // Initialize with some default trends
    if (trends.length === 0) {
      const defaultSeries = ['gdp-growth', 'unemployment', 'inflation'];
      defaultSeries.forEach(seriesId => {
        calculateTrend(seriesId, 'linear');
      });
    }
  }, [calculateTrend, trends.length]);

  return {
    trends,
    loading,
    error,
    calculateTrend,
    refreshTrends,
    lastUpdated
  };
}