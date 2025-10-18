import React, { useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { useSystemHealth } from '../../hooks/useSystemHealth';
import { Activity, Database, Server, Zap, Globe, AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

const HealthDiagnostics: React.FC = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const {
    loading,
    error,
    systemHealth,
    databaseHealth,
    cacheHealth,
    apiHealth,
    externalDependencies,
    systemDiagnostics,
    refreshAllHealth,
    clearError
  } = useSystemHealth(apiUrl, {
    refreshInterval: 60000,
    enableRealTimeUpdates: true
  });

  useEffect(() => {
    refreshAllHealth();
  }, [refreshAllHealth]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'available':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'unhealthy':
      case 'disconnected':
      case 'unavailable':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'connected':
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4" />;
      case 'unhealthy':
      case 'disconnected':
      case 'unavailable':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatBytes = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value * 100) / 100}%`;
  };

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading health diagnostics</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Health Diagnostics - RiskX</title>
        <meta name="description" content="Comprehensive system health diagnostics and performance monitoring" />
      </Head>

      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Health Diagnostics</h1>
              <p className="text-gray-600">
                Comprehensive health monitoring and diagnostics for all system components
              </p>
            </div>
            <button
              onClick={refreshAllHealth}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Overall System Health */}
          {systemHealth && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">Overall System Health</h3>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border flex items-center space-x-2 ${getStatusColor(systemHealth.overall_status)}`}>
                    {getStatusIcon(systemHealth.overall_status)}
                    <span className="font-medium capitalize">{systemHealth.overall_status}</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{systemHealth.summary.healthy_services}</div>
                    <div className="text-sm text-gray-600">Healthy Services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{systemHealth.summary.degraded_services}</div>
                    <div className="text-sm text-gray-600">Degraded Services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{systemHealth.summary.unhealthy_services}</div>
                    <div className="text-sm text-gray-600">Unhealthy Services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{systemHealth.summary.total_services}</div>
                    <div className="text-sm text-gray-600">Total Services</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {systemHealth.checks.map((check) => (
                    <div key={check.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getStatusColor(check.status)}`}>
                          {getStatusIcon(check.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{check.service}</div>
                          <div className="text-sm text-gray-600">
                            Response: {check.response_time_ms}ms | Last check: {new Date(check.last_checked).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {check.error_message && (
                        <div className="text-sm text-red-600 max-w-xs truncate">{check.error_message}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Database Health */}
            {databaseHealth && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Database className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">Database Health</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg border ${getStatusColor(databaseHealth.connection_status)}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(databaseHealth.connection_status)}
                        <span className="font-medium capitalize">Connection Status: {databaseHealth.connection_status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Connection Pool</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Active:</span>
                          <span className="ml-2 font-medium">{databaseHealth.connection_pool.active_connections}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Idle:</span>
                          <span className="ml-2 font-medium">{databaseHealth.connection_pool.idle_connections}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Max:</span>
                          <span className="ml-2 font-medium">{databaseHealth.connection_pool.max_connections}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilization:</span>
                          <span className="ml-2 font-medium">{formatPercentage(databaseHealth.connection_pool.utilization_percentage)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Query Time:</span>
                          <span className="font-medium">{databaseHealth.query_performance.average_query_time_ms}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Queries/sec:</span>
                          <span className="font-medium">{databaseHealth.query_performance.queries_per_second}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Slow Queries:</span>
                          <span className="font-medium">{databaseHealth.query_performance.slow_queries_count}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Storage</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Database Size:</span>
                          <span className="font-medium">{formatBytes(databaseHealth.storage.database_size_mb * 1024 * 1024)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Free Space:</span>
                          <span className="font-medium">{formatBytes(databaseHealth.storage.free_space_mb * 1024 * 1024)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization:</span>
                          <span className="font-medium">{formatPercentage(databaseHealth.storage.utilization_percentage)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cache Health */}
            {cacheHealth && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">Cache Health</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className={`p-3 rounded-lg border ${getStatusColor(cacheHealth.redis_status)}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(cacheHealth.redis_status)}
                        <span className="font-medium capitalize">Redis Status: {cacheHealth.redis_status}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Memory Usage</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Used Memory:</span>
                          <span className="font-medium">{formatBytes(cacheHealth.memory_usage.used_memory_mb * 1024 * 1024)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Memory:</span>
                          <span className="font-medium">{formatBytes(cacheHealth.memory_usage.max_memory_mb * 1024 * 1024)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization:</span>
                          <span className="font-medium">{formatPercentage(cacheHealth.memory_usage.utilization_percentage)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hit Rate:</span>
                          <span className="font-medium text-green-600">{formatPercentage(cacheHealth.performance.hit_rate_percentage)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Miss Rate:</span>
                          <span className="font-medium text-orange-600">{formatPercentage(cacheHealth.performance.miss_rate_percentage)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ops/sec:</span>
                          <span className="font-medium">{cacheHealth.performance.operations_per_second}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Response:</span>
                          <span className="font-medium">{cacheHealth.performance.average_response_time_ms}ms</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Statistics</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Keys:</span>
                          <span className="font-medium">{cacheHealth.key_statistics.total_keys}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expired Keys:</span>
                          <span className="font-medium">{cacheHealth.key_statistics.expired_keys}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Evicted Keys:</span>
                          <span className="font-medium">{cacheHealth.key_statistics.evicted_keys}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* API Health */}
          {apiHealth && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Server className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">API Health</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{apiHealth.overall_metrics.total_requests}</div>
                    <div className="text-sm text-gray-600">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Math.round(apiHealth.overall_metrics.average_response_time_ms)}ms</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${apiHealth.overall_metrics.error_rate_percentage > 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatPercentage(apiHealth.overall_metrics.error_rate_percentage)}
                    </div>
                    <div className="text-sm text-gray-600">Error Rate</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(apiHealth.endpoint_status).map(([endpoint, status]) => (
                    <div key={endpoint} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg border ${getStatusColor(status.status)}`}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{endpoint}</div>
                          <div className="text-sm text-gray-600">
                            Response: {status.response_time_ms}ms | Success: {formatPercentage(status.success_rate_percentage)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(status.last_checked).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* External Dependencies */}
          {externalDependencies && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900">External Dependencies</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                    <div className="space-y-2">
                      {externalDependencies.data_sources.map((source) => (
                        <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded border ${getStatusColor(source.status)}`}>
                              {getStatusIcon(source.status)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{source.name}</div>
                              <div className="text-xs text-gray-600">{source.url}</div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-900">{source.response_time_ms}ms</div>
                            <div className="text-gray-500">{source.error_count_24h} errors</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Third Party APIs</h4>
                    <div className="space-y-2">
                      {externalDependencies.third_party_apis.map((api) => (
                        <div key={api.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded border ${getStatusColor(api.status)}`}>
                              {getStatusIcon(api.status)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{api.name}</div>
                            </div>
                          </div>
                          <div className="text-right text-sm">
                            <div className="text-gray-900">{api.response_time_ms}ms</div>
                            <div className="text-gray-500">{api.rate_limit_remaining} remaining</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Recommendations */}
          {systemDiagnostics && systemDiagnostics.recommendations.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">System Recommendations</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {systemDiagnostics.recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      rec.severity === 'critical' ? 'border-red-200 bg-red-50' :
                      rec.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded ${
                          rec.severity === 'critical' ? 'text-red-600' :
                          rec.severity === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {rec.severity === 'critical' ? <XCircle className="w-4 h-4" /> :
                           rec.severity === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                           <CheckCircle className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{rec.component}</span>
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                              rec.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              rec.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {rec.severity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{rec.message}</p>
                          <p className="text-sm text-gray-600 font-medium">Suggested Action: {rec.suggested_action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default HealthDiagnostics;