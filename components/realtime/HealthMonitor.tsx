import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, RefreshCw } from 'lucide-react';
import { useSystemHealth } from '../../hooks/useSystemHealth';

interface HealthMonitorProps {
  apiUrl: string;
  className?: string;
}

export const HealthMonitor: React.FC<HealthMonitorProps> = ({
  apiUrl,
  className = ''
}) => {
  const {
    systemHealth,
    loading,
    error,
    refreshAllHealth
  } = useSystemHealth(apiUrl, {
    refreshInterval: 30000,
    enableRealTimeUpdates: true
  });

  useEffect(() => {
    refreshAllHealth();
  }, [refreshAllHealth]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'unhealthy':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  if (loading && !systemHealth) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Loading health status...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <div className="p-4">
          <div className="flex items-center space-x-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Health Check Failed</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!systemHealth) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
        <div className="p-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">No health data available</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">System Health</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(systemHealth.overall_status)}`}>
              {getStatusIcon(systemHealth.overall_status)}
              <span className="capitalize">{systemHealth.overall_status}</span>
            </div>
            <button
              onClick={refreshAllHealth}
              disabled={loading}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{systemHealth.summary.healthy_services}</div>
            <div className="text-xs text-gray-600">Healthy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{systemHealth.summary.degraded_services}</div>
            <div className="text-xs text-gray-600">Degraded</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{systemHealth.summary.unhealthy_services}</div>
            <div className="text-xs text-gray-600">Unhealthy</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600">{systemHealth.summary.total_services}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-2">
          {systemHealth.checks.slice(0, 5).map((check) => (
            <div
              key={check.service}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(check.status)}
                <span className="text-sm font-medium text-gray-700">{check.service}</span>
              </div>
              <div className="text-xs text-gray-500">
                {check.response_time_ms}ms
              </div>
            </div>
          ))}
          {systemHealth.checks.length > 5 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              +{systemHealth.checks.length - 5} more services
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {new Date(systemHealth.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  );
};