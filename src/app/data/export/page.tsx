'use client'

import React, { useState } from 'react'

export default function DataExportPage() {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState('csv')
  const [dateRange, setDateRange] = useState('7d')
  const [compressionType, setCompressionType] = useState('zip')
  const [includeMetadata, setIncludeMetadata] = useState(true)

  const availableDatasets = [
    {
      id: 'economic_indicators',
      name: 'Economic Indicators',
      source: 'FRED, BEA, BLS',
      description: 'Core economic metrics including GDP, inflation, employment',
      records: 847253,
      size: '125.4 MB',
      lastUpdate: '2024-10-24T08:15:00Z',
      category: 'Economic'
    },
    {
      id: 'risk_scores',
      name: 'Risk Assessment Scores',
      source: 'RiskX Platform',
      description: 'Calculated risk scores and factor weights',
      records: 234567,
      size: '78.9 MB',
      lastUpdate: '2024-10-24T08:10:00Z',
      category: 'Risk'
    },
    {
      id: 'market_data',
      name: 'Financial Market Data',
      source: 'Multiple Sources',
      description: 'Stock indices, bond yields, currency exchange rates',
      records: 456789,
      size: '156.7 MB',
      lastUpdate: '2024-10-24T08:05:00Z',
      category: 'Financial'
    },
    {
      id: 'employment_stats',
      name: 'Employment Statistics',
      source: 'BLS',
      description: 'Unemployment rates, job openings, wage data',
      records: 123456,
      size: '45.3 MB',
      lastUpdate: '2024-10-24T08:00:00Z',
      category: 'Labor'
    },
    {
      id: 'demographic_data',
      name: 'Demographic Data',
      source: 'Census Bureau',
      description: 'Population, housing, and socioeconomic indicators',
      records: 89234,
      size: '34.2 MB',
      lastUpdate: '2024-10-24T07:45:00Z',
      category: 'Demographics'
    },
    {
      id: 'security_threats',
      name: 'Security Threat Intelligence',
      source: 'CISA',
      description: 'Cybersecurity threats and infrastructure vulnerabilities',
      records: 45621,
      size: '23.8 MB',
      lastUpdate: '2024-10-24T07:30:00Z',
      category: 'Security'
    },
    {
      id: 'environmental_data',
      name: 'Environmental Indicators',
      source: 'NOAA, USGS',
      description: 'Weather patterns, climate data, natural disaster events',
      records: 234567,
      size: '89.5 MB',
      lastUpdate: '2024-10-24T08:00:00Z',
      category: 'Environmental'
    },
    {
      id: 'network_analysis',
      name: 'Network Analysis Data',
      source: 'RiskX Platform',
      description: 'Supply chain networks, centrality metrics, vulnerability scores',
      records: 156789,
      size: '67.1 MB',
      lastUpdate: '2024-10-24T07:55:00Z',
      category: 'Network'
    }
  ]

  const exportHistory = [
    {
      id: 1,
      name: 'Monthly Risk Assessment',
      datasets: ['economic_indicators', 'risk_scores', 'market_data'],
      format: 'csv',
      size: '456.7 MB',
      status: 'completed',
      downloadUrl: '/exports/monthly-risk-2024-10.zip',
      createdAt: '2024-10-24T08:00:00Z',
      expiresAt: '2024-11-24T08:00:00Z'
    },
    {
      id: 2,
      name: 'Security Intelligence Report',
      datasets: ['security_threats', 'network_analysis'],
      format: 'json',
      size: '124.3 MB',
      status: 'completed',
      downloadUrl: '/exports/security-intel-2024-10.zip',
      createdAt: '2024-10-24T07:30:00Z',
      expiresAt: '2024-11-24T07:30:00Z'
    },
    {
      id: 3,
      name: 'Economic Trends Analysis',
      datasets: ['economic_indicators', 'employment_stats'],
      format: 'excel',
      size: '78.9 MB',
      status: 'processing',
      downloadUrl: null,
      createdAt: '2024-10-24T07:45:00Z',
      expiresAt: '2024-11-24T07:45:00Z'
    },
    {
      id: 4,
      name: 'Full Dataset Backup',
      datasets: Object.keys(availableDatasets),
      format: 'parquet',
      size: '1.2 GB',
      status: 'failed',
      downloadUrl: null,
      createdAt: '2024-10-24T06:00:00Z',
      expiresAt: '2024-11-24T06:00:00Z'
    }
  ]

  const exportTemplates = [
    {
      id: 'risk_dashboard',
      name: 'Risk Dashboard Export',
      description: 'Standard risk assessment data for executive reporting',
      datasets: ['economic_indicators', 'risk_scores', 'market_data'],
      format: 'excel',
      schedule: 'weekly'
    },
    {
      id: 'regulatory_filing',
      name: 'Regulatory Filing Data',
      description: 'Compliance data for regulatory submissions',
      datasets: ['economic_indicators', 'employment_stats', 'demographic_data'],
      format: 'csv',
      schedule: 'monthly'
    },
    {
      id: 'research_dataset',
      name: 'Academic Research Dataset',
      description: 'Comprehensive dataset for academic research',
      datasets: ['economic_indicators', 'demographic_data', 'environmental_data'],
      format: 'json',
      schedule: 'quarterly'
    },
    {
      id: 'security_briefing',
      name: 'Security Briefing Package',
      description: 'Security and infrastructure risk data',
      datasets: ['security_threats', 'network_analysis'],
      format: 'pdf',
      schedule: 'daily'
    }
  ]

  const handleDatasetToggle = (datasetId: string) => {
    setSelectedDatasets(prev => 
      prev.includes(datasetId) 
        ? prev.filter(id => id !== datasetId)
        : [...prev, datasetId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDatasets.length === availableDatasets.length) {
      setSelectedDatasets([])
    } else {
      setSelectedDatasets(availableDatasets.map(d => d.id))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'processing':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200'
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

  const selectedDatasetsData = availableDatasets.filter(d => selectedDatasets.includes(d.id))
  const totalSelectedRecords = selectedDatasetsData.reduce((sum, d) => sum + d.records, 0)
  const estimatedSize = selectedDatasetsData.reduce((sum, d) => {
    const sizeInMB = parseFloat(d.size.replace(' MB', ''))
    return sum + sizeInMB
  }, 0)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Data Export
          </h1>
          <p className="text-lg text-[#374151]">
            Export datasets for analysis, reporting, and compliance requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Create New Export</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-[#374151]">
                      Select Datasets ({selectedDatasets.length} selected)
                    </label>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-[#1e3a8a] hover:text-blue-800"
                    >
                      {selectedDatasets.length === availableDatasets.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableDatasets.map((dataset) => (
                      <div
                        key={dataset.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedDatasets.includes(dataset.id)
                            ? 'border-[#1e3a8a] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleDatasetToggle(dataset.id)}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedDatasets.includes(dataset.id)}
                            onChange={() => handleDatasetToggle(dataset.id)}
                            className="rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                          />
                          <h3 className="font-medium text-[#374151]">{dataset.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{dataset.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatNumber(dataset.records)} records</span>
                          <span>{dataset.size}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{dataset.source}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{dataset.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Export Format
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="csv">CSV - Comma Separated Values</option>
                      <option value="json">JSON - JavaScript Object Notation</option>
                      <option value="excel">Excel - Microsoft Excel Format</option>
                      <option value="parquet">Parquet - Columnar Storage</option>
                      <option value="xml">XML - Extensible Markup Language</option>
                      <option value="pdf">PDF - Report Format</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Date Range
                    </label>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                      <option value="all">All Available Data</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-2">
                      Compression
                    </label>
                    <select
                      value={compressionType}
                      onChange={(e) => setCompressionType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="zip">ZIP Archive</option>
                      <option value="gzip">GZIP Compression</option>
                      <option value="none">No Compression</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={includeMetadata}
                        onChange={(e) => setIncludeMetadata(e.target.checked)}
                        className="rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
                      />
                    </div>
                    <div className="ml-3">
                      <label className="text-sm font-medium text-[#374151]">
                        Include Metadata
                      </label>
                      <p className="text-sm text-gray-500">Data schemas, field descriptions, and quality metrics</p>
                    </div>
                  </div>
                </div>

                {selectedDatasets.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-[#374151] mb-2">Export Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Datasets:</span>
                        <div className="font-medium text-[#374151]">{selectedDatasets.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Records:</span>
                        <div className="font-medium text-[#374151]">{formatNumber(totalSelectedRecords)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Estimated Size:</span>
                        <div className="font-medium text-[#374151]">{estimatedSize.toFixed(1)} MB</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Format:</span>
                        <div className="font-medium text-[#374151]">{exportFormat.toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    disabled={selectedDatasets.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      selectedDatasets.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1e3a8a] text-white hover:bg-blue-800'
                    }`}
                  >
                    Start Export
                  </button>
                  <button className="px-6 py-3 border border-[#1e3a8a] text-[#1e3a8a] rounded-lg hover:bg-blue-50 transition-colors">
                    Save as Template
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Export History</h2>
              
              <div className="space-y-4">
                {exportHistory.map((export_) => (
                  <div key={export_.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-[#374151]">{export_.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(export_.status)}`}>
                        {export_.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Datasets:</span>
                        <div className="font-medium text-[#374151]">{export_.datasets.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Format:</span>
                        <div className="font-medium text-[#374151]">{export_.format.toUpperCase()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Size:</span>
                        <div className="font-medium text-[#374151]">{export_.size}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <div className="font-medium text-[#374151]">{formatTimestamp(export_.createdAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Expires: {formatTimestamp(export_.expiresAt)}
                      </div>
                      <div className="flex space-x-2">
                        {export_.downloadUrl && (
                          <button className="text-[#1e3a8a] hover:text-blue-800 text-sm font-medium">
                            Download
                          </button>
                        )}
                        {export_.status === 'failed' && (
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Retry
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Export Templates</h2>
              <div className="space-y-4">
                {exportTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-[#374151] mb-1">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{template.datasets.length} datasets</span>
                      <span className="text-[#1e3a8a]">{template.format.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">Schedule: {template.schedule}</span>
                      <button className="text-[#1e3a8a] hover:text-blue-800 text-sm font-medium">
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                Create Template
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Export Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Total Exports</span>
                  <span className="text-sm font-medium text-[#374151]">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">This Month</span>
                  <span className="text-sm font-medium text-[#374151]">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Data Exported</span>
                  <span className="text-sm font-medium text-[#374151]">2.3 GB</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Success Rate</span>
                  <span className="text-sm font-medium text-green-600">94.7%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Format Guidelines</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-[#374151]">CSV:</span>
                  <p className="text-gray-600">Best for spreadsheet analysis</p>
                </div>
                <div>
                  <span className="font-medium text-[#374151]">JSON:</span>
                  <p className="text-gray-600">Ideal for API integration</p>
                </div>
                <div>
                  <span className="font-medium text-[#374151]">Excel:</span>
                  <p className="text-gray-600">Perfect for business reporting</p>
                </div>
                <div>
                  <span className="font-medium text-[#374151]">Parquet:</span>
                  <p className="text-gray-600">Optimized for big data analytics</p>
                </div>
                <div>
                  <span className="font-medium text-[#374151]">PDF:</span>
                  <p className="text-gray-600">Formatted reports and presentations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}