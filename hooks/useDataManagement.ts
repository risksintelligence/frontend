import { useState, useEffect, useCallback } from 'react';
import {
  DataSourcesResponse,
  SourceSeriesResponse,
  DataResponse,
  QualityResponse,
  PipelineStatus,
  DataControls,
  DataError,
  DataExportRequest
} from '../types/data';

interface UseDataManagementResult {
  sources: DataSourcesResponse | null;
  series: SourceSeriesResponse | null;
  fetchedData: DataResponse | null;
  quality: QualityResponse | null;
  pipelineStatus: PipelineStatus | null;
  loading: boolean;
  error: DataError | null;
  fetchSources: () => Promise<void>;
  fetchSeries: (source: string, controls?: Partial<DataControls>) => Promise<void>;
  fetchData: (source: string, controls: Partial<DataControls>) => Promise<void>;
  fetchQuality: (source: string) => Promise<void>;
  fetchPipelineStatus: () => Promise<void>;
  exportData: (request: DataExportRequest) => Promise<void>;
  clearError: () => void;
  resetData: () => void;
}

export function useDataManagement(apiUrl: string): UseDataManagementResult {
  const [sources, setSources] = useState<DataSourcesResponse | null>(null);
  const [series, setSeries] = useState<SourceSeriesResponse | null>(null);
  const [fetchedData, setFetchedData] = useState<DataResponse | null>(null);
  const [quality, setQuality] = useState<QualityResponse | null>(null);
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DataError | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetData = useCallback(() => {
    setFetchedData(null);
    setQuality(null);
    setSeries(null);
  }, []);

  const handleApiError = useCallback((err: any, endpoint: string): DataError => {
    console.error(`Data Management API error (${endpoint}):`, err);
    
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
        message: 'Data service temporarily unavailable',
        details: 'The backend data service is experiencing issues',
        endpoint,
        retry_suggested: true
      };
    }

    if (err.status === 404) {
      return {
        type: 'api_error',
        message: 'Data endpoint not found',
        details: 'The requested data source or series may not exist',
        endpoint,
        retry_suggested: false
      };
    }

    if (err.status === 400) {
      return {
        type: 'validation_error',
        message: 'Invalid request parameters',
        details: err.message || 'Check your request parameters and try again',
        endpoint,
        retry_suggested: false
      };
    }

    return {
      type: 'api_error',
      message: 'Failed to fetch data',
      details: err.message || 'Unknown error occurred',
      endpoint,
      retry_suggested: true
    };
  }, []);

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiUrl}/api/v1/data/sources`, {
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

      const data: DataSourcesResponse = await response.json();
      setSources(data);
    } catch (err) {
      const dataError = handleApiError(err, 'sources');
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchSeries = useCallback(async (source: string, controls: Partial<DataControls> = {}) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const params = new URLSearchParams();
      if (controls.category) params.append('category', controls.category);
      if (controls.search) params.append('search', controls.search);
      if (controls.limit) params.append('limit', controls.limit.toString());

      const response = await fetch(`${apiUrl}/api/v1/data/series/${source}?${params}`, {
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

      const data: SourceSeriesResponse = await response.json();
      setSeries(data);
    } catch (err) {
      const dataError = handleApiError(err, 'series');
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchData = useCallback(async (source: string, controls: Partial<DataControls>) => {
    try {
      setLoading(true);
      setError(null);

      if (!controls.series_id) {
        throw new Error('Series ID is required to fetch data');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds for data fetch

      const params = new URLSearchParams({
        series_id: controls.series_id,
        use_cache: (controls.use_cache ?? true).toString()
      });

      if (controls.start_date) params.append('start_date', controls.start_date);
      if (controls.end_date) params.append('end_date', controls.end_date);
      if (controls.frequency) params.append('frequency', controls.frequency);

      const response = await fetch(`${apiUrl}/api/v1/data/fetch/${source}?${params}`, {
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

      const data: DataResponse = await response.json();
      setFetchedData(data);
    } catch (err) {
      const dataError = handleApiError(err, 'fetch');
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchQuality = useCallback(async (source: string) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiUrl}/api/v1/data/quality/${source}`, {
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

      const data: QualityResponse = await response.json();
      setQuality(data);
    } catch (err) {
      const dataError = handleApiError(err, 'quality');
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const fetchPipelineStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${apiUrl}/api/v1/data/status`, {
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

      const data: PipelineStatus = await response.json();
      setPipelineStatus(data);
    } catch (err) {
      const dataError = handleApiError(err, 'status');
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  const exportData = useCallback(async (request: DataExportRequest) => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes for export

      const params = new URLSearchParams({
        format: request.format
      });

      if (request.series) params.append('series', request.series);
      if (request.start_date) params.append('start_date', request.start_date);
      if (request.end_date) params.append('end_date', request.end_date);

      const response = await fetch(`${apiUrl}/api/v1/data/export/${request.source}?${params}`, {
        signal: controller.signal,
        headers: {
          'Accept': request.format === 'csv' ? 'text/csv' : 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          status: response.status,
          message: await response.text()
        };
      }

      // Handle file download
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${request.source}_export_${new Date().toISOString().split('T')[0]}.${request.format}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      const dataError = handleApiError(err, 'export');
      if (dataError.type !== 'export_error') {
        dataError.type = 'export_error';
        dataError.message = 'Failed to export data';
      }
      setError(dataError);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, handleApiError]);

  // Auto-fetch sources on mount
  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return {
    sources,
    series,
    fetchedData,
    quality,
    pipelineStatus,
    loading,
    error,
    fetchSources,
    fetchSeries,
    fetchData,
    fetchQuality,
    fetchPipelineStatus,
    exportData,
    clearError,
    resetData
  };
}