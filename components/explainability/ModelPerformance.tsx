import React, { useState, useEffect } from 'react';
import { useExplainability } from '../../hooks/useExplainability';
import { PerformanceTrend } from '../../types/explainability';

interface ModelPerformanceProps {
  apiUrl: string;
  className?: string;
}

export const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  apiUrl,
  className = ''
}) => {
  const {
    modelStatus,
    performanceTrends,
    driftDetection,
    loading,
    error,
    fetchModelStatus,
    fetchPerformanceTrends,
    checkModelDrift,
    clearError
  } = useExplainability(apiUrl);

  const [selectedModel, setSelectedModel] = useState<string>('risk_scorer');
  const [trendPeriod, setTrendPeriod] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'status' | 'trends' | 'drift'>('status');

  useEffect(() => {
    fetchModelStatus();
  }, [fetchModelStatus]);

  useEffect(() => {
    if (selectedModel) {
      fetchPerformanceTrends(selectedModel, trendPeriod);
      checkModelDrift(selectedModel);
    }
  }, [selectedModel, trendPeriod, fetchPerformanceTrends, checkModelDrift]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'operational': case 'healthy': case 'connected': 
        return 'text-green-600 bg-green-100';
      case 'degraded': case 'inactive': 
        return 'text-yellow-600 bg-yellow-100';
      case 'error': case 'offline': case 'disconnected': 
        return 'text-red-600 bg-red-100';
      default: 
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricTrend = (data: PerformanceTrend[], metric: keyof PerformanceTrend) => {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-5);
    const values = recent.map(d => Number(d[metric]));
    const slope = values.reduce((acc, val, idx) => {
      if (idx === 0) return 0;
      return acc + (val - values[idx - 1]);
    }, 0) / (values.length - 1);
    
    if (Math.abs(slope) < 0.01) return 'stable';
    return slope > 0 ? 'increasing' : 'decreasing';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗';
      case 'decreasing': return '↘';
      default: return '→';
    }
  };

  const getTrendColor = (trend: string, isGoodWhenIncreasing: boolean = true) => {
    if (trend === 'stable') return 'text-gray-600';
    if (isGoodWhenIncreasing) {
      return trend === 'increasing' ? 'text-green-600' : 'text-red-600';
    } else {
      return trend === 'increasing' ? 'text-red-600' : 'text-green-600';
    }
  };

  const formatMetric = (value: number, type: string) => {
    if (type === 'percentage') return `${(value * 100).toFixed(1)}%`;
    if (type === 'count') return value.toLocaleString();
    if (type === 'time') return `${value.toFixed(0)}ms`;
    return value.toFixed(3);
  };

  const getDriftSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading && !modelStatus) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
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
          <div className="text-red-600 mb-2">Error Loading Model Performance</div>
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

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Model Performance Monitor</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="risk_scorer">Risk Scorer</option>
              <option value="economic_predictor">Economic Predictor</option>
              <option value="supply_chain_analyzer">Supply Chain Analyzer</option>
            </select>
            <select
              value={trendPeriod}
              onChange={(e) => setTrendPeriod(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value={7}>7 days</option>
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>

        {/* System Status Overview */}
        {modelStatus && (
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">System Status</div>
              <div className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(modelStatus.system_status.prediction_service)}`}>
                {modelStatus.system_status.prediction_service}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Active Models</div>
              <div className="font-medium">{modelStatus.system_status.active_models}</div>
            </div>
            <div>
              <div className="text-gray-600">Predictions Today</div>
              <div className="font-medium">{modelStatus.system_status.total_predictions_today}</div>
            </div>
            <div>
              <div className="text-gray-600">Avg Response Time</div>
              <div className="font-medium">{modelStatus.system_status.avg_response_time_ms}ms</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'status', label: 'Status' },
            { id: 'trends', label: 'Trends' },
            { id: 'drift', label: 'Drift Detection' }
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
        {activeTab === 'status' && modelStatus && (
          <div className="space-y-6">
            {/* Current Model Details */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">
                {selectedModel.replace(/_/g, ' ')} Status
              </h4>
              
              {(() => {
                const model = modelStatus.models[selectedModel as keyof typeof modelStatus.models];
                if (!model) return null;
                
                return (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Status</div>
                      <div className={`font-medium px-2 py-1 rounded text-xs ${getStatusColor(model.status)}`}>
                        {model.status}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Version</div>
                      <div className="font-medium">{model.version}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Last Trained</div>
                      <div className="font-medium text-xs">
                        {new Date(model.last_trained).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Performance Metrics</h4>
              
              {(() => {
                const model = modelStatus.models[selectedModel as keyof typeof modelStatus.models];
                if (!model) return null;
                
                const metrics = [
                  { key: 'accuracy', label: 'Accuracy', type: 'percentage', value: model.accuracy },
                  { key: 'precision', label: 'Precision', type: 'percentage', value: model.precision },
                  { key: 'recall', label: 'Recall', type: 'percentage', value: model.recall },
                  { key: 'mse', label: 'MSE', type: 'decimal', value: model.mse },
                  { key: 'mae', label: 'MAE', type: 'decimal', value: model.mae },
                  { key: 'r_squared', label: 'R²', type: 'decimal', value: model.r_squared },
                  { key: 'auc_roc', label: 'AUC-ROC', type: 'decimal', value: model.auc_roc }
                ].filter(metric => metric.value !== undefined);
                
                return (
                  <div className="grid grid-cols-4 gap-4">
                    {metrics.map(metric => {
                      const trend = getMetricTrend(performanceTrends, metric.key as keyof PerformanceTrend);
                      const isGoodWhenIncreasing = !['mse', 'mae'].includes(metric.key);
                      
                      return (
                        <div key={metric.key} className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                          <div className="text-lg font-bold text-gray-900">
                            {formatMetric(metric.value!, metric.type)}
                          </div>
                          <div className={`text-xs mt-1 ${getTrendColor(trend, isGoodWhenIncreasing)}`}>
                            {getTrendIcon(trend)} {trend}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Training Info */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Training Information</h4>
              
              {(() => {
                const model = modelStatus.models[selectedModel as keyof typeof modelStatus.models];
                if (!model) return null;
                
                return (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Features Count</div>
                      <div className="text-lg font-bold">{model.features_count}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Training Samples</div>
                      <div className="text-lg font-bold">{model.training_samples.toLocaleString()}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-900">Performance Trends ({trendPeriod} days)</h4>
            
            {performanceTrends.length > 0 ? (
              <div className="space-y-4">
                {/* Trends Summary */}
                <div className="grid grid-cols-4 gap-4">
                  {['accuracy', 'precision', 'recall', 'f1_score'].map(metric => {
                    const trend = getMetricTrend(performanceTrends, metric as keyof PerformanceTrend);
                    const latest = performanceTrends[performanceTrends.length - 1];
                    const value = latest[metric as keyof PerformanceTrend] as number;
                    
                    return (
                      <div key={metric} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-gray-600 mb-1">{metric.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-lg font-bold">{formatMetric(value, 'percentage')}</div>
                        <div className={`text-xs mt-1 ${getTrendColor(trend)}`}>
                          {getTrendIcon(trend)} {trend}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Simple Trend Chart */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Accuracy Trend</h5>
                  <div className="h-32 flex items-end space-x-1">
                    {performanceTrends.slice(-20).map((trend, index) => {
                      const height = (trend.accuracy * 100);
                      return (
                        <div
                          key={index}
                          className="bg-blue-600 rounded-t flex-1 min-h-1"
                          style={{ height: `${height}%` }}
                          title={`${trend.date}: ${formatMetric(trend.accuracy, 'percentage')}`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{performanceTrends[Math.max(0, performanceTrends.length - 20)]?.date}</span>
                    <span>{performanceTrends[performanceTrends.length - 1]?.date}</span>
                  </div>
                </div>

                {/* Predictions Volume */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Daily Predictions Volume</h5>
                  <div className="h-32 flex items-end space-x-1">
                    {performanceTrends.slice(-20).map((trend, index) => {
                      const maxPredictions = Math.max(...performanceTrends.map(t => t.predictions_count));
                      const height = (trend.predictions_count / maxPredictions) * 100;
                      return (
                        <div
                          key={index}
                          className="bg-green-600 rounded-t flex-1 min-h-1"
                          style={{ height: `${height}%` }}
                          title={`${trend.date}: ${trend.predictions_count} predictions`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Volume</span>
                    <span>Avg: {performanceTrends.length > 0 ? Math.round(performanceTrends.reduce((acc, t) => acc + t.predictions_count, 0) / performanceTrends.length) : 0}/day</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No performance trend data available for the selected period.
              </div>
            )}
          </div>
        )}

        {activeTab === 'drift' && (
          <div className="space-y-6">
            <h4 className="text-md font-medium text-gray-900">Model Drift Detection</h4>
            
            {driftDetection ? (
              <div className="space-y-4">
                {/* Drift Status */}
                <div className={`p-4 rounded-lg border ${
                  driftDetection.drift_detected 
                    ? 'border-orange-200 bg-orange-50' 
                    : 'border-green-200 bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">
                      {driftDetection.drift_detected ? 'Drift Detected' : 'No Drift Detected'}
                    </h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDriftSeverityColor(driftDetection.severity)}`}>
                      {driftDetection.severity} risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{driftDetection.recommendation}</p>
                </div>

                {/* Drift Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Drift Score</div>
                    <div className={`text-lg font-bold ${
                      driftDetection.drift_score >= driftDetection.drift_threshold ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {driftDetection.drift_score.toFixed(3)}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Threshold</div>
                    <div className="text-lg font-bold">{driftDetection.drift_threshold.toFixed(3)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-600 mb-1">Detection Date</div>
                    <div className="text-sm font-medium">
                      {new Date(driftDetection.detection_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Affected Features */}
                {driftDetection.affected_features.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Affected Features</h5>
                    <div className="flex flex-wrap gap-2">
                      {driftDetection.affected_features.map(feature => (
                        <span key={feature} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                          {feature.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drift Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Drift Score vs Threshold</span>
                    <span>{((driftDetection.drift_score / driftDetection.drift_threshold) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        driftDetection.drift_score >= driftDetection.drift_threshold ? 'bg-red-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((driftDetection.drift_score / driftDetection.drift_threshold) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No drift detection data available for this model.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};