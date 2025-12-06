
interface MLInsightsData {
  supply_chain_insights: {
    predictions: Array<{
      route_id: string;
      risk_level: string;
      confidence: number;
      predicted_delay: number;
      impact_factors: string[];
    }>;
    insights: string[];
    model_performance: {
      accuracy: number;
      confidence: number;
      last_trained: string;
    };
  };
  market_trend_insights: {
    predictions: Array<{
      metric: string;
      current_value: number;
      predicted_value: number;
      trend: string;
      confidence: number;
    }>;
    insights: string[];
    model_performance: {
      accuracy: number;
      confidence: number;
      last_trained: string;
    };
  };
  anomaly_insights: {
    anomalies: Array<{
      metric: string;
      value: number;
      expected_range: [number, number];
      severity: string;
      detected_at: string;
    }>;
    insights: string[];
    model_performance: {
      precision: number;
      recall: number;
      last_trained: string;
    };
  };
  summary_metrics: {
    total_predictions: number;
    high_confidence_predictions: number;
    anomalies_detected: number;
    overall_risk_level: string;
  };
}

interface NetworkMLInsightsData {
  cascade_analysis: {
    cascade_risk_score: number;
    risk_level: string;
    confidence: number;
    critical_nodes: Array<{
      id: string;
      name: string;
      risk_score: number;
      type: string;
    }>;
    critical_edges: Array<{
      from: string;
      to: string;
      criticality: number;
      flow: number;
      congestion: number;
    }>;
    risk_factors: string[];
    insights: string[];
    model_performance: {
      accuracy: number;
      last_trained: string;
      feature_importance: Record<string, number>;
    };
    prediction_timestamp: string;
  };
  resilience_analysis: {
    resilience_score: number;
    resilience_level: string;
    redundancy_score: number;
    estimated_recovery_hours: number;
    confidence: number;
    insights: string[];
    model_performance: {
      accuracy: number;
      last_trained: string;
    };
    prediction_timestamp: string;
  };
  anomaly_analysis: {
    anomalies: Array<{
      type: string;
      entity_id: string;
      entity_name: string;
      anomaly_score: number;
      severity: string;
      detected_at: string;
      details: string;
    }>;
    total_anomalies: number;
    severity_breakdown: {
      high: number;
      medium: number;
      low: number;
    };
    insights: string[];
    model_performance: {
      precision: number;
      recall: number;
      last_trained: string;
    };
    detection_timestamp: string;
  };
  overall_metrics: {
    network_health_score: number;
    overall_status: string;
    total_nodes: number;
    total_edges: number;
    critical_paths: number;
    active_disruptions: number;
  };
  summary_insights: string[];
  analysis_timestamp: string;
}

interface SupplyChainPredictionRequest {
  route_data: {
    routes: Array<{
      origin: string;
      destination: string;
      risk_level: string;
    }>;
  };
  economic_data: {
    financial_health: Array<any>;
    country_risk: Array<any>;
    trade_flows: Array<any>;
  };
  prediction_horizon?: number;
}

interface MarketTrendPredictionRequest {
  market_data: {
    financial_health: Array<any>;
    country_risk: Array<any>;
    trade_flows: Array<any>;
  };
  prediction_horizon?: number;
  include_confidence?: boolean;
}

interface AnomalyDetectionRequest {
  market_data: {
    financial_health: Array<any>;
    country_risk: Array<any>;
    trade_flows: Array<any>;
  };
  sensitivity?: number;
}

import { buildApiUrl, getApiFetch } from '@/lib/api-config';

export class MLIntelligenceService {
  private static instance: MLIntelligenceService;

  public static getInstance(): MLIntelligenceService {
    if (!MLIntelligenceService.instance) {
      MLIntelligenceService.instance = new MLIntelligenceService();
    }
    return MLIntelligenceService.instance;
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const fetchFn = getApiFetch();
        const response = await fetchFn(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
        });

        if (response.ok) {
          return response;
        }

        if (response.status >= 500 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error('Max retries exceeded');
  }

  async getMLInsightsSummary(): Promise<MLInsightsData> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/insights/summary'),
        { method: 'GET' }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch ML insights summary:', error);
      
      // Check if this is a 503 error (service unavailable) vs network error
      if (error instanceof Response && error.status === 503) {
        throw new Error('ML insights service unavailable - no cached data available');
      }
      
      // For other errors, throw to let the component handle gracefully
      throw new Error(`ML insights service error: ${error}`);
      
      // Note: Fallback data removed - components should use error states instead
    }
  }

  async predictSupplyChainRisk(request: SupplyChainPredictionRequest): Promise<any> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/supply-chain/predict'),
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to predict supply chain risk:', error);
      return null;
    }
  }

  async predictMarketTrends(request: MarketTrendPredictionRequest): Promise<any> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/market/predict'),
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to predict market trends:', error);
      return null;
    }
  }

  async detectAnomalies(request: AnomalyDetectionRequest): Promise<any> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/anomalies/detect'),
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      return null;
    }
  }

  async getModelStatus(): Promise<any> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/models/status'),
        { method: 'GET' }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to get model status:', error);
      return {
        supply_chain_model: { status: "offline", last_update: "Record<string, unknown>" },
        market_trends_model: { status: "offline", last_update: "Record<string, unknown>" },
        anomaly_detection_model: { status: "offline", last_update: "Record<string, unknown>" }
      };
    }
  }

  async triggerModelTraining(): Promise<boolean> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/models/train'),
        { method: 'POST' }
      );

      return response.ok;
    } catch (error) {
      console.error('Failed to trigger model training:', error);
      return false;
    }
  }

  async getNetworkMLInsights(): Promise<NetworkMLInsightsData> {
    try {
      const response = await this.fetchWithRetry(
        buildApiUrl('/api/v1/ml/network/insights/summary'),
        { method: 'GET' }
      );

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Failed to fetch network ML insights:', error);
      
      // Check if this is a 503 error (service unavailable) vs network error
      if (error instanceof Response && error.status === 503) {
        throw new Error('Network ML insights service unavailable - no cached data available');
      }
      
      // For other errors, throw to let the component handle gracefully
      throw new Error(`Network ML insights service error: ${error}`);
    }
  }
}

export const mlIntelligenceService = MLIntelligenceService.getInstance();
