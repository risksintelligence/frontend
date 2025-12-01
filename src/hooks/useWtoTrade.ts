"use client";

import { useQuery } from "@tanstack/react-query";
import { getWtoTradeVolume } from "@/services/realTimeDataService";

export function useWtoTradeVolume() {
  return useQuery({
    queryKey: ["wto-trade-volume"],
    queryFn: getWtoTradeVolume,
    staleTime: 6 * 60_000,
  });
}
