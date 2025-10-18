import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity, RefreshCw, BarChart3, Target } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface EconomicOverviewProps {
  apiUrl?: string;
}

export default function EconomicOverview({ apiUrl = 'http://localhost:8000' }: EconomicOverviewProps) {
  const {
    overview,
    health,
    loading,
    error,
    fetchOverview,
    refreshHealth,
    clearError
  } = useAnalytics(apiUrl);

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchOverview();
    refreshHealth();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchOverview({ use_cache: true });
        refreshHealth();
      }, 300000); // 5 minutes

      return () => clearInterval(interval);
    }
    
    return undefined;
  }, [autoRefresh, fetchOverview, refreshHealth]);

  const getRiskLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'elevated': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up': case 'improving': case 'positive': return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'down': case 'declining': case 'negative': return <TrendingDown className="w-6 h-6 text-red-600" />;
      default: return <Activity className="w-6 h-6 text-gray-600" />;
    }
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'operational': case 'available': case 'ready': return 'text-green-600';
      case 'degraded': case 'warning': return 'text-yellow-600';
      case 'error': case 'unavailable': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleRefresh = () => {
    fetchOverview({ force_refresh: true });
    refreshHealth();
  };

  if (loading && !overview) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading economic overview...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <div className="text-red-800 font-medium">{error.message}</div>
                {error.details && (
                  <div className="text-red-600 text-sm mt-1">{error.details}</div>
                )}
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Overview Card */}
      {overview && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-primary-900">Economic Intelligence Overview</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time economic risk assessment and market analysis
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Auto-refresh</span>
                </div>
                
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <div className="text-sm text-gray-500">
                  Updated: {new Date(overview.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Overall Risk Level */}
            <div className={`p-6 rounded-lg border ${getRiskLevelColor(overview.overall_risk_level)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium uppercase tracking-wide mb-2">
                    Overall Risk Level
                  </div>
                  <div className="text-3xl font-bold capitalize">
                    {overview.overall_risk_level}
                  </div>
                </div>
                <Target className="w-10 h-10 opacity-60" />
              </div>
            </div>

            {/* Economic Momentum */}
            <div className="p-6 rounded-lg border border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                    Economic Momentum
                  </div>
                  <div className="flex items-center">
                    {getTrendIcon(overview.economic_momentum)}
                    <span className="text-3xl font-bold capitalize ml-3 text-gray-900">
                      {overview.economic_momentum}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Stress Level */}
            <div className={`p-6 rounded-lg border ${getRiskLevelColor(overview.market_stress_level)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium uppercase tracking-wide mb-2">
                    Market Stress
                  </div>
                  <div className="text-3xl font-bold capitalize">
                    {overview.market_stress_level}
                  </div>
                </div>
                <BarChart3 className="w-10 h-10 opacity-60" />
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key Concerns */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-red-800">Key Economic Concerns</h3>
              </div>
              
              {overview.key_concerns.length > 0 ? (
                <ul className="space-y-3">
                  {overview.key_concerns.map((concern, index) => (
                    <li key={index} className="text-red-700 flex items-start">
                      <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm leading-relaxed">{concern}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-red-600 text-sm italic">No significant concerns identified</p>
              )}
            </div>

            {/* Positive Signals */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-800">Positive Economic Signals</h3>
              </div>
              
              {overview.positive_signals.length > 0 ? (
                <ul className="space-y-3">
                  {overview.positive_signals.map((signal, index) => (
                    <li key={index} className="text-green-700 flex items-start">
                      <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm leading-relaxed">{signal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-600 text-sm italic">No positive signals detected</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* System Health Status */}
      {health && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-primary-900">Analytics System Health</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overall Status */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${getHealthStatusColor(health.status)}`}>
                {health.status.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 mt-1">System Status</div>
            </div>

            {/* Analytics Service */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getHealthStatusColor(health.analytics_service)}`}>
                {health.analytics_service}
              </div>
              <div className="text-sm text-gray-600 mt-1">Analytics Service</div>
            </div>

            {/* Aggregation Engine */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-lg font-semibold ${getHealthStatusColor(health.aggregation_engine)}`}>
                {health.aggregation_engine}
              </div>
              <div className="text-sm text-gray-600 mt-1">Aggregation Engine</div>
            </div>

            {/* Last Aggregation */}
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">
                {new Date(health.last_successful_aggregation).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Last Aggregation</div>
            </div>
          </div>

          {/* Data Sources Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-4">Data Sources Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(health.data_sources).map(([source, status]) => (
                <div key={source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {source.replace('_', ' ')}
                  </span>
                  <span className={`text-sm font-semibold ${getHealthStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {health.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 font-medium">System Error</div>
              <div className="text-red-600 text-sm mt-1">{health.error}</div>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => fetchOverview({ force_refresh: true })}
          disabled={loading}
          className="btn-primary flex items-center justify-center"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Force Data Refresh
        </button>
        
        <button 
          onClick={() => fetchOverview({ use_cache: false })}
          disabled={loading}
          className="btn-secondary flex items-center justify-center"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Bypass Cache
        </button>
        
        <button 
          onClick={refreshHealth}
          className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
        >
          <Activity className="w-4 h-4 mr-2" />
          Check System Health
        </button>
      </div>
    </div>
  );
}