import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import {
  AnalyticsUpdateMessage,
  AnalyticsUpdateData,
  RealTimeAnalyticsState,
  WebSocketConfig,
  RealTimeAlert
} from '../types/realtime';

interface UseRealTimeAnalyticsOptions extends WebSocketConfig {
  onPerformanceAlert?: (alert: RealTimeAlert) => void;
  performanceThresholds?: {
    cpu_warning: number;
    cpu_critical: number;
    memory_warning: number;
    memory_critical: number;
    error_rate_warning: number;
  };
}

interface UseRealTimeAnalyticsResult {
  analyticsState: RealTimeAnalyticsState;
  currentAnalytics: AnalyticsUpdateData | null;
  analyticsHistory: AnalyticsUpdateData[];
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate: string | null;
  subscribe: () => void;
  unsubscribe: () => void;
  clearHistory: () => void;
  getSystemHealth: () => 'healthy' | 'degraded' | 'critical';
  getPerformanceMetrics: () => {
    cpu_trend: 'increasing' | 'decreasing' | 'stable';
    memory_trend: 'increasing' | 'decreasing' | 'stable';
    cache_efficiency: number;
    system_load: 'low' | 'medium' | 'high';
  };
}

export function useRealTimeAnalytics(
  apiUrl: string,
  options: UseRealTimeAnalyticsOptions = {}
): UseRealTimeAnalyticsResult {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 10000,
    historyLimit = 50,
    onPerformanceAlert,
    performanceThresholds = {
      cpu_warning: 70,
      cpu_critical: 90,
      memory_warning: 80,
      memory_critical: 95,
      error_rate_warning: 0.05
    },
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [analyticsState, setAnalyticsState] = useState<RealTimeAnalyticsState>({
    currentAnalytics: null,
    history: [],
    lastUpdate: null,
    connectionState: {
      status: 'disconnected',
      reconnectAttempts: 0,
      maxReconnectAttempts: reconnectAttempts
    },
    isSubscribed: false
  });

  const wsUrl = `${apiUrl.replace('http', 'ws')}/ws/analytics-updates`;

  const handleMessage = useCallback((message: any) => {
    try {
      if (message.type === 'analytics_update' && message.data) {
        const analyticsUpdate = message as AnalyticsUpdateMessage;
        const newAnalyticsData = analyticsUpdate.data;

        setAnalyticsState(prev => {
          const newHistory = [...prev.history, newAnalyticsData];
          if (newHistory.length > historyLimit) {
            newHistory.shift();
          }

          return {
            ...prev,
            currentAnalytics: newAnalyticsData,
            history: newHistory,
            lastUpdate: message.timestamp,
            connectionState: {
              ...prev.connectionState,
              status: 'connected'
            }
          };
        });

        // Check performance thresholds
        const { system_metrics, application_metrics } = newAnalyticsData;
        
        // CPU alerts
        if (system_metrics.cpu_percent >= performanceThresholds.cpu_critical) {
          const alert: RealTimeAlert = {
            id: `cpu-critical-${Date.now()}`,
            type: 'performance',
            severity: 'critical',
            title: 'Critical CPU Usage',
            message: `CPU usage has reached ${system_metrics.cpu_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'real_time_analytics_monitor',
            data: { metric: 'cpu', value: system_metrics.cpu_percent }
          };
          onPerformanceAlert?.(alert);
        } else if (system_metrics.cpu_percent >= performanceThresholds.cpu_warning) {
          const alert: RealTimeAlert = {
            id: `cpu-warning-${Date.now()}`,
            type: 'performance',
            severity: 'medium',
            title: 'High CPU Usage',
            message: `CPU usage has reached ${system_metrics.cpu_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'real_time_analytics_monitor',
            data: { metric: 'cpu', value: system_metrics.cpu_percent }
          };
          onPerformanceAlert?.(alert);
        }

        // Memory alerts
        if (system_metrics.memory_percent >= performanceThresholds.memory_critical) {
          const alert: RealTimeAlert = {
            id: `memory-critical-${Date.now()}`,
            type: 'performance',
            severity: 'critical',
            title: 'Critical Memory Usage',
            message: `Memory usage has reached ${system_metrics.memory_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'real_time_analytics_monitor',
            data: { metric: 'memory', value: system_metrics.memory_percent }
          };
          onPerformanceAlert?.(alert);
        } else if (system_metrics.memory_percent >= performanceThresholds.memory_warning) {
          const alert: RealTimeAlert = {
            id: `memory-warning-${Date.now()}`,
            type: 'performance',
            severity: 'medium',
            title: 'High Memory Usage',
            message: `Memory usage has reached ${system_metrics.memory_percent.toFixed(1)}%`,
            timestamp: message.timestamp,
            source: 'real_time_analytics_monitor',
            data: { metric: 'memory', value: system_metrics.memory_percent }
          };
          onPerformanceAlert?.(alert);
        }

        // Error rate alerts
        if (application_metrics.error_rate >= performanceThresholds.error_rate_warning) {
          const alert: RealTimeAlert = {
            id: `error-rate-warning-${Date.now()}`,
            type: 'performance',
            severity: 'high',
            title: 'Elevated Error Rate',
            message: `Application error rate has reached ${(application_metrics.error_rate * 100).toFixed(2)}%`,
            timestamp: message.timestamp,
            source: 'real_time_analytics_monitor',
            data: { metric: 'error_rate', value: application_metrics.error_rate }
          };
          onPerformanceAlert?.(alert);
        }

      } else if (message.type === 'error') {
        console.error('Analytics WebSocket error:', message.message);
        setAnalyticsState(prev => ({
          ...prev,
          connectionState: {
            ...prev.connectionState,
            status: 'error',
            lastError: message.message
          }
        }));
      }
    } catch (error) {
      console.error('Error processing analytics update:', error);
    }
  }, [historyLimit, onPerformanceAlert, performanceThresholds]);

  const handleConnect = useCallback(() => {
    setAnalyticsState(prev => ({
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
    setAnalyticsState(prev => ({
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
    setAnalyticsState(prev => ({
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
    setAnalyticsState(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  const getSystemHealth = useCallback((): 'healthy' | 'degraded' | 'critical' => {
    if (!analyticsState.currentAnalytics) return 'healthy';
    
    const { system_metrics } = analyticsState.currentAnalytics;
    
    if (system_metrics.cpu_percent >= performanceThresholds.cpu_critical ||
        system_metrics.memory_percent >= performanceThresholds.memory_critical) {
      return 'critical';
    }
    
    if (system_metrics.cpu_percent >= performanceThresholds.cpu_warning ||
        system_metrics.memory_percent >= performanceThresholds.memory_warning) {
      return 'degraded';
    }
    
    return 'healthy';
  }, [analyticsState.currentAnalytics, performanceThresholds]);

  const getPerformanceMetrics = useCallback(() => {
    if (analyticsState.history.length < 3) {
      return {
        cpu_trend: 'stable' as const,
        memory_trend: 'stable' as const,
        cache_efficiency: analyticsState.currentAnalytics?.cache_performance.hit_rate || 0,
        system_load: 'low' as const
      };
    }

    const recent = analyticsState.history.slice(-5);
    
    // Calculate CPU trend
    const cpuValues = recent.map(a => a.system_metrics.cpu_percent);
    const cpuTrend = cpuValues[cpuValues.length - 1] - cpuValues[0];
    
    // Calculate memory trend
    const memoryValues = recent.map(a => a.system_metrics.memory_percent);
    const memoryTrend = memoryValues[memoryValues.length - 1] - memoryValues[0];
    
    // Calculate system load
    const currentCpu = analyticsState.currentAnalytics?.system_metrics.cpu_percent || 0;
    const currentMemory = analyticsState.currentAnalytics?.system_metrics.memory_percent || 0;
    const avgLoad = (currentCpu + currentMemory) / 2;
    
    let systemLoad: 'low' | 'medium' | 'high' = 'low';
    if (avgLoad > 70) systemLoad = 'high';
    else if (avgLoad > 40) systemLoad = 'medium';

    return {
      cpu_trend: Math.abs(cpuTrend) < 2 ? 'stable' as const : cpuTrend > 0 ? 'increasing' as const : 'decreasing' as const,
      memory_trend: Math.abs(memoryTrend) < 2 ? 'stable' as const : memoryTrend > 0 ? 'increasing' as const : 'decreasing' as const,
      cache_efficiency: analyticsState.currentAnalytics?.cache_performance.hit_rate || 0,
      system_load: systemLoad
    };
  }, [analyticsState]);

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
    analyticsState,
    currentAnalytics: analyticsState.currentAnalytics,
    analyticsHistory: analyticsState.history,
    isConnected,
    connectionState,
    lastUpdate: analyticsState.lastUpdate,
    subscribe,
    unsubscribe,
    clearHistory,
    getSystemHealth,
    getPerformanceMetrics
  };
}