'use client'

import React, { useState } from 'react'

export default function SystemHealthPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [healthCheck, setHealthCheck] = useState('detailed')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const healthChecks = [
    {
      id: 'api_gateway',
      name: 'API Gateway',
      category: 'core',
      status: 'healthy',
      lastCheck: '2024-10-24T08:30:00Z',
      responseTime: 45,
      checks: {
        connectivity: { status: 'pass', message: 'All endpoints responding' },
        authentication: { status: 'pass', message: 'Auth service operational' },
        rateLimit: { status: 'pass', message: 'Rate limiting functional' },
        loadBalancer: { status: 'pass', message: 'Load balancer healthy' }
      },
      dependencies: ['authentication_service', 'rate_limiter'],
      uptime: 99.98,
      availability: 99.95
    },
    {
      id: 'risk_engine',
      name: 'Risk Assessment Engine',
      category: 'core',
      status: 'healthy',
      lastCheck: '2024-10-24T08:29:00Z',
      responseTime: 234,
      checks: {
        computation: { status: 'pass', message: 'Risk calculations operational' },
        dataAccess: { status: 'pass', message: 'Data access layer healthy' },
        caching: { status: 'pass', message: 'Cache layer responsive' },
        modelService: { status: 'pass', message: 'risk models serving predictions' }
      },
      dependencies: ['database', 'cache_layer', 'ml_service'],
      uptime: 99.95,
      availability: 99.92
    },
    {
      id: 'database',
      name: 'Primary Database',
      category: 'infrastructure',
      status: 'healthy',
      lastCheck: '2024-10-24T08:28:00Z',
      responseTime: 89,
      checks: {
        connectivity: { status: 'pass', message: 'Database connections healthy' },
        performance: { status: 'pass', message: 'Query performance optimal' },
        replication: { status: 'pass', message: 'Replication lag minimal' },
        diskSpace: { status: 'pass', message: 'Disk usage within limits' }
      },
      dependencies: [],
      uptime: 99.96,
      availability: 99.94
    },
    {
      id: 'cache_layer',
      name: 'Cache Layer (Redis)',
      category: 'infrastructure',
      status: 'healthy',
      lastCheck: '2024-10-24T08:30:00Z',
      responseTime: 12,
      checks: {
        connectivity: { status: 'pass', message: 'Redis cluster operational' },
        memory: { status: 'pass', message: 'Memory usage normal' },
        hitRate: { status: 'pass', message: 'Cache hit rate optimal' },
        replication: { status: 'pass', message: 'Master-slave sync healthy' }
      },
      dependencies: [],
      uptime: 99.99,
      availability: 99.97
    },
    {
      id: 'data_pipeline',
      name: 'Data Processing Pipeline',
      category: 'data',
      status: 'warning',
      lastCheck: '2024-10-24T08:27:00Z',
      responseTime: 567,
      checks: {
        ingestion: { status: 'pass', message: 'Data ingestion operational' },
        processing: { status: 'warning', message: 'Processing queue backing up' },
        validation: { status: 'pass', message: 'Data validation active' },
        output: { status: 'pass', message: 'Data output stream healthy' }
      },
      dependencies: ['external_apis', 'database', 'cache_layer'],
      uptime: 99.89,
      availability: 99.76
    },
    {
      id: 'ml_service',
      name: 'Machine Learning Service',
      category: 'ai',
      status: 'healthy',
      lastCheck: '2024-10-24T08:29:00Z',
      responseTime: 445,
      checks: {
        modelLoading: { status: 'pass', message: 'All models loaded successfully' },
        prediction: { status: 'pass', message: 'Prediction endpoints responsive' },
        training: { status: 'pass', message: 'Model training pipeline active' },
        resources: { status: 'pass', message: 'GPU/CPU resources sufficient' }
      },
      dependencies: ['database', 'model_storage'],
      uptime: 99.92,
      availability: 99.88
    },
    {
      id: 'external_apis',
      name: 'External API Aggregator',
      category: 'integration',
      status: 'degraded',
      lastCheck: '2024-10-24T08:25:00Z',
      responseTime: 1234,
      checks: {
        fredApi: { status: 'pass', message: 'FRED API responding normally' },
        beaApi: { status: 'warning', message: 'BEA API slow response times' },
        blsApi: { status: 'pass', message: 'BLS API operational' },
        censusApi: { status: 'fail', message: 'Census API connection timeout' }
      },
      dependencies: [],
      uptime: 99.85,
      availability: 98.92
    },
    {
      id: 'notification_service',
      name: 'Notification Service',
      category: 'communication',
      status: 'maintenance',
      lastCheck: '2024-10-24T08:00:00Z',
      responseTime: 0,
      checks: {
        emailService: { status: 'maintenance', message: 'Scheduled maintenance in progress' },
        smsService: { status: 'maintenance', message: 'Service temporarily disabled' },
        webhooks: { status: 'maintenance', message: 'Webhook delivery paused' },
        templates: { status: 'pass', message: 'Template service operational' }
      },
      dependencies: ['template_service'],
      uptime: 98.45,
      availability: 97.23
    }
  ]

  const systemVitals = {
    overall: {
      status: 'healthy',
      score: 97.2,
      critical: 0,
      warning: 2,
      healthy: 6,
      maintenance: 1
    },
    categories: {
      core: { healthy: 2, warning: 0, critical: 0, maintenance: 0 },
      infrastructure: { healthy: 2, warning: 1, critical: 0, maintenance: 0 },
      data: { healthy: 0, warning: 1, critical: 0, maintenance: 0 },
      ai: { healthy: 1, warning: 0, critical: 0, maintenance: 0 },
      integration: { healthy: 0, warning: 0, critical: 0, maintenance: 1 },
      communication: { healthy: 0, warning: 0, critical: 0, maintenance: 1 }
    },
    slaMetrics: {
      uptime: 99.94,
      availability: 99.89,
      responseTime: 187,
      errorRate: 0.08,
      target: {
        uptime: 99.9,
        availability: 99.5,
        responseTime: 500,
        errorRate: 0.1
      }
    }
  }

  const incidentHistory = [
    {
      id: 1,
      title: 'Census API Connection Timeout',
      severity: 'warning',
      status: 'investigating',
      startTime: '2024-10-24T08:25:00Z',
      duration: '5 minutes',
      affectedServices: ['external_apis', 'data_pipeline'],
      description: 'Intermittent connection timeouts to Census Bureau API causing data ingestion delays'
    },
    {
      id: 2,
      title: 'Data Processing Queue Backup',
      severity: 'warning',
      status: 'monitoring',
      startTime: '2024-10-24T07:45:00Z',
      duration: '45 minutes',
      affectedServices: ['data_pipeline'],
      description: 'Processing queue experiencing higher than normal volume, causing delays'
    },
    {
      id: 3,
      title: 'Notification Service Maintenance',
      severity: 'info',
      status: 'scheduled',
      startTime: '2024-10-24T08:00:00Z',
      duration: '2 hours',
      affectedServices: ['notification_service'],
      description: 'Scheduled maintenance for notification service infrastructure updates'
    },
    {
      id: 4,
      title: 'API Server High CPU Usage',
      severity: 'warning',
      status: 'resolved',
      startTime: '2024-10-24T07:30:00Z',
      duration: '15 minutes',
      affectedServices: ['api_gateway'],
      description: 'API server experienced high CPU usage, auto-scaling resolved the issue'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'degraded':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'maintenance':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'fail':
        return 'text-red-600'
      case 'maintenance':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const filteredHealthChecks = selectedCategory === 'all' 
    ? healthChecks 
    : healthChecks.filter(check => check.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            System Health
          </h1>
          <p className="text-lg text-[#374151]">
            Comprehensive health monitoring and dependency tracking for all system components
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
              <option value="core">Core Services</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="data">Data Services</option>
              <option value="ai">Risk Intelligence Services</option>
              <option value="integration">Integration</option>
              <option value="communication">Communication</option>
            </select>
            
            <select
              value={healthCheck}
              onChange={(e) => setHealthCheck(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="detailed">Detailed Checks</option>
              <option value="summary">Summary View</option>
              <option value="dependencies">Dependencies</option>
            </select>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-[#1e3a8a] focus:ring-[#1e3a8a]"
              />
              <span className="text-sm text-[#374151]">Auto-refresh (30s)</span>
            </label>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Run All Health Checks
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Overall Health</h3>
            <p className="text-3xl font-bold text-green-600">{systemVitals.overall.score}%</p>
            <p className="text-sm text-gray-500">System health score</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Healthy</h3>
            <p className="text-3xl font-bold text-green-600">{systemVitals.overall.healthy}</p>
            <p className="text-sm text-gray-500">Services operational</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Warnings</h3>
            <p className="text-3xl font-bold text-yellow-600">{systemVitals.overall.warning}</p>
            <p className="text-sm text-gray-500">Issues detected</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Critical</h3>
            <p className="text-3xl font-bold text-red-600">{systemVitals.overall.critical}</p>
            <p className="text-sm text-gray-500">Critical failures</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">SLA Uptime</h3>
            <p className="text-3xl font-bold text-green-600">{systemVitals.slaMetrics.uptime}%</p>
            <p className="text-sm text-gray-500">Target: {systemVitals.slaMetrics.target.uptime}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Response Time</h3>
            <p className="text-3xl font-bold text-green-600">{systemVitals.slaMetrics.responseTime}ms</p>
            <p className="text-sm text-gray-500">Target: &lt;{systemVitals.slaMetrics.target.responseTime}ms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Service Health Checks</h2>
              
              <div className="space-y-4">
                {filteredHealthChecks.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[#374151]">{service.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {service.category}
                        </span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-[#374151]">{service.responseTime}ms</div>
                        <div className="text-gray-500">response time</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{service.uptime}%</div>
                        <div className="text-sm text-gray-500">Uptime</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{service.availability}%</div>
                        <div className="text-sm text-gray-500">Availability</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Last Check</div>
                        <div className="text-sm text-[#374151]">{formatTimestamp(service.lastCheck)}</div>
                      </div>
                    </div>
                    
                    {healthCheck === 'detailed' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-[#374151] mb-3">Health Checks</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Object.entries(service.checks).map(([checkName, check]) => (
                            <div key={checkName} className="flex items-center justify-between">
                              <span className="text-sm text-[#374151] capitalize">{checkName.replace(/([A-Z])/g, ' $1')}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${getCheckStatusColor(check.status)}`}>
                                  {check.status}
                                </span>
                                <span className="text-xs text-gray-500" title={check.message}>ℹ️</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {healthCheck === 'dependencies' && service.dependencies.length > 0 && (
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-[#374151] mb-3">Dependencies</h4>
                        <div className="flex flex-wrap gap-2">
                          {service.dependencies.map((dep) => (
                            <span key={dep} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {dep.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Recent Incidents</h2>
              
              <div className="space-y-4">
                {incidentHistory.map((incident) => (
                  <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-[#374151]">{incident.title}</h3>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          incident.status === 'resolved' ? 'text-green-600 bg-green-100 border-green-200' :
                          incident.status === 'investigating' ? 'text-red-600 bg-red-100 border-red-200' :
                          incident.status === 'monitoring' ? 'text-yellow-600 bg-yellow-100 border-yellow-200' :
                          'text-blue-600 bg-blue-100 border-blue-200'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Started:</span>
                        <div className="text-[#374151]">{formatTimestamp(incident.startTime)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <div className="text-[#374151]">{incident.duration}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Affected Services:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {incident.affectedServices.map((service) => (
                            <span key={service} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {service.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">SLA Metrics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Uptime</span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      systemVitals.slaMetrics.uptime >= systemVitals.slaMetrics.target.uptime 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemVitals.slaMetrics.uptime}%
                    </div>
                    <div className="text-xs text-gray-500">Target: {systemVitals.slaMetrics.target.uptime}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Availability</span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      systemVitals.slaMetrics.availability >= systemVitals.slaMetrics.target.availability 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemVitals.slaMetrics.availability}%
                    </div>
                    <div className="text-xs text-gray-500">Target: {systemVitals.slaMetrics.target.availability}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Response Time</span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      systemVitals.slaMetrics.responseTime <= systemVitals.slaMetrics.target.responseTime 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemVitals.slaMetrics.responseTime}ms
                    </div>
                    <div className="text-xs text-gray-500">Target: &lt;{systemVitals.slaMetrics.target.responseTime}ms</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Error Rate</span>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      systemVitals.slaMetrics.errorRate <= systemVitals.slaMetrics.target.errorRate 
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {systemVitals.slaMetrics.errorRate}%
                    </div>
                    <div className="text-xs text-gray-500">Target: &lt;{systemVitals.slaMetrics.target.errorRate}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Health by Category</h2>
              <div className="space-y-3">
                {Object.entries(systemVitals.categories).map(([category, stats]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-[#374151] capitalize">{category}</span>
                    <div className="flex space-x-1 text-xs">
                      {stats.healthy > 0 && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {stats.healthy} healthy
                        </span>
                      )}
                      {stats.warning > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {stats.warning} warning
                        </span>
                      )}
                      {stats.critical > 0 && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                          {stats.critical} critical
                        </span>
                      )}
                      {stats.maintenance > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {stats.maintenance} maintenance
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Generate Health Report
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Configure Monitoring
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  View Dependencies
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Incident Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}