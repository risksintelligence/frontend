/**
 * TypeScript interfaces for advanced analytics functionality
 * Based on backend API specifications in src/api/routes/analytics.py
 */

export interface EconomicOverview {
  overall_risk_level: string;
  economic_momentum: string;
  market_stress_level: string;
  key_concerns: string[];
  positive_signals: string[];
  timestamp: string;
}

export interface CategorySummary {
  category_name: string;
  indicator_count: number;
  avg_risk_score: number;
  category_trend: string;
  category_volatility: string;
  key_indicators: string[];
  last_updated: string;
}

export interface IndicatorSummary {
  indicator_name: string;
  category: string;
  current_value: number;
  mean: number;
  median: number;
  std_dev: number;
  trend_direction: string;
  volatility_level: string;
  last_updated: string;
  data_points: number;
}

export interface AggregationMetadata {
  total_indicators: number;
  categories_analyzed: number;
  timestamp: string;
  data_sources: string[];
  methodology: string;
  last_refresh: string;
  cache_status: string;
}

export interface CompleteAggregation {
  economic_overview: EconomicOverview;
  category_summaries: CategorySummary[];
  indicator_summaries: IndicatorSummary[];
  aggregation_metadata: AggregationMetadata;
}

export interface AnalyticalInsights {
  insights: {
    correlations?: {
      [key: string]: number;
    };
    volatility_analysis?: {
      high_volatility_indicators: string[];
      low_volatility_indicators: string[];
      avg_volatility_by_category: { [key: string]: number };
    };
    trend_analysis?: {
      improving_indicators: string[];
      declining_indicators: string[];
      stable_indicators: string[];
    };
    risk_distribution?: {
      low_risk_count: number;
      moderate_risk_count: number;
      high_risk_count: number;
    };
    statistical_summary?: {
      mean_risk_score: number;
      median_risk_score: number;
      risk_score_std: number;
      data_quality_score: number;
    };
  };
  generated_at: string;
  data_sources: string[];
  methodology: string;
}

export interface AnalyticsHealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  analytics_service: string;
  data_sources: {
    fred_connector: string;
    bea_connector: string;
    cache_manager: string;
  };
  aggregation_engine: string;
  last_successful_aggregation: string;
  timestamp: string;
  error?: string;
}

export interface AnalyticsControls {
  use_cache: boolean;
  force_refresh: boolean;
  category_filter?: string;
  time_range?: 'latest' | '1week' | '1month' | '3months';
}

export interface AnalyticsError {
  type: 'api_error' | 'network_error' | 'data_error' | 'cache_error';
  message: string;
  details?: string;
  endpoint?: string;
  retry_suggested: boolean;
}

export interface AnalyticsState {
  overview: EconomicOverview | null;
  categories: CategorySummary[] | null;
  indicators: IndicatorSummary[] | null;
  insights: AnalyticalInsights | null;
  health: AnalyticsHealthStatus | null;
  loading: boolean;
  error: AnalyticsError | null;
  last_updated: string | null;
}

export interface CategoryAnalysis {
  category: CategorySummary;
  indicators: IndicatorSummary[];
  trends: {
    risk_trend: 'improving' | 'stable' | 'declining';
    volatility_trend: 'increasing' | 'stable' | 'decreasing';
    data_quality: 'excellent' | 'good' | 'fair' | 'poor';
  };
  correlations: {
    [indicator: string]: number;
  };
  historical_context: {
    risk_percentile: number;
    volatility_percentile: number;
    trend_consistency: number;
  };
}

export interface IndicatorDetails {
  indicator: IndicatorSummary;
  historical_data?: {
    values: Array<{
      date: string;
      value: number;
      risk_score?: number;
    }>;
    statistics: {
      min: number;
      max: number;
      variance: number;
      skewness: number;
      kurtosis: number;
    };
  };
  correlations: {
    [other_indicator: string]: number;
  };
  risk_drivers: string[];
  methodology_notes: string[];
}

export interface TrendAnalysis {
  indicator_name: string;
  category: string;
  current_trend: 'up' | 'down' | 'stable';
  trend_strength: number; // 0-1
  trend_duration_days: number;
  volatility_analysis: {
    current_volatility: number;
    historical_avg_volatility: number;
    volatility_trend: 'increasing' | 'stable' | 'decreasing';
  };
  forecasting_confidence: number; // 0-1
  next_period_prediction: {
    direction: 'up' | 'down' | 'stable';
    magnitude: number;
    confidence: number;
  };
}

export interface CrossCategoryAnalysis {
  correlation_matrix: {
    [category1: string]: {
      [category2: string]: number;
    };
  };
  risk_spillover_effects: {
    from_category: string;
    to_category: string;
    spillover_strength: number;
    lag_days: number;
  }[];
  systemic_risk_indicators: {
    indicator_name: string;
    systemic_importance: number;
    current_risk_level: number;
    impact_on_system: number;
  }[];
  category_clustering: {
    cluster_id: number;
    categories: string[];
    cluster_risk_level: string;
    cluster_characteristics: string[];
  }[];
}