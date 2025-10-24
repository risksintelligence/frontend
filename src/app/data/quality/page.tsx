'use client'

import React, { useState } from 'react'

export default function DataQualityPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('all')

  const qualityMetrics = {
    overall: {
      score: 97.2,
      trend: '+0.4%',
      status: 'excellent',
      description: 'Aggregate quality score across all data dimensions'
    },
    completeness: {
      score: 98.5,
      trend: '+0.3%',
      issues: 1247,
      description: 'Percentage of non-null values across all required fields'
    },
    accuracy: {
      score: 97.8,
      trend: '+0.1%',
      issues: 2156,
      description: 'Conformance to expected data types, ranges, and formats'
    },
    consistency: {
      score: 96.4,
      trend: '-0.2%',
      issues: 3421,
      description: 'Uniformity of data representation across sources and time'
    },
    timeliness: {
      score: 99.1,
      trend: '+0.5%',
      issues: 892,
      description: 'Currency and freshness of data relative to expected update schedules'
    },
    validity: {
      score: 95.9,
      trend: '+0.2%',
      issues: 4567,
      description: 'Adherence to defined business rules and constraints'
    },
    uniqueness: {
      score: 98.7,
      trend: '+0.1%',
      issues: 1098,
      description: 'Absence of duplicate records within datasets'
    }
  }

  const sourceQuality = [
    {
      id: 'fred',
      name: 'Federal Reserve Economic Data',
      overallScore: 98.7,
      completeness: 99.2,
      accuracy: 98.9,
      consistency: 97.8,
      timeliness: 99.5,
      validity: 98.1,
      uniqueness: 99.0,
      recordsProcessed: 847253,
      issuesFound: 1092,
      lastAssessment: '2024-10-24T08:15:00Z'
    },
    {
      id: 'bea',
      name: 'Bureau of Economic Analysis',
      overallScore: 97.8,
      completeness: 98.1,
      accuracy: 97.9,
      consistency: 96.8,
      timeliness: 98.2,
      validity: 97.5,
      uniqueness: 98.3,
      recordsProcessed: 156432,
      issuesFound: 3441,
      lastAssessment: '2024-10-24T08:10:00Z'
    },
    {
      id: 'bls',
      name: 'Bureau of Labor Statistics',
      overallScore: 98.2,
      completeness: 98.8,
      accuracy: 98.1,
      consistency: 97.2,
      timeliness: 99.0,
      validity: 97.9,
      uniqueness: 98.1,
      recordsProcessed: 234567,
      issuesFound: 4123,
      lastAssessment: '2024-10-24T08:05:00Z'
    },
    {
      id: 'census',
      name: 'U.S. Census Bureau',
      overallScore: 96.5,
      completeness: 97.2,
      accuracy: 96.8,
      consistency: 95.4,
      timeliness: 97.1,
      validity: 96.0,
      uniqueness: 97.6,
      recordsProcessed: 89234,
      issuesFound: 3105,
      lastAssessment: '2024-10-24T07:45:00Z'
    },
    {
      id: 'cisa',
      name: 'Cybersecurity & Infrastructure',
      overallScore: 95.3,
      completeness: 96.1,
      accuracy: 95.2,
      consistency: 94.8,
      timeliness: 96.5,
      validity: 94.9,
      uniqueness: 95.8,
      recordsProcessed: 45621,
      issuesFound: 2146,
      lastAssessment: '2024-10-24T07:30:00Z'
    },
    {
      id: 'noaa',
      name: 'National Weather Service',
      overallScore: 97.1,
      completeness: 97.8,
      accuracy: 97.5,
      consistency: 96.2,
      timeliness: 98.1,
      validity: 96.8,
      uniqueness: 97.2,
      recordsProcessed: 123456,
      issuesFound: 3577,
      lastAssessment: '2024-10-24T08:00:00Z'
    }
  ]

  const qualityIssues = [
    {
      id: 1,
      severity: 'high',
      type: 'Missing Values',
      source: 'Census Bureau',
      field: 'household_income',
      count: 1247,
      percentage: 3.8,
      description: 'Missing household income data in demographic records',
      impact: 'Affects income distribution analysis',
      recommendation: 'Implement data imputation for missing income values',
      detectedAt: '2024-10-24T07:45:00Z',
      status: 'open'
    },
    {
      id: 2,
      severity: 'medium',
      type: 'Format Inconsistency',
      source: 'BEA',
      field: 'date_format',
      count: 892,
      percentage: 0.6,
      description: 'Inconsistent date formats in quarterly GDP data',
      impact: 'Time series analysis complications',
      recommendation: 'Standardize all dates to ISO 8601 format',
      detectedAt: '2024-10-24T07:30:00Z',
      status: 'in_progress'
    },
    {
      id: 3,
      severity: 'high',
      type: 'Duplicate Records',
      source: 'CISA',
      field: 'vulnerability_id',
      count: 543,
      percentage: 1.2,
      description: 'Duplicate vulnerability entries with same CVE IDs',
      impact: 'Inflated risk scores and false alerts',
      recommendation: 'Implement deduplication logic based on CVE ID',
      detectedAt: '2024-10-24T07:15:00Z',
      status: 'resolved'
    },
    {
      id: 4,
      severity: 'low',
      type: 'Range Validation',
      source: 'BLS',
      field: 'unemployment_rate',
      count: 234,
      percentage: 0.1,
      description: 'Unemployment rates outside expected range (0-100%)',
      impact: 'Potential data visualization errors',
      recommendation: 'Add range validation rules for percentage fields',
      detectedAt: '2024-10-24T07:00:00Z',
      status: 'open'
    },
    {
      id: 5,
      severity: 'medium',
      type: 'Stale Data',
      source: 'NOAA',
      field: 'weather_update',
      count: 1891,
      percentage: 1.5,
      description: 'Weather data older than expected update frequency',
      impact: 'Outdated environmental risk assessments',
      recommendation: 'Increase monitoring frequency for weather data feeds',
      detectedAt: '2024-10-24T06:45:00Z',
      status: 'in_progress'
    }
  ]

  const qualityTrends = [
    { date: '2024-10-17', score: 96.8 },
    { date: '2024-10-18', score: 96.9 },
    { date: '2024-10-19', score: 97.1 },
    { date: '2024-10-20', score: 96.7 },
    { date: '2024-10-21', score: 97.0 },
    { date: '2024-10-22', score: 97.3 },
    { date: '2024-10-23', score: 97.1 },
    { date: '2024-10-24', score: 97.2 }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600'
    if (score >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'in_progress':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'open':
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

  const filteredSources = selectedSource === 'all' 
    ? sourceQuality 
    : sourceQuality.filter(source => source.id === selectedSource)

  const filteredIssues = qualityIssues.filter(issue => {
    if (selectedSource !== 'all') {
      const sourceNames = {
        'fred': 'Federal Reserve Economic Data',
        'bea': 'Bureau of Economic Analysis',
        'bls': 'Bureau of Labor Statistics',
        'census': 'U.S. Census Bureau',
        'cisa': 'Cybersecurity & Infrastructure',
        'noaa': 'National Weather Service'
      }
      if (issue.source !== sourceNames[selectedSource as keyof typeof sourceNames]) {
        return false
      }
    }
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Data Quality
          </h1>
          <p className="text-lg text-[#374151]">
            Monitor data quality metrics, identify issues, and track improvement initiatives
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Sources</option>
              <option value="fred">FRED</option>
              <option value="bea">BEA</option>
              <option value="bls">BLS</option>
              <option value="census">Census</option>
              <option value="cisa">CISA</option>
              <option value="noaa">NOAA</option>
            </select>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Run Quality Assessment
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Overall Score</h3>
            <p className={`text-3xl font-bold ${getScoreColor(qualityMetrics.overall.score)}`}>
              {qualityMetrics.overall.score}%
            </p>
            <p className="text-sm text-green-600">{qualityMetrics.overall.trend} this week</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Active Issues</h3>
            <p className="text-3xl font-bold text-red-600">{filteredIssues.filter(i => i.status === 'open').length}</p>
            <p className="text-sm text-gray-500">Requiring attention</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Records Processed</h3>
            <p className="text-3xl font-bold text-[#374151]">
              {formatNumber(sourceQuality.reduce((sum, s) => sum + s.recordsProcessed, 0))}
            </p>
            <p className="text-sm text-gray-500">In selected timeframe</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Sources Monitored</h3>
            <p className="text-3xl font-bold text-[#374151]">{sourceQuality.length}</p>
            <p className="text-sm text-gray-500">Data sources</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quality Dimensions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(qualityMetrics).filter(([key]) => key !== 'overall').map(([key, metric]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#374151] capitalize">{key}</h3>
                      <span className={`text-sm font-medium ${
                        metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend}
                      </span>
                    </div>
                    <div className={`text-2xl font-bold mb-2 ${getScoreColor(metric.score)}`}>
                      {metric.score}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.score >= 95 ? 'bg-green-500' : 
                          metric.score >= 90 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.score}%` }}
                      ></div>
                    </div>
                    {metric.description && (
                      <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                    )}
                    {'issues' in metric && metric.issues && (
                      <div className="text-sm text-red-600">{formatNumber(metric.issues)} issues found</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Source Quality Breakdown</h2>
              
              <div className="space-y-4">
                {filteredSources.map((source) => (
                  <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-[#374151]">{source.name}</h3>
                      <div className={`text-xl font-bold ${getScoreColor(source.overallScore)}`}>
                        {source.overallScore}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-sm mb-3">
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.completeness)}`}>
                          {source.completeness}%
                        </div>
                        <div className="text-gray-500">Completeness</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.accuracy)}`}>
                          {source.accuracy}%
                        </div>
                        <div className="text-gray-500">Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.consistency)}`}>
                          {source.consistency}%
                        </div>
                        <div className="text-gray-500">Consistency</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.timeliness)}`}>
                          {source.timeliness}%
                        </div>
                        <div className="text-gray-500">Timeliness</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.validity)}`}>
                          {source.validity}%
                        </div>
                        <div className="text-gray-500">Validity</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-medium ${getScoreColor(source.uniqueness)}`}>
                          {source.uniqueness}%
                        </div>
                        <div className="text-gray-500">Uniqueness</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatNumber(source.recordsProcessed)} records processed</span>
                      <span>{source.issuesFound} issues found</span>
                      <span>Last assessed: {formatTimestamp(source.lastAssessment)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quality Issues</h2>
              
              <div className="space-y-4">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-[#374151]">{issue.type}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#374151]">{formatNumber(issue.count)}</div>
                        <div className="text-sm text-gray-500">{issue.percentage}%</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Source:</span>
                        <div className="font-medium text-[#374151]">{issue.source}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Field:</span>
                        <div className="font-mono text-[#374151]">{issue.field}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <div className="text-[#374151]">{issue.description}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Impact:</span>
                        <div className="text-red-600">{issue.impact}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Recommendation:</span>
                        <div className="text-green-600">{issue.recommendation}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-500">
                      Detected: {formatTimestamp(issue.detectedAt)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quality Trend</h2>
              <div className="space-y-3">
                {qualityTrends.slice(-5).map((trend, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{trend.date}</span>
                    <span className={`text-sm font-medium ${getScoreColor(trend.score)}`}>
                      {trend.score}%
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">7-day average</div>
                <div className={`text-xl font-bold ${getScoreColor(
                  qualityTrends.reduce((sum, t) => sum + t.score, 0) / qualityTrends.length
                )}`}>
                  {(qualityTrends.reduce((sum, t) => sum + t.score, 0) / qualityTrends.length).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Issue Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">High Severity</span>
                  <span className="text-sm font-medium text-red-600">
                    {filteredIssues.filter(i => i.severity === 'high').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Medium Severity</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {filteredIssues.filter(i => i.severity === 'medium').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Low Severity</span>
                  <span className="text-sm font-medium text-blue-600">
                    {filteredIssues.filter(i => i.severity === 'low').length}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#374151]">Open Issues</span>
                    <span className="text-sm font-medium text-red-600">
                      {filteredIssues.filter(i => i.status === 'open').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#374151]">In Progress</span>
                    <span className="text-sm font-medium text-blue-600">
                      {filteredIssues.filter(i => i.status === 'in_progress').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#374151]">Resolved</span>
                    <span className="text-sm font-medium text-green-600">
                      {filteredIssues.filter(i => i.status === 'resolved').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Generate Quality Report
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Schedule Assessment
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Export Issues
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Configure Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}