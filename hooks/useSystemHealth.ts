import { useState, useCallback, useEffect } from 'react';

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  response_time_ms: number;
  last_checked: string;
  details?: {
    version?: string;
    uptime_seconds?: number;
    dependencies?: Array<{
      name: string;
      status: 'healthy' | 'degraded' | 'unhealthy';
      response_time_ms: number;
    }>;
  };
  error_message?: string;
}

export interface SystemHealth {
  overall_status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  timestamp: string;
  checks: HealthCheck[];
  summary: {
    total_services: number;
    healthy_services: number;
    degraded_services: number;
    unhealthy_services: number;
    unknown_services: number;
  };
}

export interface DatabaseHealth {
  connection_status: 'connected' | 'disconnected' | 'degraded';
  connection_pool: {
    active_connections: number;
    idle_connections: number;
    max_connections: number;
    utilization_percentage: number;
  };
  query_performance: {
    average_query_time_ms: number;
    slow_queries_count: number;
    queries_per_second: number;
  };
  storage: {
    database_size_mb: number;
    free_space_mb: number;
    utilization_percentage: number;
  };
  replication?: {
    status: 'active' | 'inactive' | 'lag';
    lag_seconds?: number;
  };
}

export interface CacheHealth {
  redis_status: 'connected' | 'disconnected' | 'degraded';
  memory_usage: {
    used_memory_mb: number;
    max_memory_mb: number;
    utilization_percentage: number;
  };
  performance: {
    hit_rate_percentage: number;
    miss_rate_percentage: number;
    operations_per_second: number;
    average_response_time_ms: number;
  };
  key_statistics: {
    total_keys: number;
    expired_keys: number;
    evicted_keys: number;
  };
}

export interface APIHealth {
  endpoint_status: Record<string, {
    status: 'healthy' | 'degraded' | 'unhealthy';
    response_time_ms: number;
    success_rate_percentage: number;
    last_checked: string;
  }>;
  overall_metrics: {
    total_requests: number;
    error_rate_percentage: number;
    average_response_time_ms: number;
    p95_response_time_ms: number;
    p99_response_time_ms: number;
  };
  rate_limiting: {
    current_rps: number;
    limit_rps: number;
    throttled_requests: number;
  };
}

export interface ExternalDependencies {
  data_sources: Array<{
    name: string;
    url: string;
    status: 'available' | 'unavailable' | 'degraded';
    last_successful_fetch: string;
    response_time_ms: number;
    error_count_24h: number;
  }>;
  third_party_apis: Array<{
    name: string;
    status: 'available' | 'unavailable' | 'rate_limited';
    response_time_ms: number;
    rate_limit_remaining: number;
    last_checked: string;
  }>;
}

export interface SystemDiagnostics {
  timestamp: string;
  system_health: SystemHealth;
  database_health: DatabaseHealth;
  cache_health: CacheHealth;
  api_health: APIHealth;
  external_dependencies: ExternalDependencies;
  recommendations: Array<{
    severity: 'info' | 'warning' | 'critical';
    component: string;
    message: string;
    suggested_action: string;
  }>;
}

interface UseSystemHealthOptions {
  refreshInterval?: number;
  onError?: (error: Error) => void;
  enableRealTimeUpdates?: boolean;
}

interface UseSystemHealthResult {
  loading: boolean;
  error: string | null;
  
  systemHealth: SystemHealth | null;
  databaseHealth: DatabaseHealth | null;
  cacheHealth: CacheHealth | null;
  apiHealth: APIHealth | null;
  externalDependencies: ExternalDependencies | null;
  systemDiagnostics: SystemDiagnostics | null;
  
  fetchSystemHealth: () => Promise<SystemHealth>;
  fetchDatabaseHealth: () => Promise<DatabaseHealth>;
  fetchCacheHealth: () => Promise<CacheHealth>;
  fetchAPIHealth: () => Promise<APIHealth>;
  fetchExternalDependencies: () => Promise<ExternalDependencies>;
  fetchSystemDiagnostics: () => Promise<SystemDiagnostics>;
  
  runHealthCheck: (service?: string) => Promise<HealthCheck[]>;
  refreshAllHealth: () => Promise<void>;
  clearError: () => void;
}

export function useSystemHealth(
  apiUrl: string,
  options: UseSystemHealthOptions = {}
): UseSystemHealthResult {
  const {
    refreshInterval = 60000,
    onError,
    enableRealTimeUpdates = true
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [databaseHealth, setDatabaseHealth] = useState<DatabaseHealth | null>(null);
  const [cacheHealth, setCacheHealth] = useState<CacheHealth | null>(null);
  const [apiHealth, setAPIHealth] = useState<APIHealth | null>(null);
  const [externalDependencies, setExternalDependencies] = useState<ExternalDependencies | null>(null);
  const [systemDiagnostics, setSystemDiagnostics] = useState<SystemDiagnostics | null>(null);

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
    console.error(`System health ${context} error:`, err);
  }, [onError]);

  const fetchSystemHealth = useCallback(async (): Promise<SystemHealth> => {
    try {
      const data = await makeRequest<SystemHealth>('/api/v1/health');
      setSystemHealth(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch system health');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchDatabaseHealth = useCallback(async (): Promise<DatabaseHealth> => {
    try {
      const data = await makeRequest<DatabaseHealth>('/api/v1/health/database');
      setDatabaseHealth(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch database health');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchCacheHealth = useCallback(async (): Promise<CacheHealth> => {
    try {
      const data = await makeRequest<CacheHealth>('/api/v1/health/cache');
      setCacheHealth(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch cache health');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchAPIHealth = useCallback(async (): Promise<APIHealth> => {
    try {
      const data = await makeRequest<APIHealth>('/api/v1/health/api');
      setAPIHealth(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch API health');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchExternalDependencies = useCallback(async (): Promise<ExternalDependencies> => {
    try {
      const data = await makeRequest<ExternalDependencies>('/api/v1/health/dependencies');
      setExternalDependencies(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch external dependencies');
      throw err;
    }
  }, [makeRequest, handleError]);

  const fetchSystemDiagnostics = useCallback(async (): Promise<SystemDiagnostics> => {
    try {
      const data = await makeRequest<SystemDiagnostics>('/api/v1/health/diagnostics');
      setSystemDiagnostics(data);
      return data;
    } catch (err) {
      handleError(err, 'Failed to fetch system diagnostics');
      throw err;
    }
  }, [makeRequest, handleError]);

  const runHealthCheck = useCallback(async (service?: string): Promise<HealthCheck[]> => {
    try {
      const endpoint = service 
        ? `/api/v1/health/check/${service}` 
        : '/api/v1/health/check';
      
      const data = await makeRequest<HealthCheck[]>(endpoint, {
        method: 'POST'
      });
      
      return data;
    } catch (err) {
      handleError(err, 'Failed to run health check');
      throw err;
    }
  }, [makeRequest, handleError]);

  const refreshAllHealth = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchSystemHealth(),
        fetchDatabaseHealth(),
        fetchCacheHealth(),
        fetchAPIHealth(),
        fetchExternalDependencies(),
        fetchSystemDiagnostics()
      ]);
    } catch (err) {
      handleError(err, 'Failed to refresh health data');
    } finally {
      setLoading(false);
    }
  }, [
    fetchSystemHealth,
    fetchDatabaseHealth,
    fetchCacheHealth,
    fetchAPIHealth,
    fetchExternalDependencies,
    fetchSystemDiagnostics,
    handleError
  ]);

  useEffect(() => {
    if (enableRealTimeUpdates) {
      refreshAllHealth();
      const interval = setInterval(refreshAllHealth, refreshInterval);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [enableRealTimeUpdates, refreshAllHealth, refreshInterval]);

  return {
    loading,
    error,
    
    systemHealth,
    databaseHealth,
    cacheHealth,
    apiHealth,
    externalDependencies,
    systemDiagnostics,
    
    fetchSystemHealth,
    fetchDatabaseHealth,
    fetchCacheHealth,
    fetchAPIHealth,
    fetchExternalDependencies,
    fetchSystemDiagnostics,
    
    runHealthCheck,
    refreshAllHealth,
    clearError
  };
}