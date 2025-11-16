import { useMemo } from 'react';
import useSWR from 'swr';

export function useMemoizedApi<T>(
  key: string,
  fetcher: () => Promise<T>
) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000,
    dedupingInterval: 5000,
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
