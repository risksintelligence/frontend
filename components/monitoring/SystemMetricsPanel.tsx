import React from 'react';
import { Activity, Server, Database, Cpu, HardDrive, Network, Clock, AlertTriangle } from 'lucide-react';
import { SystemMetrics } from '../../hooks/useSystemMonitoring';

interface SystemMetricsPanelProps {
  metrics: SystemMetrics;
  loading?: boolean;
}

export const SystemMetricsPanel: React.FC<SystemMetricsPanelProps> = ({
  metrics,
  loading
}) => {
  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100) / 100}%`;
  };

  const getUsageColor = (percentage: number): string => {
    if (percentage >= 90) return 'text-red-600 bg-red-100 border-red-200';
    if (percentage >= 75) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 90) return <AlertTriangle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading system metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Server className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">System Resources</h3>
              <p className="text-sm text-gray-600">Real-time system resource utilization</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CPU Usage */}
            <div className={`p-4 border rounded-lg ${getUsageColor(metrics.cpu_usage)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5" />
                  <span className="font-medium">CPU Usage</span>
                </div>
                {getStatusIcon(metrics.cpu_usage)}
              </div>
              <div className="text-2xl font-bold">{formatPercentage(metrics.cpu_usage)}</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.cpu_usage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className={`p-4 border rounded-lg ${getUsageColor(metrics.memory_usage)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span className="font-medium">Memory Usage</span>
                </div>
                {getStatusIcon(metrics.memory_usage)}
              </div>
              <div className="text-2xl font-bold">{formatPercentage(metrics.memory_usage)}</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.memory_usage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className={`p-4 border rounded-lg ${getUsageColor(metrics.disk_usage)}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <HardDrive className="w-5 h-5" />
                  <span className="font-medium">Disk Usage</span>
                </div>
                {getStatusIcon(metrics.disk_usage)}
              </div>
              <div className="text-2xl font-bold">{formatPercentage(metrics.disk_usage)}</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.disk_usage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network I/O */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Network I/O</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatBytes(metrics.network_io.bytes_sent)}
              </div>
              <div className="text-sm text-gray-600">Bytes Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatBytes(metrics.network_io.bytes_received)}
              </div>
              <div className="text-sm text-gray-600">Bytes Received</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Metrics */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Database Performance</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {metrics.database.connections}
              </div>
              <div className="text-sm text-gray-600">Active Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.database.query_rate * 100) / 100}
              </div>
              <div className="text-sm text-gray-600">Queries/sec</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.database.response_time * 100) / 100}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Performance */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">Cache Performance</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(metrics.cache.hit_rate)}
              </div>
              <div className="text-sm text-gray-600">Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPercentage(metrics.cache.miss_rate)}
              </div>
              <div className="text-sm text-gray-600">Miss Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatPercentage(metrics.cache.eviction_rate)}
              </div>
              <div className="text-sm text-gray-600">Eviction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Performance */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <h4 className="text-lg font-medium text-gray-900">API Performance</h4>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(metrics.api.requests_per_second * 100) / 100}
              </div>
              <div className="text-sm text-gray-600">Requests/sec</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(metrics.api.average_response_time * 100) / 100}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                metrics.api.error_rate > 5 
                  ? 'text-red-600' 
                  : metrics.api.error_rate > 1 
                    ? 'text-orange-600' 
                    : 'text-green-600'
              }`}>
                {formatPercentage(metrics.api.error_rate)}
              </div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="text-center text-xs text-gray-500">
        Last updated: {new Date(metrics.timestamp).toLocaleString()}
      </div>
    </div>
  );
};