import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import EconomicOverview from '../../components/analytics/EconomicOverview';
import CategoryBreakdown from '../../components/analytics/CategoryBreakdown';
import { useAnalytics } from '../../hooks/useAnalytics';
import { BarChart3, TrendingUp, Layers, Activity, Download, RefreshCw } from 'lucide-react';

export default function AnalyticsOverviewPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'insights'>('overview');
  
  const {
    overview,
    insights,
    health,
    loading,
    error,
    fetchCompleteAggregation,
    fetchInsights,
    exportData
  } = useAnalytics(apiUrl);

  const tabs = [
    {
      id: 'overview' as const,
      name: 'Economic Overview',
      icon: BarChart3,
      description: 'High-level economic risk assessment and market conditions'
    },
    {
      id: 'categories' as const,
      name: 'Category Analysis',
      icon: Layers,
      description: 'Detailed breakdown by economic categories and indicators'
    },
    {
      id: 'insights' as const,
      name: 'Analytical Insights',
      icon: TrendingUp,
      description: 'Advanced analytics, correlations, and cross-category analysis'
    }
  ];

  const handleCompleteRefresh = () => {
    fetchCompleteAggregation({ force_refresh: true });
    if (activeTab === 'insights') {
      fetchInsights({ use_cache: false });
    }
  };

  const getSystemStatusColor = () => {
    if (!health) return 'gray';
    switch (health.status) {
      case 'healthy': return 'green';
      case 'degraded': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-900">
                  Advanced Economic Analytics
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive economic intelligence with AI-powered risk assessment and trend analysis
                </p>
              </div>
              
              {/* Status and Controls */}
              <div className="flex items-center space-x-4">
                {/* System Status Indicator */}
                {health && (
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full bg-${getSystemStatusColor()}-500`}></div>
                    <span className="text-sm text-gray-600">
                      System {health.status}
                    </span>
                  </div>
                )}
                
                {/* Last Update */}
                {overview && (
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Updated: {new Date(overview.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCompleteRefresh}
                    disabled={loading}
                    className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-200 rounded-lg hover:bg-primary-50"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh All
                  </button>
                  
                  <button
                    onClick={() => {
                      switch (activeTab) {
                        case 'overview':
                          // Export overview data as JSON since it's complex
                          exportData('json', 'overview');
                          break;
                        case 'categories':
                          exportData('csv', 'categories');
                          break;
                        case 'insights':
                          exportData('json', 'insights');
                          break;
                      }
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-200 rounded-lg hover:bg-primary-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Global Error Display */}
          {error && (
            <div className="mb-6 card border-red-200 bg-red-50">
              <div className="flex items-start">
                <Activity className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-800 font-medium">Analytics Service Notice</h3>
                  <p className="text-red-700 text-sm mt-1">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-xs mt-2">{error.details}</p>
                  )}
                  {error.retry_suggested && (
                    <p className="text-red-600 text-xs mt-2">
                      This is a temporary issue. Please try refreshing the data.
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
            {activeTab === 'overview' && (
              <EconomicOverview apiUrl={apiUrl} />
            )}

            {activeTab === 'categories' && (
              <CategoryBreakdown apiUrl={apiUrl} />
            )}

            {activeTab === 'insights' && (
              <div className="space-y-6">
                {insights ? (
                  <>
                    {/* Insights Summary */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="text-lg font-semibold text-primary-900">
                          Analytical Insights Summary
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {insights.insights.statistical_summary && (
                          <>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-primary-600">
                                {insights.insights.statistical_summary.mean_risk_score.toFixed(1)}
                              </div>
                              <div className="text-sm text-gray-600">Mean Risk Score</div>
                            </div>
                            
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-primary-600">
                                {insights.insights.statistical_summary.median_risk_score.toFixed(1)}
                              </div>
                              <div className="text-sm text-gray-600">Median Risk Score</div>
                            </div>
                            
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-primary-600">
                                {insights.insights.statistical_summary.risk_score_std.toFixed(1)}
                              </div>
                              <div className="text-sm text-gray-600">Risk Volatility</div>
                            </div>
                            
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-primary-600">
                                {(insights.insights.statistical_summary.data_quality_score * 100).toFixed(0)}%
                              </div>
                              <div className="text-sm text-gray-600">Data Quality</div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Risk Distribution */}
                      {insights.insights.risk_distribution && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Risk Distribution</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-2xl font-bold text-green-600">
                                {insights.insights.risk_distribution.low_risk_count}
                              </div>
                              <div className="text-sm text-green-700">Low Risk Indicators</div>
                            </div>
                            
                            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="text-2xl font-bold text-yellow-600">
                                {insights.insights.risk_distribution.moderate_risk_count}
                              </div>
                              <div className="text-sm text-yellow-700">Moderate Risk Indicators</div>
                            </div>
                            
                            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="text-2xl font-bold text-red-600">
                                {insights.insights.risk_distribution.high_risk_count}
                              </div>
                              <div className="text-sm text-red-700">High Risk Indicators</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Trend Analysis */}
                      {insights.insights.trend_analysis && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-3">Improving Indicators</h5>
                            <div className="space-y-2">
                              {insights.insights.trend_analysis.improving_indicators.slice(0, 5).map((indicator, idx) => (
                                <div key={idx} className="text-sm text-green-700">
                                  • {indicator}
                                </div>
                              ))}
                              {insights.insights.trend_analysis.improving_indicators.length > 5 && (
                                <div className="text-sm text-green-600 italic">
                                  +{insights.insights.trend_analysis.improving_indicators.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-3">Stable Indicators</h5>
                            <div className="space-y-2">
                              {insights.insights.trend_analysis.stable_indicators.slice(0, 5).map((indicator, idx) => (
                                <div key={idx} className="text-sm text-gray-700">
                                  • {indicator}
                                </div>
                              ))}
                              {insights.insights.trend_analysis.stable_indicators.length > 5 && (
                                <div className="text-sm text-gray-600 italic">
                                  +{insights.insights.trend_analysis.stable_indicators.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <h5 className="font-medium text-red-800 mb-3">Declining Indicators</h5>
                            <div className="space-y-2">
                              {insights.insights.trend_analysis.declining_indicators.slice(0, 5).map((indicator, idx) => (
                                <div key={idx} className="text-sm text-red-700">
                                  • {indicator}
                                </div>
                              ))}
                              {insights.insights.trend_analysis.declining_indicators.length > 5 && (
                                <div className="text-sm text-red-600 italic">
                                  +{insights.insights.trend_analysis.declining_indicators.length - 5} more
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Methodology and Data Sources */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="text-lg font-semibold text-primary-900">Methodology & Data</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Analysis Methodology</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {insights.methodology}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Data Sources</h4>
                          <div className="space-y-2">
                            {insights.data_sources.map((source, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                                {source}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                        Generated: {new Date(insights.generated_at).toLocaleString()}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card">
                    <div className="text-center py-12">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading analytical insights...</p>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="mt-4 text-gray-600">
                            No insights available. Click refresh to generate analytical insights.
                          </p>
                          <button
                            onClick={() => fetchInsights()}
                            className="mt-4 btn-primary"
                          >
                            Generate Insights
                          </button>
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
                <h4 className="font-medium text-gray-900 mb-2">About Economic Analytics</h4>
                <p className="text-gray-600">
                  Our advanced analytics system processes real-time economic data from multiple 
                  authoritative sources to provide comprehensive risk assessment and trend analysis 
                  with AI-powered insights.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Category Analysis</h4>
                <p className="text-gray-600">
                  Economic indicators are grouped into categories for systematic analysis. 
                  Each category includes trend analysis, volatility assessment, and 
                  cross-indicator correlations for comprehensive understanding.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Analytical Insights</h4>
                <p className="text-gray-600">
                  Advanced statistical analysis reveals patterns, correlations, and trends 
                  across economic categories. Insights include risk distribution analysis, 
                  volatility patterns, and predictive indicators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}