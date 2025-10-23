import axios, { AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  RiskScore, 
  RiskFactor, 
  EconomicIndicators, 
  Alert, 
  DashboardData,
  CacheMetrics,
  ApiHealth,
  RiskHistoryPoint
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-2-bz1u.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Generic API call handler
async function apiCall<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await api.get(endpoint);
    return response.data;
  } catch (error: any) {
    return {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Risk Intelligence API
export const riskApi = {
  // Get current risk score
  getCurrentRisk: () => apiCall<RiskScore>('/api/v1/risk/overview'),
  
  // Get real-time risk score
  getRealtimeRisk: () => apiCall<RiskScore>('/api/v1/risk/score/realtime'),
  
  // Get risk factors
  getRiskFactors: () => apiCall<{ factors: RiskFactor[] }>('/api/v1/risk/factors'),
  
  // Get risk history
  getRiskHistory: (days: number = 30) => 
    apiCall<{ scores: RiskHistoryPoint[] }>(`/api/v1/analytics/risk/history?days=${days}`),
};

// Economic Data API
export const economicApi = {
  // Get all economic indicators
  getIndicators: () => apiCall<EconomicIndicators>('/api/v1/economic/indicators'),
  
  // Get specific indicator
  getIndicator: (seriesId: string) => 
    apiCall<any>(`/api/v1/economic/indicators/${seriesId}`),
  
  // Get market indicators
  getMarketIndicators: () => apiCall<any>('/api/v1/economic/market'),
};

// Analytics API
export const analyticsApi = {
  // Get dashboard data
  getDashboard: () => apiCall<DashboardData>('/api/v1/analytics/dashboard'),
  
  // Get current risk analytics
  getCurrentRiskAnalytics: () => apiCall<RiskScore>('/api/v1/analytics/risk/current'),
  
  // Get risk factors analytics
  getFactorsAnalytics: (category?: string) => {
    const params = category ? `?category=${category}` : '';
    return apiCall<{ factors: RiskFactor[] }>(`/api/v1/analytics/factors${params}`);
  },
  
  // Get active alerts
  getAlerts: (severity?: string) => {
    const params = severity ? `?severity=${severity}` : '';
    return apiCall<{ alerts: Alert[] }>(`/api/v1/analytics/alerts${params}`);
  },
};

// External APIs
export const externalApi = {
  // FRED data
  getFredIndicators: () => apiCall<any>('/api/v1/external/fred/indicators'),
  getFredSeries: (seriesId: string) => apiCall<any>(`/api/v1/external/fred/${seriesId}`),
  
  // BEA data
  getBeaAccounts: () => apiCall<any>('/api/v1/external/bea/accounts'),
  
  // BLS data
  getBlsLabor: () => apiCall<any>('/api/v1/external/bls/labor'),
  
  // Census data
  getCensusPopulation: () => apiCall<any>('/api/v1/external/census/population'),
  
  // API health check
  getApiHealth: () => apiCall<{ overall_health: string; apis: ApiHealth }>('/api/v1/external/health'),
};

// Cache Management API
export const cacheApi = {
  // Get cache metrics
  getMetrics: () => apiCall<{ metrics: CacheMetrics }>('/api/v1/cache/metrics'),
  
  // Get cache status
  getStatus: () => apiCall<any>('/api/v1/cache/status'),
  
  // Get cache keys
  getKeys: (pattern: string = '*') => 
    apiCall<{ keys: string[]; count: number }>(`/api/v1/cache/keys?pattern=${pattern}`),
  
  // Warm cache
  warmCache: async () => {
    try {
      const response = await api.post('/api/v1/cache/warm');
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.response?.data?.message || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
  
  // Clear cache
  clearCache: async (pattern: string = '*') => {
    try {
      const response = await api.delete(`/api/v1/cache/clear?pattern=${pattern}`);
      return response.data;
    } catch (error: any) {
      return {
        status: 'error',
        message: error.response?.data?.message || error.message,
        timestamp: new Date().toISOString()
      };
    }
  },
};

// System Health API
export const systemApi = {
  // Get system health
  getHealth: () => apiCall<any>('/api/v1/health'),
  
  // Get system status
  getStatus: () => apiCall<any>('/api/v1/status'),
  
  // Get platform info
  getPlatformInfo: () => apiCall<any>('/api/v1/platform/info'),
};

// Helper functions
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isApiLoading = (response: ApiResponse<any>): boolean => {
  return response.status === 'loading';
};

export const isApiError = (response: ApiResponse<any>): boolean => {
  return response.status === 'error';
};

export const isApiSuccess = (response: ApiResponse<any>): boolean => {
  return response.status === 'success' && response.data !== undefined;
};

// Data refresh helper
export const refreshData = async <T>(
  apiCall: () => Promise<ApiResponse<T>>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall();
    
    if (isApiSuccess(response) && onSuccess && response.data) {
      onSuccess(response.data);
    } else if (isApiError(response) && onError) {
      onError(response.message || 'Unknown error');
    }
    
    return response;
  } catch (error: any) {
    const errorMessage = formatApiError(error);
    if (onError) {
      onError(errorMessage);
    }
    
    return {
      status: 'error',
      message: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
};