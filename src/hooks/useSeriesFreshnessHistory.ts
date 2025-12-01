"use client";

import { useQuery } from "@tanstack/react-query";
import { getSeriesFreshnessHistory } from "@/services/realTimeDataService";

export function useSeriesFreshnessHistory(days = 14) {
  return useQuery({
    queryKey: ["series-freshness-history", days],
    queryFn: () => getSeriesFreshnessHistory(days),
    staleTime: 60_000,
  });
}
