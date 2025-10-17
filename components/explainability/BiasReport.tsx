import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Info, Target } from 'lucide-react';

interface BiasMetric {
  metric: string;
  value: number;
  threshold: number;
  status: 'pass' | 'warning' | 'fail';
  description: string;
  category: 'fairness' | 'representation' | 'accuracy' | 'calibration';
}

interface BiasTestResult {
  testName: string;
  passed: boolean;
  score: number;
  details: string;
  recommendation?: string;
}

interface BiasReportData {
  overallScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastAuditDate: string;
  metrics: BiasMetric[];
  tests: BiasTestResult[];
  datasetInfo: {
    totalSamples: number;
    demographicCoverage: Record<string, number>;
    temporalSpan: string;
  };
}

interface BiasReportProps {
  apiUrl?: string;
  modelId?: string;
  onRecommendationClick?: (recommendation: string) => void;
}

export default function BiasReport({ 
  modelId = 'risk_prediction_v2',
  onRecommendationClick 
}: BiasReportProps) {
  const [biasData, setBiasData] = useState<BiasReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data for demonstration - in production this would come from bias testing API
  const mockBiasData: BiasReportData = {
    overallScore: 8.4,
    riskLevel: 'low',
    lastAuditDate: '2024-10-15',
    metrics: [
      {
        metric: 'Demographic Parity',
        value: 0.92,
        threshold: 0.8,
        status: 'pass',
        description: 'Equal prediction rates across demographic groups',
        category: 'fairness'
      },
      {
        metric: 'Equalized Odds',
        value: 0.89,
        threshold: 0.8,
        status: 'pass',
        description: 'Equal true positive rates across groups',
        category: 'fairness'
      },
      {
        metric: 'Calibration Score',
        value: 0.94,
        threshold: 0.85,
        status: 'pass',
        description: 'Prediction probabilities match actual outcomes',
        category: 'calibration'
      },
      {
        metric: 'Data Representation',
        value: 0.78,
        threshold: 0.8,
        status: 'warning',
        description: 'Coverage of different demographic groups in training data',
        category: 'representation'
      },
      {
        metric: 'Feature Correlation',
        value: 0.85,
        threshold: 0.7,
        status: 'pass',
        description: 'Low correlation between sensitive attributes and features',
        category: 'representation'
      },
      {
        metric: 'Accuracy Parity',
        value: 0.91,
        threshold: 0.8,
        status: 'pass',
        description: 'Similar accuracy across different subgroups',
        category: 'accuracy'
      }
    ],
    tests: [
      {
        testName: 'Disparate Impact Test',
        passed: true,
        score: 0.88,
        details: 'No significant disparate impact detected across demographic groups'
      },
      {
        testName: 'Statistical Parity Test',
        passed: true,
        score: 0.92,
        details: 'Model predictions maintain statistical parity across protected classes'
      },
      {
        testName: 'Individual Fairness Test',
        passed: false,
        score: 0.74,
        details: 'Some individual cases show inconsistent treatment',
        recommendation: 'Implement post-processing calibration to improve individual fairness'
      },
      {
        testName: 'Temporal Stability Test',
        passed: true,
        score: 0.86,
        details: 'Model bias metrics remain stable over time'
      }
    ],
    datasetInfo: {
      totalSamples: 125460,
      demographicCoverage: {
        'Financial Institutions': 0.34,
        'Small Business': 0.28,
        'Large Corporations': 0.22,
        'Government Entities': 0.16
      },
      temporalSpan: '2019-2024'
    }
  };

  useEffect(() => {
    fetchBiasReport();
  }, [modelId]);

  const fetchBiasReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // In production, this would be:
      // const response = await fetch(`${apiUrl}/api/v1/explainability/bias-report?model=${modelId}`);
      // const data = await response.json();
      
      setBiasData(mockBiasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch bias report');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-green-700 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'fail': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'fail': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'high': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredMetrics = selectedCategory === 'all' 
    ? biasData?.metrics || [] 
    : biasData?.metrics.filter(m => m.category === selectedCategory) || [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading bias analysis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !biasData) {
    return (
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertTriangle className="w-6 h-6 mr-2" />
            <span>Error: {error || 'No bias data available'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Algorithmic Bias Assessment
              </h3>
              <p className="text-sm text-gray-600">
                Comprehensive fairness and bias analysis for ethical AI compliance
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{biasData.overallScore}/10</div>
            <div className={`text-sm px-2 py-1 rounded-full ${getRiskLevelColor(biasData.riskLevel)}`}>
              {biasData.riskLevel.toUpperCase()} RISK
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Last Audit:</span>
            <div className="font-medium">{new Date(biasData.lastAuditDate).toLocaleDateString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Training Samples:</span>
            <div className="font-medium">{biasData.datasetInfo.totalSamples.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-500">Temporal Coverage:</span>
            <div className="font-medium">{biasData.datasetInfo.temporalSpan}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="fairness">Fairness Metrics</option>
            <option value="representation">Data Representation</option>
            <option value="accuracy">Accuracy Parity</option>
            <option value="calibration">Model Calibration</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Bias Metrics</h4>
            <div className="space-y-4">
              {filteredMetrics.map((metric) => (
                <div key={metric.metric} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(metric.status)}
                      <h5 className="font-medium text-gray-900">{metric.metric}</h5>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(metric.status)}`}>
                      {metric.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Score: {metric.value.toFixed(2)}</span>
                      <span>Threshold: {metric.threshold.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          metric.status === 'pass' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(metric.value / Math.max(metric.threshold, 1) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Fairness Tests</h4>
            <div className="space-y-4">
              {biasData.tests.map((test) => (
                <div key={test.testName} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {test.passed ? 
                        <CheckCircle className="w-4 h-4 text-green-600" /> :
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      }
                      <h5 className="font-medium text-gray-900">{test.testName}</h5>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      test.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {test.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-sm text-gray-600 mb-1">
                      Score: {test.score.toFixed(2)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${test.passed ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${test.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{test.details}</p>
                  
                  {test.recommendation && (
                    <div 
                      className="text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                      onClick={() => onRecommendationClick?.(test.recommendation!)}
                    >
                      <Target className="w-3 h-3 inline mr-1" />
                      {test.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-4">Dataset Representation</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(biasData.datasetInfo.demographicCoverage).map(([group, percentage]) => (
              <div key={group} className="text-center p-3 border border-gray-200 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">
                  {(percentage * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600">{group}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Ethical AI Compliance</h4>
              <p className="text-sm text-blue-800 mt-1">
                This bias assessment follows industry-standard fairness metrics and testing procedures 
                to ensure the model meets ethical AI guidelines. Regular audits help maintain fairness 
                and transparency in risk prediction decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}