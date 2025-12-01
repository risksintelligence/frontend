import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { rrio, useRRIOErrorHandler } from '@/lib/monitoring';
import { dataErrorHandler } from '@/lib/dataErrorHandler';

/**
 * Enhanced React Query hook with Bloomberg-grade error handling and monitoring
 */

interface EnhancedQueryConfig<T> extends Omit<UseQueryOptions<T>, 'queryFn' | 'queryKey'> {
  component: string;
  endpoint?: string;
  cacheKey: string | unknown[];
  enableFallback?: boolean;
  fallbackData?: T;
}

export function useEnhancedQuery<T>(
  queryFn: () => Promise<T>,
  config: EnhancedQueryConfig<T>
): UseQueryResult<T> & { isFromFallback: boolean } {
  const { component, endpoint, cacheKey, enableFallback, fallbackData, ...queryOptions } = config;
  const errorHandler = useRRIOErrorHandler(component);

  const result = useQuery({
    queryKey: Array.isArray(cacheKey) ? cacheKey : [cacheKey],
    queryFn: async (): Promise<T> => {
      const startTime = performance.now();
      const cacheKeyStr = Array.isArray(cacheKey) ? cacheKey.join(':') : String(cacheKey);
      
      try {
        // Track cache performance
        dataErrorHandler.trackCachePerformance(
          cacheKeyStr,
          false, // Assume miss since we're fetching
          component
        );

        // Execute the query function
        const data = await queryFn();
        
        // Track successful fetch
        const duration = performance.now() - startTime;
        errorHandler.trackPerformance(`Fetch ${cacheKeyStr}`, duration, {
          endpoint,
          action: 'successful_data_fetch'
        });

        return data;
        
      } catch (error) {
        const duration = performance.now() - startTime;
        
        // Log the error with context
        errorHandler.logError(error as Error, {
          endpoint,
          action: 'data_fetch_error',
          duration
        });

        // If fallback is enabled and available, use it
        if (enableFallback && fallbackData !== undefined) {
          rrio.trackUserAction('fallback_data_used', component, {
            cacheKey: cacheKeyStr,
            endpoint,
            error: (error as Error).message
          });

          return fallbackData;
        }

        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Custom retry logic based on error type
      const isRetryable = !error?.message?.includes('401') && 
                          !error?.message?.includes('403') && 
                          !error?.message?.includes('400');
      
      return isRetryable && failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    ...queryOptions
  });

  // Track cache hit/miss for React Query
  const wasFromCache = result.isSuccess && !result.isFetching && result.dataUpdatedAt > 0;
  if (wasFromCache) {
    const cacheKeyStr = Array.isArray(cacheKey) ? cacheKey.join(':') : String(cacheKey);
    dataErrorHandler.trackCachePerformance(cacheKeyStr, true, component);
  }

  // Track query errors and success with React Query v5 pattern
  if (result.isError && result.error) {
    errorHandler.logError(result.error as Error, {
      endpoint,
      action: 'react_query_error'
    });
  }

  if (result.isSuccess && result.data) {
    errorHandler.trackAction('data_loaded_successfully', {
      endpoint,
      cacheKey: Array.isArray(cacheKey) ? cacheKey.join(':') : String(cacheKey),
      dataSize: JSON.stringify(result.data).length
    });
  }

  return {
    ...result,
    isFromFallback: Boolean(enableFallback && result.isSuccess && result.data === fallbackData)
  };
}

/**
 * Hook specifically for backend API calls with standardized error handling
 */
export function useBackendQuery<T>(
  queryFn: () => Promise<T>,
  config: {
    endpoint: string;
    component: string;
    cacheKey: string | unknown[];
    enableRetry?: boolean;
    fallbackData?: T;
  } & Omit<UseQueryOptions<T>, 'queryFn' | 'queryKey'>
): UseQueryResult<T> & { isFromFallback: boolean } {
  const { endpoint, component, cacheKey, enableRetry = true, fallbackData, ...options } = config;

  return useEnhancedQuery(queryFn, {
    component,
    endpoint,
    cacheKey,
    enableFallback: fallbackData !== undefined,
    fallbackData,
    enabled: true,
    retry: enableRetry,
    ...options
  });
}

/**
 * Hook for critical data that should never fail completely
 */
export function useCriticalQuery<T>(
  queryFn: () => Promise<T>,
  fallbackData: T,
  config: {
    endpoint: string;
    component: string;
    cacheKey: string | unknown[];
  } & Omit<UseQueryOptions<T>, 'queryFn' | 'queryKey'>
): UseQueryResult<T> & { isFromFallback: boolean } {
  const { endpoint, component, cacheKey, ...options } = config;

  return useEnhancedQuery(queryFn, {
    component,
    endpoint,
    cacheKey,
    enableFallback: true,
    fallbackData,
    retry: 5, // More aggressive retry for critical data
    retryDelay: 1000,
    ...options
  });
}