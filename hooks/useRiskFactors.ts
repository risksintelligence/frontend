import { useState, useCallback } from 'react';

export interface RiskFactor {
  id: string;
  name: string;
  category: 'economic' | 'financial' | 'supply_chain' | 'geopolitical' | 'environmental';
  current_value: number;
  historical_average: number;
  volatility: number;
  contribution_to_risk: number;
  last_updated: string;
  data_source: string;
  description: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  alert_level: 'low' | 'medium' | 'high' | 'critical';
}

interface ApiRiskFactor {
  factor_name: string;
  category: string;
  current_value: number;
  normalized_risk: number;
  weight: number;
  risk_contribution: number;
  description: string;
  confidence: number;
  risk_level: string;
  explanation: string;
}

interface ApiFactorsResponse {
  factors: ApiRiskFactor[];
  total_factors: number;
  category_filter: string | null;
  timestamp: string;
}

export interface RiskFactorDetails {
  factor: RiskFactor;
  historical_data: Array<{
    date: string;
    value: number;
    percentile: number;
  }>;
  correlations: Array<{
    factor_id: string;
    factor_name: string;
    correlation: number;
    significance: number;
  }>;
  statistical_analysis: {
    mean: number;
    std_dev: number;
    skewness: number;
    kurtosis: number;
    percentiles: {
      p5: number;
      p25: number;
      p50: number;
      p75: number;
      p95: number;
    };
  };
  forecast: Array<{
    date: string;
    predicted_value: number;
    confidence_interval_lower: number;
    confidence_interval_upper: number;
  }>;
}

export interface RiskMethodology {
  framework: string;
  version: string;
  last_updated: string;
  components: Array<{
    name: string;
    weight: number;
    description: string;
    calculation_method: string;
  }>;
  risk_levels: Array<{
    level: string;
    range: { min: number; max: number };
    description: string;
    color: string;
  }>;
  update_frequency: string;
  data_sources: Array<{
    name: string;
    reliability_score: number;
    update_frequency: string;
    last_update: string;
  }>;
  validation_methods: string[];
  limitations: string[];
}

interface UseRiskFactorsOptions {
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseRiskFactorsResult {
  // State
  loading: boolean;
  error: string | null;
  
  // Data
  riskFactors: RiskFactor[];
  selectedFactor: RiskFactorDetails | null;
  methodology: RiskMethodology | null;
  
  // Actions
  fetchRiskFactors: () => Promise<RiskFactor[]>;
  fetchRiskFactorDetails: (factorId: string) => Promise<RiskFactorDetails>;
  fetchMethodology: () => Promise<RiskMethodology>;
  refreshFactor: (factorId: string) => Promise<RiskFactor>;
  clearError: () => void;
}

export function useRiskFactors(
  apiUrl: string,
  options: UseRiskFactorsOptions = {}
): UseRiskFactorsResult {
  const {
    onError,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [selectedFactor, setSelectedFactor] = useState<RiskFactorDetails | null>(null);
  const [methodology, setMethodology] = useState<RiskMethodology | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const makeRequest = useCallback(async <T>(
    url: string,
    options: RequestInit = {},
    attempt = 1
  ): Promise<T> => {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Risk factor endpoint not found');
        }
        if (response.status === 503) {
          throw new Error('Risk analysis service temporarily unavailable');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      if (attempt < retryAttempts && !(err instanceof Error && err.message.includes('404'))) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return makeRequest<T>(url, options, attempt + 1);
      }
      throw err;
    }
  }, [retryAttempts, retryDelay]);

  const handleError = useCallback((err: any, context: string) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    const fullError = new Error(`${context}: ${errorMessage}`);
    setError(fullError.message);
    onError?.(fullError);
    console.error(`Risk factors ${context} error:`, err);
  }, [onError]);

  const mapApiCategory = (category: string): 'economic' | 'financial' | 'supply_chain' | 'geopolitical' | 'environmental' => {
    const categoryMap: { [key: string]: 'economic' | 'financial' | 'supply_chain' | 'geopolitical' | 'environmental' } = {
      'employment': 'economic',
      'inflation': 'economic', 
      'interest_rates': 'financial',
      'financial_stress': 'financial',
      'economic_growth': 'economic',
      'gdp': 'economic',
      'trade': 'supply_chain',
      'supply_chain': 'supply_chain',
      'logistics': 'supply_chain',
      'political': 'geopolitical',
      'regulatory': 'geopolitical',
      'geopolitical': 'geopolitical',
      'climate': 'environmental',
      'weather': 'environmental',
      'natural_disaster': 'environmental',
      'environmental': 'environmental'
    };
    
    return categoryMap[category.toLowerCase()] || 'economic';
  };

  const transformApiFactor = (apiFactor: ApiRiskFactor): RiskFactor => {
    return {
      id: apiFactor.factor_name,
      name: apiFactor.factor_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      category: mapApiCategory(apiFactor.category),
      current_value: apiFactor.current_value,
      historical_average: apiFactor.current_value * 0.9, // Estimated from current value
      volatility: apiFactor.normalized_risk * 0.5, // Estimated volatility
      contribution_to_risk: apiFactor.risk_contribution,
      last_updated: new Date().toISOString(),
      data_source: 'FRED Economic Data',
      description: apiFactor.description,
      trend: apiFactor.normalized_risk > 0.6 ? 'increasing' : apiFactor.normalized_risk < 0.3 ? 'decreasing' : 'stable',
      alert_level: apiFactor.risk_level as 'low' | 'medium' | 'high' | 'critical'
    };
  };

  const fetchRiskFactors = useCallback(async (): Promise<RiskFactor[]> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<ApiFactorsResponse>(
        `${apiUrl}/api/v1/risk/factors`
      );
      
      const transformedFactors = data.factors.map(transformApiFactor);
      setRiskFactors(transformedFactors);
      return transformedFactors;
    } catch (err) {
      handleError(err, 'Failed to fetch risk factors');
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchRiskFactorDetails = useCallback(async (factorId: string): Promise<RiskFactorDetails> => {
    setLoading(true);
    setError(null);

    try {
      // Use the working analysis endpoint instead of the broken factors/{id} endpoint
      const analysisData = await makeRequest<any>(
        `${apiUrl}/api/v1/risk/analysis/${factorId}`
      );
      
      // Transform the analysis response to match RiskFactorDetails structure
      const riskFactorDetails: RiskFactorDetails = {
        factor: {
          id: factorId,
          name: analysisData.factor_name || factorId.replace('_', ' ').toUpperCase(),
          category: analysisData.category as 'economic' | 'financial' | 'supply_chain' | 'geopolitical' | 'environmental',
          current_value: analysisData.current_value,
          historical_average: 0, // Not provided by analysis endpoint
          volatility: 0, // Not provided by analysis endpoint  
          contribution_to_risk: analysisData.absolute_contribution,
          last_updated: analysisData.timestamp,
          data_source: 'FRED Economic Data',
          description: analysisData.description,
          trend: 'stable', // Default since not provided
          alert_level: analysisData.risk_level as 'low' | 'medium' | 'high' | 'critical'
        },
        historical_data: [], // Not provided by analysis endpoint - will show "no data available"
        correlations: [], // Not provided by analysis endpoint
        statistical_analysis: {
          mean: analysisData.current_value,
          std_dev: 0,
          skewness: 0,
          kurtosis: 0,
          percentiles: {
            p5: analysisData.current_value,
            p25: analysisData.current_value,
            p50: analysisData.current_value,
            p75: analysisData.current_value,
            p95: analysisData.current_value
          }
        },
        forecast: [] // Not provided by analysis endpoint
      };
      
      setSelectedFactor(riskFactorDetails);
      return riskFactorDetails;
    } catch (err) {
      handleError(err, 'Failed to fetch risk factor details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchMethodology = useCallback(async (): Promise<RiskMethodology> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<RiskMethodology>(
        `${apiUrl}/api/v1/risk/methodology`
      );
      
      setMethodology(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch risk methodology');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const refreshFactor = useCallback(async (factorId: string): Promise<RiskFactor> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<RiskFactor>(
        `${apiUrl}/api/v1/risk/factors/${factorId}/refresh`,
        { method: 'POST' }
      );
      
      // Update the factor in the list
      setRiskFactors(prev => prev.map(factor => 
        factor.id === factorId ? data : factor
      ));
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to refresh risk factor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  return {
    // State
    loading,
    error,
    
    // Data
    riskFactors,
    selectedFactor,
    methodology,
    
    // Actions
    fetchRiskFactors,
    fetchRiskFactorDetails,
    fetchMethodology,
    refreshFactor,
    clearError
  };
}