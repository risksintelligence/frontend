"use client";

import { useQuery } from "@tanstack/react-query";
import { getRasHistory } from "@/services/realTimeDataService";

export function useRasHistory(limit = 30) {
  return useQuery({
    queryKey: ["ras-history", limit],
    queryFn: () => getRasHistory(limit),
    refetchInterval: 120_000,
  });
}
