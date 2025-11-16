import { useMemo } from 'react';
import useSWR from 'swr';

// Memoized API hook to prevent unnecessary re-renders
export function useMemoizedApi<T>(
  key: string,
  fetcher: () => Promise<T>,
  dependencies: any[] = []
) {
  const memoizedKey = useMemo(() => key, [key, ...dependencies]);
  const memoizedFetcher = useMemo(() => fetcher, [fetcher, ...dependencies]);
  
  return useSWR<T>(memoizedKey, memoizedFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // 30 seconds for live data
    dedupingInterval: 5000, // 5 seconds deduping
  });
}

// Optimized data transformation hook
export function useMemoizedCompute<T, R>(
  data: T | undefined,
  computeFn: (data: T) => R,
  dependencies: any[] = []
): R | undefined {
  return useMemo(() => {
    if (!data) return undefined;
    return computeFn(data);
  }, [data, computeFn, ...dependencies]);
}