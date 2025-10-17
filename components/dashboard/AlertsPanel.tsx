/**
 * Alerts Panel component for RiskX application
 * Professional risk alerts and notifications management
 */
import React, { useState, useEffect } from 'react';
import { ComponentErrorBoundary } from '../common/ErrorBoundary';
import { Loading } from '../common/Loading';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  isRead: boolean;
  actionRequired: boolean;
  severity: number; // 1-10 scale
  affectedSectors?: string[];
  relatedMetrics?: string[];
}

interface AlertsPanelProps {
  className?: string;
  maxAlerts?: number;
  showFilters?: boolean;
  onAlertClick?: (alert: Alert) => void;
  onMarkAsRead?: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  className = '',
  maxAlerts = 10,
  showFilters = true,
  onAlertClick,
  onMarkAsRead
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity'>('timestamp');

  // Sample alerts data - in production this would come from API/WebSocket
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const sampleAlerts: Alert[] = [
        {
          id: '1',
          type: 'critical',
          title: 'Elevated Credit Risk Detected',
          message: 'Credit spread widening in banking sector exceeds normal thresholds by 15%',
          source: 'Risk Engine',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          isRead: false,
          actionRequired: true,
          severity: 8,
          affectedSectors: ['Banking', 'Financial Services'],
          relatedMetrics: ['Credit Spreads', 'Default Rates']
        },
        {
          id: '2',
          type: 'warning',
          title: 'Supply Chain Disruption Alert',
          message: 'Port congestion in Los Angeles affecting semiconductor imports',
          source: 'Supply Chain Monitor',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          isRead: false,
          actionRequired: false,
          severity: 6,
          affectedSectors: ['Technology', 'Manufacturing'],
          relatedMetrics: ['Import Volumes', 'Shipping Delays']
        },
        {
          id: '3',
          type: 'info',
          title: 'Economic Data Update',
          message: 'GDP growth revised upward to 2.8% for Q4',
          source: 'Economic Monitor',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          isRead: true,
          actionRequired: false,
          severity: 3,
          relatedMetrics: ['GDP Growth', 'Economic Outlook']
        },
        {
          id: '4',
          type: 'warning',
          title: 'Cyber Threat Level Increased',
          message: 'CISA reported increased targeting of financial institutions',
          source: 'Security Monitor',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          isRead: false,
          actionRequired: true,
          severity: 7,
          affectedSectors: ['Banking', 'Financial Services', 'Technology'],
          relatedMetrics: ['Cyber Risk Index', 'Security Incidents']
        },
        {
          id: '5',
          type: 'success',
          title: 'Risk Model Update Complete',
          message: 'Monthly risk model calibration completed successfully',
          source: 'Model Management',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
          isRead: true,
          actionRequired: false,
          severity: 2,
          relatedMetrics: ['Model Performance', 'Calibration Status']
        }
      ];
      
      setAlerts(sampleAlerts);
      setLoading(false);
    };

    fetchAlerts();

    // Simulate real-time updates
    const interval = setInterval(() => {
      // In production, this would be handled by WebSocket
      const shouldAddAlert = Math.random() < 0.1; // 10% chance every 30 seconds
      
      if (shouldAddAlert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'warning' : 'info',
          title: 'Real-time Risk Update',
          message: 'Risk factor change detected in monitoring system',
          source: 'Real-time Monitor',
          timestamp: new Date().toISOString(),
          isRead: false,
          actionRequired: Math.random() > 0.6,
          severity: Math.floor(Math.random() * 8) + 1,
          affectedSectors: ['Various'],
          relatedMetrics: ['Risk Score']
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, maxAlerts));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [maxAlerts]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getAlertBorderColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
        return 'border-l-blue-500';
      case 'success':
        return 'border-l-green-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'critical':
        return alert.type === 'critical';
      case 'warning':
        return alert.type === 'warning';
      case 'unread':
        return !alert.isRead;
      default:
        return true;
    }
  });

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    if (sortBy === 'severity') {
      return b.severity - a.severity;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleAlertClick = (alert: Alert) => {
    if (!alert.isRead) {
      setAlerts(prev =>
        prev.map(a => a.id === alert.id ? { ...a, isRead: true } : a)
      );
      onMarkAsRead?.(alert.id);
    }
    onAlertClick?.(alert);
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const criticalCount = alerts.filter(a => a.type === 'critical').length;

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-charcoal-gray">Risk Alerts</h3>
        </div>
        <Loading variant="skeleton" />
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-charcoal-gray">Risk Alerts</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
              {criticalCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  {criticalCount} critical
                </span>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-navy-blue"
              >
                <option value="all">All Alerts</option>
                <option value="critical">Critical Only</option>
                <option value="warning">Warnings Only</option>
                <option value="unread">Unread Only</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-navy-blue"
              >
                <option value="timestamp">Sort by Time</option>
                <option value="severity">Sort by Severity</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm">No alerts match your current filter</p>
            </div>
          ) : (
            sortedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 bg-white border border-gray-200 rounded-r-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getAlertBorderColor(alert.type)} ${
                  !alert.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleAlertClick(alert)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`text-sm font-medium ${!alert.isRead ? 'text-charcoal-gray' : 'text-gray-700'}`}>
                        {alert.title}
                      </h4>
                      <div className="flex items-center space-x-2 ml-2">
                        {alert.actionRequired && (
                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            Action Required
                          </span>
                        )}
                        <span className="text-xs text-gray-500">
                          Severity {alert.severity}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-3">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {!alert.isRead && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                    
                    {alert.affectedSectors && alert.affectedSectors.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {alert.affectedSectors.map((sector, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {sector}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {sortedAlerts.length >= maxAlerts && (
          <div className="mt-4 text-center">
            <button className="text-sm text-navy-blue hover:text-blue-800 font-medium">
              View All Alerts ({alerts.length - maxAlerts} more)
            </button>
          </div>
        )}
      </div>
    </ComponentErrorBoundary>
  );
};

export default AlertsPanel;