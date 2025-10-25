// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'loading' | 'not_found';
  data?: T;
  message?: string;
  timestamp: string;
  source?: 'cache' | 'database' | 'api';
}

// Risk Score Types
export interface RiskScore {
  overall_score: number;
  confidence: number;
  trend: 'rising' | 'falling' | 'stable';
  components: {
    economic: number;
    market: number;
    geopolitical: number;
    technical: number;
  };
  timestamp: string;
  calculation_method?: string;
  data_sources?: string[];
}

// Backend API RiskFactor interface (matches backend response)
export interface BackendRiskFactor {
  name: string;
  score: number;
  impact: 'low' | 'moderate' | 'high';
  trend: 'rising' | 'falling' | 'stable';
  description: string;
}

// Backend API response structure for risk factors
export interface RiskFactorsResponse {
  factors: BackendRiskFactor[];
  count: number;
  last_updated: string;
  data_source: string;
}

// Legacy RiskFactor interface (kept for compatibility)
export interface RiskFactor {
  id?: number;
  name: string;
  category?: 'economic' | 'market' | 'geopolitical' | 'technical';
  description?: string;
  current_value?: number;
  current_score?: number;
  score: number; // Primary score field
  impact_level?: 'low' | 'moderate' | 'high' | 'critical';
  impact: 'low' | 'moderate' | 'high'; // Backend uses this field
  trend: 'rising' | 'falling' | 'stable';
  weight?: number;
  data_source?: string;
  series_id?: string;
  last_updated?: string;
  thresholds?: {
    low?: number;
    high?: number;
  };
}

// Economic Data Types
export interface EconomicIndicator {
  value: number;
  units: string;
  frequency: string;
  last_updated: string;
  title?: string;
  series_id?: string;
}

export interface EconomicIndicators {
  gdp?: EconomicIndicator;
  unemployment?: EconomicIndicator;
  inflation?: EconomicIndicator;
  fed_funds_rate?: EconomicIndicator;
}

// Alert Types
export interface Alert {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  triggered_by?: string;
  threshold_value?: number;
  current_value?: number;
  triggered_at: string;
  metadata?: any;
}

// Dashboard Types
export interface DashboardData {
  current_risk?: RiskScore;
  alert_summary: {
    total_active: number;
    by_severity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
  };
  top_risk_factors: Array<{
    name: string;
    category: string;
    score: number;
    impact: string;
  }>;
  system_status: string;
}

// Cache and System Types
export interface CacheMetrics {
  redis_hits: number;
  postgres_hits: number;
  file_hits: number;
  cache_misses: number;
  total_requests: number;
  hit_rate_percent: number;
}

export interface ApiHealth {
  fred: { status: string; error?: string };
  bea: { status: string; error?: string };
  bls: { status: string; error?: string };
  census: { status: string; error?: string };
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface RiskHistoryPoint {
  timestamp: string;
  overall_score: number;
  confidence: number;
  trend: string;
  components: {
    economic: number;
    market: number;
    geopolitical: number;
    technical: number;
  };
}

// Navigation Types
export interface NavItem {
  name: string;
  href: string;
  icon: any;
  description?: string;
  badge?: string | number;
}

// Component Props
export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  status?: 'good' | 'warning' | 'critical';
  icon?: any;
  loading?: boolean;
}

export interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'good' | 'critical' | 'info';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

// Error Types
export interface ApiError {
  message: string;
  status?: number;
  timestamp: string;
}