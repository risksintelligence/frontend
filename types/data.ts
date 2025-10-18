/**
 * TypeScript interfaces for data management functionality
 * Based on backend API specifications in src/api/routes/data.py
 */

export interface DataSource {
  name: string;
  description: string;
  categories: string[];
  update_frequency: string;
  total_series: number;
  key_series: string[];
  api_status: string;
  last_update: string;
}

export interface DataSourcesResponse {
  sources: { [key: string]: DataSource };
  total_sources: number;
  active_sources: number;
  last_updated: string;
  data_coverage: {
    economic_indicators: number;
    financial_data: number;
    trade_data: number;
    environmental_data: number;
  };
}

export interface DataSeries {
  id: string;
  name: string;
  frequency: string;
  start: string;
  category: string;
}

export interface SourceSeriesResponse {
  source: string;
  category?: string;
  search_term?: string;
  total_found: number;
  returned: number;
  series: DataSeries[];
  timestamp: string;
}

export interface DataRequest {
  source: string;
  series?: string[];
  start_date?: string;
  end_date?: string;
  frequency?: string;
  include_metadata: boolean;
}

export interface DataObservation {
  date: string;
  value: number;
  series_id?: string;
  unit?: string;
}

export interface DataResponse {
  source: string;
  timestamp: string;
  data: {
    observations?: DataObservation[];
    metadata?: any;
    [key: string]: any;
  };
  metadata?: any;
  count: number;
  cache_status: string;
}

export interface DataQualityMetrics {
  completeness: number;
  timeliness: number;
  accuracy: number;
  consistency: number;
  last_quality_check: string;
  issues: {
    missing_values: number;
    delayed_updates: number;
    revision_frequency: number;
  };
  update_statistics: {
    expected_frequency: string;
    actual_frequency: string;
    last_update: string;
    average_delay_hours?: number;
    average_delay_days?: number;
  };
}

export interface QualityResponse {
  source: string;
  overall_quality_score: number;
  quality_grade: string;
  metrics: DataQualityMetrics;
  recommendations: (string | null)[];
  timestamp: string;
}

export interface PipelineStatus {
  overall_status: string;
  last_health_check: string;
  data_sources: {
    [source: string]: {
      status: string;
      last_update: string;
      next_update: string;
    };
  };
  system_metrics: {
    total_series_tracked: number;
    active_sources: number;
    cache_hit_rate: number;
    average_api_response_time_ms: number;
    daily_api_calls: number;
    storage_used_gb: number;
  };
  recent_updates: Array<{
    source: string;
    series_updated: number;
    timestamp: string;
    status: string;
  }>;
  upcoming_updates: Array<{
    source: string;
    scheduled_time: string;
    expected_series: number;
    priority: string;
  }>;
  alerts: string[];
  performance_trends: {
    data_quality_score: number;
    uptime_percentage: number;
    error_rate: number;
  };
}

export interface DataExportRequest {
  source: string;
  format: 'json' | 'csv' | 'excel';
  series?: string;
  start_date?: string;
  end_date?: string;
}

export interface DataControls {
  source?: string;
  category?: string;
  search?: string;
  limit?: number;
  series_id?: string;
  start_date?: string;
  end_date?: string;
  frequency?: string;
  use_cache?: boolean;
  format?: 'json' | 'csv' | 'excel';
}

export interface DataError {
  type: 'api_error' | 'network_error' | 'validation_error' | 'export_error';
  message: string;
  details?: string;
  endpoint?: string;
  retry_suggested: boolean;
}

export interface DataState {
  sources: DataSourcesResponse | null;
  currentSource: string | null;
  series: SourceSeriesResponse | null;
  fetchedData: DataResponse | null;
  quality: QualityResponse | null;
  pipelineStatus: PipelineStatus | null;
  loading: boolean;
  error: DataError | null;
  lastUpdated: string | null;
}

export interface TimeSeriesData {
  series_id: string;
  name: string;
  source: string;
  category: string;
  frequency: string;
  observations: DataObservation[];
  metadata: {
    start_date: string;
    end_date: string;
    units: string;
    seasonal_adjustment?: string;
    last_updated: string;
  };
  quality_metrics: {
    completeness: number;
    data_points: number;
    missing_values: number;
    outliers_detected: number;
  };
}

export interface DataVisualization {
  chart_type: 'line' | 'bar' | 'area' | 'scatter';
  title: string;
  x_axis: {
    label: string;
    type: 'date' | 'numeric' | 'categorical';
  };
  y_axis: {
    label: string;
    unit: string;
    scale?: 'linear' | 'log';
  };
  series: Array<{
    id: string;
    name: string;
    color: string;
    data: DataObservation[];
  }>;
  annotations?: Array<{
    date: string;
    label: string;
    type: 'line' | 'point' | 'range';
  }>;
}

export interface DataAnalysis {
  summary_statistics: {
    mean: number;
    median: number;
    std_dev: number;
    min: number;
    max: number;
    skewness: number;
    kurtosis: number;
  };
  trend_analysis: {
    direction: 'increasing' | 'decreasing' | 'stable';
    strength: number;
    seasonality: boolean;
    cycle_length?: number;
  };
  correlations: {
    [series_id: string]: number;
  };
  anomalies: Array<{
    date: string;
    value: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  forecasting_notes: {
    data_sufficiency: boolean;
    recommended_models: string[];
    confidence_factors: string[];
  };
}

export interface DataComparison {
  base_series: TimeSeriesData;
  comparison_series: TimeSeriesData[];
  comparison_metrics: {
    correlation: number;
    covariance: number;
    relative_volatility: number;
    lead_lag_relationship?: {
      lead_series: string;
      lag_days: number;
      correlation_at_lag: number;
    };
  };
  synchronized_data: Array<{
    date: string;
    base_value: number;
    comparison_values: { [series_id: string]: number };
  }>;
}

export interface DataDownload {
  filename: string;
  format: 'json' | 'csv' | 'excel';
  size_bytes: number;
  download_url: string;
  expires_at: string;
  metadata: {
    sources: string[];
    series_count: number;
    date_range: string;
    generated_at: string;
  };
}