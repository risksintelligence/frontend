'use client'

import React, { useState } from 'react'

export default function AlertsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h')

  const alerts = [
    {
      id: 1,
      title: 'High CPU Usage on API Server 01',
      severity: 'critical',
      status: 'active',
      service: 'API Gateway',
      metric: 'CPU Usage',
      threshold: '90%',
      currentValue: '94.7%',
      description: 'CPU utilization has exceeded the critical threshold of 90% for more than 15 minutes',
      timestamp: '2024-10-24T08:35:00Z',
      duration: '12 minutes',
      affectedUsers: 2847,
      escalated: true,
      assignee: 'DevOps Team',
      runbook: 'cpu-high-usage-runbook'
    },
    {
      id: 2,
      title: 'Database Connection Pool Exhaustion',
      severity: 'critical',
      status: 'acknowledged',
      service: 'Primary Database',
      metric: 'Connection Pool',
      threshold: '95%',
      currentValue: '98%',
      description: 'Database connection pool is nearly exhausted, causing connection timeouts',
      timestamp: '2024-10-24T08:30:00Z',
      duration: '17 minutes',
      affectedUsers: 1523,
      escalated: true,
      assignee: 'Database Team',
      runbook: 'db-connection-pool-runbook'
    },
    {
      id: 3,
      title: 'External API Response Time Degradation',
      severity: 'warning',
      status: 'investigating',
      service: 'External API Aggregator',
      metric: 'Response Time',
      threshold: '5000ms',
      currentValue: '7234ms',
      description: 'FRED API response times have increased significantly above normal thresholds',
      timestamp: '2024-10-24T08:25:00Z',
      duration: '22 minutes',
      affectedUsers: 456,
      escalated: false,
      assignee: 'Integration Team',
      runbook: 'external-api-slow-runbook'
    },
    {
      id: 4,
      title: 'Cache Hit Rate Below Threshold',
      severity: 'warning',
      status: 'resolved',
      service: 'Cache Layer',
      metric: 'Hit Rate',
      threshold: '95%',
      currentValue: '87%',
      description: 'Redis cache hit rate has fallen below the acceptable threshold',
      timestamp: '2024-10-24T08:15:00Z',
      duration: '8 minutes',
      affectedUsers: 234,
      escalated: false,
      assignee: 'Platform Team',
      runbook: 'cache-hit-rate-runbook'
    },
    {
      id: 5,
      title: 'Disk Space Warning on Log Server',
      severity: 'warning',
      status: 'active',
      service: 'Log Management',
      metric: 'Disk Usage',
      threshold: '80%',
      currentValue: '85%',
      description: 'Log server disk usage is approaching capacity limits',
      timestamp: '2024-10-24T08:10:00Z',
      duration: '37 minutes',
      affectedUsers: 0,
      escalated: false,
      assignee: 'Infrastructure Team',
      runbook: 'disk-space-cleanup-runbook'
    },
    {
      id: 6,
      title: 'ML Model Prediction Latency Spike',
      severity: 'warning',
      status: 'monitoring',
      service: 'Machine Learning Service',
      metric: 'Prediction Latency',
      threshold: '1000ms',
      currentValue: '1456ms',
      description: 'Risk assessment model predictions are taking longer than expected',
      timestamp: '2024-10-24T08:05:00Z',
      duration: '42 minutes',
      affectedUsers: 89,
      escalated: false,
      assignee: 'Analytics Team',
      runbook: 'ml-latency-troubleshooting'
    },
    {
      id: 7,
      title: 'Network Packet Loss Detected',
      severity: 'info',
      status: 'resolved',
      service: 'Network Infrastructure',
      metric: 'Packet Loss',
      threshold: '0.1%',
      currentValue: '0.3%',
      description: 'Intermittent packet loss detected on primary network interface',
      timestamp: '2024-10-24T07:45:00Z',
      duration: '5 minutes',
      affectedUsers: 12,
      escalated: false,
      assignee: 'Network Team',
      runbook: 'network-packet-loss-runbook'
    },
    {
      id: 8,
      title: 'Scheduled Maintenance Window Started',
      severity: 'info',
      status: 'scheduled',
      service: 'Notification Service',
      metric: 'Service Status',
      threshold: 'N/A',
      currentValue: 'Maintenance',
      description: 'Scheduled maintenance window for notification service upgrades',
      timestamp: '2024-10-24T08:00:00Z',
      duration: '2 hours',
      affectedUsers: 0,
      escalated: false,
      assignee: 'Maintenance Team',
      runbook: 'scheduled-maintenance-runbook'
    }
  ]

  const alertRules = [
    {
      id: 1,
      name: 'High CPU Usage',
      service: 'All Services',
      metric: 'CPU Utilization',
      condition: '> 80% for 10 minutes',
      severity: 'warning',
      enabled: true,
      notifications: ['email', 'slack'],
      escalation: '90% for 5 minutes → critical'
    },
    {
      id: 2,
      name: 'Critical CPU Usage',
      service: 'All Services',
      metric: 'CPU Utilization',
      condition: '> 90% for 5 minutes',
      severity: 'critical',
      enabled: true,
      notifications: ['email', 'slack', 'pagerduty'],
      escalation: 'Immediate escalation to DevOps'
    },
    {
      id: 3,
      name: 'High Memory Usage',
      service: 'All Services',
      metric: 'Memory Utilization',
      condition: '> 85% for 15 minutes',
      severity: 'warning',
      enabled: true,
      notifications: ['email', 'slack'],
      escalation: '95% for 5 minutes → critical'
    },
    {
      id: 4,
      name: 'Database Connection Pool',
      service: 'Primary Database',
      metric: 'Connection Pool Usage',
      condition: '> 90% for 5 minutes',
      severity: 'critical',
      enabled: true,
      notifications: ['email', 'slack', 'pagerduty'],
      escalation: 'Immediate escalation to DBA team'
    },
    {
      id: 5,
      name: 'API Response Time',
      service: 'API Gateway',
      metric: 'Average Response Time',
      condition: '> 500ms for 10 minutes',
      severity: 'warning',
      enabled: true,
      notifications: ['email', 'slack'],
      escalation: '> 1000ms for 5 minutes → critical'
    },
    {
      id: 6,
      name: 'Error Rate Spike',
      service: 'All Services',
      metric: 'Error Rate',
      condition: '> 1% for 5 minutes',
      severity: 'critical',
      enabled: true,
      notifications: ['email', 'slack', 'pagerduty'],
      escalation: 'Immediate escalation to engineering'
    }
  ]

  const alertChannels = [
    {
      id: 'email',
      name: 'Email Notifications',
      type: 'email',
      enabled: true,
      recipients: ['devops@company.com', 'alerts@company.com'],
      settings: {
        format: 'html',
        grouping: '5 minutes',
        rateLimit: '10 per hour'
      }
    },
    {
      id: 'slack',
      name: 'Slack #alerts Channel',
      type: 'slack',
      enabled: true,
      webhook: 'https://hooks.slack.com/services/...',
      settings: {
        channel: '#alerts',
        username: 'RiskX Monitor',
        grouping: 'immediate'
      }
    },
    {
      id: 'pagerduty',
      name: 'PagerDuty Integration',
      type: 'pagerduty',
      enabled: true,
      apiKey: 'pd_key_***',
      settings: {
        service: 'RiskX Platform',
        escalationPolicy: 'Default',
        autoResolve: true
      }
    },
    {
      id: 'webhook',
      name: 'Custom Webhook',
      type: 'webhook',
      enabled: false,
      url: 'https://api.company.com/alerts',
      settings: {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ***' },
        timeout: '30s'
      }
    }
  ]

  const alertStats = {
    total: alerts.length,
    active: alerts.filter(a => a.status === 'active').length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    avgResolutionTime: '23 minutes',
    escalationRate: '12.5%'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100 border-red-200'
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'investigating':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'monitoring':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'resolved':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'scheduled':
        return 'text-purple-600 bg-purple-100 border-purple-200'
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

  const filteredAlerts = alerts.filter(alert => {
    if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
      return false
    }
    if (selectedStatus !== 'all' && alert.status !== selectedStatus) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">
            Alert Management
          </h1>
          <p className="text-lg text-[#374151]">
            Monitor system alerts, configure notification rules, and manage incident response
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="investigating">Investigating</option>
              <option value="monitoring">Monitoring</option>
              <option value="resolved">Resolved</option>
            </select>
            
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          
          <button className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Create Alert Rule
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Total Alerts</h3>
            <p className="text-3xl font-bold text-[#374151]">{alertStats.total}</p>
            <p className="text-sm text-gray-500">In selected timeframe</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Active</h3>
            <p className="text-3xl font-bold text-red-600">{alertStats.active}</p>
            <p className="text-sm text-gray-500">Requiring attention</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Critical</h3>
            <p className="text-3xl font-bold text-red-600">{alertStats.critical}</p>
            <p className="text-sm text-gray-500">High priority</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-green-600">{alertStats.resolved}</p>
            <p className="text-sm text-gray-500">Successfully closed</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Avg Resolution</h3>
            <p className="text-3xl font-bold text-[#374151]">{alertStats.avgResolutionTime}</p>
            <p className="text-sm text-gray-500">Time to resolve</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">Escalation Rate</h3>
            <p className="text-3xl font-bold text-yellow-600">{alertStats.escalationRate}</p>
            <p className="text-sm text-gray-500">Alerts escalated</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">
                Active Alerts ({filteredAlerts.length})
              </h2>
              
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-[#374151]">{alert.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                        {alert.escalated && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200">
                            escalated
                          </span>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-[#374151]">{alert.duration}</div>
                        <div className="text-gray-500">duration</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Service:</span>
                        <div className="font-medium text-[#374151]">{alert.service}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Metric:</span>
                        <div className="font-medium text-[#374151]">{alert.metric}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Current Value:</span>
                        <div className="font-medium text-red-600">{alert.currentValue}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Threshold:</span>
                        <div className="font-medium text-gray-500">{alert.threshold}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-600">Started:</span>
                        <div className="text-[#374151]">{formatTimestamp(alert.timestamp)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Affected Users:</span>
                        <div className="text-[#374151]">{formatNumber(alert.affectedUsers)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Assigned to:</span>
                        <div className="text-[#374151]">{alert.assignee}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex space-x-2">
                        {alert.status === 'active' && (
                          <button className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors">
                            Acknowledge
                          </button>
                        )}
                        {(alert.status === 'active' || alert.status === 'acknowledged') && (
                          <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 transition-colors">
                            Resolve
                          </button>
                        )}
                        <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200 transition-colors">
                          View Runbook
                        </button>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {alert.id} • Runbook: {alert.runbook}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Alert Rules</h2>
              
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-[#374151]">{rule.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(rule.severity)}`}>
                          {rule.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          rule.enabled ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200'
                        }`}>
                          {rule.enabled ? 'enabled' : 'disabled'}
                        </span>
                      </div>
                      <button className="text-[#1e3a8a] hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Service:</span>
                        <div className="font-medium text-[#374151]">{rule.service}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Metric:</span>
                        <div className="font-medium text-[#374151]">{rule.metric}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Condition:</span>
                        <div className="font-medium text-[#374151]">{rule.condition}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Notifications:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.notifications.map((notification) => (
                            <span key={notification} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {notification}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {rule.escalation && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded">
                        <div className="text-sm text-gray-600">Escalation:</div>
                        <div className="text-sm text-yellow-800">{rule.escalation}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Notification Channels</h2>
              <div className="space-y-4">
                {alertChannels.map((channel) => (
                  <div key={channel.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#374151]">{channel.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        channel.enabled ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200'
                      }`}>
                        {channel.enabled ? 'enabled' : 'disabled'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 capitalize">{channel.type}</div>
                    {channel.type === 'email' && (
                      <div className="text-sm text-[#374151]">
                        {channel.recipients?.length} recipients
                      </div>
                    )}
                    {channel.type === 'slack' && (
                      <div className="text-sm text-[#374151]">
                        {channel.settings?.channel}
                      </div>
                    )}
                    {channel.type === 'pagerduty' && (
                      <div className="text-sm text-[#374151]">
                        Service: {channel.settings?.service}
                      </div>
                    )}
                    <div className="mt-2">
                      <button className="text-xs text-[#1e3a8a] hover:text-blue-800">
                        Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                Add Channel
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Alert Statistics</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Critical Alerts</span>
                  <span className="text-sm font-medium text-red-600">
                    {alerts.filter(a => a.severity === 'critical').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Warning Alerts</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {alerts.filter(a => a.severity === 'warning').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Info Alerts</span>
                  <span className="text-sm font-medium text-blue-600">
                    {alerts.filter(a => a.severity === 'info').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Escalated</span>
                  <span className="text-sm font-medium text-red-600">
                    {alerts.filter(a => a.escalated).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#374151]">Auto-Resolved</span>
                  <span className="text-sm font-medium text-green-600">
                    {alerts.filter(a => a.status === 'resolved').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[#1e3a8a] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-[#1e3a8a] text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors">
                  Acknowledge All Critical
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Test Notifications
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Export Alert Report
                </button>
                <button className="w-full border border-[#1e3a8a] text-[#1e3a8a] py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Maintenance Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}