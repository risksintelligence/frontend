'use client'

import React, { useState, useEffect } from 'react'

export default function SystemLogsPage() {
  const [selectedService, setSelectedService] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [logEntries, setLogEntries] = useState<any[]>([])
  const [logStats, setLogStats] = useState<any>(null)
  const [logAggregations, setLogAggregations] = useState<any>(null)
  const [searchFilters, setSearchFilters] = useState<any[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com'}/api/v1/monitoring/logs?timeframe=${selectedTimeframe}&service=${selectedService}&level=${selectedLevel}`)
        const data = await response.json()
        
        if (data.status === 'success' && data.data) {
          setLogEntries(data.data.logs || [])
          setLogStats(data.data.stats || null)
          setLogAggregations(data.data.aggregations || null)
          setSearchFilters(data.data.filters || [])
        } else {
          throw new Error('Log data not available from backend')
        }
      } catch (error) {
        console.error('Error fetching logs:', error)
        setLogEntries([])
        setLogStats(null)
        setLogAggregations(null)
        setSearchFilters([])
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [selectedService, selectedLevel, selectedTimeframe])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-64 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!logStats || !logAggregations || logEntries.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <div className="text-slate-500">
              <div className="w-12 h-12 mx-auto mb-4 opacity-50 bg-slate-300 rounded"></div>
              <h3 className="text-lg font-semibold mb-2">No System Logs Available</h3>
              <p>Backend API must be fully functional to display system logs.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                    {logAggregations.byHour.map((hourData: any, index: number) => (
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
                {Object.entries(logAggregations.byLevel).map(([level, count]: [string, any]) => (
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
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 6)
                  .map(([service, count]: [string, any]) => (
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
                {searchFilters.map((filter: any) => (
                  <div key={filter.id}>
                    <h3 className="font-medium text-[#374151] mb-2">{filter.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {filter.values.map((value: any) => (
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
                {logStats.topErrorServices.map((service: any, index: number) => (
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