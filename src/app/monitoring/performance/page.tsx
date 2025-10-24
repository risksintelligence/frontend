'use client'

import React, { useState } from 'react'

export default function PerformanceMetricsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedMetric, setSelectedMetric] = useState('response_time')
  const [selectedService, setSelectedService] = useState('all')

  const performanceMetrics = {
    summary: {
      responseTime: {
        current: 187,
        p50: 145,
        p95: 467,
        p99: 892,
        trend: '+2.3%'
      },
      throughput: {
        current: 15672,
        peak: 18234,
        average: 14567,
        trend: '+5.7%'
      },
      errorRate: {
        current: 0.08,
        target: 0.1,
        trend: '-12.4%'
      },
      availability: {
        current: 99.94,
        target: 99.9,
        trend: '+0.02%'
      }
    },
    services: [
      {
        id: 'api_gateway',
        name: 'API Gateway',
        responseTime: { avg: 45, p95: 89, p99: 156 },
        throughput: 8934,
        errorRate: 0.01,
        cpu: 34.2,
        memory: 67.8,
        diskIO: 12.4,
        networkIO: 45.7,
        connections: 2847
      },
      {
        id: 'risk_engine',
        name: 'Risk Assessment Engine',
        responseTime: { avg: 234, p95: 567, p99: 1234 },
        throughput: 2156,
        errorRate: 0.05,
        cpu: 78.5,
        memory: 82.1,
        diskIO: 23.8,
        networkIO: 34.9,
        connections: 156
      },
      {
        id: 'database',
        name: 'Primary Database',
        responseTime: { avg: 89, p95: 234, p99: 456 },
        throughput: 5678,
        errorRate: 0.02,
        cpu: 56.3,
        memory: 73.9,
        diskIO: 67.2,
        networkIO: 28.5,
        connections: 245
      },
      {
        id: 'cache_layer',
        name: 'Cache Layer (Redis)',
        responseTime: { avg: 12, p95: 23, p99: 45 },
        throughput: 12456,
        errorRate: 0.00,
        cpu: 23.1,
        memory: 45.7,
        diskIO: 5.6,
        networkIO: 89.2,
        connections: 1234
      },
      {
        id: 'ml_service',
        name: 'Machine Learning Service',
        responseTime: { avg: 445, p95: 892, p99: 1567 },
        throughput: 567,
        errorRate: 0.08,
        cpu: 89.2,
        memory: 91.4,
        diskIO: 45.3,
        networkIO: 23.7,
        connections: 89
      }
    ]
  }

  const timeSeriesData = [
    { time: '08:00', responseTime: 142, throughput: 14500, errors: 12, cpu: 45.2 },
    { time: '08:05', responseTime: 138, throughput: 15200, errors: 8, cpu: 47.1 },
    { time: '08:10', responseTime: 145, throughput: 16100, errors: 15, cpu: 52.3 },
    { time: '08:15', responseTime: 149, throughput: 15800, errors: 11, cpu: 48.9 },
    { time: '08:20', responseTime: 143, throughput: 15600, errors: 9, cpu: 46.7 },
    { time: '08:25', responseTime: 147, throughput: 16400, errors: 13, cpu: 51.2 },
    { time: '08:30', responseTime: 144, throughput: 15900, errors: 7, cpu: 49.8 },
    { time: '08:35', responseTime: 152, throughput: 17200, errors: 18, cpu: 54.6 },
    { time: '08:40', responseTime: 148, throughput: 16800, errors: 10, cpu: 50.4 },
    { time: '08:45', responseTime: 156, throughput: 18100, errors: 22, cpu: 57.1 }
  ]

  const alertThresholds = {
    responseTime: {
      warning: 500,
      critical: 1000,
      current: 187
    },
    errorRate: {
      warning: 0.1,
      critical: 0.5,
      current: 0.08
    },
    cpu: {
      warning: 80,
      critical: 95,
      current: 52.3
    },
    memory: {
      warning: 85,
      critical: 95,
      current: 73.2
    }
  }

  const slowQueries = [
    {
      id: 1,
      query: 'SELECT * FROM risk_scores WHERE date_range = ? AND factor_type = ?',
      executionTime: 2.34,
      frequency: 1247,
      database: 'primary',
      table: 'risk_scores',
      optimization: 'Add composite index on (date_range, factor_type)'
    },
    {
      id: 2,
      query: 'SELECT AVG(score) FROM economic_indicators GROUP BY indicator_type',
      executionTime: 1.89,
      frequency: 892,
      database: 'primary',
      table: 'economic_indicators',
      optimization: 'Consider materialized view for aggregations'
    },
    {
      id: 3,
      query: 'UPDATE cache_entries SET value = ? WHERE key = ?',
      executionTime: 0.89,
      frequency: 5634,
      database: 'cache',
      table: 'cache_entries',
      optimization: 'Batch updates to reduce lock contention'
    },
    {
      id: 4,
      query: 'SELECT * FROM network_nodes WHERE centrality > ? ORDER BY importance DESC',
      executionTime: 3.56,
      frequency: 234,
      database: 'primary',
      table: 'network_nodes',
      optimization: 'Add index on centrality column'
    }
  ]

  const resourceUtilization = {
    cpu: {
      current: 52.3,
      trend: '+3.2%',
      peak: 89.7,
      cores: 16,
      breakdown: {
        system: 12.4,
        user: 35.8,
        iowait: 4.1
      }
    },
    memory: {
      current: 73.2,
      trend: '+1.8%',
      peak: 91.4,
      total: '32 GB',
      breakdown: {
        used: '23.4 GB',
        cached: '5.2 GB',
        available: '8.6 GB'
      }
    },
    disk: {
      current: 45.7,
      trend: '+0.9%',
      total: '1 TB',
      breakdown: {
        data: '387 GB',
        logs: '89 GB',
        cache: '67 GB',
        free: '457 GB'
      }
    },
    network: {
      inbound: 2.34,
      outbound: 1.89,
      latency: 23.4,
      bandwidth: '10 Gbps'
    }
  }

  const getThresholdColor = (current: number, warning: number, critical: number, invert = false) => {
    if (invert) {
      if (current < critical) return 'text-red-600'
      if (current < warning) return 'text-yellow-600'
      return 'text-green-600'
    } else {
      if (current > critical) return 'text-red-600'
      if (current > warning) return 'text-yellow-600'
      return 'text-green-600'
    }
  }

  const getTrendColor = (trend: string) => {
    if (trend.startsWith('+')) return 'text-red-600'
    if (trend.startsWith('-')) return 'text-green-600'
    return 'text-gray-600'
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const filteredServices = selectedService === 'all' 
    ? performanceMetrics.services 
    : performanceMetrics.services.filter(service => service.id === selectedService)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Performance Metrics
          </h1>
          <p className="text-lg text-[#374151]">
            Real-time performance monitoring, resource utilization, and optimization insights
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
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
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="response_time">Response Time</option>
              <option value="throughput">Throughput</option>
              <option value="error_rate">Error Rate</option>
              <option value="resource_usage">Resource Usage</option>
            </select>
            
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Services</option>
              {performanceMetrics.services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Export Performance Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Response Time</h3>
            <p className={`text-3xl font-bold ${getThresholdColor(
              performanceMetrics.summary.responseTime.current,
              alertThresholds.responseTime.warning,
              alertThresholds.responseTime.critical
            )}`}>
              {performanceMetrics.summary.responseTime.current}ms
            </p>
            <p className={`text-sm ${getTrendColor(performanceMetrics.summary.responseTime.trend)}`}>
              {performanceMetrics.summary.responseTime.trend} from last period
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Throughput</h3>
            <p className="text-3xl font-bold text-[#374151]">
              {formatNumber(performanceMetrics.summary.throughput.current)}
            </p>
            <p className={`text-sm ${getTrendColor(performanceMetrics.summary.throughput.trend)}`}>
              {performanceMetrics.summary.throughput.trend} requests/min
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Error Rate</h3>
            <p className={`text-3xl font-bold ${getThresholdColor(
              performanceMetrics.summary.errorRate.current,
              alertThresholds.errorRate.warning,
              alertThresholds.errorRate.critical
            )}`}>
              {performanceMetrics.summary.errorRate.current}%
            </p>
            <p className={`text-sm ${getTrendColor(performanceMetrics.summary.errorRate.trend)}`}>
              {performanceMetrics.summary.errorRate.trend} from target
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Availability</h3>
            <p className="text-3xl font-bold text-green-600">
              {performanceMetrics.summary.availability.current}%
            </p>
            <p className={`text-sm ${getTrendColor(performanceMetrics.summary.availability.trend)}`}>
              {performanceMetrics.summary.availability.trend} uptime
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Service Performance</h2>
              
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-[#374151] mb-3">{service.name}</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#374151]">{service.responseTime.avg}ms</div>
                        <div className="text-sm text-gray-500">Avg Response</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#374151]">{formatNumber(service.throughput)}</div>
                        <div className="text-sm text-gray-500">Req/Min</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getThresholdColor(
                          service.errorRate,
                          alertThresholds.errorRate.warning,
                          alertThresholds.errorRate.critical
                        )}`}>
                          {service.errorRate}%
                        </div>
                        <div className="text-sm text-gray-500">Error Rate</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getThresholdColor(
                          service.cpu,
                          alertThresholds.cpu.warning,
                          alertThresholds.cpu.critical
                        )}`}>
                          {service.cpu}%
                        </div>
                        <div className="text-sm text-gray-500">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-bold ${getThresholdColor(
                          service.memory,
                          alertThresholds.memory.warning,
                          alertThresholds.memory.critical
                        )}`}>
                          {service.memory}%
                        </div>
                        <div className="text-sm text-gray-500">Memory</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">P95 Response:</span>
                        <div className="font-medium text-[#374151]">{service.responseTime.p95}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-600">P99 Response:</span>
                        <div className="font-medium text-[#374151]">{service.responseTime.p99}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Network I/O:</span>
                        <div className="font-medium text-[#374151]">{service.networkIO} MB/s</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Connections:</span>
                        <div className="font-medium text-[#374151]">{formatNumber(service.connections)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Performance Trends</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-[#374151]">Time</th>
                      <th className="text-right py-2 text-[#374151]">Response Time</th>
                      <th className="text-right py-2 text-[#374151]">Throughput</th>
                      <th className="text-right py-2 text-[#374151]">Errors</th>
                      <th className="text-right py-2 text-[#374151]">CPU %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSeriesData.map((metric, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-[#374151]">{metric.time}</td>
                        <td className={`py-2 text-right ${getThresholdColor(
                          metric.responseTime,
                          alertThresholds.responseTime.warning,
                          alertThresholds.responseTime.critical
                        )}`}>
                          {metric.responseTime}ms
                        </td>
                        <td className="py-2 text-right text-[#374151]">{formatNumber(metric.throughput)}</td>
                        <td className="py-2 text-right text-red-600">{metric.errors}</td>
                        <td className={`py-2 text-right ${getThresholdColor(
                          metric.cpu,
                          alertThresholds.cpu.warning,
                          alertThresholds.cpu.critical
                        )}`}>
                          {metric.cpu}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Slow Queries Analysis</h2>
              
              <div className="space-y-4">
                {slowQueries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-medium text-[#374151]">Query #{query.id}</div>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-red-600 font-medium">{query.executionTime}s</span>
                        <span className="text-gray-500">{formatNumber(query.frequency)} executions</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded p-3 mb-3">
                      <code className="text-sm text-[#374151] font-mono">{query.query}</code>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Database:</span>
                        <span className="ml-2 text-[#374151] font-medium">{query.database}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Table:</span>
                        <span className="ml-2 text-[#374151] font-medium">{query.table}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <div className="text-sm text-gray-600 mb-1">Optimization Suggestion:</div>
                      <div className="text-sm text-blue-800">{query.optimization}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Resource Utilization</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#374151]">CPU Usage</span>
                    <span className={`text-sm font-medium ${getThresholdColor(
                      resourceUtilization.cpu.current,
                      alertThresholds.cpu.warning,
                      alertThresholds.cpu.critical
                    )}`}>
                      {resourceUtilization.cpu.current}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        resourceUtilization.cpu.current > alertThresholds.cpu.critical ? 'bg-red-500' :
                        resourceUtilization.cpu.current > alertThresholds.cpu.warning ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${resourceUtilization.cpu.current}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Peak: {resourceUtilization.cpu.peak}% • {resourceUtilization.cpu.cores} cores
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#374151]">Memory Usage</span>
                    <span className={`text-sm font-medium ${getThresholdColor(
                      resourceUtilization.memory.current,
                      alertThresholds.memory.warning,
                      alertThresholds.memory.critical
                    )}`}>
                      {resourceUtilization.memory.current}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        resourceUtilization.memory.current > alertThresholds.memory.critical ? 'bg-red-500' :
                        resourceUtilization.memory.current > alertThresholds.memory.warning ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${resourceUtilization.memory.current}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Used: {resourceUtilization.memory.breakdown.used} of {resourceUtilization.memory.total}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#374151]">Disk Usage</span>
                    <span className="text-sm font-medium text-[#374151]">{resourceUtilization.disk.current}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${resourceUtilization.disk.current}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Free: {resourceUtilization.disk.breakdown.free} of {resourceUtilization.disk.total}
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <h3 className="font-medium text-[#374151] mb-2">Network Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Inbound:</span>
                      <span className="text-[#374151]">{resourceUtilization.network.inbound} GB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Outbound:</span>
                      <span className="text-[#374151]">{resourceUtilization.network.outbound} GB/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Latency:</span>
                      <span className="text-[#374151]">{resourceUtilization.network.latency}ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Alert Thresholds</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#374151]">Response Time</span>
                    <span className={`text-sm font-medium ${getThresholdColor(
                      alertThresholds.responseTime.current,
                      alertThresholds.responseTime.warning,
                      alertThresholds.responseTime.critical
                    )}`}>
                      {alertThresholds.responseTime.current}ms
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Warning: {alertThresholds.responseTime.warning}ms • Critical: {alertThresholds.responseTime.critical}ms
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#374151]">Error Rate</span>
                    <span className={`text-sm font-medium ${getThresholdColor(
                      alertThresholds.errorRate.current,
                      alertThresholds.errorRate.warning,
                      alertThresholds.errorRate.critical
                    )}`}>
                      {alertThresholds.errorRate.current}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Warning: {alertThresholds.errorRate.warning}% • Critical: {alertThresholds.errorRate.critical}%
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#374151]">CPU Usage</span>
                    <span className={`text-sm font-medium ${getThresholdColor(
                      alertThresholds.cpu.current,
                      alertThresholds.cpu.warning,
                      alertThresholds.cpu.critical
                    )}`}>
                      {alertThresholds.cpu.current}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Warning: {alertThresholds.cpu.warning}% • Critical: {alertThresholds.cpu.critical}%
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Performance Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Optimize Slow Queries
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Configure Alerts
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Resource Planning
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Performance Baseline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}