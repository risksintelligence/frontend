import React, { useState } from 'react';
import { useRealTimeAnalytics } from '../../hooks/useRealTimeAnalytics';

interface AnalyticsStreamProps {
  apiUrl: string;
  onAlert?: (alert: any) => void;
  className?: string;
}

export const AnalyticsStream: React.FC<AnalyticsStreamProps> = ({
  apiUrl,
  onAlert,
  className = ''
}) => {
  const {
    currentAnalytics,
    analyticsHistory,
    connectionState,
    lastUpdate,
    getSystemHealth,
    getPerformanceMetrics
  } = useRealTimeAnalytics(apiUrl, {
    autoConnect: true,
    reconnectAttempts: 5,
    historyLimit: 60,
    onPerformanceAlert: onAlert,
    performanceThresholds: {
      cpu_warning: 70,
      cpu_critical: 90,
      memory_warning: 80,
      memory_critical: 95,
      error_rate_warning: 0.05
    }
  });

  const [selectedMetric, setSelectedMetric] = useState<'cpu' | 'memory' | 'cache' | 'requests'>('cpu');

  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected': return { text: 'Streaming', color: 'text-green-600', bg: 'bg-green-100' };
      case 'connecting': return { text: 'Connecting', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'disconnected': return { text: 'Offline', color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'error': return { text: 'Error', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthBg = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-green-100';
      case 'degraded': return 'bg-yellow-100';
      case 'critical': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };


  const getMetricHistory = () => {
    if (!analyticsHistory.length) return [];
    
    return analyticsHistory.slice(-20).map(analytics => {
      switch (selectedMetric) {
        case 'cpu':
          return {
            timestamp: analytics.last_data_refresh,
            value: analytics.system_metrics.cpu_percent,
            label: 'CPU %'
          };
        case 'memory':
          return {
            timestamp: analytics.last_data_refresh,
            value: analytics.system_metrics.memory_percent,
            label: 'Memory %'
          };
        case 'cache':
          return {
            timestamp: analytics.last_data_refresh,
            value: analytics.cache_performance.hit_rate * 100,
            label: 'Cache Hit %'
          };
        case 'requests':
          return {
            timestamp: analytics.last_data_refresh,
            value: analytics.application_metrics.requests_per_minute,
            label: 'Requests/min'
          };
        default:
          return {
            timestamp: analytics.last_data_refresh,
            value: 0,
            label: 'N/A'
          };
      }
    });
  };

  const connectionStatus = getConnectionStatus();
  const systemHealth = getSystemHealth();
  const performanceMetrics = getPerformanceMetrics();
  const metricHistory = getMetricHistory();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Analytics Stream</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${connectionStatus.bg} ${connectionStatus.color}`}>
            {connectionStatus.text}
          </div>
        </div>
        
        {/* Metric Selector */}
        <div className="flex space-x-2">
          {(['cpu', 'memory', 'cache', 'requests'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
                selectedMetric === metric
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* System Health Overview */}
      <div className="p-4 border-b border-gray-200">
        <div className={`p-3 rounded-lg border ${getHealthBg(systemHealth)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">System Health</span>
            <span className={`text-sm font-bold ${getHealthColor(systemHealth)}`}>
              {systemHealth.toUpperCase()}
            </span>
          </div>
          
          {currentAnalytics && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Status</div>
                <div className="font-semibold">{currentAnalytics.status}</div>
              </div>
              <div>
                <div className="text-gray-600">Indicators</div>
                <div className="font-semibold">{currentAnalytics.indicators_tracked}</div>
              </div>
              <div>
                <div className="text-gray-600">Categories</div>
                <div className="font-semibold">{currentAnalytics.categories_analyzed}</div>
              </div>
              <div>
                <div className="text-gray-600">Uptime</div>
                <div className="font-semibold">
                  {formatUptime(currentAnalytics.application_metrics.uptime_seconds)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Metrics */}
      {currentAnalytics && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Current Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* System Metrics */}
            <div className="space-y-3">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">System</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className={`text-sm font-medium ${
                    currentAnalytics.system_metrics.cpu_percent > 80 ? 'text-red-600' :
                    currentAnalytics.system_metrics.cpu_percent > 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {currentAnalytics.system_metrics.cpu_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className={`text-sm font-medium ${
                    currentAnalytics.system_metrics.memory_percent > 85 ? 'text-red-600' :
                    currentAnalytics.system_metrics.memory_percent > 70 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {currentAnalytics.system_metrics.memory_percent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Disk Usage</span>
                  <span className="text-sm font-medium">
                    {currentAnalytics.system_metrics.disk_percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Application Metrics */}
            <div className="space-y-3">
              <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Application</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Requests/min</span>
                  <span className="text-sm font-medium">
                    {currentAnalytics.application_metrics.requests_per_minute.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className={`text-sm font-medium ${
                    currentAnalytics.application_metrics.error_rate > 0.05 ? 'text-red-600' :
                    currentAnalytics.application_metrics.error_rate > 0.01 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {(currentAnalytics.application_metrics.error_rate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className={`text-sm font-medium ${
                    currentAnalytics.cache_performance.hit_rate < 0.8 ? 'text-red-600' :
                    currentAnalytics.cache_performance.hit_rate < 0.9 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {(currentAnalytics.cache_performance.hit_rate * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Trends */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Trends</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">CPU Trend</div>
            <div className={`font-semibold ${
              performanceMetrics.cpu_trend === 'increasing' ? 'text-red-600' :
              performanceMetrics.cpu_trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {performanceMetrics.cpu_trend === 'increasing' ? '↗' : 
               performanceMetrics.cpu_trend === 'decreasing' ? '↘' : '→'} {performanceMetrics.cpu_trend}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Memory Trend</div>
            <div className={`font-semibold ${
              performanceMetrics.memory_trend === 'increasing' ? 'text-red-600' :
              performanceMetrics.memory_trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
            }`}>
              {performanceMetrics.memory_trend === 'increasing' ? '↗' : 
               performanceMetrics.memory_trend === 'decreasing' ? '↘' : '→'} {performanceMetrics.memory_trend}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Cache Efficiency</div>
            <div className="font-semibold">{(performanceMetrics.cache_efficiency * 100).toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-gray-600">System Load</div>
            <div className={`font-semibold ${
              performanceMetrics.system_load === 'high' ? 'text-red-600' :
              performanceMetrics.system_load === 'medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {performanceMetrics.system_load}
            </div>
          </div>
        </div>
      </div>

      {/* Metric History */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">
            {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} History
          </h4>
          <div className="text-xs text-gray-500">
            Last {metricHistory.length} readings
          </div>
        </div>
        
        {metricHistory.length > 0 ? (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {metricHistory.slice(-8).reverse().map((reading, index) => (
              <div key={`${reading.timestamp}-${index}`} className="flex items-center justify-between p-1 text-xs">
                <span className="text-gray-500">{formatTimestamp(reading.timestamp)}</span>
                <span className="font-medium">
                  {reading.value.toFixed(selectedMetric === 'requests' ? 0 : 1)}
                  {selectedMetric === 'cpu' || selectedMetric === 'memory' || selectedMetric === 'cache' ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No metric history available
          </div>
        )}
      </div>

      {/* Footer Info */}
      {lastUpdate && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Last updated: {formatTimestamp(lastUpdate)}
          </div>
        </div>
      )}
    </div>
  );
};