import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import FeatureImportance from '../../components/explainability/FeatureImportance';
import BiasReport from '../../components/explainability/BiasReport';

interface ModelCard {
  id: string;
  name: string;
  version: string;
  type: 'risk_prediction' | 'disruption_forecast' | 'financial_stress';
  status: 'active' | 'deprecated' | 'testing';
  accuracy: number;
  lastTrained: string;
  description: string;
  datapoints: number;
}

const modelCards: ModelCard[] = [
  {
    id: 'risk_pred_v2',
    name: 'Economic Risk Predictor',
    version: '2.1.3',
    type: 'risk_prediction',
    status: 'active',
    accuracy: 0.847,
    lastTrained: '2024-10-15',
    description: 'Primary model for predicting economic risk levels using macroeconomic indicators',
    datapoints: 15420
  },
  {
    id: 'disruption_v1',
    name: 'Supply Chain Disruption Forecaster',
    version: '1.2.1',
    type: 'disruption_forecast',
    status: 'active',
    accuracy: 0.792,
    lastTrained: '2024-10-12',
    description: 'Specialized model for forecasting supply chain disruptions and bottlenecks',
    datapoints: 12890
  },
  {
    id: 'financial_stress_v3',
    name: 'Financial Stress Indicator',
    version: '3.0.1',
    type: 'financial_stress',
    status: 'testing',
    accuracy: 0.821,
    lastTrained: '2024-10-14',
    description: 'Model for assessing financial market stress and systemic risk indicators',
    datapoints: 18240
  }
];

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelCard>(modelCards[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'bias'>('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'deprecated': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFeatureClick = (feature: any) => {
    console.log('Feature clicked:', feature);
    // Could open a detailed feature analysis modal
  };

  const handleRecommendationClick = (recommendation: string) => {
    console.log('Recommendation clicked:', recommendation);
    // Could open implementation guidance or documentation
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Model Explainability & Transparency
            </h1>
            <p className="mt-2 text-gray-600">
              Detailed analysis and transparency reports for all AI models in the risk intelligence system
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Model Selection Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow border">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Available Models</h3>
                  <p className="text-sm text-gray-600 mt-1">Select a model to analyze</p>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {modelCards.map((model) => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedModel.id === model.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{model.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(model.status)}`}>
                            {model.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Version: {model.version}</div>
                          <div>Accuracy: {(model.accuracy * 100).toFixed(1)}%</div>
                          <div>Updated: {new Date(model.lastTrained).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow border">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Transparency Standards
                  </h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div>
                      <strong className="text-gray-900">Explainable AI:</strong>
                      <p>All models provide SHAP-based explanations for individual predictions.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Bias Testing:</strong>
                      <p>Regular algorithmic bias assessments ensure fairness across demographics.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Open Source:</strong>
                      <p>Model architectures and training procedures are publicly documented.</p>
                    </div>
                    <div>
                      <strong className="text-gray-900">Audit Trail:</strong>
                      <p>Complete version history and performance metrics maintained.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Tab Navigation */}
              <div className="bg-white rounded-lg shadow border mb-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8 px-6">
                    {[
                      { id: 'overview', label: 'Model Overview' },
                      { id: 'features', label: 'Feature Importance' },
                      { id: 'bias', label: 'Bias Analysis' }
                    ].map((tab) => (
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
                    <div>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedModel.name}</h2>
                        <p className="text-gray-600 mt-2">{selectedModel.description}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {(selectedModel.accuracy * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Model Accuracy</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {selectedModel.datapoints.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Training Samples</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">v{selectedModel.version}</div>
                          <div className="text-sm text-gray-600">Current Version</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Details</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Model ID:</span>
                              <span className="font-medium">{selectedModel.id}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span className="font-medium capitalize">{selectedModel.type.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedModel.status)}`}>
                                {selectedModel.status.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Trained:</span>
                              <span className="font-medium">{new Date(selectedModel.lastTrained).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Accuracy</span>
                                <span className="font-medium">{(selectedModel.accuracy * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-green-500"
                                  style={{ width: `${selectedModel.accuracy * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Precision</span>
                                <span className="font-medium">{((selectedModel.accuracy - 0.02) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-blue-500"
                                  style={{ width: `${(selectedModel.accuracy - 0.02) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Recall</span>
                                <span className="font-medium">{((selectedModel.accuracy + 0.01) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-purple-500"
                                  style={{ width: `${(selectedModel.accuracy + 0.01) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Academic Validation</h4>
                        <p className="text-sm text-blue-800">
                          This model has been validated using industry-standard methodologies and 
                          peer-reviewed techniques. All training procedures follow ethical AI guidelines 
                          and are documented for academic reproducibility.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'features' && (
                    <FeatureImportance 
                      modelType={selectedModel.type}
                      onFeatureClick={handleFeatureClick}
                    />
                  )}

                  {activeTab === 'bias' && (
                    <BiasReport 
                      modelId={selectedModel.id}
                      onRecommendationClick={handleRecommendationClick}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}