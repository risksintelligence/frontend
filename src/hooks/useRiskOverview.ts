import { useState, useEffect } from 'react';
import { RiskScore } from '@/types';

export function useRiskOverview() {
  const [riskData, setRiskData] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/risk/overview`);
      
      if (!response.ok) {
        if (response.status === 503) {
          const errorData = await response.json().catch(() => ({ detail: 'Service temporarily unavailable' }));
          setError(`System is warming up: ${errorData.detail || 'Economic data is being prepared'}`);
          setLastUpdated(new Date().toLocaleTimeString());
          return;
        }
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setRiskData(result.data);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('No risk data available');
      }
    } catch (err) {
      console.error('Risk data fetch error:', err);
      
      if (err instanceof Error && err.message.includes('503')) {
        setError('System is warming up - Economic data will be available shortly');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch risk data');
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    riskData,
    loading,
    error,
    lastUpdated,
    refetch: fetchRiskData
  };
}