"use client";

import { useQuery } from "@tanstack/react-query";
import { getDataLineage } from "@/services/realTimeDataService";

export function useDataLineage(seriesId: string) {
  return useQuery({
    queryKey: ["data-lineage", seriesId],
    queryFn: () => getDataLineage(seriesId),
    refetchInterval: 60_000, // Refetch every minute
    enabled: !!seriesId,
  });
}