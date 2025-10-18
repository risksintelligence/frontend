import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import {
  RiskUpdateMessage,
  RiskUpdateData,
  RealTimeRiskState,
  WebSocketConfig,
  RealTimeAlert
} from '../types/realtime';

interface UseRealTimeRiskOptions extends WebSocketConfig {
  onRiskAlert?: (alert: RealTimeAlert) => void;
  onThresholdExceeded?: (threshold: number, currentValue: number) => void;
  riskThresholds?: {
    warning: number;
    critical: number;
  };
}

interface UseRealTimeRiskResult {
  riskState: RealTimeRiskState;
  currentRisk: RiskUpdateData | null;
  riskHistory: RiskUpdateData[];
  isConnected: boolean;
  connectionState: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastUpdate: string | null;
  subscribe: () => void;
  unsubscribe: () => void;
  clearHistory: () => void;
  getFactorByName: (name: string) => any;
  getRiskTrend: () => 'increasing' | 'decreasing' | 'stable';
  getAverageRisk: (periods?: number) => number;
}

export function useRealTimeRisk(
  apiUrl: string,
  options: UseRealTimeRiskOptions = {}
): UseRealTimeRiskResult {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 5000,
    historyLimit = 100,
    onRiskAlert,
    onThresholdExceeded,
    riskThresholds = { warning: 60, critical: 80 },
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [riskState, setRiskState] = useState<RealTimeRiskState>({
    currentRisk: null,
    history: [],
    lastUpdate: null,
    connectionState: {
      status: 'disconnected',
      reconnectAttempts: 0,
      maxReconnectAttempts: reconnectAttempts
    },
    isSubscribed: false
  });

  const lastAlertRef = useRef<string>('');
  const wsUrl = `${apiUrl.replace('http', 'ws')}/ws/risk-updates`;

  const handleMessage = useCallback((message: any) => {
    try {
      if (message.type === 'risk_update' && message.data) {
        const riskUpdate = message as RiskUpdateMessage;
        const newRiskData = riskUpdate.data;

        setRiskState(prev => {
          const newHistory = [...prev.history, newRiskData];
          if (newHistory.length > historyLimit) {
            newHistory.shift();
          }

          return {
            ...prev,
            currentRisk: newRiskData,
            history: newHistory,
            lastUpdate: message.timestamp,
            connectionState: {
              ...prev.connectionState,
              status: 'connected'
            }
          };
        });

        // Check thresholds and generate alerts
        const riskScore = newRiskData.overall_score;
        
        if (riskScore >= riskThresholds.critical) {
          const alertId = `critical-${Date.now()}`;
          if (lastAlertRef.current !== alertId) {
            lastAlertRef.current = alertId;
            
            const alert: RealTimeAlert = {
              id: alertId,
              type: 'risk',
              severity: 'critical',
              title: 'Critical Risk Level Detected',
              message: `Risk score has reached ${riskScore.toFixed(1)} (Critical threshold: ${riskThresholds.critical})`,
              timestamp: message.timestamp,
              source: 'real_time_risk_monitor',
              data: newRiskData,
              actions: [
                { label: 'View Details', action: 'view_risk_details', style: 'primary' },
                { label: 'Acknowledge', action: 'acknowledge_alert', style: 'secondary' }
              ]
            };
            
            onRiskAlert?.(alert);
            onThresholdExceeded?.(riskThresholds.critical, riskScore);
          }
        } else if (riskScore >= riskThresholds.warning) {
          const alertId = `warning-${Date.now()}`;
          if (lastAlertRef.current !== alertId) {
            lastAlertRef.current = alertId;
            
            const alert: RealTimeAlert = {
              id: alertId,
              type: 'risk',
              severity: 'medium',
              title: 'Elevated Risk Level',
              message: `Risk score has reached ${riskScore.toFixed(1)} (Warning threshold: ${riskThresholds.warning})`,
              timestamp: message.timestamp,
              source: 'real_time_risk_monitor',
              data: newRiskData
            };
            
            onRiskAlert?.(alert);
            onThresholdExceeded?.(riskThresholds.warning, riskScore);
          }
        }
      } else if (message.type === 'error') {
        console.error('Risk WebSocket error:', message.message);
        setRiskState(prev => ({
          ...prev,
          connectionState: {
            ...prev.connectionState,
            status: 'error',
            lastError: message.message
          }
        }));
      }
    } catch (error) {
      console.error('Error processing risk update:', error);
    }
  }, [historyLimit, onRiskAlert, onThresholdExceeded, riskThresholds]);

  const handleConnect = useCallback(() => {
    setRiskState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'connected',
        lastConnected: new Date().toISOString(),
        reconnectAttempts: 0
      },
      isSubscribed: true
    }));
    onConnect?.();
  }, [onConnect]);

  const handleDisconnect = useCallback(() => {
    setRiskState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'disconnected'
      },
      isSubscribed: false
    }));
    onDisconnect?.();
  }, [onDisconnect]);

  const handleError = useCallback((error: any) => {
    setRiskState(prev => ({
      ...prev,
      connectionState: {
        ...prev.connectionState,
        status: 'error',
        lastError: error.message || 'Connection error',
        reconnectAttempts: prev.connectionState.reconnectAttempts + 1
      }
    }));
    onError?.(error);
  }, [onError]);

  const {
    isConnected,
    connectionState,
    connect,
    disconnect
  } = useWebSocket(wsUrl, {
    reconnectAttempts,
    reconnectInterval,
    onMessage: handleMessage,
    onConnect: handleConnect,
    onDisconnect: handleDisconnect,
    onError: handleError
  });

  const subscribe = useCallback(() => {
    connect();
  }, [connect]);

  const unsubscribe = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const clearHistory = useCallback(() => {
    setRiskState(prev => ({
      ...prev,
      history: []
    }));
  }, []);

  const getFactorByName = useCallback((name: string) => {
    return riskState.currentRisk?.factors.find(factor => factor.name === name);
  }, [riskState.currentRisk]);

  const getRiskTrend = useCallback((): 'increasing' | 'decreasing' | 'stable' => {
    if (riskState.history.length < 2) return 'stable';
    
    const recent = riskState.history.slice(-5);
    const scores = recent.map(r => r.overall_score);
    
    const trend = scores.reduce((acc, score, idx) => {
      if (idx === 0) return acc;
      return acc + (score - scores[idx - 1]);
    }, 0);
    
    if (Math.abs(trend) < 1) return 'stable';
    return trend > 0 ? 'increasing' : 'decreasing';
  }, [riskState.history]);

  const getAverageRisk = useCallback((periods: number = 10): number => {
    if (riskState.history.length === 0) return 0;
    
    const recent = riskState.history.slice(-periods);
    const sum = recent.reduce((acc, risk) => acc + risk.overall_score, 0);
    return sum / recent.length;
  }, [riskState.history]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      subscribe();
    }
    
    return () => {
      unsubscribe();
    };
  }, [autoConnect, subscribe, unsubscribe]);

  return {
    riskState,
    currentRisk: riskState.currentRisk,
    riskHistory: riskState.history,
    isConnected,
    connectionState,
    lastUpdate: riskState.lastUpdate,
    subscribe,
    unsubscribe,
    clearHistory,
    getFactorByName,
    getRiskTrend,
    getAverageRisk
  };
}