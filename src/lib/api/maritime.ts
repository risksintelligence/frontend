/**
 * Maritime Intelligence API Client
 * 
 * Free maritime data from AISHub, NOAA Marine Cadastre, and OpenSeaMap
 * for supply chain risk analysis and port congestion monitoring.
 */

import { apiClient } from './base';

export interface PortCongestion {
  port_code: string;
  port_name: string;
  congestion_level: 'low' | 'medium' | 'high' | 'severe';
  vessels_at_anchor: number;
  vessels_at_berth: number;
  average_wait_time_hours?: number;
  source_breakdown: Record<string, number>;
  last_updated: string;
}

export interface ShippingDelay {
  route_name: string;
  origin_port: string;
  destination_port: string;
  typical_transit_days: number;
  current_delay_days: number;
  delay_reasons: string[];
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  affected_vessels: number;
}

export interface VesselInfo {
  mmsi: number;
  vessel_name: string;
  vessel_type: string;
  lat: number;
  lng: number;
  speed?: number;
  course?: number;
  timestamp: string;
  source: string;
}

export interface MaritimeProvider {
  id: string;
  name: string;
  coverage: string;
  data_types: string[];
  rate_limit: number;
  requires_auth: boolean;
}

export interface ProviderHealth {
  overall_health: 'healthy' | 'degraded' | 'critical';
  health_score: number;
  providers: Record<string, boolean>;
  healthy_providers: number;
  total_providers: number;
}

export interface PortCongestionResponse {
  ports: PortCongestion[];
  summary: {
    total_ports_monitored: number;
    high_congestion_ports: number;
    average_vessels_at_anchor: number;
  };
}

export interface ShippingDelaysResponse {
  delays: ShippingDelay[];
  summary: {
    total_routes_monitored: number;
    routes_with_delays: number;
    critical_delays: number;
    average_delay_days: number;
  };
}

export interface RiskAssessment {
  overall_risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  high_risk_ports: string[];
  critical_delays: number;
  port_congestion_summary: Record<string, {
    name: string;
    congestion_level: string;
    vessels_waiting: number;
  }>;
  shipping_delays_summary: Array<{
    route: string;
    delay_days: number;
    severity: string;
    reasons: string[];
  }>;
  data_sources: string[];
  provider_health: Record<string, boolean>;
  last_updated: string;
}

export interface VesselsNearPortResponse {
  search_params: {
    lat: number;
    lng: number;
    radius_km: number;
  };
  vessels: VesselInfo[];
  summary: {
    total_vessels: number;
    vessels_at_anchor: number;
    vessels_moving: number;
    data_sources: string[];
  };
}

export interface MaritimeProvidersResponse {
  providers: MaritimeProvider[];
  total_providers: number;
  coverage_areas: string[];
  advantages: string[];
}

export class MaritimeAPI {
  /**
   * Get health status of maritime data providers
   */
  static async getProviderHealth(): Promise<ProviderHealth> {
    const response = await apiClient.get('/api/v1/maritime/health');
    return response.data;
  }

  /**
   * Get port congestion data for critical ports
   */
  static async getPortCongestion(ports?: string[]): Promise<PortCongestionResponse> {
    const params = ports ? { ports: ports.join(',') } : {};
    const response = await apiClient.get('/api/v1/maritime/ports/congestion', { params });
    return response.data;
  }

  /**
   * Get shipping delays across major trade routes
   */
  static async getShippingDelays(): Promise<ShippingDelaysResponse> {
    const response = await apiClient.get('/api/v1/maritime/shipping/delays');
    return response.data;
  }

  /**
   * Get comprehensive supply chain risk assessment
   */
  static async getRiskAssessment(): Promise<RiskAssessment> {
    const response = await apiClient.get('/api/v1/maritime/risk-assessment');
    return response.data;
  }

  /**
   * Get vessels near a specific port location
   */
  static async getVesselsNearPort(
    lat: number, 
    lng: number, 
    radiusKm: number = 50
  ): Promise<VesselsNearPortResponse> {
    const response = await apiClient.get('/api/v1/maritime/vessels/near-port', {
      params: { lat, lng, radius_km: radiusKm }
    });
    return response.data;
  }

  /**
   * Get information about maritime data providers
   */
  static async getProviders(): Promise<MaritimeProvidersResponse> {
    const response = await apiClient.get('/api/v1/maritime/providers');
    return response.data;
  }

  /**
   * Get critical ports data for visualization
   */
  static async getCriticalPorts(): Promise<PortCongestion[]> {
    const response = await this.getPortCongestion();
    return response.ports.filter(port => 
      port.congestion_level === 'high' || port.congestion_level === 'severe'
    );
  }

  /**
   * Get real-time maritime intelligence summary
   */
  static async getMaritimeSummary(): Promise<{
    congestion: PortCongestionResponse;
    delays: ShippingDelaysResponse;
    risk: RiskAssessment;
    health: ProviderHealth;
  }> {
    const [congestion, delays, risk, health] = await Promise.all([
      this.getPortCongestion(),
      this.getShippingDelays(),
      this.getRiskAssessment(),
      this.getProviderHealth()
    ]);

    return { congestion, delays, risk, health };
  }
}

export default MaritimeAPI;