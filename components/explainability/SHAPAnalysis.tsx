import React, { useState, useEffect } from 'react';
import { useExplainability } from '../../hooks/useExplainability';
import { FeatureImportance } from '../../types/explainability';

interface SHAPAnalysisProps {
  predictionId: string;
  apiUrl: string;
  className?: string;
}

export const SHAPAnalysis: React.FC<SHAPAnalysisProps> = ({
  predictionId,
  apiUrl,
  className = ''
}) => {
  const {
    explanation,
    loading,
    error,
    fetchExplanation,
    exportExplanation,
    clearError
  } = useExplainability(apiUrl);

  const [selectedFeature, setSelectedFeature] = useState<FeatureImportance | null>(null);
  const [sortBy, setSortBy] = useState<'importance' | 'contribution'>('importance');
  const [showCounterfactuals, setShowCounterfactuals] = useState(false);

  useEffect(() => {
    if (predictionId) {
      fetchExplanation(predictionId);
    }
  }, [predictionId, fetchExplanation]);

  const getImportanceColor = (importance: number) => {
    if (importance >= 0.2) return 'text-red-600 bg-red-100';
    if (importance >= 0.15) return 'text-orange-600 bg-orange-100';
    if (importance >= 0.1) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getContributionColor = (contribution: string) => {
    if (contribution.includes('+')) {
      const value = parseFloat(contribution.replace(/[^\d.-]/g, ''));
      if (value >= 2) return 'text-red-600';
      if (value >= 1) return 'text-orange-600';
      return 'text-yellow-600';
    }
    return 'text-green-600';
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'feasible': return 'text-green-600 bg-green-100';
      case 'possible': return 'text-yellow-600 bg-yellow-100';
      case 'unlikely': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const sortedFeatures = explanation?.feature_importance ? 
    [...explanation.feature_importance].sort((a, b) => {
      if (sortBy === 'importance') {
        return b.importance - a.importance;
      } else {
        const aValue = parseFloat(a.contribution.replace(/[^\d.-]/g, ''));
        const bValue = parseFloat(b.contribution.replace(/[^\d.-]/g, ''));
        return Math.abs(bValue) - Math.abs(aValue);
      }
    }) : [];

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await exportExplanation(predictionId, format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 mb-2">Error Loading Explanation</div>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No explanation data available for this prediction.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">SHAP Analysis</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Export JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Methodology</div>
            <div className="font-medium">{explanation.methodology}</div>
          </div>
          <div>
            <div className="text-gray-600">Explanation Type</div>
            <div className="font-medium capitalize">{explanation.explanation_type}</div>
          </div>
          <div>
            <div className="text-gray-600">Prediction ID</div>
            <div className="font-medium font-mono text-xs">{explanation.prediction_id}</div>
          </div>
        </div>
      </div>

      {/* Feature Importance */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Feature Importance</h4>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'importance' | 'contribution')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="importance">Importance</option>
              <option value="contribution">Contribution</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {sortedFeatures.map((feature, index) => (
            <div
              key={feature.feature}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedFeature?.feature === feature.feature
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedFeature(selectedFeature?.feature === feature.feature ? null : feature)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium text-gray-900">{feature.feature.replace(/_/g, ' ')}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(feature.importance)}`}>
                      {(feature.importance * 100).toFixed(1)}%
                    </span>
                    <span className={`text-sm font-medium ${getContributionColor(feature.contribution)}`}>
                      {feature.contribution}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{feature.interpretation}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Current Value</div>
                  <div className="font-medium">{feature.current_value.toFixed(2)}</div>
                </div>
              </div>

              {/* Importance Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${feature.importance * 100}%` }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedFeature?.feature === feature.feature && (
                <div className="mt-4 p-3 bg-gray-50 rounded border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Feature Value</div>
                      <div className="font-medium">{feature.current_value.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Importance Rank</div>
                      <div className="font-medium">#{index + 1}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-gray-600">Detailed Interpretation</div>
                    <div className="text-sm">{feature.interpretation}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Intervals */}
      {explanation.confidence_intervals && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Confidence Intervals</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-gray-600">Lower Bound</div>
                <div className="text-lg font-bold text-blue-600">
                  {explanation.confidence_intervals.lower_bound.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Upper Bound</div>
                <div className="text-lg font-bold text-blue-600">
                  {explanation.confidence_intervals.upper_bound.toFixed(1)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Confidence Level</div>
                <div className="text-lg font-bold text-blue-600">
                  {(explanation.confidence_intervals.confidence_level * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bias Check */}
      {explanation.bias_check && (
        <div className="p-6 border-b border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Bias Assessment</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fairness Score</span>
                <span className="font-medium">{explanation.bias_check.fairness_score.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Demographic Parity</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  explanation.bias_check.demographic_parity === 'pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {explanation.bias_check.demographic_parity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Equal Opportunity</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  explanation.bias_check.equal_opportunity === 'pass' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {explanation.bias_check.equal_opportunity}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">Potential Biases</div>
              {explanation.bias_check.potential_biases.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {explanation.bias_check.potential_biases.map((bias, index) => (
                    <li key={index} className="text-red-600">{bias}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-green-600">No biases detected</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Counterfactuals */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium text-gray-900">Counterfactual Scenarios</h4>
          <button
            onClick={() => setShowCounterfactuals(!showCounterfactuals)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showCounterfactuals ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showCounterfactuals && explanation.counterfactuals && (
          <div className="space-y-3">
            {explanation.counterfactuals.map((scenario, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{scenario.scenario}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Risk would change by <span className="font-medium">{scenario.risk_change}</span> to{' '}
                      <span className="font-medium">{scenario.new_risk_level}</span> level
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getProbabilityColor(scenario.probability)}`}>
                    {scenario.probability}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Model Limitations */}
      {explanation.model_limitations && (
        <div className="p-6 bg-yellow-50 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-3">Model Limitations</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            {explanation.model_limitations.map((limitation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-600 mr-2">!</span>
                {limitation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};