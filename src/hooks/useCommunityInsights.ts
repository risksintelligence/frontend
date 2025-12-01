"use client";

import { useQuery } from "@tanstack/react-query";
import { getCommunityInsights } from "@/services/realTimeDataService";

export function useCommunityInsights() {
  return useQuery({
    queryKey: ["community-insights"],
    queryFn: getCommunityInsights,
    refetchInterval: 300_000, // 5 minutes - community data doesn't need frequent updates
    staleTime: 240_000, // 4 minutes
  });
}