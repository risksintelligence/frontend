"use client";

import { useQuery } from "@tanstack/react-query";
import { getMaritimeHealth } from "@/services/realTimeDataService";

export function useMaritimeHealth() {
  return useQuery({
    queryKey: ["maritime-health"],
    queryFn: () => getMaritimeHealth(),
    refetchInterval: 30 * 60 * 1000, // match maritime refresh cadence
  });
}
