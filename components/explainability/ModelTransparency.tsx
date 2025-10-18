import React, { useState, useEffect } from 'react';
import { useExplainability } from '../../hooks/useExplainability';
import { FeatureDistribution } from '../../types/explainability';

interface ModelTransparencyProps {
  modelName: string;
  apiUrl: string;
  className?: string;
}

export const ModelTransparency: React.FC<ModelTransparencyProps> = ({
  modelName,
  apiUrl,
  className = ''
}) => {
  const {
    transparencyReport,
    loading,
    error,
    fetchTransparencyReport,
    clearError
  } = useExplainability(apiUrl);

  const [selectedFeature, setSelectedFeature] = useState<FeatureDistribution | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'performance' | 'ethics'>('overview');

  useEffect(() => {
    if (modelName) {
      fetchTransparencyReport(modelName);
    }
  }, [modelName, fetchTransparencyReport]);

  const getPerformanceColor = (metric: string, value: number) => {
    const thresholds = {
      accuracy: { excellent: 0.9, good: 0.8, poor: 0.7 },
      precision: { excellent: 0.9, good: 0.8, poor: 0.7 },
      recall: { excellent: 0.9, good: 0.8, poor: 0.7 },
      mse: { excellent: 0.1, good: 0.2, poor: 0.3 },
      r_squared: { excellent: 0.8, good: 0.7, poor: 0.6 }
    };

    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'text-gray-600';

    if (metric === 'mse') {
      // Lower is better for MSE
      if (value <= threshold.excellent) return 'text-green-600';
      if (value <= threshold.good) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // Higher is better for other metrics
      if (value >= threshold.excellent) return 'text-green-600';
      if (value >= threshold.good) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getBiasStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100';
      case 'fail': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
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
          <div className="text-red-600 mb-2">Error Loading Transparency Report</div>
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

  if (!transparencyReport) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No transparency report available for this model.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Model Transparency Report</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Model Name</div>
            <div className="font-medium">{transparencyReport.model_name}</div>
          </div>
          <div>
            <div className="text-gray-600">Version</div>
            <div className="font-medium">{transparencyReport.model_version}</div>
          </div>
          <div>
            <div className="text-gray-600">Training Date</div>
            <div className="font-medium">{formatDate(transparencyReport.training_date)}</div>
          </div>
          <div>
            <div className="text-gray-600">Architecture</div>
            <div className="font-medium">{transparencyReport.model_architecture.type}</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'features', label: 'Features' },
            { id: 'performance', label: 'Performance' },
            { id: 'ethics', label: 'Ethics' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Model Architecture */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Model Architecture</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Type</div>
                    <div className="font-medium">{transparencyReport.model_architecture.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Parameters</div>
                    <div className="font-medium">{transparencyReport.model_architecture.parameters.toLocaleString()}</div>
                  </div>
                  {transparencyReport.model_architecture.layers && (
                    <div>
                      <div className="text-gray-600">Layers</div>
                      <div className="font-medium">{transparencyReport.model_architecture.layers}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-gray-600">Training Samples</div>
                    <div className="font-medium">{transparencyReport.training_metrics.training_samples.toLocaleString()}</div>
                  </div>
                </div>
                
                {/* Hyperparameters */}
                <div className="mt-4">
                  <div className="text-gray-600 mb-2">Hyperparameters</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(transparencyReport.model_architecture.hyperparameters).map(([key, value]) => (
                      <div key={key} className="bg-white p-2 rounded border">
                        <div className="text-gray-500">{key.replace(/_/g, ' ')}</div>
                        <div className="font-medium">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Global Feature Importance */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Global Feature Importance</h4>
              <div className="space-y-2">
                {transparencyReport.global_feature_importance.slice(0, 5).map(feature => (
                  <div key={feature.feature} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {feature.rank}
                      </span>
                      <span className="font-medium">{feature.feature.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {(feature.importance * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Feature Distributions</h4>
            
            <div className="grid grid-cols-1 gap-4">
              {transparencyReport.feature_distributions.map(feature => (
                <div
                  key={feature.feature}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedFeature?.feature === feature.feature
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFeature(selectedFeature?.feature === feature.feature ? null : feature)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{feature.feature.replace(/_/g, ' ')}</h5>
                    <span className="text-sm text-gray-500">
                      Mean: {feature.mean_value.toFixed(2)} ± {feature.std_value.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                    <div>Min: <span className="font-medium">{feature.min_value.toFixed(2)}</span></div>
                    <div>25%: <span className="font-medium">{feature.percentiles.p25.toFixed(2)}</span></div>
                    <div>50%: <span className="font-medium">{feature.percentiles.p50.toFixed(2)}</span></div>
                    <div>75%: <span className="font-medium">{feature.percentiles.p75.toFixed(2)}</span></div>
                    <div>Max: <span className="font-medium">{feature.max_value.toFixed(2)}</span></div>
                  </div>

                  {selectedFeature?.feature === feature.feature && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 mb-2">Distribution Statistics</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Mean:</span>
                              <span className="font-medium">{feature.mean_value.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Std Dev:</span>
                              <span className="font-medium">{feature.std_value.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Range:</span>
                              <span className="font-medium">
                                {(feature.max_value - feature.min_value).toFixed(4)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-2">Extended Percentiles</div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>90th:</span>
                              <span className="font-medium">{feature.percentiles.p90.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>95th:</span>
                              <span className="font-medium">{feature.percentiles.p95.toFixed(4)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Training Metrics */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Training Metrics</h4>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(transparencyReport.training_metrics)
                  .filter(([key]) => !['features_count', 'training_samples'].includes(key))
                  .map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-gray-600 mb-1">{key.replace(/_/g, ' ').toUpperCase()}</div>
                      <div className={`text-lg font-bold ${getPerformanceColor(key, value as number)}`}>
                        {typeof value === 'number' ? value.toFixed(3) : value}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Validation Results */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Validation Results</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">CROSS VALIDATION</div>
                  <div className={`text-lg font-bold ${getPerformanceColor('accuracy', transparencyReport.validation_results.cross_validation_score)}`}>
                    {transparencyReport.validation_results.cross_validation_score.toFixed(3)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-sm text-gray-600 mb-1">HOLDOUT TEST</div>
                  <div className={`text-lg font-bold ${getPerformanceColor('accuracy', transparencyReport.validation_results.holdout_test_score)}`}>
                    {transparencyReport.validation_results.holdout_test_score.toFixed(3)}
                  </div>
                </div>
                {transparencyReport.validation_results.temporal_validation_score && (
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">TEMPORAL</div>
                    <div className={`text-lg font-bold ${getPerformanceColor('accuracy', transparencyReport.validation_results.temporal_validation_score)}`}>
                      {transparencyReport.validation_results.temporal_validation_score.toFixed(3)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ethics' && (
          <div className="space-y-6">
            {/* Bias Testing */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Bias Testing Results</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">Fairness Score</div>
                    <div className="text-lg font-bold text-green-600">
                      {transparencyReport.ethical_considerations.bias_testing.fairness_score.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Review Date</div>
                    <div className="font-medium">
                      {formatDate(transparencyReport.ethical_considerations.ethical_review_date)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Demographic Parity</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBiasStatusColor(transparencyReport.ethical_considerations.bias_testing.demographic_parity)}`}>
                      {transparencyReport.ethical_considerations.bias_testing.demographic_parity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Equal Opportunity</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBiasStatusColor(transparencyReport.ethical_considerations.bias_testing.equal_opportunity)}`}>
                      {transparencyReport.ethical_considerations.bias_testing.equal_opportunity}
                    </span>
                  </div>
                </div>

                {transparencyReport.ethical_considerations.bias_testing.potential_biases.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Potential Biases Detected</div>
                    <ul className="text-sm text-red-600 space-y-1">
                      {transparencyReport.ethical_considerations.bias_testing.potential_biases.map((bias, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">⚠</span>
                          {bias}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Fairness Metrics */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Detailed Fairness Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(transparencyReport.ethical_considerations.fairness_metrics).map(([metric, value]) => (
                  <div key={metric} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {metric.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div className={`text-lg font-bold ${Math.abs(value) < 0.05 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {value.toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.abs(value) < 0.05 ? 'Within acceptable range' : 'Monitor closely'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};