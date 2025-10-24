'use client'

import React, { useState } from 'react'

export default function SystemMonitoringPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h')
  const [selectedService, setSelectedService] = useState('all')
  const [refreshInterval, setRefreshInterval] = useState('30s')

  const systemMetrics = {
    overall: {
      status: 'healthy',
      uptime: 99.97,
      responseTime: 145,
      errorRate: 0.03,
      activeUsers: 2847,
      requestsPerMinute: 15672
    },
    services: [
      {
        id: 'api_gateway',
        name: 'API Gateway',
        status: 'healthy',
        uptime: 99.98,
        responseTime: 45,
        errorRate: 0.01,
        requestsPerMinute: 8934,
        cpu: 34.2,
        memory: 67.8,
        instances: 3,
        version: '2.1.4'
      },
      {
        id: 'risk_engine',
        name: 'Risk Assessment Engine',
        status: 'healthy',
        uptime: 99.95,
        responseTime: 234,
        errorRate: 0.05,
        requestsPerMinute: 2156,
        cpu: 78.5,
        memory: 82.1,
        instances: 2,
        version: '1.7.2'
      },
      {
        id: 'data_pipeline',
        name: 'Data Processing Pipeline',
        status: 'warning',
        uptime: 99.89,
        responseTime: 567,
        errorRate: 0.12,
        requestsPerMinute: 1234,
        cpu: 45.6,
        memory: 71.3,
        instances: 4,
        version: '3.2.1'
      },
      {
        id: 'cache_layer',
        name: 'Cache Layer (Redis)',
        status: 'healthy',
        uptime: 99.99,
        responseTime: 12,
        errorRate: 0.00,
        requestsPerMinute: 12456,
        cpu: 23.1,
        memory: 45.7,
        instances: 2,
        version: '7.2.0'
      },
      {
        id: 'database',
        name: 'Primary Database',
        status: 'healthy',
        uptime: 99.96,
        responseTime: 89,
        errorRate: 0.02,
        requestsPerMinute: 5678,
        cpu: 56.3,
        memory: 73.9,
        instances: 1,
        version: '15.4'
      },
      {
        id: 'ml_service',
        name: 'Machine Learning Service',
        status: 'healthy',
        uptime: 99.92,
        responseTime: 445,
        errorRate: 0.08,
        requestsPerMinute: 567,
        cpu: 89.2,
        memory: 91.4,
        instances: 3,
        version: '2.3.1'
      },
      {
        id: 'notification_service',
        name: 'Notification Service',
        status: 'maintenance',
        uptime: 98.45,
        responseTime: 123,
        errorRate: 1.25,
        requestsPerMinute: 234,
        cpu: 12.4,
        memory: 34.2,
        instances: 1,
        version: '1.5.8'
      },
      {
        id: 'external_apis',
        name: 'External API Aggregator',
        status: 'healthy',
        uptime: 99.85,
        responseTime: 1234,
        errorRate: 0.15,
        requestsPerMinute: 890,
        cpu: 41.7,
        memory: 58.3,
        instances: 2,
        version: '4.1.0'
      }
    ]
  }

  const infrastructureMetrics = {
    servers: [
      {
        id: 'web_01',
        name: 'Web Server 01',
        region: 'US-East',
        status: 'healthy',
        cpu: 45.2,
        memory: 67.8,
        disk: 34.5,
        network: 'Normal',
        uptime: '47d 12h 34m'
      },
      {
        id: 'web_02',
        name: 'Web Server 02',
        region: 'US-East',
        status: 'healthy',
        cpu: 52.1,
        memory: 71.3,
        disk: 28.9,
        network: 'Normal',
        uptime: '47d 12h 34m'
      },
      {
        id: 'api_01',
        name: 'API Server 01',
        region: 'US-East',
        status: 'warning',
        cpu: 89.7,
        memory: 91.2,
        disk: 78.4,
        network: 'High',
        uptime: '23d 8h 15m'
      },
      {
        id: 'db_01',
        name: 'Database Server',
        region: 'US-East',
        status: 'healthy',
        cpu: 56.3,
        memory: 73.9,
        disk: 45.2,
        network: 'Normal',
        uptime: '127d 4h 22m'
      }
    ],
    network: {
      inbound: 2.34,
      outbound: 1.89,
      latency: 23.4,
      packetLoss: 0.01
    }
  }

  const recentAlerts = [
    {
      id: 1,
      severity: 'warning',
      service: 'Data Processing Pipeline',
      message: 'High response times detected',
      timestamp: '2024-10-24T08:15:00Z',
      status: 'acknowledged',
      details: 'Average response time increased to 567ms (threshold: 500ms)'
    },
    {
      id: 2,
      severity: 'info',
      service: 'Notification Service',
      message: 'Scheduled maintenance started',
      timestamp: '2024-10-24T08:00:00Z',
      status: 'active',
      details: 'Routine maintenance window for notification service updates'
    },
    {
      id: 3,
      severity: 'critical',
      service: 'API Server 01',
      message: 'High CPU utilization',
      timestamp: '2024-10-24T07:45:00Z',
      status: 'resolved',
      details: 'CPU usage exceeded 90% for 15 minutes, auto-scaling triggered'
    },
    {
      id: 4,
      severity: 'warning',
      service: 'External API Aggregator',
      message: 'Increased error rate from FRED API',
      timestamp: '2024-10-24T07:30:00Z',
      status: 'investigating',
      details: 'Error rate from FRED API increased to 0.8% (normal: 0.1%)'
    },
    {
      id: 5,
      severity: 'info',
      service: 'Cache Layer',
      message: 'Cache warmed successfully',
      timestamp: '2024-10-24T07:15:00Z',
      status: 'resolved',
      details: 'Cache warming completed for economic indicators dataset'
    }
  ]

  const performanceMetrics = [
    { time: '08:00', requests: 14500, responseTime: 142, errors: 12 },
    { time: '08:05', requests: 15200, responseTime: 138, errors: 8 },
    { time: '08:10', requests: 16100, responseTime: 145, errors: 15 },
    { time: '08:15', requests: 15800, responseTime: 149, errors: 11 },
    { time: '08:20', requests: 15600, responseTime: 143, errors: 9 },
    { time: '08:25', requests: 16400, responseTime: 147, errors: 13 },
    { time: '08:30', requests: 15900, responseTime: 144, errors: 7 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'info':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'acknowledged':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'investigating':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'active':
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

  const filteredServices = selectedService === 'all' 
    ? systemMetrics.services 
    : systemMetrics.services.filter(service => service.id === selectedService)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            System Monitoring
          </h1>
          <p className="text-lg text-[#374151]">
            Real-time system health, performance metrics, and infrastructure monitoring
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
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Services</option>
              {systemMetrics.services.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
            
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="10s">10 seconds</option>
              <option value="30s">30 seconds</option>
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
              Refresh Now
            </button>
            <button className="border border-[#1e3a8a] text-[#1e3a8a] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">System Status</h3>
            <p className={`text-2xl font-bold ${getStatusColor(systemMetrics.overall.status).includes('green') ? 'text-green-600' : 'text-yellow-600'}`}>
              {systemMetrics.overall.status}
            </p>
            <p className="text-sm text-gray-500">Overall health</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Uptime</h3>
            <p className="text-2xl font-bold text-green-600">{systemMetrics.overall.uptime}%</p>
            <p className="text-sm text-gray-500">Last 30 days</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Response Time</h3>
            <p className="text-2xl font-bold text-[#374151]">{systemMetrics.overall.responseTime}ms</p>
            <p className="text-sm text-gray-500">Average response</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Error Rate</h3>
            <p className="text-2xl font-bold text-green-600">{systemMetrics.overall.errorRate}%</p>
            <p className="text-sm text-gray-500">System errors</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Active Users</h3>
            <p className="text-2xl font-bold text-[#374151]">{formatNumber(systemMetrics.overall.activeUsers)}</p>
            <p className="text-sm text-gray-500">Current sessions</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Requests/Min</h3>
            <p className="text-2xl font-bold text-[#374151]">{formatNumber(systemMetrics.overall.requestsPerMinute)}</p>
            <p className="text-sm text-gray-500">Current load</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Service Health</h2>
              
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[#374151]">{service.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <span className="text-sm text-gray-500">v{service.version}</span>
                      </div>
                      <span className="text-sm text-gray-500">{service.instances} instances</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-green-600">{service.uptime}%</div>
                        <div className="text-gray-500">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[#374151]">{service.responseTime}ms</div>
                        <div className="text-gray-500">Response</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{service.errorRate}%</div>
                        <div className="text-gray-500">Errors</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[#374151]">{formatNumber(service.requestsPerMinute)}</div>
                        <div className="text-gray-500">Req/Min</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${service.cpu > 80 ? 'text-red-600' : service.cpu > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {service.cpu}%
                        </div>
                        <div className="text-gray-500">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${service.memory > 80 ? 'text-red-600' : service.memory > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {service.memory}%
                        </div>
                        <div className="text-gray-500">Memory</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Infrastructure Status</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {infrastructureMetrics.servers.map((server) => (
                  <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#374151]">{server.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(server.status)}`}>
                        {server.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{server.region} • {server.uptime}</div>
                    
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className={`font-bold ${server.cpu > 80 ? 'text-red-600' : 'text-[#374151]'}`}>
                          {server.cpu}%
                        </div>
                        <div className="text-gray-500">CPU</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${server.memory > 80 ? 'text-red-600' : 'text-[#374151]'}`}>
                          {server.memory}%
                        </div>
                        <div className="text-gray-500">Memory</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${server.disk > 80 ? 'text-red-600' : 'text-[#374151]'}`}>
                          {server.disk}%
                        </div>
                        <div className="text-gray-500">Disk</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${server.network === 'High' ? 'text-yellow-600' : 'text-[#374151]'}`}>
                          {server.network}
                        </div>
                        <div className="text-gray-500">Network</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-[#374151] mb-3">Network Performance</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-[#374151]">{infrastructureMetrics.network.inbound} GB/s</div>
                    <div className="text-gray-500">Inbound</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#374151]">{infrastructureMetrics.network.outbound} GB/s</div>
                    <div className="text-gray-500">Outbound</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-[#374151]">{infrastructureMetrics.network.latency}ms</div>
                    <div className="text-gray-500">Latency</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{infrastructureMetrics.network.packetLoss}%</div>
                    <div className="text-gray-500">Packet Loss</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Performance Trends</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-[#374151]">Time</th>
                      <th className="text-right py-2 text-[#374151]">Requests</th>
                      <th className="text-right py-2 text-[#374151]">Response Time</th>
                      <th className="text-right py-2 text-[#374151]">Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceMetrics.map((metric, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-[#374151]">{metric.time}</td>
                        <td className="py-2 text-right text-[#374151]">{formatNumber(metric.requests)}</td>
                        <td className="py-2 text-right text-[#374151]">{metric.responseTime}ms</td>
                        <td className="py-2 text-right text-red-600">{metric.errors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Recent Alerts</h2>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAlertStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-[#374151] mb-1">{alert.message}</h3>
                    <div className="text-sm text-gray-600 mb-2">{alert.service}</div>
                    <div className="text-sm text-gray-500 mb-2">{formatTimestamp(alert.timestamp)}</div>
                    <div className="text-sm text-[#374151]">{alert.details}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                View All Alerts
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  View Health Dashboard
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Performance Metrics
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Alert Management
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  System Logs
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">System Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Healthy Services</span>
                  <span className="text-sm font-medium text-green-600">
                    {systemMetrics.services.filter(s => s.status === 'healthy').length}/{systemMetrics.services.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Active Servers</span>
                  <span className="text-sm font-medium text-[#374151]">
                    {infrastructureMetrics.servers.filter(s => s.status !== 'maintenance').length}/{infrastructureMetrics.servers.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Open Alerts</span>
                  <span className="text-sm font-medium text-red-600">
                    {recentAlerts.filter(a => a.status === 'active' || a.status === 'investigating').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Response Time SLA</span>
                  <span className="text-sm font-medium text-green-600">Met</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}