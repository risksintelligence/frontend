/**
 * RRIO Frontend-Backend Data Contracts
 * Shared TypeScript interfaces for consistent API integration
 */

export type TrendDirection = "rising" | "falling" | "stable";

// Backend API Response Types (aligned with backend/app/main.py)
export interface BackendAnomalyResponse {
  anomalies: Array<{
    score: number;
    classification: string;
    drivers: string[];
    timestamp: string;
  }>;
  summary: {
    total_anomalies: number;
    max_severity: number;
    updated_at: string;
  };
}

export interface BackendProviderHealthResponse {
  timestamp: string;
  summary: {
    total_providers: number;
    healthy_providers: number;
    unhealthy_providers: number;
    average_reliability: number;
    overall_health: string;
  };
  providers: Record<string, {
    reliability_score: number;
    should_skip: boolean;
    last_updated: string;
    error_count: number;
  }>;
}

export interface BackendTransparencyResponse {
  freshness: Array<{
    series_id: string;
    status: 'fresh' | 'stale' | 'warning';
    last_updated: string;
    staleness_hours: number;
  }>;
}

export interface BackendRegimeResponse {
  regime: string;
  probabilities: Record<string, number>;
  confidence: number;
  updated_at: string;
  watchlist?: string[];
}

export interface BackendRASResponse {
  composite: number;
  components: Record<string, number>;
  calculated_at: string;
  metadata?: {
    total_submissions: number;
    active_partners: number;
  };
}

export interface RiskComponentBreakdown {
  economic: number;
  market: number;
  geopolitical: number;
  technical: number;
}

export interface RiskOverview {
  score: number;
  change_24h: number;
  confidence: number;
  band: string;
  color: string;
  band_color: string;
  updated_at: string;
  contributions: Record<string, number>;
  component_scores: Record<string, number>;
  components?: RiskComponentBreakdown;
  metadata: {
    error?: string;
    total_weight: number;
  };
  drivers: string[];
}

export interface Alert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  message: string;
  driver: string;
  timestamp: string;
  classification?: string;
  score?: number;
  drivers?: string[];
}

export interface RiskOverviewResponse {
  overview: RiskOverview;
  alerts: Alert[];
}

export interface GeopoliticalEvent {
  event_id: string;
  event_type: string;
  sub_event_type?: string;
  event_date: string;
  country: string;
  region?: string;
  location: [number, number];
  impact_score: number;
  confidence: number;
  source: string;
  description: string;
  affected_trade_routes?: string[];
  estimated_disruption_days?: number;
  source_url?: string;
  severity?: "critical" | "high" | "medium" | "low";
}

export interface SupplyChainDisruption {
  disruption_id: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  start_date: string;
  end_date?: string;
  source: string;
  affected_regions?: string[];
  affected_nodes?: string[];
  impacted_routes?: string[];
}

export interface GeopoliticalDisruptionsResponse {
  disruptions: SupplyChainDisruption[];
  events?: GeopoliticalEvent[];
  refreshed_at?: string;
}

export interface MaritimeProviderHealth {
  provider_id: string;
  name: string;
  type: string;
  health_score: number;
  status: "healthy" | "degraded" | "critical";
  metrics?: Record<string, number>;
  last_checked?: string;
}

export interface MaritimeHealthResponse {
  overview: {
    total_providers: number;
    healthy_providers: number;
    degraded_providers: number;
    critical_providers: number;
    average_health_score: number;
  };
  providers: MaritimeProviderHealth[];
  status_distribution?: Array<{ status: string; count: number }>;
  timestamp?: string;
}

export interface EconomicIndicator {
  id: string;
  label: string;
  value: number;
  unit: string;
  changePercent: number;
  updatedAt: string;
  category: "growth" | "employment" | "inflation" | "monetary" | "trade";
}

export interface EconomicData {
  indicators: EconomicIndicator[];
  updatedAt: string;
  summary: string;
}

export interface RegimeProbability {
  name: string;
  probability: number;
  trend: TrendDirection;
}

export interface RegimeData {
  current: string;
  probabilities: RegimeProbability[];
  watchlist?: string[];
  confidence?: number;
  updatedAt: string;
}

export interface ForecastPoint {
  timestamp: string;
  value: number;
  lower: number;
  upper: number;
}

export interface ForecastData {
  delta24h: number;
  points: ForecastPoint[];
  updatedAt: string;
  commentary: string;
  backtest?: ForecastBacktestPoint[];
}

export interface ForecastBacktestPoint {
  timestamp: string;
  predicted: number;
  realized: number;
  lower?: number;
  upper?: number;
}

export interface GeriHistoryPoint {
  timestamp: string;
  score: number;
  band?: string;
  color?: string;
}

export interface GeriHistoryData {
  points: GeriHistoryPoint[];
  updatedAt: string;
}

export interface ForecastHistoryResponse {
  history: ForecastBacktestPoint[];
  generated_at?: string;
}

export interface AnomalyHistoryPoint {
  timestamp: string;
  score: number;
  classification: string;
  severity: string;
}

export interface AnomalyHistoryResponse {
  history: AnomalyHistoryPoint[];
  generated_at?: string;
}

export interface ProviderReliabilityPoint {
  timestamp: string;
  reliability: number;
}

export interface ProviderHealthHistoryResponse {
  history: Record<string, ProviderReliabilityPoint[]>;
  generated_at?: string;
}

export interface SeriesFreshnessHistoryResponse {
  history: Record<string, Array<{ timestamp: string; age_hours: number | null }>>;
  generated_at?: string;
  days?: number;
}

export interface GovernanceModel {
  model_id: string;
  version: string;
  model_type: string;
  registered_at: string;
  risk_level?: string;
  intended_use?: string;
  performance_metrics?: Record<string, number>;
}

export interface GovernanceModelsResponse {
  status: string;
  total_models: number;
  models: GovernanceModel[];
  retrieved_at: string;
}

// Supply chain cascade
export interface CascadeNode {
  id: string;
  name: string;
  type: string; // port | plant | region | dc | hub
  lat: number;
  lng: number;
  risk_operational: number;
  risk_financial: number;
  risk_policy: number;
  industry_impacts: Record<string, number>;
}

export interface CascadeEdge {
  from: string;
  to: string;
  mode: string; // sea | air | rail | road | pipeline
  flow: number;
  congestion: number;
  eta_delay_hours: number;
  criticality: number;
}

export interface CascadeDisruption {
  id: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  location: [number, number];
  description: string;
  source?: string;
}

export interface CascadeSnapshotResponse {
  as_of: string;
  nodes: CascadeNode[];
  edges: CascadeEdge[];
  critical_paths: string[][];
  disruptions: CascadeDisruption[];
}

export interface CascadeHistorySeries {
  metric: string;
  points: Array<{ t: string; v: number }>;
}

export interface CascadeHistoryResponse {
  series: CascadeHistorySeries[];
}

export interface CascadeImpactsResponse {
  financial: Record<string, unknown>;
  policy: Record<string, unknown>;
  industry: Record<string, unknown>;
}

// WTO trade volume
export interface WtoTradeVolume {
  total_global_trade: number;
  year_on_year_growth: number;
  regional_breakdown: Record<string, number>;
  top_traders: Array<{ country?: string; value?: number }>;
  forecast_next_year?: number;
  data_timestamp?: string;
}

export interface GovernanceComplianceReport {
  model_name: string;
  overall_compliance_score: number;
  nist_rmf_functions: {
    govern: number;
    map: number;
    measure: number;
    manage: number;
  };
  total_models: number;
  active_alerts: number;
  generated_at: string;
  compliance_status: string;
}

export interface GovernanceComplianceResponse {
  status: string;
  model_name: string;
  compliance_report: GovernanceComplianceReport;
  generated_at: string;
  report_version: string;
}

export interface ExplainabilityAuditEntry {
  decision_id: string;
  model_id: string;
  model_version: string;
  accessed_by: string;
  access_timestamp: string;
  explanation_level: string;
  business_justification?: string;
  compliance_tags?: string[];
}

export interface ExplainabilityAuditResponse {
  status: string;
  audit_logs: ExplainabilityAuditEntry[];
  total_entries: number;
  period: {
    start_date: string;
    end_date: string;
    duration_days: number;
  };
  retrieved_at: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  sector: string;
  risk: number;
}

export interface NetworkSnapshot {
  nodes: NetworkNode[];
  criticalPaths: string[];
  summary: string;
  updatedAt: string;
  vulnerabilities?: Array<{
    node: string;
    risk: number;
    description: string;
  }>;
  partnerDependencies?: Array<{
    partner: string;
    dependency: string;
    status: "stable" | "watch" | "critical";
  }>;
}

export interface ScenarioOutcome {
  name: string;
  grii: number;
  probability: number;
  description: string;
}

export interface ScenarioAnalysisResult {
  currentState: {
    grii: number;
    regime: string;
    probability: number;
  };
  scenarios: ScenarioOutcome[];
  updatedAt: string;
}

export interface CorrelationAnalysisResult {
  factors: string[];
  matrix: number[][];
  significance: boolean[][];
  updatedAt: string;
}

export interface MissionHighlight {
  id: string;
  title: string;
  status: "draft" | "active" | "completed";
  metric: string;
  updatedAt: string;
}

export interface ComponentMetric {
  id: string;
  value: number;
  z_score: number;
}

export interface ComponentsResponse {
  components: ComponentMetric[];
}

export interface NewsroomBrief {
  id: string;
  headline: string;
  author: string;
  timestamp: string;
  link?: string;
}

export interface RasMetric {
  label: string;
  value: number;
  change: number;
  status: "good" | "warning" | "critical";
}

export interface RasSummary {
  score: number;
  delta: number;
  updatedAt: string;
  metrics: RasMetric[];
  partners: string[];
}

export interface TransparencyIssue {
  name: string;
  ttlMinutes: number;
  status: "soft" | "approaching" | "breached";
}

export interface TransparencyLineageObservation {
  observed_at: string;
  value: number | string;
  source: string;
  source_url?: string;
  fetched_at?: string;
  age_hours: number;
  soft_ttl: number;
  hard_ttl: number;
  derivation_flag?: string;
  checksum?: string;
}

export interface TransparencyLineage {
  series_id: string;
  status: string;
  total_observations: number;
  latest_fetch?: string;
  observations: TransparencyLineageObservation[];
}

export interface TransparencyUpdateLog {
  entries: Array<{ description: string; date: string; event_type?: string }>;
}


export interface RegimeDriver {
  feature: string;
  importance: number;
  value: number;
}

export interface ForecastDriver {
  feature: string;
  contribution: number;
  coef: number;
  value: number;
}

export interface ExplainabilityData {
  regime: RegimeDriver[];
  forecast: ForecastDriver[];
  generated_at?: string;
}

// Backend API response types
export interface BackendProjectDetail {
  name: string;
  status: string;
  priority: string;
  completion: number;
  lead: string;
}

export interface BackendPartner {
  lab_id: string;
  sector: string;
  status: string;
  deliverables: string[];
  showcase_date: string;
  engagement_score?: number;
  project_details?: BackendProjectDetail[];
}

export interface BackendPartnersResponse {
  partners: BackendPartner[];
}

export interface BackendRasResponse {
  composite: number;
  components: {
    [key: string]: number;
  };
  calculated_at: string;
}

export interface AnomalyData {
  score: number;
  classification: "normal" | "anomaly";
  drivers: string[];
  timestamp: string;
}

export interface AnomaliesResponse {
  anomalies: AnomalyData[];
  summary: {
    total_anomalies: number;
    max_severity: number;
    updated_at: string;
  };
}

export interface CacheLayerStatus {
  status: "available" | "unavailable" | "empty";
  cache_layer: string;
  total_observations?: number;
  recent_observations?: number;
  fresh_percentage?: number;
}

export interface SeriesFreshness {
  latest_fetch: string;
  latest_observation: string;
  age_hours: number;
  total_observations: number;
  freshness: "fresh" | "stale";
}

export interface TransparencyStatus {
  timestamp: string;
  overall_status: "healthy" | "degraded" | "critical";
  cache_layers: {
    l1_redis: CacheLayerStatus;
    l2_postgresql: CacheLayerStatus;
    l3_file_store: CacheLayerStatus;
    unified_status: {
      architecture: string;
      stale_while_revalidate: boolean;
      data_lineage: boolean;
      ttl_management: boolean;
    };
  };
  series_freshness: Record<string, SeriesFreshness>;
  background_refresh: {
    running: boolean;
    queue_length: number;
    current_tasks: string[];
  };
  provider_health: Record<string, {
    reliability_score: number;
    failure_count: number;
    last_failure: string | null;
    rate_limit_per_minute: number;
    should_skip: boolean;
    supported_series: string[];
  }>;
  compliance: {
    data_lineage_enabled: boolean;
    ttl_management_active: boolean;
    stale_while_revalidate: boolean;
    no_fake_fallbacks: boolean;
  };
  issues?: TransparencyIssue[];
  freshnessPercent?: number;
  lastUpdated?: string;
  freshness?: Array<{ status: string }>;
}
