import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import {
  HealthUpdateMessage,
  HealthUpdateData,
  RealTimeHealthState,
  WebSocketConfig,
  RealTimeAlert
} from '../types/realtime';

interface UseSystemHealthOptions extends WebSocketConfig {
  onSystemAlert?: (alert: RealTimeAlert) => void;
  healthThresholds?: {
    cpu_critical: number;
    memory_critical: number;
    connection_warning: number;
  };
}

interface UseSystemHealthResult {
  healthState: RealTimeHealthState;
  currentHealth: HealthUpdateData | null;
  healthHistory: HealthUpdateData[];
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate: string | null;
  subscribe: () => void;
  unsubscribe: () => void;
  clearHistory: () => void;
  getOverallStatus: () => 'healthy' | 'degraded' | 'critical' | 'unknown';
  getServiceHealth: () => {
    api: 'healthy' | 'degraded' | 'critical';
    cache: 'operational' | 'degraded' | 'unavailable';
    database: 'operational' | 'degraded' | 'unavailable';
    pipeline: 'active' | 'inactive' | 'error';
  };
}

export function useSystemHealth(
  apiUrl: string,
  options: UseSystemHealthOptions = {}
): UseSystemHealthResult {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 15000,
    historyLimit = 30,
    onSystemAlert,
    healthThresholds = {
      cpu_critical: 90,
      memory_critical: 90,
      connection_warning: 50
    },
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [healthState, setHealthState] = useState<RealTimeHealthState>({
    currentHealth: null,
    history: [],
    lastUpdate: null,
    connectionState: {
      status: 'disconnected',
      reconnectAttempts: 0,
      maxReconnectAttempts: reconnectAttempts
    },
    isSubscribed: false
  });

  const wsUrl = `${apiUrl.replace('http', 'ws')}/ws/system-health`;

  const handleMessage = useCallback((message: any) => {
    try {
      if (message.type === 'health_update' && message.data) {
        const healthUpdate = message as HealthUpdateMessage;
        const newHealthData = healthUpdate.data;

        setHealthState(prev => {
          const newHistory = [...prev.history, newHealthData];
          if (newHistory.length > historyLimit) {
            newHistory.shift();
          }

          return {
            ...prev,
            currentHealth: newHealthData,
            history: newHistory,
            lastUpdate: message.timestamp,
            connectionState: {
              ...prev.connectionState,
              status: 'connected'
            }
          };
        });

        // Check system health thresholds and generate alerts
        const { system_resources, api_status, cache_status, database_status } = newHealthData;
        
        // Critical system resource alerts
        if (system_resources.cpu_percent >= healthThresholds.cpu_critical) {
          const alert: RealTimeAlert = {
            id: `cpu-critical-${Date.now()}`,
            type: 'system',
            severity: 'critical',
            title: 'Critical CPU Usage',
            message: `System CPU usage has reached ${system_resources.cpu_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'system_health_monitor',
            data: { metric: 'cpu', value: system_resources.cpu_percent },
            actions: [
              { label: 'View Details', action: 'view_system_details', style: 'primary' },
              { label: 'Acknowledge', action: 'acknowledge_alert', style: 'secondary' }
            ]
          };
          onSystemAlert?.(alert);
        }

        if (system_resources.memory_percent >= healthThresholds.memory_critical) {
          const alert: RealTimeAlert = {
            id: `memory-critical-${Date.now()}`,
            type: 'system',
            severity: 'critical',
            title: 'Critical Memory Usage',
            message: `System memory usage has reached ${system_resources.memory_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'system_health_monitor',
            data: { metric: 'memory', value: system_resources.memory_percent }
          };
          onSystemAlert?.(alert);
        }

        // Service status alerts
        if (api_status === 'stressed' || api_status === 'error') {
          const alert: RealTimeAlert = {
            id: `api-status-${Date.now()}`,
            type: 'system',
            severity: api_status === 'error' ? 'critical' : 'high',
            title: `API Service ${api_status === 'error' ? 'Error' : 'Stress'}`,
            message: `API service status: ${api_status}`,
            timestamp: message.timestamp,
            source: 'system_health_monitor',
            data: { service: 'api', status: api_status }
          };
          onSystemAlert?.(alert);
        }

        if (cache_status === 'error' || database_status === 'unavailable') {
          const alert: RealTimeAlert = {
            id: `infrastructure-${Date.now()}`,
            type: 'system',
            severity: 'high',
            title: 'Infrastructure Service Issue',
            message: `Service issues detected - Cache: ${cache_status}, Database: ${database_status}`,
            timestamp: message.timestamp,
            source: 'system_health_monitor',
            data: { cache_status, database_status }
          };
          onSystemAlert?.(alert);
        }

        // Connection health warning
        if (newHealthData.active_connections >= healthThresholds.connection_warning) {
          const alert: RealTimeAlert = {
            id: `connections-warning-${Date.now()}`,
            type: 'system',
            severity: 'medium',
            title: 'High Connection Load',
            message: `Active connections: ${newHealthData.active_connections}`,
            timestamp: message.timestamp,
            source: 'system_health_monitor',
            data: { metric: 'connections', value: newHealthData.active_connections }
          };
          onSystemAlert?.(alert);
        }

      } else if (message.type === 'error') {
        console.error('System health WebSocket error:', message.message);
        setHealthState(prev => ({
          ...prev,
          connectionState: {
            ...prev.connectionState,
            status: 'error',
            lastError: message.message
          }
        }));
      }
    } catch (error) {
      console.error('Error processing health update:', error);
    }
  }, [historyLimit, onSystemAlert, healthThresholds]);

  const handleConnect = useCallback(() => {
    setHealthState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'connected',
        lastConnected: new Date().toISOString(),
        reconnectAttempts: 0
      },
      isSubscribed: true
    }));
    onConnect?.();
  }, [onConnect]);

  const handleDisconnect = useCallback(() => {
    setHealthState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'disconnected'
      },
      isSubscribed: false
    }));
    onDisconnect?.();
  }, [onDisconnect]);

  const handleError = useCallback((error: any) => {
    setHealthState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'error',
        lastError: error.message || 'Connection error',
        reconnectAttempts: prev.connectionState.reconnectAttempts + 1
      }
    }));
    onError?.(error);
  }, [onError]);

  const {
    isConnected,
    connectionState,
    connect,
    disconnect
  } = useWebSocket(wsUrl, {
    reconnectAttempts,
    reconnectInterval,
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError
  });

  const subscribe = useCallback(() => {
    connect();
  }, [connect]);

  const unsubscribe = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const clearHistory = useCallback(() => {
    setHealthState(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  const getOverallStatus = useCallback((): 'healthy' | 'degraded' | 'critical' | 'unknown' => {
    if (!healthState.currentHealth) return 'unknown';
    
    const { api_status, system_resources } = healthState.currentHealth;
    
    // Critical conditions
    if (api_status === 'stressed' || 
        system_resources.cpu_percent >= healthThresholds.cpu_critical ||
        system_resources.memory_percent >= healthThresholds.memory_critical) {
      return 'critical';
    }
    
    // Degraded conditions
    if (api_status === 'degraded' ||
        system_resources.cpu_percent >= 70 ||
        system_resources.memory_percent >= 70) {
      return 'degraded';
    }
    
    return 'healthy';
  }, [healthState.currentHealth, healthThresholds]);

  const getServiceHealth = useCallback(() => {
    if (!healthState.currentHealth) {
      return {
        api: 'critical' as const,
        cache: 'unavailable' as const,
        database: 'unavailable' as const,
        pipeline: 'inactive' as const
      };
    }

    const { api_status, cache_status, database_status, data_pipeline_status } = healthState.currentHealth;
    
    // Map API status
    let apiHealth: 'healthy' | 'degraded' | 'critical' = 'healthy';
    if (api_status === 'stressed') apiHealth = 'critical';
    else if (api_status === 'degraded') apiHealth = 'degraded';
    
    // Map cache status
    let cacheHealth: 'operational' | 'degraded' | 'unavailable' = 'operational';
    if (cache_status === 'unavailable') cacheHealth = 'unavailable';
    else if (cache_status === 'degraded') cacheHealth = 'degraded';
    
    // Map database status
    let dbHealth: 'operational' | 'degraded' | 'unavailable' = 'operational';
    if (database_status === 'unavailable') dbHealth = 'unavailable';
    else if (database_status === 'degraded') dbHealth = 'degraded';
    
    // Map pipeline status
    let pipelineHealth: 'active' | 'inactive' | 'error' = 'active';
    if (data_pipeline_status === 'error') pipelineHealth = 'error';
    else if (data_pipeline_status === 'inactive') pipelineHealth = 'inactive';

    return {
      api: apiHealth,
      cache: cacheHealth,
      database: dbHealth,
      pipeline: pipelineHealth
    };
  }, [healthState.currentHealth]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      subscribe();
    }
    
    return () => {
      unsubscribe();
    };
  }, [autoConnect, subscribe, unsubscribe]);

  return {
    healthState,
    currentHealth: healthState.currentHealth,
    healthHistory: healthState.history,
    isConnected,
    connectionState,
    lastUpdate: healthState.lastUpdate,
    subscribe,
    unsubscribe,
    clearHistory,
    getOverallStatus,
    getServiceHealth
  };
}