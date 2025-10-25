'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock, Filter, Brain, ChevronDown, ChevronRight } from 'lucide-react';
import ShapExplanation from './ShapExplanation';

interface RiskAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  category: 'economic' | 'market' | 'geopolitical' | 'technical';
  severity: number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  source: string;
  actions?: string[];
}

interface RiskAlertsProps {
  showFilters?: boolean;
  maxAlerts?: number;
}

export default function RiskAlerts({ showFilters = true, maxAlerts }: RiskAlertsProps) {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedShap, setExpandedShap] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    type: string;
    category: string;
    status: string;
  }>({
    type: 'all',
    category: 'all',
    status: 'active'
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      // In production, fetch from API
      // const response = await fetch('/api/v1/risk/alerts');
      // const data = await response.json();
      
      // Load real alerts from API
      const response = await fetch('/api/v1/risk/alerts');
      if (!response.ok) {
        throw new Error('Failed to fetch risk alerts');
      }
      
      const data = await response.json();
      const realAlerts: RiskAlert[] = data.alerts || [];
      
      setAlerts(realAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'acknowledged' }
          : alert
      )
    );
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved' }
          : alert
      )
    );
  };

  const toggleShapExplanation = (alertId: string) => {
    setExpandedShap(prev =>
      prev.includes(alertId)
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medium':
        return <Bell className="w-5 h-5" />;
      case 'low':
        return <Info className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'text-terminal-red border-terminal-red bg-terminal-red/10';
      case 'high':
        return 'text-terminal-orange border-terminal-orange bg-terminal-orange/10';
      case 'medium':
        return 'text-terminal-yellow border-terminal-yellow bg-terminal-yellow/10';
      case 'low':
        return 'text-terminal-blue border-terminal-blue bg-terminal-blue/10';
      case 'info':
        return 'text-terminal-muted border-terminal-border bg-terminal-surface';
      default:
        return 'text-terminal-muted border-terminal-border bg-terminal-surface';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-terminal-red';
      case 'acknowledged':
        return 'text-terminal-yellow';
      case 'resolved':
        return 'text-terminal-green';
      default:
        return 'text-terminal-muted';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredAlerts = alerts
    .filter(alert => {
      if (filter.type !== 'all' && alert.type !== filter.type) return false;
      if (filter.category !== 'all' && alert.category !== filter.category) return false;
      if (filter.status !== 'all' && alert.status !== filter.status) return false;
      return true;
    })
    .slice(0, maxAlerts);

  const activeAlertsCount = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlertsCount = alerts.filter(alert => alert.type === 'critical' && alert.status === 'active').length;

  if (loading) {
    return (
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-terminal-bg rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-terminal-bg rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-terminal-surface border border-terminal-border p-6 rounded">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-terminal-green" />
            <h2 className="text-xl font-mono font-semibold text-terminal-text">
              RISK ALERTS
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-terminal-red rounded-full animate-pulse"></div>
              <span className="font-mono text-sm text-terminal-red">
                {criticalAlertsCount} Critical
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-terminal-green rounded-full"></div>
              <span className="font-mono text-sm text-terminal-text">
                {activeAlertsCount} Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-terminal-surface border border-terminal-border p-4 rounded">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-terminal-muted" />
            
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs text-terminal-muted">TYPE:</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
                className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs px-2 py-1 rounded"
              >
                <option value="all">All</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs text-terminal-muted">CATEGORY:</label>
              <select
                value={filter.category}
                onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
                className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs px-2 py-1 rounded"
              >
                <option value="all">All</option>
                <option value="economic">Economic</option>
                <option value="market">Market</option>
                <option value="geopolitical">Geopolitical</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs text-terminal-muted">STATUS:</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
                className="bg-terminal-bg border border-terminal-border text-terminal-text font-mono text-xs px-2 py-1 rounded"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-terminal-surface border border-terminal-border p-6 rounded text-center">
            <CheckCircle className="w-8 h-8 text-terminal-green mx-auto mb-2" />
            <p className="font-mono text-terminal-text">No alerts match current filters</p>
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <div
              key={alert.id}
              className={`border p-4 rounded transition-colors ${getAlertColor(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`flex-shrink-0 ${getAlertColor(alert.type).split(' ')[0]}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-mono font-semibold text-terminal-text text-sm">
                        {alert.title}
                      </h3>
                      <span className="px-2 py-1 rounded text-xs font-mono bg-terminal-bg border border-terminal-border text-terminal-muted">
                        {alert.category.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-mono bg-terminal-bg border border-terminal-border ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-terminal-text font-mono text-xs leading-relaxed mb-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-terminal-muted" />
                        <span className="text-terminal-muted font-mono text-xs">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                      
                      <div className="text-terminal-muted font-mono text-xs">
                        Source: {alert.source}
                      </div>
                      
                      <div className="text-terminal-muted font-mono text-xs">
                        Severity: {alert.severity}
                      </div>
                    </div>
                    
                    {/* Recommended Actions */}
                    {alert.actions && alert.actions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-mono font-semibold text-terminal-text text-xs">
                          RECOMMENDED ACTIONS:
                        </h4>
                        <ul className="space-y-1">
                          {alert.actions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 bg-terminal-green rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-terminal-text font-mono text-xs">
                                {action}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SHAP Explanation Toggle */}
                    <div className="mt-3 pt-3 border-t border-terminal-border">
                      <button
                        onClick={() => toggleShapExplanation(alert.id)}
                        className="flex items-center gap-2 text-xs font-mono text-terminal-green hover:text-terminal-text transition-colors"
                      >
                        <Brain className="w-3 h-3" />
                        <span>Why was this alert triggered?</span>
                        {expandedShap.includes(alert.id) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {alert.status === 'active' && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1 bg-terminal-yellow/20 text-terminal-yellow border border-terminal-yellow/30 rounded font-mono text-xs hover:bg-terminal-yellow/30 transition-colors"
                    >
                      ACK
                    </button>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-1 bg-terminal-green/20 text-terminal-green border border-terminal-green/30 rounded font-mono text-xs hover:bg-terminal-green/30 transition-colors"
                    >
                      RESOLVE
                    </button>
                  </div>
                )}
              </div>

              {/* SHAP Explanation */}
              {expandedShap.includes(alert.id) && (
                <div className="mt-4 pt-4 border-t border-terminal-border">
                  <div className="mb-3">
                    <h4 className="font-mono font-semibold text-terminal-text text-xs mb-2">
                      ALERT TRIGGER ANALYSIS (SHAP)
                    </h4>
                    <p className="text-xs font-mono text-terminal-muted">
                      Model explanation showing which factors contributed to triggering this alert.
                    </p>
                  </div>
                  <ShapExplanation 
                    riskScore={alert.severity}
                    predictionId={`alert-${alert.id}`}
                    showDetails={false}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}