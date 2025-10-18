import { useState, useEffect, useCallback } from 'react';
import {
  EconomicOverview,
  CategorySummary,
  IndicatorSummary,
  AnalyticalInsights,
  AnalyticsHealthStatus,
  AnalyticsControls,
  AnalyticsError,
  CompleteAggregation
} from '../types/analytics';

interface UseAnalyticsResult {
  overview: EconomicOverview | null;
  categories: CategorySummary[] | null;
  indicators: IndicatorSummary[] | null;
  insights: AnalyticalInsights | null;
  health: AnalyticsHealthStatus | null;
  loading: boolean;
  error: AnalyticsError | null;
  fetchOverview: (controls?: Partial<AnalyticsControls>) => Promise<void>;
  fetchCategories: (controls?: Partial<AnalyticsControls>) => Promise<void>;
  fetchIndicators: (controls?: Partial<AnalyticsControls>) => Promise<void>;
  fetchInsights: (controls?: Partial<AnalyticsControls>) => Promise<void>;
  fetchCompleteAggregation: (controls?: Partial<AnalyticsControls>) => Promise<void>;
  refreshHealth: () => Promise<void>;
  clearError: () => void;
  exportData: (format: 'csv' | 'json', dataType: 'overview' | 'categories' | 'indicators' | 'insights') => void;
}

export function useAnalytics(apiUrl: string): UseAnalyticsResult {
  const [overview, setOverview] = useState<EconomicOverview | null>(null);
  const [categories, setCategories] = useState<CategorySummary[] | null>(null);
  const [indicators, setIndicators] = useState<IndicatorSummary[] | null>(null);
  const [insights, setInsights] = useState<AnalyticalInsights | null>(null);
  const [health, setHealth] = useState<AnalyticsHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalyticsError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: any, endpoint: string): AnalyticsError => {
    console.error(`Analytics API error (${endpoint}):`, err);
    
    if (err.name === 'AbortError') {
      return {
        type: 'network_error',
        message: 'Request timed out',
        details: `${endpoint} took too long to complete`,
        endpoint,
        retry_suggested: true
      };
    }
    
    if (!navigator.onLine) {
      return {
        type: 'network_error',
        message: 'Network connection unavailable',
        details: 'Please check your internet connection',
        endpoint,
        retry_suggested: true
      };
    }

    if (err.status === 500) {
      return {
        type: 'api_error',
        message: 'Analytics service temporarily unavailable',
        details: 'The backend analytics service is experiencing issues',
        endpoint,
        retry_suggested: true
      };
    }

    if (err.status === 404) {
      return {
        type: 'api_error',
        message: 'Analytics endpoint not found',
        details: 'The analytics service may not be fully deployed yet',
        endpoint,
        retry_suggested: false
      };
    }

    return {
      type: 'api_error',
      message: 'Failed to fetch analytics data',
      details: err.message || 'Unknown error occurred',
      endpoint,
      retry_suggested: true
    };
  }, []);

  const fetchOverview = useCallback(async (controls: Partial<AnalyticsControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const params = new URLSearchParams({
        use_cache: (controls.use_cache ?? true).toString(),
        force_refresh: (controls.force_refresh ?? false).toString()
      });

      const response = await fetch(`${apiUrl}/api/v1/analytics/overview?${params}`, {
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

      const data: EconomicOverview = await response.json();
      setOverview(data);
    } catch (err) {
      const analyticsError = handleApiError(err, 'overview');
      setError(analyticsError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchCategories = useCallback(async (controls: Partial<AnalyticsControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const params = new URLSearchParams({
        use_cache: (controls.use_cache ?? true).toString()
      });

      const response = await fetch(`${apiUrl}/api/v1/analytics/categories?${params}`, {
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

      const data: CategorySummary[] = await response.json();
      setCategories(data);
    } catch (err) {
      const analyticsError = handleApiError(err, 'categories');
      setError(analyticsError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchIndicators = useCallback(async (controls: Partial<AnalyticsControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const params = new URLSearchParams({
        use_cache: (controls.use_cache ?? true).toString()
      });

      if (controls.category_filter) {
        params.append('category', controls.category_filter);
      }

      const response = await fetch(`${apiUrl}/api/v1/analytics/indicators?${params}`, {
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

      const data: IndicatorSummary[] = await response.json();
      setIndicators(data);
    } catch (err) {
      const analyticsError = handleApiError(err, 'indicators');
      setError(analyticsError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchInsights = useCallback(async (controls: Partial<AnalyticsControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const params = new URLSearchParams({
        use_cache: (controls.use_cache ?? true).toString()
      });

      const response = await fetch(`${apiUrl}/api/v1/analytics/insights?${params}`, {
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

      const data: AnalyticalInsights = await response.json();
      setInsights(data);
    } catch (err) {
      const analyticsError = handleApiError(err, 'insights');
      setError(analyticsError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchCompleteAggregation = useCallback(async (controls: Partial<AnalyticsControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const params = new URLSearchParams({
        use_cache: (controls.use_cache ?? true).toString(),
        force_refresh: (controls.force_refresh ?? false).toString()
      });

      const response = await fetch(`${apiUrl}/api/v1/analytics/aggregation?${params}`, {
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

      const data: CompleteAggregation = await response.json();
      setOverview(data.economic_overview);
      setCategories(data.category_summaries);
      setIndicators(data.indicator_summaries);
    } catch (err) {
      const analyticsError = handleApiError(err, 'aggregation');
      setError(analyticsError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const refreshHealth = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/analytics/health`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data: AnalyticsHealthStatus = await response.json();
        setHealth(data);
      }
    } catch (err) {
      console.warn('Could not fetch analytics health:', err);
    }
  }, [apiUrl]);

  const exportData = useCallback((format: 'csv' | 'json', dataType: 'overview' | 'categories' | 'indicators' | 'insights') => {
    let data: any = null;
    let filename = '';

    switch (dataType) {
      case 'overview':
        data = overview;
        filename = `economic_overview_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'categories':
        data = categories;
        filename = `category_summaries_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'indicators':
        data = indicators;
        filename = `indicator_summaries_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'insights':
        data = insights;
        filename = `analytical_insights_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
    }

    if (!data) return;

    const content = format === 'json' 
      ? JSON.stringify(data, null, 2)
      : convertToCSV(data, dataType);

    const blob = new Blob([content], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [overview, categories, indicators, insights]);

  const convertToCSV = useCallback((data: any, dataType: string): string => {
    if (!data) return '';

    switch (dataType) {
      case 'categories':
        if (Array.isArray(data)) {
          const headers = ['Category', 'Indicator Count', 'Avg Risk Score', 'Trend', 'Volatility', 'Last Updated'];
          const rows = data.map(cat => [
            cat.category_name,
            cat.indicator_count.toString(),
            cat.avg_risk_score.toFixed(2),
            cat.category_trend,
            cat.category_volatility,
            cat.last_updated
          ]);
          return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        break;
      case 'indicators':
        if (Array.isArray(data)) {
          const headers = ['Indicator', 'Category', 'Current Value', 'Mean', 'Median', 'Std Dev', 'Trend', 'Volatility', 'Data Points'];
          const rows = data.map(ind => [
            ind.indicator_name,
            ind.category,
            ind.current_value.toString(),
            ind.mean.toFixed(2),
            ind.median.toFixed(2),
            ind.std_dev.toFixed(2),
            ind.trend_direction,
            ind.volatility_level,
            ind.data_points.toString()
          ]);
          return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
        break;
      default:
        return JSON.stringify(data, null, 2);
    }
    
    return '';
  }, []);

  // Auto-refresh health on mount
  useEffect(() => {
    refreshHealth();
  }, [refreshHealth]);

  return {
    overview,
    categories,
    indicators,
    insights,
    health,
    loading,
    error,
    fetchOverview,
    fetchCategories,
    fetchIndicators,
    fetchInsights,
    fetchCompleteAggregation,
    refreshHealth,
    clearError,
    exportData
  };
}