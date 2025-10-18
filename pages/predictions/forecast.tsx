import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import ForecastDashboard from '../../components/predictions/ForecastDashboard';
import ForecastChart from '../../components/predictions/ForecastChart';
import { useForecasting } from '../../hooks/useForecasting';
import { TrendingUp, BarChart3, Calendar, AlertTriangle } from 'lucide-react';

export default function ForecastPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chart'>('dashboard');
  
  const {
    forecast,
    scenarios,
    modelStatus,
    loading,
    error
  } = useForecasting(apiUrl);

  const tabs = [
    {
      id: 'dashboard' as const,
      name: 'Forecast Dashboard',
      icon: BarChart3,
      description: 'Interactive forecasting controls and analysis'
    },
    {
      id: 'chart' as const,
      name: 'Visualization',
      icon: TrendingUp,
      description: 'Forecast charts and confidence intervals'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">
                  Risk Forecasting & Prediction
                </h1>
                <p className="mt-2 text-gray-600">
                  Advanced AI-powered risk forecasting with scenario analysis and model transparency
                </p>
              </div>
              
              {/* Status Indicators */}
              <div className="flex items-center space-x-4">
                {modelStatus && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      modelStatus.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-sm text-gray-600">
                      Model {modelStatus.status}
                    </span>
                  </div>
                )}
                
                {forecast && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last updated: {new Date(forecast.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* System-wide Error Display */}
          {error && (
            <div className="mb-6 card border-red-200 bg-red-50">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-medium">Prediction Service Notice</h3>
                  <p className="text-red-700 text-sm mt-1">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-xs mt-2">{error.details}</p>
                  )}
                  {error.retry_suggested && (
                    <p className="text-red-600 text-xs mt-2">
                      This is a temporary issue. Please try refreshing your forecast.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon
                        className={`mr-2 h-5 w-5 ${
                          activeTab === tab.id
                            ? 'text-primary-500'
                            : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            {/* Tab Description */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'dashboard' && (
              <ForecastDashboard apiUrl={apiUrl} />
            )}

            {activeTab === 'chart' && (
              <div className="space-y-6">
                {forecast ? (
                  <>
                    {/* Main Forecast Chart */}
                    <ForecastChart 
                      forecast={forecast}
                      height={500}
                      showConfidenceIntervals={true}
                      showGrid={true}
                    />
                    
                    {/* Additional Chart Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Model Information */}
                      <div className="card">
                        <h3 className="text-lg font-semibold text-primary-900 mb-4">
                          Model Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Model Version:</span>
                            <span className="font-medium">{forecast.model_version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Prediction ID:</span>
                            <span className="font-medium text-xs">{forecast.prediction_id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Horizon:</span>
                            <span className="font-medium">{forecast.horizon_days} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence Level:</span>
                            <span className="font-medium">{(forecast.confidence_level * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Scenario Analysis Summary */}
                      <div className="card">
                        <h3 className="text-lg font-semibold text-primary-900 mb-4">
                          Scenario Analysis
                        </h3>
                        {scenarios.length > 0 ? (
                          <div className="space-y-3">
                            {scenarios.slice(0, 3).map((scenario) => (
                              <div key={scenario.scenario_id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-medium text-sm">{scenario.scenario_name}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      Risk Impact: {scenario.impact_metrics.risk_change > 0 ? '+' : ''}{scenario.impact_metrics.risk_change.toFixed(1)}%
                                    </div>
                                  </div>
                                  <div className={`text-xs px-2 py-1 rounded ${
                                    scenario.impact_metrics.risk_change > 10 ? 'bg-red-100 text-red-700' :
                                    scenario.impact_metrics.risk_change > 0 ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>
                                    {scenario.impact_metrics.risk_change > 10 ? 'High' :
                                     scenario.impact_metrics.risk_change > 0 ? 'Moderate' : 'Low'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No scenario analyses available.
                            Use the Dashboard tab to run scenario analyses.
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card">
                    <div className="text-center py-12">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading forecast data...</p>
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="mt-4 text-gray-600">
                            No forecast data available. Use the Dashboard tab to generate a forecast.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Information */}
          <div className="mt-12 p-6 bg-white border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">About Risk Forecasting</h4>
                <p className="text-gray-600">
                  Our AI-powered forecasting system uses advanced time series analysis and 
                  machine learning to predict economic and financial risk levels with 
                  quantified uncertainty bounds.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Confidence Intervals</h4>
                <p className="text-gray-600">
                  Confidence intervals represent the range of possible outcomes based on 
                  historical patterns and model uncertainty. Higher confidence levels 
                  result in wider intervals.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Scenario Analysis</h4>
                <p className="text-gray-600">
                  Scenario analysis simulates the impact of specific events or conditions 
                  on risk levels, helping understand potential futures and prepare 
                  risk mitigation strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}