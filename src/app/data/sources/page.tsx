'use client'

import React, { useState } from 'react'

export default function DataSourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const dataSources = [
    {
      id: 'fred',
      name: 'Federal Reserve Economic Data',
      category: 'Economic',
      status: 'active',
      description: 'Economic time series data from the Federal Reserve Bank of St. Louis',
      endpoint: 'https://api.stlouisfed.org/fred',
      lastUpdate: '2024-10-24T08:15:00Z',
      updateFrequency: 'Daily',
      records: 847253,
      series: 765432,
      qualityScore: 98.7,
      uptime: 99.9,
      latency: 245,
      rateLimitUsage: 67,
      documentation: 'https://fred.stlouisfed.org/docs/api',
      contact: 'api@stlouisfed.org'
    },
    {
      id: 'bea',
      name: 'Bureau of Economic Analysis',
      category: 'Economic',
      status: 'active',
      description: 'National, regional, industry, and international economic accounts',
      endpoint: 'https://apps.bea.gov/api',
      lastUpdate: '2024-10-24T08:10:00Z',
      updateFrequency: 'Weekly',
      records: 156432,
      series: 23456,
      qualityScore: 97.8,
      uptime: 99.5,
      latency: 312,
      rateLimitUsage: 45,
      documentation: 'https://apps.bea.gov/API/signup',
      contact: 'webmaster@bea.gov'
    },
    {
      id: 'bls',
      name: 'Bureau of Labor Statistics',
      category: 'Labor',
      status: 'active',
      description: 'Employment, unemployment, wages, and price statistics',
      endpoint: 'https://api.bls.gov/publicAPI',
      lastUpdate: '2024-10-24T08:05:00Z',
      updateFrequency: 'Monthly',
      records: 234567,
      series: 34567,
      qualityScore: 98.2,
      uptime: 99.7,
      latency: 198,
      rateLimitUsage: 23,
      documentation: 'https://www.bls.gov/developers',
      contact: 'blsdata_staff@bls.gov'
    },
    {
      id: 'census',
      name: 'U.S. Census Bureau',
      category: 'Demographics',
      status: 'active',
      description: 'Population, housing, business, and economic census data',
      endpoint: 'https://api.census.gov/data',
      lastUpdate: '2024-10-24T07:45:00Z',
      updateFrequency: 'Monthly',
      records: 89234,
      series: 12345,
      qualityScore: 96.5,
      uptime: 98.8,
      latency: 456,
      rateLimitUsage: 34,
      documentation: 'https://www.census.gov/developers',
      contact: 'census.api@census.gov'
    },
    {
      id: 'cisa',
      name: 'Cybersecurity & Infrastructure Security Agency',
      category: 'Security',
      status: 'warning',
      description: 'Critical infrastructure vulnerability and cybersecurity data',
      endpoint: 'https://api.cisa.gov',
      lastUpdate: '2024-10-24T07:30:00Z',
      updateFrequency: 'Real-time',
      records: 45621,
      series: 8765,
      qualityScore: 95.3,
      uptime: 97.2,
      latency: 789,
      rateLimitUsage: 78,
      documentation: 'https://www.cisa.gov/developer',
      contact: 'vulnerability@cisa.dhs.gov'
    },
    {
      id: 'noaa',
      name: 'National Oceanic and Atmospheric Administration',
      category: 'Environmental',
      status: 'active',
      description: 'Weather, climate, and oceanic data affecting economic conditions',
      endpoint: 'https://api.weather.gov',
      lastUpdate: '2024-10-24T08:00:00Z',
      updateFrequency: 'Hourly',
      records: 123456,
      series: 19876,
      qualityScore: 97.1,
      uptime: 99.1,
      latency: 234,
      rateLimitUsage: 56,
      documentation: 'https://www.weather.gov/documentation/services-web-api',
      contact: 'nws.webmaster@noaa.gov'
    },
    {
      id: 'usgs',
      name: 'U.S. Geological Survey',
      category: 'Environmental',
      status: 'active',
      description: 'Earth science data including geological hazards and natural resources',
      endpoint: 'https://waterservices.usgs.gov',
      lastUpdate: '2024-10-24T07:55:00Z',
      updateFrequency: 'Daily',
      records: 67890,
      series: 15432,
      qualityScore: 96.8,
      uptime: 98.9,
      latency: 345,
      rateLimitUsage: 41,
      documentation: 'https://waterservices.usgs.gov/rest',
      contact: 'gs-w_support_nwisweb@usgs.gov'
    },
    {
      id: 'gdelt',
      name: 'Global Database of Events, Language, and Tone',
      category: 'Events',
      status: 'maintenance',
      description: 'Global events data for geopolitical and economic risk analysis',
      endpoint: 'https://api.gdeltproject.org',
      lastUpdate: '2024-10-24T06:00:00Z',
      updateFrequency: '15 minutes',
      records: 345678,
      series: 45678,
      qualityScore: 94.2,
      uptime: 96.5,
      latency: 567,
      rateLimitUsage: 89,
      documentation: 'https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts',
      contact: 'support@gdeltproject.org'
    }
  ]

  const connectionTests = [
    {
      sourceId: 'fred',
      testType: 'Health Check',
      result: 'success',
      responseTime: 245,
      timestamp: '2024-10-24T08:14:00Z',
      details: 'API responding normally'
    },
    {
      sourceId: 'bea',
      testType: 'Data Retrieval',
      result: 'success',
      responseTime: 312,
      timestamp: '2024-10-24T08:13:00Z',
      details: 'GDP data retrieved successfully'
    },
    {
      sourceId: 'cisa',
      testType: 'Authentication',
      result: 'warning',
      responseTime: 789,
      timestamp: '2024-10-24T08:12:00Z',
      details: 'Slow response times detected'
    },
    {
      sourceId: 'bls',
      testType: 'Rate Limit Check',
      result: 'success',
      responseTime: 198,
      timestamp: '2024-10-24T08:11:00Z',
      details: '23% of rate limit used'
    },
    {
      sourceId: 'gdelt',
      testType: 'Health Check',
      result: 'error',
      responseTime: 0,
      timestamp: '2024-10-24T08:10:00Z',
      details: 'Connection timeout - scheduled maintenance'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const filteredSources = dataSources.filter(source => {
    if (selectedCategory !== 'all' && source.category.toLowerCase() !== selectedCategory) {
      return false
    }
    if (selectedStatus !== 'all' && source.status !== selectedStatus) {
      return false
    }
    return true
  })

  const sortedSources = [...filteredSources].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'quality':
        return b.qualityScore - a.qualityScore
      case 'uptime':
        return b.uptime - a.uptime
      case 'records':
        return b.records - a.records
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Data Sources
          </h1>
          <p className="text-lg text-[#374151]">
            Monitor and manage external data source connections, health, and performance
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Categories</option>
              <option value="economic">Economic</option>
              <option value="labor">Labor</option>
              <option value="demographics">Demographics</option>
              <option value="security">Security</option>
              <option value="environmental">Environmental</option>
              <option value="events">Events</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="maintenance">Maintenance</option>
              <option value="error">Error</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="quality">Sort by Quality</option>
              <option value="uptime">Sort by Uptime</option>
              <option value="records">Sort by Records</option>
            </select>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Test All Connections
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {sortedSources.map((source) => (
              <div key={source.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-[#1e3a8a]">{source.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(source.status)}`}>
                      {source.status}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {source.category}
                    </span>
                  </div>
                  <button className="text-[#1e3a8a] hover:text-blue-800 text-sm font-medium">
                    Test Connection
                  </button>
                </div>
                
                <p className="text-[#374151] mb-4">{source.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#374151]">{formatNumber(source.records)}</div>
                    <div className="text-sm text-gray-500">Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{source.qualityScore}%</div>
                    <div className="text-sm text-gray-500">Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#374151]">{source.uptime}%</div>
                    <div className="text-sm text-gray-500">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#374151]">{source.latency}ms</div>
                    <div className="text-sm text-gray-500">Latency</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Endpoint:</span>
                    <div className="font-mono text-[#374151] break-all">{source.endpoint}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Update Frequency:</span>
                    <div className="font-medium text-[#374151]">{source.updateFrequency}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Update:</span>
                    <div className="font-medium text-[#374151]">{formatTimestamp(source.lastUpdate)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Rate Limit Usage:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            source.rateLimitUsage > 80 ? 'bg-red-500' : 
                            source.rateLimitUsage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${source.rateLimitUsage}%` }}
                        ></div>
                      </div>
                      <span className="text-[#374151] font-medium">{source.rateLimitUsage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex space-x-4 text-sm">
                    <a 
                      href={source.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#1e3a8a] hover:text-blue-800"
                    >
                      Documentation
                    </a>
                    <a 
                      href={`mailto:${source.contact}`}
                      className="text-[#1e3a8a] hover:text-blue-800"
                    >
                      Contact
                    </a>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(source.series)} series available
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Connection Tests</h2>
              <div className="space-y-4">
                {connectionTests.map((test, index) => {
                  const source = dataSources.find(s => s.id === test.sourceId)
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#374151]">{source?.name}</span>
                        <span className={`text-sm font-medium ${getResultColor(test.result)}`}>
                          {test.result}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{test.testType}</div>
                      <div className="text-sm text-gray-500 mb-2">{formatTimestamp(test.timestamp)}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#374151]">{test.details}</span>
                        {test.responseTime > 0 && (
                          <span className="text-sm text-gray-500">{test.responseTime}ms</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="w-full mt-4 bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                Run Full Test Suite
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Source Categories</h2>
              <div className="space-y-3">
                {['Economic', 'Labor', 'Demographics', 'Security', 'Environmental', 'Events'].map((category) => {
                  const count = dataSources.filter(s => s.category === category).length
                  const activeCount = dataSources.filter(s => s.category === category && s.status === 'active').length
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-[#374151]">{category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">{activeCount}</span>
                        <span className="text-sm text-gray-500">/</span>
                        <span className="text-sm text-[#374151]">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Health Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Active Sources</span>
                  <span className="text-sm font-medium text-green-600">
                    {dataSources.filter(s => s.status === 'active').length}/{dataSources.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Average Uptime</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {(dataSources.reduce((sum, s) => sum + s.uptime, 0) / dataSources.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Average Quality</span>
                  <span className="text-sm font-medium text-green-600">
                    {(dataSources.reduce((sum, s) => sum + s.qualityScore, 0) / dataSources.length).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Total Records</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {formatNumber(dataSources.reduce((sum, s) => sum + s.records, 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}