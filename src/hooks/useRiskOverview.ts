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

      // In production, this would call the actual API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/v1/risk/overview`);
      
      if (!response.ok) {
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
      
      setError(err instanceof Error ? err.message : 'Failed to fetch risk data');
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