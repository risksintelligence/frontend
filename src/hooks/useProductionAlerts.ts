"use client";

import { useQuery } from "@tanstack/react-query";
import type { 
  ActiveAlertsResponse, 
  AlertHistoryResponse,
  HealthOverviewResponse
} from "@/types/api";
import { 
  validateActiveAlertsResponse, 
  validateApiResponse
} from "@/lib/contractValidator";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function fetchWithValidation<T>(
  endpoint: string,
  validator: (data: unknown) => T
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }
  
  const data = await response.json();
  return validator(data);
}

/**
 * Hook to fetch active production alerts with contract validation
 */
export function useActiveAlerts(severity?: 'critical' | 'high' | 'medium' | 'low') {
  const params = severity ? `?severity=${severity}` : '';
  
  return useQuery<ActiveAlertsResponse>({
    queryKey: ["active-alerts", severity],
    queryFn: () => fetchWithValidation(
      `/api/v1/alerts/active${params}`,
      (data) => validateApiResponse(
        `/api/v1/alerts/active${params}`,
        data,
        validateActiveAlertsResponse
      )
    ),
    refetchInterval: 30 * 1000, // Refresh every 30 seconds for alerts
    retry: (failureCount, error) => {
      if (error?.name === 'ContractValidationError') {
        console.error('Alert contract validation failed:', error);
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to fetch alert history with contract validation
 */
export function useAlertHistory(limit = 50) {
  return useQuery<AlertHistoryResponse>({
    queryKey: ["alert-history", limit],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/v1/alerts/history?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alert history: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate response structure
      if (!data.alert_history || !Array.isArray(data.alert_history)) {
        throw new Error('Invalid alert history response structure');
      }
      
      // Validate each alert in history
      data.alert_history.forEach((alert: unknown, index: number) => {
        try {
          validateApiResponse(`alert_history[${index}]`, alert, (alertData) => {
            const validation = validateProductionAlert(alertData);
            if (!validation.isValid) {
              throw new Error(validation.errors.join(', '));
            }
            return validation.data!;
          });
        } catch (error) {
          console.warn(`Alert history validation warning at index ${index}:`, error);
        }
      });
      
      return data as AlertHistoryResponse;
    },
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes for history
    staleTime: 1 * 60 * 1000, // Consider stale after 1 minute
  });
}

/**
 * Hook to fetch comprehensive health overview with alerts
 */
export function useHealthOverview() {
  return useQuery<HealthOverviewResponse>({
    queryKey: ["health-overview"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/v1/alerts/health-overview`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch health overview: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Basic validation for health overview
      if (!data.overall_health || !data.health_score === undefined) {
        throw new Error('Invalid health overview response structure');
      }
      
      return data as HealthOverviewResponse;
    },
    refetchInterval: 60 * 1000, // Refresh every minute
    retry: 3,
  });
}

/**
 * Hook to trigger manual health check
 */
export function useTriggerHealthCheck() {
  return async () => {
    const response = await fetch(`${API_BASE}/api/v1/alerts/check`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to trigger health check: ${response.statusText}`);
    }
    
    return response.json();
  };
}

/**
 * Hook to get alerts for a specific service with validation
 */
export function useServiceAlerts(serviceName: string) {
  return useQuery({
    queryKey: ["service-alerts", serviceName],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/v1/alerts/services/${serviceName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts for ${serviceName}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate service alerts response
      if (!data.service_name || !Array.isArray(data.active_alerts)) {
        throw new Error('Invalid service alerts response structure');
      }
      
      return data;
    },
    enabled: !!serviceName,
    refetchInterval: 45 * 1000, // Refresh every 45 seconds
  });
}
