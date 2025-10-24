'use client'

import React, { useState } from 'react'

export default function DataManagementPage() {
  const [selectedDataSource, setSelectedDataSource] = useState('all')
  const [timeRange, setTimeRange] = useState('7d')

  const dataSources = [
    {
      id: 'fred',
      name: 'Federal Reserve Economic Data',
      status: 'active',
      lastUpdate: '2024-10-24T08:15:00Z',
      records: 847253,
      quality: 98.7,
      uptime: 99.9,
      type: 'Economic'
    },
    {
      id: 'bea',
      name: 'Bureau of Economic Analysis',
      status: 'active',
      lastUpdate: '2024-10-24T08:10:00Z',
      records: 156432,
      quality: 97.8,
      uptime: 99.5,
      type: 'Economic'
    },
    {
      id: 'bls',
      name: 'Bureau of Labor Statistics',
      status: 'active',
      lastUpdate: '2024-10-24T08:05:00Z',
      records: 234567,
      quality: 98.2,
      uptime: 99.7,
      type: 'Labor'
    },
    {
      id: 'census',
      name: 'U.S. Census Bureau',
      status: 'active',
      lastUpdate: '2024-10-24T07:45:00Z',
      records: 89234,
      quality: 96.5,
      uptime: 98.8,
      type: 'Demographics'
    },
    {
      id: 'cisa',
      name: 'Cybersecurity & Infrastructure',
      status: 'warning',
      lastUpdate: '2024-10-24T07:30:00Z',
      records: 45621,
      quality: 95.3,
      uptime: 97.2,
      type: 'Security'
    },
    {
      id: 'noaa',
      name: 'National Weather Service',
      status: 'active',
      lastUpdate: '2024-10-24T08:00:00Z',
      records: 123456,
      quality: 97.1,
      uptime: 99.1,
      type: 'Environmental'
    }
  ]

  const dataMetrics = {
    totalRecords: 1496563,
    qualityScore: 97.2,
    averageUptime: 99.2,
    activeSources: 6,
    lastFullSync: '2024-10-24T08:15:00Z',
    dailyUpdates: 2847
  }

  const qualityMetrics = [
    {
      category: 'Completeness',
      score: 98.5,
      trend: '+0.3%',
      issues: 'Missing values in 1.5% of records'
    },
    {
      category: 'Accuracy',
      score: 97.8,
      trend: '+0.1%',
      issues: 'Data validation errors in 2.2% of records'
    },
    {
      category: 'Consistency',
      score: 96.4,
      trend: '-0.2%',
      issues: 'Format inconsistencies across sources'
    },
    {
      category: 'Timeliness',
      score: 99.1,
      trend: '+0.5%',
      issues: 'Delayed updates from 2 sources'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'Data Quality Check',
      source: 'FRED Economic Data',
      status: 'completed',
      timestamp: '2024-10-24T08:15:00Z',
      details: 'Quality score improved to 98.7%'
    },
    {
      id: 2,
      action: 'Schema Update',
      source: 'BLS Labor Statistics',
      status: 'completed',
      timestamp: '2024-10-24T08:10:00Z',
      details: 'Updated employment data schema'
    },
    {
      id: 3,
      action: 'Data Export',
      source: 'All Sources',
      status: 'completed',
      timestamp: '2024-10-24T08:05:00Z',
      details: 'Monthly risk assessment export'
    },
    {
      id: 4,
      action: 'Lineage Mapping',
      source: 'Census Bureau',
      status: 'in_progress',
      timestamp: '2024-10-24T08:00:00Z',
      details: 'Updating data flow documentation'
    },
    {
      id: 5,
      action: 'Quality Validation',
      source: 'CISA Infrastructure',
      status: 'warning',
      timestamp: '2024-10-24T07:55:00Z',
      details: 'Found data quality issues requiring attention'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const filteredSources = selectedDataSource === 'all' 
    ? dataSources 
    : dataSources.filter(source => source.type.toLowerCase() === selectedDataSource)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Data Management
          </h1>
          <p className="text-lg text-[#374151]">
            Comprehensive data source monitoring, quality assurance, and lifecycle management
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Records</h3>
            <p className="text-3xl font-bold text-[#374151]">{formatNumber(dataMetrics.totalRecords)}</p>
            <p className="text-sm text-gray-500">Across all sources</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Quality Score</h3>
            <p className="text-3xl font-bold text-green-600">{dataMetrics.qualityScore}%</p>
            <p className="text-sm text-gray-500">Overall data quality</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Average Uptime</h3>
            <p className="text-3xl font-bold text-[#374151]">{dataMetrics.averageUptime}%</p>
            <p className="text-sm text-gray-500">Source availability</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Daily Updates</h3>
            <p className="text-3xl font-bold text-[#374151]">{formatNumber(dataMetrics.dailyUpdates)}</p>
            <p className="text-sm text-gray-500">Records processed today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4 sm:mb-0">Data Sources</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedDataSource}
                    onChange={(e) => setSelectedDataSource(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option value="all">All Sources</option>
                    <option value="economic">Economic</option>
                    <option value="labor">Labor</option>
                    <option value="demographics">Demographics</option>
                    <option value="security">Security</option>
                    <option value="environmental">Environmental</option>
                  </select>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  >
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredSources.map((source) => (
                  <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[#374151]">{source.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {source.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Records:</span>
                        <div className="font-medium text-[#374151]">{formatNumber(source.records)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality:</span>
                        <div className="font-medium text-green-600">{source.quality}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Uptime:</span>
                        <div className="font-medium text-[#374151]">{source.uptime}%</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Update:</span>
                        <div className="font-medium text-gray-500">{formatTimestamp(source.lastUpdate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Data Quality Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {qualityMetrics.map((metric) => (
                  <div key={metric.category} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#374151]">{metric.category}</h3>
                      <span className={`text-sm font-medium ${
                        metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#1e3a8a] mb-2">{metric.score}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-[#1e3a8a] h-2 rounded-full" 
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{metric.issues}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quick Actions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#1e3a8a] hover:bg-blue-50 transition-colors">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="font-medium text-[#374151]">Quality Report</div>
                  <div className="text-sm text-gray-500">Generate report</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#1e3a8a] hover:bg-blue-50 transition-colors">
                  <div className="text-2xl mb-2">🔄</div>
                  <div className="font-medium text-[#374151]">Refresh Data</div>
                  <div className="text-sm text-gray-500">Manual sync</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#1e3a8a] hover:bg-blue-50 transition-colors">
                  <div className="text-2xl mb-2">📤</div>
                  <div className="font-medium text-[#374151]">Export Data</div>
                  <div className="text-sm text-gray-500">Download datasets</div>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#1e3a8a] hover:bg-blue-50 transition-colors">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-medium text-[#374151]">Data Lineage</div>
                  <div className="text-sm text-gray-500">Trace data flow</div>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Recent Activities</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#374151]">{activity.action}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{activity.source}</div>
                    <div className="text-sm text-gray-500 mb-2">{formatTimestamp(activity.timestamp)}</div>
                    <div className="text-sm text-[#374151]">{activity.details}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Data Pipeline Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Ingestion Pipeline</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                    Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Data Validation</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Quality Checks</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Scheduled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Backup Process</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">System Health</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Storage Usage</span>
                  <span className="text-sm font-medium text-[#374151]">73.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '73.2%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">API Rate Limits</span>
                  <span className="text-sm font-medium text-green-600">Normal</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Data Freshness</span>
                  <span className="text-sm font-medium text-green-600">Current</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Processing Load</span>
                  <span className="text-sm font-medium text-[#374151]">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}