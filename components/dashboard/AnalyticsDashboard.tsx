import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, AlertTriangle, CheckCircle, Activity } from 'lucide-react';

interface EconomicOverview {
  overall_risk_level: string;
  economic_momentum: string;
  market_stress_level: string;
  key_concerns: string[];
  positive_signals: string[];
  timestamp: string;
}

interface CategorySummary {
  category_name: string;
  indicator_count: number;
  avg_risk_score: number;
  category_trend: string;
  category_volatility: string;
  key_indicators: string[];
  last_updated: string;
}

interface IndicatorSummary {
  indicator_name: string;
  category: string;
  current_value: number;
  mean: number;
  std_dev: number;
  trend_direction: string;
  volatility_level: string;
  data_points: number;
}

interface AnalyticsData {
  economic_overview: EconomicOverview;
  category_summaries: CategorySummary[];
  indicator_summaries: IndicatorSummary[];
  aggregation_metadata: {
    total_indicators: number;
    categories_analyzed: number;
    timestamp: string;
    data_sources: string[];
  };
}

interface AnalyticsDashboardProps {
  apiUrl?: string;
}

export default function AnalyticsDashboard({ apiUrl = 'http://localhost:8001' }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [apiUrl]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/v1/analytics/aggregation`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

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
      case 'up': case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getVolatilityColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center justify-center py-12">
          <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
          <div>
            <div className="text-red-800 font-medium">Failed to load analytics data</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-500">
          No analytics data available
        </div>
      </div>
    );
  }

  const { economic_overview, category_summaries, aggregation_metadata } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Economic Overview Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary-900">Economic Intelligence Overview</h2>
          <div className="text-sm text-gray-500">
            Updated: {new Date(economic_overview.timestamp).toLocaleString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Overall Risk Level */}
          <div className={`p-4 rounded-lg border ${getRiskLevelColor(economic_overview.overall_risk_level)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-wide">Overall Risk Level</div>
                <div className="text-2xl font-bold capitalize mt-1">{economic_overview.overall_risk_level}</div>
              </div>
              <Activity className="w-8 h-8 opacity-60" />
            </div>
          </div>

          {/* Economic Momentum */}
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">Economic Momentum</div>
                <div className="flex items-center mt-1">
                  {getTrendIcon(economic_overview.economic_momentum)}
                  <span className="text-2xl font-bold capitalize ml-2 text-gray-900">
                    {economic_overview.economic_momentum}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Market Stress Level */}
          <div className={`p-4 rounded-lg border ${getRiskLevelColor(economic_overview.market_stress_level)}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium uppercase tracking-wide">Market Stress</div>
                <div className="text-2xl font-bold capitalize mt-1">{economic_overview.market_stress_level}</div>
              </div>
              <BarChart3 className="w-8 h-8 opacity-60" />
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Key Concerns */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-800">Key Concerns</h3>
            </div>
            <ul className="space-y-2">
              {economic_overview.key_concerns.map((concern, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {concern}
                </li>
              ))}
            </ul>
          </div>

          {/* Positive Signals */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-800">Positive Signals</h3>
            </div>
            <ul className="space-y-2">
              {economic_overview.positive_signals.map((signal, index) => (
                <li key={index} className="text-sm text-green-700 flex items-start">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Category Analysis */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Economic Category Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {category_summaries.map((category) => (
            <div key={category.category_name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 capitalize">
                  {category.category_name.replace('_', ' ')}
                </h4>
                {getTrendIcon(category.category_trend)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Indicators:</span>
                  <span className="font-medium">{category.indicator_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Risk Score:</span>
                  <span className="font-medium">{category.avg_risk_score.toFixed(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volatility:</span>
                  <span className={`font-medium capitalize ${getVolatilityColor(category.category_volatility)}`}>
                    {category.category_volatility}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Key Indicators:</div>
                <div className="text-xs text-gray-700">
                  {category.key_indicators.slice(0, 2).join(', ')}
                  {category.key_indicators.length > 2 && '...'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Metadata */}
      <div className="card bg-gray-50">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{aggregation_metadata.total_indicators}</div>
            <div className="text-sm text-gray-600">Total Indicators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{aggregation_metadata.categories_analyzed}</div>
            <div className="text-sm text-gray-600">Categories Analyzed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">{aggregation_metadata.data_sources.length}</div>
            <div className="text-sm text-gray-600">Data Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">v1.0</div>
            <div className="text-sm text-gray-600">Analytics Engine</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Data Sources: {aggregation_metadata.data_sources.join(', ')} • 
            Last Updated: {new Date(aggregation_metadata.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}