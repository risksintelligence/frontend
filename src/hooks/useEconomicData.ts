"use client";

import { useQuery } from "@tanstack/react-query";
import { getEconomicData } from "@/services/realTimeDataService";

export function useEconomicData() {
  return useQuery({
    queryKey: ["economic-data"],
    queryFn: getEconomicData,
    refetchInterval: 60_000,
  });
}
