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
  apiUrl?: string;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  className = '',
  maxAlerts = 10,
  showFilters = true,
  onAlertClick,
  apiUrl = 'http://localhost:8000'
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity'>('timestamp');

  // Fetch real alerts from risk factors API
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch risk factors to generate alerts
        const response = await fetch(`${apiUrl}/api/v1/risk/factors`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch risk data');
        }
        
        const data = await response.json();
        
        // Transform risk factors into alert format
        const transformedAlerts: Alert[] = data.factors
          .filter((factor: any) => factor.risk_contribution > 5) // Only show significant risks
          .map((factor: any, index: number) => ({
            id: `alert-${factor.factor_name}-${index}`,
            type: factor.risk_level === 'high' ? 'critical' : 
                  factor.risk_level === 'medium' ? 'warning' : 'info',
            title: `${factor.category.charAt(0).toUpperCase() + factor.category.slice(1)} Risk Alert`,
            message: factor.explanation,
            source: 'Risk Engine',
            timestamp: data.timestamp,
            isRead: false,
            actionRequired: factor.risk_level === 'high',
            severity: Math.round(factor.risk_contribution / 10),
            affectedSectors: [factor.category],
            relatedMetrics: [factor.factor_name]
          }))
          .slice(0, maxAlerts);
        
        setAlerts(transformedAlerts);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load alerts');
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiUrl, maxAlerts]);

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
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
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

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg border border-gray-200 ${className}`}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-white rounded-lg border border-red-200 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 font-medium mb-2">Failed to load alerts</div>
          <div className="text-red-500 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <ComponentErrorBoundary>
      <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Alerts</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
              {sortedAlerts.length} alerts
            </span>
          </div>

          {showFilters && (
            <div className="flex space-x-4 mb-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="unread">Unread</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="timestamp">Latest</option>
                <option value="severity">Severity</option>
              </select>
            </div>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {sortedAlerts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No alerts match the current filter
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sortedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !alert.isRead ? 'bg-blue-25' : ''
                  }`}
                  onClick={() => onAlertClick?.(alert)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {alert.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {alert.message}
                          </p>
                        </div>
                        
                        {alert.actionRequired && (
                          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                            Action Required
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <span>{alert.source}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {alert.affectedSectors && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {alert.affectedSectors.map((sector, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {sector}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ComponentErrorBoundary>
  );
};

export default AlertsPanel;