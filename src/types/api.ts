/**
 * Frontend API Types - Aligned with Backend OpenAPI Schema
 * 
 * This file provides properly typed interfaces that align with the backend
 * OpenAPI schema for contract validation and type safety.
 */

import type { 
  components,
  operations 
} from '@/lib/api-types';

// Extract component schemas for easier use
export type Schemas = components['schemas'];

// Core Response Types from Backend
export type AnomalyResponse = Schemas['AnomalyResponse'];
export type GeopoliticalEvent = Schemas['GeopoliticalEvent'];
export type SupplyChainDisruption = Schemas['SupplyChainDisruption'];
export type DisruptionPredictionsResponse = Schemas['DisruptionPredictionsResponse'];
export type CascadeSnapshotResponse = Schemas['CascadeSnapshotResponse'];
export type CascadeHistoryResponse = Schemas['CascadeHistoryResponse'];
export type CascadeImpactsResponse = Schemas['CascadeImpactsResponse'];
export type ProviderHealthResponse = Schemas['ProviderHealthResponse'];
export type TransparencyFreshnessResponse = Schemas['TransparencyFreshnessResponse'];

// Geopolitical Intelligence Types
export type GeopoliticalDisruptionsResponse = Schemas['GeopoliticalDisruptionsResponse'];

// Maritime Intelligence Types  
export type PortCongestionResponse = Schemas['PortCongestionResponse'];
export type ShippingDelaysResponse = Schemas['ShippingDelaysResponse'];
export type VesselsNearPortResponse = Schemas['VesselsNearPortResponse'];
export type MaritimeProvidersResponse = Schemas['MaritimeProvidersResponse'];
export type MaritimeIntelligenceHealthResponse = Schemas['MaritimeIntelligenceHealthResponse'];

// Production Alerts Types (newly added)
export interface ProductionAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  alert_type: string;
  service_name: string;
  message: string;
  timestamp: string;
  metadata: Record<string, unknown>;
  resolved: boolean;
  resolved_at?: string;
}

export interface ActiveAlertsResponse {
  active_alerts: ProductionAlert[];
  summary: {
    total_alerts: number;
    critical_alerts: number;
    high_alerts: number;
    medium_alerts: number;
    low_alerts: number;
    has_critical: boolean;
    overall_alert_level: string;
  };
  timestamp: string;
}

export interface AlertHistoryResponse {
  alert_history: ProductionAlert[];
  total_returned: number;
  timestamp: string;
}

export interface HealthOverviewResponse {
  overall_health: 'healthy' | 'degraded' | 'critical' | 'warning';
  alert_summary: Record<string, unknown>;
  active_alerts_count: number;
  critical_issues: ProductionAlert[];
  health_score: number;
  recommendations: string[];
  timestamp: string;
}

// Legacy types for backward compatibility
export interface NetworkSnapshot {
  nodes: Array<{
    id: string;
    name: string;
    sector: string;
    risk: number;
  }>;
  criticalPaths: string[];
  summary: string;
  updatedAt: string;
  vulnerabilities: Array<{
    node: string;
    risk: number;
    description: string;
  }>;
  partnerDependencies: Array<{
    partner: string;
    dependency: string;
    status: 'stable' | 'watch' | 'critical';
  }>;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  driver: string;
  timestamp: string;
}

// API Endpoint Types (extracted from paths)
export type GetHealthCheck = operations['health_check_health_get'];
export type GetAnomalies = operations['get_anomalies_api_v1_analytics_anomalies_get'];

// Utility types for API responses
export type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  timestamp: string;
};

// Frontend-specific interfaces
export interface ComponentsResponse {
  ras: number;
  geri: number;
  forecast: number;
  updatedAt: string;
}

export interface RiskOverview {
  riskScore: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  drivers: string[];
}

// Contract validation helpers
export const validateGeopoliticalEvent = (data: unknown): data is GeopoliticalEvent => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'event_id' in data &&
    'event_type' in data &&
    'location' in data &&
    'impact_score' in data
  );
};

export const validateSupplyChainDisruption = (data: unknown): data is SupplyChainDisruption => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'disruption_id' in data &&
    'severity' in data &&
    'location' in data &&
    'description' in data
  );
};

export const validateProductionAlert = (data: unknown): data is ProductionAlert => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'severity' in data &&
    'service_name' in data &&
    'message' in data
  );
};

// API endpoint URLs (for contract documentation)
export const API_ENDPOINTS = {
  // Core endpoints
  health: '/health',
  anomalies: '/api/v1/analytics/anomalies',
  
  // Geopolitical intelligence
  geopoliticalDisruptions: '/api/v1/geopolitical/disruptions',
  geopoliticalEvents: '/api/v1/geopolitical/events',
  
  // Maritime intelligence
  portCongestion: '/api/v1/maritime/port-congestion',
  shippingDelays: '/api/v1/maritime/shipping-delays',
  vesselTracking: '/api/v1/maritime/vessels-near-port',
  maritimeProviders: '/api/v1/maritime/providers',
  maritimeHealth: '/api/v1/maritime/health',
  
  // Production alerts
  activeAlerts: '/api/v1/alerts/active',
  alertHistory: '/api/v1/alerts/history',
  alertSummary: '/api/v1/alerts/summary',
  healthOverview: '/api/v1/alerts/health-overview',
  
  // Monitoring
  providerHealth: '/api/v1/monitoring/provider-health',
  dataFreshness: '/api/v1/monitoring/data-freshness',
  cacheStatus: '/api/v1/monitoring/cache-status',
  
  // Network cascade
  cascadeSnapshot: '/api/v1/cascade/snapshot',
  cascadeHistory: '/api/v1/cascade/history',
  cascadeImpacts: '/api/v1/cascade/impacts',
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
