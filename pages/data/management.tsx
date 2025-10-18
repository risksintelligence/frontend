import React, { useState } from 'react';
import Layout from '../../components/common/Layout';
import DataSources from '../../components/data/DataSources';
import { useDataManagement } from '../../hooks/useDataManagement';
import { Database, Activity, TrendingUp, BarChart3, Download, RefreshCw } from 'lucide-react';

export default function DataManagementPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';
  const [activeTab, setActiveTab] = useState<'sources' | 'quality' | 'pipeline'>('sources');
  
  const {
    sources,
    quality,
    pipelineStatus,
    loading,
    error,
    fetchQuality,
    fetchPipelineStatus,
    exportData
  } = useDataManagement(apiUrl);

  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const tabs = [
    {
      id: 'sources' as const,
      name: 'Data Sources',
      icon: Database,
      description: 'Explore and manage economic data sources and series'
    },
    {
      id: 'quality' as const,
      name: 'Data Quality',
      icon: BarChart3,
      description: 'Monitor data quality metrics and validation reports'
    },
    {
      id: 'pipeline' as const,
      name: 'Pipeline Status',
      icon: Activity,
      description: 'System health and data pipeline monitoring'
    }
  ];

  const handleSourceSelect = async (source: string) => {
    setSelectedSource(source);
    if (activeTab === 'quality') {
      await fetchQuality(source);
    }
  };

  const handleQualityCheck = async () => {
    if (selectedSource) {
      await fetchQuality(selectedSource);
    }
  };

  const getQualityColor = (score: number): string => {
    if (score >= 0.95) return 'text-green-600';
    if (score >= 0.85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'active': case 'completed': return 'text-green-600';
      case 'degraded': case 'warning': return 'text-yellow-600';
      case 'error': case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
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
                  Data Management & Quality Control
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive data source management, quality monitoring, and pipeline oversight
                </p>
              </div>
              
              {/* Status and Controls */}
              <div className="flex items-center space-x-4">
                {sources && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">
                      {sources.active_sources}/{sources.total_sources} sources active
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      switch (activeTab) {
                        case 'sources':
                          exportData({ source: 'all', format: 'json' });
                          break;
                        case 'quality':
                          if (selectedSource) {
                            exportData({ source: selectedSource, format: 'csv' });
                          }
                          break;
                        case 'pipeline':
                          fetchPipelineStatus();
                          break;
                      }
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-800 border border-primary-200 rounded-lg hover:bg-primary-50"
                  >
                    {activeTab === 'pipeline' ? (
                      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    {activeTab === 'pipeline' ? 'Refresh Status' : 'Export Data'}
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
                  <h3 className="text-red-800 font-medium">Data Service Notice</h3>
                  <p className="text-red-700 text-sm mt-1">{error.message}</p>
                  {error.details && (
                    <p className="text-red-600 text-xs mt-2">{error.details}</p>
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
            {activeTab === 'sources' && (
              <DataSources 
                apiUrl={apiUrl} 
                onSourceSelect={handleSourceSelect}
              />
            )}

            {activeTab === 'quality' && (
              <div className="space-y-6">
                {/* Source Selection for Quality Check */}
                {!selectedSource && sources && (
                  <div className="card">
                    <div className="text-center py-12">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="mt-4 text-gray-600">
                        Select a data source from the Sources tab to view quality metrics
                      </p>
                      <button
                        onClick={() => setActiveTab('sources')}
                        className="mt-4 btn-primary"
                      >
                        Go to Sources
                      </button>
                    </div>
                  </div>
                )}

                {/* Quality Metrics Display */}
                {selectedSource && quality && (
                  <div className="space-y-6">
                    {/* Quality Overview */}
                    <div className="card">
                      <div className="card-header">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-primary-900">
                            Data Quality Assessment - {selectedSource.toUpperCase()}
                          </h3>
                          <button
                            onClick={handleQualityCheck}
                            disabled={loading}
                            className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                        </div>
                      </div>

                      {/* Overall Score */}
                      <div className="text-center mb-6">
                        <div className={`text-6xl font-bold ${getQualityColor(quality.overall_quality_score)}`}>
                          {(quality.overall_quality_score * 100).toFixed(0)}
                        </div>
                        <div className="text-gray-600 text-lg">Overall Quality Score</div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${getGradeColor(quality.quality_grade)}`}>
                          Grade: {quality.quality_grade}
                        </div>
                      </div>

                      {/* Quality Metrics Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getQualityColor(quality.metrics.completeness)}`}>
                            {(quality.metrics.completeness * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Completeness</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getQualityColor(quality.metrics.timeliness)}`}>
                            {(quality.metrics.timeliness * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Timeliness</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getQualityColor(quality.metrics.accuracy)}`}>
                            {(quality.metrics.accuracy * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Accuracy</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getQualityColor(quality.metrics.consistency)}`}>
                            {(quality.metrics.consistency * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Consistency</div>
                        </div>
                      </div>

                      {/* Issues and Recommendations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Data Issues</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Missing Values:</span>
                              <span className={quality.metrics.issues.missing_values > 0.05 ? 'text-red-600' : 'text-green-600'}>
                                {(quality.metrics.issues.missing_values * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Delayed Updates:</span>
                              <span className={quality.metrics.issues.delayed_updates > 0.1 ? 'text-red-600' : 'text-green-600'}>
                                {(quality.metrics.issues.delayed_updates * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Revision Frequency:</span>
                              <span className={quality.metrics.issues.revision_frequency > 0.05 ? 'text-yellow-600' : 'text-green-600'}>
                                {(quality.metrics.issues.revision_frequency * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                          <div className="space-y-2">
                            {quality.recommendations.filter(r => r !== null).length > 0 ? (
                              quality.recommendations
                                .filter(r => r !== null)
                                .map((rec, idx) => (
                                  <div key={idx} className="text-sm text-gray-600 flex items-start">
                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {rec}
                                  </div>
                                ))
                            ) : (
                              <div className="text-sm text-green-600">No issues detected</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSource && !quality && !loading && (
                  <div className="card">
                    <div className="text-center py-12">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="mt-4 text-gray-600">
                        Click "Refresh" to load quality metrics for {selectedSource.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                {pipelineStatus ? (
                  <>
                    {/* Pipeline Overview */}
                    <div className="card">
                      <div className="card-header">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-primary-900">
                            Data Pipeline Status
                          </h3>
                          <button
                            onClick={fetchPipelineStatus}
                            disabled={loading}
                            className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-800"
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                          </button>
                        </div>
                      </div>

                      {/* System Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary-600">
                            {(pipelineStatus.system_metrics.total_series_tracked / 1000).toFixed(0)}K
                          </div>
                          <div className="text-sm text-gray-600">Series Tracked</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {pipelineStatus.system_metrics.active_sources}
                          </div>
                          <div className="text-sm text-gray-600">Active Sources</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {(pipelineStatus.system_metrics.cache_hit_rate * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-600">Cache Hit Rate</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {pipelineStatus.system_metrics.average_api_response_time_ms}ms
                          </div>
                          <div className="text-sm text-gray-600">Avg Response</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {(pipelineStatus.system_metrics.daily_api_calls / 1000).toFixed(0)}K
                          </div>
                          <div className="text-sm text-gray-600">Daily API Calls</div>
                        </div>
                        
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {pipelineStatus.system_metrics.storage_used_gb.toFixed(1)}GB
                          </div>
                          <div className="text-sm text-gray-600">Storage Used</div>
                        </div>
                      </div>

                      {/* Performance Trends */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600">
                            {(pipelineStatus.performance_trends.data_quality_score * 100).toFixed(0)}%
                          </div>
                          <div className="text-sm text-green-700">Data Quality</div>
                        </div>
                        
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">
                            {pipelineStatus.performance_trends.uptime_percentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-blue-700">Uptime</div>
                        </div>
                        
                        <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="text-2xl font-bold text-yellow-600">
                            {(pipelineStatus.performance_trends.error_rate * 100).toFixed(2)}%
                          </div>
                          <div className="text-sm text-yellow-700">Error Rate</div>
                        </div>
                      </div>
                    </div>

                    {/* Data Sources Status */}
                    <div className="card">
                      <div className="card-header">
                        <h3 className="text-lg font-semibold text-primary-900">Data Sources Status</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(pipelineStatus.data_sources).map(([source, status]) => (
                          <div key={source} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{source.toUpperCase()}</h4>
                              <span className={`text-sm font-medium ${getStatusColor(status.status)}`}>
                                {status.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Last: {new Date(status.last_update).toLocaleDateString()}</div>
                              <div>Next: {new Date(status.next_update).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Updates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="card">
                        <div className="card-header">
                          <h3 className="text-lg font-semibold text-primary-900">Recent Updates</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {pipelineStatus.recent_updates.map((update, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{update.source.toUpperCase()}</div>
                                <div className="text-sm text-gray-600">
                                  {update.series_updated} series updated
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-medium ${getStatusColor(update.status)}`}>
                                  {update.status}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(update.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-header">
                          <h3 className="text-lg font-semibold text-primary-900">Upcoming Updates</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {pipelineStatus.upcoming_updates.map((update, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <div className="font-medium text-gray-900">{update.source.toUpperCase()}</div>
                                <div className="text-sm text-gray-600">
                                  {update.expected_series} series expected
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-primary-600">
                                  {update.priority} priority
                                </div>
                                <div className="text-xs text-gray-600">
                                  {new Date(update.scheduled_time).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="card">
                    <div className="text-center py-12">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading pipeline status...</p>
                        </>
                      ) : (
                        <>
                          <Activity className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="mt-4 text-gray-600">
                            Click "Refresh Status" to load pipeline information
                          </p>
                          <button
                            onClick={fetchPipelineStatus}
                            className="mt-4 btn-primary"
                          >
                            Load Pipeline Status
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
                <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                <p className="text-gray-600">
                  Comprehensive management of economic, financial, and supply chain data sources 
                  with real-time monitoring and quality assessment capabilities.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quality Control</h4>
                <p className="text-gray-600">
                  Advanced data quality metrics including completeness, timeliness, accuracy, 
                  and consistency measurements with automated recommendations.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Pipeline Monitoring</h4>
                <p className="text-gray-600">
                  Real-time system health monitoring with performance metrics, update tracking, 
                  and comprehensive status reporting for all data pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}