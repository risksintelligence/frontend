/**
 * Maritime Intelligence React Hook
 * 
 * Provides real-time maritime data from free sources:
 * - AISHub (Free AIS data)
 * - NOAA Marine Cadastre (US government data)
 * - OpenSeaMap (Open source marine data)
 */

import { useState, useEffect, useCallback } from 'react';
import { MaritimeAPI, PortCongestion, ShippingDelay, RiskAssessment, ProviderHealth } from '@/lib/api/maritime';

export interface MaritimeState {
  ports: PortCongestion[];
  delays: ShippingDelay[];
  riskAssessment: RiskAssessment | null;
  providerHealth: ProviderHealth | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface MaritimeActions {
  refreshPortCongestion: () => Promise<void>;
  refreshShippingDelays: () => Promise<void>;
  refreshRiskAssessment: () => Promise<void>;
  refreshProviderHealth: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export function useMaritimeIntelligence(
  autoRefresh: boolean = true,
  refreshInterval: number = 300000 // 5 minutes
): [MaritimeState, MaritimeActions] {
  
  const [state, setState] = useState<MaritimeState>({
    ports: [],
    delays: [],
    riskAssessment: null,
    providerHealth: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  const updateState = useCallback((updates: Partial<MaritimeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const refreshPortCongestion = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const response = await MaritimeAPI.getPortCongestion();
      updateState({ 
        ports: response.ports,
        lastUpdated: new Date(),
        loading: false 
      });
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to fetch port congestion',
        loading: false 
      });
    }
  }, [updateState]);

  const refreshShippingDelays = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const response = await MaritimeAPI.getShippingDelays();
      updateState({ 
        delays: response.delays,
        lastUpdated: new Date(),
        loading: false 
      });
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to fetch shipping delays',
        loading: false 
      });
    }
  }, [updateState]);

  const refreshRiskAssessment = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const riskAssessment = await MaritimeAPI.getRiskAssessment();
      updateState({ 
        riskAssessment,
        lastUpdated: new Date(),
        loading: false 
      });
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to fetch risk assessment',
        loading: false 
      });
    }
  }, [updateState]);

  const refreshProviderHealth = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const providerHealth = await MaritimeAPI.getProviderHealth();
      updateState({ 
        providerHealth,
        lastUpdated: new Date(),
        loading: false 
      });
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to fetch provider health',
        loading: false 
      });
    }
  }, [updateState]);

  const refreshAll = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const summary = await MaritimeAPI.getMaritimeSummary();
      updateState({
        ports: summary.congestion.ports,
        delays: summary.delays.delays,
        riskAssessment: summary.risk,
        providerHealth: summary.health,
        lastUpdated: new Date(),
        loading: false
      });
    } catch (error) {
      updateState({ 
        error: error instanceof Error ? error.message : 'Failed to fetch maritime data',
        loading: false 
      });
    }
  }, [updateState]);

  // Initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshAll();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshAll]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshAll();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshAll]);

  const actions: MaritimeActions = {
    refreshPortCongestion,
    refreshShippingDelays,
    refreshRiskAssessment,
    refreshProviderHealth,
    refreshAll
  };

  return [state, actions];
}

export default useMaritimeIntelligence;

/**
 * Hook for getting critical port congestion alerts
 */
export function useCriticalPortAlerts(): {
  criticalPorts: PortCongestion[];
  alertCount: number;
  loading: boolean;
  error: string | null;
} {
  const [state] = useMaritimeIntelligence(true, 180000); // 3 minutes

  const criticalPorts = state.ports.filter(port => 
    port.congestion_level === 'high' || port.congestion_level === 'severe'
  );

  return {
    criticalPorts,
    alertCount: criticalPorts.length,
    loading: state.loading,
    error: state.error
  };
}

/**
 * Hook for getting shipping delay warnings
 */
export function useShippingDelayAlerts(): {
  criticalDelays: ShippingDelay[];
  alertCount: number;
  loading: boolean;
  error: string | null;
} {
  const [state] = useMaritimeIntelligence(true, 180000); // 3 minutes

  const criticalDelays = state.delays.filter(delay => 
    delay.severity === 'major' || delay.severity === 'critical'
  );

  return {
    criticalDelays,
    alertCount: criticalDelays.length,
    loading: state.loading,
    error: state.error
  };
}

/**
 * Hook for getting overall maritime risk level
 */
export function useMaritimeRiskLevel(): {
  riskLevel: 'low' | 'medium' | 'high' | 'unknown';
  riskScore: number;
  loading: boolean;
  error: string | null;
} {
  const [state] = useMaritimeIntelligence(true, 300000); // 5 minutes

  return {
    riskLevel: state.riskAssessment?.risk_level || 'unknown',
    riskScore: state.riskAssessment?.overall_risk_score || 0,
    loading: state.loading,
    error: state.error
  };
}
