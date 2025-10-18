/**
 * Centralized API client for RiskX frontend
 * Provides consistent error handling, caching, and performance optimizations
 */

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;
  private requestCache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private defaultTtl: number = 5 * 60 * 1000; // 5 minutes default cache

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.requestCache = new Map();
  }

  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body || '';
    return `${method}:${url}:${body}`;
  }

  private isValidCacheEntry(entry: { data: any; timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = 30000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string, options: { 
    cache?: boolean; 
    cacheTtl?: number; 
    timeout?: number 
  } = {}): Promise<T> {
    const { cache = true, cacheTtl = this.defaultTtl, timeout = 30000 } = options;
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = this.getCacheKey(url);

    // Check cache first
    if (cache) {
      const cachedEntry = this.requestCache.get(cacheKey);
      if (cachedEntry && this.isValidCacheEntry(cachedEntry)) {
        return cachedEntry.data;
      }
    }

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }, timeout);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      const data = await response.json();

      // Cache successful response
      if (cache) {
        this.requestCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTtl,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error: Unable to connect to the server');
      }
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout: The server took too long to respond');
      }
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any, options: { timeout?: number } = {}): Promise<T> {
    const { timeout = 30000 } = options;
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      }, timeout);

      if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}: ${response.statusText}`, response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error: Unable to connect to the server');
      }
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout: The server took too long to respond');
      }
      throw error;
    }
  }

  clearCache(pattern?: string): void {
    if (pattern) {
      // Clear cache entries matching pattern
      for (const [key] of this.requestCache) {
        if (key.includes(pattern)) {
          this.requestCache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.requestCache.clear();
    }
  }

  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.requestCache.size,
      entries: Array.from(this.requestCache.keys()),
    };
  }
}

// Error class for API errors
class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// Create singleton instance
const getApiClient = (() => {
  let instance: ApiClient | null = null;
  
  return (baseUrl?: string): ApiClient => {
    const url = baseUrl || process.env.NEXT_PUBLIC_API_URL || 'https://backend-1-il1e.onrender.com';
    
    if (!instance || instance['baseUrl'] !== url) {
      instance = new ApiClient(url);
    }
    
    return instance;
  };
})();

export { ApiClient, ApiError, getApiClient };
export type { ApiResponse };