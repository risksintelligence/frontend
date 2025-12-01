"use client";

import { useQuery } from "@tanstack/react-query";
import { getProviderHealthHistory } from "@/services/realTimeDataService";

export function useProviderHealthHistory(points = 8) {
  return useQuery({
    queryKey: ["provider-health-history", points],
    queryFn: () => getProviderHealthHistory(points),
    staleTime: 60_000,
  });
}
