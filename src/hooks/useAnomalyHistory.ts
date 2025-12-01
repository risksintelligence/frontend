"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnomalyHistory } from "@/services/realTimeDataService";

export function useAnomalyHistory(days = 14) {
  return useQuery({
    queryKey: ["anomaly-history", days],
    queryFn: () => getAnomalyHistory(days),
    staleTime: 60_000,
  });
}
