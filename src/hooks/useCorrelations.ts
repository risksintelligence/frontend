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

  const generateSampleData = (baseValue: number, trend: number, volatility: number, correlation?: number, referenceData?: number[]): number[] => {
    const days = timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : timeRange === '6m' ? 180 : 365;
    const data: number[] = [];
    
    for (let i = 0; i < days; i++) {
      let value = baseValue + (trend * i / days);
      
      if (correlation && referenceData && referenceData[i] !== undefined) {
        // Add correlation with reference data
        const referenceNorm = (referenceData[i] - baseValue) / volatility;
        value += correlation * referenceNorm * volatility;
      }
      
      // Add random noise
      const noise = (Math.random() - 0.5) * volatility;
      value += noise;
      
      data.push(Math.max(0, value));
    }
    
    return data;
  };

  const calculateCorrelations = useCallback(async (factors: string[]) => {
    try {
      setLoading(true);
      setError(null);
      
      // In production, fetch from API
      // const response = await fetch('/api/v1/analytics/correlations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ factors, timeRange })
      // });
      
      // Generate sample data for different factors
      const factorConfigs = {
        'GDP Growth': { baseValue: 2.1, trend: 0.3, volatility: 0.5 },
        'Unemployment Rate': { baseValue: 3.7, trend: 0.4, volatility: 0.3 },
        'Inflation Rate': { baseValue: 3.2, trend: -0.8, volatility: 0.6 },
        'Interest Rates': { baseValue: 5.25, trend: 0.5, volatility: 0.25 },
        'Market Volatility': { baseValue: 18.5, trend: 3.2, volatility: 4.5 },
        'Oil Price': { baseValue: 85.0, trend: 5.0, volatility: 10.0 }
      };
      
      // Generate data for each factor
      const factorData: Record<string, number[]> = {};
      const gdpData = generateSampleData(factorConfigs['GDP Growth'].baseValue, factorConfigs['GDP Growth'].trend, factorConfigs['GDP Growth'].volatility);
      factorData['GDP Growth'] = gdpData;
      
      // Generate correlated data for other factors
      factorData['Unemployment Rate'] = generateSampleData(factorConfigs['Unemployment Rate'].baseValue, factorConfigs['Unemployment Rate'].trend, factorConfigs['Unemployment Rate'].volatility, -0.78, gdpData);
      factorData['Inflation Rate'] = generateSampleData(factorConfigs['Inflation Rate'].baseValue, factorConfigs['Inflation Rate'].trend, factorConfigs['Inflation Rate'].volatility, 0.45, gdpData);
      factorData['Interest Rates'] = generateSampleData(factorConfigs['Interest Rates'].baseValue, factorConfigs['Interest Rates'].trend, factorConfigs['Interest Rates'].volatility, 0.32, gdpData);
      factorData['Market Volatility'] = generateSampleData(factorConfigs['Market Volatility'].baseValue, factorConfigs['Market Volatility'].trend, factorConfigs['Market Volatility'].volatility, -0.52, gdpData);
      factorData['Oil Price'] = generateSampleData(factorConfigs['Oil Price'].baseValue, factorConfigs['Oil Price'].trend, factorConfigs['Oil Price'].volatility, 0.25, gdpData);
      
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