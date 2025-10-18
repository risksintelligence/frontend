import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { SHAPAnalysis } from '../../components/explainability/SHAPAnalysis';
import { ModelTransparency } from '../../components/explainability/ModelTransparency';
import { ModelPerformance } from '../../components/explainability/ModelPerformance';
import FeatureImportance from '../../components/explainability/FeatureImportance';
import BiasReport from '../../components/explainability/BiasReport';
import { useExplainability } from '../../hooks/useExplainability';

const ExplainabilityInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'transparency' | 'performance' | 'bias'>('analysis');
  const [selectedPredictionId, setSelectedPredictionId] = useState<string>('');
  const [predictionIdInput, setPredictionIdInput] = useState<string>('');
  
  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const {
    insights,
    fetchInsights
  } = useExplainability(apiUrl);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  const handleLoadPrediction = () => {
    if (predictionIdInput.trim()) {
      setSelectedPredictionId(predictionIdInput.trim());
    }
  };

  const generateSamplePredictionId = () => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
    const sampleId = `forecast_${timestamp}`;
    setPredictionIdInput(sampleId);
    setSelectedPredictionId(sampleId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature_importance': return '📊';
      case 'bias_detection': return '⚖️';
      case 'model_drift': return '📈';
      case 'performance_alert': return '🚨';
      default: return '💡';
    }
  };

  return (
    <>
      <Head>
        <title>Model Explainability - RiskX</title>
        <meta name="description" content="AI model transparency, interpretability, and bias analysis" />
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Model Explainability & Insights</h1>
            <p className="text-gray-600">
              Comprehensive AI transparency, interpretability analysis, and bias detection for risk prediction models
            </p>
          </div>

          {/* Insights Overview */}
          {insights.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.slice(0, 6).map(insight => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(insight.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTypeIcon(insight.type)}</span>
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {insight.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs">{insight.severity}</span>
                    </div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm mb-2">{insight.description}</p>
                    <div className="text-xs text-gray-600">
                      <div>Model: {insight.model_affected}</div>
                      <div>{new Date(insight.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prediction ID Input */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analyze Specific Prediction</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="predictionId" className="block text-sm font-medium text-gray-700 mb-1">
                  Prediction ID
                </label>
                <input
                  type="text"
                  id="predictionId"
                  value={predictionIdInput}
                  onChange={(e) => setPredictionIdInput(e.target.value)}
                  placeholder="Enter prediction ID (e.g., forecast_20241018_120000)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleLoadPrediction}
                  disabled={!predictionIdInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Load Analysis
                </button>
                <button
                  onClick={generateSamplePredictionId}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Use Sample ID
                </button>
              </div>
            </div>
            {selectedPredictionId && (
              <div className="mt-2 text-sm text-green-600">
                Analyzing prediction: {selectedPredictionId}
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'analysis', label: 'SHAP Analysis', description: 'Feature importance and explanations' },
                  { id: 'transparency', label: 'Model Transparency', description: 'Architecture and training details' },
                  { id: 'performance', label: 'Performance Monitor', description: 'Metrics and drift detection' },
                  { id: 'bias', label: 'Bias Analysis', description: 'Fairness and ethical considerations' }
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
                    <div>{tab.label}</div>
                    <div className="text-xs font-normal text-gray-400">{tab.description}</div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'analysis' && (
                <div className="space-y-6">
                  {selectedPredictionId ? (
                    <SHAPAnalysis
                      predictionId={selectedPredictionId}
                      apiUrl={apiUrl}
                    />
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">📊</div>
                      <h3 className="text-lg font-medium mb-2">No Prediction Selected</h3>
                      <p>Enter a prediction ID above to view detailed SHAP analysis and feature importance.</p>
                    </div>
                  )}
                  
                  {/* Feature Importance Component */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Global Feature Importance</h3>
                    <FeatureImportance />
                  </div>
                </div>
              )}

              {activeTab === 'transparency' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <ModelTransparency
                        modelName="risk_scorer"
                        apiUrl={apiUrl}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <ModelTransparency
                        modelName="economic_predictor"
                        apiUrl={apiUrl}
                      />
                    </div>
                    <div className="lg:col-span-1">
                      <ModelTransparency
                        modelName="supply_chain_analyzer"
                        apiUrl={apiUrl}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <ModelPerformance
                  apiUrl={apiUrl}
                />
              )}

              {activeTab === 'bias' && (
                <div className="space-y-6">
                  <BiasReport />
                  
                  {/* Additional Bias Analysis */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ethical AI Guidelines</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="font-medium text-gray-900">Fairness Principles</h4>
                        <p>Our models are designed to provide equitable risk assessments across all demographic groups.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Transparency Standards</h4>
                        <p>All model decisions can be explained through SHAP values and feature importance analysis.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Continuous Monitoring</h4>
                        <p>Automated bias detection runs daily to ensure ongoing fairness in predictions.</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Human Oversight</h4>
                        <p>Critical decisions require human review and can be appealed through established processes.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-2">📋</div>
                <div className="font-medium">Download Report</div>
                <div className="text-sm text-gray-600">Export analysis as PDF</div>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-medium">Refresh Data</div>
                <div className="text-sm text-gray-600">Update all metrics</div>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-2">⚙️</div>
                <div className="font-medium">Model Settings</div>
                <div className="text-sm text-gray-600">Configure thresholds</div>
              </button>
              <button className="p-4 text-left border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                <div className="text-2xl mb-2">📧</div>
                <div className="font-medium">Alert Setup</div>
                <div className="text-sm text-gray-600">Manage notifications</div>
              </button>
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Understanding Model Explainability</h3>
            <p className="text-blue-800 mb-4">
              Our explainability tools help you understand how AI models make decisions, ensuring transparency and accountability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-900 mb-1">SHAP Analysis</h4>
                <p className="text-blue-700">
                  Shows how each feature contributes to individual predictions using Shapley values from game theory.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Feature Importance</h4>
                <p className="text-blue-700">
                  Ranks features by their global impact on model predictions across all data points.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Bias Detection</h4>
                <p className="text-blue-700">
                  Monitors for unfair treatment of different groups and ensures equitable outcomes.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Model Drift</h4>
                <p className="text-blue-700">
                  Detects when model performance degrades due to changes in data patterns over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ExplainabilityInsights;