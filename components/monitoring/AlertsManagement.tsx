import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, Settings, Plus, X, Save } from 'lucide-react';
import { SystemAlert, AlertConfiguration } from '../../hooks/useSystemMonitoring';

interface AlertsManagementProps {
  alerts: SystemAlert[];
  alertConfigurations: AlertConfiguration[];
  onAcknowledgeAlert: (alertId: string) => Promise<void>;
  onResolveAlert: (alertId: string) => Promise<void>;
  onCreateConfiguration: (config: Omit<AlertConfiguration, 'id'>) => Promise<AlertConfiguration>;
  onUpdateConfiguration: (id: string, config: Partial<AlertConfiguration>) => Promise<AlertConfiguration>;
  onDeleteConfiguration: (id: string) => Promise<void>;
  loading?: boolean;
}

export const AlertsManagement: React.FC<AlertsManagementProps> = ({
  alerts,
  alertConfigurations,
  onAcknowledgeAlert,
  onResolveAlert,
  onCreateConfiguration,
  onUpdateConfiguration,
  onDeleteConfiguration,
  loading
}) => {
  const [selectedTab, setSelectedTab] = useState<'alerts' | 'config'>('alerts');
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AlertConfiguration | null>(null);
  const [formData, setFormData] = useState<Partial<AlertConfiguration>>({
    name: '',
    metric: '',
    threshold: 0,
    operator: 'greater_than',
    severity: 'medium',
    enabled: true,
    notification_channels: []
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Bell className="w-4 h-4" />;
      case 'low':
        return <Clock className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'resolved':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const handleSaveConfiguration = async () => {
    try {
      if (editingConfig) {
        await onUpdateConfiguration(editingConfig.id, formData);
      } else {
        await onCreateConfiguration(formData as Omit<AlertConfiguration, 'id'>);
      }
      setShowConfigForm(false);
      setEditingConfig(null);
      setFormData({
        name: '',
        metric: '',
        threshold: 0,
        operator: 'greater_than',
        severity: 'medium',
        enabled: true,
        notification_channels: []
      });
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const handleEditConfiguration = (config: AlertConfiguration) => {
    setEditingConfig(config);
    setFormData(config);
    setShowConfigForm(true);
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading alerts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Alerts Management</h3>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setSelectedTab('alerts')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedTab === 'alerts'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alerts ({alerts.length})
              </button>
              <button
                onClick={() => setSelectedTab('config')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  selectedTab === 'config'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Configuration
              </button>
            </div>
          </div>
        </div>

        {selectedTab === 'alerts' && (
          <div className="p-6">
            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-900">Active Alerts</span>
                </div>
                <div className="text-2xl font-bold text-red-600 mt-2">{activeAlerts.length}</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">Acknowledged</span>
                </div>
                <div className="text-2xl font-bold text-yellow-600 mt-2">{acknowledgedAlerts.length}</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-green-600 mt-2">{resolvedAlerts.length}</div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h4>
                  <p className="text-gray-600">All systems are operating normally.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full border flex items-center space-x-1 ${getSeverityColor(alert.severity)}`}>
                            {getSeverityIcon(alert.severity)}
                            <span className="capitalize">{alert.severity}</span>
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full border capitalize ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900 mb-1">{alert.title}</h5>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Metric: {alert.metric}</span>
                          <span>Current: {alert.current_value}</span>
                          <span>Threshold: {alert.threshold}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        {alert.status === 'active' && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700"
                          >
                            Acknowledge
                          </button>
                        )}
                        {(alert.status === 'active' || alert.status === 'acknowledged') && (
                          <button
                            onClick={() => onResolveAlert(alert.id)}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedTab === 'config' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-medium text-gray-900">Alert Configurations</h4>
              <button
                onClick={() => setShowConfigForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>New Alert</span>
              </button>
            </div>

            {/* Configuration Form */}
            {showConfigForm && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="font-medium text-gray-900">
                    {editingConfig ? 'Edit Alert Configuration' : 'Create New Alert Configuration'}
                  </h5>
                  <button
                    onClick={() => {
                      setShowConfigForm(false);
                      setEditingConfig(null);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
                    <select
                      value={formData.metric || ''}
                      onChange={(e) => setFormData({ ...formData, metric: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select metric</option>
                      <option value="cpu_usage">CPU Usage</option>
                      <option value="memory_usage">Memory Usage</option>
                      <option value="disk_usage">Disk Usage</option>
                      <option value="api_response_time">API Response Time</option>
                      <option value="api_error_rate">API Error Rate</option>
                      <option value="database_response_time">Database Response Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
                    <input
                      type="number"
                      value={formData.threshold || 0}
                      onChange={(e) => setFormData({ ...formData, threshold: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                    <select
                      value={formData.operator || 'greater_than'}
                      onChange={(e) => setFormData({ ...formData, operator: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="greater_than">Greater Than</option>
                      <option value="less_than">Less Than</option>
                      <option value="equals">Equals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={formData.severity || 'medium'}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.enabled || false}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Enabled</label>
                  </div>
                </div>

                <button
                  onClick={handleSaveConfiguration}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            )}

            {/* Configurations List */}
            <div className="space-y-3">
              {alertConfigurations.map((config) => (
                <div
                  key={config.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="font-medium text-gray-900">{config.name}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full border capitalize ${getSeverityColor(config.severity)}`}>
                          {config.severity}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full border ${
                          config.enabled ? 'text-green-600 bg-green-100 border-green-200' : 'text-gray-600 bg-gray-100 border-gray-200'
                        }`}>
                          {config.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {config.metric} {config.operator.replace('_', ' ')} {config.threshold}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditConfiguration(config)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteConfiguration(config.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};