"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransparencyDatasets } from "@/services/realTimeDataService";

export function useTransparencyDatasets() {
  return useQuery({
    queryKey: ["transparency-datasets"],
    queryFn: getTransparencyDatasets,
    refetchInterval: 300_000, // Refetch every 5 minutes
    staleTime: 240_000, // Consider stale after 4 minutes
  });
}