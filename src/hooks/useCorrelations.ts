import { useState, useEffect, useCallback } from 'react';

interface CorrelationData {
  factor1: string;
  factor2: string;
  correlation: number;
  pValue: number;
  significance: 'high' | 'medium' | 'low';
  relationship: 'positive' | 'negative' | 'neutral';
  sampleSize: number;
  lastCalculated: string;
}

interface CorrelationMatrix {
  factors: string[];
  matrix: number[][];
  pValues: number[][];
  lastUpdated: string;
}

interface UseCorrelationsResult {
  correlations: CorrelationData[];
  matrix: CorrelationMatrix | null;
  loading: boolean;
  error: string | null;
  calculateCorrelations: (factors: string[]) => Promise<void>;
  refreshCorrelations: () => Promise<void>;
  lastUpdated: string;
}

export function useCorrelations(timeRange: string = '3m'): UseCorrelationsResult {
  const [correlations, setCorrelations] = useState<CorrelationData[]>([]);
  const [matrix, setMatrix] = useState<CorrelationMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const calculatePearsonCorrelation = (x: number[], y: number[]): { correlation: number; pValue: number } => {
    const n = x.length;
    
    if (n !== y.length || n < 3) {
      return { correlation: 0, pValue: 1 };
    }
    
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    
    let numerator = 0;
    let sumXSq = 0;
    let sumYSq = 0;
    
    for (let i = 0; i < n; i++) {
      const xDiff = x[i] - meanX;
      const yDiff = y[i] - meanY;
      
      numerator += xDiff * yDiff;
      sumXSq += xDiff * xDiff;
      sumYSq += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(sumXSq * sumYSq);
    const correlation = denominator === 0 ? 0 : numerator / denominator;
    
    // Simple p-value approximation using t-distribution
    const tStat = Math.abs(correlation) * Math.sqrt((n - 2) / (1 - correlation * correlation));
    const pValue = tStat > 2.576 ? 0.01 : tStat > 1.96 ? 0.05 : tStat > 1.645 ? 0.10 : 0.20;
    
    return { correlation, pValue };
  };

  const calculateCorrelations = useCallback(async (factors: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real correlation data from API
      const response = await fetch('/api/v1/analytics/correlations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factors, timeRange })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch correlation data');
      }
      
      const data = await response.json();
      const factorData: Record<string, number[]> = data.factorData || {};
      
      // Calculate correlations between all factor pairs
      const newCorrelations: CorrelationData[] = [];
      const n = factors.length;
      const correlationMatrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
      const pValueMatrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
      
      for (let i = 0; i < factors.length; i++) {
        for (let j = i + 1; j < factors.length; j++) {
          const factor1 = factors[i];
          const factor2 = factors[j];
          
          if (factorData[factor1] && factorData[factor2]) {
            const result = calculatePearsonCorrelation(factorData[factor1], factorData[factor2]);
            
            const significance = result.pValue <= 0.01 ? 'high' : result.pValue <= 0.05 ? 'medium' : 'low';
            const relationship = Math.abs(result.correlation) < 0.1 ? 'neutral' : result.correlation > 0 ? 'positive' : 'negative';
            
            newCorrelations.push({
              factor1,
              factor2,
              correlation: Math.round(result.correlation * 1000) / 1000,
              pValue: Math.round(result.pValue * 1000) / 1000,
              significance,
              relationship,
              sampleSize: factorData[factor1].length,
              lastCalculated: new Date().toISOString()
            });
            
            // Fill correlation matrix
            correlationMatrix[i][j] = result.correlation;
            correlationMatrix[j][i] = result.correlation;
            pValueMatrix[i][j] = result.pValue;
            pValueMatrix[j][i] = result.pValue;
          }
        }
        
        // Diagonal elements (self-correlation)
        correlationMatrix[i][i] = 1.0;
        pValueMatrix[i][i] = 0.0;
      }
      
      setCorrelations(newCorrelations);
      setMatrix({
        factors,
        matrix: correlationMatrix,
        pValues: pValueMatrix,
        lastUpdated: new Date().toISOString()
      });
      
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate correlations');
      console.error('Error calculating correlations:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  const refreshCorrelations = useCallback(async () => {
    if (matrix) {
      await calculateCorrelations(matrix.factors);
    }
  }, [matrix, calculateCorrelations]);

  useEffect(() => {
    // Initialize with default factors
    const defaultFactors = [
      'GDP Growth',
      'Unemployment Rate', 
      'Inflation Rate',
      'Interest Rates',
      'Market Volatility'
    ];
    
    calculateCorrelations(defaultFactors);
  }, [calculateCorrelations]);

  return {
    correlations,
    matrix,
    loading,
    error,
    calculateCorrelations,
    refreshCorrelations,
    lastUpdated
  };
}