/**
 * Optimized API hook with caching, retry logic, and performance optimizations
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { getApiClient, ApiError } from '../lib/api';

interface UseOptimizedApiOptions {
  retryAttempts?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTtl?: number;
  onError?: (error: ApiError) => void;
  onSuccess?: (data: any) => void;
}

interface UseOptimizedApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (endpoint: string, options?: any) => Promise<T>;
  retry: () => Promise<T>;
  clearError: () => void;
  clearCache: (pattern?: string) => void;
}

export function useOptimizedApi<T = any>(
  apiUrl?: string,
  options: UseOptimizedApiOptions = {}
): UseOptimizedApiResult<T> {
  const {
    retryAttempts = 3,
    retryDelay = 1000,
    cache = true,
    cacheTtl = 5 * 60 * 1000, // 5 minutes
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const apiClient = useRef(getApiClient(apiUrl));
  const lastEndpoint = useRef<string>('');
  const lastOptions = useRef<any>({});
  const abortController = useRef<AbortController | null>(null);

  // Update API client if URL changes
  useEffect(() => {
    if (apiUrl) {
      apiClient.current = getApiClient(apiUrl);
    }
  }, [apiUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCache = useCallback((pattern?: string) => {
    apiClient.current.clearCache(pattern);
  }, []);

  const executeWithRetry = useCallback(async (
    endpoint: string,
    executeOptions: any = {},
    attempt: number = 1
  ): Promise<T> => {
    try {
      // Cancel previous request if still pending
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      const result = await apiClient.current.get<T>(endpoint, {
        cache,
        cacheTtl,
        ...executeOptions,
      });

      setData(result);
      setError(null);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError ? err : new ApiError(err.message || 'Unknown error');
      
      // Retry logic for network errors and 5xx errors
      const shouldRetry = attempt < retryAttempts && (
        apiError.message.includes('Network error') ||
        apiError.message.includes('timeout') ||
        (apiError.status && apiError.status >= 500)
      );
      
      if (shouldRetry) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        return executeWithRetry(endpoint, executeOptions, attempt + 1);
      }
      
      setError(apiError.message);
      
      if (onError) {
        onError(apiError);
      }
      
      throw apiError;
    }
  }, [cache, cacheTtl, retryAttempts, retryDelay, onError, onSuccess]);

  const execute = useCallback(async (endpoint: string, executeOptions: any = {}): Promise<T> => {
    setLoading(true);
    setError(null);
    
    lastEndpoint.current = endpoint;
    lastOptions.current = executeOptions;
    
    try {
      const result = await executeWithRetry(endpoint, executeOptions);
      return result;
    } finally {
      setLoading(false);
    }
  }, [executeWithRetry]);

  const retry = useCallback(async (): Promise<T> => {
    if (!lastEndpoint.current) {
      throw new Error('No previous request to retry');
    }
    return execute(lastEndpoint.current, lastOptions.current);
  }, [execute]);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    clearError,
    clearCache,
  };
}

export default useOptimizedApi;