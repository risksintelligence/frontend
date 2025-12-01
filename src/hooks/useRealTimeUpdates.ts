import { useState, useEffect, useRef, useCallback } from 'react';

export interface DataUpdate {
  update_id: string;
  data_source: string;
  change_detected: boolean;
  data_summary: Record<string, unknown>;
  affected_endpoints: string[];
  timestamp: string;
}

export interface RefreshServiceStatus {
  service_status: 'running' | 'stopped';
  total_jobs: number;
  jobs: Array<{
    job_id: string;
    data_source: string;
    priority: string;
    last_refresh: string;
    next_refresh: string;
    refresh_count: number;
    error_count: number;
    health: string;
  }>;
  recent_updates: Array<{
    update_id: string;
    data_source: string;
    timestamp: string;
    change_detected: boolean;
    processing_time_ms: number;
  }>;
  total_subscribers: number;
}

export interface UseRealTimeUpdatesOptions {
  dataSources?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number;
  onUpdate?: (update: DataUpdate) => void;
  onError?: (error: string) => void;
}

export interface UseRealTimeUpdatesReturn {
  status: RefreshServiceStatus | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: DataUpdate | null;
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  startRefreshService: () => Promise<void>;
  stopRefreshService: () => Promise<void>;
  forceRefresh: (dataSource: string) => Promise<void>;
  updatePriority: (dataSource: string, priority: string) => Promise<void>;
  getHealthSummary: () => Promise<unknown>;
  refreshStatus: () => Promise<void>;
}

export function useRealTimeUpdates(options: UseRealTimeUpdatesOptions = {}): UseRealTimeUpdatesReturn {
  const {
    dataSources = [],
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    onUpdate,
    onError
  } = options;

  const [status, setStatus] = useState<RefreshServiceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<DataUpdate | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>('disconnected');

  const intervalRef = useRef<NodeJS.Timeout>();
  const connectionIdRef = useRef<string>(`conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Fetch refresh service status
  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/realtime/status');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus(data.refresh_service);
        setConnectionStatus('connected');
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setConnectionStatus('error');
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  // Start refresh service
  const startRefreshService = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const response = await fetch('/api/v1/realtime/start', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        await fetchStatus(); // Refresh status after starting
      } else {
        throw new Error(data.message || 'Failed to start service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start refresh service';
      setError(errorMessage);
      setConnectionStatus('error');
      onError?.(errorMessage);
    }
  }, [fetchStatus, onError]);

  // Stop refresh service
  const stopRefreshService = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/realtime/stop', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        setConnectionStatus('disconnected');
        await fetchStatus(); // Refresh status after stopping
      } else {
        throw new Error(data.message || 'Failed to stop service');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to stop refresh service';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [fetchStatus, onError]);

  // Force refresh a specific data source
  const forceRefresh = useCallback(async (dataSource: string) => {
    try {
      const response = await fetch(`/api/v1/realtime/force-refresh/${dataSource}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to force refresh');
      }
      
      // Refresh status after force refresh
      setTimeout(fetchStatus, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to force refresh';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [fetchStatus, onError]);

  // Update priority for a data source
  const updatePriority = useCallback(async (dataSource: string, priority: string) => {
    try {
      const response = await fetch(`/api/v1/realtime/priority/${dataSource}?priority=${priority}`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'Failed to update priority');
      }
      
      // Refresh status after priority update
      await fetchStatus();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update priority';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [fetchStatus, onError]);

  // Get health summary
  const getHealthSummary = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/realtime/health-summary');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data.status === 'success' ? data : null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get health summary';
      onError?.(errorMessage);
      return null;
    }
  }, [onError]);

  // Refresh status manually
  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    await fetchStatus();
  }, [fetchStatus]);

  // Subscribe to data sources (mock implementation - would use WebSockets in production)
  const subscribeToUpdates = useCallback(async () => {
    if (dataSources.length === 0) return;

    try {
      const response = await fetch('/api/v1/realtime/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          connection_id: connectionIdRef.current,
          data_sources: dataSources
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to subscribe: HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        console.log(`Subscribed to ${dataSources.length} data sources`);
      }
    } catch (err) {
      console.warn('Failed to subscribe to real-time updates:', err);
    }
  }, [dataSources]);

  // Simulate receiving updates by polling update history
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/realtime/update-history?limit=1');
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.status === 'success' && data.updates.length > 0) {
        const latestUpdate = data.updates[data.updates.length - 1];
        
        // Check if this is a new update
        if (!lastUpdate || latestUpdate.update_id !== lastUpdate.update_id) {
          const updateData: DataUpdate = {
            update_id: latestUpdate.update_id,
            data_source: latestUpdate.data_source,
            change_detected: latestUpdate.change_detected,
            data_summary: {},
            affected_endpoints: [],
            timestamp: latestUpdate.timestamp
          };
          
          setLastUpdate(updateData);
          onUpdate?.(updateData);
        }
      }
    } catch (err) {
      // Silent failure for polling
      console.debug('Failed to check for updates:', err);
    }
  }, [lastUpdate, onUpdate]);

  // Initialize and setup polling
  useEffect(() => {
    // Initial status fetch
    fetchStatus();

    // Subscribe to data sources if provided
    if (dataSources.length > 0) {
      subscribeToUpdates();
    }

    // Setup auto-refresh polling
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchStatus();
        checkForUpdates();
      }, refreshInterval);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Unsubscribe on cleanup
      if (dataSources.length > 0) {
        fetch(`/api/v1/realtime/unsubscribe/${connectionIdRef.current}`, {
          method: 'POST'
        }).catch(() => {
          // Silent failure on cleanup
        });
      }
    };
  }, [fetchStatus, subscribeToUpdates, checkForUpdates, autoRefresh, refreshInterval, dataSources]);

  return {
    status,
    isLoading,
    error,
    lastUpdate,
    connectionStatus,
    startRefreshService,
    stopRefreshService,
    forceRefresh,
    updatePriority,
    getHealthSummary,
    refreshStatus
  };
}
