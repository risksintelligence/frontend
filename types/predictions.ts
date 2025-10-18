/**
 * TypeScript interfaces for prediction and forecasting functionality
 * Based on backend API specifications in src/api/routes/prediction.py
 */

export interface PredictionRequest {
  horizon_days: number;
  confidence_level: number;
  scenario_params?: Record<string, any>;
  include_factors: boolean;
}

export interface ForecastPoint {
  date: string;
  predicted_value: number;
  confidence_lower: number;
  confidence_upper: number;
  volatility: number;
}

export interface RiskFactorForecast {
  factor_name: string;
  category: string;
  current_value: number;
  forecast_values: ForecastPoint[];
  impact_weight: number;
  confidence: number;
}

export interface PredictionResponse {
  prediction_id: string;
  timestamp: string;
  horizon_days: number;
  predictions: ForecastPoint[];
  confidence_level: number;
  model_version: string;
  explanation?: {
    key_drivers: string[];
    risk_factors: RiskFactorForecast[];
    scenario_impact: Record<string, number>;
    methodology: string;
  };
}

export interface ScenarioRequest {
  scenario_name: string;
  parameters: Record<string, any>;
  duration_days: number;
}

export interface ScenarioAnalysis {
  scenario_id: string;
  scenario_name: string;
  base_case: ForecastPoint[];
  scenario_case: ForecastPoint[];
  impact_metrics: {
    max_deviation: number;
    avg_impact: number;
    risk_change: number;
    volatility_change: number;
  };
  risk_factors_impact: RiskFactorForecast[];
  timestamp: string;
}

export interface ModelStatus {
  model_name: string;
  version: string;
  status: 'active' | 'training' | 'error' | 'deprecated';
  accuracy_metrics: {
    mae: number;
    rmse: number;
    r_squared: number;
    last_updated: string;
  };
  training_data: {
    start_date: string;
    end_date: string;
    observations: number;
  };
}

export interface ForecastControls {
  horizon_days: number;
  confidence_level: number;
  include_factors: boolean;
  refresh_interval: number;
}

export interface ForecastError {
  type: 'api_error' | 'network_error' | 'validation_error' | 'timeout_error';
  message: string;
  details?: string;
  retry_suggested: boolean;
}

export interface ForecastState {
  data: PredictionResponse | null;
  loading: boolean;
  error: ForecastError | null;
  lastUpdated: string | null;
}