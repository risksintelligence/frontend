import React, { useState } from 'react';
import { useRealTimeRisk } from '../../hooks/useRealTimeRisk';

interface LiveRiskFeedProps {
  apiUrl: string;
  onAlert?: (alert: any) => void;
  className?: string;
}

export const LiveRiskFeed: React.FC<LiveRiskFeedProps> = ({
  apiUrl,
  onAlert,
  className = ''
}) => {
  const {
    currentRisk,
    riskHistory,
    isConnected,
    connectionState,
    lastUpdate,
    getRiskTrend,
    getAverageRisk
  } = useRealTimeRisk(apiUrl, {
    autoConnect: true,
    reconnectAttempts: 5,
    historyLimit: 50,
    onRiskAlert: onAlert,
    riskThresholds: {
      warning: 60,
      critical: 80
    }
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<'5m' | '15m' | '1h'>('15m');

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLevelBg = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-green-100 border-green-200';
      case 'moderate': return 'bg-yellow-100 border-yellow-200';
      case 'high': return 'bg-orange-100 border-orange-200';
      case 'critical': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getConnectionStatus = () => {
    switch (connectionState) {
      case 'connected': return { text: 'Live', color: 'text-green-600', bg: 'bg-green-100' };
      case 'connecting': return { text: 'Connecting', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'disconnected': return { text: 'Disconnected', color: 'text-gray-600', bg: 'bg-gray-100' };
      case 'error': return { text: 'Error', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };
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

  const formatDuration = (timestamp: string) => {
    try {
      const diff = Date.now() - new Date(timestamp).getTime();
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      
      if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
      if (minutes > 0) return `${minutes}m ${seconds % 60}s ago`;
      return `${seconds}s ago`;
    } catch {
      return 'Unknown';
    }
  };

  const getFilteredHistory = () => {
    if (!riskHistory.length) return [];
    
    const now = Date.now();
    const timeframes = {
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000
    };
    
    const cutoff = now - timeframes[selectedTimeframe];
    return riskHistory.filter(risk => new Date(risk.timestamp).getTime() > cutoff);
  };

  const connectionStatus = getConnectionStatus();
  const trend = getRiskTrend();
  const avgRisk = getAverageRisk(10);
  const filteredHistory = getFilteredHistory();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium text-gray-900">Live Risk Feed</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${connectionStatus.bg} ${connectionStatus.color}`}>
            {connectionStatus.text}
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {(['5m', '15m', '1h'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Current Risk Status */}
      {currentRisk && (
        <div className="p-4 border-b border-gray-200">
          <div className={`p-3 rounded-lg border ${getRiskLevelBg(currentRisk.risk_level)}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Current Risk Level</span>
              <span className={`text-sm font-bold ${getRiskLevelColor(currentRisk.risk_level)}`}>
                {currentRisk.risk_level?.toUpperCase() || 'UNKNOWN'}
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Score</div>
                <div className="font-semibold">{currentRisk.overall_score.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-gray-600">Confidence</div>
                <div className="font-semibold">{(currentRisk.confidence * 100).toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-600">Trend</div>
                <div className={`font-semibold ${
                  trend === 'increasing' ? 'text-red-600' : 
                  trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {trend === 'increasing' ? '↗' : trend === 'decreasing' ? '↘' : '→'} {trend}
                </div>
              </div>
            </div>
            
            {lastUpdate && (
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {formatTimestamp(lastUpdate)} ({formatDuration(lastUpdate)})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {currentRisk?.factors && currentRisk.factors.length > 0 && (
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Risk Factors</h4>
          <div className="space-y-2">
            {currentRisk.factors
              .sort((a, b) => (b.weight * b.normalized_value) - (a.weight * a.normalized_value))
              .slice(0, 5)
              .map((factor, index) => (
                <div key={`${factor.name}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{factor.name}</div>
                    <div className="text-xs text-gray-500">{factor.category}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{factor.value.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {(factor.confidence * 100).toFixed(0)}% conf
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Recent History */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">Recent Updates</h4>
          <div className="text-xs text-gray-500">
            {filteredHistory.length} updates in {selectedTimeframe}
          </div>
        </div>
        
        {filteredHistory.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredHistory.slice(-10).reverse().map((risk, index) => (
              <div key={`${risk.timestamp}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500">{formatTimestamp(risk.timestamp)}</span>
                  <span className={`font-medium ${getRiskLevelColor(risk.risk_level)}`}>
                    {risk.risk_level}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{risk.overall_score.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">
                    {(risk.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No risk updates in the last {selectedTimeframe}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-gray-600">Avg Risk</div>
            <div className="font-semibold">{avgRisk.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Updates</div>
            <div className="font-semibold">{riskHistory.length}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600">Uptime</div>
            <div className="font-semibold">{isConnected ? '100%' : '0%'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};