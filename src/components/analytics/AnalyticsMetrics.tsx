'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface MetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  target?: number;
  category: 'performance' | 'accuracy' | 'data_quality' | 'system';
  description: string;
  lastUpdated: string;
}

interface AnalyticsMetricsProps {
  category?: string;
  refreshInterval?: number;
}

export default function AnalyticsMetrics({ 
  category = 'all', 
  refreshInterval = 30000 
}: AnalyticsMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
    
    const interval = setInterval(() => {
      fetchMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      
      const [healthResponse, cacheResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/health`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/cache/metrics`)
      ]);
      
      const [healthData, cacheData] = await Promise.all([
        healthResponse.json(),
        cacheResponse.json()
      ]);
      
      const realMetrics: MetricData[] = [];
      
      if (cacheData.status === 'success' && cacheData.data?.metrics) {
        const cacheMetrics = cacheData.data.metrics;
        
        realMetrics.push({
          id: 'cache-hit-rate',
          name: 'Cache Hit Rate',
          value: cacheMetrics.hit_rate_percent || 0,
          unit: '%',
          change: 0,
          changePercent: 0,
          trend: 'stable',
          status: cacheMetrics.hit_rate_percent >= 80 ? 'good' : 'warning',
          target: 80,
          category: 'performance',
          description: 'Percentage of requests served from cache',
          lastUpdated: new Date().toISOString()
        });
        
        realMetrics.push({
          id: 'cache-requests',
          name: 'Total Requests',
          value: cacheMetrics.total_requests || 0,
          unit: 'req',
          change: 0,
          changePercent: 0,
          trend: 'stable',
          status: 'good',
          category: 'performance',
          description: 'Total number of cache requests',
          lastUpdated: new Date().toISOString()
        });
      }
      
      if (healthData.data?.components) {
        const components = healthData.data.components;
        
        realMetrics.push({
          id: 'system-health',
          name: 'System Health',
          value: components.api === 'operational' ? 100 : 0,
          unit: '%',
          change: 0,
          changePercent: 0,
          trend: 'stable',
          status: components.api === 'operational' ? 'good' : 'critical',
          target: 100,
          category: 'system',
          description: 'Overall API system health status',
          lastUpdated: new Date().toISOString()
        });
        
        realMetrics.push({
          id: 'database-status',
          name: 'Database Status',
          value: components.database === 'operational' ? 100 : 0,
          unit: '%',
          change: 0,
          changePercent: 0,
          trend: 'stable',
          status: components.database === 'operational' ? 'good' : 'critical',
          target: 100,
          category: 'system',
          description: 'Database connection and health status',
          lastUpdated: new Date().toISOString()
        });
      }
      
      if (realMetrics.length === 0) {
        throw new Error('No metrics data available from backend');
      }
      
      setMetrics(realMetrics);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-emerald-700" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-700" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-emerald-700';
      case 'warning': return 'text-amber-700';
      case 'critical': return 'text-red-700';
      default: return 'text-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-700 rotate-180" />;
      default: return <Target className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return BarChart3;
      case 'accuracy': return Target;
      case 'data_quality': return CheckCircle;
      case 'system': return Clock;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'text-blue-700';
      case 'accuracy': return 'text-emerald-700';
      case 'data_quality': return 'text-purple-700';
      case 'system': return 'text-amber-700';
      default: return 'text-slate-500';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms' || unit === 'req/min') {
      return value.toFixed(0);
    }
    return value.toFixed(1);
  };

  const categories = [
    { key: 'all', label: 'All Metrics', count: metrics.length },
    { key: 'performance', label: 'Performance', count: metrics.filter(m => m.category === 'performance').length },
    { key: 'accuracy', label: 'Accuracy', count: metrics.filter(m => m.category === 'accuracy').length },
    { key: 'data_quality', label: 'Data Quality', count: metrics.filter(m => m.category === 'data_quality').length },
    { key: 'system', label: 'System', count: metrics.filter(m => m.category === 'system').length }
  ];

  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(metric => metric.category === selectedCategory);

  if (loading && metrics.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-white rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded border border-slate-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loading && metrics.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Analytics Metrics Available</h3>
          <p>Backend API must be fully functional to display system metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-700" />
          <h2 className="text-xl font-semibold text-slate-900">
            Analytics Metrics Dashboard
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-slate-500 text-xs">Last Refresh</div>
            <div className="text-slate-900 text-sm">
              {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.key);
            const isSelected = selectedCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                  isSelected
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.label}</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-xs">
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => {
          const Icon = getCategoryIcon(metric.category);
          const categoryColor = getCategoryColor(metric.category);
          const statusColor = getStatusColor(metric.status);
          
          return (
            <div
              key={metric.id}
              className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${categoryColor}`} />
                    <span className="text-xs text-slate-500">
                      {metric.category.replace('_', ' ').charAt(0).toUpperCase() + metric.category.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-slate-900 text-sm">
                  {metric.name}
                </h3>

                {/* Value */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-slate-900">
                      {formatValue(metric.value, metric.unit)}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {metric.unit}
                    </span>
                  </div>
                  
                  {/* Change */}
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.change > 0 ? 'text-emerald-700' : 
                    metric.change < 0 ? 'text-red-700' : 
                    'text-slate-500'
                  }`}>
                    <span>
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(2)}
                    </span>
                    <span>
                      ({metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Target vs Actual */}
                {metric.target && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-xs">Target</span>
                      <span className="text-slate-900 text-xs">
                        {metric.target.toFixed(1)}{metric.unit}
                      </span>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'good' ? 'bg-emerald-700' :
                          metric.status === 'warning' ? 'bg-amber-700' :
                          'bg-red-700'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (metric.value / metric.target) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-center">
                      <span className={`text-xs ${statusColor}`}>
                        {metric.value >= metric.target ? 'Target Met' : 'Below Target'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-slate-500 text-xs leading-relaxed">
                  {metric.description}
                </p>

                {/* Last Updated */}
                <div className="text-slate-500 text-xs">
                  Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-4">
          Metrics Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-emerald-700 mb-1">
              {metrics.filter(m => m.status === 'good').length}
            </div>
            <div className="text-slate-500 text-xs">
              Healthy Metrics
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-amber-700 mb-1">
              {metrics.filter(m => m.status === 'warning').length}
            </div>
            <div className="text-slate-500 text-xs">
              Warning Metrics
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-red-700 mb-1">
              {metrics.filter(m => m.status === 'critical').length}
            </div>
            <div className="text-slate-500 text-xs">
              Critical Metrics
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              {metrics.filter(m => m.target && m.value >= m.target).length}
            </div>
            <div className="text-slate-500 text-xs">
              Targets Met
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}