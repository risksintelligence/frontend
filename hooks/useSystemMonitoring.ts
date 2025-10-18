import { useState, useCallback, useEffect } from 'react';

export interface SystemMetrics {
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_io: {
    bytes_sent: number;
    bytes_received: number;
  };
  database: {
    connections: number;
    query_rate: number;
    response_time: number;
  };
  cache: {
    hit_rate: number;
    miss_rate: number;
    eviction_rate: number;
  };
  api: {
    requests_per_second: number;
    average_response_time: number;
    error_rate: number;
  };
}

export interface AlertConfiguration {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  operator: 'greater_than' | 'less_than' | 'equals';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notification_channels: string[];
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  metric: string;
  current_value: number;
  threshold: number;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface ServiceStatus {
  service_name: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  uptime: number;
  last_check: string;
  response_time: number;
  error_message?: string;
  dependencies: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    response_time: number;
  }>;
}

export interface PerformanceMetrics {
  endpoint: string;
  method: string;
  avg_response_time: number;
  p95_response_time: number;
  p99_response_time: number;
  requests_count: number;
  error_count: number;
  error_rate: number;
  timestamp: string;
}

interface UseSystemMonitoringOptions {
  refreshInterval?: number;
  onError?: (error: Error) => void;
  enableRealTimeUpdates?: boolean;
}

interface UseSystemMonitoringResult {
  loading: boolean;
  error: string | null;
  
  systemMetrics: SystemMetrics | null;
  alerts: SystemAlert[];
  serviceStatuses: ServiceStatus[];
  performanceMetrics: PerformanceMetrics[];
  alertConfigurations: AlertConfiguration[];
  
  fetchSystemMetrics: () => Promise<SystemMetrics>;
  fetchAlerts: () => Promise<SystemAlert[]>;
  fetchServiceStatuses: () => Promise<ServiceStatus[]>;
  fetchPerformanceMetrics: () => Promise<PerformanceMetrics[]>;
  fetchAlertConfigurations: () => Promise<AlertConfiguration[]>;
  
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  createAlertConfiguration: (config: Omit<AlertConfiguration, 'id'>) => Promise<AlertConfiguration>;
  updateAlertConfiguration: (id: string, config: Partial<AlertConfiguration>) => Promise<AlertConfiguration>;
  deleteAlertConfiguration: (id: string) => Promise<void>;
  
  refreshAllData: () => Promise<void>;
  clearError: () => void;
}

export function useSystemMonitoring(
  apiUrl: string,
  options: UseSystemMonitoringOptions = {}
): UseSystemMonitoringResult {
  const {
    refreshInterval = 30000,
    onError,
    enableRealTimeUpdates = true
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [alertConfigurations, setAlertConfigurations] = useState<AlertConfiguration[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const makeRequest = useCallback(async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }, [apiUrl]);

  const handleError = useCallback((err: any, context: string) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    const fullError = new Error(`${context}: ${errorMessage}`);
    setError(fullError.message);
    onError?.(fullError);
    console.error(`System monitoring ${context} error:`, err);
  }, [onError]);

  const fetchSystemMetrics = useCallback(async (): Promise<SystemMetrics> => {
    try {
      const data = await makeRequest<SystemMetrics>('/api/v1/monitoring/system/metrics');
      setSystemMetrics(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch system metrics');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchAlerts = useCallback(async (): Promise<SystemAlert[]> => {
    try {
      const data = await makeRequest<SystemAlert[]>('/api/v1/monitoring/alerts');
      setAlerts(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch alerts');
      return [];
    }
  }, [makeRequest, handleError]);

  const fetchServiceStatuses = useCallback(async (): Promise<ServiceStatus[]> => {
    try {
      const data = await makeRequest<ServiceStatus[]>('/api/v1/monitoring/services/status');
      setServiceStatuses(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch service statuses');
      return [];
    }
  }, [makeRequest, handleError]);

  const fetchPerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics[]> => {
    try {
      const data = await makeRequest<PerformanceMetrics[]>('/api/v1/monitoring/performance');
      setPerformanceMetrics(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch performance metrics');
      return [];
    }
  }, [makeRequest, handleError]);

  const fetchAlertConfigurations = useCallback(async (): Promise<AlertConfiguration[]> => {
    try {
      const data = await makeRequest<AlertConfiguration[]>('/api/v1/monitoring/alerts/config');
      setAlertConfigurations(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch alert configurations');
      return [];
    }
  }, [makeRequest, handleError]);

  const acknowledgeAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      await makeRequest(`/api/v1/monitoring/alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });
      await fetchAlerts();
    } catch (err) {
      handleError(err, 'Failed to acknowledge alert');
      throw err;
    }
  }, [makeRequest, handleError, fetchAlerts]);

  const resolveAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      await makeRequest(`/api/v1/monitoring/alerts/${alertId}/resolve`, {
        method: 'POST'
      });
      await fetchAlerts();
    } catch (err) {
      handleError(err, 'Failed to resolve alert');
      throw err;
    }
  }, [makeRequest, handleError, fetchAlerts]);

  const createAlertConfiguration = useCallback(async (
    config: Omit<AlertConfiguration, 'id'>
  ): Promise<AlertConfiguration> => {
    try {
      const data = await makeRequest<AlertConfiguration>('/api/v1/monitoring/alerts/config', {
        method: 'POST',
        body: JSON.stringify(config)
      });
      await fetchAlertConfigurations();
      return data;
    } catch (err) {
      handleError(err, 'Failed to create alert configuration');
      throw err;
    }
  }, [makeRequest, handleError, fetchAlertConfigurations]);

  const updateAlertConfiguration = useCallback(async (
    id: string,
    config: Partial<AlertConfiguration>
  ): Promise<AlertConfiguration> => {
    try {
      const data = await makeRequest<AlertConfiguration>(`/api/v1/monitoring/alerts/config/${id}`, {
        method: 'PUT',
        body: JSON.stringify(config)
      });
      await fetchAlertConfigurations();
      return data;
    } catch (err) {
      handleError(err, 'Failed to update alert configuration');
      throw err;
    }
  }, [makeRequest, handleError, fetchAlertConfigurations]);

  const deleteAlertConfiguration = useCallback(async (id: string): Promise<void> => {
    try {
      await makeRequest(`/api/v1/monitoring/alerts/config/${id}`, {
        method: 'DELETE'
      });
      await fetchAlertConfigurations();
    } catch (err) {
      handleError(err, 'Failed to delete alert configuration');
      throw err;
    }
  }, [makeRequest, handleError, fetchAlertConfigurations]);

  const refreshAllData = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchSystemMetrics(),
        fetchAlerts(),
        fetchServiceStatuses(),
        fetchPerformanceMetrics(),
        fetchAlertConfigurations()
      ]);
    } catch (err) {
      handleError(err, 'Failed to refresh monitoring data');
    } finally {
      setLoading(false);
    }
  }, [
    fetchSystemMetrics,
    fetchAlerts,
    fetchServiceStatuses,
    fetchPerformanceMetrics,
    fetchAlertConfigurations,
    handleError
  ]);

  useEffect(() => {
    if (enableRealTimeUpdates) {
      refreshAllData();
      const interval = setInterval(refreshAllData, refreshInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [enableRealTimeUpdates, refreshAllData, refreshInterval]);

  return {
    loading,
    error,
    
    systemMetrics,
    alerts,
    serviceStatuses,
    performanceMetrics,
    alertConfigurations,
    
    fetchSystemMetrics,
    fetchAlerts,
    fetchServiceStatuses,
    fetchPerformanceMetrics,
    fetchAlertConfigurations,
    
    acknowledgeAlert,
    resolveAlert,
    createAlertConfiguration,
    updateAlertConfiguration,
    deleteAlertConfiguration,
    
    refreshAllData,
    clearError
  };
}