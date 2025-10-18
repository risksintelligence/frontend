import React, { useState } from 'react';
import { useSystemHealth } from '../../hooks/useSystemHealth';

interface HealthMonitorProps {
  apiUrl: string;
  onAlert?: (alert: any) => void;
  className?: string;
}

export const HealthMonitor: React.FC<HealthMonitorProps> = ({
  apiUrl,
  onAlert,
  className = ''
}) => {
  const {
    currentHealth,
    healthHistory,
    connectionState,
    lastUpdate,
    getOverallStatus,
    getServiceHealth
  } = useSystemHealth(apiUrl, {
    autoConnect: true,
    reconnectAttempts: 5,
    historyLimit: 40,
    onSystemAlert: onAlert,
    healthThresholds: {
      cpu_critical: 90,
      memory_critical: 90,
      connection_warning: 50
    }
  });

  const [selectedView, setSelectedView] = useState<'overview' | 'services' | 'resources'>('overview');

  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected': return { text: 'Monitoring', color: 'text-green-600', bg: 'bg-green-100' };
      case 'connecting': return { text: 'Connecting', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'disconnected': return { text: 'Offline', color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'error': return { text: 'Error', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': case 'operational': case 'active': return 'text-green-600';
      case 'degraded': case 'stressed': case 'inactive': return 'text-yellow-600';
      case 'critical': case 'error': case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': case 'operational': case 'active': return 'bg-green-100 border-green-200';
      case 'degraded': case 'stressed': case 'inactive': return 'bg-yellow-100 border-yellow-200';
      case 'critical': case 'error': case 'unavailable': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy': case 'operational': case 'active': return '✓';
      case 'degraded': case 'stressed': case 'inactive': return '⚠';
      case 'critical': case 'error': case 'unavailable': return '✕';
      default: return '?';
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
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ${minutes % 60}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const getResourceStatus = (percentage: number, type: 'cpu' | 'memory' | 'disk') => {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 85, critical: 95 }
    };
    
    const threshold = thresholds[type];
    if (percentage >= threshold.critical) return 'critical';
    if (percentage >= threshold.warning) return 'degraded';
    return 'healthy';
  };

  const connectionStatus = getConnectionStatus();
  const overallStatus = getOverallStatus();
  const serviceHealth = getServiceHealth();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Health Monitor</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${connectionStatus.bg} ${connectionStatus.color}`}>
            {connectionStatus.text}
          </div>
        </div>
        
        {/* View Selector */}
        <div className="flex space-x-2">
          {(['overview', 'services', 'resources'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-3 py-1 text-xs rounded-md capitalize transition-colors ${
                selectedView === view
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Overall Health Status */}
      <div className="p-4 border-b border-gray-200">
        <div className={`p-3 rounded-lg border ${getStatusBg(overallStatus)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Overall System Status</span>
            <div className="flex items-center space-x-2">
              <span className={`text-lg ${getStatusColor(overallStatus)}`}>
                {getStatusIcon(overallStatus)}
              </span>
              <span className={`text-sm font-bold ${getStatusColor(overallStatus)}`}>
                {overallStatus.toUpperCase()}
              </span>
            </div>
          </div>
          
          {currentHealth && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Active Connections</div>
                <div className="font-semibold">{currentHealth.active_connections}</div>
              </div>
              <div>
                <div className="text-gray-600">Uptime</div>
                <div className="font-semibold">{formatUptime(currentHealth.uptime_seconds)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'overview' && currentHealth && (
        <div className="p-4 space-y-4">
          {/* Quick Status Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded border ${getStatusBg(currentHealth.api_status)}`}>
              <div className="flex items-center space-x-2">
                <span className={getStatusColor(currentHealth.api_status)}>
                  {getStatusIcon(currentHealth.api_status)}
                </span>
                <div>
                  <div className="text-xs text-gray-600">API</div>
                  <div className={`text-sm font-medium ${getStatusColor(currentHealth.api_status)}`}>
                    {currentHealth.api_status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded border ${getStatusBg(currentHealth.cache_status)}`}>
              <div className="flex items-center space-x-2">
                <span className={getStatusColor(currentHealth.cache_status)}>
                  {getStatusIcon(currentHealth.cache_status)}
                </span>
                <div>
                  <div className="text-xs text-gray-600">Cache</div>
                  <div className={`text-sm font-medium ${getStatusColor(currentHealth.cache_status)}`}>
                    {currentHealth.cache_status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded border ${getStatusBg(currentHealth.database_status)}`}>
              <div className="flex items-center space-x-2">
                <span className={getStatusColor(currentHealth.database_status)}>
                  {getStatusIcon(currentHealth.database_status)}
                </span>
                <div>
                  <div className="text-xs text-gray-600">Database</div>
                  <div className={`text-sm font-medium ${getStatusColor(currentHealth.database_status)}`}>
                    {currentHealth.database_status}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-3 rounded border ${getStatusBg(currentHealth.data_pipeline_status)}`}>
              <div className="flex items-center space-x-2">
                <span className={getStatusColor(currentHealth.data_pipeline_status)}>
                  {getStatusIcon(currentHealth.data_pipeline_status)}
                </span>
                <div>
                  <div className="text-xs text-gray-600">Pipeline</div>
                  <div className={`text-sm font-medium ${getStatusColor(currentHealth.data_pipeline_status)}`}>
                    {currentHealth.data_pipeline_status}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'services' && currentHealth && (
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Service Details</h4>
          
          <div className="space-y-3">
            {/* API Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(serviceHealth.api)}>
                  {getStatusIcon(serviceHealth.api)}
                </span>
                <div>
                  <div className="text-sm font-medium">API Service</div>
                  <div className="text-xs text-gray-500">HTTP endpoint status</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(serviceHealth.api)}`}>
                {serviceHealth.api}
              </span>
            </div>

            {/* Cache Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(serviceHealth.cache)}>
                  {getStatusIcon(serviceHealth.cache)}
                </span>
                <div>
                  <div className="text-sm font-medium">Cache Layer</div>
                  <div className="text-xs text-gray-500">
                    Hit rate: {(currentHealth.service_health.cache_hit_rate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(serviceHealth.cache)}`}>
                {serviceHealth.cache}
              </span>
            </div>

            {/* Database Service */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(serviceHealth.database)}>
                  {getStatusIcon(serviceHealth.database)}
                </span>
                <div>
                  <div className="text-sm font-medium">Database</div>
                  <div className="text-xs text-gray-500">
                    Connected: {currentHealth.service_health.database_connected ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(serviceHealth.database)}`}>
                {serviceHealth.database}
              </span>
            </div>

            {/* Data Pipeline */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className={getStatusColor(serviceHealth.pipeline)}>
                  {getStatusIcon(serviceHealth.pipeline)}
                </span>
                <div>
                  <div className="text-sm font-medium">Data Pipeline</div>
                  <div className="text-xs text-gray-500">ETL and data processing</div>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(serviceHealth.pipeline)}`}>
                {serviceHealth.pipeline}
              </span>
            </div>
          </div>
        </div>
      )}

      {selectedView === 'resources' && currentHealth && (
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">System Resources</h4>
          
          <div className="space-y-3">
            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(getResourceStatus(currentHealth.system_resources.cpu_percent, 'cpu'))}`}>
                  {currentHealth.system_resources.cpu_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getResourceStatus(currentHealth.system_resources.cpu_percent, 'cpu') === 'critical' ? 'bg-red-500' :
                    getResourceStatus(currentHealth.system_resources.cpu_percent, 'cpu') === 'degraded' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(currentHealth.system_resources.cpu_percent, 100)}%` }}
                />
              </div>
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(getResourceStatus(currentHealth.system_resources.memory_percent, 'memory'))}`}>
                  {currentHealth.system_resources.memory_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getResourceStatus(currentHealth.system_resources.memory_percent, 'memory') === 'critical' ? 'bg-red-500' :
                    getResourceStatus(currentHealth.system_resources.memory_percent, 'memory') === 'degraded' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(currentHealth.system_resources.memory_percent, 100)}%` }}
                />
              </div>
            </div>

            {/* Disk Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disk Usage</span>
                <span className={`text-sm font-bold ${getStatusColor(getResourceStatus(currentHealth.system_resources.disk_percent, 'disk'))}`}>
                  {currentHealth.system_resources.disk_percent.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getResourceStatus(currentHealth.system_resources.disk_percent, 'disk') === 'critical' ? 'bg-red-500' :
                    getResourceStatus(currentHealth.system_resources.disk_percent, 'disk') === 'degraded' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(currentHealth.system_resources.disk_percent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Recent Health Checks</h4>
          <div className="text-xs text-gray-500">
            {healthHistory.length} checks recorded
          </div>
        </div>
        
        {healthHistory.length > 0 ? (
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {healthHistory.slice(-5).reverse().map((health, index) => (
              <div key={`${health.api_status}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">{formatTimestamp(lastUpdate || health.uptime_seconds.toString())}</span>
                  <span className={getStatusColor(health.api_status)}>
                    {getStatusIcon(health.api_status)}
                  </span>
                  <span className="text-gray-700">{health.api_status}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {health.active_connections} conn
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No health history available
          </div>
        )}
      </div>

      {/* Footer */}
      {lastUpdate && (
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Last health check: {formatTimestamp(lastUpdate)}
          </div>
        </div>
      )}
    </div>
  );
};