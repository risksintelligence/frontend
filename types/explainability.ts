/**
 * TypeScript interfaces for model explainability and interpretability
 * Based on backend SHAP and explainability endpoints
 */

export interface FeatureImportance {
  feature: string;
  importance: number;
  current_value: number;
  contribution: string;
  interpretation: string;
}

export interface CounterfactualScenario {
  scenario: string;
  risk_change: string;
  new_risk_level: string;
  probability: 'feasible' | 'possible' | 'unlikely';
}

export interface ConfidenceInterval {
  lower_bound: number;
  upper_bound: number;
  confidence_level: number;
}

export interface BiasCheck {
  fairness_score: number;
  demographic_parity: 'pass' | 'fail' | 'warning';
  equal_opportunity: 'pass' | 'fail' | 'warning';
  potential_biases: string[];
}

export interface ModelExplanation {
  prediction_id: string;
  explanation_type: 'post_hoc' | 'intrinsic';
  methodology: string;
  feature_importance: FeatureImportance[];
  counterfactuals: CounterfactualScenario[];
  confidence_intervals: ConfidenceInterval;
  bias_check: BiasCheck;
  model_limitations: string[];
}

export interface ModelPerformanceMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  mse?: number;
  mae?: number;
  r_squared?: number;
  auc_roc?: number;
  features_count: number;
  training_samples: number;
}

export interface ModelStatus {
  version: string;
  status: 'active' | 'inactive' | 'training' | 'error';
  last_trained: string;
  features_count: number;
  training_samples: number;
}

export interface ModelSystemStatus {
  prediction_service: 'operational' | 'degraded' | 'offline';
  cache_status: 'healthy' | 'degraded' | 'offline';
  model_registry: 'connected' | 'disconnected';
  last_health_check: string;
  active_models: number;
  total_predictions_today: number;
  avg_response_time_ms: number;
}

export interface ModelStatusResponse {
  system_status: ModelSystemStatus;
  models: {
    risk_scorer: ModelStatus & ModelPerformanceMetrics;
    economic_predictor: ModelStatus & ModelPerformanceMetrics;
    supply_chain_analyzer: ModelStatus & ModelPerformanceMetrics;
  };
  timestamp: string;
}

export interface SHAPValue {
  feature: string;
  shap_value: number;
  base_value: number;
  feature_value: number;
  display_value: string;
}

export interface SHAPAnalysis {
  prediction_id: string;
  model_output: number;
  base_value: number;
  shap_values: SHAPValue[];
  feature_names: string[];
  expected_value: number;
  sum_of_shap_values: number;
}

export interface FeatureDistribution {
  feature: string;
  min_value: number;
  max_value: number;
  mean_value: number;
  std_value: number;
  percentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
  };
}

export interface ModelTransparencyReport {
  model_name: string;
  model_version: string;
  training_date: string;
  feature_distributions: FeatureDistribution[];
  global_feature_importance: {
    feature: string;
    importance: number;
    rank: number;
  }[];
  model_architecture: {
    type: string;
    parameters: number;
    layers?: number;
    hyperparameters: Record<string, any>;
  };
  training_metrics: ModelPerformanceMetrics;
  validation_results: {
    cross_validation_score: number;
    holdout_test_score: number;
    temporal_validation_score?: number;
  };
  ethical_considerations: {
    bias_testing: BiasCheck;
    fairness_metrics: Record<string, number>;
    ethical_review_date: string;
  };
}

export interface ExplainabilityInsight {
  id: string;
  type: 'feature_importance' | 'bias_detection' | 'model_drift' | 'performance_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  created_at: string;
  model_affected: string;
  data?: Record<string, any>;
}

export interface PerformanceTrend {
  date: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  predictions_count: number;
}

export interface ModelDriftDetection {
  model_name: string;
  drift_detected: boolean;
  drift_score: number;
  drift_threshold: number;
  affected_features: string[];
  detection_date: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ExplainabilityConfig {
  max_features_displayed: number;
  shap_sample_size: number;
  confidence_threshold: number;
  bias_check_enabled: boolean;
  counterfactual_count: number;
}

export interface ExplainabilityFilters {
  model_name?: string;
  feature_name?: string;
  importance_threshold?: number;
  date_range?: {
    start: string;
    end: string;
  };
  prediction_type?: string;
}