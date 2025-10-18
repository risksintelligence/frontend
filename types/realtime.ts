/**
 * TypeScript interfaces for real-time WebSocket functionality
 * Based on backend WebSocket specifications in src/api/routes/websocket.py
 */

export interface WebSocketMessage {
  type: string;
  timestamp: string;
  data?: any;
  message?: string;
  source?: string;
  update_interval?: number;
}

export interface RealtimeRiskFactor {
  name: string;
  category: string;
  value: number;
  normalized_value: number;
  weight: number;
  description: string;
  confidence: number;
}

export interface RiskUpdateData {
  overall_score: number;
  risk_level: string;
  confidence: number;
  timestamp: string;
  methodology_version: string;
  factors: RealtimeRiskFactor[];
}

export interface RiskUpdateMessage extends WebSocketMessage {
  type: 'risk_update';
  data: RiskUpdateData;
  source: 'fred_economic_data';
}

export interface SystemMetrics {
  cpu_percent: number;
  memory_percent: number;
  disk_percent: number;
  load_avg?: number[];
}

export interface CachePerformance {
  hit_rate: number;
  total_requests: number;
  backend_status: string;
}

export interface ApplicationMetrics {
  uptime_seconds: number;
  requests_per_minute: number;
  error_rate: number;
}

export interface AnalyticsUpdateData {
  status: string;
  indicators_tracked: number;
  categories_analyzed: number;
  last_data_refresh: string;
  system_metrics: SystemMetrics;
  cache_performance: CachePerformance;
  application_metrics: ApplicationMetrics;
}

export interface AnalyticsUpdateMessage extends WebSocketMessage {
  type: 'analytics_update';
  data: AnalyticsUpdateData;
}

export interface ServiceHealth {
  cache_hit_rate: number;
  database_connected: boolean;
  monitoring_active: boolean;
}

export interface HealthUpdateData {
  api_status: string;
  cache_status: string;
  database_status: string;
  data_pipeline_status: string;
  active_connections: number;
  uptime_seconds: number;
  system_resources: SystemMetrics;
  service_health: ServiceHealth;
}

export interface HealthUpdateMessage extends WebSocketMessage {
  type: 'health_update';
  data: HealthUpdateData;
}

export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  message: string;
}

export type RealTimeMessage = RiskUpdateMessage | AnalyticsUpdateMessage | HealthUpdateMessage | ErrorMessage;

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  lastConnected?: string;
  lastError?: string;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface RealTimeRiskState {
  currentRisk: RiskUpdateData | null;
  history: RiskUpdateData[];
  lastUpdate: string | null;
  connectionState: ConnectionState;
  isSubscribed: boolean;
}

export interface RealTimeAnalyticsState {
  currentAnalytics: AnalyticsUpdateData | null;
  history: AnalyticsUpdateData[];
  lastUpdate: string | null;
  connectionState: ConnectionState;
  isSubscribed: boolean;
}

export interface RealTimeHealthState {
  currentHealth: HealthUpdateData | null;
  history: HealthUpdateData[];
  lastUpdate: string | null;
  connectionState: ConnectionState;
  isSubscribed: boolean;
}

export interface WebSocketConfig {
  reconnectAttempts?: number;
  reconnectInterval?: number;
  historyLimit?: number;
  enableLogging?: boolean;
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export interface RealTimeAlert {
  id: string;
  type: 'risk' | 'system' | 'data' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  source: string;
  data?: any;
  acknowledged?: boolean;
  actions?: Array<{
    label: string;
    action: string;
    style?: 'primary' | 'secondary' | 'danger';
  }>;
}

export interface RealTimeNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  autoHide?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface LiveDataPoint {
  timestamp: string;
  value: number;
  label?: string;
  metadata?: any;
}

export interface LiveChartData {
  series_id: string;
  name: string;
  color: string;
  data: LiveDataPoint[];
  max_points: number;
  update_frequency: number;
}

export interface RealTimeChart {
  id: string;
  title: string;
  type: 'line' | 'area' | 'bar';
  series: LiveChartData[];
  timeWindow: number; // minutes
  updateInterval: number; // seconds
  yAxis: {
    label: string;
    min?: number;
    max?: number;
    format?: string;
  };
  annotations?: Array<{
    timestamp: string;
    label: string;
    color: string;
  }>;
}

export interface WebSocketHookOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  historyLimit?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
  onMessage?: (message: RealTimeMessage) => void;
}

export interface RealTimeDataManager {
  subscribe: (endpoint: string, callback: (data: any) => void) => void;
  unsubscribe: (endpoint: string) => void;
  getConnectionStatus: (endpoint: string) => ConnectionState;
  forceReconnect: (endpoint: string) => void;
  getAllConnections: () => { [endpoint: string]: ConnectionState };
  addAlert: (alert: RealTimeAlert) => void;
  removeAlert: (alertId: string) => void;
  getActiveAlerts: () => RealTimeAlert[];
  addNotification: (notification: RealTimeNotification) => void;
  removeNotification: (notificationId: string) => void;
  getActiveNotifications: () => RealTimeNotification[];
}

export interface RealTimeMetrics {
  connections: {
    total: number;
    active: number;
    failed: number;
  };
  data_flow: {
    messages_received: number;
    messages_per_second: number;
    last_message_time: string | null;
  };
  performance: {
    avg_latency_ms: number;
    max_latency_ms: number;
    packet_loss_rate: number;
  };
  errors: {
    connection_errors: number;
    message_errors: number;
    last_error_time: string | null;
    last_error_message: string | null;
  };
}

export interface RealTimeStatus {
  overall_health: 'healthy' | 'degraded' | 'error';
  risk_stream: ConnectionState;
  analytics_stream: ConnectionState;
  health_stream: ConnectionState;
  metrics: RealTimeMetrics;
  uptime: number;
  last_health_check: string;
}