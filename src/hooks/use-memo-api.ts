import { useMemo } from 'react';
import useSWR from 'swr';

export function useMemoizedApi<T>(
  key: string,
  fetcher: () => Promise<T>
) {
  return useSWR<T>(key, async () => {
    try {
      return await fetcher();
    } catch (error) {
      // Log error for debugging but don't fail the component
      console.warn(`API call failed for ${key}:`, error);
      
      // For critical endpoints, rethrow to trigger SWR error state
      if (key.includes('geri') || key.includes('ras')) {
        throw error;
      }
      
      // For non-critical endpoints, return null to allow graceful degradation
      return null as T;
    }
  }, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    // Fallback data for when the API is unavailable
    fallbackData: undefined,
  });
}

export function useMemoizedCompute<T, R>(
  data: T | undefined,
  computeFn: (data: T) => R
): R | undefined {
  return useMemo(() => {
    if (!data) return undefined;
    return computeFn(data);
  }, [data, computeFn]);
}
