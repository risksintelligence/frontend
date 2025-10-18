import { useState, useEffect, useCallback } from 'react';
import { PredictionResponse, ForecastControls, ForecastError, ScenarioAnalysis, ScenarioRequest, ModelStatus } from '../types/predictions';

interface UseForecastingResult {
  forecast: PredictionResponse | null;
  scenarios: ScenarioAnalysis[];
  modelStatus: ModelStatus | null;
  loading: boolean;
  error: ForecastError | null;
  fetchForecast: (controls: ForecastControls) => Promise<void>;
  analyzeScenario: (scenario: ScenarioRequest) => Promise<void>;
  refreshModelStatus: () => Promise<void>;
  clearError: () => void;
  exportForecast: (format: 'csv' | 'json') => void;
}

export function useForecasting(apiUrl: string): UseForecastingResult {
  const [forecast, setForecast] = useState<PredictionResponse | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioAnalysis[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ForecastError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: any, operation: string): ForecastError => {
    console.error(`Forecasting API error (${operation}):`, err);
    
    if (err.name === 'AbortError') {
      return {
        type: 'timeout_error',
        message: 'Request timed out',
        details: `${operation} took too long to complete`,
        retry_suggested: true
      };
    }
    
    if (!navigator.onLine) {
      return {
        type: 'network_error',
        message: 'Network connection unavailable',
        details: 'Please check your internet connection',
        retry_suggested: true
      };
    }

    if (err.status === 500) {
      return {
        type: 'api_error',
        message: 'Prediction service temporarily unavailable',
        details: 'The backend prediction service is experiencing issues. This is a known issue being resolved.',
        retry_suggested: true
      };
    }

    if (err.status === 404) {
      return {
        type: 'api_error',
        message: 'Prediction endpoint not found',
        details: 'The prediction service may not be fully deployed yet',
        retry_suggested: false
      };
    }

    return {
      type: 'api_error',
      message: 'Failed to fetch prediction data',
      details: err.message || 'Unknown error occurred',
      retry_suggested: true
    };
  }, []);

  const fetchForecast = useCallback(async (controls: ForecastControls) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const params = new URLSearchParams({
        horizon_days: controls.horizon_days.toString(),
        confidence_level: controls.confidence_level.toString(),
        include_factors: controls.include_factors.toString()
      });

      const response = await fetch(`${apiUrl}/api/v1/prediction/risk/forecast?${params}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          status: response.status,
          message: await response.text()
        };
      }

      const data: PredictionResponse = await response.json();
      setForecast(data);
    } catch (err) {
      const forecastError = handleApiError(err, 'fetchForecast');
      setError(forecastError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const analyzeScenario = useCallback(async (scenario: ScenarioRequest) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout for scenarios

      const response = await fetch(`${apiUrl}/api/v1/prediction/scenarios/analyze`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(scenario)
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          status: response.status,
          message: await response.text()
        };
      }

      const data: ScenarioAnalysis = await response.json();
      setScenarios(prev => [...prev, data]);
    } catch (err) {
      const forecastError = handleApiError(err, 'analyzeScenario');
      setError(forecastError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const refreshModelStatus = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/prediction/models/status`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data: ModelStatus = await response.json();
        setModelStatus(data);
      }
    } catch (err) {
      console.warn('Could not fetch model status:', err);
    }
  }, [apiUrl]);

  const exportForecast = useCallback((format: 'csv' | 'json') => {
    if (!forecast) return;

    const data = format === 'json' 
      ? JSON.stringify(forecast, null, 2)
      : convertToCSV(forecast);

    const blob = new Blob([data], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `forecast_${forecast.prediction_id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [forecast]);

  const convertToCSV = useCallback((data: PredictionResponse): string => {
    const headers = ['Date', 'Predicted Value', 'Lower Confidence', 'Upper Confidence', 'Volatility'];
    const rows = data.predictions.map(p => [
      p.date,
      p.predicted_value.toString(),
      p.confidence_lower.toString(),
      p.confidence_upper.toString(),
      p.volatility.toString()
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }, []);

  // Auto-refresh model status on mount
  useEffect(() => {
    refreshModelStatus();
  }, [refreshModelStatus]);

  return {
    forecast,
    scenarios,
    modelStatus,
    loading,
    error,
    fetchForecast,
    analyzeScenario,
    refreshModelStatus,
    clearError,
    exportForecast
  };
}