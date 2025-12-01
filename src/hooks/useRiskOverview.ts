"use client";

import { useQuery } from "@tanstack/react-query";
import { getRiskOverview } from "@/services/realTimeDataService";

export function useRiskOverview() {
  return useQuery({
    queryKey: ["risk-overview"],
    queryFn: getRiskOverview,
    refetchInterval: 30_000,
  });
}
