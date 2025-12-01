"use client";

import { useQuery } from "@tanstack/react-query";
import { getForecastHistory } from "@/services/realTimeDataService";

export function useForecastHistory(days = 14) {
  return useQuery({
    queryKey: ["forecast-history", days],
    queryFn: () => getForecastHistory(days),
    staleTime: 60_000,
  });
}
