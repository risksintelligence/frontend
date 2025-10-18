import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Layout from '../../components/common/Layout';
import { LiveRiskFeed } from '../../components/realtime/LiveRiskFeed';
import { AnalyticsStream } from '../../components/realtime/AnalyticsStream';
import { HealthMonitor } from '../../components/realtime/HealthMonitor';
import { RealTimeAlert, RealTimeNotification } from '../../types/realtime';

interface AlertNotification extends RealTimeAlert {
  dismissed?: boolean;
}

const RealtimeDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertNotification | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // API URL from environment or default
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Handle alerts from all real-time components
  const handleAlert = useCallback((alert: RealTimeAlert) => {
    const alertWithDismissed: AlertNotification = { ...alert, dismissed: false };
    setAlerts(prev => {
      // Prevent duplicate alerts
      const exists = prev.some(a => a.id === alert.id);
      if (exists) return prev;
      
      // Keep only last 50 alerts
      const updated = [alertWithDismissed, ...prev];
      return updated.slice(0, 50);
    });

    // Auto-create notification for critical alerts
    if (alert.severity === 'critical') {
      const notification: RealTimeNotification = {
        id: `notif-${alert.id}`,
        type: 'error',
        title: alert.title,
        message: alert.message,
        timestamp: alert.timestamp,
        autoHide: false,
        actions: [
          {
            label: 'View Alert',
            action: () => setSelectedAlert(alertWithDismissed)
          },
          {
            label: 'Dismiss',
            action: () => dismissNotification(`notif-${alert.id}`)
          }
        ]
      };
      setNotifications(prev => [notification, ...prev.slice(0, 9)]);
    }
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  }, []);

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, dismissed: true })));
  }, []);

  // Get active (non-dismissed) alerts
  const activeAlerts = alerts.filter(alert => !alert.dismissed);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');
  const highAlerts = activeAlerts.filter(alert => alert.severity === 'high');

  // Auto-hide notifications after 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(n => {
        if (!n.autoHide) return true;
        const age = Date.now() - new Date(n.timestamp).getTime();
        return age < 30000; // 30 seconds
      }));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        setIsFullscreen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSelectedAlert(null);
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <>
      <Head>
        <title>Real-time Dashboard - RiskX</title>
        <meta name="description" content="Real-time risk monitoring and system health dashboard" />
      </Head>

      <div className={isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}>
        <Layout>
          <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Real-time Dashboard</h1>
                <p className="text-gray-600">Live monitoring of risk levels, system health, and performance metrics</p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Alert Summary */}
                {activeAlerts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    {criticalAlerts.length > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                        {criticalAlerts.length} critical
                      </span>
                    )}
                    {highAlerts.length > 0 && (
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-full">
                        {highAlerts.length} high
                      </span>
                    )}
                    <button
                      onClick={clearAllAlerts}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                )}
                
                {/* Fullscreen Toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                  title="Toggle fullscreen (F11)"
                >
                  {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
              </div>
            </div>

            {/* Active Notifications */}
            {notifications.length > 0 && (
              <div className="space-y-2">
                {notifications.slice(0, 3).map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    notification.type === 'error' ? 'bg-red-50 border-red-200' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    notification.type === 'success' ? 'bg-green-50 border-green-200' :
                    'bg-blue-50 border-blue-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {notification.actions?.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
                          >
                            {action.label}
                          </button>
                        ))}
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Risk Feed */}
              <div className="lg:col-span-1">
                <LiveRiskFeed 
                  apiUrl={apiUrl} 
                  onAlert={handleAlert}
                  className="h-full"
                />
              </div>

              {/* Analytics Stream */}
              <div className="lg:col-span-1">
                <AnalyticsStream 
                  apiUrl={apiUrl} 
                  onAlert={handleAlert}
                  className="h-full"
                />
              </div>

              {/* Health Monitor */}
              <div className="lg:col-span-1">
                <HealthMonitor 
                  apiUrl={apiUrl} 
                  onAlert={handleAlert}
                  className="h-full"
                />
              </div>
            </div>

            {/* Alert History */}
            {activeAlerts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {activeAlerts.slice(0, 10).map(alert => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium uppercase tracking-wide">
                                {alert.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.timestamp)}
                              </span>
                            </div>
                            <h4 className="font-medium mt-1">{alert.title}</h4>
                            <p className="text-sm mt-1">{alert.message}</p>
                            {alert.source && (
                              <p className="text-xs text-gray-500 mt-1">Source: {alert.source}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {alert.actions?.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  if (action.action === 'view_risk_details' || action.action === 'view_system_details') {
                                    setSelectedAlert(alert);
                                  }
                                }}
                                className={`text-xs px-2 py-1 rounded ${
                                  action.style === 'primary' ? 'bg-blue-600 text-white' :
                                  action.style === 'danger' ? 'bg-red-600 text-white' :
                                  'bg-white border'
                                }`}
                              >
                                {action.label}
                              </button>
                            ))}
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Dashboard Controls</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p><kbd className="bg-white px-1 rounded">F11</kbd> - Toggle fullscreen mode</p>
                <p><kbd className="bg-white px-1 rounded">Esc</kbd> - Exit fullscreen or close modals</p>
                <p>Critical alerts will automatically create notifications</p>
                <p>All components auto-reconnect on connection loss</p>
              </div>
            </div>
          </div>

          {/* Alert Detail Modal */}
          {selectedAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Alert Details</h3>
                    <button
                      onClick={() => setSelectedAlert(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <p className="text-sm">{selectedAlert.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Message</label>
                      <p className="text-sm">{selectedAlert.message}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <p className="text-sm">{selectedAlert.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Severity</label>
                        <p className={`text-sm font-medium ${getSeverityColor(selectedAlert.severity).split(' ')[0]}`}>
                          {selectedAlert.severity}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Source</label>
                        <p className="text-sm">{selectedAlert.source}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Timestamp</label>
                        <p className="text-sm">{formatTimestamp(selectedAlert.timestamp)}</p>
                      </div>
                    </div>
                    {selectedAlert.data && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Data</label>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(selectedAlert.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      dismissAlert(selectedAlert.id);
                      setSelectedAlert(null);
                    }}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => setSelectedAlert(null)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </Layout>
      </div>
    </>
  );
};

export default RealtimeDashboard;