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

  const generateSampleData = (baseValue: number, trendSlope: number, volatility: number): TrendData[] => {
    const data: TrendData[] = [];
    const now = new Date();
    const days = timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : timeRange === '6m' ? 180 : 365;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - (days - i) * 24 * 60 * 60 * 1000);
      const trendValue = baseValue + (trendSlope * i / days);
      const noise = (Math.random() - 0.5) * volatility;
      const value = Math.max(0, trendValue + noise);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(value * 100) / 100
      });
    }
    
    return data;
  };

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
      
      // In production, fetch actual data from API
      // const response = await fetch(`/api/v1/analytics/trends/${seriesId}?algorithm=${algorithm}&range=${timeRange}`);
      
      // Generate sample data for different economic indicators
      const sampleSeries = {
        'gdp-growth': { baseValue: 2.1, trendSlope: 0.3, volatility: 0.5 },
        'unemployment': { baseValue: 3.7, trendSlope: 0.4, volatility: 0.3 },
        'inflation': { baseValue: 3.2, trendSlope: -0.8, volatility: 0.6 },
        'market-volatility': { baseValue: 18.5, trendSlope: 3.2, volatility: 4.5 },
        'interest-rates': { baseValue: 5.25, trendSlope: 0.5, volatility: 0.25 }
      };
      
      const seriesConfig = sampleSeries[seriesId as keyof typeof sampleSeries] || sampleSeries['gdp-growth'];
      const data = generateSampleData(seriesConfig.baseValue, seriesConfig.trendSlope, seriesConfig.volatility);
      
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