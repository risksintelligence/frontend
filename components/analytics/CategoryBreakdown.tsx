import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity, Download, RefreshCw } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface CategoryBreakdownProps {
  apiUrl?: string;
}

export default function CategoryBreakdown({ apiUrl = 'https://backend-1-il1e.onrender.com' }: CategoryBreakdownProps) {
  const {
    categories,
    indicators,
    loading,
    error,
    fetchCategories,
    fetchIndicators,
    clearError,
    exportData
  } = useAnalytics(apiUrl);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'trend' | 'volatility' | 'count'>('risk');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCategories();
    fetchIndicators();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up': case 'improving': case 'increasing': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': case 'declining': case 'decreasing': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskColor = (riskScore: number): string => {
    if (riskScore < 30) return 'text-green-600 bg-green-50 border-green-200';
    if (riskScore < 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getVolatilityColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const sortedCategories = React.useMemo(() => {
    if (!categories) return [];

    const sorted = [...categories].sort((a, b) => {
      let valueA: number | string = 0;
      let valueB: number | string = 0;

      switch (sortBy) {
        case 'risk':
          valueA = a.avg_risk_score;
          valueB = b.avg_risk_score;
          break;
        case 'count':
          valueA = a.indicator_count;
          valueB = b.indicator_count;
          break;
        case 'trend':
          valueA = a.category_trend;
          valueB = b.category_trend;
          break;
        case 'volatility':
          valueA = a.category_volatility;
          valueB = b.category_volatility;
          break;
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return sortDirection === 'asc' ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
    });

    return sorted;
  }, [categories, sortBy, sortDirection]);

  const filteredIndicators = React.useMemo(() => {
    if (!indicators) return [];
    if (selectedCategory === 'all') return indicators;
    return indicators.filter(ind => ind.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [indicators, selectedCategory]);

  const categoryStats = React.useMemo(() => {
    if (!categories) return null;

    return {
      totalCategories: categories.length,
      totalIndicators: categories.reduce((sum, cat) => sum + cat.indicator_count, 0),
      avgRiskScore: categories.length > 0 
        ? categories.reduce((sum, cat) => sum + cat.avg_risk_score, 0) / categories.length
        : 0,
      highRiskCategories: categories.filter(cat => cat.avg_risk_score >= 60).length,
      improvingCategories: categories.filter(cat => 
        cat.category_trend.toLowerCase().includes('improving') || 
        cat.category_trend.toLowerCase().includes('up')
      ).length
    };
  }, [categories]);

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc');
    }
  };

  const handleRefresh = () => {
    fetchCategories();
    fetchIndicators();
  };

  if (loading && !categories) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading category analysis...</span>
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
              <Activity className="w-5 h-5 text-red-600 mr-3" />
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

      {/* Header and Controls */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary-900">Economic Category Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">
              Detailed breakdown of economic indicators by category
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button
              onClick={() => exportData('csv', 'categories')}
              className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        {categoryStats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{categoryStats.totalCategories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{categoryStats.totalIndicators}</div>
              <div className="text-sm text-gray-600">Total Indicators</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{categoryStats.avgRiskScore.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Risk Score</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{categoryStats.highRiskCategories}</div>
              <div className="text-sm text-gray-600">High Risk</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{categoryStats.improvingCategories}</div>
              <div className="text-sm text-gray-600">Improving</div>
            </div>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          {[
            { key: 'risk', label: 'Risk Score' },
            { key: 'count', label: 'Indicator Count' },
            { key: 'trend', label: 'Trend' },
            { key: 'volatility', label: 'Volatility' }
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleSort(option.key as typeof sortBy)}
              className={`flex items-center px-3 py-1 rounded text-sm ${
                sortBy === option.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {option.label}
              {sortBy === option.key && (
                sortDirection === 'desc' ? 
                  <TrendingDown className="w-3 h-3 ml-1" /> : 
                  <TrendingUp className="w-3 h-3 ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Category Grid */}
      {sortedCategories && sortedCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCategories.map((category) => (
            <div 
              key={category.category_name} 
              className={`card hover:shadow-lg transition-shadow cursor-pointer ${
                selectedCategory === category.category_name ? 'ring-2 ring-primary-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.category_name)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 capitalize">
                  {category.category_name.replace(/_/g, ' ')}
                </h3>
                {getTrendIcon(category.category_trend)}
              </div>

              {/* Risk Score */}
              <div className={`p-3 rounded-lg border mb-4 ${getRiskColor(category.avg_risk_score)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Risk Score</span>
                  <span className="text-lg font-bold">{category.avg_risk_score.toFixed(1)}</span>
                </div>
              </div>

              {/* Category Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Indicators:</span>
                  <span className="font-medium">{category.indicator_count}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Trend:</span>
                  <span className="font-medium capitalize">{category.category_trend}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Volatility:</span>
                  <span className={`font-medium capitalize ${getVolatilityColor(category.category_volatility)}`}>
                    {category.category_volatility}
                  </span>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-500 mb-2">Key Indicators:</div>
                <div className="space-y-1">
                  {category.key_indicators.slice(0, 3).map((indicator, idx) => (
                    <div key={idx} className="text-xs text-gray-700 truncate">
                      • {indicator}
                    </div>
                  ))}
                  {category.key_indicators.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{category.key_indicators.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                Updated: {new Date(category.last_updated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="text-center py-12 text-gray-500">
            No category data available
          </div>
        </div>
      )}

      {/* Detailed Indicators for Selected Category */}
      {selectedCategory !== 'all' && filteredIndicators.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary-900">
                {selectedCategory.replace(/_/g, ' ')} - Detailed Indicators
              </h3>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                View All Categories
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Indicator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mean
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volatility
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIndicators.map((indicator, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {indicator.indicator_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {indicator.current_value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {indicator.mean.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {getTrendIcon(indicator.trend_direction)}
                        <span className="ml-2 capitalize">{indicator.trend_direction}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`capitalize ${getVolatilityColor(indicator.volatility_level)}`}>
                        {indicator.volatility_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {indicator.data_points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}