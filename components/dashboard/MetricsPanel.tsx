import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, DollarSign, Briefcase } from 'lucide-react';

interface MetricData {
  factor_name: string;
  category: string;
  current_value: number;
  normalized_risk: number;
  weight: number;
  risk_contribution: number;
  description: string;
  confidence: number;
  risk_level: string;
  explanation: string;
}

interface MetricsResponse {
  factors: MetricData[];
  total_factors: number;
  category_filter: string | null;
  timestamp: string;
}

interface MetricsPanelProps {
  apiUrl?: string;
}

export default function MetricsPanel({ apiUrl = 'http://localhost:8001' }: MetricsPanelProps) {
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: null, name: 'All Categories', icon: BarChart3 },
    { id: 'employment', name: 'Employment', icon: Briefcase },
    { id: 'inflation', name: 'Inflation', icon: TrendingUp },
    { id: 'interest_rates', name: 'Interest Rates', icon: DollarSign },
    { id: 'economic_growth', name: 'Economic Growth', icon: TrendingUp },
    { id: 'financial_stress', name: 'Financial Stress', icon: TrendingDown },
  ];

  useEffect(() => {
    fetchMetrics();
  }, [selectedCategory, apiUrl]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `${apiUrl}/api/v1/risk/factors?category=${selectedCategory}`
        : `${apiUrl}/api/v1/risk/factors`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.status}`);
      }
      
      const data = await response.json();
      setMetricsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      employment: Briefcase,
      inflation: TrendingUp,
      interest_rates: DollarSign,
      economic_growth: TrendingUp,
      financial_stress: TrendingDown,
    };
    
    const IconComponent = categoryMap[category] || BarChart3;
    return <IconComponent className="w-4 h-4" />;
  };

  const getRiskTrendIcon = (contribution: number) => {
    if (contribution > 5) {
      return <TrendingUp className="w-4 h-4 text-red-500" />;
    } else if (contribution > 2) {
      return <TrendingUp className="w-4 h-4 text-amber-500" />;
    } else if (contribution < 1) {
      return <TrendingDown className="w-4 h-4 text-green-500" />;
    } else {
      return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRiskLevelBadge = (level: string) => {
    const colors: { [key: string]: string } = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-amber-100 text-amber-800 border-amber-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      critical: 'bg-red-100 text-red-800 border-red-200',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${colors[level] || colors.low}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const formatMetricValue = (value: number, factorName: string): string => {
    // Format based on the type of metric
    if (factorName.includes('rate') || factorName.includes('growth')) {
      return `${value.toFixed(2)}%`;
    } else if (factorName.includes('index') || factorName.includes('spread')) {
      return value.toFixed(3);
    } else {
      return value.toFixed(2);
    }
  };

  if (loading && !metricsData) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50">
        <p className="text-red-600">Error loading metrics: {error}</p>
        <button
          onClick={fetchMetrics}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="card">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">
          Economic Indicators & Risk Metrics
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <button
                key={category.id || 'all'}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics Grid */}
      {metricsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricsData.factors.map((metric, index) => (
            <div key={index} className="card hover:shadow-professional-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(metric.category)}
                  <h3 className="font-semibold text-primary-900 capitalize">
                    {metric.factor_name.replace(/_/g, ' ')}
                  </h3>
                </div>
                {getRiskLevelBadge(metric.risk_level)}
              </div>

              {/* Current Value */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-900">
                    {formatMetricValue(metric.current_value, metric.factor_name)}
                  </span>
                  {getRiskTrendIcon(metric.risk_contribution)}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {metric.description}
                </p>
              </div>

              {/* Risk Metrics */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Risk Contribution:</span>
                  <span className="font-medium text-primary-900">
                    {metric.risk_contribution.toFixed(2)}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Weight in Model:</span>
                  <span className="font-medium">
                    {(metric.weight * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-medium">
                    {(metric.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Risk Contribution Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Risk Impact</span>
                    <span>{metric.risk_contribution.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        metric.risk_contribution > 5
                          ? 'bg-red-500'
                          : metric.risk_contribution > 2
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min(metric.risk_contribution * 10, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <span className="inline-flex items-center space-x-1 text-xs text-gray-500">
                  {getCategoryIcon(metric.category)}
                  <span className="capitalize">
                    {metric.category.replace(/_/g, ' ')}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Info */}
      {metricsData && (
        <div className="card bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {metricsData.factors.length} of {metricsData.total_factors} indicators
              {selectedCategory && ` in ${selectedCategory.replace(/_/g, ' ')} category`}
            </span>
            <span className="text-gray-500">
              Updated: {new Date(metricsData.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}