"use client";

import { useQuery } from "@tanstack/react-query";
import { getRasSummary } from "@/services/realTimeDataService";

export function useRasSummary() {
  return useQuery({
    queryKey: ["ras-summary"],
    queryFn: getRasSummary,
    refetchInterval: 120_000,
  });
}
