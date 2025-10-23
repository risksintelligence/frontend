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
      
      // In production, fetch from API
      // const response = await fetch(`/api/v1/analytics/economic?range=${timeRange}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch economic data');
      // }
      // const data = await response.json();
      
      // Sample economic indicators
      const sampleIndicators: EconomicIndicator[] = [
        {
          id: 'gdp',
          name: 'GDP Growth Rate',
          value: 2.1,
          unit: '%',
          change: -0.3,
          changePercent: -12.5,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Quarterly GDP growth rate showing economic expansion pace'
        },
        {
          id: 'unemployment',
          name: 'Unemployment Rate',
          value: 3.7,
          unit: '%',
          change: -0.1,
          changePercent: -2.6,
          trend: 'falling',
          category: 'employment',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly unemployment rate indicating labor market health'
        },
        {
          id: 'inflation',
          name: 'Consumer Price Index',
          value: 3.2,
          unit: '%',
          change: 0.4,
          changePercent: 14.3,
          trend: 'rising',
          category: 'inflation',
          lastUpdated: new Date().toISOString(),
          description: 'Annual inflation rate measuring consumer price changes'
        },
        {
          id: 'employment',
          name: 'Nonfarm Payrolls',
          value: 199000,
          unit: 'jobs',
          change: 15000,
          changePercent: 8.2,
          trend: 'rising',
          category: 'employment',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly job creation excluding agricultural sector'
        },
        {
          id: 'manufacturing',
          name: 'Manufacturing PMI',
          value: 48.7,
          unit: 'index',
          change: -1.2,
          changePercent: -2.4,
          trend: 'falling',
          category: 'growth',
          lastUpdated: new Date().toISOString(),
          description: 'Manufacturing activity index indicating sector health'
        },
        {
          id: 'trade-balance',
          name: 'Trade Balance',
          value: -68.9,
          unit: 'billion USD',
          change: -3.2,
          changePercent: 4.9,
          trend: 'falling',
          category: 'trade',
          lastUpdated: new Date().toISOString(),
          description: 'Monthly trade deficit between imports and exports'
        }
      ];
      
      setIndicators(sampleIndicators);
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