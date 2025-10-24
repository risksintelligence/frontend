'use client'

import React, { useState } from 'react'

export default function SystemLogsPage() {
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [searchQuery, setSearchQuery] = useState('')

  const logEntries = [
    {
      id: 1,
      timestamp: '2024-10-24T08:45:23.456Z',
      level: 'ERROR',
      service: 'api_gateway',
      component: 'authentication',
      message: 'Authentication token validation failed for user session',
      details: {
        userId: 'user_12345',
        sessionId: 'sess_abcdef',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        errorCode: 'AUTH_TOKEN_EXPIRED'
      },
      traceId: 'trace-abc123',
      duration: null
    },
    {
      id: 2,
      timestamp: '2024-10-24T08:45:18.234Z',
      level: 'WARN',
      service: 'risk_engine',
      component: 'calculation',
      message: 'Risk calculation took longer than expected threshold',
      details: {
        calculationId: 'calc_789xyz',
        expectedTime: '500ms',
        actualTime: '1234ms',
        riskFactors: ['economic_indicators', 'market_volatility'],
        dataPoints: 15000
      },
      traceId: 'trace-def456',
      duration: 1234
    },
    {
      id: 3,
      timestamp: '2024-10-24T08:45:15.789Z',
      level: 'INFO',
      service: 'cache_layer',
      component: 'redis',
      message: 'Cache warming completed successfully for economic indicators',
      details: {
        cacheKey: 'econ_indicators_2024_q3',
        recordsLoaded: 50000,
        loadTime: '2.3s',
        hitRateImprovement: '+12%'
      },
      traceId: 'trace-ghi789',
      duration: 2300
    },
    {
      id: 4,
      timestamp: '2024-10-24T08:45:12.567Z',
      level: 'ERROR',
      service: 'external_apis',
      component: 'fred_client',
      message: 'Failed to retrieve data from FRED API - connection timeout',
      details: {
        endpoint: 'https://api.stlouisfed.org/fred/series',
        series: ['GDP', 'UNRATE', 'CPIAUCSL'],
        timeout: '30000ms',
        retryAttempt: 3,
        httpStatus: null
      },
      traceId: 'trace-jkl012',
      duration: 30000
    },
    {
      id: 5,
      timestamp: '2024-10-24T08:45:09.345Z',
      level: 'INFO',
      service: 'ml_service',
      component: 'model_server',
      message: 'Risk prediction model served successfully',
      details: {
        modelId: 'risk_model_v2.1',
        predictionId: 'pred_345mno',
        inputFeatures: 25,
        confidence: 0.87,
        predictionValue: 0.23
      },
      traceId: 'trace-mno345',
      duration: 445
    },
    {
      id: 6,
      timestamp: '2024-10-24T08:45:06.123Z',
      level: 'DEBUG',
      service: 'database',
      component: 'query_executor',
      message: 'Slow query detected in risk_scores table',
      details: {
        query: 'SELECT * FROM risk_scores WHERE date_range = ? AND factor_type = ?',
        executionTime: '2.34s',
        rowsExamined: 1500000,
        rowsReturned: 50000,
        indexUsed: 'idx_date_factor'
      },
      traceId: 'trace-pqr678',
      duration: 2340
    },
    {
      id: 7,
      timestamp: '2024-10-24T08:45:03.901Z',
      level: 'INFO',
      service: 'data_pipeline',
      component: 'etl_processor',
      message: 'ETL job completed successfully for BLS employment data',
      details: {
        jobId: 'etl_bls_employment_20241024',
        recordsProcessed: 25000,
        recordsUpdated: 1500,
        recordsInserted: 300,
        processingTime: '45s'
      },
      traceId: 'trace-stu901',
      duration: 45000
    },
    {
      id: 8,
      timestamp: '2024-10-24T08:45:00.678Z',
      level: 'WARN',
      service: 'notification_service',
      component: 'email_sender',
      message: 'Email delivery rate below threshold',
      details: {
        deliveryRate: '87%',
        threshold: '95%',
        totalEmails: 1200,
        failedEmails: 156,
        bounceRate: '3.2%'
      },
      traceId: 'trace-vwx234',
      duration: null
    },
    {
      id: 9,
      timestamp: '2024-10-24T08:44:57.456Z',
      level: 'INFO',
      service: 'api_gateway',
      component: 'rate_limiter',
      message: 'Rate limit threshold adjusted for high-volume client',
      details: {
        clientId: 'client_enterprise_001',
        oldLimit: '1000/min',
        newLimit: '1500/min',
        requestVolume: '1200/min',
        adjustmentReason: 'enterprise_tier'
      },
      traceId: 'trace-yza567',
      duration: null
    },
    {
      id: 10,
      timestamp: '2024-10-24T08:44:54.234Z',
      level: 'ERROR',
      service: 'ml_service',
      component: 'feature_processor',
      message: 'Feature extraction failed for network analysis model',
      details: {
        modelId: 'network_centrality_v1.3',
        featureSet: 'network_topology',
        nodeCount: 15000,
        edgeCount: 45000,
        errorType: 'memory_allocation_error'
      },
      traceId: 'trace-bcd890',
      duration: null
    }
  ]

  const logStats = {
    totalLogs: 125847,
    errorRate: 2.3,
    warnRate: 8.7,
    avgResponseTime: 234,
    topErrorServices: ['external_apis', 'ml_service', 'api_gateway'],
    logVolumeGrowth: '+15.2%'
  }

  const searchFilters = [
    { id: 'error_codes', name: 'Error Codes', values: ['AUTH_TOKEN_EXPIRED', 'CONNECTION_TIMEOUT', 'MEMORY_ERROR'] },
    { id: 'trace_ids', name: 'Trace IDs', values: ['trace-abc123', 'trace-def456', 'trace-ghi789'] },
    { id: 'user_agents', name: 'User Agents', values: ['Mozilla/5.0', 'Chrome/118.0', 'Safari/17.0'] },
    { id: 'ip_addresses', name: 'IP Addresses', values: ['192.168.1.100', '10.0.0.50', '172.16.0.25'] }
  ]

  const logAggregations = {
    byLevel: {
      ERROR: 2890,
      WARN: 10956,
      INFO: 98567,
      DEBUG: 13434
    },
    byService: {
      api_gateway: 45623,
      risk_engine: 23456,
      database: 18934,
      cache_layer: 15678,
      ml_service: 12345,
      external_apis: 9811
    },
    byHour: [
      { hour: '00:00', count: 8234 },
      { hour: '01:00', count: 7456 },
      { hour: '02:00', count: 6789 },
      { hour: '03:00', count: 6123 },
      { hour: '04:00', count: 5890 },
      { hour: '05:00', count: 6234 },
      { hour: '06:00', count: 7567 },
      { hour: '07:00', count: 9890 },
      { hour: '08:00', count: 12456 },
      { hour: '09:00', count: 11234 }
    ]
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'WARN':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'INFO':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'DEBUG':
        return 'text-gray-600 bg-gray-100 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatDuration = (duration: number | null) => {
    if (!duration) return 'N/A'
    if (duration < 1000) return `${duration}ms`
    return `${(duration / 1000).toFixed(2)}s`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const filteredLogs = logEntries.filter(log => {
    if (selectedService !== 'all' && log.service !== selectedService) {
      return false
    }
    if (selectedLevel !== 'all' && log.level !== selectedLevel) {
      return false
    }
    if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !JSON.stringify(log.details).toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            System Logs
          </h1>
          <p className="text-lg text-[#374151]">
            Centralized log management, analysis, and troubleshooting for all system components
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search logs by message, error codes, trace IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>
            <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Search
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Services</option>
              <option value="api_gateway">API Gateway</option>
              <option value="risk_engine">Risk Engine</option>
              <option value="database">Database</option>
              <option value="cache_layer">Cache Layer</option>
              <option value="ml_service">ML Service</option>
              <option value="external_apis">External APIs</option>
              <option value="data_pipeline">Data Pipeline</option>
              <option value="notification_service">Notification Service</option>
            </select>
            
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Levels</option>
              <option value="ERROR">Error</option>
              <option value="WARN">Warning</option>
              <option value="INFO">Info</option>
              <option value="DEBUG">Debug</option>
            </select>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="5m">Last 5 Minutes</option>
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
            
            <button className="border border-[#1e3a8a] text-[#1e3a8a] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Export Logs
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Logs</h3>
            <p className="text-3xl font-bold text-[#374151]">{formatNumber(logStats.totalLogs)}</p>
            <p className="text-sm text-gray-500">In timeframe</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Error Rate</h3>
            <p className="text-3xl font-bold text-red-600">{logStats.errorRate}%</p>
            <p className="text-sm text-gray-500">Of total logs</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Warning Rate</h3>
            <p className="text-3xl font-bold text-yellow-600">{logStats.warnRate}%</p>
            <p className="text-sm text-gray-500">Of total logs</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Avg Response</h3>
            <p className="text-3xl font-bold text-[#374151]">{logStats.avgResponseTime}ms</p>
            <p className="text-sm text-gray-500">Request duration</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Volume Growth</h3>
            <p className="text-3xl font-bold text-green-600">{logStats.logVolumeGrowth}</p>
            <p className="text-sm text-gray-500">From last period</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">
                Log Entries ({filteredLogs.length} results)
              </h2>
              
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-sm font-medium text-[#374151]">{log.service}</span>
                        <span className="text-sm text-gray-500">{log.component}</span>
                        {log.duration && (
                          <span className="text-sm text-yellow-600">{formatDuration(log.duration)}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-[#374151] font-medium">{log.message}</p>
                    </div>
                    
                    {log.details && (
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <div className="text-sm text-gray-600 mb-1">Details:</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="text-gray-600 capitalize w-24">{key.replace(/([A-Z])/g, ' $1')}:</span>
                              <span className="text-[#374151] font-mono">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Trace ID:</span>
                        <span className="font-mono text-blue-600">{log.traceId}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-[#1e3a8a] hover:text-blue-800">
                          View Trace
                        </button>
                        <button className="text-[#1e3a8a] hover:text-blue-800">
                          Related Logs
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Previous Page
                </button>
                <span className="text-sm text-gray-500">Showing 1-10 of {formatNumber(logStats.totalLogs)} results</span>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Next Page
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Log Volume by Hour</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-[#374151]">Hour</th>
                      <th className="text-right py-2 text-[#374151]">Log Count</th>
                      <th className="text-right py-2 text-[#374151]">Error %</th>
                      <th className="text-right py-2 text-[#374151]">Warning %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logAggregations.byHour.map((hourData, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-[#374151]">{hourData.hour}</td>
                        <td className="py-2 text-right text-[#374151]">{formatNumber(hourData.count)}</td>
                        <td className="py-2 text-right text-red-600">
                          {((logAggregations.byLevel.ERROR / logStats.totalLogs) * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 text-right text-yellow-600">
                          {((logAggregations.byLevel.WARN / logStats.totalLogs) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Log Levels</h2>
              <div className="space-y-3">
                {Object.entries(logAggregations.byLevel).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLevelColor(level)}`}>
                        {level}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#374151]">{formatNumber(count)}</div>
                      <div className="text-xs text-gray-500">
                        {((count / logStats.totalLogs) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Top Services</h2>
              <div className="space-y-3">
                {Object.entries(logAggregations.byService)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 6)
                  .map(([service, count]) => (
                  <div key={service} className="flex items-center justify-between">
                    <span className="text-sm text-[#374151] capitalize">{service.replace('_', ' ')}</span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#374151]">{formatNumber(count)}</div>
                      <div className="text-xs text-gray-500">
                        {((count / logStats.totalLogs) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Search Filters</h2>
              <div className="space-y-4">
                {searchFilters.map((filter) => (
                  <div key={filter.id}>
                    <h3 className="font-medium text-[#374151] mb-2">{filter.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {filter.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => setSearchQuery(value)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Log Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Download Log Archive
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Create Log Alert
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Log Analysis Report
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Configure Retention
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Top Error Services</h2>
              <div className="space-y-2">
                {logStats.topErrorServices.map((service, index) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-600">#{index + 1}</span>
                      <span className="text-sm text-[#374151] capitalize">{service.replace('_', ' ')}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedService(service)
                        setSelectedLevel('ERROR')
                      }}
                      className="text-xs text-[#1e3a8a] hover:text-blue-800"
                    >
                      View Errors
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}