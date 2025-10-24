import { useState, useEffect, useCallback } from 'react';

interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'rising' | 'falling' | 'stable';
  category: 'growth' | 'employment' | 'inflation' | 'trade';
  lastUpdated: string;
  description: string;
}

interface UseEconomicDataResult {
  indicators: EconomicIndicator[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: string;
}

export function useEconomicData(timeRange: string = '3m'): UseEconomicDataResult {
  const [indicators, setIndicators] = useState<EconomicIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchEconomicData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from real API
      const response = await fetch(`/api/v1/analytics/economic?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch economic data');
      }
      const data = await response.json();
      
      setIndicators(data.indicators || []);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching economic data:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchEconomicData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchEconomicData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchEconomicData]);

  return {
    indicators,
    loading,
    error,
    refetch: fetchEconomicData,
    lastUpdated
  };
}