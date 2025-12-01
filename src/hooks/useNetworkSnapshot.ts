"use client";

import { useQuery } from "@tanstack/react-query";
import { getNetworkSnapshot } from "@/services/realTimeDataService";

export function useNetworkSnapshot() {
  return useQuery({
    queryKey: ["network-snapshot"],
    queryFn: getNetworkSnapshot,
    refetchInterval: 60_000,
  });
}
