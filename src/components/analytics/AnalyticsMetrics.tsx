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
      // In production, fetch from API
      // const response = await fetch('/api/v1/analytics/metrics');
      // const data = await response.json();
      
      // Sample analytics metrics
      const sampleMetrics: MetricData[] = [
        {
          id: 'model-accuracy',
          name: 'Overall Model Accuracy',
          value: 94.2,
          unit: '%',
          change: 1.8,
          changePercent: 1.9,
          trend: 'up',
          status: 'good',
          target: 90,
          category: 'accuracy',
          description: 'Average prediction accuracy across all models',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'prediction-precision',
          name: 'Prediction Precision',
          value: 91.7,
          unit: '%',
          change: 0.3,
          changePercent: 0.3,
          trend: 'up',
          status: 'good',
          target: 85,
          category: 'accuracy',
          description: 'Precision of predictions (true positives / total predictions)',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'prediction-recall',
          name: 'Prediction Recall',
          value: 89.1,
          unit: '%',
          change: -0.5,
          changePercent: -0.6,
          trend: 'down',
          status: 'warning',
          target: 90,
          category: 'accuracy',
          description: 'Recall of predictions (true positives / actual positives)',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'f1-score',
          name: 'F1 Score',
          value: 90.4,
          unit: '%',
          change: -0.1,
          changePercent: -0.1,
          trend: 'stable',
          status: 'good',
          target: 85,
          category: 'accuracy',
          description: 'Harmonic mean of precision and recall',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'response-time',
          name: 'Avg Response Time',
          value: 127,
          unit: 'ms',
          change: -15,
          changePercent: -10.6,
          trend: 'down',
          status: 'good',
          target: 200,
          category: 'performance',
          description: 'Average API response time',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'cache-hit-rate',
          name: 'Cache Hit Rate',
          value: 96.8,
          unit: '%',
          change: 1.2,
          changePercent: 1.3,
          trend: 'up',
          status: 'good',
          target: 95,
          category: 'performance',
          description: 'Percentage of requests served from cache',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'throughput',
          name: 'Request Throughput',
          value: 1247,
          unit: 'req/min',
          change: 83,
          changePercent: 7.1,
          trend: 'up',
          status: 'good',
          target: 1000,
          category: 'performance',
          description: 'Number of requests processed per minute',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'data-freshness',
          name: 'Data Freshness',
          value: 98.5,
          unit: '%',
          change: -0.3,
          changePercent: -0.3,
          trend: 'down',
          status: 'good',
          target: 95,
          category: 'data_quality',
          description: 'Percentage of data updated within SLA',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'data-completeness',
          name: 'Data Completeness',
          value: 99.2,
          unit: '%',
          change: 0.1,
          changePercent: 0.1,
          trend: 'up',
          status: 'good',
          target: 98,
          category: 'data_quality',
          description: 'Percentage of expected data points available',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'data-accuracy',
          name: 'Data Accuracy',
          value: 97.8,
          unit: '%',
          change: -0.7,
          changePercent: -0.7,
          trend: 'down',
          status: 'warning',
          target: 98,
          category: 'data_quality',
          description: 'Percentage of data passing validation checks',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'system-uptime',
          name: 'System Uptime',
          value: 99.97,
          unit: '%',
          change: 0.02,
          changePercent: 0.02,
          trend: 'up',
          status: 'good',
          target: 99.9,
          category: 'system',
          description: 'System availability over the last 30 days',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'error-rate',
          name: 'Error Rate',
          value: 0.15,
          unit: '%',
          change: 0.02,
          changePercent: 15.4,
          trend: 'up',
          status: 'warning',
          target: 0.1,
          category: 'system',
          description: 'Percentage of requests resulting in errors',
          lastUpdated: new Date().toISOString()
        }
      ];
      
      setMetrics(sampleMetrics);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-terminal-green" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-terminal-orange" />;
      case 'critical': return <AlertTriangle className="w-4 h-4 text-terminal-red" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-terminal-green';
      case 'warning': return 'text-terminal-orange';
      case 'critical': return 'text-terminal-red';
      default: return 'text-terminal-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-terminal-green" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-terminal-red rotate-180" />;
      default: return <Target className="w-4 h-4 text-terminal-muted" />;
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
      case 'performance': return 'text-terminal-blue';
      case 'accuracy': return 'text-terminal-green';
      case 'data_quality': return 'text-terminal-purple';
      case 'system': return 'text-terminal-orange';
      default: return 'text-terminal-muted';
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
          <div className="h-6 bg-terminal-bg rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-terminal-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-terminal-blue" />
          <h2 className="text-xl font-mono font-semibold text-terminal-text">
            ANALYTICS METRICS DASHBOARD
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-terminal-muted font-mono text-xs">LAST REFRESH</div>
            <div className="text-terminal-text font-mono text-sm">
              {lastRefresh.toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="px-3 py-1 text-xs font-mono rounded bg-terminal-bg border border-terminal-border hover:bg-terminal-surface transition-colors disabled:opacity-50"
          >
            {loading ? 'REFRESHING...' : 'REFRESH'}
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
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
                    ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/30'
                    : 'text-terminal-muted hover:text-terminal-text hover:bg-terminal-bg border border-terminal-border'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-mono text-sm">{category.label}</span>
                <span className="bg-terminal-bg px-2 py-1 rounded text-xs font-mono">
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
              className="bg-terminal-surface border border-terminal-border p-4 rounded hover:bg-terminal-surface/80 transition-colors"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${categoryColor}`} />
                    <span className="font-mono text-xs text-terminal-muted">
                      {metric.category.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(metric.status)}
                    {getTrendIcon(metric.trend)}
                  </div>
                </div>

                {/* Name */}
                <h3 className="font-mono font-semibold text-terminal-text text-sm">
                  {metric.name.toUpperCase()}
                </h3>

                {/* Value */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-mono font-bold text-terminal-text">
                      {formatValue(metric.value, metric.unit)}
                    </span>
                    <span className="text-terminal-muted font-mono text-xs">
                      {metric.unit}
                    </span>
                  </div>
                  
                  {/* Change */}
                  <div className={`flex items-center gap-1 text-sm font-mono ${
                    metric.change > 0 ? 'text-terminal-green' : 
                    metric.change < 0 ? 'text-terminal-red' : 
                    'text-terminal-muted'
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
                      <span className="text-terminal-muted font-mono text-xs">TARGET</span>
                      <span className="text-terminal-text font-mono text-xs">
                        {metric.target.toFixed(1)}{metric.unit}
                      </span>
                    </div>
                    
                    <div className="w-full bg-terminal-bg rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}
                        style={{ 
                          width: `${Math.min(100, (metric.value / metric.target) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="text-center">
                      <span className={`font-mono text-xs ${statusColor}`}>
                        {metric.value >= metric.target ? 'TARGET MET' : 'BELOW TARGET'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-terminal-muted font-mono text-xs leading-relaxed">
                  {metric.description}
                </p>

                {/* Last Updated */}
                <div className="text-terminal-muted font-mono text-xs">
                  Updated: {new Date(metric.lastUpdated).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <h3 className="font-mono font-semibold text-terminal-text mb-4">
          METRICS SUMMARY
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-green mb-1">
              {metrics.filter(m => m.status === 'good').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              HEALTHY METRICS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-orange mb-1">
              {metrics.filter(m => m.status === 'warning').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              WARNING METRICS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-red mb-1">
              {metrics.filter(m => m.status === 'critical').length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              CRITICAL METRICS
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-terminal-text mb-1">
              {metrics.filter(m => m.target && m.value >= m.target).length}
            </div>
            <div className="text-terminal-muted font-mono text-xs">
              TARGETS MET
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}