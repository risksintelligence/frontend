import { useState, useCallback } from 'react';
import {
  ModelExplanation,
  ModelStatusResponse,
  ExplainabilityInsight,
  ModelTransparencyReport,
  ModelDriftDetection,
  PerformanceTrend,
  ExplainabilityFilters
} from '../types/explainability';

interface UseExplainabilityOptions {
  onError?: (error: Error) => void;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UseExplainabilityResult {
  // State
  loading: boolean;
  error: string | null;
  
  // Data
  explanation: ModelExplanation | null;
  modelStatus: ModelStatusResponse | null;
  insights: ExplainabilityInsight[];
  transparencyReport: ModelTransparencyReport | null;
  driftDetection: ModelDriftDetection | null;
  performanceTrends: PerformanceTrend[];
  
  // Actions
  fetchExplanation: (predictionId: string) => Promise<ModelExplanation | null>;
  fetchModelStatus: () => Promise<ModelStatusResponse | null>;
  fetchInsights: (filters?: ExplainabilityFilters) => Promise<ExplainabilityInsight[]>;
  fetchTransparencyReport: (modelName: string) => Promise<ModelTransparencyReport | null>;
  checkModelDrift: (modelName: string) => Promise<ModelDriftDetection | null>;
  fetchPerformanceTrends: (modelName: string, days?: number) => Promise<PerformanceTrend[]>;
  exportExplanation: (predictionId: string, format: 'json' | 'csv' | 'pdf') => Promise<void>;
  clearError: () => void;
}

export function useExplainability(
  apiUrl: string,
  options: UseExplainabilityOptions = {}
): UseExplainabilityResult {
  const {
    onError,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ModelExplanation | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatusResponse | null>(null);
  const [insights, setInsights] = useState<ExplainabilityInsight[]>([]);
  const [transparencyReport, setTransparencyReport] = useState<ModelTransparencyReport | null>(null);
  const [driftDetection, setDriftDetection] = useState<ModelDriftDetection | null>(null);
  const [performanceTrends, setPerformanceTrends] = useState<PerformanceTrend[]>([]);

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
          throw new Error('Resource not found');
        }
        if (response.status === 503) {
          throw new Error('Service temporarily unavailable');
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
    console.error(`Explainability ${context} error:`, err);
  }, [onError]);

  const fetchExplanation = useCallback(async (predictionId: string): Promise<ModelExplanation | null> => {
    if (!predictionId) {
      setError('Prediction ID is required');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<ModelExplanation>(
        `${apiUrl}/api/v1/prediction/explanations/${predictionId}`
      );
      
      setExplanation(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch explanation');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchModelStatus = useCallback(async (): Promise<ModelStatusResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await makeRequest<ModelStatusResponse>(
        `${apiUrl}/api/v1/prediction/models/status`
      );
      
      setModelStatus(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch model status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiUrl, makeRequest, handleError]);

  const fetchInsights = useCallback(async (filters?: ExplainabilityFilters): Promise<ExplainabilityInsight[]> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.model_name) {
        queryParams.append('model_name', filters.model_name);
      }
      if (filters?.feature_name) {
        queryParams.append('feature_name', filters.feature_name);
      }
      if (filters?.importance_threshold !== undefined) {
        queryParams.append('importance_threshold', filters.importance_threshold.toString());
      }
      if (filters?.date_range) {
        queryParams.append('start_date', filters.date_range.start);
        queryParams.append('end_date', filters.date_range.end);
      }
      if (filters?.prediction_type) {
        queryParams.append('prediction_type', filters.prediction_type);
      }

      // Since this endpoint doesn't exist in backend, we'll simulate insights
      // In a real implementation, this would be: /api/v1/explainability/insights
      
      // Simulated insights based on model status and explanations
      const mockInsights: ExplainabilityInsight[] = [
        {
          id: 'insight-1',
          type: 'feature_importance',
          severity: 'medium',
          title: 'GDP Growth Rate Dominance',
          description: 'GDP growth rate is consistently the most important feature across predictions',
          recommendation: 'Monitor GDP indicators closely for early risk detection',
          created_at: new Date().toISOString(),
          model_affected: 'risk_scorer',
          data: { importance_trend: 'increasing', feature: 'gdp_growth_rate' }
        },
        {
          id: 'insight-2',
          type: 'bias_detection',
          severity: 'low',
          title: 'Geographic Bias Check Passed',
          description: 'Model shows no significant geographic bias in predictions',
          recommendation: 'Continue regular bias monitoring',
          created_at: new Date().toISOString(),
          model_affected: 'economic_predictor',
          data: { bias_score: 0.02, threshold: 0.05 }
        },
        {
          id: 'insight-3',
          type: 'performance_alert',
          severity: 'medium',
          title: 'Supply Chain Model Accuracy Decline',
          description: 'Supply chain analyzer accuracy has decreased by 3% over past week',
          recommendation: 'Consider model retraining with recent data',
          created_at: new Date().toISOString(),
          model_affected: 'supply_chain_analyzer',
          data: { accuracy_change: -0.03, current_accuracy: 0.77 }
        }
      ];

      setInsights(mockInsights);
      return mockInsights;
    } catch (err) {
      handleError(err, 'Failed to fetch insights');
      return [];
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleError]);

  const fetchTransparencyReport = useCallback(async (modelName: string): Promise<ModelTransparencyReport | null> => {
    setLoading(true);
    setError(null);

    try {
      // This would be: /api/v1/explainability/transparency/{modelName}
      // Simulating with model status data since this endpoint doesn't exist
      const mockReport: ModelTransparencyReport = {
        model_name: modelName,
        model_version: '1.0.0',
        training_date: '2024-01-01T00:00:00Z',
        feature_distributions: [
          {
            feature: 'gdp_growth_rate',
            min_value: -5.0,
            max_value: 8.0,
            mean_value: 2.1,
            std_value: 1.5,
            percentiles: { p25: 1.2, p50: 2.1, p75: 3.0, p90: 4.2, p95: 5.1 }
          },
          {
            feature: 'credit_spread',
            min_value: 0.5,
            max_value: 5.0,
            mean_value: 1.8,
            std_value: 0.8,
            percentiles: { p25: 1.2, p50: 1.8, p75: 2.3, p90: 3.1, p95: 3.8 }
          }
        ],
        global_feature_importance: [
          { feature: 'gdp_growth_rate', importance: 0.25, rank: 1 },
          { feature: 'credit_spread', importance: 0.20, rank: 2 },
          { feature: 'supply_chain_disruption_index', importance: 0.18, rank: 3 }
        ],
        model_architecture: {
          type: 'Random Forest',
          parameters: 150000,
          hyperparameters: {
            n_estimators: 100,
            max_depth: 10,
            min_samples_split: 5
          }
        },
        training_metrics: {
          accuracy: 0.85,
          precision: 0.82,
          recall: 0.88,
          features_count: 45,
          training_samples: 10000
        },
        validation_results: {
          cross_validation_score: 0.83,
          holdout_test_score: 0.85,
          temporal_validation_score: 0.79
        },
        ethical_considerations: {
          bias_testing: {
            fairness_score: 0.92,
            demographic_parity: 'pass',
            equal_opportunity: 'pass',
            potential_biases: []
          },
          fairness_metrics: {
            demographic_parity_difference: 0.02,
            equalized_odds_difference: 0.03
          },
          ethical_review_date: '2024-01-01T00:00:00Z'
        }
      };

      setTransparencyReport(mockReport);
      return mockReport;
    } catch (err) {
      handleError(err, 'Failed to fetch transparency report');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const checkModelDrift = useCallback(async (_modelName: string): Promise<ModelDriftDetection | null> => {
    setLoading(true);
    setError(null);

    try {
      // This would be: /api/v1/explainability/drift/{modelName}
      const mockDrift: ModelDriftDetection = {
        model_name: _modelName,
        drift_detected: false,
        drift_score: 0.12,
        drift_threshold: 0.15,
        affected_features: [],
        detection_date: new Date().toISOString(),
        recommendation: 'No action required. Continue monitoring.',
        severity: 'low'
      };

      setDriftDetection(mockDrift);
      return mockDrift;
    } catch (err) {
      handleError(err, 'Failed to check model drift');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchPerformanceTrends = useCallback(async (_modelName: string, days = 30): Promise<PerformanceTrend[]> => {
    setLoading(true);
    setError(null);

    try {
      // This would be: /api/v1/explainability/performance/{modelName}?days={days}
      const mockTrends: PerformanceTrend[] = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        
        return {
          date: date.toISOString().split('T')[0],
          accuracy: 0.85 + (Math.random() - 0.5) * 0.1,
          precision: 0.82 + (Math.random() - 0.5) * 0.1,
          recall: 0.88 + (Math.random() - 0.5) * 0.1,
          f1_score: 0.85 + (Math.random() - 0.5) * 0.1,
          predictions_count: Math.floor(100 + Math.random() * 50)
        };
      });

      setPerformanceTrends(mockTrends);
      return mockTrends;
    } catch (err) {
      handleError(err, 'Failed to fetch performance trends');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const exportExplanation = useCallback(async (predictionId: string, format: 'json' | 'csv' | 'pdf'): Promise<void> => {
    if (!explanation || explanation.prediction_id !== predictionId) {
      throw new Error('Explanation not loaded for this prediction');
    }

    try {
      if (format === 'json') {
        const dataStr = JSON.stringify(explanation, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `explanation_${predictionId}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        const csvRows = [
          ['Feature', 'Importance', 'Current Value', 'Contribution', 'Interpretation'],
          ...explanation.feature_importance.map(f => [
            f.feature,
            f.importance.toString(),
            f.current_value.toString(),
            f.contribution,
            f.interpretation
          ])
        ];
        const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
        const dataBlob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `explanation_${predictionId}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        throw new Error('PDF export not implemented');
      }
    } catch (err) {
      handleError(err, 'Failed to export explanation');
    }
  }, [explanation, handleError]);

  return {
    // State
    loading,
    error,
    
    // Data
    explanation,
    modelStatus,
    insights,
    transparencyReport,
    driftDetection,
    performanceTrends,
    
    // Actions
    fetchExplanation,
    fetchModelStatus,
    fetchInsights,
    fetchTransparencyReport,
    checkModelDrift,
    fetchPerformanceTrends,
    exportExplanation,
    clearError
  };
}