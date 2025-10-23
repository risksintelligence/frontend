'use client';

import React from 'react';
import { bloombergClasses, formatNumber, formatPercentage } from '@/lib/bloomberg-theme';
import { BarChart3, TrendingUp, Target, AlertCircle } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  description: string;
  category: 'accuracy' | 'precision' | 'recall' | 'other';
}

interface ConfusionMatrix {
  true_positive: number;
  false_positive: number;
  true_negative: number;
  false_negative: number;
}

interface ModelPerformanceProps {
  model_id: string;
  model_name: string;
  metrics: PerformanceMetric[];
  confusion_matrix: ConfusionMatrix;
  roc_auc: number;
  feature_count: number;
  training_samples: number;
  validation_samples: number;
  last_updated: string;
}

export function ModelPerformance({
  model_id,
  model_name,
  metrics,
  confusion_matrix,
  roc_auc,
  feature_count,
  training_samples,
  validation_samples,
  last_updated
}: ModelPerformanceProps) {
  const getPerformanceColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.95) return bloombergClasses.text.success;
    if (ratio >= 0.85) return 'text-yellow-600';
    return bloombergClasses.text.error;
  };

  const getPerformanceStatus = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 0.95) return { label: 'EXCELLENT', color: bloombergClasses.status.success };
    if (ratio >= 0.85) return { label: 'GOOD', color: bloombergClasses.status.warning };
    return { label: 'NEEDS IMPROVEMENT', color: bloombergClasses.status.error };
  };

  const calculateDerivedMetrics = () => {
    const { true_positive, false_positive, true_negative, false_negative } = confusion_matrix;
    const total = true_positive + false_positive + true_negative + false_negative;
    
    return {
      accuracy: (true_positive + true_negative) / total,
      precision: true_positive / (true_positive + false_positive),
      recall: true_positive / (true_positive + false_negative),
      specificity: true_negative / (true_negative + false_positive),
      f1_score: (2 * true_positive) / (2 * true_positive + false_positive + false_negative)
    };
  };

  const derivedMetrics = calculateDerivedMetrics();

  return (
    <div className={`${bloombergClasses.container.primary} space-y-6`}>
      {/* Header */}
      <div className={bloombergClasses.container.secondary}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className={`${bloombergClasses.text.heading} text-2xl mb-2`}>
              Model Performance Analysis
            </h1>
            <p className={`${bloombergClasses.text.secondary} text-sm`}>
              {model_name} (ID: {model_id})
            </p>
          </div>
          <div className="text-right">
            <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
              Last Updated
            </div>
            <div className={`${bloombergClasses.text.primary} text-sm`}>
              {new Date(last_updated).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Model Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            ROC AUC Score
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold mb-1`}>
            {formatNumber(roc_auc, 3)}
          </div>
          <div className={getPerformanceColor(roc_auc, 0.8)}>
            {getPerformanceStatus(roc_auc, 0.8).label}
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Feature Count
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold mb-1`}>
            {feature_count.toLocaleString()}
          </div>
          <div className={`${bloombergClasses.text.secondary} text-sm`}>
            Input Variables
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Training Samples
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold mb-1`}>
            {training_samples.toLocaleString()}
          </div>
          <div className={`${bloombergClasses.text.secondary} text-sm`}>
            Data Points
          </div>
        </div>
        
        <div className={bloombergClasses.container.card}>
          <div className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider mb-1`}>
            Validation Samples
          </div>
          <div className={`${bloombergClasses.text.primary} text-lg font-bold mb-1`}>
            {validation_samples.toLocaleString()}
          </div>
          <div className={`${bloombergClasses.text.secondary} text-sm`}>
            Test Set
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={bloombergClasses.container.secondary}>
        <h2 className={`${bloombergClasses.text.heading} text-lg mb-4 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5" />
          Performance Metrics
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metrics Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${bloombergClasses.border.primary} border-b`}>
                  <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-left py-2`}>
                    Metric
                  </th>
                  <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-right py-2`}>
                    Value
                  </th>
                  <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-right py-2`}>
                    Target
                  </th>
                  <th className={`${bloombergClasses.text.muted} text-xs uppercase tracking-wider text-center py-2`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => {
                  const status = getPerformanceStatus(metric.value, metric.target);
                  return (
                    <tr 
                      key={metric.name}
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
                    >
                      <td className={`${bloombergClasses.text.primary} py-3 px-2`}>
                        <div>
                          <div className="font-medium">{metric.name}</div>
                          <div className={`${bloombergClasses.text.muted} text-xs`}>
                            {metric.description}
                          </div>
                        </div>
                      </td>
                      <td className={`${bloombergClasses.text.primary} text-right py-3 px-2 font-bold`}>
                        {formatPercentage(metric.value * 100)}
                      </td>
                      <td className={`${bloombergClasses.text.secondary} text-right py-3 px-2`}>
                        {formatPercentage(metric.target * 100)}
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={status.color}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Derived Metrics */}
          <div className="space-y-4">
            <h3 className={`${bloombergClasses.text.heading} text-base mb-3`}>
              Calculated Metrics
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={bloombergClasses.text.secondary}>Accuracy</span>
                <span className={`${bloombergClasses.text.primary} font-bold`}>
                  {formatPercentage(derivedMetrics.accuracy * 100)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={bloombergClasses.text.secondary}>Precision</span>
                <span className={`${bloombergClasses.text.primary} font-bold`}>
                  {formatPercentage(derivedMetrics.precision * 100)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={bloombergClasses.text.secondary}>Recall (Sensitivity)</span>
                <span className={`${bloombergClasses.text.primary} font-bold`}>
                  {formatPercentage(derivedMetrics.recall * 100)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={bloombergClasses.text.secondary}>Specificity</span>
                <span className={`${bloombergClasses.text.primary} font-bold`}>
                  {formatPercentage(derivedMetrics.specificity * 100)}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={bloombergClasses.text.secondary}>F1 Score</span>
                <span className={`${bloombergClasses.text.primary} font-bold`}>
                  {formatPercentage(derivedMetrics.f1_score * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className={bloombergClasses.container.secondary}>
        <h2 className={`${bloombergClasses.text.heading} text-lg mb-4 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Confusion Matrix
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matrix Visualization */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div></div>
              <div className={`${bloombergClasses.text.muted} text-sm font-semibold`}>Predicted Positive</div>
              <div className={`${bloombergClasses.text.muted} text-sm font-semibold`}>Predicted Negative</div>
              
              <div className={`${bloombergClasses.text.muted} text-sm font-semibold`}>Actual Positive</div>
              <div className="bg-green-100 border border-green-200 p-4 rounded">
                <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
                  {confusion_matrix.true_positive.toLocaleString()}
                </div>
                <div className="text-green-600 text-xs">True Positive</div>
              </div>
              <div className="bg-red-100 border border-red-200 p-4 rounded">
                <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
                  {confusion_matrix.false_negative.toLocaleString()}
                </div>
                <div className="text-red-600 text-xs">False Negative</div>
              </div>
              
              <div className={`${bloombergClasses.text.muted} text-sm font-semibold`}>Actual Negative</div>
              <div className="bg-red-100 border border-red-200 p-4 rounded">
                <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
                  {confusion_matrix.false_positive.toLocaleString()}
                </div>
                <div className="text-red-600 text-xs">False Positive</div>
              </div>
              <div className="bg-green-100 border border-green-200 p-4 rounded">
                <div className={`${bloombergClasses.text.primary} text-lg font-bold`}>
                  {confusion_matrix.true_negative.toLocaleString()}
                </div>
                <div className="text-green-600 text-xs">True Negative</div>
              </div>
            </div>
          </div>

          {/* Matrix Analysis */}
          <div className="space-y-4">
            <h3 className={`${bloombergClasses.text.heading} text-base mb-3`}>
              Matrix Analysis
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className={`${bloombergClasses.text.secondary} p-3 bg-slate-50 rounded-lg`}>
                <strong className={bloombergClasses.text.primary}>True Positives:</strong> Correctly identified positive cases
              </div>
              <div className={`${bloombergClasses.text.secondary} p-3 bg-slate-50 rounded-lg`}>
                <strong className={bloombergClasses.text.primary}>True Negatives:</strong> Correctly identified negative cases
              </div>
              <div className={`${bloombergClasses.text.secondary} p-3 bg-slate-50 rounded-lg`}>
                <strong className={bloombergClasses.text.primary}>False Positives:</strong> Incorrectly identified as positive (Type I Error)
              </div>
              <div className={`${bloombergClasses.text.secondary} p-3 bg-slate-50 rounded-lg`}>
                <strong className={bloombergClasses.text.primary}>False Negatives:</strong> Incorrectly identified as negative (Type II Error)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className={bloombergClasses.container.secondary}>
        <h2 className={`${bloombergClasses.text.heading} text-lg mb-4 flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5" />
          Performance Insights
        </h2>
        
        <div className="space-y-3">
          {roc_auc >= 0.9 && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className={`${bloombergClasses.text.primary} font-semibold`}>
                  Excellent Model Performance
                </div>
                <div className={`${bloombergClasses.text.secondary} text-sm`}>
                  ROC AUC score of {formatNumber(roc_auc, 3)} indicates outstanding predictive capability.
                </div>
              </div>
            </div>
          )}
          
          {derivedMetrics.precision < 0.8 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className={`${bloombergClasses.text.primary} font-semibold`}>
                  Precision Improvement Needed
                </div>
                <div className={`${bloombergClasses.text.secondary} text-sm`}>
                  Current precision of {formatPercentage(derivedMetrics.precision * 100)} may result in too many false positives.
                </div>
              </div>
            </div>
          )}
          
          {derivedMetrics.recall < 0.8 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <div className={`${bloombergClasses.text.primary} font-semibold`}>
                  Recall Enhancement Required
                </div>
                <div className={`${bloombergClasses.text.secondary} text-sm`}>
                  Current recall of {formatPercentage(derivedMetrics.recall * 100)} indicates the model may miss important positive cases.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}