'use client'

import React, { useState } from 'react'

export default function DataLineagePage() {
  const [selectedEntity, setSelectedEntity] = useState('economic_indicators')
  const [viewMode, setViewMode] = useState('graph')
  const [timeframe, setTimeframe] = useState('current')

  const dataEntities = [
    {
      id: 'economic_indicators',
      name: 'Economic Indicators',
      type: 'dataset',
      description: 'Core economic metrics from government sources',
      owner: 'Data Engineering Team',
      classification: 'Public',
      updateFrequency: 'Daily'
    },
    {
      id: 'risk_scores',
      name: 'Risk Assessment Scores',
      type: 'derived_dataset',
      description: 'Calculated risk scores based on multiple factors',
      owner: 'Risk Analytics Team',
      classification: 'Internal',
      updateFrequency: 'Real-time'
    },
    {
      id: 'gdp_series',
      name: 'GDP Time Series',
      type: 'field',
      description: 'Gross Domestic Product historical data',
      owner: 'Economic Analysis Team',
      classification: 'Public',
      updateFrequency: 'Quarterly'
    },
    {
      id: 'unemployment_rate',
      name: 'Unemployment Rate',
      type: 'field',
      description: 'National unemployment percentage',
      owner: 'Labor Statistics Team',
      classification: 'Public',
      updateFrequency: 'Monthly'
    },
    {
      id: 'risk_dashboard',
      name: 'Executive Risk Dashboard',
      type: 'report',
      description: 'Executive summary of risk metrics',
      owner: 'Business Intelligence Team',
      classification: 'Confidential',
      updateFrequency: 'Daily'
    },
    {
      id: 'compliance_report',
      name: 'Regulatory Compliance Report',
      type: 'report',
      description: 'Monthly compliance and audit report',
      owner: 'Compliance Team',
      classification: 'Restricted',
      updateFrequency: 'Monthly'
    }
  ]

  const lineageGraph = {
    'economic_indicators': {
      upstream: [
        {
          id: 'fred_api',
          name: 'FRED API',
          type: 'external_source',
          description: 'Federal Reserve Economic Data API',
          transformations: ['data_ingestion', 'format_standardization'],
          lastUpdate: '2024-10-24T08:15:00Z'
        },
        {
          id: 'bea_api',
          name: 'BEA API',
          type: 'external_source',
          description: 'Bureau of Economic Analysis API',
          transformations: ['data_ingestion', 'unit_conversion'],
          lastUpdate: '2024-10-24T08:10:00Z'
        },
        {
          id: 'bls_api',
          name: 'BLS API',
          type: 'external_source',
          description: 'Bureau of Labor Statistics API',
          transformations: ['data_ingestion', 'seasonal_adjustment'],
          lastUpdate: '2024-10-24T08:05:00Z'
        }
      ],
      downstream: [
        {
          id: 'risk_scores',
          name: 'Risk Assessment Scores',
          type: 'derived_dataset',
          description: 'Calculated using economic indicators as input',
          transformations: ['risk_calculation', 'normalization'],
          impact: 'high'
        },
        {
          id: 'economic_forecast',
          name: 'Economic Forecasting Model',
          type: 'ml_model',
          description: 'Predictive model for economic trends',
          transformations: ['feature_engineering', 'model_training'],
          impact: 'medium'
        },
        {
          id: 'risk_dashboard',
          name: 'Executive Risk Dashboard',
          type: 'report',
          description: 'Executive summary dashboard',
          transformations: ['aggregation', 'visualization'],
          impact: 'high'
        }
      ]
    },
    'risk_scores': {
      upstream: [
        {
          id: 'economic_indicators',
          name: 'Economic Indicators',
          type: 'dataset',
          description: 'Primary economic data source',
          transformations: ['risk_factor_mapping'],
          lastUpdate: '2024-10-24T08:15:00Z'
        },
        {
          id: 'market_data',
          name: 'Financial Market Data',
          type: 'dataset',
          description: 'Stock indices and bond yields',
          transformations: ['volatility_calculation'],
          lastUpdate: '2024-10-24T08:10:00Z'
        },
        {
          id: 'geopolitical_events',
          name: 'Geopolitical Event Data',
          type: 'dataset',
          description: 'Global events affecting markets',
          transformations: ['sentiment_analysis'],
          lastUpdate: '2024-10-24T07:30:00Z'
        }
      ],
      downstream: [
        {
          id: 'risk_alerts',
          name: 'Risk Alert System',
          type: 'application',
          description: 'Automated risk threshold alerts',
          transformations: ['threshold_monitoring'],
          impact: 'critical'
        },
        {
          id: 'portfolio_analysis',
          name: 'Portfolio Risk Analysis',
          type: 'application',
          description: 'Investment portfolio risk assessment',
          transformations: ['portfolio_weighting'],
          impact: 'high'
        },
        {
          id: 'stress_testing',
          name: 'Financial Stress Testing',
          type: 'application',
          description: 'Scenario-based stress testing',
          transformations: ['scenario_simulation'],
          impact: 'medium'
        }
      ]
    }
  }

  const transformationSteps = [
    {
      id: 'data_ingestion',
      name: 'Data Ingestion',
      description: 'Extract data from external API sources',
      type: 'extraction',
      tool: 'Apache Airflow',
      frequency: 'Scheduled',
      status: 'active'
    },
    {
      id: 'format_standardization',
      name: 'Format Standardization',
      description: 'Convert all data to common JSON schema',
      type: 'transformation',
      tool: 'Custom ETL Pipeline',
      frequency: 'Real-time',
      status: 'active'
    },
    {
      id: 'data_validation',
      name: 'Data Validation',
      description: 'Validate data quality and completeness',
      type: 'validation',
      tool: 'Great Expectations',
      frequency: 'Real-time',
      status: 'active'
    },
    {
      id: 'risk_calculation',
      name: 'Risk Score Calculation',
      description: 'Apply risk models to calculate scores',
      type: 'computation',
      tool: 'Python/scikit-learn',
      frequency: 'Real-time',
      status: 'active'
    },
    {
      id: 'aggregation',
      name: 'Data Aggregation',
      description: 'Aggregate data for reporting purposes',
      type: 'aggregation',
      tool: 'PostgreSQL',
      frequency: 'Scheduled',
      status: 'active'
    }
  ]

  const impactAnalysis = [
    {
      source: 'FRED API Outage',
      affectedEntities: ['economic_indicators', 'risk_scores', 'risk_dashboard'],
      impact: 'High',
      description: 'GDP and inflation data unavailable, affecting risk calculations',
      mitigationStrategy: 'Use cached data and alternative sources (BEA)',
      estimatedDowntime: '2-4 hours'
    },
    {
      source: 'Risk Calculation Model Update',
      affectedEntities: ['risk_scores', 'risk_alerts', 'portfolio_analysis'],
      impact: 'Medium',
      description: 'Risk score methodology changes affecting downstream applications',
      mitigationStrategy: 'Gradual rollout with A/B testing',
      estimatedDowntime: 'None (gradual deployment)'
    },
    {
      source: 'Database Schema Change',
      affectedEntities: ['economic_indicators', 'risk_dashboard', 'compliance_report'],
      impact: 'Low',
      description: 'Addition of new fields to economic indicators table',
      mitigationStrategy: 'Backward-compatible schema evolution',
      estimatedDowntime: '< 1 hour maintenance window'
    }
  ]

  const dataQualityMetrics = [
    {
      entity: 'economic_indicators',
      completeness: 98.7,
      accuracy: 97.8,
      timeliness: 99.2,
      consistency: 96.5,
      lastAssessment: '2024-10-24T08:15:00Z'
    },
    {
      entity: 'risk_scores',
      completeness: 99.1,
      accuracy: 98.5,
      timeliness: 99.8,
      consistency: 97.2,
      lastAssessment: '2024-10-24T08:10:00Z'
    },
    {
      entity: 'gdp_series',
      completeness: 97.5,
      accuracy: 99.1,
      timeliness: 95.8,
      consistency: 98.3,
      lastAssessment: '2024-10-24T08:05:00Z'
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'external_source':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'dataset':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'derived_dataset':
        return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'field':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'report':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'application':
        return 'text-indigo-600 bg-indigo-100 border-indigo-200'
      case 'ml_model':
        return 'text-pink-600 bg-pink-100 border-pink-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const selectedEntityData = dataEntities.find(entity => entity.id === selectedEntity)
  const selectedLineage = lineageGraph[selectedEntity as keyof typeof lineageGraph]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Data Lineage
          </h1>
          <p className="text-lg text-[#374151]">
            Track data flow, transformations, and dependencies across the platform
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              {dataEntities.map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
            
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="graph">Graph View</option>
              <option value="table">Table View</option>
              <option value="impact">Impact Analysis</option>
            </select>
            
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="current">Current State</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="historical">Historical View</option>
            </select>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Generate Lineage Report
          </button>
        </div>

        {selectedEntityData && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-[#1e3a8a]">{selectedEntityData.name}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(selectedEntityData.type)}`}>
                  {selectedEntityData.type.replace('_', ' ')}
                </span>
              </div>
              <span className="text-sm text-gray-500">{selectedEntityData.classification}</span>
            </div>
            <p className="text-[#374151] mb-4">{selectedEntityData.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Owner:</span>
                <div className="font-medium text-[#374151]">{selectedEntityData.owner}</div>
              </div>
              <div>
                <span className="text-gray-600">Update Frequency:</span>
                <div className="font-medium text-[#374151]">{selectedEntityData.updateFrequency}</div>
              </div>
              <div>
                <span className="text-gray-600">Classification:</span>
                <div className="font-medium text-[#374151]">{selectedEntityData.classification}</div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'graph' && selectedLineage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Upstream Dependencies</h3>
              <div className="space-y-4">
                {selectedLineage.upstream.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#374151]">{item.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(item.type)}`}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Transformations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.transformations.map((transform, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {transform.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                      {item.lastUpdate && (
                        <div className="text-sm">
                          <span className="text-gray-600">Last Update:</span>
                          <span className="ml-2 text-[#374151]">{formatTimestamp(item.lastUpdate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Downstream Dependencies</h3>
              <div className="space-y-4">
                {selectedLineage.downstream.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#374151]">{item.name}</h4>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(item.type)}`}>
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(item.impact)}`}>
                          {item.impact} impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <div className="text-sm">
                      <span className="text-gray-600">Transformations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.transformations.map((transform, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {transform.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'impact' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-4">Impact Analysis</h3>
            <div className="space-y-4">
              {impactAnalysis.map((analysis, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[#374151]">{analysis.source}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getImpactColor(analysis.impact.toLowerCase())}`}>
                      {analysis.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{analysis.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Affected Entities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {analysis.affectedEntities.map((entity, idx) => (
                          <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {entity.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Estimated Downtime:</span>
                      <div className="text-sm font-medium text-[#374151] mt-1">{analysis.estimatedDowntime}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Mitigation Strategy:</span>
                    <div className="text-sm text-green-600 mt-1">{analysis.mitigationStrategy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Transformation Pipeline</h2>
              <div className="space-y-4">
                {transformationSteps.map((step) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#374151]">{step.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        step.status === 'active' ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <div className="font-medium text-[#374151]">{step.type}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Tool:</span>
                        <div className="font-medium text-[#374151]">{step.tool}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Frequency:</span>
                        <div className="font-medium text-[#374151]">{step.frequency}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Data Quality Metrics</h2>
              <div className="space-y-4">
                {dataQualityMetrics.map((metric) => (
                  <div key={metric.entity} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-[#374151] mb-3">{metric.entity.replace('_', ' ')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{metric.completeness}%</div>
                        <div className="text-sm text-gray-500">Completeness</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{metric.accuracy}%</div>
                        <div className="text-sm text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{metric.timeliness}%</div>
                        <div className="text-sm text-gray-500">Timeliness</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{metric.consistency}%</div>
                        <div className="text-sm text-gray-500">Consistency</div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 text-center">
                      Last assessed: {formatTimestamp(metric.lastAssessment)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Lineage Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Total Entities</span>
                  <span className="text-sm font-medium text-[#374151]">{dataEntities.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Data Sources</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {dataEntities.filter(e => e.type === 'external_source' || e.type === 'dataset').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Derived Datasets</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {dataEntities.filter(e => e.type === 'derived_dataset').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Reports</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {dataEntities.filter(e => e.type === 'report').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Transformations</span>
                  <span className="text-sm font-medium text-[#374151]">{transformationSteps.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Entity Types</h2>
              <div className="space-y-3">
                {['external_source', 'dataset', 'derived_dataset', 'field', 'report', 'application', 'ml_model'].map(type => {
                  const count = dataEntities.filter(e => e.type === type).length
                  if (count === 0) return null
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(type)}`}>
                          {type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#374151]">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Trace Data Flow
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Generate Documentation
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Export Lineage Graph
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Schedule Lineage Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}