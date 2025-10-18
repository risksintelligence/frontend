import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, RefreshCw, BarChart3, Activity } from 'lucide-react';
import { useRiskFactors, RiskFactor } from '../../hooks/useRiskFactors';

interface FactorAnalysisProps {
  apiUrl: string;
  selectedCategory?: string;
  onFactorSelect?: (factor: RiskFactor) => void;
}

export const FactorAnalysis: React.FC<FactorAnalysisProps> = ({
  apiUrl,
  selectedCategory = 'all',
  onFactorSelect
}) => {
  const { riskFactors, loading, error, fetchRiskFactors, refreshFactor, clearError } = useRiskFactors(apiUrl);
  const [sortBy, setSortBy] = useState<'name' | 'contribution' | 'volatility' | 'alert_level'>('contribution');
  const [refreshingFactors, setRefreshingFactors] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchRiskFactors();
  }, [fetchRiskFactors]);

  const filteredFactors = riskFactors
    .filter(factor => selectedCategory === 'all' || factor.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'contribution':
          return b.contribution_to_risk - a.contribution_to_risk;
        case 'volatility':
          return b.volatility - a.volatility;
        case 'alert_level':
          const alertOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return alertOrder[b.alert_level] - alertOrder[a.alert_level];
        default:
          return 0;
      }
    });

  const handleRefreshFactor = async (factorId: string) => {
    setRefreshingFactors(prev => new Set(prev).add(factorId));
    try {
      await refreshFactor(factorId);
    } catch (err) {
      console.error('Failed to refresh factor:', err);
    } finally {
      setRefreshingFactors(prev => {
        const newSet = new Set(prev);
        newSet.delete(factorId);
        return newSet;
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'financial':
        return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'supply_chain':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'geopolitical':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'environmental':
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-gray-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (loading && riskFactors.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading risk factors...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <div className="text-red-600 mb-2">Error loading risk factors</div>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Risk Factor Analysis</h3>
              <p className="text-sm text-gray-600">
                Individual risk factors contributing to overall risk assessment
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="contribution">Sort by Contribution</option>
              <option value="volatility">Sort by Volatility</option>
              <option value="alert_level">Sort by Alert Level</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={fetchRiskFactors}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredFactors.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No risk factors found</h3>
            <p className="text-gray-600">
              {selectedCategory !== 'all' 
                ? `No factors found in the ${selectedCategory} category`
                : 'No risk factors available'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFactors.map((factor) => (
              <div
                key={factor.id}
                onClick={() => onFactorSelect?.(factor)}
                className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${
                  onFactorSelect ? 'cursor-pointer' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{factor.name}</h4>
                      {getTrendIcon(factor.trend)}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(factor.category)}`}>
                        {factor.category.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full border ${getAlertColor(factor.alert_level)}`}>
                        {factor.alert_level}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Current Value:</span>
                        <div className="font-medium">{formatValue(factor.current_value)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Historical Avg:</span>
                        <div className="font-medium">{formatValue(factor.historical_average)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Volatility:</span>
                        <div className="font-medium">{formatPercentage(factor.volatility)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Contribution:</span>
                        <div className="font-medium">{formatPercentage(factor.contribution_to_risk)}</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Risk Contribution</span>
                        <span>{formatPercentage(factor.contribution_to_risk)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            factor.contribution_to_risk > 0.15 ? 'bg-red-500' :
                            factor.contribution_to_risk > 0.10 ? 'bg-orange-500' :
                            factor.contribution_to_risk > 0.05 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(factor.contribution_to_risk * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <div className="text-xs text-gray-500">
                      {new Date(factor.last_updated).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Source: {factor.data_source}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefreshFactor(factor.id);
                      }}
                      disabled={refreshingFactors.has(factor.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      title="Refresh factor data"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshingFactors.has(factor.id) ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};