"use client";

import { useQuery } from "@tanstack/react-query";
import { getMissionHighlights } from "@/services/realTimeDataService";

export function useMissionHighlights() {
  return useQuery({
    queryKey: ["mission-highlights"],
    queryFn: getMissionHighlights,
    refetchInterval: 120_000,
  });
}
